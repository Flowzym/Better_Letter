import { X } from 'lucide-react';
import IconStar from '../IconStar';

interface TagButtonFavoriteProps {
  label: string;
  onClick?: () => void;
  onRemove?: () => void;
}

export default function TagButtonFavorite({ label, onClick, onRemove }: TagButtonFavoriteProps) {
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove?.();
  };

  return (
    <button type="button" onClick={onClick} className="tag-button-favorite flex justify-between items-center gap-1">
      <span className="flex items-center gap-1">
        {label}
        <IconStar size={16} fill="#FDE047" stroke="#FDE047" />
      </span>
      {onRemove && (
        <button type="button" onClick={handleRemove} aria-label="Entfernen" className="text-gray-600">
          <X className="w-3 h-3" />
        </button>
      )}
    </button>
  );
}
