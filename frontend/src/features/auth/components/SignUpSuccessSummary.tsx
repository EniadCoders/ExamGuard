import { ArrowRight, GraduationCap } from "lucide-react";
import {
  authPrimaryButtonClass,
  authSecondaryButtonClass,
} from "@/features/auth/components/AuthPageLayout";
import type { StudentSignUpValues } from "@/features/auth/components/StudentSignUpForm";
import type { TeacherContactValues } from "@/features/auth/components/TeacherContactForm";

type Summary =
  | { kind: "student"; values: StudentSignUpValues }
  | { kind: "teacher"; values: TeacherContactValues };

interface SignUpSuccessSummaryProps {
  summary: Summary;
  onContinue: () => void;
  onEdit: () => void;
}

export function SignUpSuccessSummary({ summary, onContinue, onEdit }: SignUpSuccessSummaryProps) {
  const isStudent = summary.kind === "student";

  return (
    <>
      <div className="rounded-[1rem] border border-[rgba(123,241,255,0.18)] bg-[rgba(11,27,38,0.6)] px-4 py-4 text-center md:rounded-[1.05rem]">
        {!isStudent ? (
          <GraduationCap className="mx-auto mb-3 h-7 w-7 text-[var(--cyber-accent)]" />
        ) : null}
        <p className="text-[clamp(0.8rem,1.35vh,0.95rem)] font-semibold text-[var(--cyber-text)]">
          {summary.values.fullName}
        </p>
        <p className="mt-1 text-[clamp(0.74rem,1.18vh,0.88rem)] text-[var(--cyber-muted-text)]">
          {summary.values.email}
        </p>
        {summary.kind === "student" ? (
          <div className="mt-3 space-y-1 text-[clamp(0.7rem,1.08vh,0.82rem)] text-[var(--cyber-muted-text)]">
            <p>{summary.values.school}</p>
            <p>
              {summary.values.program} - {summary.values.department}
            </p>
            <p>
              {summary.values.studentIdentifierType === "apogee" ? "APOGEE" : "CNE"}:{" "}
              {summary.values.studentIdentifier}
            </p>
          </div>
        ) : null}
      </div>

      <div className="flex flex-col gap-[clamp(0.5rem,1vh,0.7rem)]">
        <button type="button" onClick={onContinue} className={authPrimaryButtonClass}>
          <span className="inline-flex items-center gap-2">
            Aller à la connexion
            <ArrowRight className="h-[clamp(0.9rem,1.55vh,1rem)] w-[clamp(0.9rem,1.55vh,1rem)]" />
          </span>
        </button>
        <button type="button" onClick={onEdit} className={authSecondaryButtonClass}>
          {isStudent ? "Modifier les informations" : "Modifier la demande"}
        </button>
      </div>
    </>
  );
}
