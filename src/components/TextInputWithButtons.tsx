import { Plus, Star } from 'lucide-react';
import type { ChangeEvent, KeyboardEvent } from 'react';

interface TextInputWithButtonsProps {
  value: string;
  onChange: (val: string) => void;
  onAdd: (val: string) => void;
  onFavorite: (val: string) => void;
  placeholder?: string;
  showButtons?: boolean;
}

export default function TextInputWithButtons({
  value,
  onChange,
  onAdd,
  onFavorite,
  placeholder = '',
  showButtons,
}: TextInputWithButtonsProps) {
  const trimmed = value.trim();
  const hasValue = trimmed.length > 0;
  const buttonsVisible = showButtons ?? hasValue;

  const handleAdd = () => {
    if (!hasValue) return;
    onAdd(trimmed);
    onChange('');
  };

  const handleFavorite = () => {
    if (!hasValue) return;
    onFavorite(trimmed);
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
        className="flex-1 px-3 h-10 border rounded-md transition-all focus:outline-none focus:ring-1 focus:ring-[#F29400]"
      />
      {buttonsVisible && (
        <div className="flex gap-2 ml-2">
          <button
            type="button"
            onClick={handleAdd}
            className="w-10 h-10 bg-[#F6A800] text-white rounded-md flex items-center justify-center"
          >
            <Plus className="text-xl" />
          </button>
          <button
            type="button"
            onClick={handleFavorite}
            className="w-10 h-10 bg-[#F6A800] text-white rounded-md flex items-center justify-center"
          >
            <Star className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
