import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "../ui/utils";

type CardTone = "default" | "subtle" | "accent" | "danger";
type IconTone = "default" | "positive" | "warning" | "danger" | "neutral";
type BadgeTone = "neutral" | "info" | "success" | "warning" | "danger";
type StatusKind =
  | "active"
  | "inactive"
  | "ongoing"
  | "completed"
  | "upcoming"
  | "scheduled"
  | "draft"
  | "medium"
  | "high"
  | "alert";

const toneClassMap: Record<CardTone, string> = {
  default: "",
  subtle: "dashboard-card-subtle",
  accent: "dashboard-card-accent",
  danger: "dashboard-card-danger",
};

const iconToneMap: Record<IconTone, string> = {
  default: "",
  positive: "dashboard-icon-badge-positive",
  warning: "dashboard-icon-badge-warning",
  danger: "dashboard-icon-badge-danger",
  neutral: "dashboard-icon-badge-neutral",
};

const badgeToneMap: Record<BadgeTone, string> = {
  neutral: "",
  info: "dashboard-status-badge-info",
  success: "dashboard-status-badge-success",
  warning: "dashboard-status-badge-warning",
  danger: "dashboard-status-badge-danger",
};

const statusMap: Record<StatusKind, { label: string; tone: BadgeTone }> = {
  active: { label: "Actif", tone: "info" },
  inactive: { label: "Inactif", tone: "neutral" },
  ongoing: { label: "En cours", tone: "info" },
  completed: { label: "Terminé", tone: "success" },
  upcoming: { label: "À venir", tone: "neutral" },
  scheduled: { label: "Planifié", tone: "info" },
  draft: { label: "Brouillon", tone: "neutral" },
  medium: { label: "Moyenne", tone: "warning" },
  high: { label: "Élevée", tone: "danger" },
  alert: { label: "Alerte", tone: "danger" },
};

interface DashboardCardProps {
  children: ReactNode;
  className?: string;
  tone?: CardTone;
  interactive?: boolean;
}

export function DashboardCard({
  children,
  className,
  tone = "default",
  interactive = false,
}: DashboardCardProps) {
  return (
    <section
      className={cn(
        "dashboard-card",
        toneClassMap[tone],
        interactive && "dashboard-card-interactive",
        className,
      )}
    >
      {children}
    </section>
  );
}

interface DashboardSectionCardProps extends DashboardCardProps {
  title: ReactNode;
  subtitle?: ReactNode;
  icon?: LucideIcon;
  action?: ReactNode;
  badge?: ReactNode;
  bodyClassName?: string;
}

export function DashboardSectionCard({
  title,
  subtitle,
  icon,
  action,
  badge,
  children,
  className,
  tone = "default",
  interactive = false,
  bodyClassName,
}: DashboardSectionCardProps) {
  return (
    <DashboardCard
      className={className}
      tone={tone}
      interactive={interactive}
    >
      <div className="dashboard-section-card-header">
        <div className="flex min-w-0 items-start gap-3">
          {icon && <DashboardIconBadge icon={icon} />}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="dashboard-card-title">{title}</h2>
              {badge}
            </div>
            {subtitle && <p className="dashboard-card-subtitle">{subtitle}</p>}
          </div>
        </div>
        {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
      </div>
      <div className={cn("p-6", bodyClassName)}>{children}</div>
    </DashboardCard>
  );
}

interface DashboardIconBadgeProps {
  icon: LucideIcon;
  className?: string;
  tone?: IconTone;
}

export function DashboardIconBadge({
  icon: Icon,
  className,
  tone = "default",
}: DashboardIconBadgeProps) {
  return (
    <div className={cn("dashboard-icon-badge", iconToneMap[tone], className)}>
      <Icon className="h-[18px] w-[18px]" />
    </div>
  );
}

interface DashboardStatusBadgeProps {
  status?: StatusKind;
  label?: string;
  tone?: BadgeTone;
  className?: string;
}

export function DashboardStatusBadge({
  status,
  label,
  tone,
  className,
}: DashboardStatusBadgeProps) {
  const resolved = status ? statusMap[status] : undefined;

  return (
    <span
      className={cn(
        "dashboard-status-badge",
        badgeToneMap[tone ?? resolved?.tone ?? "neutral"],
        className,
      )}
    >
      <span className="dashboard-status-dot" />
      <span>{label ?? resolved?.label}</span>
    </span>
  );
}

interface DashboardMetaItemProps {
  children: ReactNode;
  icon?: LucideIcon;
  className?: string;
}

export function DashboardMetaItem({
  children,
  icon: Icon,
  className,
}: DashboardMetaItemProps) {
  return (
    <div className={cn("dashboard-meta-item", className)}>
      {Icon && <Icon className="h-3.5 w-3.5" />}
      <span>{children}</span>
    </div>
  );
}

interface DashboardTagProps {
  children: ReactNode;
  icon?: LucideIcon;
  className?: string;
}

export function DashboardTag({
  children,
  icon: Icon,
  className,
}: DashboardTagProps) {
  return (
    <span className={cn("dashboard-tag", className)}>
      {Icon && <Icon className="h-3.5 w-3.5" />}
      <span>{children}</span>
    </span>
  );
}

interface DashboardMetricCardProps {
  icon: LucideIcon;
  label: ReactNode;
  value: ReactNode;
  change?: ReactNode;
  description?: ReactNode;
  className?: string;
  interactive?: boolean;
  iconTone?: IconTone;
  changeTone?: BadgeTone;
}

export function DashboardMetricCard({
  icon,
  label,
  value,
  change,
  description,
  className,
  interactive = true,
  iconTone = "default",
  changeTone = "neutral",
}: DashboardMetricCardProps) {
  return (
    <DashboardCard
      interactive={interactive}
      className={cn("p-6", className)}
    >
      <div className="flex items-start justify-between gap-4">
        <DashboardIconBadge icon={icon} tone={iconTone} />
        {change ? (
          <span
            className={cn(
              "dashboard-trend-pill",
              badgeToneMap[changeTone],
            )}
          >
            {change}
          </span>
        ) : null}
      </div>
      <div className="mt-6">
        <p className="dashboard-card-kicker">{label}</p>
        <div className="mt-2 text-[2rem] font-semibold leading-none text-[var(--cyber-text)]">
          {value}
        </div>
        {description ? (
          <p className="mt-3 text-sm leading-6 text-[var(--cyber-muted-text)]">
            {description}
          </p>
        ) : null}
      </div>
    </DashboardCard>
  );
}
