interface OrDividerProps {
  label?: string;
}

export function OrDivider({ label = "Ou" }: OrDividerProps) {
  return (
    <div className="flex items-center gap-[clamp(0.45rem,1vh,0.7rem)]">
      <div className="h-px flex-1 bg-[rgba(117,195,214,0.12)]" />
      <span className="text-[clamp(0.62rem,1.05vh,0.78rem)] font-semibold uppercase tracking-[0.2em] text-[var(--cyber-muted-text)] md:tracking-[0.24em]">
        {label}
      </span>
      <div className="h-px flex-1 bg-[rgba(117,195,214,0.12)]" />
    </div>
  );
}
