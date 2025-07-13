import { Plus, Star, X } from 'lucide-react';
import type { ChangeEvent, KeyboardEvent } from 'react';

interface TextInputWithButtonsProps {
  value: string;
  onChange: (val: string) => void;
  onAdd: (val: string) => void;
  onFavoriteClick: (val: string) => void;
  placeholder?: string;
  showButtons?: boolean;
}

export default function TextInputWithButtons({
  value,
  onChange,
  onAdd,
  onFavoriteClick,
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

  const handleFavoriteClick = () => {
    if (!hasValue) return;
    onFavoriteClick(trimmed);
    onChange('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="flex items-center w-full space-x-2">
      <div className="relative flex-1">
        <input
          type="text"
          value={value}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 px-3 h-10 border rounded-md transition-all focus:outline-none focus:ring-1 focus:ring-[#F29400] pr-10"
        />
        {hasValue && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-300"
            aria-label="Textfeld leeren"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      {buttonsVisible && (
        <div className="flex-shrink-0 flex">
          <button
            type="button"
            onClick={handleAdd}
            className="w-10 h-10 bg-[#F6A800] text-white rounded-md flex items-center justify-center"
          >
            <Plus className="text-xl" />
          </button>
          <button
            type="button"
            onClick={handleFavoriteClick}
            className="w-10 h-10 bg-[#F6A800] text-white rounded-md flex items-center justify-center"
          >
            <Star className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}