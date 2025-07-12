import React, { ChangeEvent, KeyboardEvent } from 'react';

interface InputWithActionsProps {
  value: string;
  placeholder?: string;
  onChange: (v: string) => void;
  onAdd: (v: string) => void;
  onAddFavorite: (v: string) => void;
}

export default function InputWithActions({
  value,
  placeholder = '',
  onChange,
  onAdd,
  onAddFavorite,
}: InputWithActionsProps) {
  const hasValue = value.trim().length > 0;

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
    <div className="flex w-full">
      <input
        type="text"
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="flex-1 border rounded-l-md py-2 px-3 transition-all focus:border-[#F29400] focus:outline-none"
      />
      {hasValue && (
        <>
          <button
            type="button"
            onClick={handleAdd}
            className="h-[42px] bg-[#F6A800] text-white px-3 rounded-md hover:opacity-90"
          >
            +
          </button>
          <button
            type="button"
            onClick={handleAddFavorite}
            className="h-[42px] bg-[#F6A800] text-white px-3 rounded-md hover:opacity-90 ml-1"
          >
            ★
          </button>
        </>
      )}
    </div>
  );
}
