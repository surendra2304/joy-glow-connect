import { useState } from "react";

interface MockMessage {
  role: "visitor" | "agent";
  content: string;
}

interface UseMockChatOptions {
  /** Initial greeting message from the agent */
  initialGreeting: string;
  /** Role/title of the agent for default replies */
  agentRole?: string;
}

/**
 * Custom hook encapsulating mock chat simulation logic.
 * Extracted from TemplateEditor.tsx (handleSendTestMessage) and TemplateFlow.tsx (handleSendMessage)
 * where nearly identical setTimeout-based mock reply logic was duplicated.
 */
export function useMockChat({ initialGreeting, agentRole = "Specialist" }: UseMockChatOptions) {
  const [messages, setMessages] = useState<MockMessage[]>([
    { role: "agent", content: initialGreeting },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const resetChat = () => {
    setMessages([{ role: "agent", content: initialGreeting }]);
    setInput("");
    setIsTyping(false);
  };

  const sendMessage = (customText?: string) => {
    const text = (customText || input).trim();
    if (!text || isTyping) return;

    const newMsgs: MockMessage[] = [...messages, { role: "visitor", content: text }];
    setMessages(newMsgs);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const lower = text.toLowerCase();
      let reply: string;

      if (lower.includes("price") || lower.includes("pricing") || lower.includes("cost") || lower.includes("tier") || lower.includes("budget") || lower.includes("plan")) {
        reply = `Our Growth plan begins at $499/mo with full CRM synchronization and automated voice dispatch. Would you like me to map your expected monthly lead volume?`;
      } else if (lower.includes("crm") || lower.includes("hubspot") || lower.includes("salesforce")) {
        reply = `I will automatically create and update Contact and Deal records in your CRM with full conversational summaries and sentiment scores.`;
      } else if (lower.includes("demo") || lower.includes("schedule") || lower.includes("call") || lower.includes("book")) {
        reply = `I can schedule a live 20-minute technical demonstration for your team this week. Which day and time works best for you?`;
      } else if (lower.includes("voice") || lower.includes("phone")) {
        reply = `Our voice employees operate with sub-350ms latency across 32 languages, supporting both browser WebRTC and dedicated phone numbers.`;
      } else {
        reply = `Understood! Based on my instructions as ${agentRole}, I will capture this in your pipeline. Let me know your best email or phone number to proceed.`;
      }

      setMessages([...newMsgs, { role: "agent", content: reply }]);
      setIsTyping(false);
    }, 550);
  };

  return {
    messages,
    input,
    setInput,
    isTyping,
    sendMessage,
    resetChat,
    setMessages,
  };
}
