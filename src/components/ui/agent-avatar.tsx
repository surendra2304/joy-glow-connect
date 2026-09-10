import { 
  Bot, 
  Headphones, 
  PhoneCall, 
  Sparkles, 
  Stethoscope, 
  Calendar, 
  ShieldCheck, 
  Receipt, 
  BarChart3, 
  Mail, 
  UserCheck
} from "lucide-react";
import { cn } from "../../lib/utils";

interface AgentAvatarProps {
  name: string;
  kind?: string;
  role?: string;
  category?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function AgentAvatar({
  name = "",
  kind = "chat",
  role = "",
  category = "",
  className,
  size = "md",
}: AgentAvatarProps) {
  const lowerName = name.toLowerCase();
  const lowerRole = (role || "").toLowerCase();
  const lowerCat = (category || "").toLowerCase();
  const isVoice = kind === "voice";
  const isHybrid = kind === "hybrid" || kind === "omnichannel";

  // Select appropriate icon based on persona and domain
  const getIcon = () => {
    if (lowerName.includes("receiptnest") || lowerRole.includes("appointment") || lowerRole.includes("doctor") || lowerCat.includes("healthcare")) {
      return <Stethoscope className="w-1/2 h-1/2 text-blue-600" />;
    }
    if (lowerRole.includes("booking") || lowerRole.includes("schedule") || lowerCat.includes("schedule")) {
      return <Calendar className="w-1/2 h-1/2 text-indigo-600" />;
    }
    if (lowerRole.includes("support") || lowerRole.includes("service") || lowerRole.includes("help") || lowerCat.includes("support")) {
      return <Headphones className="w-1/2 h-1/2 text-emerald-600" />;
    }
    if (lowerRole.includes("sales") || lowerRole.includes("lead") || lowerRole.includes("qualification") || lowerCat.includes("sales")) {
      return <UserCheck className="w-1/2 h-1/2 text-amber-600" />;
    }
    if (lowerRole.includes("security") || lowerRole.includes("guardrail") || lowerRole.includes("compliance")) {
      return <ShieldCheck className="w-1/2 h-1/2 text-rose-600" />;
    }
    if (lowerRole.includes("billing") || lowerRole.includes("invoice") || lowerRole.includes("finance")) {
      return <Receipt className="w-1/2 h-1/2 text-emerald-700" />;
    }
    if (lowerRole.includes("analytics") || lowerRole.includes("metric") || lowerRole.includes("data")) {
      return <BarChart3 className="w-1/2 h-1/2 text-cyan-600" />;
    }
    if (lowerRole.includes("email") || lowerRole.includes("follow-up")) {
      return <Mail className="w-1/2 h-1/2 text-sky-600" />;
    }
    if (isHybrid) {
      return <Sparkles className="w-1/2 h-1/2 text-purple-600" />;
    }
    if (isVoice) {
      return <PhoneCall className="w-1/2 h-1/2 text-amber-600" />;
    }
    return <Bot className="w-1/2 h-1/2 text-slate-700" />;
  };

  const getBgStyle = () => {
    if (lowerName.includes("receiptnest") || lowerCat.includes("healthcare")) return "bg-blue-50 border-blue-100";
    if (lowerRole.includes("support") || lowerCat.includes("support")) return "bg-emerald-50 border-emerald-100";
    if (lowerRole.includes("sales") || lowerCat.includes("sales")) return "bg-amber-50 border-amber-100";
    if (isHybrid) return "bg-purple-50 border-purple-100";
    if (isVoice) return "bg-amber-50 border-amber-100";
    return "bg-slate-100 border-slate-200";
  };

  const sizeStyles = {
    sm: "w-8 h-8 rounded-lg",
    md: "w-10 h-10 rounded-xl",
    lg: "w-12 h-12 rounded-2xl",
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center border shadow-2xs shrink-0 transition-transform",
        sizeStyles[size],
        getBgStyle(),
        className
      )}
    >
      {getIcon()}
    </div>
  );
}
