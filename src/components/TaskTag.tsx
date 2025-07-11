import React from 'react';
import { useLebenslaufContext } from '../context/LebenslaufContext';
import TagButton from './TagButton';

interface TaskTagProps {
  label: string;
  onRemove: () => void;
  onEdit?: () => void;
}

export default function TaskTag({ label, onRemove, onEdit }: TaskTagProps) {
  const { favoriteTasks, toggleFavoriteTask } = useLebenslaufContext();
  const isFavorite = favoriteTasks.includes(label);

  return (
    <TagButton
      label={label}
      isSelected
      isFavorite={isFavorite}
      onToggleFavorite={() => toggleFavoriteTask(label)}
      onEdit={onEdit}
      onRemove={onRemove}
    />
  );
}
