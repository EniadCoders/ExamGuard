interface JoinExamModalProps {
  step: "input" | "success";
  code: string;
  error: string;
  loading: boolean;
  joinedExamTitle: string;
  onCodeChange: (value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}

export function JoinExamModal({
  step,
  code,
  error,
  loading,
  joinedExamTitle,
  onCodeChange,
  onSubmit,
  onClose,
}: JoinExamModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-[#E5E5E5] bg-white p-6 shadow-2xl">
        {step === "input" ? (
          <>
            <h3 className="text-xl font-bold text-black mb-2">Rejoindre un examen</h3>
            <p className="text-sm text-[#666] mb-4">
              Saisissez le code fourni par votre professeur.
            </p>
            <input
              autoFocus
              type="text"
              value={code}
              onChange={(e) => onCodeChange(e.target.value.toUpperCase())}
              onKeyDown={(e) => {
                if (e.key === "Enter") onSubmit();
              }}
              placeholder="ex: JAVAEE"
              className={`w-full rounded-xl border px-4 py-3 text-center text-lg font-mono tracking-widest text-black focus:outline-none focus:ring-2 ${
                error
                  ? "border-red-500 focus:ring-red-500"
                  : "border-[#E5E5E5] focus:ring-[#00809D]"
              }`}
            />
            {error ? (
              <p className="mt-2 text-sm font-semibold text-red-600">{error}</p>
            ) : null}
            <div className="mt-5 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 rounded-xl border border-[#E5E5E5] px-4 py-3 font-semibold text-black hover:bg-[#F5F7FB]"
              >
                Annuler
              </button>
              <button
                onClick={onSubmit}
                disabled={loading || !code.trim()}
                className="flex-1 rounded-xl bg-[#00809D] px-4 py-3 font-semibold text-white hover:bg-[#006B82] disabled:opacity-50"
              >
                {loading ? "..." : "Rejoindre"}
              </button>
            </div>
          </>
        ) : (
          <>
            <h3 className="text-xl font-bold text-black mb-2">Inscription confirmée</h3>
            <p className="text-sm text-[#666] mb-5">
              Vous êtes maintenant inscrit à <strong>{joinedExamTitle}</strong>.
            </p>
            <button
              onClick={onClose}
              className="w-full rounded-xl bg-[#00809D] px-4 py-3 font-semibold text-white hover:bg-[#006B82]"
            >
              OK
            </button>
          </>
        )}
      </div>
    </div>
  );
}
