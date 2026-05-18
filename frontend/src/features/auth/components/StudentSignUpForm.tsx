/**
 * Formulaire complet d'inscription étudiant : identité, école, filière,
 * département, identifiant APOGEE/CNE et mot de passe. Valide localement,
 * appelle `signupStudent()` et remonte les valeurs soumises via
 * `onSuccess` pour alimenter l'écran de confirmation.
 */
import { useState } from "react";
import { UserPlus } from "lucide-react";
import { signupStudent } from "@/features/auth/api";
import { ApiError } from "@/shared/lib/api";
import {
  authFieldClass,
  authLabelClass,
  authPrimaryButtonClass,
} from "@/features/auth/components/AuthPageLayout";
import { PasswordInput } from "@/features/auth/components/PasswordInput";
import { SchoolSelect } from "@/features/auth/components/SchoolSelect";
import { PasswordStrengthMeter } from "@/features/teacher/components/TeacherProfileControls";

export type StudentIdentifierType = "apogee" | "cne";

export interface StudentSignUpValues {
  fullName: string;
  email: string;
  school: string;
  program: string;
  department: string;
  studentIdentifierType: StudentIdentifierType;
  studentIdentifier: string;
}

interface StudentSignUpFormProps {
  onSuccess: (values: StudentSignUpValues) => void;
}

/** Formulaire étudiant complet : valide les champs, appelle l'API d'inscription, remonte les valeurs au succès. */
export function StudentSignUpForm({ onSuccess }: StudentSignUpFormProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [school, setSchool] = useState("");
  const [program, setProgram] = useState("");
  const [department, setDepartment] = useState("");
  const [studentIdentifierType, setStudentIdentifierType] =
    useState<StudentIdentifierType>("apogee");
  const [studentIdentifier, setStudentIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Vérifie présence des champs, longueur du mot de passe et correspondance avant l'appel `signupStudent`.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (
      !fullName.trim() ||
      !email.trim() ||
      !school.trim() ||
      !program.trim() ||
      !department.trim() ||
      !studentIdentifier.trim()
    ) {
      setError("Veuillez compléter tous les champs obligatoires.");
      return;
    }

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    const values: StudentSignUpValues = {
      fullName: fullName.trim(),
      email: email.trim(),
      school: school.trim(),
      program: program.trim(),
      department: department.trim(),
      studentIdentifierType,
      studentIdentifier: studentIdentifier.trim(),
    };

    setIsLoading(true);
    try {
      await signupStudent({ ...values, password });
      onSuccess(values);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Création du compte impossible. Réessayez.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-[clamp(0.62rem,1.2vh,0.9rem)]">
      <div className="grid gap-[clamp(0.62rem,1.2vh,0.9rem)] sm:grid-cols-2">
        <div>
          <label className={authLabelClass} htmlFor="sign-up-name">
            Nom complet
          </label>
          <input
            id="sign-up-name"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Votre nom complet"
            required
            className={authFieldClass}
          />
        </div>

        <div>
          <label className={authLabelClass} htmlFor="sign-up-email">
            Adresse email
          </label>
          <input
            id="sign-up-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
            required
            className={authFieldClass}
          />
        </div>

        <div className="sm:col-span-2">
          <SchoolSelect id="sign-up-school" value={school} onChange={setSchool} required />
        </div>

        <div>
          <label className={authLabelClass} htmlFor="sign-up-program">
            Filière
          </label>
          <input
            id="sign-up-program"
            type="text"
            value={program}
            onChange={(e) => setProgram(e.target.value)}
            placeholder="Votre filière"
            required
            className={authFieldClass}
          />
        </div>

        <div>
          <label className={authLabelClass} htmlFor="sign-up-department">
            Département
          </label>
          <input
            id="sign-up-department"
            type="text"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            placeholder="Votre département"
            required
            className={authFieldClass}
          />
        </div>

        <div>
          <label className={authLabelClass} htmlFor="student-id-type">
            Type d'identifiant
          </label>
          <select
            id="student-id-type"
            value={studentIdentifierType}
            onChange={(e) => setStudentIdentifierType(e.target.value as StudentIdentifierType)}
            className={authFieldClass}
          >
            <option value="apogee">APOGEE</option>
            <option value="cne">CNE / Massar</option>
          </select>
        </div>

        <div>
          <label className={authLabelClass} htmlFor="student-id-value">
            {studentIdentifierType === "apogee" ? "APOGEE" : "CNE / Massar"}
          </label>
          <input
            id="student-id-value"
            type="text"
            value={studentIdentifier}
            onChange={(e) => setStudentIdentifier(e.target.value)}
            placeholder={
              studentIdentifierType === "apogee"
                ? "Votre numéro APOGEE"
                : "Votre code CNE / Massar"
            }
            required
            className={authFieldClass}
          />
        </div>

        <div>
          <label className={authLabelClass} htmlFor="sign-up-password">
            Mot de passe
          </label>
          <PasswordInput
            id="sign-up-password"
            value={password}
            onChange={setPassword}
            placeholder="Créez un mot de passe sécurisé"
            required
          />
          <PasswordStrengthMeter password={password} />
        </div>

        <div>
          <label className={authLabelClass} htmlFor="sign-up-confirm-password">
            Confirmer le mot de passe
          </label>
          <PasswordInput
            id="sign-up-confirm-password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            placeholder="Repetez votre mot de passe"
            required
          />
        </div>
      </div>

      {error ? (
        <div className="rounded-[0.95rem] border border-[rgba(255,123,130,0.22)] bg-[rgba(255,123,130,0.08)] px-4 py-3 text-[clamp(0.72rem,1.12vh,0.84rem)] font-semibold text-[var(--cyber-danger)] md:rounded-[1.05rem]">
          {error}
        </div>
      ) : null}

      <button type="submit" disabled={isLoading} className={authPrimaryButtonClass}>
        {isLoading ? (
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-[rgba(4,17,23,0.18)] border-t-[rgba(4,17,23,0.95)]" />
        ) : (
          <span className="inline-flex items-center gap-2">
            <UserPlus className="h-[clamp(0.9rem,1.55vh,1rem)] w-[clamp(0.9rem,1.55vh,1rem)]" />
            Créer le compte
          </span>
        )}
      </button>
    </form>
  );
}
