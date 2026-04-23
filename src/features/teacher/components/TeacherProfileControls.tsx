import { useState } from "react";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  X,
} from "lucide-react";
import { DashboardSectionCard } from "@/shared/components/dashboard/DashboardCard";
import { ToggleSwitch } from "@/shared/components/ToggleSwitch";

interface ProfileSectionCardProps {
  title: string;
  icon: LucideIcon;
  children: ReactNode;
}

export function ProfileSectionCard({
  title,
  icon,
  children,
}: ProfileSectionCardProps) {
  return (
    <DashboardSectionCard title={title} icon={icon}>
      {children}
    </DashboardSectionCard>
  );
}

interface ProfileFieldProps {
  label: string;
  value: string;
  onChange?: (nextValue: string) => void;
  type?: string;
  placeholder?: string;
  icon?: LucideIcon;
  disabled?: boolean;
}

export function ProfileField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  icon: Icon,
  disabled,
}: ProfileFieldProps) {
  return (
    <div>
      <label className="cyber-label">{label}</label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />}
        <input
          type={type}
          value={value}
          onChange={(event) => onChange?.(event.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full ${Icon ? "pl-10" : "px-4"} cyber-input pr-4 py-3 rounded-xl text-sm text-black placeholder:text-[#888888] focus:outline-none transition-all disabled:bg-[#F5F5F5] disabled:text-[#888888] disabled:cursor-not-allowed`}
        />
      </div>
    </div>
  );
}

interface ProfilePasswordFieldProps {
  label: string;
  value: string;
  onChange: (nextValue: string) => void;
  placeholder?: string;
}

export function ProfilePasswordField({
  label,
  value,
  onChange,
  placeholder,
}: ProfilePasswordFieldProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div>
      <label className="cyber-label">{label}</label>
      <div className="relative">
        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />
        <input
          type={isVisible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="cyber-input w-full rounded-xl py-3 pl-10 pr-10 text-sm text-black placeholder:text-[#888888] focus:outline-none transition-all"
        />
        <button
          type="button"
          onClick={() => setIsVisible((current) => !current)}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-[#888888] hover:text-black transition-colors"
        >
          {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

interface ProfileToastProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

export function ProfileToast({
  message,
  type,
  onClose,
}: ProfileToastProps) {
  return (
    <div className={`fixed bottom-4 left-4 right-4 z-50 flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.16)] transition-all sm:bottom-6 sm:left-auto sm:right-6 sm:px-5 sm:py-4 ${
      type === "success" ? "bg-black text-white border-black" : "bg-white text-black border-[#E5E5E5]"
    }`}>
      {type === "success"
        ? <CheckCircle2 className="w-5 h-5 text-white flex-shrink-0" />
        : <AlertCircle className="w-5 h-5 text-black flex-shrink-0" />}
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100 transition-opacity">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

interface PasswordStrengthMeterProps {
  password: string;
}

export function PasswordStrengthMeter({
  password,
}: PasswordStrengthMeterProps) {
  const strength = password.length === 0 ? 0
    : password.length < 6 ? 1
    : password.length < 10 ? 2
    : /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^a-zA-Z0-9]/.test(password) ? 4
    : 3;

  const labels = ["", "Faible", "Moyen", "Fort", "Tres fort"];
  const colors = ["", "#CCCCCC", "#888888", "#444444", "#000000"];

  if (password.length === 0) return null;

  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1.5">
        {[1, 2, 3, 4].map((index) => (
          <div
            key={index}
            className="h-1.5 flex-1 rounded-full transition-all duration-300"
            style={{ background: index <= strength ? colors[strength] : "#E5E5E5" }}
          />
        ))}
      </div>
      <p className="text-xs" style={{ color: colors[strength] }}>
        Securite : {labels[strength]}
      </p>
    </div>
  );
}

export { ToggleSwitch };
