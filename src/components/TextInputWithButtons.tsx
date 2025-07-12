import { Plus, Star } from 'lucide-react';
import type { ChangeEvent, KeyboardEvent } from 'react';

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
  const trimmed = value.trim();
  const hasValue = trimmed.length > 0;

  const handleAdd = () => {
    if (!hasValue) return;
    onAdd(trimmed);
    onChange('');
  };

  const handleAddFavorite = () => {
    if (!hasValue) return;
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
    <div className="flex items-center w-full">
      <input
        type="text"
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="flex-1 px-3 py-2 border rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-[#F29400]"
      />
      {hasValue && (
        <div className="flex gap-2 ml-2">
          <button
            type="button"
            onClick={handleAdd}
            className="w-10 h-10 bg-[#F6A800] text-white rounded-md flex items-center justify-center"
          >
            <Plus className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={handleAddFavorite}
            className="w-10 h-10 bg-[#F6A800] text-white rounded-md flex items-center justify-center"
          >
            <Star className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
