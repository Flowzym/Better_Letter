import { useState } from 'react';
import { X } from 'lucide-react';

interface CompaniesTagInputProps {
  value: string[];
  onChange: (companies: string[]) => void;
}

export default function CompaniesTagInput({ value, onChange }: CompaniesTagInputProps) {
  const [inputValue, setInputValue] = useState('');

  const addCompany = (val?: string) => {
    const c = (val ?? inputValue).trim();
    if (!c || value.includes(c)) return;
    onChange([...value, c]);
    setInputValue('');
  };

  const removeCompany = (c: string) => {
    onChange(value.filter((v) => v !== c));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addCompany();
    }
  };

  return (
    <div className="space-y-2">
      <input
        type="text"
        placeholder="Firma hinzufügen..."
        className="w-full px-3 py-2 border rounded"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((c) => (
            <div key={c} className="tag">
              <span>{c}</span>
              <button
                onClick={() => removeCompany(c)}
                className="tag-icon-button"
                aria-label="Entfernen"
              >
                <X className="tag-icon" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
