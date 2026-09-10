import type { ActionRun } from "../data/mockActionRuns";
import * as I from "./icons";
import { renderConnectorIcon } from "./renderConnectorIcon";

interface ActionPayloadModalProps {
  run: ActionRun | null;
  onClose: () => void;
}

export function ActionPayloadModal({ run, onClose }: ActionPayloadModalProps) {
  if (!run) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadein">
      <div 
        className="relative w-full max-w-2xl bg-[var(--g-surface)] border border-[var(--g-border)] rounded-[var(--g-radius-xl)] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--g-border-light)] bg-[var(--g-surface)]">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[var(--g-secondary)] border border-[var(--g-border)]">
              {renderConnectorIcon(run.tool)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-[15px] text-[var(--g-foreground)]">{run.toolName} · {run.actionType}</h3>
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider ${
                  run.status === "success" ? "bg-emerald-50 text-emerald-600 border border-emerald-200" :
                  run.status === "pending" ? "bg-amber-50 text-amber-600 border border-amber-200" :
                  "bg-rose-50 text-rose-600 border border-rose-200"
                }`}>
                  {run.status}
                </span>
              </div>
              <p className="text-[12px] text-[var(--g-muted-foreground)]">Execution ID: <span className="font-mono text-[11.5px]">{run.id}</span> · Latency: {run.durationMs}ms</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--g-muted-foreground)] hover:text-[var(--g-foreground)] hover:bg-[var(--g-secondary)] transition-colors"
          >
            <I.Close width={16} height={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 g-no-scrollbar">
          {/* Trigger Context */}
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--g-muted-foreground)] mb-1.5">Triggering Conversation Context</div>
            <div className="p-3 rounded-lg bg-[var(--g-secondary)] text-[13px] text-[var(--g-foreground)] border border-[var(--g-border-light)] leading-relaxed italic">
              "{run.triggerContext}"
            </div>
          </div>

          {/* Input Parameters */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--g-muted-foreground)]">Input Parameters Sent to API</span>
              <span className="text-[11px] text-[var(--g-muted-foreground)] font-mono">application/json</span>
            </div>
            <pre className="p-3.5 rounded-lg bg-[#18181b] text-[#f4f4f5] font-mono text-[12px] overflow-x-auto leading-relaxed border border-[#27272a]">
              {JSON.stringify(run.inputPayload, null, 2)}
            </pre>
          </div>

          {/* Response Payload */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--g-muted-foreground)]">API Response Payload</span>
              <span className="text-[11px] text-emerald-500 font-mono">HTTP 200 OK</span>
            </div>
            <pre className="p-3.5 rounded-lg bg-[#18181b] text-[#a7f3d0] font-mono text-[12px] overflow-x-auto leading-relaxed border border-[#27272a]">
              {JSON.stringify(run.outputPayload, null, 2)}
            </pre>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-[var(--g-border-light)] bg-[var(--g-secondary)]">
          <span className="text-[12px] text-[var(--g-muted-foreground)]">Logged at {new Date(run.timestamp).toLocaleString()}</span>
          <button 
            onClick={onClose}
            className="g-btn-2 text-xs py-1.5 px-4"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
