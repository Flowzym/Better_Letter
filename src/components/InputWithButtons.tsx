import { Plus, Star } from 'lucide-react';
import type { ChangeEvent, KeyboardEvent } from 'react';

interface InputWithButtonsProps {
  value: string;
  onChange: (val: string) => void;
  onAdd: (val: string) => void;
  onAddFavorite: (val: string) => void;
  placeholder?: string;
  variant?: 'default' | 'compact';
}

export default function InputWithButtons({
  value,
  onChange,
  onAdd,
  onAddFavorite,
  placeholder = '',
  variant = 'default',
}: InputWithButtonsProps) {
  const hasValue = value.trim().length > 0;
  const isCompact = variant === 'compact';

  const btnSize = isCompact ? 'w-8 h-8' : 'w-10 h-10';
  const plusIcon = isCompact ? 'w-4 h-4' : 'w-5 h-5';
  const starIcon = isCompact ? 'w-3 h-3' : 'w-4 h-4';

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
    <div className="flex items-center w-full">
      <input
        type="text"
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#F29400]"
      />
      {hasValue && (
        <div className="flex items-center ml-2 gap-1">
          <button
            type="button"
            onClick={handleAdd}
            className={`${btnSize} bg-[#F6A800] text-white flex items-center justify-center rounded-md`}
          >
            <Plus className={plusIcon} />
          </button>
          <button
            type="button"
            onClick={handleAddFavorite}
            className={`${btnSize} bg-[#F6A800] text-white flex items-center justify-center rounded-md`}
          >
            <Star className={starIcon} />
          </button>
        </div>
      )}
    </div>
  );
}

