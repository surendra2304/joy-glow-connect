import { useState, useEffect, useRef } from "react";
import * as I from "./icons";

export interface DropdownOption {
  label: string;
  value: string;
  description?: string;
}

export function CustomSelect({
  value,
  onChange,
  options,
  className = "",
}: {
  value: string;
  onChange: (val: string) => void;
  options: DropdownOption[];
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = options.find((o) => o.value === value) || options[0];

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between text-left text-[13px] px-3.5 py-2.5 rounded-xl border border-[var(--g-border)] bg-[#ffffff] text-[var(--g-foreground)] hover:border-[#a3a3a3] transition-colors cursor-pointer shadow-xs focus:outline-none"
      >
        <span className="truncate font-medium">{selected?.label}</span>
        <I.Chevron
          width={14}
          height={14}
          className={`text-[var(--g-muted-foreground)] transition-transform duration-150 shrink-0 ml-2 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-[#ffffff] border border-[var(--g-border)] rounded-xl shadow-xl p-1 max-h-60 overflow-y-auto animate-fadeup">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`w-full flex items-center justify-between text-left px-3 py-2 rounded-lg text-[12.5px] transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-[var(--g-surface-2)] text-[var(--g-foreground)] font-semibold"
                    : "text-[var(--g-foreground)] hover:bg-[var(--g-surface)] font-normal"
                }`}
              >
                <div className="min-w-0 pr-2">
                  <div className="truncate">{opt.label}</div>
                  {opt.description && (
                    <div className="text-[11px] text-[var(--g-muted-foreground)] truncate">{opt.description}</div>
                  )}
                </div>
                {isSelected && (
                  <I.Check width={13} height={13} className="text-[var(--g-foreground)] shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
