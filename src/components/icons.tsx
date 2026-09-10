import type { SVGProps } from "react";

const base = (p: SVGProps<SVGSVGElement>) => ({
  width: 18, height: 18, viewBox: "0 0 24 24", fill: "none",
  stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const, ...p,
});

export const Sparkle = (p: SVGProps<SVGSVGElement>) => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M12 0c.6 5.4 2.8 8 8 8.5-5.2.5-7.4 3.1-8 8.5-.6-5.4-2.8-8-8-8.5 5.2-.5 7.4-3.1 8-8.5z" />
  </svg>
);
export const Sparkles = Sparkle;
export const Database = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
  </svg>
);
export const Dashboard = (p: SVGProps<SVGSVGElement>) => (<svg {...base(p)}><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>);
export const Chat = (p: SVGProps<SVGSVGElement>) => (<svg {...base(p)}><path d="M21 11.5a8.38 8.38 0 0 1-9 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.2A8.5 8.5 0 1 1 21 11.5z"/></svg>);
export const Users = (p: SVGProps<SVGSVGElement>) => (<svg {...base(p)}><path d="M17 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9.5" cy="7" r="4"/></svg>);
export const Book = (p: SVGProps<SVGSVGElement>) => (<svg {...base(p)}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>);
export const Bot = (p: SVGProps<SVGSVGElement>) => (<svg {...base(p)}><rect x="4" y="7" width="16" height="13" rx="3"/><path d="M9 7V4h6v3M9 13h.01M15 13h.01M9 17h6"/></svg>);
export const Mic = (p: SVGProps<SVGSVGElement>) => (<svg {...base(p)}><path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v1a7 7 0 0 1-14 0v-1M12 18v4M8 22h8"/></svg>);
export const Code = (p: SVGProps<SVGSVGElement>) => (<svg {...base(p)}><path d="M20 15.5a4.5 4.5 0 0 0-1-8.9A6 6 0 0 0 4 9a4 4 0 0 0 .5 8H8"/><path d="M12 21v-8m0 0l-3 3m3-3l3 3"/></svg>);
export const Cog = (p: SVGProps<SVGSVGElement>) => (<svg {...base(p)}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>);
export const Search = (p: SVGProps<SVGSVGElement>) => (<svg {...base(p)}><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>);
export const Bell = (p: SVGProps<SVGSVGElement>) => (<svg {...base(p)}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>);
export const Chevron = (p: SVGProps<SVGSVGElement>) => (<svg {...base(p)} width={14} height={14}><path d="m6 9 6 6 6-6"/></svg>);
export const Check = (p: SVGProps<SVGSVGElement>) => (<svg {...base(p)} strokeWidth={2.4}><path d="M20 6 9 17l-5-5"/></svg>);
export const ArrowRight = (p: SVGProps<SVGSVGElement>) => (<svg {...base(p)} strokeWidth={2.1}><path d="M5 12h14M12 5l7 7-7 7"/></svg>);
export const Phone = (p: SVGProps<SVGSVGElement>) => (<svg {...base(p)}><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>);
export const Play = (p: SVGProps<SVGSVGElement>) => (<svg width={12} height={12} viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M8 5v14l11-7z"/></svg>);
export const Plus = (p: SVGProps<SVGSVGElement>) => (<svg {...base(p)} strokeWidth={2}><path d="M12 5v14M5 12h14"/></svg>);
export const Plug = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M9 2v6" />
    <path d="M15 2v6" />
    <path d="M9 8h6" />
    <path d="M12 8v8" />
    <path d="M7 16h10" />
    <path d="M7 16v3a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-3" />
  </svg>
);
export const Bolt = (p: SVGProps<SVGSVGElement>) => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" />
  </svg>
);
export const LogOut = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

export const Logo = ({ className = "w-7 h-7", ...p }: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 291 291"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} shrink-0`}
    {...p}
  >
    <path
      d="M228.784 96.5834C234.656 95.9337 233.688 101.987 233.671 105.917L233.625 115.449L233.563 145.258L233.435 175.273L233.442 184.827C233.443 186.85 233.523 189.347 233.265 191.3C232.846 194.74 231.446 197.986 229.232 200.652C227.986 202.149 226.493 203.422 224.819 204.417C221.264 206.526 216.052 209.003 212.248 210.953L189.046 222.807L167.946 233.588C164.312 235.443 160.627 237.343 156.955 239.123C155.845 239.662 155.143 239.804 153.936 239.904C150.323 239.579 148.792 237.391 148.785 233.945C148.773 227.945 148.778 221.945 148.781 215.945L148.783 181.847V154.827C148.783 150.287 148.764 145.768 148.808 141.207C148.838 138.291 150.429 135.037 152.981 133.473C154.492 132.548 156.491 131.718 158.109 130.955L166.107 127.141L191.059 115.172C199.124 111.313 207.154 107.387 215.152 103.392L223.221 99.3105C224.98 98.4122 226.978 97.321 228.784 96.5834Z"
      fill="currentColor"
    />
    <path
      d="M144.263 47.6212C146.453 47.4435 149.748 47.8468 151.76 48.7288C155.386 50.3182 159.122 52.2395 162.697 53.9809L184.322 64.4765C193.971 69.1108 203.589 73.8099 213.176 78.5737L221.096 82.4954C223.088 83.484 226.46 84.6238 226.908 87.0012C227.316 89.1628 225.751 90.452 224.016 91.3259C219.414 93.6454 214.779 95.9034 210.15 98.1695L182.535 111.56L161.229 121.829C157.445 123.646 150.868 127.35 146.968 127.785C144.81 128.039 142.621 127.771 140.588 127.003C138.869 126.357 136.366 125.062 134.666 124.24L125.363 119.775L95.2668 105.225L74.889 95.2979C71.8426 93.8181 68.4033 92.2829 65.4671 90.5665C64.6906 90.1126 63.9584 88.883 63.8591 87.9567C63.698 86.4507 64.8272 85.0198 66.1186 84.3484C70.1293 82.4298 74.1237 80.4676 78.1189 78.5118L108.748 63.604L127.031 54.6722C130.701 52.8484 134.366 50.9871 138.062 49.2171C140.032 48.2738 142.097 47.8322 144.263 47.6212Z"
      fill="currentColor"
    />
    <path
      d="M60.5617 96.4434C62.5356 96.4973 67.2104 99.2036 69.1331 100.184C72.3811 101.832 75.6386 103.462 78.9054 105.073L111.317 120.763C99.7257 133.956 88.3264 147.318 77.1226 160.842L107.656 211.905C111.425 218.249 115.375 224.736 118.989 231.15C108.029 225.669 97.2212 219.575 86.2564 214.032C81.7499 211.758 77.231 209.509 72.7 207.285C69.1561 205.54 65.073 203.902 62.2203 201.167C56.1148 195.313 57.1797 187.387 57.1761 179.764L57.0688 160.152L56.9301 120.061L56.9163 107.555C56.9139 105.284 56.8735 102.987 56.9423 100.717C57.012 98.4129 58.2651 96.854 60.5617 96.4434Z"
      fill="currentColor"
    />
    <path
      d="M124.938 129.746C125.716 129.98 127.377 130.74 128.159 131.088C130.889 132.281 133.29 133.096 135.195 135.378C137.894 138.609 137.278 142.545 137.28 146.444L137.283 158.03L137.287 194.587L137.286 222.004L137.283 230.156C137.283 232.096 137.347 234.108 137.082 236.028C133.029 229.974 128.986 223.243 125.103 217.043L92.25 164.617C102.801 152.719 113.701 141.091 124.938 129.746Z"
      fill="currentColor"
    />
    <rect x="172.535" y="144.31" width="12.4733" height="25.695" rx="6.23666" fill="#FFFFFF" />
    <rect x="201.492" y="131.587" width="12.4733" height="25.695" rx="6.23666" fill="#FFFFFF" />
  </svg>
);

// Grok workspace icons
export const Grid = (p: SVGProps<SVGSVGElement>) => (<svg {...base(p)}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>);
export const Tag = (p: SVGProps<SVGSVGElement>) => (<svg {...base(p)}><path d="M20.59 13.41 12 22 2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><circle cx="7" cy="7" r="1.5"/></svg>);
export const Copy = (p: SVGProps<SVGSVGElement>) => (<svg {...base(p)}><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>);
export const Chart = (p: SVGProps<SVGSVGElement>) => (<svg {...base(p)}><path d="M3 3v18h18"/><path d="M7 15v-4M12 17V8M17 17v-6"/></svg>);

export const Pause = (p: SVGProps<SVGSVGElement>) => (<svg {...base(p)}><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>);
export const Layers = (p: SVGProps<SVGSVGElement>) => (<svg {...base(p)}><path d="m12 2 9 5-9 5-9-5 9-5z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/></svg>);
export const Clock = (p: SVGProps<SVGSVGElement>) => (<svg {...base(p)}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>);
export const X = (p: SVGProps<SVGSVGElement>) => (<svg {...base(p)}><path d="M18 6 6 18M6 6l12 12"/></svg>);
export const SimCard = (p: SVGProps<SVGSVGElement>) => (<svg {...base(p)}><path d="M6 2h8l6 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/><rect x="9" y="12" width="6" height="6" rx="1"/></svg>);
export const List = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <line x1="4" y1="6" x2="20" y2="6" strokeWidth={2.4} strokeLinecap="round" />
    <line x1="4" y1="12" x2="20" y2="12" strokeWidth={2.4} strokeLinecap="round" />
    <line x1="4" y1="18" x2="20" y2="18" strokeWidth={2.4} strokeLinecap="round" />
  </svg>
);

export const Volume2 = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
  </svg>
);

export const VolumeX = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <line x1="23" y1="9" x2="17" y2="15" />
    <line x1="17" y1="9" x2="23" y2="15" />
  </svg>
);

export const FileText = (p: SVGProps<SVGSVGElement>) => (<svg {...base(p)}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>);
export const HelpCircle = (p: SVGProps<SVGSVGElement>) => (<svg {...base(p)}><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>);
export const LinkIcon = (p: SVGProps<SVGSVGElement>) => (<svg {...base(p)}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>);
export const AlertTriangle = (p: SVGProps<SVGSVGElement>) => (<svg {...base(p)}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>);
export const MessageSquare = (p: SVGProps<SVGSVGElement>) => (<svg {...base(p)}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>);
export const Zap = (p: SVGProps<SVGSVGElement>) => (<svg {...base(p)}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>);
export const Box = (p: SVGProps<SVGSVGElement>) => (<svg {...base(p)}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>);
export const Layout = (p: SVGProps<SVGSVGElement>) => (<svg {...base(p)}><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" /></svg>);
export const Globe = (p: SVGProps<SVGSVGElement>) => (<svg {...base(p)}><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>);

export const AlertCircle = (p: SVGProps<SVGSVGElement>) => (<svg {...base(p)}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>);
export const CheckCircle = (p: SVGProps<SVGSVGElement>) => (<svg {...base(p)}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>);
export const Mail = (p: SVGProps<SVGSVGElement>) => (<svg {...base(p)}><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>);
export const Target = (p: SVGProps<SVGSVGElement>) => (<svg {...base(p)}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>);
export const ArrowLeft = (p: SVGProps<SVGSVGElement>) => (<svg {...base(p)} strokeWidth={2.1}><path d="M19 12H5M12 19l-7-7 7-7"/></svg>);
export const Send = (p: SVGProps<SVGSVGElement>) => (<svg {...base(p)}><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>);
export const Close = X;

