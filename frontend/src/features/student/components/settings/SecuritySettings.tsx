/**
 * Section "Sécurité" des paramètres étudiant : liste des sessions actives
 * (web / mobile) avec icône d'appareil et bouton de demande de révocation
 * (qui ouvre `RevokeSessionModal`).
 */
import { Monitor, Smartphone } from "lucide-react";

interface SecuritySettingsProps {
  activeSessions: string[];
  onRequestRevokeSession: (device: string) => void;
}

const allSessions = [
  { device: "MacBook Pro", location: "Paris, France", current: true, icon: Monitor },
  { device: "iPhone 14", location: "Paris, France", current: false, icon: Smartphone },
];

export function SecuritySettings({
  activeSessions,
  onRequestRevokeSession,
}: SecuritySettingsProps) {
  const visibleSessions = allSessions.filter((s) => activeSessions.includes(s.device));

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif text-black mb-6">Sécurité du compte</h2>
      <div className="space-y-5">
        <div>
          <h3 className="font-semibold text-black mb-3">Sessions actives</h3>
          <div className="space-y-3">
            {visibleSessions.map((session, idx) => {
              const Icon = session.icon;
              return (
                <div
                  key={idx}
                  className="flex flex-col gap-4 rounded-xl bg-[#F5F7FB] p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <p className="font-semibold text-black text-sm">
                        {session.device}
                        {session.current && (
                          <span className="ml-2 px-2 py-0.5 bg-[#00809D] text-white text-xs rounded-full">
                            Actuelle
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-[#666666]">{session.location}</p>
                    </div>
                  </div>
                  {!session.current && (
                    <button
                      onClick={() => onRequestRevokeSession(session.device)}
                      className="text-sm text-[#666666] hover:text-[#FF5555] font-medium transition-colors"
                    >
                      Révoquer
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-5 bg-[#F5F7FB] border border-[#E5E5E5] rounded-xl">
          <p className="font-semibold text-black mb-2">Supprimer le compte</p>
          <p className="text-sm text-[#666666] mb-4">
            Cette action est irréversible. Toutes vos données seront définitivement supprimées.
          </p>
          <button className="px-4 py-2 bg-white border border-black text-black text-sm font-bold rounded-lg hover:bg-[#00809D] hover:text-white transition-all">
            Supprimer mon compte
          </button>
        </div>
      </div>
    </div>
  );
}
