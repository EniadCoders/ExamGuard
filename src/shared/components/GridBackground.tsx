import { cn } from "@/shared/lib/cn";

interface GridBackgroundProps {
  variant?: "auth" | "dashboard" | "exam" | "default";
  className?: string;
}

const variantMap = {
  default: {
    minor: "rgba(123, 241, 255, 0.06)",
    major: "rgba(61, 216, 233, 0.08)",
    primary: "rgba(61, 216, 233, 0.14)",
    secondary: "rgba(11, 89, 108, 0.18)",
    tertiary: "rgba(123, 241, 255, 0.09)",
  },
  auth: {
    minor: "rgba(123, 241, 255, 0.06)",
    major: "rgba(61, 216, 233, 0.08)",
    primary: "rgba(61, 216, 233, 0.18)",
    secondary: "rgba(8, 84, 110, 0.24)",
    tertiary: "rgba(123, 241, 255, 0.1)",
  },
  dashboard: {
    minor: "rgba(123, 241, 255, 0.045)",
    major: "rgba(61, 216, 233, 0.06)",
    primary: "rgba(61, 216, 233, 0.12)",
    secondary: "rgba(7, 60, 79, 0.18)",
    tertiary: "rgba(123, 241, 255, 0.07)",
  },
  exam: {
    minor: "rgba(123, 241, 255, 0.04)",
    major: "rgba(61, 216, 233, 0.05)",
    primary: "rgba(61, 216, 233, 0.1)",
    secondary: "rgba(10, 73, 93, 0.15)",
    tertiary: "rgba(123, 241, 255, 0.06)",
  },
} satisfies Record<string, { minor: string; major: string; primary: string; secondary: string; tertiary: string }>;

export function GridBackground({ variant = "default", className }: GridBackgroundProps) {
  const colors = variantMap[variant];

  return (
    <div className={cn("fixed inset-0 pointer-events-none overflow-hidden", className)}>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(${colors.minor} 1px, transparent 1px),
            linear-gradient(90deg, ${colors.minor} 1px, transparent 1px)
          `,
          backgroundSize: "42px 42px",
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(${colors.major} 1px, transparent 1px),
            linear-gradient(90deg, ${colors.major} 1px, transparent 1px)
          `,
          backgroundSize: "170px 170px",
        }}
      />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(123,241,255,0.12),transparent_28%),linear-gradient(180deg,rgba(4,9,15,0.15),rgba(4,9,15,0.05))]" />

      <div
        className="absolute -top-36 left-[10%] h-[34rem] w-[34rem] rounded-full blur-[140px] animate-drift-slow"
        style={{ background: colors.primary }}
      />
      <div
        className="absolute top-[18%] right-[-8rem] h-[28rem] w-[28rem] rounded-full blur-[130px] animate-drift-medium"
        style={{ background: colors.secondary, animationDelay: "0.8s" }}
      />
      <div
        className="absolute bottom-[-10rem] left-[24%] h-[24rem] w-[48rem] rounded-full blur-[120px] animate-drift-wide"
        style={{ background: colors.tertiary, animationDelay: "1.6s" }}
      />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_42%,rgba(4,9,15,0.78)_100%)]" />
    </div>
  );
}
