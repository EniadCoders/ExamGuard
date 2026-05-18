/**
 * Select des établissements UMP utilisé dans les formulaires d'inscription
 * (étudiant et demande professeur). S'appuie sur la liste partagée
 * `umpSchools` pour garantir une seule source de vérité.
 */
import { umpSchools } from "@/shared/lib/ump-schools";
import { authFieldClass, authLabelClass } from "@/features/auth/components/AuthPageLayout";

interface SchoolSelectProps {
  id: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
}

/** `<select>` listant les écoles UMP avec un placeholder vide en première option. */
export function SchoolSelect({
  id,
  label = "École",
  value,
  onChange,
  required,
  placeholder = "Sélectionnez votre école UMP",
}: SchoolSelectProps) {
  return (
    <div>
      <label className={authLabelClass} htmlFor={id}>
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className={authFieldClass}
      >
        <option value="">{placeholder}</option>
        {umpSchools.map((schoolName) => (
          <option key={schoolName} value={schoolName}>
            {schoolName}
          </option>
        ))}
      </select>
    </div>
  );
}
