// ─── Super Admin Dashboard Data ──────────────────────────────────────────────

export const platformStats = [
  { label: "Utilisateurs totaux", value: "1,247", change: "+42", desc: "ce mois" },
  { label: "Professeurs actifs", value: "38", change: "+3", desc: "ce semestre" },
  { label: "Examens ce mois", value: "156", change: "+28", desc: "vs. mois dernier" },
  { label: "Uptime système", value: "99.97%", change: "0.01%", desc: "30 derniers jours" },
];

export const systemHealth = [
  { name: "API Gateway", status: "operational" as const, latency: "12ms", uptime: "99.99%" },
  { name: "Base de données", status: "operational" as const, latency: "3ms", uptime: "99.98%" },
  { name: "Service Auth", status: "operational" as const, latency: "8ms", uptime: "99.97%" },
  { name: "Stockage fichiers", status: "degraded" as const, latency: "45ms", uptime: "99.91%" },
  { name: "Service Email", status: "operational" as const, latency: "120ms", uptime: "99.95%" },
  { name: "WebSocket (Live)", status: "operational" as const, latency: "5ms", uptime: "99.99%" },
];

export interface PlatformUser {
  id: number;
  name: string;
  email: string;
  role: "student" | "professor" | "admin";
  status: "active" | "suspended" | "pending";
  lastLogin: string;
  department: string;
  createdAt: string;
}

export const platformUsers: PlatformUser[] = [
  { id: 1, name: "Prof. Dupont", email: "dupont@univ.fr", role: "professor", status: "active", lastLogin: "Il y a 5 min", department: "Informatique", createdAt: "Sep 2024" },
  { id: 2, name: "Prof. Martin", email: "martin@univ.fr", role: "professor", status: "active", lastLogin: "Il y a 1h", department: "Génie logiciel", createdAt: "Oct 2024" },
  { id: 3, name: "Prof. Bernard", email: "bernard@univ.fr", role: "professor", status: "suspended", lastLogin: "Il y a 3 jours", department: "Cybersécurité", createdAt: "Nov 2024" },
  { id: 4, name: "Marie Dubois", email: "marie.dubois@univ.fr", role: "student", status: "active", lastLogin: "Actif maintenant", department: "Informatique", createdAt: "Sep 2024" },
  { id: 5, name: "Thomas Martin", email: "thomas.m@univ.fr", role: "student", status: "active", lastLogin: "Il y a 10 min", department: "Génie logiciel", createdAt: "Sep 2024" },
  { id: 6, name: "Sophie Bernard", email: "sophie.b@univ.fr", role: "student", status: "pending", lastLogin: "Jamais", department: "Cybersécurité", createdAt: "Avr 2026" },
  { id: 7, name: "Lucas Petit", email: "lucas.p@univ.fr", role: "student", status: "active", lastLogin: "Il y a 2h", department: "IA & Data", createdAt: "Oct 2024" },
  { id: 8, name: "Admin Système", email: "admin@examguard.io", role: "admin", status: "active", lastLogin: "Actif maintenant", department: "IT", createdAt: "Jan 2024" },
  { id: 9, name: "Prof. Leroy", email: "leroy@univ.fr", role: "professor", status: "active", lastLogin: "Il y a 30 min", department: "Mathématiques", createdAt: "Fév 2025" },
  { id: 10, name: "Emma Rousseau", email: "emma.r@univ.fr", role: "student", status: "active", lastLogin: "Il y a 15 min", department: "Réseaux", createdAt: "Sep 2024" },
  { id: 11, name: "Hugo Lefebvre", email: "hugo.l@univ.fr", role: "student", status: "suspended", lastLogin: "Il y a 1 semaine", department: "Informatique", createdAt: "Sep 2024" },
  { id: 12, name: "Prof. Faure", email: "faure@univ.fr", role: "professor", status: "active", lastLogin: "Il y a 2h", department: "IA & Data", createdAt: "Mars 2025" },
];

export const auditLogs = [
  { id: 1, action: "Connexion super admin", user: "admin@examguard.io", time: "10:02", level: "info" as const },
  { id: 2, action: "Utilisateur suspendu: Hugo Lefebvre", user: "admin@examguard.io", time: "09:45", level: "warn" as const },
  { id: 3, action: "Examen créé: Java EE Avancé", user: "dupont@univ.fr", time: "09:30", level: "info" as const },
  { id: 4, action: "Tentative de connexion échouée (x3)", user: "inconnu@test.com", time: "09:12", level: "danger" as const },
  { id: 5, action: "Paramètres MFA modifiés", user: "admin@examguard.io", time: "08:55", level: "warn" as const },
  { id: 6, action: "Sauvegarde BD automatique terminée", user: "système", time: "08:00", level: "info" as const },
  { id: 7, action: "Nouveau professeur inscrit: Prof. Faure", user: "admin@examguard.io", time: "07:40", level: "info" as const },
  { id: 8, action: "Pic d'utilisation détecté (247 connexions)", user: "système", time: "07:15", level: "warn" as const },
];

export const securityEvents = [
  { id: 1, type: "Brute force détecté", ip: "192.168.1.105", time: "Il y a 12 min", blocked: true },
  { id: 2, type: "Token expiré utilisé", ip: "10.0.0.42", time: "Il y a 45 min", blocked: true },
  { id: 3, type: "Accès API non autorisé", ip: "172.16.0.88", time: "Il y a 2h", blocked: true },
  { id: 4, type: "Tentative injection SQL", ip: "203.0.113.50", time: "Il y a 5h", blocked: true },
];
