import { Star, Pencil, X } from 'lucide-react';
import '../styles/_tags.scss';

interface TagButtonProps {
  label: string;
  isSelected?: boolean;
  isFavorite?: boolean;
  isSuggestion?: boolean;
  onToggleFavorite: () => void;
  onClick?: () => void;
  onRemove?: () => void;
  onEdit?: () => void;
}

export default function TagButton({
  label,
  isSelected = false,
  isFavorite = false,
  isSuggestion = false,
  onToggleFavorite,
  onClick,
  onRemove,
  onEdit,
}: TagButtonProps) {
  const classes = ['tag'];
  if (isSelected) classes.push('tag--selected');
  if (isSuggestion) classes.push('tag--suggestion');
  if (isFavorite) classes.push('tag--favorite');

  const starStroke = isFavorite
    ? 'none'
    : isSuggestion
      ? '#F29400'
      : 'white';

  return (
    <button type="button" onClick={onClick} className={classes.join(' ')}>
      <span className="mr-1">{label}</span>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite();
        }}
        className="star-icon"
        aria-label="Favorit"
        title="Favorit"
      >
        <Star className="w-3 h-3" fill={isFavorite ? '#FDE047' : 'none'} stroke={starStroke} />
      </button>
      {onEdit && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="tag-icon-button"
          aria-label="Bearbeiten"
        >
          <Pencil className="tag-icon" />
        </button>
      )}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="tag-icon-button"
          aria-label="Entfernen"
        >
          <X className="tag-icon" />
        </button>
      )}
    </button>
  );
}
