import type { ReactNode } from "react";
import { GridBackground } from "@/shared/components/GridBackground";
import { Logo } from "@/shared/components/BrandLogo";
import { cn } from "@/shared/lib/cn";

interface AuthPageLayoutProps {
  children: ReactNode;
}

interface AuthCardProps {
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}

interface AuthHeadingProps {
  title: ReactNode;
  description: ReactNode;
}

export const authProviderButtonClass =
  "flex h-[clamp(2.25rem,4.2vh,2.75rem)] items-center justify-center rounded-[0.9rem] border border-[rgba(117,195,214,0.14)] bg-[rgba(11,21,31,0.9)] text-[var(--cyber-muted-text)] transition hover:border-[rgba(123,241,255,0.34)] hover:bg-[rgba(14,27,39,0.98)] hover:text-white sm:rounded-[0.95rem] md:rounded-[1.05rem]";

export const authFieldClass =
  "cyber-input h-[clamp(2.55rem,4.7vh,3rem)] w-full rounded-[0.95rem] px-[clamp(0.85rem,1vw,1rem)] text-[clamp(0.82rem,1.45vh,0.95rem)] text-[var(--cyber-text)] sm:rounded-[1rem] md:rounded-[1.05rem]";

export const authLabelClass =
  "cyber-label mb-[clamp(0.32rem,0.7vh,0.45rem)] text-[clamp(0.72rem,1.08vh,0.82rem)]";

export const authPrimaryButtonClass =
  "cyber-button-primary flex h-[clamp(2.65rem,4.9vh,3.05rem)] w-full items-center justify-center rounded-[0.95rem] px-5 text-[clamp(0.82rem,1.35vh,0.96rem)] font-bold disabled:cursor-not-allowed disabled:opacity-70 md:rounded-[1.05rem]";

export const authSecondaryButtonClass =
  "cyber-button-secondary flex h-[clamp(2.65rem,4.9vh,3.05rem)] w-full items-center justify-center rounded-[0.95rem] px-5 text-[clamp(0.82rem,1.35vh,0.96rem)] font-semibold md:rounded-[1.05rem]";

export const authTextLinkClass =
  "font-semibold text-[var(--cyber-accent)] transition hover:text-white";

export const authFooterTextClass = "text-[clamp(0.74rem,1.25vh,0.9rem)]";

export const authFooterLinkClass =
  "font-medium text-[var(--cyber-accent)] transition hover:text-white";

export function AuthPageLayout({ children }: AuthPageLayoutProps) {
  return (
    <div className="relative min-h-screen overflow-x-hidden overflow-y-auto bg-[var(--cyber-bg)] px-2 py-2 sm:px-4 sm:py-4 md:h-dvh md:overflow-hidden md:px-6 md:py-4 lg:px-8">
      <GridBackground variant="auth" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,9,15,0.28)_0%,rgba(4,9,15,0.18)_42%,rgba(4,9,15,0.34)_100%)]" />

      <div className="relative mx-auto flex min-h-[calc(100dvh-1rem)] w-full max-w-5xl flex-col items-center justify-center gap-[clamp(0.75rem,1.8vh,1.35rem)] sm:min-h-[calc(100dvh-2rem)] md:h-full md:min-h-0">
        <div className="flex justify-center">
          <Logo size="xl" className="h-[clamp(2rem,4.4vh,2.85rem)] md:h-[clamp(2.2rem,4.8vh,3.15rem)]" />
        </div>

        {children}
      </div>
    </div>
  );
}

export function AuthCard({ children, className, bodyClassName }: AuthCardProps) {
  return (
    <div
      className={cn(
        "flex w-full max-w-md flex-col justify-center rounded-[1.15rem] border border-[rgba(117,195,214,0.18)] bg-[rgba(9,16,24,0.9)] p-[clamp(0.85rem,1.8vh,1.35rem)] shadow-[0_32px_90px_rgba(0,0,0,0.45)] backdrop-blur-xl md:max-h-full md:max-w-[32rem] md:rounded-[1.4rem] lg:max-w-[33rem]",
        className,
      )}
    >
      <div
        className={cn(
          "mx-auto flex w-full max-w-[28rem] flex-col gap-[clamp(0.65rem,1.35vh,1rem)]",
          bodyClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function AuthHeading({ title, description }: AuthHeadingProps) {
  return (
    <div className="text-center">
      <h1 className="text-[clamp(1.35rem,3.3vh,2.05rem)] font-bold leading-[1.05] text-[var(--cyber-text)] md:text-[clamp(1.55rem,3.6vh,2.2rem)]">
        {title}
      </h1>
      <p className="mt-[clamp(0.22rem,0.7vh,0.45rem)] text-[clamp(0.76rem,1.2vh,0.92rem)] leading-[1.45] text-[var(--cyber-muted-text)]">
        {description}
      </p>
    </div>
  );
}
