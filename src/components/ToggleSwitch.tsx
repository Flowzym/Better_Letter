import React from 'react';
import { ToggleLeft, ToggleRight } from 'lucide-react';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  className?: string;
}

export default function ToggleSwitch({ checked, onChange, label, className = "" }: ToggleSwitchProps) {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className="flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200 cursor-pointer"
        title={checked ? `${label} deaktivieren` : `${label} aktivieren`}
      >
        {checked ? (
          <ToggleRight className="h-6 w-6" style={{ color: '#F29400' }} />
        ) : (
          <ToggleLeft className="h-6 w-6" />
        )}
      </button>
    </div>
  );
}