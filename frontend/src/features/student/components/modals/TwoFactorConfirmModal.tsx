import { Shield } from "lucide-react";

interface TwoFactorConfirmModalProps {
  isEnabled: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function TwoFactorConfirmModal({
  isEnabled,
  onCancel,
  onConfirm,
}: TwoFactorConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-2xl border border-[#E5E5E5] bg-white p-5 shadow-2xl sm:p-6 animate-in zoom-in-95 duration-200">
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 bg-[rgba(0,128,157,0.1)] rounded-full flex items-center justify-center mb-4">
            <Shield className="w-7 h-7 text-[#00809D]" />
          </div>
          <h2 className="text-xl font-serif text-black mb-2">
            {isEnabled ? "Désactiver l'A2F ?" : "Activer l'A2F ?"}
          </h2>
          <p className="text-sm text-[#666666] mb-6">
            {isEnabled
              ? "Êtes-vous sûr de vouloir désactiver l'authentification à deux facteurs ? La sécurité de votre compte sera réduite."
              : "L'authentification à deux facteurs renforcera la sécurité de votre compte. Souhaitez-vous vraiment l'activer ?"}
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
              className={`flex-1 px-4 py-2.5 text-white font-bold text-sm rounded-xl transition-all ${
                isEnabled ? "bg-[#FF5555] hover:bg-[#CC4444]" : "bg-[#00809D] hover:bg-[#1C1C1C]"
              }`}
            >
              Confirmer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
