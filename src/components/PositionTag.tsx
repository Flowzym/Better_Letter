import React from 'react';
import { useLebenslaufContext } from '../context/LebenslaufContext';
import TagButton from './TagButton';
import TagContext from '../types/TagContext';

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
      variant={TagContext.Selected}
      isFavorite={isFavorite}
      type="position"
      onToggleFavorite={toggleFavoritePosition}
      onRemove={onRemove}
      onEdit={onEdit}
    />
  );
}
