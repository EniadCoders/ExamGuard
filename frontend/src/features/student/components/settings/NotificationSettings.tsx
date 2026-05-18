/**
 * Section "Notifications" des paramètres étudiant : interrupteurs pour activer
 * ou désactiver les rappels d'examens, l'alerte de publication des résultats
 * et les annonces de l'établissement.
 */
import { ToggleSwitch } from "@/shared/components/ToggleSwitch";

const notifications = [
  {
    key: "examReminders",
    label: "Rappels d'examen",
    desc: "Recevoir des notifications avant chaque examen",
    default: true,
  },
  {
    key: "systemUpdates",
    label: "Mises à jour système",
    desc: "Recevoir les annonces et mises à jour de la plateforme",
    default: false,
  },
];

export function NotificationSettings() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif text-black mb-6">Préférences de notification</h2>
      <div className="space-y-5">
        {notifications.map((setting) => (
          <div
            key={setting.key}
            className="flex flex-col gap-4 rounded-xl bg-[#F5F7FB] p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex-1">
              <p className="font-semibold text-black mb-1">{setting.label}</p>
              <p className="text-sm text-[#666666]">{setting.desc}</p>
            </div>
            <ToggleSwitch defaultChecked={setting.default} />
          </div>
        ))}
      </div>
    </div>
  );
}
