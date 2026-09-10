import { useState, useEffect, useCallback } from "react";
import { api } from "../lib/api";
import { getCached, setCached } from "../lib/cache";

import type { Agent } from "../types/agent";
import type { Conversation } from "../types/conversation";
import type { Call } from "../types/call";
import type { Lead } from "../types/lead";

export function useEmployeeDetail(id: string | undefined) {
  const [agent, setAgent] = useState<Agent | null>(null);
  const [documents, setDocuments] = useState<Record<string, unknown>[]>([]);
  const [versions, setVersions] = useState<Record<string, unknown>[]>([]);
  const [stats, setStats] = useState<{ convos: number; calls: number; leads: number; hotLeads: number }>({
    convos: 0,
    calls: 0,
    leads: 0,
    hotLeads: 0,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    if (!id) return;
    setError(null);
    try {
      const a = await api.get(`/agents/${id}`);
      setAgent(a);

      const [docs, vers, convs, cls, lds] = await Promise.allSettled([
        api.get("/kb/documents"),
        api.get(`/agents/${id}/versions`),
        api.get(`/conversations?agentId=${id}`),
        api.get(`/telephony/calls?agentId=${id}`),
        api.get(`/leads?agentId=${id}`),
      ]);

      if (docs.status === "fulfilled" && Array.isArray(docs.value)) {
        setDocuments(docs.value);
      }
      if (vers.status === "fulfilled" && Array.isArray(vers.value)) {
        setVersions(vers.value);
      }

      const filteredConvs = (convs.status === "fulfilled" && Array.isArray(convs.value) ? convs.value : []).filter((c: Conversation) => c.agentId === id);
      const filteredCalls = (cls.status === "fulfilled" && Array.isArray(cls.value) ? cls.value : []).filter((c: Call) => c.agentId === id);
      const filteredLeads = (lds.status === "fulfilled" && Array.isArray(lds.value) ? lds.value : []).filter((l: Lead) => l.agentId === id || l.conversation?.agentId === id);

      setCached(`agent_convos_${id}`, filteredConvs);
      setCached(`agent_calls_${id}`, filteredCalls);
      setCached(`agent_leads_${id}`, filteredLeads);

      setStats({
        convos: filteredConvs.length,
        calls: filteredCalls.length,
        leads: filteredLeads.length,
        hotLeads: filteredLeads.filter((l: Lead) => l.score === "Hot").length,
      });
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || "Failed to load employee");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const cachedAgent = getCached(`agent_${id}`) as Agent | undefined;
    if (cachedAgent) {
      setAgent(cachedAgent);
    } else {
      setAgent(null);
      setLoading(true);
    }
    const cachedConvos = (getCached(`agent_convos_${id}`) as Conversation[]) || [];
    const cachedCalls = (getCached(`agent_calls_${id}`) as Call[]) || [];
    const cachedLeads = (getCached(`agent_leads_${id}`) as Lead[]) || [];
    setStats({
      convos: cachedConvos.length,
      calls: cachedCalls.length,
      leads: cachedLeads.length,
      hotLeads: cachedLeads.filter((l: Lead) => l.score === "Hot").length,
    });
    fetchAll();
  }, [id, fetchAll]);

  const flash = (m: string) => { setNotice(m); setTimeout(() => setNotice(null), 2500); };

  const updateField = (key: keyof Agent, val: unknown) =>
    setAgent((prev: Agent | null) => (prev ? { ...prev, [key]: val } as Agent : prev));

  const saveFields = async (): Promise<boolean> => {
    if (!agent || !id) return false;
    setSaving(true);
    setError(null);
    try {
      const payload: Partial<Agent> = {
        name: agent.name,
        persona: agent.persona,
        greeting: agent.greeting,
        goal: agent.goal,
        channels: agent.channels,
        connectedKbDocumentIds: agent.connectedKbDocumentIds,
        captureFields: agent.captureFields,
      };
      if (agent.kind === "voice") {
        payload.voiceName = agent.voiceName;
        payload.language = agent.language;
        payload.speakingSpeed = agent.speakingSpeed;
      }
      const updated = await api.patch(`/agents/${agent.id}`, payload);
      setAgent(updated);
      setCached(`agent_${id}`, updated);
      return true;
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || "Failed to save");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    if (await saveFields()) flash("Saved");
  };

  const handleRemoveAction = async (actionId: string) => {
    if (!id || !agent) return;
    if (!confirm("Are you sure you want to remove this template integration?")) return;
    try {
      await api.delete(`/agents/${id}/actions/${actionId}`);
      setAgent({ ...agent, employeeActions: agent.employeeActions?.filter((a: Record<string, unknown>) => a.id !== actionId) });
    } catch (e) {
      console.error(e);
      alert("Failed to remove action");
    }
  };

  const handleConfigureAction = async (action: Record<string, unknown>) => {
    if (!id) return;
    const newVal = prompt("Enter new configuration (JSON):", JSON.stringify(action.configuration || {}));
    if (newVal === null) return;
    try {
      let parsed = {};
      if (newVal.trim()) parsed = JSON.parse(newVal);
      await api.post(`/agents/${id}/actions/toggle`, {
        integrationId: action.integrationId,
        actionType: action.actionType,
        enabled: action.enabled,
        configuration: parsed
      });
      fetchAll();
    } catch (e) {
      console.error(e);
      alert("Failed to update configuration. Make sure it is valid JSON.");
    }
  };

  const toggleStatus = async () => {
    if (!agent || !id) return;
    setSaving(true);
    try {
      let updated;
      if (agent.status === "live") {
        updated = await api.patch(`/agents/${agent.id}`, { status: "draft" });
        flash("Paused");
      } else {
        await saveFields();
        updated = await api.post(`/agents/${agent.id}/publish`);
        const vers = await api.get(`/agents/${id}/versions`).catch(() => []);
        setVersions(Array.isArray(vers) ? vers : []);
        flash("Live");
      }
      setAgent(updated);
      setCached(`agent_${id}`, updated);
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || "Failed to update status");
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!agent || !id) return;
    setSaving(true);
    try {
      await saveFields();
      const updated = await api.post(`/agents/${agent.id}/publish`);
      setAgent(updated);
      setCached(`agent_${id}`, updated);
      const vers = await api.get(`/agents/${id}/versions`).catch(() => []);
      setVersions(Array.isArray(vers) ? vers : []);
      flash("Published");
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || "Failed to publish");
    } finally {
      setSaving(false);
    }
  };

  const handleRollback = async (versionId: string) => {
    if (!agent || !id) return;
    setSaving(true);
    try {
      const updated = await api.post(`/agents/${agent.id}/rollback`, { versionId });
      setAgent(updated);
      setCached(`agent_${id}`, updated);
      flash("Rolled back");
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || "Failed to roll back");
    } finally {
      setSaving(false);
    }
  };

  const toggleDoc = (docId: string) => {
    if (!agent) return;
    const current = Array.isArray(agent.connectedKbDocumentIds) ? agent.connectedKbDocumentIds : (
      typeof agent.connectedKbDocumentIds === "string" ? JSON.parse(agent.connectedKbDocumentIds) : []
    );
    updateField("connectedKbDocumentIds",
      current.includes(docId) ? current.filter((x: string) => x !== docId) : [...current, docId]);
  };

  return {
    agent,
    documents,
    versions,
    stats,
    loading,
    saving,
    notice,
    error,
    fetchAll,
    updateField,
    handleSave,
    handleRemoveAction,
    handleConfigureAction,
    toggleStatus,
    handlePublish,
    handleRollback,
    toggleDoc
  };
}
