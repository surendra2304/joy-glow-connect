import * as I from "./icons";

interface DeployButtonProps {
  deploying: boolean;
  deploySuccess: boolean;
  onClick: () => void;
  /** Label shown in default state */
  label?: string;
  /** Label shown while deploying */
  deployingLabel?: string;
  /** Label shown after success */
  successLabel?: string;
  className?: string;
  disabled?: boolean;
}

/**
 * Reusable deploy button with three states: default, deploying (spinner), success (checkmark).
 * Extracted from TemplateEditor.tsx and TemplateFlow.tsx where this pattern was duplicated 5+ times.
 */
export function DeployButton({
  deploying,
  deploySuccess,
  onClick,
  label = "Deploy AI Employee",
  deployingLabel = "Deploying…",
  successLabel = "Deployed!",
  className = "g-btn",
  disabled = false,
}: DeployButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={deploying || deploySuccess || disabled}
      className={className}
    >
      {deploying ? (
        <>
          <span className="w-3.5 h-3.5 border-2 border-[#ffffff] border-t-transparent rounded-full animate-spin" />
          <span>{deployingLabel}</span>
        </>
      ) : deploySuccess ? (
        <>
          <I.Check width={14} height={14} className="text-[#ffffff]" />
          <span>{successLabel}</span>
        </>
      ) : (
        <>
          <I.Bot width={14} height={14} />
          <span>{label}</span>
          <I.ArrowRight width={12} height={12} />
        </>
      )}
    </button>
  );
}
