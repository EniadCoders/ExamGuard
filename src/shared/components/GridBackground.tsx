"use client";

import { useEffect, useRef } from "react";
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
  const containerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const glowPos = useRef({ x: 0, y: 0 });
  const isMouseInside = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    const glow = glowRef.current;
    if (!container || !glow) return;

    let animationFrameId: number;

    // Easing function for smooth trailing
    const easeOutQuad = (t: number) => 1 - (1 - t) * (1 - t);

    const updateGlowPosition = () => {
      // Lerp (linear interpolation) with easing for smooth trailing
      const easing = 0.12; // Lower = smoother trail, higher = snappier
      glowPos.current.x += (mousePos.current.x - glowPos.current.x) * easing;
      glowPos.current.y += (mousePos.current.y - glowPos.current.y) * easing;

      // Update CSS variables for position
      glow.style.setProperty("--cursor-x", `${glowPos.current.x}px`);
      glow.style.setProperty("--cursor-y", `${glowPos.current.y}px`);

      // Continue animation loop
      animationFrameId = requestAnimationFrame(updateGlowPosition);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
    };

    const handleMouseLeave = () => {
      isMouseInside.current = false;
      glow.style.opacity = "0";
    };

    const handleMouseEnter = () => {
      isMouseInside.current = true;
      glow.style.opacity = "1";
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    // Start the animation loop
    animationFrameId = requestAnimationFrame(updateGlowPosition);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div ref={containerRef} className={cn("fixed inset-0 pointer-events-none overflow-hidden", className)}>
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

      {/* Animated drift blobs */}
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

      {/* Additional ambient glow layers for enhanced depth */}
      <div
        className="absolute top-[30%] right-[15%] h-[32rem] w-[32rem] rounded-full animate-ambient-glow"
        style={{
          background: `radial-gradient(circle, rgba(61, 216, 233, 0.08), transparent)`,
          animationDelay: "2.4s",
        }}
      />
      <div
        className="absolute bottom-[20%] left-[5%] h-[28rem] w-[28rem] rounded-full animate-gentle-float"
        style={{
          background: `radial-gradient(circle, rgba(123, 241, 255, 0.06), transparent)`,
          animationDelay: "1.2s",
        }}
      />

      {/* Cursor-following glow effect with animation */}
      <div
        ref={glowRef}
        className="cursor-following-glow animate-glow-pulse"
        style={
          {
            "--cursor-x": "0px",
            "--cursor-y": "0px",
          } as React.CSSProperties
        }
      />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_42%,rgba(4,9,15,0.78)_100%)]" />
    </div>
  );
}
