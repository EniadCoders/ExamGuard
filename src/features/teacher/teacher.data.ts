import { Bell, FileText, Globe, Shield, User } from "lucide-react";

export type TeacherProfileSectionId =
  | "info"
  | "security"
  | "notifications"
  | "exams"
  | "sessions";

export const teacherProfileSections = [
  { id: "info" as const, label: "Informations", icon: User },
  { id: "security" as const, label: "Sécurité", icon: Shield },
  { id: "notifications" as const, label: "Notifications", icon: Bell },
  { id: "exams" as const, label: "Préférences examens", icon: FileText },
  { id: "sessions" as const, label: "Sessions actives", icon: Globe },
];

export const mockActiveSessions = [
  { device: "Chrome - macOS Monterey", location: "Paris, France", time: "Actif maintenant", current: true },
  { device: "Safari - iPhone 14", location: "Paris, France", time: "Il y a 2 heures", current: false },
  { device: "Firefox - Windows 11", location: "Lyon, France", time: "Il y a 1 jour", current: false },
];
