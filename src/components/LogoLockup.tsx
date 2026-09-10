export function LogoLockup({ className = "", markClassName = "", textClassName = "" }: { className?: string, markClassName?: string, textClassName?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <img src="/logo1.png" alt="KaliGanAI" className={`object-contain ${markClassName || "h-8 w-8"}`} />
      <span className={`font-semibold ${textClassName}`}>KaliGanAI</span>
    </div>
  );
}
