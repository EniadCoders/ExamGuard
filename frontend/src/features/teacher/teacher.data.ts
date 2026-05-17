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

