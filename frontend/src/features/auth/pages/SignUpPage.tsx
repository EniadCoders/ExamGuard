import { useState } from "react";
import { useNavigate } from "react-router";
import {
  AuthCard,
  AuthHeading,
  AuthPageLayout,
  authFooterTextClass,
  authTextLinkClass,
} from "@/features/auth/components/AuthPageLayout";
import { RoleTabs } from "@/features/auth/components/RoleTabs";
import {
  StudentSignUpForm,
  type StudentSignUpValues,
} from "@/features/auth/components/StudentSignUpForm";
import {
  TeacherContactForm,
  type TeacherContactValues,
} from "@/features/auth/components/TeacherContactForm";
import { SignUpSuccessSummary } from "@/features/auth/components/SignUpSuccessSummary";

type AccountType = "student" | "teacher";
type Summary =
  | { kind: "student"; values: StudentSignUpValues }
  | { kind: "teacher"; values: TeacherContactValues };

const accountOptions = [
  { value: "student" as const, label: "Étudiant" },
  { value: "teacher" as const, label: "Professeur" },
];

export function SignUpPage() {
  const navigate = useNavigate();
  const [accountType, setAccountType] = useState<AccountType>("student");
  const [summary, setSummary] = useState<Summary | null>(null);

  return (
    <AuthPageLayout>
      <AuthCard
        className="md:max-w-[41rem] lg:max-w-[43rem]"
        bodyClassName="max-w-[38rem] gap-[clamp(0.58rem,1.05vh,0.85rem)]"
      >
        {summary ? (
          <>
            <AuthHeading
              title={summary.kind === "student" ? "Compte prêt" : "Demande préparée"}
              description={
                summary.kind === "student"
                  ? "Votre accès est préparé. Continuez vers la connexion pour entrer dans la plateforme."
                  : "Votre application email devrait s'ouvrir avec un message adressé à support@examguard.com."
              }
            />
            <SignUpSuccessSummary
              summary={summary}
              onContinue={() => navigate("/")}
              onEdit={() => setSummary(null)}
            />
          </>
        ) : (
          <>
            <AuthHeading
              title="Création de compte"
              description={
                accountType === "student"
                  ? "Créez votre accès ExamGuard avec le formulaire étudiant sécurisé."
                  : "Les comptes professeurs sont créés par le support ExamGuard. Envoyez une demande et nous vous contacterons."
              }
            />

            <RoleTabs value={accountType} onChange={setAccountType} options={accountOptions} />

            {accountType === "student" ? (
              <StudentSignUpForm
                onSuccess={(values) => setSummary({ kind: "student", values })}
              />
            ) : (
              <TeacherContactForm
                onSuccess={(values) => setSummary({ kind: "teacher", values })}
              />
            )}

            <div className={`space-y-[clamp(0.28rem,0.7vh,0.45rem)] text-center ${authFooterTextClass}`}>
              <p className="text-[var(--cyber-muted-text)]">
                Vous avez déjà un compte ?{" "}
                <button
                  type="button"
                  className={authTextLinkClass}
                  onClick={() => navigate("/")}
                >
                  Se connecter
                </button>
              </p>
            </div>
          </>
        )}
      </AuthCard>
    </AuthPageLayout>
  );
}
