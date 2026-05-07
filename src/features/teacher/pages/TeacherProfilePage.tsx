import { useState, useRef } from "react";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  BookOpen,
  Save,
  Camera,
  Bell,
  Shield,
  LogOut,
  AlertCircle,
  Globe,
  Hash,
  Trash2,
  Lock,
  X as XIcon,
  Check,
} from "lucide-react";
import { useNavigate } from "react-router";
import { GridBackground } from "@/shared/components/GridBackground";
import { Logo } from "@/shared/components/BrandLogo";
import { NotificationPanel } from "@/shared/components/NotificationPanel";
import {
  DashboardCard,
  DashboardSectionCard,
  DashboardStatusBadge,
} from "@/shared/components/dashboard/DashboardCard";
import {
  PasswordStrengthMeter as PasswordStrength,
  ProfileField as Field,
  ProfilePasswordField as PasswordField,
  ProfileSectionCard as Section,
  ProfileToast as Toast,
  ToggleSwitch,
} from "@/features/teacher/components/TeacherProfileControls";
import {
  mockActiveSessions as activeSessions,
  teacherProfileSections as sections,
  type TeacherProfileSectionId,
} from "@/features/teacher/teacher.data";

export function TeacherProfilePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile info state
  const [firstName, setFirstName] = useState("Jean-Pierre");
  const [lastName, setLastName] = useState("Dupont");
  const [email, setEmail] = useState("jp.dupont@univ.fr");
  const [phone, setPhone] = useState("+33 6 12 34 56 78");
  const [department, setDepartment] = useState("Informatique & Systèmes");
  const [title, setTitle] = useState("Professeur des universités");
  const [location, setLocation] = useState("Université Paris-Saclay");
  const [bio, setBio] = useState("Spécialiste en architecture logicielle et systèmes d'information. 12 ans d'expérience en enseignement supérieur et recherche.");
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Password state
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");

  // UI state
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [activeSection, setActiveSection] = useState<TeacherProfileSectionId>("info");

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveProfile = () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      showToast("Veuillez remplir tous les champs obligatoires.", "error");
      return;
    }
    showToast("Profil mis à jour avec succès.");
  };

  const handleChangePassword = () => {
    if (!currentPwd || !newPwd || !confirmPwd) {
      showToast("Veuillez remplir tous les champs de mot de passe.", "error");
      return;
    }
    if (newPwd !== confirmPwd) {
      showToast("Les mots de passe ne correspondent pas.", "error");
      return;
    }
    if (newPwd.length < 8) {
      showToast("Le mot de passe doit contenir au moins 8 caractères.", "error");
      return;
    }
    setCurrentPwd(""); setNewPwd(""); setConfirmPwd("");
    showToast("Mot de passe modifié avec succès.");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const file = input.files?.[0];
    input.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showToast("Format de fichier non pris en charge. Utilisez JPG ou PNG.", "error");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      showToast("Image trop volumineuse. Taille maximale : 2 Mo.", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setProfileImage(ev.target?.result as string);
      showToast("Photo de profil mise à jour.");
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="cyber-profile-page relative min-h-screen overflow-hidden bg-[#FAFAFA]">
      <GridBackground variant="dashboard" />
      <div className="relative z-10">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <header className="cyber-topbar sticky top-0 z-40 border-b border-[#E5E5E5] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-3 px-4 py-3 sm:min-h-16 sm:px-6 sm:py-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/teacher")}
              className="flex items-center gap-2 p-2 hover:bg-[#F5F5F5] rounded-lg transition-colors text-[#666666] hover:text-black"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium hidden sm:block">Retour au dashboard</span>
            </button>
            <div className="w-px h-6 bg-[#E5E5E5]" />
            <Logo size="md" to="/teacher" />
          </div>
          <div className="flex items-center gap-2">
            <NotificationPanel role="admin" />
            <button
              onClick={() => navigate("/")}
              className="p-2 hover:bg-[#F5F5F5] rounded-lg transition-colors ml-1"
              title="Se déconnecter"
            >
              <LogOut className="w-5 h-5 text-black" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-4 py-6 sm:px-6 sm:py-8">
        {/* Page title */}
        <div className="cyber-page-intro mb-8">
          <h1 className="text-xl font-bold text-black sm:text-2xl">Paramètres du profil</h1>
          <p className="text-sm text-[#666666] mt-1">Gérez vos informations personnelles, sécurité et préférences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Avatar card */}
            <DashboardCard interactive className="p-6 flex flex-col items-center gap-4">
              <div className="relative group">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  aria-label="Changer la photo de profil"
                  className="relative w-28 h-28 rounded-full border-2 border-[rgba(123,241,255,0.35)] bg-[rgba(11,27,38,0.72)] flex items-center justify-center overflow-hidden transition-all hover:border-[rgba(123,241,255,0.7)] focus:outline-none focus:ring-2 focus:ring-[rgba(123,241,255,0.5)] focus:ring-offset-2 focus:ring-offset-[rgba(6,15,22,0.95)] shadow-[0_0_0_4px_rgba(11,27,38,0.6),0_8px_24px_rgba(0,0,0,0.45)]"
                >
                  {profileImage
                    ? <img src={profileImage} alt="Profil" className="w-full h-full object-cover" />
                    : <span className="text-3xl font-bold text-[var(--cyber-text)]">PD</span>
                  }
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-[rgba(6,15,22,0.72)] opacity-0 transition-opacity group-hover:opacity-100">
                    <Camera className="w-5 h-5 text-white" />
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-white">Changer</span>
                  </div>
                </button>
                <span
                  aria-hidden
                  className="pointer-events-none absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full bg-[var(--cyber-accent-strong)] border-[3px] border-[rgba(6,15,22,0.95)] shadow-[0_0_12px_rgba(123,241,255,0.55)]"
                >
                  <Camera className="w-4 h-4 text-[#0B1B26]" />
                </span>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-[var(--cyber-text)]">{firstName} {lastName}</p>
                <p className="mt-0.5 text-xs text-[var(--cyber-muted-text)]">{title}</p>
                <p className="text-xs text-[var(--cyber-subtle-text)]">{department}</p>
              </div>
              <div className="flex w-full flex-col gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-[rgba(123,241,255,0.35)] bg-[rgba(11,27,38,0.5)] px-3 py-2 text-xs font-medium text-[var(--cyber-text)] hover:bg-[rgba(11,27,38,0.75)] hover:border-[rgba(123,241,255,0.6)] transition-colors"
                >
                  <Camera className="w-3.5 h-3.5" />
                  {profileImage ? "Changer la photo" : "Téléverser une photo"}
                </button>
                {profileImage && (
                  <button
                    onClick={() => setProfileImage(null)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-transparent px-3 py-2 text-xs font-medium text-[var(--cyber-subtle-text)] hover:text-[#FFB3B8] hover:border-[rgba(255,123,130,0.4)] hover:bg-[rgba(255,123,130,0.08)] transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Supprimer la photo
                  </button>
                )}
                <p className="text-[10px] text-[var(--cyber-subtle-text)] text-center mt-1">JPG ou PNG · max. 2 Mo</p>
              </div>
            </DashboardCard>

            {/* Nav */}
            <div className="dashboard-card overflow-hidden">
            <nav>
              {sections.map((sec, i) => (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors ${
                    i < sections.length - 1 ? "border-b border-[rgba(117,195,214,0.1)]" : ""
                  } ${
                    activeSection === sec.id
                      ? "bg-[rgba(61,216,233,0.12)] text-[var(--cyber-text)]"
                      : "hover:bg-[rgba(11,27,38,0.56)] text-[var(--cyber-muted-text)]"
                  }`}
                >
                  <sec.icon className={`w-4 h-4 flex-shrink-0 ${activeSection === sec.id ? "text-[var(--cyber-accent-strong)]" : "text-[var(--cyber-subtle-text)]"}`} />
                  <span className="text-sm font-medium">{sec.label}</span>
                </button>
              ))}
            </nav>
            </div>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Information Section */}
            {activeSection === "info" && (
              <>
                <Section title="Informations personnelles" icon={User}>
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <Field label="Prénom *" value={firstName} onChange={setFirstName} placeholder="Jean-Pierre" icon={User} />
                      <Field label="Nom de famille *" value={lastName} onChange={setLastName} placeholder="Dupont" icon={User} />
                    </div>
                    <Field label="Adresse email *" value={email} onChange={setEmail} type="email" placeholder="jp.dupont@univ.fr" icon={Mail} />
                    <Field label="Téléphone" value={phone} onChange={setPhone} type="tel" placeholder="+33 6 12 34 56 78" icon={Phone} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Titre / Poste</label>
                        <select
                          value={title}
                          onChange={e => setTitle(e.target.value)}
                          className="w-full px-4 py-3 bg-white border border-[#E5E5E5] rounded-xl text-sm text-black focus:outline-none focus:ring-2 focus:ring-black transition-all"
                        >
                          <option>Professeur des universités</option>
                          <option>Maître de conférences</option>
                          <option>Chargé de cours</option>
                          <option>Professeur agrégé</option>
                          <option>Directeur pédagogique</option>
                        </select>
                      </div>
                      <Field label="Département" value={department} onChange={setDepartment} placeholder="Informatique" icon={BookOpen} />
                    </div>
                    <Field label="Institution / Établissement" value={location} onChange={setLocation} placeholder="Université..." icon={MapPin} />
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Biographie</label>
                      <textarea
                        value={bio}
                        onChange={e => setBio(e.target.value)}
                        rows={4}
                        placeholder="Décrivez votre parcours, spécialités..."
                        className="w-full px-4 py-3 bg-white border border-[#E5E5E5] rounded-xl text-sm text-black placeholder:text-[#888888] focus:outline-none focus:ring-2 focus:ring-black transition-all resize-none"
                      />
                      <p className="text-xs text-[#888888] mt-1.5">{bio.length}/500 caractères</p>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center justify-stretch border-t border-[#E5E5E5] pt-5 sm:justify-end">
                    <button
                      onClick={handleSaveProfile}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-black px-6 py-2.5 text-sm font-medium text-white transition-all shadow-[0_2px_8px_rgba(0,0,0,0.12)] hover:bg-[#222222] sm:w-auto"
                    >
                      <Save className="w-4 h-4" />
                      Enregistrer les modifications
                    </button>
                  </div>
                </Section>

                {/* Academic info (read-only) */}
                <Section title="Informations institutionnelles" icon={Hash}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field label="Identifiant enseignant" value="PROF-2019-0042" icon={Hash} disabled />
                    <Field label="Statut du compte" value="Administrateur · Actif" icon={Shield} disabled />
                    <Field label="Membre depuis" value="Septembre 2019" icon={Globe} disabled />
                    <Field label="Dernière connexion" value="Aujourd'hui à 09:24" icon={Globe} disabled />
                  </div>
                  <p className="text-xs text-[#888888] mt-4 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Ces informations sont gérées par votre service informatique. Contactez-les pour toute modification.
                  </p>
                </Section>
              </>
            )}

            {/* Security Section */}
            {activeSection === "security" && (
              <>
                <Section title="Changer le mot de passe" icon={Lock}>
                  <div className="space-y-5">
                    <PasswordField label="Mot de passe actuel" value={currentPwd} onChange={setCurrentPwd} placeholder="••••••••" />
                    <div>
                      <PasswordField label="Nouveau mot de passe" value={newPwd} onChange={setNewPwd} placeholder="Minimum 8 caractères" />
                      <PasswordStrength password={newPwd} />
                    </div>
                    <PasswordField label="Confirmer le nouveau mot de passe" value={confirmPwd} onChange={setConfirmPwd} placeholder="Répétez le mot de passe" />

                    {confirmPwd && newPwd !== confirmPwd && (
                      <div className="flex items-center gap-2 px-4 py-3 bg-[#F8F8F8] border border-[#E5E5E5] rounded-xl">
                        <AlertCircle className="w-4 h-4 text-[#888888] flex-shrink-0" />
                        <p className="text-xs text-[#666666]">Les mots de passe ne correspondent pas</p>
                      </div>
                    )}

                    <div className="bg-[rgba(11,27,38,0.55)] border border-[rgba(117,195,214,0.18)] rounded-xl p-4 space-y-2">
                      <p className="text-xs font-medium text-[var(--cyber-text)]">Le mot de passe doit contenir :</p>
                      {[
                        { check: newPwd.length >= 8, text: "Au moins 8 caractères" },
                        { check: /[A-Z]/.test(newPwd), text: "Au moins une majuscule" },
                        { check: /[0-9]/.test(newPwd), text: "Au moins un chiffre" },
                        { check: /[^a-zA-Z0-9]/.test(newPwd), text: "Au moins un caractère spécial" },
                      ].map(({ check, text }) => (
                        <div key={text} className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                            check
                              ? "bg-[#22C55E] border border-[#22C55E] shadow-[0_0_8px_rgba(34,197,94,0.45)]"
                              : "bg-transparent border border-[rgba(123,241,255,0.4)]"
                          }`}>
                            {check && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                          </div>
                          <p className={`text-xs transition-colors ${check ? "text-[#22C55E] font-medium" : "text-[var(--cyber-muted-text)]"}`}>{text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-6 flex items-center justify-stretch border-t border-[#E5E5E5] pt-5 sm:justify-end">
                    <button
                      onClick={handleChangePassword}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-black px-6 py-2.5 text-sm font-medium text-white transition-all shadow-[0_2px_8px_rgba(0,0,0,0.12)] hover:bg-[#222222] sm:w-auto"
                    >
                      <Shield className="w-4 h-4" />
                      Changer le mot de passe
                    </button>
                  </div>
                </Section>

                <Section title="Authentification à deux facteurs" icon={Shield}>
                  <div className="space-y-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-black mb-1">Activer la 2FA</h3>
                        <p className="text-xs text-[#666666]">Sécurisez votre compte avec une authentification à deux facteurs via votre application mobile (Google Authenticator, Authy...).</p>
                      </div>
                      <ToggleSwitch defaultChecked={false} />
                    </div>
                    <div className="flex flex-col gap-4 border-t border-[#E5E5E5] pt-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-black mb-1">Alertes de connexion suspecte</h3>
                        <p className="text-xs text-[#666666]">Recevoir une notification en cas de connexion depuis un nouvel appareil ou une localisation inhabituelle.</p>
                      </div>
                      <ToggleSwitch defaultChecked={true} />
                    </div>
                  </div>
                </Section>

                {/* Danger zone */}
                <DashboardSectionCard
                  title="Zone dangereuse"
                  subtitle="Actions sensibles sur le compte"
                  icon={AlertCircle}
                  tone="danger"
                >
                  <div className="p-6 space-y-4">
                    <div className="flex flex-col gap-4 border-b border-[#F0F0F0] py-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-black mb-1">Déconnecter toutes les sessions</h3>
                        <p className="text-xs text-[#666666]">Mettra fin à toutes les sessions actives sur tous les appareils</p>
                      </div>
                      <button
                        onClick={() => showToast("Toutes les sessions ont été déconnectées.")}
                        className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-black text-sm font-medium text-black hover:bg-[#F5F5F5] transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Déconnecter
                      </button>
                    </div>
                    <div className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-black mb-1">Supprimer le compte</h3>
                        <p className="text-xs text-[#666666]">Action irréversible. Toutes vos données seront définitivement supprimées.</p>
                      </div>
                      <button className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F5F5F5] border border-[#E5E5E5] text-sm font-medium text-[#888888] hover:bg-[#EEEEEE] transition-colors cursor-not-allowed">
                        <Trash2 className="w-4 h-4" />
                        Supprimer
                      </button>
                    </div>
                  </div>
                </DashboardSectionCard>
              </>
            )}

            {/* Notifications Section */}
            {activeSection === "notifications" && (
              <>
                <Section title="Notifications par email" icon={Mail}>
                  <div className="divide-y divide-[#F0F0F0]">
                    {[
                      { title: "Alertes fraude critique", desc: "Recevoir immédiatement un email pour les alertes de niveau élevé", default: true },
                      { title: "Résumé quotidien", desc: "Un rapport quotidien des activités et statistiques de la plateforme", default: true },
                      { title: "Soumissions d'examens", desc: "Notifié quand tous les étudiants ont rendu leur copie", default: true },
                    ].map(item => (
                      <div key={item.title} className="flex flex-col gap-4 py-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-black mb-0.5">{item.title}</h3>
                          <p className="text-xs text-[#666666]">{item.desc}</p>
                        </div>
                        <ToggleSwitch defaultChecked={item.default} />
                      </div>
                    ))}
                  </div>
                </Section>

                <Section title="Notifications en temps réel" icon={Bell}>
                  <div className="divide-y divide-[#F0F0F0]">
                    {[
                      { title: "Alertes fraude en direct", desc: "Notifications pop-up immédiates lors de détection d'anomalies", default: true },
                      { title: "Activité étudiante", desc: "Informé des connexions et déconnexions pendant les examens", default: false },
                      { title: "Problèmes techniques", desc: "Alertes en cas de problèmes de connexion ou de serveur", default: true },
                    ].map(item => (
                      <div key={item.title} className="flex flex-col gap-4 py-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-black mb-0.5">{item.title}</h3>
                          <p className="text-xs text-[#666666]">{item.desc}</p>
                        </div>
                        <ToggleSwitch defaultChecked={item.default} />
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex items-center justify-stretch border-t border-[#E5E5E5] pt-5 sm:justify-end">
                    <button
                      onClick={() => showToast("Préférences de notifications sauvegardées.")}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-black px-6 py-2.5 text-sm font-medium text-white transition-all shadow-[0_2px_8px_rgba(0,0,0,0.12)] hover:bg-[#222222] sm:w-auto"
                    >
                      <Save className="w-4 h-4" />
                      Enregistrer les préférences
                    </button>
                  </div>
                </Section>
              </>
            )}

            {/* Sessions Section */}
            {activeSection === "sessions" && (
              <Section title="Sessions actives" icon={Globe}>
                <div className="space-y-3">
                  {activeSessions.map((session, i) => (
                    <div key={i} className={`flex flex-col gap-4 rounded-xl border px-5 py-4 transition-colors sm:flex-row sm:items-center sm:justify-between ${
                      session.current
                        ? "bg-[rgba(61,216,233,0.12)] border-[rgba(61,216,233,0.16)]"
                        : "bg-[rgba(11,27,38,0.5)] border-[rgba(117,195,214,0.12)] hover:border-[rgba(123,241,255,0.22)]"
                    }`}>
                      <div className="flex items-center gap-4 min-w-0">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          session.current ? "bg-white/10" : "bg-white border border-[#E5E5E5]"
                        }`}>
                          <Globe className={`w-5 h-5 ${session.current ? "text-white" : "text-[#666666]"}`} />
                        </div>
                        <div className="min-w-0">
                          <p className={`text-sm font-medium truncate ${session.current ? "text-white" : "text-black"}`}>
                            {session.device}
                            {session.current && (
                              <span className="ml-2 inline-block align-middle">
                                <DashboardStatusBadge status="active" label="Session actuelle" />
                              </span>
                            )}
                          </p>
                          <p className={`text-xs mt-0.5 ${session.current ? "text-white/60" : "text-[#888888]"}`}>
                            {session.location} · {session.time}
                          </p>
                        </div>
                      </div>
                      {!session.current && (
                        <button
                          onClick={() => showToast("Session déconnectée avec succès.")}
                          className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E5E5E5] bg-white hover:bg-[#F5F5F5] text-xs font-medium text-black transition-colors"
                        >
                          <XIcon className="w-3.5 h-3.5" />
                          Révoquer
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex flex-col gap-3 border-t border-[#E5E5E5] pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-[#888888]">{activeSessions.length} session(s) active(s) au total</p>
                  <button
                    onClick={() => showToast("Toutes les autres sessions ont été révoquées.")}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-black px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-[#F5F5F5] sm:w-auto"
                  >
                    <LogOut className="w-4 h-4" />
                    Révoquer toutes les autres sessions
                  </button>
                </div>
              </Section>
            )}
          </div>
        </div>
      </main>
      </div>
    </div>
  );
}
