import { X } from 'lucide-react';
import IconStar from '../IconStar';

interface TagButtonSelectedProps {
  label: string;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onRemove?: () => void;
  onEdit?: () => void;
}

export default function TagButtonSelected({
  label,
  isFavorite = false,
  onToggleFavorite,
  onRemove,
  onEdit,
}: TagButtonSelectedProps) {
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite?.();
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove?.();
  };

  return (
    <button type="button" onClick={onEdit} className="tag-button-selected flex justify-between items-center gap-1">
      <span className="flex items-center gap-1">
        {label}
        {isFavorite && (
          <span onClick={handleToggle} className="star-icon" role="button" aria-label="Favorit">
            <IconStar size={16} fill="#FDE047" stroke="#FDE047" />
          </span>
        )}
      </span>
      {onRemove && (
        <button type="button" onClick={handleRemove} aria-label="Entfernen" className="text-white">
          <X className="w-3 h-3" />
        </button>
      )}
    </button>
  );
}
