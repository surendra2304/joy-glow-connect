import { useNavigate } from "@tanstack/react-router";
import * as I from "./icons";

interface CreateAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CreationOption {
  id: "marketplace" | "studio";
  title: string;
  badge: string;
  isRecommended?: boolean;
  description: string;
  iconBg: string;
  iconColor: string;
  features: string[];
  ctaText: string;
  route: string;
}

const CREATION_OPTIONS: CreationOption[] = [
  {
    id: "marketplace",
    title: "Browse Agent Marketplace",
    badge: "48 Verified Archetypes",
    isRecommended: true,
    description: "Deploy battle-tested, industry-specific AI employees for Sales, Support, Voice Telephony, and Retention with 1-click CRM bindings.",
    iconBg: "bg-[#F8FAFC]",
    iconColor: "text-[#09090B]",
    features: [
      "Instant 1-click workforce deployment",
      "Pre-tuned domain prompts & goal policies",
      "Pre-connected Salesforce, HubSpot & Zendesk",
    ],
    ctaText: "Explore Marketplace",
    route: "/app/templates",
  },
  {
    id: "studio",
    title: "Custom Builder in Agent Studio",
    badge: "Architect v2",
    description: "Build custom autonomous employees from scratch with multi-step tool chaining, vector knowledge grounding, and live interactive sandbox testing.",
    iconBg: "bg-[#F8FAFC]",
    iconColor: "text-[#09090B]",
    features: [
      "AI Architect Co-Pilot natural-language synthesis",
      "Live sandbox with tool execution & reasoning telemetry",
      "Sub-400ms Voice, Chat, and Hybrid orchestration",
    ],
    ctaText: "Launch Agent Studio",
    route: "/app/studio",
  },
];

export function CreateAgentModal({ isOpen, onClose }: CreateAgentModalProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSelect = (route: string) => {
    onClose();
    navigate(route);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadein"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl bg-white border border-[#E2E8F0] rounded-2xl shadow-2xl overflow-hidden animate-scalein"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] bg-[#FAFAFA]">
          <div>
            <h2 className="text-[16px] font-bold text-[#09090B] tracking-tight">
              Create AI Employee
            </h2>
            <p className="text-[12px] text-[#64748B] mt-0.5">
              Choose your creation method to add an autonomous employee to your workforce.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#64748B] hover:text-[#09090B] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <I.Close width={15} height={15} />
          </button>
        </div>

        {/* 2-Option Card Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {CREATION_OPTIONS.map((option) => (
            <div
              key={option.id}
              onClick={() => handleSelect(option.route)}
              className="group flex flex-col justify-between p-5 rounded-xl border border-[#E2E8F0] bg-white hover:border-[#09090B] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-all cursor-pointer text-left relative"
            >
              <div>
                {/* Top Icon & Badge */}
                <div className="flex items-center justify-between mb-3.5">
                  <div className={`w-10 h-10 rounded-lg ${option.iconBg} border border-[#E2E8F0] flex items-center justify-center ${option.iconColor} group-hover:bg-[#09090B] group-hover:text-white transition-colors`}>
                    {option.id === "marketplace" ? (
                      <I.Grid width={19} height={19} />
                    ) : (
                      <I.Bolt width={19} height={19} />
                    )}
                  </div>
                  {option.isRecommended ? (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#09090B] text-white">
                      Recommended
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]">
                      {option.badge}
                    </span>
                  )}
                </div>

                {/* Title & Description */}
                <h3 className="text-[14.5px] font-bold text-[#09090B] group-hover:text-[#09090B] transition-colors">
                  {option.title}
                </h3>
                <p className="text-[12px] text-[#64748B] mt-1.5 leading-relaxed">
                  {option.description}
                </p>

                {/* Key Highlights */}
                <ul className="mt-3.5 space-y-1.5 pt-3 border-t border-[#F1F5F9]">
                  {option.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-[11.5px] text-[#475569]">
                      <span className="text-[#09090B] mt-0.5">✓</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottom CTA */}
              <div className="mt-5 pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-[12.5px] font-semibold text-[#09090B] group-hover:translate-x-0.5 transition-transform">
                <span>{option.ctaText}</span>
                <I.ArrowRight width={14} height={14} />
              </div>
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 border-t border-[#E2E8F0] bg-[#FAFAFA] flex items-center justify-between text-[11.5px] text-[#64748B]">
          <span>Both paths deploy directly to your active enterprise workforce.</span>
          <button
            onClick={onClose}
            className="font-medium text-[#64748B] hover:text-[#09090B] cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
