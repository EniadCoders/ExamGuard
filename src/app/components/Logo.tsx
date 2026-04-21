import examGuardLogo from "figma:asset/59a7775f5e017d08337af1cfe4c068b69bdcb460.png";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeMap = {
  sm: "h-12",
  md: "h-16",
  lg: "h-20",
  xl: "h-28",
};

export function Logo({ size = "md", className = "" }: LogoProps) {
  return (
    <img
      src={examGuardLogo}
      alt="ExamGuard"
      className={`${sizeMap[size]} w-auto object-contain ${className}`}
    />
  );
}
