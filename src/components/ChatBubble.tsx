import * as I from "./icons";

interface ChatBubbleProps {
  role: "visitor" | "agent";
  content: string;
}

/**
 * Reusable chat message bubble.
 * Visitor messages are right-aligned with dark bg, agent messages are left-aligned with light bg + bot avatar.
 * Extracted from TemplateEditor, TemplateFlow, EmployeeTabs, VoiceAgentBuilder, and Calls.
 */
export function ChatBubble({ role, content }: ChatBubbleProps) {
  return (
    <div className={`flex gap-3 text-[13px] ${role === "visitor" ? "justify-end" : "justify-start"}`}>
      {role === "agent" && (
        <div className="w-7 h-7 rounded-full bg-[var(--g-foreground)] text-[var(--g-background)] text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
          <I.Bot width={13} height={13} />
        </div>
      )}
      <div
        className={`p-3.5 rounded-2xl max-w-md leading-relaxed ${
          role === "visitor"
            ? "bg-[var(--g-foreground)] text-[var(--g-background)] rounded-br-xs"
            : "bg-[var(--g-surface-2)] text-[var(--g-foreground)] border border-[var(--g-border-light)] rounded-bl-xs"
        }`}
      >
        {content}
      </div>
    </div>
  );
}

interface MessageThreadProps {
  messages: { role: "visitor" | "agent"; content: string }[];
}

/**
 * Renders a list of chat bubbles.
 */
export function MessageThread({ messages }: MessageThreadProps) {
  return (
    <>
      {messages.map((msg, idx) => (
        <ChatBubble key={idx} role={msg.role} content={msg.content} />
      ))}
    </>
  );
}

/**
 * 3-dot bounce typing indicator animation.
 * Extracted from TemplateEditor and TemplateFlow where it was duplicated.
 */
export function TypingIndicator({ text }: { text?: string }) {
  return (
    <div className="flex gap-2 text-[12px] text-[var(--g-muted-foreground)] items-center">
      <span className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce" />
      <span className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce [animation-delay:0.2s]" />
      <span className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce [animation-delay:0.4s]" />
      {text && <span className="ml-1 text-[11px]">{text}</span>}
    </div>
  );
}
