import { Lock, ShieldAlert } from "lucide-react";

interface ExamLockModalProps {
  onCancel: () => void;
  onConfirm: () => void;
}

export function ExamLockModal({ onCancel, onConfirm }: ExamLockModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#00809D]/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border-2 border-[#E5E5E5] bg-white p-5 shadow-2xl sm:p-8">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-[#F5F7FB] rounded-full flex items-center justify-center mb-4">
            <ShieldAlert className="w-8 h-8 text-black" />
          </div>
          <h2 className="text-2xl font-serif text-black mb-3">Mode Examen Sécurisé</h2>
          <p className="text-[#666666] mb-6">
            En rejoignant cet examen, votre session sera verrouillée. Vous ne pourrez pas quitter
            la page ou changer d'onglet sans déclencher une alerte.
          </p>
          <div className="flex w-full flex-col gap-3 sm:flex-row">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-3 bg-white border border-[#E5E5E5] text-black font-medium rounded-xl hover:border-black transition-all"
            >
              Annuler
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-3 bg-[#00809D] text-white font-bold rounded-xl hover:bg-[#1C1C1C] transition-all flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>Rejoindre</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
