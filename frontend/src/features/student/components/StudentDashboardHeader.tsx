/**
 * Barre de navigation supérieure du dashboard étudiant : logo, onglets de vue
 * (Dashboard / Examens / Résultats / Calendrier / Paramètres), bouton "Rejoindre",
 * cloche notifications et menu profil avec déconnexion.
 */
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  Calendar,
  LogOut,
} from "lucide-react";
import { Logo } from "@/shared/components/BrandLogo";
import { NotificationPanel } from "@/shared/components/NotificationPanel";
import type { DashboardUser } from "@/features/student/api";

export type StudentTab =
  | "dashboard"
  | "exams"
  | "results"
  | "calendar"
  | "settings";

interface StudentDashboardHeaderProps {
  user: DashboardUser | null;
  activeTab: StudentTab;
  hasExams: boolean;
  onTabChange: (tab: StudentTab) => void;
  onLogoClick: () => void;
  onLogout: () => void;
}

const tabsWithExams = [
  { id: "dashboard" as const, label: "Tableau de bord", icon: LayoutDashboard },
  { id: "exams" as const, label: "Mes Examens", icon: FileText },
  { id: "results" as const, label: "Résultats", icon: BarChart3 },
  { id: "calendar" as const, label: "Calendrier", icon: Calendar },
];

const tabsWithoutExams = [
  { id: "dashboard" as const, label: "Tableau de bord", icon: LayoutDashboard },
];

export function StudentDashboardHeader({
  user,
  activeTab,
  hasExams,
  onTabChange,
  onLogoClick,
  onLogout,
}: StudentDashboardHeaderProps) {
  const tabs = hasExams ? tabsWithExams : tabsWithoutExams;
  const initials = user
    ? `${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`.toUpperCase()
    : "";

  return (
    <header className="cyber-topbar sticky top-0 z-50 bg-white border-b border-[#E5E5E5]">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-3 sm:px-6 lg:h-16 lg:flex-row lg:items-center lg:justify-between lg:py-0">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-8">
          <Logo size="sm" onClick={onLogoClick} />
          <nav className="flex items-center gap-2 overflow-x-auto pt-2 pb-2 px-1 -ml-1 lg:gap-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? "bg-[#00809D] text-white"
                      : "text-[#666666] hover:text-black hover:bg-[#F5F7FB]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center justify-between gap-3 sm:justify-end sm:gap-4">
          <NotificationPanel role="student" />

          <div className="flex items-center gap-3 pl-3 border-l border-[#E5E5E5]">
            <button
              onClick={() => onTabChange("settings")}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#F5F7FB] transition-colors"
            >
              <div className="w-8 h-8 bg-[#00809D] rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">{initials || "…"}</span>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-black">{user?.fullName ?? ""}</p>
                <p className="text-xs text-[#666666]">Étudiant</p>
              </div>
            </button>

            <button
              onClick={onLogout}
              className="p-2 rounded-lg hover:bg-[#F5F7FB] transition-colors"
              title="Se déconnecter"
            >
              <LogOut className="w-5 h-5 text-black" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
