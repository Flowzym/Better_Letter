import type { ChangeEvent } from 'react';
import { X } from 'lucide-react';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder: string;
  rows?: number;
  id?: string;
  name?: string;
}

export default function TextInput({ 
  value, 
  onChange, 
  label, 
  placeholder, 
  rows = 6,
  id,
  name 
}: TextInputProps) {
  // Generate unique ID if not provided
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
  const textareaName = name || `textarea-${textareaId}`;
  const hasValue = value.trim().length > 0;

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={textareaId} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        <textarea
          id={textareaId}
          name={name || textareaName}
          value={value}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="w-full px-3 py-2 text-sm placeholder:text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:border-orange-500 pr-10"
          style={{ '--tw-ring-color': '#F29400' } as React.CSSProperties}
        />
        {hasValue && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-1 right-1 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}