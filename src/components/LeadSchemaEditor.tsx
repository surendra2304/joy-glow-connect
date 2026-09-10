import { useState } from "react";
import * as I from "./icons";
import type { LeadFieldDef } from "../types/template";

export function LeadSchemaEditor({
  leadFields,
  setLeadFields,
}: {
  leadFields: LeadFieldDef[];
  setLeadFields: (fields: LeadFieldDef[]) => void;
}) {
  const [newFieldLabel, setNewFieldLabel] = useState("");
  const [newFieldKey, setNewFieldKey] = useState("");
  const [showAddField, setShowAddField] = useState(false);

  const handleAddCustomField = () => {
    if (!newFieldLabel.trim()) return;
    const generatedKey = newFieldKey.trim() || newFieldLabel.toLowerCase().replace(/[^a-z0-9]/g, "_");
    const newField: LeadFieldDef = {
      id: `f_${Date.now()}`,
      label: newFieldLabel.trim(),
      key: generatedKey,
      type: "text",
      required: false,
      enabled: true,
    };
    setLeadFields([...leadFields, newField]);
    setNewFieldLabel("");
    setNewFieldKey("");
    setShowAddField(false);
  };

  const handleRemoveField = (id: string) => {
    setLeadFields(leadFields.filter((f) => f.id !== id));
  };

  const handleToggleField = (id: string) => {
    setLeadFields(
      leadFields.map((f) => (f.id === id ? { ...f, enabled: !f.enabled } : f))
    );
  };

  return (
    <div className="space-y-6 animate-fadeup">
      <div className="g-card p-6">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--g-border-light)]">
          <div>
            <h2 className="text-[17px] font-bold text-[var(--g-foreground)]">Lead Capture Schema</h2>
            <p className="text-[12.5px] text-[var(--g-muted-foreground)] mt-0.5">
              Define what structured properties this employee extracts from buyer conversations.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowAddField(true)}
            className="g-btn text-[12px] h-[30px] px-3 font-medium flex items-center gap-1 cursor-pointer shadow-xs"
          >
            <I.Plus width={12} height={12} /> Add Field
          </button>
        </div>

        <div className="space-y-2.5">
          {leadFields.map((f) => {
            const fieldId = f.id || f.key;
            return (
              <div
                key={fieldId}
                className="flex items-center justify-between p-3.5 rounded-xl border border-[var(--g-border)] bg-[#ffffff] hover:bg-[var(--g-surface)]/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={f.enabled}
                    onChange={() => handleToggleField(fieldId)}
                    className="w-4 h-4 accent-[var(--g-foreground)] rounded"
                  />
                  <div>
                    <span className="text-[13px] font-semibold text-[var(--g-foreground)] mr-2">{f.label}</span>
                    <span className="font-mono text-[11px] text-[var(--g-muted-foreground)] bg-[var(--g-surface-2)] px-2 py-0.5 rounded">
                      &#123;&#123;lead.{f.key}&#125;&#125;
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {f.required && (
                    <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                      Required
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveField(fieldId)}
                    className="text-[var(--g-muted-foreground)] hover:text-rose-600 p-1 cursor-pointer"
                  >
                    <I.X width={14} height={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {showAddField && (
          <div className="mt-4 p-4 rounded-xl border border-[var(--g-border)] bg-[var(--g-surface-2)] animate-fadeup space-y-3">
            <h4 className="font-bold text-[13.5px] text-[var(--g-foreground)]">Add Custom Extraction Field</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Field Label (e.g. Current Headcount)"
                value={newFieldLabel}
                onChange={(e) => setNewFieldLabel(e.target.value)}
                className="text-[13px] px-3.5 py-2 rounded-xl border border-[var(--g-border)] bg-[#ffffff] outline-none"
              />
              <input
                type="text"
                placeholder="Schema Key (e.g. headcount)"
                value={newFieldKey}
                onChange={(e) => setNewFieldKey(e.target.value)}
                className="text-[13px] px-3.5 py-2 rounded-xl border border-[var(--g-border)] bg-[#ffffff] outline-none"
              />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button type="button" onClick={() => setShowAddField(false)} className="g-btn-2 text-[12px] h-[30px] px-3 font-medium">
                Cancel
              </button>
              <button type="button" onClick={handleAddCustomField} className="g-btn text-[12px] h-[30px] px-3 font-medium">
                Save Field
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
