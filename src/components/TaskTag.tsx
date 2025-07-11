import React from 'react';
import { Star, Pencil, X } from 'lucide-react';
import { useLebenslaufContext } from '../context/LebenslaufContext';
import '../styles/Tags.css';

interface TaskTagProps {
  label: string;
  onRemove: () => void;
  onEdit?: () => void;
}

export default function TaskTag({ label, onRemove, onEdit }: TaskTagProps) {
  const { favoriteTasks, toggleFavoriteTask } = useLebenslaufContext();
  const isFavorite = favoriteTasks.includes(label);

  return (
    <div className="tag">
      <span className="mr-1">{label}</span>
      <button
        onClick={() => toggleFavoriteTask(label)}
        className="star-icon"
        aria-label="Favorit"
        title="Favorit"
      >
        <Star
          className="w-3 h-3"
          fill={isFavorite ? '#FDE047' : 'none'}
          stroke="#FDE047"
        />
      </button>
      {onEdit && (
        <button
          onClick={onEdit}
          className="tag-icon-button"
          aria-label="Bearbeiten"
        >
          <Pencil className="tag-icon" />
        </button>
      )}
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
