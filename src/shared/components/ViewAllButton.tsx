import { ChevronRight } from "lucide-react";
import { cn } from "@/shared/lib/cn";

interface ViewAllButtonProps {
  onClick?: () => void;
  className?: string;
}

export function ViewAllButton({ onClick, className }: ViewAllButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        // Base styling
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg",
        // Typography
        "text-xs font-medium",
        // Colors
        "text-[var(--cyber-muted-text)]",
        "bg-transparent",
        // Border
        "border border-transparent",
        // Transitions
        "transition-all duration-200",
        // Hover state
        "hover:text-[var(--cyber-text)]",
        "hover:bg-[rgba(11,27,38,0.48)]",
        "hover:border-[rgba(117,195,214,0.18)]",
        // Focus state
        "focus:outline-none",
        "focus:ring-2 focus:ring-[rgba(123,241,255,0.4)]",
        "focus:ring-offset-0",
        // Active/pressed state
        "active:bg-[rgba(11,27,38,0.68)]",
        className,
      )}
    >
      Voir tout
      <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
    </button>
  );
}
