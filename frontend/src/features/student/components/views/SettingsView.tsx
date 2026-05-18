/**
 * Vue "Paramètres" : conteneur à onglets latéraux qui regroupe les sections
 * Profil, Mot de passe, Notifications et Sécurité, et orchestre l'ouverture
 * de `RevokeSessionModal` depuis la sous-section Sécurité.
 */
import { Bell, Lock, Shield, User } from "lucide-react";
import type { DashboardUser } from "@/features/student/api";
import { ProfileSettings, type ProfileMessage } from "@/features/student/components/settings/ProfileSettings";
import { PasswordSettings } from "@/features/student/components/settings/PasswordSettings";
import { NotificationSettings } from "@/features/student/components/settings/NotificationSettings";
import { SecuritySettings } from "@/features/student/components/settings/SecuritySettings";

export type SettingsTab = "profile" | "password" | "notifications" | "security";

interface SettingsViewProps {
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
  user: DashboardUser | null;

  // Profile
  profileFirstName: string;
  profileLastName: string;
  profilePhone: string;
  profileSchool: string;
  profileSaving: boolean;
  profileMessage: ProfileMessage | null;
  onProfileFirstNameChange: (value: string) => void;
  onProfileLastNameChange: (value: string) => void;
  onProfilePhoneChange: (value: string) => void;
  onProfileSchoolChange: (value: string) => void;
  onSaveProfile: () => void;

  // Security
  activeSessions: string[];
  onRequestRevokeSession: (device: string) => void;
}

const tabs = [
  { id: "profile" as const, label: "Profil", icon: User },
  { id: "password" as const, label: "Mot de passe", icon: Lock },
  { id: "notifications" as const, label: "Notifications", icon: Bell },
  { id: "security" as const, label: "Sécurité", icon: Shield },
];

export function SettingsView(props: SettingsViewProps) {
  const { activeTab, onTabChange } = props;

  return (
    <div className="space-y-6">
      <h1 className="mb-6 text-3xl font-serif text-black sm:text-4xl">Paramètres</h1>

      <div className="flex flex-col gap-6 xl:flex-row">
        <div className="dashboard-card w-full shrink-0 p-4 xl:w-64">
          <nav className="grid grid-cols-2 gap-1 sm:grid-cols-4 xl:grid-cols-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left font-medium transition-all ${
                    activeTab === tab.id
                      ? "bg-[#00809D] text-white"
                      : "text-[#666666] hover:bg-[#F5F7FB] hover:text-black"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="dashboard-card min-w-0 flex-1 p-5 sm:p-8">
          {activeTab === "profile" && (
            <ProfileSettings
              user={props.user}
              firstName={props.profileFirstName}
              lastName={props.profileLastName}
              phone={props.profilePhone}
              school={props.profileSchool}
              saving={props.profileSaving}
              message={props.profileMessage}
              onFirstNameChange={props.onProfileFirstNameChange}
              onLastNameChange={props.onProfileLastNameChange}
              onPhoneChange={props.onProfilePhoneChange}
              onSchoolChange={props.onProfileSchoolChange}
              onSave={props.onSaveProfile}
            />
          )}
          {activeTab === "password" && <PasswordSettings />}
          {activeTab === "notifications" && <NotificationSettings />}
          {activeTab === "security" && (
            <SecuritySettings
              activeSessions={props.activeSessions}
              onRequestRevokeSession={props.onRequestRevokeSession}
            />
          )}
        </div>
      </div>
    </div>
  );
}
