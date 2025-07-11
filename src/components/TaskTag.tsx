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
      variant="selected"
      isFavorite={isFavorite}
      type="task"
      onToggleFavorite={toggleFavoriteTask}
      onEdit={onEdit}
      onRemove={onRemove}
    />
  );
}
