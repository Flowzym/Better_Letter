import { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { useLebenslaufContext } from '../context/LebenslaufContext';
import TagButtonSelected from './ui/TagButtonSelected';

interface CompanyTagProps {
  label: string;
  onRemove: () => void;
  onEdit: (value: string) => void;
}

export default function CompanyTag({ label, onRemove, onEdit }: CompanyTagProps) {
  const { favoriteCompanies, toggleFavoriteCompany } = useLebenslaufContext();
  const isFavorite = favoriteCompanies.includes(label);

  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(label);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      setEditValue(label);
      inputRef.current?.focus();
    }
  }, [editing, label]);

  const confirmEdit = () => {
    setEditing(false);
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== label) {
      onEdit(trimmed);
    }
  };

  if (editing) {
    return (
      <div className="tag flex-shrink-0">
        <input
          ref={inputRef}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={confirmEdit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') confirmEdit();
          }}
          className="text-black px-2 py-1 rounded bg-white"
          size={editValue.length + 5}
          style={{ 
            width: `${Math.max(editValue.length + 3, 10)}ch`,
            minWidth: `${editValue.length + 3}ch`
          }}
          autoFocus
        />
        <button
          onClick={onRemove}
          className="tag-icon-button"
          aria-label="Entfernen"
        >
          <X className="tag-icon" />
        </button>
      </div>
    );
  }

  return (
    <TagButtonSelected
      label={label}
      isFavorite={isFavorite}
      onToggleFavorite={() => toggleFavoriteCompany(label)}
      onRemove={onRemove}
      onEdit={() => setEditing(true)}
    />
  );
}

