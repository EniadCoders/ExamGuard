import { useState } from "react";

interface ToggleSwitchProps {
  initialChecked?: boolean;
  defaultChecked?: boolean;
}

export function ToggleSwitch({
  initialChecked = false,
  defaultChecked,
}: ToggleSwitchProps) {
  const [isChecked, setIsChecked] = useState(defaultChecked ?? initialChecked);

  return (
    <button
      type="button"
      data-ui="switch"
      onClick={() => setIsChecked((current) => !current)}
      className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 ${
        isChecked
          ? "bg-[var(--cyber-accent-strong)] border-[var(--cyber-accent-strong)] shadow-[0_0_0_1px_rgba(123,241,255,0.35),0_0_8px_rgba(123,241,255,0.4)]"
          : "bg-[#E5E7EB] border-[#9CA3AF]"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.5)] transition duration-200 ${
          isChecked ? "translate-x-4 bg-white" : "translate-x-0 bg-[#1F2937]"
        }`}
      />
    </button>
  );
}
