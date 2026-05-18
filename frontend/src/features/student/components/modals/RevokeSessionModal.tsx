/**
 * Modal de confirmation avant la révocation d'une session active depuis la
 * page Paramètres → Sécurité (déconnexion forcée d'un autre appareil).
 */
import { AlertTriangle } from "lucide-react";

interface RevokeSessionModalProps {
  device: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export function RevokeSessionModal({ device, onCancel, onConfirm }: RevokeSessionModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-2xl border border-[#E5E5E5] bg-white p-5 shadow-2xl sm:p-6 animate-in zoom-in-95 duration-200">
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 bg-[rgba(255,85,85,0.1)] rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-7 h-7 text-[#FF5555]" />
          </div>
          <h2 className="text-xl font-serif text-black mb-2">Révoquer la session ?</h2>
          <p className="text-sm text-[#666666] mb-6">
            Êtes-vous sûr de vouloir déconnecter l'appareil <strong>{device}</strong> ? Il devra
            se reconnecter.
          </p>
          <div className="flex w-full gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 bg-white border border-[#E5E5E5] text-black font-medium text-sm rounded-xl hover:border-black transition-all"
            >
              Annuler
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2.5 bg-[#FF5555] text-white font-bold text-sm rounded-xl hover:bg-[#CC4444] transition-all"
            >
              Révoquer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
