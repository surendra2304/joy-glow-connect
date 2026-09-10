import { useState } from "react";
import * as I from "./icons";
import { GModal } from "./grok";
import { CustomSelect } from "./CustomSelect";
import type { ConfiguredAction } from "../types/template";

export function ActionConfigurator({
  actions,
  setActions,
}: {
  actions: ConfiguredAction[];
  setActions: (actions: ConfiguredAction[]) => void;
}) {
  const [showAddActionModal, setShowAddActionModal] = useState(false);
  const [newActionType, setNewActionType] = useState<string>("GMAIL_SEND_WELCOME");
  const [newActionName, setNewActionName] = useState("");

  const handleAddAction = () => {
    if (!newActionName.trim()) return;
    const createdAction: ConfiguredAction = {
      id: `act_${Date.now()}`,
      name: newActionName.trim(),
      type: newActionType.includes('GMAIL') ? 'email' : newActionType.includes('SLACK') ? 'slack' : newActionType.includes('ZOHO') ? 'crm' : newActionType.includes('SMS') ? 'sms' : 'webhook',
      provider: newActionType.includes("GMAIL") ? "gmail" : newActionType.includes("SLACK") ? "slack" : newActionType.includes("ZOHO") ? "zoho" : "webhook",
      enabled: true,
      triggerEvent: "LEAD_CAPTURED",
      config: {
        webhookUrl: newActionType === "WEBHOOK" ? "https://api.yourdomain.com/v1/lead-event" : undefined,
        webhookMethod: "POST",
        subject: newActionType.includes("GMAIL") ? "Notification from KaliGan AI" : undefined,
        bodyTemplate: newActionType === "WEBHOOK" ? '{\n  "lead_name": "{{lead.name}}",\n  "lead_email": "{{lead.email}}",\n  "company": "{{lead.company}}"\n}' : "Action triggered for {{lead.name}}",
        channel: newActionType.includes("SLACK") ? "#general" : undefined,
        crmObject: newActionType.includes("ZOHO") ? "Deal & Contact" : undefined,
      },
    };
    setActions([...actions, createdAction]);
    setNewActionName("");
    setShowAddActionModal(false);
  };

  const handleRemoveAction = (id: string) => {
    setActions(actions.filter((a) => a.id !== id));
  };

  const handleUpdateActionConfig = (id: string, key: string, val: any) => {
    setActions(
      actions.map((a) => {
        if (a.id === id) {
          return {
            ...a,
            config: {
              ...a.config,
              [key]: val,
            },
          };
        }
        return a;
      })
    );
  };

  return (
    <div className="space-y-6 animate-fadeup">
      <div className="g-card p-6">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--g-border-light)]">
          <div>
            <h2 className="text-[17px] font-bold text-[var(--g-foreground)]">Configured Business Actions</h2>
            <p className="text-[12.5px] text-[var(--g-muted-foreground)] mt-0.5">
              Automated downstream actions triggered across your integrated tech stack.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowAddActionModal(true)}
            className="g-btn text-[12px] h-[30px] px-3 font-medium flex items-center gap-1 cursor-pointer shadow-xs"
          >
            <I.Plus width={12} height={12} /> Add Connector Action
          </button>
        </div>

        <div className="space-y-4">
          {actions.map((a) => (
            <div key={a.id} className="p-4 rounded-xl border border-[var(--g-border)] bg-[#ffffff] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-[var(--g-surface-2)] text-[var(--g-foreground)] border border-[var(--g-border-light)]">
                    <I.Bolt width={13} height={13} />
                  </span>
                  <span className="font-bold text-[14px] text-[var(--g-foreground)]">{a.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="g-mono text-[11px] px-2 py-0.5 rounded bg-[var(--g-surface-2)] text-[var(--g-muted-foreground)] uppercase">
                    {a.type}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveAction(a.id)}
                    className="text-[var(--g-muted-foreground)] hover:text-rose-600 p-1 cursor-pointer"
                  >
                    <I.X width={14} height={14} />
                  </button>
                </div>
              </div>

              {a.config.subject !== undefined && (
                <div>
                  <label className="block text-[11.5px] font-semibold text-[var(--g-muted-foreground)] mb-1">Subject Line</label>
                  <input
                    type="text"
                    value={a.config.subject || ""}
                    onChange={(e) => handleUpdateActionConfig(a.id, "subject", e.target.value)}
                    className="w-full text-[12.5px] px-3 py-1.5 rounded-lg border border-[var(--g-border)] bg-[#ffffff] outline-none"
                  />
                </div>
              )}

              {a.config.channel !== undefined && (
                <div>
                  <label className="block text-[11.5px] font-semibold text-[var(--g-muted-foreground)] mb-1">Slack Channel</label>
                  <input
                    type="text"
                    value={a.config.channel || ""}
                    onChange={(e) => handleUpdateActionConfig(a.id, "channel", e.target.value)}
                    className="w-full text-[12.5px] px-3 py-1.5 rounded-lg border border-[var(--g-border)] bg-[#ffffff] outline-none"
                  />
                </div>
              )}

              {a.config.bodyTemplate !== undefined && (
                <div>
                  <label className="block text-[11.5px] font-semibold text-[var(--g-muted-foreground)] mb-1">Payload / Template Body</label>
                  <textarea
                    rows={4}
                    value={a.config.bodyTemplate || ""}
                    onChange={(e) => handleUpdateActionConfig(a.id, "bodyTemplate", e.target.value)}
                    className="w-full text-[12px] px-3 py-2 rounded-lg border border-[var(--g-border)] bg-[#ffffff] font-mono outline-none"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <GModal
        open={showAddActionModal}
        onClose={() => setShowAddActionModal(false)}
        title="Add Business Action"
        icon={<I.Plug width={16} height={16} />}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-[12px] font-semibold text-[var(--g-foreground)] mb-1">Action Name</label>
            <input
              type="text"
              placeholder="e.g. Sync Deal to Salesforce"
              value={newActionName}
              onChange={(e) => setNewActionName(e.target.value)}
              className="w-full text-[13px] px-3.5 py-2 rounded-xl border border-[var(--g-border)] bg-[#ffffff] outline-none"
            />
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-[var(--g-foreground)] mb-1">Action Provider</label>
            <CustomSelect
              value={newActionType}
              onChange={(val: any) => setNewActionType(val)}
              options={[
                { label: "Gmail (Send Automated Email)", value: "email" },
                { label: "Slack (Post Channel Alert)", value: "slack" },
                { label: "CRM (Create Contact & Opportunity)", value: "crm" },
                { label: "Webhook (Dispatch JSON Payload)", value: "webhook" },
              ]}
            />
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-[var(--g-border-light)] flex justify-end gap-2.5">
          <button
            type="button"
            onClick={() => setShowAddActionModal(false)}
            className="g-btn-2 text-[13px] h-[36px] px-4 font-semibold cursor-pointer shadow-xs"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleAddAction}
            disabled={!newActionName.trim()}
            className="g-btn text-[13px] h-[36px] px-4 font-semibold cursor-pointer disabled:opacity-40 shadow-xs"
          >
            Confirm &amp; Add Action
          </button>
        </div>
      </GModal>
    </div>
  );
}

