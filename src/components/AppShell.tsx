import { Link, Outlet, useLocation, useRouterState } from "@tanstack/react-router";
import { useAuth } from "../lib/auth";
import * as I from "./icons";
import type { ReactNode } from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CreateAgentModal } from "./CreateAgentModal";

function Item({ to, icon, label, badge }: { to: string; icon: ReactNode; label: string; badge?: string }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = to === "/app" ? pathname === "/app" || pathname === "/app/" : pathname === to || pathname.startsWith(`${to}/`);
  return (
    <Link to={to}
      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13.5px] font-medium transition-all cursor-pointer ${
        isActive
          ? "bg-[#09090B] text-white font-semibold shadow-xs"
          : "text-[#64748B] hover:text-[#09090B] hover:bg-[#EEF0F2]"
      }`}>
      <span className={`shrink-0 w-4 h-4 grid place-items-center ${isActive ? "text-white" : "text-[#64748B]"}`}>
        {icon}
      </span>
      <span className="flex-1 truncate">{label}</span>
      {badge && (
        <span className={`text-[10.5px] font-bold px-2 py-0.5 rounded-full shrink-0 ml-1 transition-colors ${
          isActive ? "bg-white/20 text-white" : "bg-[#E5E7EB] text-[#09090B]"
        }`}>
          {badge}
        </span>
      )}
    </Link>
  );
}

function Group({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="mb-4">
      <div className="px-3 pb-1.5 pt-1 font-bold text-[10.5px] uppercase tracking-wider text-[#94A3B8]">{label}</div>
      <div className="flex flex-col gap-0.5">{children}</div>
    </div>
  );
}

export default function AppShell() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Dedicated full-screen layout for Employee Studio
  if (location.pathname.startsWith("/app/studio")) {
    return <Outlet />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[180px_minmax(0,1fr)] min-h-screen bg-background text-foreground">
      {/* Create Agent Modal */}
      <CreateAgentModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} />

      {/* Fixed Grounded Sidebar Layout */}
      <aside className="hidden md:flex flex-col sticky top-0 h-screen overflow-hidden border-r border-border bg-sidebar">
        
        {/* Brand Header */}
        <div className="shrink-0 px-3.5 pt-4 pb-3 border-b border-border/80">
          <Link to="/app" className="flex items-center gap-2.5 px-2 py-1.5 group">
            <I.Logo className="w-7 h-7 shrink-0 text-[#09090B]" />
            <span className="leading-tight">
              <span className="block text-[14.5px] font-bold tracking-tight text-[#09090B]">KaliGanAI</span>
              <span className="block text-[11px] font-medium text-[#64748B]">Enterprise Operations</span>
            </span>
          </Link>
        </div>

        {/* Quick Action Button */}
        <div className="px-3.5 pt-3.5 pb-1.5">
          <button
            onClick={() => setShowCreateModal(true)}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#09090B] text-white py-2.5 text-[13px] font-semibold hover:bg-black transition-all shadow-[0_2px_8px_rgba(0,0,0,0.12)] hover:shadow-[0_4px_14px_rgba(0,0,0,0.18)] cursor-pointer active:scale-[0.98]"
          >
            <I.Plus width={13} height={13} />
            <span>Create AI Employee</span>
          </button>
        </div>

        {/* Navigation Groups */}
        <nav className="flex-1 overflow-y-auto px-3 py-2.5 g-no-scrollbar space-y-1">
          <Group label="Workforce">
            <Item to="/app/agents" icon={<I.Bot width={15} height={15} />} label="AI Employees" />
            <Item to="/app/templates" icon={<I.Grid width={15} height={15} />} label="Marketplace" badge="48" />
            <Item to="/app/studio" icon={<I.Bolt width={15} height={15} />} label="Agent Studio" />
          </Group>
          <Group label="Enterprise Assets">
            <Item to="/app/knowledge" icon={<I.Book width={15} height={15} />} label="Knowledge Base" />
            <Item to="/app/integrations" icon={<I.Plug width={15} height={15} />} label="Integrations Hub" />
            <Item to="/app/numbers" icon={<I.SimCard width={15} height={15} />} label="Phone Numbers" />
          </Group>
          <Group label="Observability">
            <Item to="/app/analytics" icon={<I.Chart width={15} height={15} />} label="Executive Analytics" />
            <Item to="/app/docs" icon={<I.FileText width={15} height={15} />} label="Documentation" />
          </Group>
        </nav>

        {/* Footer: User / Settings & Log out */}
        <div className="shrink-0 px-3.5 pt-3 pb-4 border-t border-[#E5E7EB]/80 bg-[#F8F9FA]">
          {/* User info pill */}
          {user?.email && (
            <div className="px-3 py-1.5 mb-1.5 rounded-lg bg-white/70 border border-[#E5E7EB]/60 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_0_2px_rgba(16,185,129,0.2)]" />
              <span className="text-[11.5px] font-medium text-[#475569] truncate flex-1">{user.email}</span>
            </div>
          )}
          <div className="flex flex-col gap-0.5">
            <Item to="/app/settings" icon={<I.Cog width={15} height={15} />} label="Settings" />
            <button
              onClick={logout}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-[13px] font-medium text-[#64748B] hover:text-[#09090B] hover:bg-[#EEF0F2] transition-colors w-full text-left cursor-pointer"
            >
              <I.LogOut width={14} height={14} />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Full-Height Content Area */}
      <main className="app-workspace-canvas px-4 py-5 pb-16 min-w-0 overflow-y-auto min-h-screen md:max-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
