import { X } from 'lucide-react';
import IconStar from './IconStar';
import TagContext from '../types/TagContext';

interface TagButtonProps {
  label: string;
  isFavorite?: boolean;
  variant: 'selected' | 'suggestion' | 'favorite';
  type?: string;
  onToggleFavorite?: (label: string, type?: string) => void;
  onRemove?: () => void;
  onEdit?: () => void;
  onClick?: () => void;
}

export default function TagButton({
  label,
  isFavorite = false,
  variant,
  type,
  onToggleFavorite,
  onRemove,
  onEdit,
  onClick,
}: TagButtonProps) {
  const baseClasses = 'rounded-full border flex items-center gap-1';

  const sizeClasses =
    variant === TagContext.Selected ? 'text-sm px-3 py-1' : 'text-sm px-2 py-1';

  let variantClasses = '';
  if (variant === TagContext.Selected) {
    variantClasses = 'bg-[#F29400] text-white border-[#F29400]';
  } else if (variant === TagContext.Suggestion) {
    variantClasses = 'bg-white text-gray-700 border-gray-300';
  } else if (variant === TagContext.Favorite) {
    variantClasses = 'bg-gray-100 border-gray-300 text-gray-700';
  } else {
    variantClasses = 'bg-white text-gray-700 border-[#F29400]';
  }

  let starStroke = '#4B5563';
  let starFill = 'none';

  if (isFavorite) {
    starStroke = '#FDE047';
    starFill = '#FDE047';
  } else if (variant === TagContext.Selected) {
    starStroke = '#FFFFFF';
  }

  const starSize = 14;


  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite?.(label, type);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove?.();
  };

  const handleLabelClick = (e: React.MouseEvent) => {
    if (!onEdit) return;
    e.stopPropagation();
    onEdit();
  };


  return (
    <button
      type="button"
      onClick={onClick}
      className={`${baseClasses} ${sizeClasses} ${variantClasses}`}
    >
      <div className="flex items-center gap-1.5">
        <span
          onClick={variant === TagContext.Selected ? handleLabelClick : undefined}
          className={onEdit ? 'cursor-text' : ''}
        >
          {label}
        </span>
        {isFavorite && (
          <span
            onClick={onToggleFavorite ? handleToggleFavorite : undefined}
            className={onToggleFavorite ? 'cursor-pointer' : ''}
            role="button"
            aria-label="Favorit"
            title="Favorit"
          >
            <IconStar
              size={starSize}
              stroke={starStroke}
              fill={starFill}
              strokeWidth={2}
            />
          </span>
        )}
        {onRemove && (
          <button
            type="button"
            onClick={handleRemove}
            aria-label="Entfernen"
          >
            <X
              className={`w-3 h-3 ml-1 ${
                variant === TagContext.Selected ? 'text-white' : 'text-gray-700'
              }`}
            />
          </button>
        )}
      </div>
    </button>
  );
}
