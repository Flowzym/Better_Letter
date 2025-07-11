import { Star, X } from 'lucide-react';

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
    variantClasses = 'bg-white text-gray-700 border-[#FDE047]';
  }

  const starStroke = variant === 'suggested' ? '#F29400' : 'white';
  const starFill = isFavorite ? '#FDE047' : 'none';

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
      <span onClick={variant === 'selected' ? handleLabelClick : undefined} className={onEdit ? 'cursor-text' : ''}>{label}</span>
      {variant !== 'favorite' && onToggleFavorite && (
        <span
          onClick={handleToggleFavorite}
          className="ml-1 cursor-pointer"
          role="button"
          aria-label="Favorit"
          title="Favorit"
        >
          <Star className="w-3 h-3" stroke={starStroke} fill={starFill} />
        </span>
      )}
      {onRemove && (
        <button
          type="button"
          onClick={handleRemove}
          className="ml-1"
          aria-label="Entfernen"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </button>
  );
}
