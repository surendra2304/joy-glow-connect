import * as React from "react";
import { cn } from "../../lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "brand";
  size?: "default" | "sm" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none active:scale-[0.98]";

    const variantStyles = {
      default:
        "bg-[#09090B] text-white hover:bg-black shadow-xs hover:shadow-md",
      brand:
        "bg-[#09090B] text-white hover:bg-slate-800 shadow-xs",
      destructive:
        "bg-red-600 text-white hover:bg-red-700 shadow-xs",
      outline:
        "border border-[#E5E7EB] bg-white text-[#09090B] hover:bg-[#F8F9FA] hover:border-[#CBD5E1] shadow-2xs",
      secondary:
        "bg-[#F4F5F6] text-[#09090B] hover:bg-[#E5E7EB] border border-[#E5E7EB]/60",
      ghost:
        "text-[#64748B] hover:text-[#09090B] hover:bg-[#F4F5F6]",
      link:
        "text-[#09090B] underline-offset-4 hover:underline p-0 h-auto font-medium",
    };

    const sizeStyles = {
      default: "h-9 px-4 py-2 text-[13px]",
      sm: "h-8 rounded-lg px-3 text-[12px]",
      lg: "h-11 rounded-2xl px-6 text-[14px]",
      icon: "h-9 w-9 rounded-xl p-0",
    };

    return (
      <button
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
