import React from 'react';
import { useLebenslaufContext } from '../context/LebenslaufContext';
import TagButton from './TagButton';

interface PositionTagProps {
  label: string;
  onRemove: () => void;
}

export default function PositionTag({ label, onRemove }: PositionTagProps) {
  const { favoritePositions, toggleFavoritePosition } = useLebenslaufContext();
  const isFavorite = favoritePositions.includes(label);

  return (
    <TagButton
      label={label}
      isSelected
      isFavorite={isFavorite}
      onToggleFavorite={() => toggleFavoritePosition(label)}
      onRemove={onRemove}
    />
  );
}
