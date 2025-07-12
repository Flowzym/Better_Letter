import React from 'react';
import TagButton from '../TagButton';

interface TagButtonFavoriteProps {
  label: string;
  onClick?: () => void;
  onRemove?: () => void;
}

export default function TagButtonFavorite({ label, onClick, onRemove }: TagButtonFavoriteProps) {
  return (
    <TagButton
      label={label}
      variant="favorite"
      isFavorite
      onClick={onClick}
      onRemove={onRemove}
    />
  );
}
