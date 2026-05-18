import { Camera, ChevronDown, Save, User } from "lucide-react";
import { umpSchools } from "@/shared/lib/ump-schools";
import type { DashboardUser } from "@/features/student/api";

export interface ProfileMessage {
  kind: "ok" | "err";
  text: string;
}

interface ProfileSettingsProps {
  user: DashboardUser | null;
  firstName: string;
  lastName: string;
  phone: string;
  school: string;
  saving: boolean;
  message: ProfileMessage | null;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onSchoolChange: (value: string) => void;
  onSave: () => void;
}

export function ProfileSettings({
  user,
  firstName,
  lastName,
  phone,
  school,
  saving,
  message,
  onFirstNameChange,
  onLastNameChange,
  onPhoneChange,
  onSchoolChange,
  onSave,
}: ProfileSettingsProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif text-black mb-6">Informations du profil</h2>

      <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-[#E5E5E5] mb-6">
        <div className="relative group">
          <div className="w-24 h-24 rounded-full bg-[#F5F7FB] border-2 border-[#E5E5E5] flex items-center justify-center overflow-hidden">
            <User className="w-10 h-10 text-[#666666]" />
          </div>
          <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-opacity duration-200">
            <Camera className="w-6 h-6" />
            <input type="file" className="hidden" accept="image/*" />
          </label>
        </div>
        <div className="text-center sm:text-left">
          <h3 className="text-lg font-bold text-black">Photo de profil</h3>
          <p className="text-sm text-[#666666] mt-1 mb-3">
            JPG, GIF ou PNG. Taille maximale de 800 Ko.
          </p>
          <div className="flex items-center justify-center sm:justify-start gap-3">
            <label className="px-4 py-2 bg-[#F5F7FB] hover:bg-[#E5E5E5] text-black text-sm font-semibold rounded-lg transition-colors border border-[#E5E5E5] cursor-pointer">
              Changer
              <input type="file" className="hidden" accept="image/*" />
            </label>
            <button className="px-4 py-2 text-red-600 hover:bg-red-50 text-sm font-semibold rounded-lg transition-colors">
              Supprimer
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-black mb-2">Prénom</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => onFirstNameChange(e.target.value)}
            className="w-full bg-[#F5F7FB] border border-[#E5E5E5] rounded-xl px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-black mb-2">Nom</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => onLastNameChange(e.target.value)}
            className="w-full bg-[#F5F7FB] border border-[#E5E5E5] rounded-xl px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-black mb-2">Email</label>
          <input
            type="email"
            value={user?.email ?? ""}
            readOnly
            className="w-full bg-[#F0F0F0] border border-[#E5E5E5] rounded-xl px-4 py-3 text-[#666] cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-black mb-2">Téléphone</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            placeholder="ex: +212 6 12 34 56 78"
            className="w-full bg-[#F5F7FB] border border-[#E5E5E5] rounded-xl px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-black mb-2">Établissement</label>
          <div className="relative">
            <select
              value={school}
              onChange={(e) => onSchoolChange(e.target.value)}
              className="w-full appearance-none bg-[#F5F7FB] border border-[#E5E5E5] rounded-xl px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-black cursor-pointer"
            >
              <option value="">Sélectionnez votre établissement</option>
              {umpSchools.map((schoolName) => (
                <option key={schoolName} value={schoolName}>
                  {schoolName}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666] pointer-events-none" />
          </div>
        </div>
      </div>

      {message ? (
        <p
          className={`text-sm font-semibold ${
            message.kind === "ok" ? "text-green-600" : "text-red-600"
          }`}
        >
          {message.text}
        </p>
      ) : null}

      <div className="flex justify-stretch pt-4 sm:justify-end">
        <button
          onClick={onSave}
          disabled={saving}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#00809D] px-6 py-3 font-bold text-white transition-all hover:bg-[#1C1C1C] disabled:opacity-60 sm:w-auto"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Enregistrement…" : "Enregistrer"}</span>
        </button>
      </div>
    </div>
  );
}
