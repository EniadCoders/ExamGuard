import { useMemo, useState } from "react";
import {
  Shield, Users, Server, LogOut, Search, AlertTriangle,
  XCircle, Clock, ChevronRight, BarChart3, Activity,
  LayoutDashboard, GraduationCap, UserCog, KeyRound, Trash2,
  PauseCircle, PlayCircle, Eye, X, Mail, Building2, CalendarDays,
} from "lucide-react";
import { useNavigate } from "react-router";
import { GridBackground } from "@/shared/components/GridBackground";
import { Logo } from "@/shared/components/BrandLogo";
import { NotificationPanel } from "@/shared/components/NotificationPanel";
import {
  DashboardMetricCard,
  DashboardSectionCard,
} from "@/shared/components/dashboard/DashboardCard";
import {
  platformStats, systemHealth, platformUsers, auditLogs, securityEvents,
  type PlatformUser,
} from "../superadmin.data";

type Tab = "overview" | "users" | "system" | "audit";
type UsersSubTab = "professors" | "students";

export function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [usersSubTab, setUsersSubTab] = useState<UsersSubTab>("professors");
  const [userSearch, setUserSearch] = useState("");
  const [users, setUsers] = useState<PlatformUser[]>(platformUsers);
  const [detailUser, setDetailUser] = useState<PlatformUser | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const navigate = useNavigate();

  const tabs: { key: Tab; label: string; icon: typeof Shield }[] = [
    { key: "overview", label: "Vue d'ensemble", icon: LayoutDashboard },
    { key: "users", label: "Utilisateurs", icon: Users },
    { key: "system", label: "Système", icon: Server },
    { key: "audit", label: "Audit & Sécurité", icon: Shield },
  ];

  const professors = useMemo(
    () => users.filter((u) => u.role === "professor"),
    [users]
  );
  const students = useMemo(
    () => users.filter((u) => u.role === "student"),
    [users]
  );

  const activeUserList = usersSubTab === "professors" ? professors : students;
  const filteredUsers = activeUserList.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.department.toLowerCase().includes(userSearch.toLowerCase())
  );

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2500);
  };

  const toggleSuspend = (user: PlatformUser) => {
    const nextStatus = user.status === "suspended" ? "active" : "suspended";
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, status: nextStatus } : u))
    );
    setDetailUser((prev) =>
      prev && prev.id === user.id ? { ...prev, status: nextStatus } : prev
    );
    showToast(
      nextStatus === "suspended"
        ? `${user.name} a été suspendu.`
        : `${user.name} a été réactivé.`
    );
  };

  const resetPassword = (user: PlatformUser) => {
    showToast(`Lien de réinitialisation envoyé à ${user.email}.`);
  };

  const deleteUser = (user: PlatformUser) => {
    if (!window.confirm(`Supprimer définitivement ${user.name} ?`)) return;
    setUsers((prev) => prev.filter((u) => u.id !== user.id));
    if (detailUser?.id === user.id) setDetailUser(null);
    showToast(`${user.name} a été supprimé.`);
  };

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
              title={
                usersSubTab === "professors"
                  ? `Professeurs (${professors.length})`
                  : `Étudiants (${students.length})`
              }
              icon={usersSubTab === "professors" ? UserCog : GraduationCap}
              subtitle="Gestion des comptes et actions administrateur"
              action={
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                  <div className="inline-flex p-1 rounded-xl bg-[#F5F5F5] border border-[#E5E5E5]">
                    <button
                      onClick={() => { setUsersSubTab("professors"); setUserSearch(""); }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        usersSubTab === "professors"
                          ? "bg-white text-black shadow-sm"
                          : "text-[#666666] hover:text-black"
                      }`}
                    >
                      <UserCog className="w-3.5 h-3.5" />
                      Professeurs
                      <span className="ml-1 text-[10px] text-[#888888]">{professors.length}</span>
                    </button>
                    <button
                      onClick={() => { setUsersSubTab("students"); setUserSearch(""); }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        usersSubTab === "students"
                          ? "bg-white text-black shadow-sm"
                          : "text-[#666666] hover:text-black"
                      }`}
                    >
                      <GraduationCap className="w-3.5 h-3.5" />
                      Étudiants
                      <span className="ml-1 text-[10px] text-[#888888]">{students.length}</span>
                    </button>
                  </div>
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
                    <span className="hidden lg:block text-xs text-[#666666] w-36 truncate">
                      {u.department}
                    </span>
                    <span className={`px-2 py-0.5 rounded-lg text-[11px] font-medium ${roleBadgeClass(u.role)}`}>
                      {roleLabel(u.role)}
                    </span>
                    <span className={`px-2 py-0.5 rounded-lg text-[11px] font-medium ${userStatusBadge(u.status)}`}>
                      {u.status === "active" ? "Actif" : u.status === "suspended" ? "Suspendu" : "En attente"}
                    </span>
                    <span className="text-xs text-[#888888] hidden md:block w-24 text-right">{u.lastLogin}</span>

                    {/* ── Inline admin actions ── */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setDetailUser(u)}
                        className="p-1.5 rounded-lg hover:bg-[#F5F5F5] transition-colors"
                        title="Voir les détails"
                      >
                        <Eye className="w-4 h-4 text-[#555555]" />
                      </button>
                      <button
                        onClick={() => toggleSuspend(u)}
                        className="p-1.5 rounded-lg hover:bg-[#F5F5F5] transition-colors"
                        title={u.status === "suspended" ? "Réactiver le compte" : "Suspendre le compte"}
                      >
                        {u.status === "suspended" ? (
                          <PlayCircle className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <PauseCircle className="w-4 h-4 text-amber-600" />
                        )}
                      </button>
                      <button
                        onClick={() => resetPassword(u)}
                        className="p-1.5 rounded-lg hover:bg-[#F5F5F5] transition-colors"
                        title="Réinitialiser le mot de passe"
                      >
                        <KeyRound className="w-4 h-4 text-[#555555]" />
                      </button>
                      <button
                        onClick={() => deleteUser(u)}
                        className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                        title="Supprimer le compte"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                ))}
                {filteredUsers.length === 0 && (
                  <p className="px-6 py-8 text-center text-sm text-[#888888]">
                    {usersSubTab === "professors"
                      ? "Aucun professeur trouvé."
                      : "Aucun étudiant trouvé."}
                  </p>
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

        {/* ─── User details modal ─── */}
        {detailUser && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onClick={() => setDetailUser(null)}
          >
            <div
              className="w-full max-w-md rounded-2xl bg-white border border-[#E5E5E5] shadow-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between px-6 py-5 border-b border-[#E5E5E5]">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-white">
                      {detailUser.name.split(" ").map((n) => n[0]).join("")}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-base font-bold text-black truncate">{detailUser.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-medium ${roleBadgeClass(detailUser.role)}`}>
                        {roleLabel(detailUser.role)}
                      </span>
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-medium ${userStatusBadge(detailUser.status)}`}>
                        {detailUser.status === "active" ? "Actif" : detailUser.status === "suspended" ? "Suspendu" : "En attente"}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setDetailUser(null)}
                  className="p-1.5 rounded-lg hover:bg-[#F5F5F5] transition-colors flex-shrink-0"
                  title="Fermer"
                >
                  <X className="w-4 h-4 text-[#555555]" />
                </button>
              </div>

              <div className="px-6 py-5 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-[#888888] flex-shrink-0" />
                  <span className="text-[#666666] w-24 flex-shrink-0">Email</span>
                  <span className="text-black truncate">{detailUser.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Building2 className="w-4 h-4 text-[#888888] flex-shrink-0" />
                  <span className="text-[#666666] w-24 flex-shrink-0">Département</span>
                  <span className="text-black truncate">{detailUser.department}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <CalendarDays className="w-4 h-4 text-[#888888] flex-shrink-0" />
                  <span className="text-[#666666] w-24 flex-shrink-0">Inscrit</span>
                  <span className="text-black">{detailUser.createdAt}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="w-4 h-4 text-[#888888] flex-shrink-0" />
                  <span className="text-[#666666] w-24 flex-shrink-0">Dernier accès</span>
                  <span className="text-black">{detailUser.lastLogin}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="w-4 h-4 text-[#888888] flex-shrink-0" />
                  <span className="text-[#666666] w-24 flex-shrink-0">ID</span>
                  <span className="text-black font-mono text-xs">#{detailUser.id.toString().padStart(6, "0")}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 px-6 py-4 border-t border-[#E5E5E5] bg-[#FAFAFA]">
                <button
                  onClick={() => toggleSuspend(detailUser)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-white border border-[#E5E5E5] text-black hover:bg-[#F5F5F5] transition-colors"
                >
                  {detailUser.status === "suspended" ? (
                    <>
                      <PlayCircle className="w-3.5 h-3.5 text-emerald-600" />
                      Réactiver
                    </>
                  ) : (
                    <>
                      <PauseCircle className="w-3.5 h-3.5 text-amber-600" />
                      Suspendre
                    </>
                  )}
                </button>
                <button
                  onClick={() => resetPassword(detailUser)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-white border border-[#E5E5E5] text-black hover:bg-[#F5F5F5] transition-colors"
                >
                  <KeyRound className="w-3.5 h-3.5 text-[#555555]" />
                  Réinitialiser MDP
                </button>
                <button
                  onClick={() => deleteUser(detailUser)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-white border border-red-200 text-red-600 hover:bg-red-50 transition-colors ml-auto"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── Toast ─── */}
        {toast && (
          <div className="fixed bottom-6 right-6 z-[60] px-4 py-2.5 rounded-xl bg-black text-white text-sm shadow-lg">
            {toast}
          </div>
        )}
      </div>
    </div>
  );
}
