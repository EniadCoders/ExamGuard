import { useState } from "react";
import { ArrowRight, Eye, EyeOff, GraduationCap, Send, UserPlus } from "lucide-react";
import { useNavigate } from "react-router";
import {
  AuthCard,
  AuthHeading,
  AuthPageLayout,
  authFieldClass,
  authFooterTextClass,
  authLabelClass,
  authPrimaryButtonClass,
  authSecondaryButtonClass,
  authTextLinkClass,
} from "@/features/auth/components/AuthPageLayout";

type SignUpStep = "form" | "success";
type AccountType = "student" | "teacher";
type StudentIdentifierType = "apogee" | "cne";

const umpSchools = [
  "École Nationale de l'Intelligence Artificielle et du Digital de Berkane (ENIAD)",
  "École Nationale des Sciences Appliquées d'Oujda (ENSAO)",
  "École Nationale de Commerce et de Gestion d'Oujda (ENCGO)",
  "École Supérieure de Technologie d'Oujda (ESTO)",
  "École Supérieure de Technologie de Nador (ESTN)",
  "École Supérieure de l'Éducation et de la Formation d'Oujda (ESEFO)",
  "Faculté de Médecine et de Pharmacie d'Oujda (FMPO)",
  "Faculté des Sciences d'Oujda (FSO)",
  "Faculté des Lettres et Sciences Humaines d'Oujda (FLSHO)",
  "Faculté des Sciences Juridiques, Économiques et Sociales d'Oujda (FSJESO)",
  "Faculté Pluridisciplinaire de Nador (FPN)",
];

export function SignUpPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<SignUpStep>("form");
  const [accountType, setAccountType] = useState<AccountType>("student");
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
  const [institution, setInstitution] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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

    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setIsLoading(false);
    setStep("success");
  };

  const handleTeacherContact = async (e: React.FormEvent) => {
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
    setStep("success");
  };

  const passwordToggleButtonClass =
    "absolute right-[clamp(0.55rem,0.9vw,0.75rem)] top-1/2 -translate-y-1/2 rounded-full p-[clamp(0.3rem,0.7vh,0.45rem)] text-[var(--cyber-muted-text)] transition hover:bg-[rgba(123,241,255,0.08)] hover:text-white";
  const accountTypeButtonClass =
    "rounded-[0.78rem] px-3 py-[clamp(0.58rem,1.15vh,0.72rem)] text-[clamp(0.68rem,1.2vh,0.84rem)] font-semibold transition sm:rounded-[0.9rem] sm:px-4 md:rounded-[0.95rem]";

  return (
    <AuthPageLayout>
      <AuthCard
        className="md:max-w-[41rem] lg:max-w-[43rem]"
        bodyClassName="max-w-[38rem] gap-[clamp(0.58rem,1.05vh,0.85rem)]"
      >
        {step === "form" ? (
          <>
            <AuthHeading
              title="Création de compte"
              description={
                accountType === "student"
                  ? "Créez votre accès ExamGuard avec le formulaire étudiant sécurisé."
                  : "Les comptes professeurs sont créés par le support ExamGuard. Envoyez une demande et nous vous contacterons."
              }
            />

            <div className="grid grid-cols-2 gap-1 rounded-[0.95rem] border border-[rgba(117,195,214,0.14)] bg-[rgba(8,18,27,0.86)] p-1 md:rounded-[1.05rem]">
              <button
                type="button"
                onClick={() => {
                  setAccountType("student");
                  setError("");
                }}
                className={`${accountTypeButtonClass} ${
                  accountType === "student"
                    ? "cyber-button-primary"
                    : "text-[var(--cyber-muted-text)] hover:bg-[rgba(123,241,255,0.08)] hover:text-white"
                }`}
              >
                Étudiant
              </button>
              <button
                type="button"
                onClick={() => {
                  setAccountType("teacher");
                  setError("");
                }}
                className={`${accountTypeButtonClass} ${
                  accountType === "teacher"
                    ? "cyber-button-primary"
                    : "text-[var(--cyber-muted-text)] hover:bg-[rgba(123,241,255,0.08)] hover:text-white"
                }`}
              >
                Professeur
              </button>
            </div>

            {accountType === "student" ? (
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
                    <label className={authLabelClass} htmlFor="sign-up-school">
                      École
                    </label>
                    <select
                      id="sign-up-school"
                      value={school}
                      onChange={(e) => setSchool(e.target.value)}
                      required
                      className={authFieldClass}
                    >
                      <option value="">Sélectionnez votre école UMP</option>
                      {umpSchools.map((schoolName) => (
                        <option key={schoolName} value={schoolName}>
                          {schoolName}
                        </option>
                      ))}
                    </select>
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
                      onChange={(e) =>
                        setStudentIdentifierType(e.target.value as StudentIdentifierType)
                      }
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
                    <div className="relative">
                      <input
                        id="sign-up-password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Créez un mot de passe sécurisé"
                        required
                        className={`${authFieldClass} pr-11 sm:pr-12`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((value) => !value)}
                        className={passwordToggleButtonClass}
                        aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                      >
                        {showPassword ? (
                          <EyeOff className="h-[clamp(0.85rem,1.5vh,1rem)] w-[clamp(0.85rem,1.5vh,1rem)]" />
                        ) : (
                          <Eye className="h-[clamp(0.85rem,1.5vh,1rem)] w-[clamp(0.85rem,1.5vh,1rem)]" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className={authLabelClass} htmlFor="sign-up-confirm-password">
                      Confirmer le mot de passe
                    </label>
                    <div className="relative">
                      <input
                        id="sign-up-confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Repetez votre mot de passe"
                        required
                        className={`${authFieldClass} pr-11 sm:pr-12`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((value) => !value)}
                        className={passwordToggleButtonClass}
                        aria-label={showConfirmPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-[clamp(0.85rem,1.5vh,1rem)] w-[clamp(0.85rem,1.5vh,1rem)]" />
                        ) : (
                          <Eye className="h-[clamp(0.85rem,1.5vh,1rem)] w-[clamp(0.85rem,1.5vh,1rem)]" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {error ? (
                  <div className="rounded-[0.95rem] border border-[rgba(255,123,130,0.22)] bg-[rgba(255,123,130,0.08)] px-4 py-3 text-[clamp(0.72rem,1.12vh,0.84rem)] font-semibold text-[var(--cyber-danger)] md:rounded-[1.05rem]">
                    {error}
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={isLoading}
                  className={authPrimaryButtonClass}
                >
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
            ) : (
              <form onSubmit={handleTeacherContact} className="flex flex-col gap-[clamp(0.62rem,1.2vh,0.9rem)]">
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

                <div>
                  <label className={authLabelClass} htmlFor="teacher-institution">
                    Établissement
                  </label>
                  <select
                    id="teacher-institution"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    required
                    className={authFieldClass}
                  >
                    <option value="">Sélectionnez votre école UMP</option>
                    {umpSchools.map((schoolName) => (
                      <option key={schoolName} value={schoolName}>
                        {schoolName}
                      </option>
                    ))}
                  </select>
                </div>

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
        ) : (
          <>
            <AuthHeading
              title={accountType === "student" ? "Compte prêt" : "Demande préparée"}
              description={
                accountType === "student"
                  ? "Votre accès est préparé. Continuez vers la connexion pour entrer dans la plateforme."
                  : "Votre application email devrait s'ouvrir avec un message adressé à support@examguard.com."
              }
            />

            <div className="rounded-[1rem] border border-[rgba(123,241,255,0.18)] bg-[rgba(11,27,38,0.6)] px-4 py-4 text-center md:rounded-[1.05rem]">
              {accountType === "teacher" ? (
                <GraduationCap className="mx-auto mb-3 h-7 w-7 text-[var(--cyber-accent)]" />
              ) : null}
              <p className="text-[clamp(0.8rem,1.35vh,0.95rem)] font-semibold text-[var(--cyber-text)]">
                {fullName}
              </p>
              <p className="mt-1 text-[clamp(0.74rem,1.18vh,0.88rem)] text-[var(--cyber-muted-text)]">
                {email}
              </p>
              {accountType === "student" ? (
                <div className="mt-3 space-y-1 text-[clamp(0.7rem,1.08vh,0.82rem)] text-[var(--cyber-muted-text)]">
                  <p>{school}</p>
                  <p>
                    {program} - {department}
                  </p>
                  <p>
                    {studentIdentifierType === "apogee" ? "APOGEE" : "CNE"}:{" "}
                    {studentIdentifier}
                  </p>
                </div>
              ) : null}
            </div>

            <div className="flex flex-col gap-[clamp(0.5rem,1vh,0.7rem)]">
              <button
                type="button"
                onClick={() => navigate("/")}
                className={authPrimaryButtonClass}
              >
                <span className="inline-flex items-center gap-2">
                  Aller à la connexion
                  <ArrowRight className="h-[clamp(0.9rem,1.55vh,1rem)] w-[clamp(0.9rem,1.55vh,1rem)]" />
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep("form");
                  setFullName("");
                  setEmail("");
                  setSchool("");
                  setProgram("");
                  setDepartment("");
                  setStudentIdentifierType("apogee");
                  setStudentIdentifier("");
                  setPassword("");
                  setConfirmPassword("");
                  setInstitution("");
                  setMessage("");
                  setError("");
                }}
                className={authSecondaryButtonClass}
              >
                {accountType === "student" ? "Modifier les informations" : "Modifier la demande"}
              </button>
            </div>
          </>
        )}
      </AuthCard>
    </AuthPageLayout>
  );
}
