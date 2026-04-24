import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/shared/lib/cn";

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

const statusToneMap: Record<BadgeTone, string> = {
  neutral: "",
  info: "dashboard-status-text-info",
  success: "dashboard-status-text-success",
  warning: "dashboard-status-text-warning",
  danger: "dashboard-status-text-danger",
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
  const Icon = icon;
  return (
    <DashboardCard
      className={cn("relative overflow-hidden", className)}
      tone={tone}
      interactive={interactive}
    >
      {Icon && (
        <div className="dashboard-section-card-icon-background">
          <Icon className="w-full h-full" strokeWidth={1} />
        </div>
      )}
      <div className="dashboard-section-card-header">
        <div className="flex min-w-0 items-start gap-3">
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
      <div className={cn("p-4 sm:p-6", bodyClassName)}>{children}</div>
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
  const resolvedTone = tone ?? resolved?.tone ?? "neutral";

  return (
    <span
      className={cn(
        "dashboard-status-text",
        statusToneMap[resolvedTone],
        className,
      )}
    >
      {label ?? resolved?.label}
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
  className,
}: DashboardTagProps) {
  return (
    <span className={cn("dashboard-tag", className)}>
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
  label,
  value,
  change,
  description,
  className,
  interactive = true,
  changeTone = "neutral",
}: DashboardMetricCardProps) {
  return (
    <DashboardCard
      interactive={interactive}
      className={cn("metric-card-container", className)}
    >
      <div className="metric-card-content">
        <p className="metric-card-label">{label}</p>
        <div className="metric-card-value">
          {value}
        </div>
        {change ? (
          <span className={cn("metric-card-change", statusToneMap[changeTone])}>
            {change}
          </span>
        ) : null}
        {description ? (
          <p className="metric-card-description">
            {description}
          </p>
        ) : null}
      </div>
    </DashboardCard>
  );
}
