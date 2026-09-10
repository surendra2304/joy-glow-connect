import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Check, Sparkle } from "./icons";
import { createPortal } from "react-dom";
import { Link } from "@tanstack/react-router";
import { motion, useSpring, useTransform } from "framer-motion";

/* ============================================================
   Grok (x.ai) light workspace primitives — soft neutrals,
   large radii, pill controls, Inter type, subtle motion.
   Used by every /app page; marketing pages keep the green brand.
   ============================================================ */

const easeOut = [0.2, 0.7, 0.3, 1] as const;

function AnimatedNumber({ value }: { value: number }) {
  const spring = useSpring(0, { stiffness: 140, damping: 22 });
  const display = useTransform(spring, (v: number) => Math.round(v).toLocaleString());
  useEffect(() => {
    spring.set(value);
  }, [value, spring]);
  return <motion.span>{display}</motion.span>;
}

export function GPageHeader({ eyebrow, title, description, actions }: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <motion.div
      className="mb-8"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: easeOut }}
    >
      {eyebrow && <div className="g-label-xs mb-2">{eyebrow}</div>}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[30px] leading-[1.15]">{title}</h1>
          {description && (
            <p className="text-[13.5px] mt-2 max-w-2xl leading-relaxed" style={{ color: "var(--g-muted-foreground)" }}>
              {description}
            </p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2.5 pt-1">{actions}</div>}
      </div>
    </motion.div>
  );
}

export function GSectionCard({ title, description, action, children, className = "" }: {
  title?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.section
      className={`g-card ${className}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: easeOut }}
    >
      {(title || action) && (
        <div className="flex items-start justify-between gap-4 px-6 pt-5 pb-4">
          <div>
            {title && <h2 className="text-[17px] leading-tight">{title}</h2>}
            {description && (
              <p className="text-[12.5px] mt-1" style={{ color: "var(--g-muted-foreground)" }}>{description}</p>
            )}
          </div>
          {action}
        </div>
      )}
      {children}
    </motion.section>
  );
}

const statVariants = {
  hidden: { opacity: 0, y: 10 },
  show: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: easeOut },
  }),
};

export function GStat({ label, value, sub }: { label: string; value: ReactNode; sub?: string }) {
  return (
    <div className="px-6 py-5">
      <div className="g-label-xs">{label}</div>
      <div className="text-[26px] font-semibold leading-none mt-2 g-num">
        {typeof value === "number" ? <AnimatedNumber value={value} /> : value}
      </div>
      {sub && <div className="text-[12px] mt-2" style={{ color: "var(--g-muted-foreground)" }}>{sub}</div>}
    </div>
  );
}

export function GStatRow({ children, className = "" }: { children: ReactNode; className?: string }) {
  const items = Array.isArray(children) ? children : [children];
  return (
    <motion.div
      className={`g-card grid divide-x divide-[#efefef] ${className}`}
      initial="hidden"
      animate="show"
    >
      {items.map((child, i) => (
        <motion.div key={i} custom={i} variants={statVariants} className="min-w-0">
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

/* soft status pill — green dot for live, quiet grays otherwise */
const PILL_VARIANTS: Record<string, string> = {
  live: "g-pill g-pill-solid",
  testing: "g-pill g-pill-strong",
  paused: "g-pill g-pill-muted",
  draft: "g-pill",
  resolved: "g-pill g-pill-strong",
  escalated: "g-pill g-pill-strong",
  completed: "g-pill g-pill-strong",
  abandoned: "g-pill",
  failed: "g-pill g-pill-strong",
  retrying: "g-pill",
  new: "g-pill g-pill-muted",
  won: "g-pill g-pill-solid",
  lost: "g-pill",
};
export function GPill({ status, dot = false }: { status: string; dot?: boolean }) {
  const cls = PILL_VARIANTS[status?.toLowerCase()] || "g-pill";
  const live = status?.toLowerCase() === "live";
  return (
    <span className={cls}>
      {live ? <span className="g-pill-live-dot" /> : dot && <span className="g-pill-dot" />}
      {status}
    </span>
  );
}

/* lead funnel strip */
export function GFunnel({ steps }: { steps: { label: string; value: string | number }[] }) {
  return (
    <div className="grid px-6 py-5 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {steps.map((s) => (
        <div key={s.label} className="lg:pl-5 lg:border-l lg:first:border-l-0 lg:first:pl-0" style={{ borderColor: "var(--g-border-light)" }}>
          <div className="g-label-xs">{s.label}</div>
          <div className="text-[20px] font-semibold mt-1.5 g-num">{s.value}</div>
        </div>
      ))}
    </div>
  );
}

/* soft-ruled data table */
export function GTable({ head, children }: { head: string[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="g-table">
        <thead>
          <tr>{head.map((h) => <th key={h}>{h}</th>)}</tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function GTd({ children, className = "", mono = false }: { children?: ReactNode; className?: string; mono?: boolean }) {
  return <td className={`${mono ? "g-mono" : ""} ${className}`}>{children}</td>;
}

export function GModal({
  open,
  onClose,
  title,
  subtitle,
  icon,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  children: ReactNode;
}) {
  if (!open || typeof document === "undefined") return null;
  return createPortal(
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-[#000000]/60 backdrop-blur-md animate-fadeup"
      style={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#ffffff] border border-[var(--g-border)] rounded-2xl p-6 shadow-2xl w-full max-w-md animate-fadeup text-left flex flex-col">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--g-border-light)]">
          <div className="flex items-center gap-2">
            {icon && (
              <div className="w-8 h-8 rounded-lg bg-[var(--g-surface-2)] grid place-items-center">
                {icon}
              </div>
            )}
            <div>
              <h3 className="font-bold text-[16px] text-[var(--g-foreground)]">{title}</h3>
              {subtitle && <p className="text-[12px] text-[var(--g-muted-foreground)] mt-0.5">{subtitle}</p>}
            </div>
          </div>
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
}

export function GEmptyState({ icon, title, body, action }: {
  icon?: ReactNode;
  title: string;
  body?: string;
  action?: ReactNode;
}) {
  return (
    <motion.div
      className="g-card flex flex-col items-center justify-center text-center px-6 py-20"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: easeOut }}
    >
      {icon && (
        <div className="w-12 h-12 rounded-full grid place-items-center mb-5"
          style={{ background: "var(--g-secondary)", color: "var(--g-muted-foreground)" }}>
          {icon}
        </div>
      )}
      <h2 className="text-[19px]">{title}</h2>
      {body && (
        <p className="text-[13px] mt-2 max-w-md leading-relaxed" style={{ color: "var(--g-muted-foreground)" }}>{body}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </motion.div>
  );
}

/* left sub-navigation rail on detail pages — sliding active pill */
export function GSubNav({ items, active, onSelect }: {
  items: { id: string; label: string }[];
  active: string;
  onSelect: (id: string) => void;
}) {
  return (
    <nav className="flex flex-col gap-0.5">
      {items.map((it) => {
        const isActive = active === it.id;
        return (
          <button
            key={it.id}
            onClick={() => onSelect(it.id)}
            className={`g-nav-item text-left w-full ${isActive ? "g-nav-item-active" : ""}`}
          >
            <span className="flex-1 relative z-10">{it.label}</span>
            {isActive && (
              <motion.span
                layoutId="g-subnav-pill"
                className="absolute inset-0 rounded-[10px]"
                style={{ background: "var(--g-surface-2)" }}
                transition={{ type: "spring", stiffness: 500, damping: 40 }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}

export function GLinkButton({ to, children, variant = "primary" }: { to: string; children: ReactNode; variant?: "primary" | "secondary" }) {
  return <Link to={to} className={variant === "primary" ? "g-btn" : "g-btn-2"}>{children}</Link>;
}

/* eyebrow row: "chat employee · template C-01 · v4.2" */
export function GEyebrow({ parts }: { parts: (string | undefined | null)[] }) {
  const cleaned = parts.filter(Boolean) as string[];
  return <div className="g-label-xs mb-2">{cleaned.join(" · ")}</div>;
}

export function GField({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="g-label-xs block mb-1.5">{label}</span>
      {children}
      {hint && <span className="block text-[11.5px] mt-1.5" style={{ color: "var(--g-muted-foreground)" }}>{hint}</span>}
    </label>
  );
}

export function GSpinner() {
  return (
    <div className="flex items-center justify-center py-24" style={{ color: "var(--g-muted-foreground)" }}>
      <motion.div
        className="w-5 h-5 rounded-full border-2 border-current border-t-transparent"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 0.7, ease: "linear" }}
      />
    </div>
  );
}

export function GCopyButton({ text, className = "" }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`g-pill g-pill-strong text-[11.5px] cursor-pointer hover:border-[var(--g-foreground)] transition inline-flex items-center gap-1.5 ${className}`}
    >
      {copied ? (
        <>
          <Check width={12} height={12} /> Copied
        </>
      ) : (
        <>
          <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          Copy
        </>
      )}
    </button>
  );
}


export function StatusChip({ live = true, label }: { live?: boolean; label: string }) {
  return (
    <span className="g-pill g-pill-strong">
      <span className={`g-pill-dot ${live ? "bg-[#22c55e] pulse-dot" : "bg-[var(--g-muted-foreground)]"}`} />
      {label}
    </span>
  );
}

const scoreStyles: Record<string, string> = {
  Hot: "g-pill g-pill-solid",
  Warm: "g-pill g-pill-strong",
  Cold: "g-pill g-pill-muted",
};
export function ScoreBadge({ score }: { score: "Hot" | "Warm" | "Cold" }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11.5px] font-semibold px-2.5 py-0.5 rounded-full ${scoreStyles[score] || "g-pill"}`}>
      {score}
    </span>
  );
}

export function Sparkline({ points, color = "var(--g-foreground)" }: { points: string; color?: string }) {
  return (
    <svg width="70" height="26" viewBox="0 0 70 26" fill="none">
      <polyline points={points} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function MetricCard({ label, value, delta, deltaTone = "up", color, to, dot }:
  { label: string; value: string; delta: string; deltaTone?: "up" | "flat"; spark?: string; color?: string; to: string; dot?: string }) {
  return (
    <Link to={to} className="g-card bg-white border border-[#E5E7EB] p-5 pb-4 transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:border-[#D1D5DB] block rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
      <div className="text-[13px] font-semibold text-[#64748B] flex items-center gap-2">
        {dot && <span className="w-2 h-2 rounded-full" style={{ background: dot }} />}{label}
      </div>
      <div className="text-[32px] font-bold text-[#09090B] mt-2.5 leading-none tracking-tight" style={color ? { color } : undefined}>{value}</div>
      <div className="flex items-center justify-between mt-3.5">
        <span className={`inline-flex items-center text-[12px] font-semibold px-2.5 py-0.5 rounded-full ${deltaTone === "up" ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60" : "bg-[#F4F5F6] text-[#64748B] border border-[#E5E7EB]"}`}>{delta}</span>
      </div>
    </Link>
  );
}

export function StateBlock({ title, body, action, onAction }:
  { title: string; body: string; action?: string; onAction?: () => void }) {
  return (
    <div className="max-w-2xl mx-auto my-6 g-card bg-white border border-[#E5E7EB] p-12 py-14 flex flex-col items-center text-center shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.02)] rounded-3xl">
      <div className="w-14 h-14 rounded-2xl bg-[#F8F9FA] text-[#09090B] border border-[#E5E7EB] grid place-items-center mb-5 shadow-2xs">
        <Sparkle width={24} height={24} />
      </div>
      <h3 className="text-xl font-bold tracking-tight text-[#09090B]">{title}</h3>
      <p className="text-[#64748B] text-[14px] mt-2.5 max-w-md leading-relaxed">{body}</p>
      {action && (
        <button
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[#09090B] text-white px-7 py-2.5 text-[13.5px] font-semibold hover:bg-black transition-all shadow-[0_2px_8px_rgba(0,0,0,0.12)] hover:shadow-[0_4px_14px_rgba(0,0,0,0.18)] cursor-pointer active:scale-[0.98]"
          onClick={onAction}
        >
          {action}
        </button>
      )}
    </div>
  );
}

export function PageHead({ title, subtitle, right }: { title: string; subtitle?: string; right?: ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-4 mb-7 fadeup">
      <div>
        <h1 className="text-[28px] font-bold leading-tight tracking-tight text-[#09090B]">{title}</h1>
        {subtitle && <p className="text-[13.5px] font-medium text-[#64748B] mt-1">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}

export function Card({ children, className = "", style }: { children: ReactNode; className?: string; style?: React.CSSProperties }) {
  return <section className={`card overflow-hidden ${className}`} style={style}>{children}</section>;
}

export function LoadingSpinner({ size = "md", className = "" }: { size?: "sm" | "md" | "lg"; className?: string }) {
  const sizeMap = {
    sm: "w-5 h-5 border-2",
    md: "w-9 h-9 border-[2.5px]",
    lg: "w-12 h-12 border-[3px]",
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <div
        className={`${sizeMap[size]} rounded-full border-[var(--g-border)] border-t-[var(--g-foreground)] border-r-[var(--g-muted-foreground)] loader-spinner`}
      />
      <div className="absolute w-1.5 h-1.5 rounded-full bg-[var(--g-foreground)] loader-pulse" />
    </div>
  );
}

export function Loading({
  label = "Loading",
  subtitle,
  fullScreen = false,
  size = "md",
  className = "",
}: {
  label?: string;
  subtitle?: string;
  fullScreen?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const content = (
    <div className={`flex flex-col items-center justify-center text-center p-6 gap-3 fadeup ${className}`}>
      <div className="relative">
        <LoadingSpinner size={size} />
      </div>
      <div className="space-y-0.5">
        <div className="font-sans font-semibold text-[15px] tracking-tight text-[var(--g-foreground)]">
          <span className="text-shimmer">{label}...</span>
        </div>
        {subtitle && (
          <p className="text-[13px] text-[var(--g-muted-foreground)] font-sans max-w-xs">{subtitle}</p>
        )}
      </div>
    </div>
  );

  if (fullScreen && typeof document !== "undefined") {
    return createPortal(
      <div
        className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#ffffff]/80 backdrop-blur-md"
        style={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
      >
        {content}
      </div>,
      document.body
    );
  }

  return content;
}