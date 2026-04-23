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
      onClick={() => setIsChecked((current) => !current)}
      className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 ${
        isChecked ? "bg-black border-black" : "bg-[#E5E5E5] border-[#CCCCCC]"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition duration-200 ${
          isChecked ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </button>
  );
}
