import { X } from 'lucide-react';
import IconStar from './IconStar';

interface TagButtonProps {
  label: string;
  isFavorite?: boolean;
  variant: 'selected' | 'suggested' | 'favorite';
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
    variant === 'selected' ? 'text-sm px-3 py-1' : 'text-sm px-2 py-1';

  let variantClasses = '';
  if (variant === 'selected') {
    variantClasses = 'bg-[#F29400] text-white border-[#F29400]';
  } else if (variant === 'suggested') {
    variantClasses = 'bg-white text-gray-700 border-gray-300';
  } else {
    // favorite
    variantClasses = 'bg-white text-gray-700 border-[#F29400]';
  }


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
      <span
        onClick={variant === 'selected' ? handleLabelClick : undefined}
        className={onEdit ? 'cursor-text' : ''}
      >
        {label}
      </span>
      <div className="ml-auto flex items-center gap-[4px] justify-end">
        <span
          onClick={onToggleFavorite ? handleToggleFavorite : undefined}
          className={onToggleFavorite ? 'cursor-pointer flex' : 'flex'}
          role="button"
          aria-label="Favorit"
          title="Favorit"
        >
          <IconStar filled={isFavorite} size={16} strokeColor="#F29400" />
        </span>
        {onRemove && (
          <button
            type="button"
            onClick={handleRemove}
            aria-label="Entfernen"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>
    </button>
  );
}
