import { useState, useRef } from "react";
import type { ReactNode } from "react";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  BookOpen,
  Save,
  Camera,
  Eye,
  EyeOff,
  Bell,
  Shield,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Lock,
  Globe,
  Hash,
  Edit3,
  Trash2,
  X,
} from "lucide-react";
import { useNavigate } from "react-router";
import { Logo } from "../components/Logo";
import { NotificationPanel } from "../components/NotificationPanel";

// ─── Toggle Switch ─────────────────────────────────────────────────────────────
function ToggleSwitch({ defaultChecked = false }: { defaultChecked?: boolean }) {
  const [on, setOn] = useState(defaultChecked);
  return (
    <button
      type="button"
      onClick={() => setOn(!on)}
      className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 ${
        on ? "bg-black border-black" : "bg-[#E5E5E5] border-[#CCCCCC]"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition duration-200 ${
          on ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </button>
  );
}

// ─── Section wrapper ───────────────────────────────────────────────────────────
function Section({ title, icon: Icon, children }: { title: string; icon: any; children: ReactNode }) {
  return (
    <div className="bg-white border border-[#E5E5E5] rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-[#E5E5E5] bg-[#FAFAFA] flex items-center gap-2">
        <Icon className="w-4 h-4 text-black" />
        <h2 className="text-sm font-bold text-black">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

// ─── Input field ──────────────────────────────────────────────────────────────
function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  icon: Icon,
  disabled,
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  type?: string;
  placeholder?: string;
  icon?: any;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-black mb-2">{label}</label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />}
        <input
          type={type}
          value={value}
          onChange={e => onChange?.(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full ${Icon ? "pl-10" : "px-4"} pr-4 py-3 bg-white border border-[#E5E5E5] rounded-xl text-sm text-black placeholder:text-[#888888] focus:outline-none focus:ring-2 focus:ring-black transition-all disabled:bg-[#F5F5F5] disabled:text-[#888888] disabled:cursor-not-allowed`}
        />
      </div>
    </div>
  );
}

// ─── Password field ───────────────────────────────────────────────────────────
function PasswordField({ label, value, onChange, placeholder }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="block text-sm font-medium text-black mb-2">{label}</label>
      <div className="relative">
        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 bg-white border border-[#E5E5E5] rounded-xl text-sm text-black placeholder:text-[#888888] focus:outline-none focus:ring-2 focus:ring-black transition-all"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-[#888888] hover:text-black transition-colors"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

// ─── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void }) {
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.16)] border transition-all ${
      type === "success"
        ? "bg-black text-white border-black"
        : "bg-white text-black border-[#E5E5E5]"
    }`}>
      {type === "success"
        ? <CheckCircle2 className="w-5 h-5 text-white flex-shrink-0" />
        : <AlertCircle className="w-5 h-5 text-black flex-shrink-0" />
      }
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100 transition-opacity">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

// ─── Password strength bar ─────────────────────────────────────────────────────
function PasswordStrength({ password }: { password: string }) {
  const strength = password.length === 0 ? 0
    : password.length < 6 ? 1
    : password.length < 10 ? 2
    : /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^a-zA-Z0-9]/.test(password) ? 4
    : 3;

  const labels = ["", "Faible", "Moyen", "Fort", "Très fort"];
  const colors = ["", "#CCCCCC", "#888888", "#444444", "#000000"];

  if (password.length === 0) return null;
  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1.5">
        {[1, 2, 3, 4].map(i => (
          <div
            key={i}
            className="h-1.5 flex-1 rounded-full transition-all duration-300"
            style={{ background: i <= strength ? colors[strength] : "#E5E5E5" }}
          />
        ))}
      </div>
      <p className="text-xs" style={{ color: colors[strength] }}>
        Sécurité : {labels[strength]}
      </p>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
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
  const [activeSection, setActiveSection] = useState<"info" | "security" | "notifications" | "sessions">("info");

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
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setProfileImage(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const sections = [
    { id: "info" as const, label: "Informations", icon: User },
    { id: "security" as const, label: "Sécurité", icon: Shield },
    { id: "notifications" as const, label: "Notifications", icon: Bell },
    { id: "sessions" as const, label: "Sessions actives", icon: Globe },
  ];

  const activeSessions = [
    { device: "Chrome — macOS Monterey", location: "Paris, France", time: "Actif maintenant", current: true },
    { device: "Safari — iPhone 14", location: "Paris, France", time: "Il y a 2 heures", current: false },
    { device: "Firefox — Windows 11", location: "Lyon, France", time: "Il y a 1 jour", current: false },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[#E5E5E5] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/admin")}
              className="flex items-center gap-2 p-2 hover:bg-[#F5F5F5] rounded-lg transition-colors text-[#666666] hover:text-black"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium hidden sm:block">Retour au dashboard</span>
            </button>
            <div className="w-px h-6 bg-[#E5E5E5]" />
            <Logo size="md" />
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

      <main className="max-w-[1200px] mx-auto px-6 py-8">
        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-black">Paramètres du profil</h1>
          <p className="text-sm text-[#666666] mt-1">Gérez vos informations personnelles, sécurité et préférences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Avatar card */}
            <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6 flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-black flex items-center justify-center overflow-hidden">
                  {profileImage
                    ? <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                    : <span className="text-2xl font-bold text-white">PD</span>
                  }
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-black flex items-center justify-center border-2 border-white hover:bg-[#333] transition-colors"
                >
                  <Camera className="w-3.5 h-3.5 text-white" />
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-black">{firstName} {lastName}</p>
                <p className="text-xs text-[#666666] mt-0.5">{title}</p>
                <p className="text-xs text-[#888888]">{department}</p>
              </div>
              {profileImage && (
                <button
                  onClick={() => setProfileImage(null)}
                  className="text-xs text-[#888888] hover:text-black transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  Supprimer la photo
                </button>
              )}
            </div>

            {/* Nav */}
            <nav className="bg-white border border-[#E5E5E5] rounded-2xl overflow-hidden">
              {sections.map((sec, i) => (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors ${
                    i < sections.length - 1 ? "border-b border-[#F0F0F0]" : ""
                  } ${
                    activeSection === sec.id
                      ? "bg-black text-white"
                      : "hover:bg-[#F5F5F5] text-black"
                  }`}
                >
                  <sec.icon className={`w-4 h-4 flex-shrink-0 ${activeSection === sec.id ? "text-white" : "text-[#666666]"}`} />
                  <span className="text-sm font-medium">{sec.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* ─── INFORMATION SECTION ──────────────────────────────────────── */}
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
                  <div className="mt-6 pt-5 border-t border-[#E5E5E5] flex items-center justify-end">
                    <button
                      onClick={handleSaveProfile}
                      className="flex items-center gap-2 px-6 py-2.5 bg-black hover:bg-[#222222] rounded-xl text-sm font-medium text-white transition-all shadow-[0_2px_8px_rgba(0,0,0,0.12)]"
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

            {/* ─── SECURITY SECTION ──────────────────────────────────────────── */}
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

                    <div className="bg-[#F8F8F8] border border-[#E5E5E5] rounded-xl p-4 space-y-2">
                      <p className="text-xs font-medium text-black">Le mot de passe doit contenir :</p>
                      {[
                        { check: newPwd.length >= 8, text: "Au moins 8 caractères" },
                        { check: /[A-Z]/.test(newPwd), text: "Au moins une majuscule" },
                        { check: /[0-9]/.test(newPwd), text: "Au moins un chiffre" },
                        { check: /[^a-zA-Z0-9]/.test(newPwd), text: "Au moins un caractère spécial" },
                      ].map(({ check, text }) => (
                        <div key={text} className="flex items-center gap-2">
                          <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 ${
                            check ? "bg-black" : "bg-[#E5E5E5]"
                          }`}>
                            {check && <span className="w-1.5 h-1.5 bg-white rounded-full block" />}
                          </div>
                          <p className={`text-xs ${check ? "text-black" : "text-[#888888]"}`}>{text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-6 pt-5 border-t border-[#E5E5E5] flex items-center justify-end">
                    <button
                      onClick={handleChangePassword}
                      className="flex items-center gap-2 px-6 py-2.5 bg-black hover:bg-[#222222] rounded-xl text-sm font-medium text-white transition-all shadow-[0_2px_8px_rgba(0,0,0,0.12)]"
                    >
                      <Shield className="w-4 h-4" />
                      Changer le mot de passe
                    </button>
                  </div>
                </Section>

                <Section title="Authentification à deux facteurs" icon={Shield}>
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-black mb-1">Activer la 2FA</h3>
                        <p className="text-xs text-[#666666]">Sécurisez votre compte avec une authentification à deux facteurs via votre application mobile (Google Authenticator, Authy...).</p>
                      </div>
                      <ToggleSwitch defaultChecked={false} />
                    </div>
                    <div className="flex items-start justify-between gap-4 pt-4 border-t border-[#E5E5E5]">
                      <div>
                        <h3 className="text-sm font-medium text-black mb-1">Alertes de connexion suspecte</h3>
                        <p className="text-xs text-[#666666]">Recevoir une notification en cas de connexion depuis un nouvel appareil ou une localisation inhabituelle.</p>
                      </div>
                      <ToggleSwitch defaultChecked={true} />
                    </div>
                  </div>
                </Section>

                {/* Danger zone */}
                <div className="bg-white border-2 border-[#E5E5E5] rounded-2xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-[#E5E5E5] bg-[#FAFAFA] flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-black" />
                    <h2 className="text-sm font-bold text-black">Zone dangereuse</h2>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between gap-4 py-4 border-b border-[#F0F0F0]">
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
                    <div className="flex items-center justify-between gap-4 py-4">
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
                </div>
              </>
            )}

            {/* ─── NOTIFICATIONS SECTION ────────────────────────────────────── */}
            {activeSection === "notifications" && (
              <>
                <Section title="Notifications par email" icon={Mail}>
                  <div className="divide-y divide-[#F0F0F0]">
                    {[
                      { title: "Alertes fraude critique", desc: "Recevoir immédiatement un email pour les alertes de niveau élevé", default: true },
                      { title: "Résumé quotidien", desc: "Un rapport quotidien des activités et statistiques de la plateforme", default: true },
                      { title: "Démarrage d'examens", desc: "Notification à chaque démarrage d'un examen planifié", default: false },
                      { title: "Soumissions d'examens", desc: "Notifié quand tous les étudiants ont rendu leur copie", default: true },
                      { title: "Nouveaux étudiants inscrits", desc: "Email quand un nouvel étudiant rejoint la plateforme", default: false },
                    ].map(item => (
                      <div key={item.title} className="flex items-start justify-between gap-4 py-4">
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
                      <div key={item.title} className="flex items-start justify-between gap-4 py-4">
                        <div>
                          <h3 className="text-sm font-medium text-black mb-0.5">{item.title}</h3>
                          <p className="text-xs text-[#666666]">{item.desc}</p>
                        </div>
                        <ToggleSwitch defaultChecked={item.default} />
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-5 border-t border-[#E5E5E5] flex items-center justify-end">
                    <button
                      onClick={() => showToast("Préférences de notifications sauvegardées.")}
                      className="flex items-center gap-2 px-6 py-2.5 bg-black hover:bg-[#222222] rounded-xl text-sm font-medium text-white transition-all shadow-[0_2px_8px_rgba(0,0,0,0.12)]"
                    >
                      <Save className="w-4 h-4" />
                      Enregistrer les préférences
                    </button>
                  </div>
                </Section>
              </>
            )}

            {/* ─── SESSIONS SECTION ─────────────────────────────────────────── */}
            {activeSection === "sessions" && (
              <Section title="Sessions actives" icon={Globe}>
                <div className="space-y-3">
                  {activeSessions.map((session, i) => (
                    <div key={i} className={`flex items-center justify-between gap-4 px-5 py-4 rounded-xl border transition-colors ${
                      session.current
                        ? "bg-black border-black"
                        : "bg-[#FAFAFA] border-[#E5E5E5] hover:border-[#CCCCCC]"
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
                            {session.current && <span className="ml-2 text-xs font-normal opacity-70">(session actuelle)</span>}
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
                          <X className="w-3.5 h-3.5" />
                          Révoquer
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-5 border-t border-[#E5E5E5] flex items-center justify-between">
                  <p className="text-xs text-[#888888]">{activeSessions.length} session(s) active(s) au total</p>
                  <button
                    onClick={() => showToast("Toutes les autres sessions ont été révoquées.")}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-black text-sm font-medium text-black hover:bg-[#F5F5F5] transition-colors"
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
  );
}
