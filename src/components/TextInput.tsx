import type { CSSProperties, ChangeEvent } from 'react';

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

  return (
    <div className="space-y-2">
      <label htmlFor={textareaId} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <textarea
        id={textareaId}
        name={textareaName}
        value={value}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)} // specify event type
        placeholder={placeholder}
        rows={rows}
        className="w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 resize-vertical min-h-[120px]"
        style={{ 
          borderColor: '#F29400',
          '--tw-ring-color': '#F29400'
        } as CSSProperties}
      />
    </div>
  );
}
