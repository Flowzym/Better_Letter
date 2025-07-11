import React from 'react';
import { Star, X } from 'lucide-react';
import { useLebenslaufContext } from '../context/LebenslaufContext';
import '../styles/Tags.css';

interface PositionTagProps {
  label: string;
  onRemove: () => void;
}

export default function PositionTag({ label, onRemove }: PositionTagProps) {
  const { favoritePositions, toggleFavoritePosition } = useLebenslaufContext();
  const isFavorite = favoritePositions.includes(label);

  return (
    <div className="tag">
      <span className="mr-1">{label}</span>
      <button
        onClick={() => toggleFavoritePosition(label)}
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
