import { useState } from "react";
import {
  Shield, Users, FileText, Activity, Server, Lock,
  LogOut, Search, AlertTriangle, CheckCircle2, XCircle,
  Clock, Eye, ChevronRight, BarChart3, Settings,
} from "lucide-react";
import { useNavigate } from "react-router";
import { GridBackground } from "@/shared/components/GridBackground";
import { Logo } from "@/shared/components/BrandLogo";
import {
  platformStats, systemHealth, platformUsers, auditLogs, securityEvents,
} from "../superadmin.data";

type Tab = "overview" | "users" | "system" | "audit";

export function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [userSearch, setUserSearch] = useState("");
  const navigate = useNavigate();

  const tabs: { key: Tab; label: string; icon: typeof Shield }[] = [
    { key: "overview", label: "Vue d'ensemble", icon: BarChart3 },
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
  const roleBadge = (r: string) =>
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
    <div className="relative min-h-screen bg-[#FAFAFA]">
      <GridBackground variant="dashboard" />

      {/* Header */}
      <header className="relative z-10 border-b border-[#E5E5E5] bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <div className="hidden sm:flex items-center gap-2 ml-2 px-2.5 py-1 rounded-lg bg-black text-white text-xs font-bold">
              <Shield className="w-3 h-3" />
              Super Admin
            </div>
          </div>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[#E5E5E5] text-sm font-medium text-[#666666] hover:bg-[#F5F5F5] transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Déconnexion</span>
          </button>
        </div>
      </header>

      {/* Tabs */}
      <nav className="relative z-10 border-b border-[#E5E5E5] bg-white/60 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 sm:px-6">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === t.key
                  ? "border-black text-black"
                  : "border-transparent text-[#888888] hover:text-black"
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Content */}
      <main className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-6 space-y-6">
        {/* ─── OVERVIEW ─── */}
        {activeTab === "overview" && (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {platformStats.map((s) => (
                <div key={s.label} className="rounded-2xl border border-[#E5E5E5] bg-white p-5 shadow-sm">
                  <p className="text-xs text-[#888888] font-medium mb-1">{s.label}</p>
                  <p className="text-2xl font-bold text-black">{s.value}</p>
                  <p className="text-xs text-[#888888] mt-1">
                    <span className="text-emerald-600 font-medium">{s.change}</span> {s.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Quick panels */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* System health */}
              <div className="rounded-2xl border border-[#E5E5E5] bg-white p-6 shadow-sm">
                <h2 className="text-sm font-bold text-black mb-4 flex items-center gap-2">
                  <Server className="w-4 h-4" /> Santé du système
                </h2>
                <div className="space-y-3">
                  {systemHealth.slice(0, 4).map((h) => (
                    <div key={h.name} className="flex items-center justify-between">
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
                  Voir tout <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              {/* Recent audit */}
              <div className="rounded-2xl border border-[#E5E5E5] bg-white p-6 shadow-sm">
                <h2 className="text-sm font-bold text-black mb-4 flex items-center gap-2">
                  <Activity className="w-4 h-4" /> Journal récent
                </h2>
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
                  Voir tout <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Security events */}
            <div className="rounded-2xl border border-[#E5E5E5] bg-white p-6 shadow-sm">
              <h2 className="text-sm font-bold text-black mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Événements de sécurité récents
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {securityEvents.map((ev) => (
                  <div key={ev.id} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#F8F8F8] border border-[#E5E5E5]">
                    {ev.blocked ? (
                      <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                    )}
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
            </div>
          </>
        )}

        {/* ─── USERS ─── */}
        {activeTab === "users" && (
          <div className="rounded-2xl border border-[#E5E5E5] bg-white shadow-sm">
            <div className="flex flex-col gap-3 p-6 border-b border-[#E5E5E5] sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-sm font-bold text-black flex items-center gap-2">
                <Users className="w-4 h-4" /> Utilisateurs de la plateforme ({platformUsers.length})
              </h2>
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
            </div>
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
                  <span className={`px-2 py-0.5 rounded-lg text-[11px] font-medium ${roleBadge(u.role)}`}>
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
          </div>
        )}

        {/* ─── SYSTEM ─── */}
        {activeTab === "system" && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-[#E5E5E5] bg-white p-6 shadow-sm">
              <h2 className="text-sm font-bold text-black mb-5 flex items-center gap-2">
                <Server className="w-4 h-4" /> Services
              </h2>
              <div className="space-y-4">
                {systemHealth.map((h) => (
                  <div key={h.name} className="flex items-center justify-between px-4 py-3.5 rounded-xl bg-[#F8F8F8] border border-[#E5E5E5]">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${statusColor(h.status)}`} />
                      <span className="text-sm font-medium text-black">{h.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-[#888888]">Latence: {h.latency}</span>
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
            </div>
          </div>
        )}

        {/* ─── AUDIT ─── */}
        {activeTab === "audit" && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-[#E5E5E5] bg-white p-6 shadow-sm">
              <h2 className="text-sm font-bold text-black mb-5 flex items-center gap-2">
                <Activity className="w-4 h-4" /> Journal d'audit
              </h2>
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
            </div>

            <div className="rounded-2xl border border-[#E5E5E5] bg-white p-6 shadow-sm">
              <h2 className="text-sm font-bold text-black mb-5 flex items-center gap-2">
                <Shield className="w-4 h-4" /> Événements de sécurité
              </h2>
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
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
