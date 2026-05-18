interface RoleTabsProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: ReadonlyArray<{ value: T; label: string }>;
}

const tabBaseClass =
  "rounded-[0.78rem] px-3 py-[clamp(0.58rem,1.15vh,0.72rem)] text-[clamp(0.68rem,1.2vh,0.84rem)] font-semibold transition sm:rounded-[0.9rem] sm:px-4 md:rounded-[0.95rem]";

export function RoleTabs<T extends string>({ value, onChange, options }: RoleTabsProps<T>) {
  return (
    <div className="grid grid-cols-2 gap-1 rounded-[0.95rem] border border-[rgba(117,195,214,0.14)] bg-[rgba(8,18,27,0.86)] p-1 md:rounded-[1.05rem]">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`${tabBaseClass} ${
            value === option.value
              ? "cyber-button-primary"
              : "text-[var(--cyber-muted-text)] hover:bg-[rgba(123,241,255,0.08)] hover:text-white"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
