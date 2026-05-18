/**
 * Formulaire de demande de création de compte professeur. Les comptes
 * enseignants ne sont pas auto-créés : ce composant assemble un mailto
 * pré-rempli vers le support ExamGuard et notifie le parent du succès.
 */
import { useState } from "react";
import { Send } from "lucide-react";
import {
  authFieldClass,
  authLabelClass,
  authPrimaryButtonClass,
} from "@/features/auth/components/AuthPageLayout";
import { SchoolSelect } from "@/features/auth/components/SchoolSelect";

export interface TeacherContactValues {
  fullName: string;
  email: string;
  institution: string;
}

interface TeacherContactFormProps {
  onSuccess: (values: TeacherContactValues) => void;
}

/** Formulaire de demande professeur : assemble un mailto pré-rempli vers le support. */
export function TeacherContactForm({ onSuccess }: TeacherContactFormProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [institution, setInstitution] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Valide les champs requis, construit l'URL mailto et notifie le parent du succès.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!fullName.trim() || !email.trim() || !institution.trim()) {
      setError("Veuillez renseigner votre nom, votre email et votre établissement.");
      return;
    }

    const subject = encodeURIComponent("Demande de création de compte professeur");
    const body = encodeURIComponent(
      [
        "Demande de création de compte professeur",
        "",
        `Nom complet: ${fullName.trim()}`,
        `Email: ${email.trim()}`,
        `Établissement: ${institution.trim()}`,
        "",
        "Message:",
        message.trim() || "Aucun détail supplémentaire.",
      ].join("\n"),
    );

    window.location.href = `mailto:support@examguard.com?subject=${subject}&body=${body}`;
    onSuccess({
      fullName: fullName.trim(),
      email: email.trim(),
      institution: institution.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-[clamp(0.62rem,1.2vh,0.9rem)]">
      <div className="rounded-[0.95rem] border border-[rgba(123,241,255,0.16)] bg-[rgba(11,27,38,0.58)] px-4 py-3 text-[clamp(0.72rem,1.12vh,0.84rem)] leading-[1.45] text-[var(--cyber-muted-text)] md:rounded-[1.05rem]">
        Les professeurs ne doivent pas utiliser le formulaire d'inscription standard. Contactez-nous et notre support créera le compte.
      </div>

      <div>
        <label className={authLabelClass} htmlFor="teacher-name">
          Nom complet
        </label>
        <input
          id="teacher-name"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Votre nom complet"
          required
          className={authFieldClass}
        />
      </div>

      <div>
        <label className={authLabelClass} htmlFor="teacher-email">
          Adresse email
        </label>
        <input
          id="teacher-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@institution.com"
          required
          className={authFieldClass}
        />
      </div>

      <SchoolSelect
        id="teacher-institution"
        label="Établissement"
        value={institution}
        onChange={setInstitution}
        required
      />

      <div>
        <label className={authLabelClass} htmlFor="teacher-message">
          Message
        </label>
        <textarea
          id="teacher-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ajoutez les détails utiles pour le support"
          rows={3}
          className={`${authFieldClass} min-h-[5.5rem] resize-none py-[clamp(0.75rem,1.25vh,0.9rem)] leading-[1.45]`}
        />
      </div>

      {error ? (
        <div className="rounded-[0.95rem] border border-[rgba(255,123,130,0.22)] bg-[rgba(255,123,130,0.08)] px-4 py-3 text-[clamp(0.72rem,1.12vh,0.84rem)] font-semibold text-[var(--cyber-danger)] md:rounded-[1.05rem]">
          {error}
        </div>
      ) : null}

      <button type="submit" className={authPrimaryButtonClass}>
        <span className="inline-flex items-center gap-2">
          <Send className="h-[clamp(0.9rem,1.55vh,1rem)] w-[clamp(0.9rem,1.55vh,1rem)]" />
          Contacter le support
        </span>
      </button>
    </form>
  );
}
