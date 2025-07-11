import { Star, Pencil, X } from 'lucide-react';

interface TagButtonProps {
  label: string;
  isFavorite: boolean;
  variant: 'selected' | 'suggestion' | 'favorite';
  onToggleFavorite?: () => void;
  onRemove?: () => void;
  onEdit?: () => void;
  onClick?: () => void;
}

export default function TagButton({
  label,
  isFavorite,
  variant,
  onToggleFavorite,
  onRemove,
  onEdit,
  onClick,
}: TagButtonProps) {
  const baseClasses =
    'rounded-full text-sm border flex items-center gap-1 px-3 py-1';

  let variantClasses = '';
  if (variant === 'selected') {
    variantClasses = 'bg-[#F29400] text-white border-[#F29400]';
  } else if (variant === 'suggestion') {
    variantClasses = 'bg-white text-gray-700 border-gray-300';
  } else {
    // favorite
    variantClasses = 'bg-white text-gray-700 border-[#F29400]';
  }

  const starStroke = variant === 'suggestion' ? '#F29400' : 'white';
  const starFill = variant === 'selected' && isFavorite ? '#FDE047' : 'none';

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite?.();
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove?.();
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.();
  };

  return (
    <button type="button" onClick={onClick} className={`${baseClasses} ${variantClasses}`}>
      <span>{label}</span>
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
      {variant === 'selected' && onEdit && (
        <button
          type="button"
          onClick={handleEdit}
          className="ml-1"
          aria-label="Bearbeiten"
        >
          <Pencil className="w-3 h-3" />
        </button>
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
