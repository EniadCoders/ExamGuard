import { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  Bell,
  Check,
  CheckCircle2,
  Clock,
  FileText,
  Play,
  Shield,
  X,
} from "lucide-react";

export type NotifType =
  | "exam_start"
  | "exam_submit"
  | "fraud"
  | "warning"
  | "info"
  | "result";

export interface AppNotification {
  id: number;
  type: NotifType;
  title: string;
  body: string;
  time: string;
  read: boolean;
}

const studentNotifs: AppNotification[] = [
  {
    id: 1,
    type: "exam_start",
    title: "Examen demarre",
    body: "Systemes d'Exploitation est maintenant accessible. Rejoignez maintenant.",
    time: "14:00",
    read: false,
  },
  {
    id: 2,
    type: "warning",
    title: "Avertissement recu",
    body: "Changement de fenetre detecte. Cet incident a ete signale.",
    time: "14:07",
    read: false,
  },
  {
    id: 3,
    type: "exam_submit",
    title: "Examen soumis",
    body: "Votre copie pour Java EE a bien ete enregistree.",
    time: "Hier 11:42",
    read: true,
  },
  {
    id: 4,
    type: "result",
    title: "Note disponible",
    body: "Votre note pour Base de Donnees est disponible : 91/100.",
    time: "28 Mar",
    read: true,
  },
  {
    id: 5,
    type: "info",
    title: "Rappel d'examen",
    body: "Algorithmique Avancee commence dans 24h. Preparez votre environnement.",
    time: "28 Mar",
    read: true,
  },
];

const adminNotifs: AppNotification[] = [
  {
    id: 1,
    type: "fraud",
    title: "Alerte fraude critique",
    body: "Marie Dubois · Changement d'onglet x3 · Reseaux et Securite",
    time: "10:05",
    read: false,
  },
  {
    id: 2,
    type: "fraud",
    title: "Alerte fraude critique",
    body: "Sophie Bernard · Comportement suspect detecte · Reseaux et Securite",
    time: "10:08",
    read: false,
  },
  {
    id: 3,
    type: "exam_start",
    title: "Examen demarre",
    body: "Systemes d'Exploitation · 43 etudiants connectes",
    time: "14:00",
    read: false,
  },
  {
    id: 4,
    type: "fraud",
    title: "Alerte fraude moyenne",
    body: "Thomas Martin · Mouvement suspect · Algorithmique Avancee",
    time: "10:11",
    read: true,
  },
  {
    id: 5,
    type: "exam_submit",
    title: "Examen termine",
    body: "Base de Donnees Avancees · 38/38 copies soumises.",
    time: "Hier 16:00",
    read: true,
  },
  {
    id: 6,
    type: "info",
    title: "Examen planifie",
    body: "Architecture Java EE planifie le 09 Avr a 18h00.",
    time: "27 Mar",
    read: true,
  },
];

function NotifIcon({ type }: { type: NotifType }) {
  const cls = "h-4 w-4";
  switch (type) {
    case "exam_start":
      return <Play className={`${cls} text-cyan-300`} />;
    case "exam_submit":
      return <CheckCircle2 className={`${cls} text-emerald-300`} />;
    case "fraud":
      return <AlertTriangle className={`${cls} text-rose-300`} />;
    case "warning":
      return <Shield className={`${cls} text-amber-300`} />;
    case "result":
      return <FileText className={`${cls} text-sky-200`} />;
    default:
      return <Clock className={`${cls} text-slate-400`} />;
  }
}

function iconSurface(type: NotifType) {
  switch (type) {
    case "exam_start":
      return "border-cyan-400/20 bg-cyan-500/10";
    case "exam_submit":
      return "border-emerald-400/20 bg-emerald-500/10";
    case "fraud":
      return "border-rose-400/20 bg-rose-500/10";
    case "warning":
      return "border-amber-400/20 bg-amber-500/10";
    case "result":
      return "border-sky-400/20 bg-sky-500/10";
    default:
      return "border-slate-700/40 bg-slate-800/40";
  }
}

interface NotificationPanelProps {
  role: "student" | "admin";
}

export function NotificationPanel({ role }: NotificationPanelProps) {
  const source = role === "student" ? studentNotifs : adminNotifs;
  const [notifs, setNotifs] = useState<AppNotification[]>(source);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const unread = notifs.filter((n) => !n.read).length;

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const markAllRead = () =>
    setNotifs((prev) => prev.map((notif) => ({ ...notif, read: true })));
  const dismiss = (id: number) =>
    setNotifs((prev) => prev.filter((notif) => notif.id !== id));
  const markRead = (id: number) =>
    setNotifs((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif,
      ),
    );

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setOpen((value) => !value)}
        className={`relative rounded-xl p-2.5 transition-colors ${
          open
            ? "border border-[rgba(123,241,255,0.16)] bg-[rgba(11,27,38,0.88)] text-white"
            : "text-slate-400 hover:bg-[rgba(11,27,38,0.66)] hover:text-slate-200"
        }`}
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <span className="absolute right-1 top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[linear-gradient(135deg,#3dd8e9,#8bf3ff)] px-1 text-[10px] leading-none text-[#041117] ring-2 ring-[#07111a]">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-[360px] animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-cyan-400/18 via-transparent to-cyan-200/10 blur-sm" />

          <div className="relative overflow-hidden rounded-2xl border border-[rgba(123,241,255,0.16)] bg-[rgba(5,14,22,0.96)] shadow-[0_28px_70px_rgba(0,0,0,0.34)] backdrop-blur-2xl">
            <div className="flex items-center justify-between border-b border-[rgba(117,195,214,0.12)] px-5 py-4">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-cyan-300" />
                <span className="text-sm text-slate-200">Notifications</span>
                {unread > 0 && (
                  <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-1.5 py-0.5 text-xs text-cyan-200">
                    {unread} nouvelle{unread > 1 ? "s" : ""}
                  </span>
                )}
              </div>

              {unread > 0 && (
                <button
                  onClick={markAllRead}
                  className="flex items-center gap-1.5 text-xs text-cyan-300 transition-colors hover:text-cyan-100"
                >
                  <Check className="h-3.5 w-3.5" />
                  Tout lire
                </button>
              )}
            </div>

            <div className="max-h-[400px] overflow-y-auto divide-y divide-[rgba(117,195,214,0.08)]">
              {notifs.length === 0 ? (
                <div className="flex flex-col items-center justify-center px-5 py-12">
                  <Bell className="mb-3 h-10 w-10 text-slate-700" />
                  <p className="text-sm text-slate-500">Aucune notification</p>
                </div>
              ) : (
                notifs.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => markRead(notif.id)}
                    className={`group flex cursor-pointer items-start gap-3 px-5 py-3.5 transition-all ${
                      notif.read
                        ? "hover:bg-[rgba(11,27,38,0.44)]"
                        : "bg-cyan-500/[0.05] hover:bg-cyan-500/[0.08]"
                    }`}
                  >
                    <div
                      className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl border ${iconSurface(
                        notif.type,
                      )}`}
                    >
                      <NotifIcon type={notif.type} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className={`text-sm leading-snug ${
                            notif.read ? "text-slate-300" : "text-white"
                          }`}
                        >
                          {notif.title}
                        </p>

                        <div className="flex flex-shrink-0 items-center gap-1.5">
                          <span className="whitespace-nowrap text-xs text-slate-600">
                            {notif.time}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              dismiss(notif.id);
                            }}
                            className="rounded p-0.5 opacity-0 transition-all group-hover:opacity-100 hover:bg-slate-700/60"
                          >
                            <X className="h-3 w-3 text-slate-500" />
                          </button>
                        </div>
                      </div>

                      <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
                        {notif.body}
                      </p>
                    </div>

                    {!notif.read && (
                      <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-cyan-300" />
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="flex items-center justify-between border-t border-[rgba(117,195,214,0.12)] px-5 py-3">
              <span className="text-xs text-slate-600">
                {notifs.length} notification{notifs.length > 1 ? "s" : ""} au
                total
              </span>
              <button
                onClick={() => setNotifs([])}
                className="text-xs text-slate-500 transition-colors hover:text-slate-300"
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
