import React from 'react';
import { useLebenslaufContext } from '../context/LebenslaufContext';
import TagButtonSelected from './ui/TagButtonSelected';

interface PositionTagProps {
  label: string;
  onRemove: () => void;
  onEdit?: (newLabel: string) => void;
}

export default function PositionTag({ label, onRemove, onEdit }: PositionTagProps) {
  const { favoritePositions, toggleFavoritePosition } = useLebenslaufContext();
  const isFavorite = favoritePositions.includes(label);

  return (
    <TagButtonSelected
      label={label}
      isFavorite={isFavorite}
      onToggleFavorite={() => toggleFavoritePosition(label)}
      onRemove={onRemove}
      onEdit={(newLabel) => onEdit?.(newLabel)}
    />
  );
}
