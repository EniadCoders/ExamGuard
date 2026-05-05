import { useState } from "react";
import {
  Shield, Users, Server, Lock, LogOut, Search, AlertTriangle,
  XCircle, Clock, ChevronRight, BarChart3, Activity,
  LayoutDashboard,
} from "lucide-react";
import { useNavigate } from "react-router";
import { GridBackground } from "@/shared/components/GridBackground";
import { Logo } from "@/shared/components/BrandLogo";
import { NotificationPanel } from "@/shared/components/NotificationPanel";
import {
  DashboardCard,
  DashboardMetricCard,
  DashboardSectionCard,
} from "@/shared/components/dashboard/DashboardCard";
import {
  platformStats, systemHealth, platformUsers, auditLogs, securityEvents,
} from "../superadmin.data";

type Tab = "overview" | "users" | "system" | "audit";

export function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [userSearch, setUserSearch] = useState("");
  const navigate = useNavigate();

  const tabs: { key: Tab; label: string; icon: typeof Shield }[] = [
    { key: "overview", label: "Vue d'ensemble", icon: LayoutDashboard },
    { key: "users", label: "Utilisateurs", icon: Users },
    { key: "system", label: "Système", icon: Server },
    { key: "audit", label: "Audit & Sécurité", icon: Shield },
  ];

  const filteredUsers = platformUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const statusColor = (s: string) =>
    s === "operational" ? "bg-emerald-500" : s === "degraded" ? "bg-amber-400" : "bg-red-500";
  const statusLabel = (s: string) =>
    s === "operational" ? "Opérationnel" : s === "degraded" ? "Dégradé" : "Hors ligne";
  const roleLabel = (r: string) =>
    r === "professor" ? "Professeur" : r === "admin" ? "Admin" : "Étudiant";
  const roleBadgeClass = (r: string) =>
    r === "admin"
      ? "bg-black text-white"
      : r === "professor"
      ? "bg-[#F5F5F5] text-black border border-[#CCCCCC]"
      : "bg-[#F5F5F5] text-[#666666] border border-[#E5E5E5]";
  const userStatusBadge = (s: string) =>
    s === "active"
      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
      : s === "suspended"
      ? "bg-red-50 text-red-600 border border-red-200"
      : "bg-amber-50 text-amber-600 border border-amber-200";
  const logLevelStyle = (l: string) =>
    l === "danger"
      ? "bg-red-50 text-red-600 border-red-200"
      : l === "warn"
      ? "bg-amber-50 text-amber-600 border-amber-200"
      : "bg-[#F5F5F5] text-[#666666] border-[#E5E5E5]";

  return (
    <div className="cyber-dashboard-page relative min-h-screen overflow-hidden bg-[#FAFAFA]">
      <GridBackground variant="dashboard" />
      <div className="relative z-10">

        {/* ─── Header ─── */}
        <header className="cyber-topbar sticky top-0 z-40 border-b border-[#E5E5E5] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-3 px-4 py-3 sm:min-h-16 sm:px-6 sm:py-0">
            <div className="flex items-center gap-6">
              <Logo size="md" />
              <div className="hidden sm:block w-px h-6 bg-[#E5E5E5]" />
              <div className="hidden sm:block">
                <h1 className="text-base font-bold text-black">Super Administrateur</h1>
                <p className="text-xs text-[#666666]">Panneau de contrôle</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <NotificationPanel role="admin" />
              <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-[#E5E5E5]">
                <div className="text-right">
                  <p className="text-sm font-medium text-black">Admin Système</p>
                  <p className="text-xs text-[#666666]">Super Admin</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center flex-shrink-0">
                  <Shield className="w-4 h-4 text-white" />
                </div>
              </div>
              <button
                onClick={() => navigate("/")}
                className="p-2 hover:bg-[#F5F5F5] rounded-lg transition-colors ml-1"
                title="Se déconnecter"
              >
                <LogOut className="w-5 h-5 text-black" />
              </button>
            </div>
          </div>
        </header>

        {/* ─── Tab Bar ─── */}
        <div className="cyber-tabbar border-b border-[#E5E5E5] bg-white sticky top-16 z-30">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
            <div className="flex items-center gap-1 overflow-x-auto">
              {tabs.map((t) => {
                const Icon = t.icon;
                const isActive = activeTab === t.key;
                return (
                  <button
                    key={t.key}
                    onClick={() => setActiveTab(t.key)}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all border-b-2 whitespace-nowrap ${
                      isActive
                        ? "text-black border-black"
                        : "text-[#666666] border-transparent hover:text-black hover:bg-[#F5F5F5]"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ─── Main Content ─── */}
        <main className="max-w-[1600px] mx-auto px-4 py-6 sm:px-6 sm:py-8">

          {/* ─── OVERVIEW TAB ─── */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Stat cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {platformStats.map((s) => (
                  <DashboardMetricCard
                    key={s.label}
                    icon={BarChart3}
                    label={s.label}
                    value={s.value}
                    change={s.change}
                    description={s.desc}
                    changeTone="info"
                  />
                ))}
              </div>

              {/* Quick panels row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* System health preview */}
                <DashboardSectionCard title="Santé du système" icon={Server} subtitle="État des services en temps réel">
                  <div className="space-y-3">
                    {systemHealth.slice(0, 4).map((h) => (
                      <div key={h.name} className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-[#F8F8F8] border border-[#E5E5E5]">
                        <div className="flex items-center gap-3">
                          <div className={`w-2.5 h-2.5 rounded-full ${statusColor(h.status)}`} />
                          <span className="text-sm text-black">{h.name}</span>
                        </div>
                        <span className="text-xs text-[#888888]">{h.latency}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setActiveTab("system")}
                    className="mt-4 flex items-center gap-1 text-xs font-medium text-[#888888] hover:text-black transition-colors"
                  >
                    Voir tous les services <ChevronRight className="w-3 h-3" />
                  </button>
                </DashboardSectionCard>

                {/* Recent audit preview */}
                <DashboardSectionCard title="Journal récent" icon={Activity} subtitle="Dernières actions sur la plateforme">
                  <div className="space-y-3">
                    {auditLogs.slice(0, 4).map((log) => (
                      <div key={log.id} className="flex items-start gap-3">
                        <span className={`mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase border ${logLevelStyle(log.level)}`}>
                          {log.level}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-black truncate">{log.action}</p>
                          <p className="text-xs text-[#888888]">{log.time} · {log.user}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setActiveTab("audit")}
                    className="mt-4 flex items-center gap-1 text-xs font-medium text-[#888888] hover:text-black transition-colors"
                  >
                    Voir le journal complet <ChevronRight className="w-3 h-3" />
                  </button>
                </DashboardSectionCard>
              </div>

              {/* Security events */}
              <DashboardSectionCard title="Événements de sécurité récents" icon={AlertTriangle} subtitle="Menaces détectées et bloquées">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {securityEvents.map((ev) => (
                    <div key={ev.id} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#F8F8F8] border border-[#E5E5E5]">
                      <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-black truncate">{ev.type}</p>
                        <p className="text-xs text-[#888888]">{ev.ip} · {ev.time}</p>
                      </div>
                      {ev.blocked && (
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-red-50 text-red-600 border border-red-200">
                          Bloqué
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </DashboardSectionCard>
            </div>
          )}

          {/* ─── USERS TAB ─── */}
          {activeTab === "users" && (
            <DashboardSectionCard
              title={`Utilisateurs de la plateforme (${platformUsers.length})`}
              icon={Users}
              subtitle="Gestion des comptes utilisateurs"
              action={
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Rechercher..."
                    className="w-full pl-10 pr-4 py-2 bg-[#F8F8F8] border border-[#E5E5E5] rounded-xl text-sm text-black placeholder:text-[#888888] focus:outline-none focus:ring-2 focus:ring-black transition-all"
                  />
                </div>
              }
              bodyClassName="p-0"
            >
              <div className="divide-y divide-[#E5E5E5]">
                {filteredUsers.map((u) => (
                  <div key={u.id} className="flex flex-wrap items-center gap-3 px-6 py-4 hover:bg-[#FAFAFA] transition-colors">
                    <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-white">
                        {u.name.split(" ").map((n) => n[0]).join("")}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-black">{u.name}</p>
                      <p className="text-xs text-[#888888] truncate">{u.email}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-lg text-[11px] font-medium ${roleBadgeClass(u.role)}`}>
                      {roleLabel(u.role)}
                    </span>
                    <span className={`px-2 py-0.5 rounded-lg text-[11px] font-medium ${userStatusBadge(u.status)}`}>
                      {u.status === "active" ? "Actif" : u.status === "suspended" ? "Suspendu" : "En attente"}
                    </span>
                    <span className="text-xs text-[#888888] hidden md:block w-24 text-right">{u.lastLogin}</span>
                  </div>
                ))}
                {filteredUsers.length === 0 && (
                  <p className="px-6 py-8 text-center text-sm text-[#888888]">Aucun utilisateur trouvé.</p>
                )}
              </div>
            </DashboardSectionCard>
          )}

          {/* ─── SYSTEM TAB ─── */}
          {activeTab === "system" && (
            <DashboardSectionCard title="Services" icon={Server} subtitle="Monitoring en temps réel de l'infrastructure">
              <div className="space-y-4">
                {systemHealth.map((h) => (
                  <div key={h.name} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3.5 rounded-xl bg-[#F8F8F8] border border-[#E5E5E5]">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${statusColor(h.status)}`} />
                      <span className="text-sm font-medium text-black">{h.name}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-1.5 text-xs text-[#888888]">
                        <Clock className="w-3 h-3" /> {h.latency}
                      </div>
                      <span className="text-xs text-[#888888]">Uptime: {h.uptime}</span>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                        h.status === "operational"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-amber-50 text-amber-600 border border-amber-200"
                      }`}>
                        {statusLabel(h.status)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </DashboardSectionCard>
          )}

          {/* ─── AUDIT TAB ─── */}
          {activeTab === "audit" && (
            <div className="space-y-6">
              <DashboardSectionCard title="Journal d'audit" icon={Activity} subtitle="Historique complet des actions">
                <div className="space-y-3">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="flex items-start gap-3 px-4 py-3 rounded-xl bg-[#F8F8F8] border border-[#E5E5E5]">
                      <span className={`mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${logLevelStyle(log.level)}`}>
                        {log.level}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm text-black">{log.action}</p>
                        <p className="text-xs text-[#888888] mt-0.5">{log.time} · {log.user}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </DashboardSectionCard>

              <DashboardSectionCard title="Événements de sécurité" icon={Shield} subtitle="Attaques détectées et bloquées automatiquement">
                <div className="space-y-3">
                  {securityEvents.map((ev) => (
                    <div key={ev.id} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#F8F8F8] border border-[#E5E5E5]">
                      <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-black">{ev.type}</p>
                        <p className="text-xs text-[#888888]">IP: {ev.ip} · {ev.time}</p>
                      </div>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-red-50 text-red-600 border border-red-200">
                        Bloqué
                      </span>
                    </div>
                  ))}
                </div>
              </DashboardSectionCard>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
