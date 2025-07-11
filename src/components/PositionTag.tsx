import React from 'react';
import { useLebenslaufContext } from '../context/LebenslaufContext';
import TagButton from './TagButton';

interface PositionTagProps {
  label: string;
  onRemove: () => void;
  onEdit?: () => void;
}

export default function PositionTag({ label, onRemove, onEdit }: PositionTagProps) {
  const { favoritePositions, toggleFavoritePosition } = useLebenslaufContext();
  const isFavorite = favoritePositions.includes(label);

  return (
    <TagButton
      label={label}
      variant="selected"
      isFavorite={isFavorite}
      type="position"
      onToggleFavorite={toggleFavoritePosition}
      onRemove={onRemove}
      onEdit={onEdit}
    />
  );
}
