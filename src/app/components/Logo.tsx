import examGuardLogo from "figma:asset/59a7775f5e017d08337af1cfe4c068b69bdcb460.png";
import { cn } from "./ui/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  tone?: "light" | "brand";
}

const sizeMap = {
  sm: "h-7",
  md: "h-8",
  lg: "h-10",
  xl: "h-12 sm:h-14",
};

const toneMap = {
  light: "brightness-0 invert contrast-100",
  brand: "",
};

export function Logo({ size = "md", tone = "light", className = "" }: LogoProps) {
  return (
    <img
      src={examGuardLogo}
      alt="ExamGuard"
      className={cn(
        sizeMap[size],
        toneMap[tone],
        "w-auto object-contain drop-shadow-[0_0_18px_rgba(123,241,255,0.18)]",
        className,
      )}
    />
  );
}
