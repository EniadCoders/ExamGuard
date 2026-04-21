import { useState, useRef, useEffect } from "react";
import {
  Bell,
  X,
  CheckCircle2,
  AlertTriangle,
  Play,
  Clock,
  Shield,
  FileText,
  Check,
} from "lucide-react";

export type NotifType = "exam_start" | "exam_submit" | "fraud" | "warning" | "info" | "result";

export interface Notification {
  id: number;
  type: NotifType;
  title: string;
  body: string;
  time: string;
  read: boolean;
}

// ─── Per-role mock notifications ─────────────────────────────────────────────
const studentNotifs: Notification[] = [
  { id: 1, type: "exam_start", title: "Examen démarré", body: "«\u202fSystèmes d'Exploitation\u202f» est maintenant accessible. Rejoignez maintenant.", time: "14:00", read: false },
  { id: 2, type: "warning", title: "Avertissement reçu", body: "Changement de fenêtre détecté. Cet incident a été signalé.", time: "14:07", read: false },
  { id: 3, type: "exam_submit", title: "Examen soumis", body: "Votre copie pour «\u202fJava EE\u202f» a bien été enregistrée.", time: "Hier 11:42", read: true },
  { id: 4, type: "result", title: "Note disponible", body: "Votre note pour «\u202fBase de Données\u202f» est disponible : 91/100.", time: "28 Mar", read: true },
  { id: 5, type: "info", title: "Rappel d'examen", body: "«\u202fAlgorithmique Avancée\u202f» commence dans 24h. Préparez votre environnement.", time: "28 Mar", read: true },
];

const adminNotifs: Notification[] = [
  { id: 1, type: "fraud", title: "Alerte fraude — Critique", body: "Marie Dubois · Changement d'onglet × 3 — Réseaux & Sécurité", time: "10:05", read: false },
  { id: 2, type: "fraud", title: "Alerte fraude — Critique", body: "Sophie Bernard · Comportement suspect détecté — Réseaux & Sécurité", time: "10:08", read: false },
  { id: 3, type: "exam_start", title: "Examen démarré", body: "«\u202fSystèmes d'Exploitation\u202f» · 43 étudiants connectés", time: "14:00", read: false },
  { id: 4, type: "fraud", title: "Alerte fraude — Moyen", body: "Thomas Martin · Mouvement suspect — Algorithmique Avancée", time: "10:11", read: true },
  { id: 5, type: "exam_submit", title: "Examen terminé", body: "«\u202fBase de Données Avancées\u202f» · 38/38 copies soumises.", time: "Hier 16:00", read: true },
  { id: 6, type: "info", title: "Examen planifié", body: "«\u202fArchitecture Java EE\u202f» planifié le 09 Avr à 18h00.", time: "27 Mar", read: true },
];

// ─── Icon per type ────────────────────────────────────────────────────────────
function NotifIcon({ type }: { type: NotifType }) {
  const cls = "w-4 h-4";
  switch (type) {
    case "exam_start": return <Play className={`${cls} text-blue-400`} />;
    case "exam_submit": return <CheckCircle2 className={`${cls} text-green-400`} />;
    case "fraud": return <AlertTriangle className={`${cls} text-red-400`} />;
    case "warning": return <Shield className={`${cls} text-amber-400`} />;
    case "result": return <FileText className={`${cls} text-cyan-400`} />;
    default: return <Clock className={`${cls} text-slate-400`} />;
  }
}

function bgFor(type: NotifType) {
  switch (type) {
    case "exam_start": return "bg-blue-500/10 border-blue-500/20";
    case "exam_submit": return "bg-green-500/10 border-green-500/20";
    case "fraud": return "bg-red-500/10 border-red-500/20";
    case "warning": return "bg-amber-500/10 border-amber-500/20";
    case "result": return "bg-cyan-500/10 border-cyan-500/20";
    default: return "bg-slate-700/30 border-slate-700/30";
  }
}

// ─── Main component ───────────────────────────────────────────────────────────
interface NotificationPanelProps {
  role: "student" | "admin";
}

export function NotificationPanel({ role }: NotificationPanelProps) {
  const source = role === "student" ? studentNotifs : adminNotifs;
  const [notifs, setNotifs] = useState<Notification[]>(source);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const unread = notifs.filter((n) => !n.read).length;

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const markAllRead = () => setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  const dismiss = (id: number) => setNotifs((prev) => prev.filter((n) => n.id !== id));
  const markRead = (id: number) => setNotifs((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell button */}
      <button
        onClick={() => setOpen((p) => !p)}
        className={`relative p-2 rounded-lg transition-colors ${open ? "bg-slate-700/60 text-white" : "hover:bg-slate-800/50 text-slate-400 hover:text-slate-200"}`}
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unread > 0 && (
          <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-blue-500 text-white text-[10px] flex items-center justify-center ring-2 ring-[#0a0e27] leading-none">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] w-[360px] z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Glow border */}
          <div className="absolute -inset-px bg-gradient-to-br from-blue-500/20 to-cyan-500/10 rounded-2xl blur-sm" />
          <div className="relative bg-slate-900/95 backdrop-blur-2xl border border-slate-700/60 rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/60">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-slate-200">Notifications</span>
                {unread > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs border border-blue-500/25">
                    {unread} nouvelle{unread > 1 ? "s" : ""}
                  </span>
                )}
              </div>
              {unread > 0 && (
                <button
                  onClick={markAllRead}
                  className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                  Tout lire
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-[400px] overflow-y-auto divide-y divide-slate-800/40">
              {notifs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-5">
                  <Bell className="w-10 h-10 text-slate-700 mb-3" />
                  <p className="text-sm text-slate-500">Aucune notification</p>
                </div>
              ) : notifs.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markRead(n.id)}
                  className={`flex items-start gap-3 px-5 py-3.5 cursor-pointer transition-all group ${n.read ? "hover:bg-slate-800/20" : "bg-blue-500/[0.04] hover:bg-blue-500/[0.08]"}`}
                >
                  {/* Icon */}
                  <div className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center border ${bgFor(n.type)}`}>
                    <NotifIcon type={n.type} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm leading-snug ${n.read ? "text-slate-300" : "text-white"}`}>
                        {n.title}
                      </p>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span className="text-xs text-slate-600 whitespace-nowrap">{n.time}</span>
                        <button
                          onClick={(e) => { e.stopPropagation(); dismiss(n.id); }}
                          className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-slate-700/60 transition-all"
                        >
                          <X className="w-3 h-3 text-slate-500" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{n.body}</p>
                  </div>

                  {/* Unread dot */}
                  {!n.read && (
                    <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-400 mt-1" />
                  )}
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-slate-800/60 flex items-center justify-between">
              <span className="text-xs text-slate-600">{notifs.length} notification{notifs.length > 1 ? "s" : ""} au total</span>
              <button
                onClick={() => setNotifs([])}
                className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
              >
                Effacer tout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}