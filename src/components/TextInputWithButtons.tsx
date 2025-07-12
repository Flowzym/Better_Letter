import { Plus, Star } from 'lucide-react';
import { useState, type ChangeEvent, type KeyboardEvent } from 'react';

interface TextInputWithButtonsProps {
  value: string;
  onChange: (val: string) => void;
  onAdd: (val: string) => void;
  onAddFavorite: (val: string) => void;
  placeholder?: string;
}

export default function TextInputWithButtons({
  value,
  onChange,
  onAdd,
  onAddFavorite,
  placeholder = '',
}: TextInputWithButtonsProps) {
  const handleAdd = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    onChange('');
  };

  const handleAddFavorite = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onAddFavorite(trimmed);
    onChange('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="flex items-center gap-2 w-full">
      <input
        type="text"
        className={`transition-all duration-200 border rounded-md px-3 py-2 flex-grow focus:outline-none focus:ring-2 focus:ring-[#F29400] ${
          value ? 'w-[calc(100%-90px)]' : 'w-full'
        }`}
        placeholder={placeholder}
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      {value.trim() && (
        <div className="flex gap-1">
          <button
            type="button"
            onClick={handleAdd}
            className="bg-[#F5A623] hover:bg-[#e4941f] w-9 h-9 flex items-center justify-center rounded"
          >
            <Plus className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={handleAddFavorite}
            className="bg-[#F5A623] hover:bg-[#e4941f] w-9 h-9 flex items-center justify-center rounded"
          >
            <Star className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
