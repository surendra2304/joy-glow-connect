import * as React from "react";
import { cn } from "../../lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "destructive" | "success" | "neutral" | "brand" | "purple" | "amber" | "sky" | "verified";
}

export function Badge({
  className,
  variant = "default",
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    default: "bg-slate-900 text-white hover:bg-slate-800",
    brand: "bg-[#09090B] text-white",
    secondary: "bg-slate-100 text-slate-900 border-slate-200/80 hover:bg-slate-200/80",
    outline: "border-slate-200 text-slate-800 bg-transparent",
    destructive: "bg-red-50 text-red-700 border-red-200",
    success: "bg-emerald-50 text-emerald-800 border-emerald-200",
    neutral: "bg-slate-50 text-slate-700 border-slate-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200/80",
    amber: "bg-amber-50 text-amber-800 border-amber-200/80",
    sky: "bg-sky-50 text-sky-700 border-sky-200/80",
    verified: "bg-blue-50 text-blue-700 border-blue-200/80",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold transition-colors focus:outline-none",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
