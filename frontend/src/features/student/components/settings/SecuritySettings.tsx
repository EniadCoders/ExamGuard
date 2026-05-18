import { Monitor, Shield, Smartphone } from "lucide-react";

interface SecuritySettingsProps {
  is2FAEnabled: boolean;
  activeSessions: string[];
  onRequest2FAToggle: () => void;
  onRequestRevokeSession: (device: string) => void;
}

const allSessions = [
  { device: "MacBook Pro", location: "Paris, France", current: true, icon: Monitor },
  { device: "iPhone 14", location: "Paris, France", current: false, icon: Smartphone },
];

export function SecuritySettings({
  is2FAEnabled,
  activeSessions,
  onRequest2FAToggle,
  onRequestRevokeSession,
}: SecuritySettingsProps) {
  const visibleSessions = allSessions.filter((s) => activeSessions.includes(s.device));

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif text-black mb-6">Sécurité du compte</h2>
      <div className="space-y-5">
        <div className="p-5 bg-[#F5F7FB] rounded-xl">
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-black" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-black">Authentification à deux facteurs</p>
                  {is2FAEnabled && (
                    <span className="px-2 py-0.5 bg-[#2ECC71]/10 text-[#2ECC71] text-[10px] uppercase tracking-wider font-bold rounded-full">
                      Activé
                    </span>
                  )}
                </div>
                <p className="text-sm text-[#666666]">
                  Ajouter une couche de sécurité supplémentaire
                </p>
              </div>
            </div>
            <button
              onClick={onRequest2FAToggle}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
                is2FAEnabled
                  ? "bg-white border border-[#E5E5E5] text-black hover:bg-[#FF5555] hover:text-white hover:border-[#FF5555]"
                  : "bg-[#00809D] text-white hover:bg-[#1C1C1C]"
              }`}
            >
              {is2FAEnabled ? "Désactiver" : "Activer"}
            </button>
          </div>
        </div>

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
