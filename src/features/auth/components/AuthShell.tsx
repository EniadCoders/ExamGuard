import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Activity, BarChart3, Lock, Shield } from "lucide-react";
import { GridBackground } from "@/shared/components/GridBackground";
import { Logo } from "@/shared/components/BrandLogo";
import { cn } from "@/shared/lib/cn";

export interface AuthFeatureItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface AuthMetricItem {
  label: string;
  value: string;
  detail: string;
}

export const authPlatformFeatures: AuthFeatureItem[] = [
  {
    icon: Shield,
    title: "Monitoring actif",
    description: "Detection temps reel des anomalies de session et des signaux de fraude.",
  },
  {
    icon: Lock,
    title: "Session verouillee",
    description: "Contexte securise, changement de fenetre controle et checkpoints automatiques.",
  },
  {
    icon: Activity,
    title: "Telemetry continue",
    description: "Piste d'audit continue pour chaque tentative, reprise et soumission d'examen.",
  },
  {
    icon: BarChart3,
    title: "Pilotage unifie",
    description: "Vue operations, analyse de performance et integrite reunies dans un meme produit.",
  },
];

export const authPlatformMetrics: AuthMetricItem[] = [
  { value: "24/7", label: "surveillance", detail: "telemetrie plateforme" },
  { value: "TLS 1.3", label: "transport", detail: "sessions chiffrées" },
  { value: "Live", label: "signaux", detail: "alertes instantanees" },
];

interface AuthShellProps {
  heroBadge: string;
  heroTitle: ReactNode;
  heroDescription: ReactNode;
  children: ReactNode;
  featureItems?: AuthFeatureItem[];
  metricItems?: AuthMetricItem[];
  footer?: ReactNode;
  panelClassName?: string;
}

export function AuthShell({
  heroBadge,
  heroTitle,
  heroDescription,
  children,
  featureItems = authPlatformFeatures,
  metricItems = authPlatformMetrics,
  footer,
  panelClassName,
}: AuthShellProps) {
  return (
    <div className="cyber-auth-shell bg-vision-dark text-white">
      <GridBackground variant="auth" />

      <div className="cyber-auth-grid">
        <aside className="cyber-auth-aside">
          <div className="space-y-10">
            <div className="cyber-brand-block">
              <div className="absolute -inset-5 rounded-[2rem] bg-[radial-gradient(circle,rgba(123,241,255,0.18),transparent_62%)] blur-2xl" />
              <Logo size="xl" className="relative" />
            </div>

            <div className="space-y-6">
              <div className="cyber-auth-kicker">
                <span className="h-2 w-2 rounded-full bg-[var(--cyber-accent-strong)] animate-pulse-soft" />
                {heroBadge}
              </div>

              <div>
                <h1 className="cyber-auth-title text-vision-gradient">{heroTitle}</h1>
                <div className="cyber-auth-description">{heroDescription}</div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="cyber-divider" />

            <div className="cyber-auth-features">
              {featureItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="cyber-auth-feature hover-lift-sm">
                    <div className="cyber-auth-feature-icon mb-4">
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="mb-1 text-sm font-semibold text-[var(--cyber-text)]">{item.title}</p>
                    <p className="text-xs leading-6 text-[var(--cyber-muted-text)]">{item.description}</p>
                  </div>
                );
              })}
            </div>

            <div className="cyber-auth-metrics">
              {metricItems.map((metric) => (
                <div key={metric.label} className="cyber-auth-metric">
                  <p className="text-xl font-bold text-[var(--cyber-text)]">{metric.value}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--cyber-accent-strong)]">
                    {metric.label}
                  </p>
                  <p className="mt-2 text-xs leading-5 text-[var(--cyber-subtle-text)]">{metric.detail}</p>
                </div>
              ))}
            </div>

            <p className="text-xs uppercase tracking-[0.18em] text-[var(--cyber-subtle-text)]">
              {footer ?? "ExamGuard secure assessment platform"}
            </p>
          </div>
        </aside>

        <main className="cyber-auth-main">
          <div className={cn("cyber-auth-panel animate-scaleRotate", panelClassName)}>
            <div className="mb-8 flex justify-center lg:hidden">
              <div className="cyber-brand-block">
                <div className="absolute -inset-5 rounded-[2rem] bg-[radial-gradient(circle,rgba(123,241,255,0.2),transparent_62%)] blur-2xl" />
                <Logo size="xl" className="relative" />
              </div>
            </div>

            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
