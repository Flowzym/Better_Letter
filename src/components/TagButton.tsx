import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import IconStar from "./IconStar";
import TagContext from "../types/TagContext";

interface TagButtonProps {
  label: string;
  isFavorite?: boolean;
  variant?: "selected" | "suggestion" | "favorite";
  editable?: boolean;
  type?: string;
  onToggleFavorite?: (label: string, type?: string) => void;
  onRemove?: () => void;
  onEdit?: (newLabel: string) => void;
  onClick?: () => void;
}

export default function TagButton({
  label,
  isFavorite = false,
  variant = TagContext.Suggestion,
  editable = false,
  type,
  onToggleFavorite,
  onRemove,
  onEdit,
  onClick,
}: TagButtonProps) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(label);
  const [originalLabel, setOriginalLabel] = useState(label);
  const inputRef = useRef<HTMLInputElement>(null);

  // Nur setzen wenn sich das Label ändert UND wir nicht gerade bearbeiten
  useEffect(() => {
    if (!editing && label !== originalLabel) {
      setEditValue(label);
      setOriginalLabel(label);
    }
  }, [label, editing, originalLabel]);

  const baseClasses =
    "rounded-full border flex items-center";
  const contentClasses =
    variant === TagContext.Favorite
      ? "flex items-center space-x-2"
      : "flex items-center";

  let variantClasses = "";
  if (variant === TagContext.Selected) {
    // Ausgewählter Tag: 20px, fett, viel Padding - mit CSS-Klasse für !important
    variantClasses =
      "bg-[#F29400] text-white border-[#F29400] tag-button-override tag-selected-override";
  } else if (variant === TagContext.Suggestion) {
    // Vorschlags-Tag: 16px, normales Padding - mit CSS-Klasse für !important
    variantClasses = "bg-white text-gray-700 border-gray-300 tag-button-override tag-other-override";
  } else if (variant === TagContext.Favorite) {
    // Favoriten-Tag: 16px, normales Padding - mit CSS-Klasse für !important
    variantClasses = "bg-[#f8f8f8] text-gray-600 tag-button-override tag-other-override";
  } else {
    // Fallback für andere Varianten
    variantClasses = "bg-white text-gray-700 border-[#F29400] tag-button-override tag-other-override";
  }

  const starStroke = isFavorite
    ? "#FDE047"
    : variant === TagContext.Selected
      ? "#FFFFFF"
      : "#4B5563";
  const starFill = isFavorite ? "#FDE047" : "none";
  const starStrokeWidth = isFavorite ? 0 : 1; // Dünnere Outline für ungefüllte Sterne
  
  const starIconSize = variant === TagContext.Selected ? 16 : 14;
  const xIconSize = variant === TagContext.Selected ? "w-3.5 h-3.5" : "w-3 h-3";

  // Gap zwischen Elementen - größer für ausgewählte Buttons
  const contentGapClass = variant === TagContext.Selected ? "gap-2" : "gap-1";
  
  const startEditing = (e: React.MouseEvent) => {
    if (!editable) return;
    e.stopPropagation();
    setEditValue(label);
    setOriginalLabel(label);
    setEditing(true);
    setTimeout(() => inputRef.current?.select(), 0); // Select text on focus
  };

  const finishEditing = () => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== originalLabel && onEdit) {
      onEdit?.(trimmed);
    }
    setEditing(false);
  };

  const handleEditKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setEditValue(originalLabel);
      e.preventDefault();
      finishEditing();
    } else if (e.key === "Escape") {
      e.preventDefault();
      cancelEditing();
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite?.(label, type);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent button click when removing
    onRemove?.();
  };

  return (
    <button 
      type="button" // Ensure it's a button type
      onClick={onClick}
      className={`${baseClasses} ${variantClasses} flex items-center`}
    >
      <div className={`${contentClasses} flex-shrink-0 flex items-center ${contentGapClass}`}>
        {editing ? (
          <input
            ref={inputRef}
            value={editValue}
            onChange={handleEditChange}
            onBlur={finishEditing}
            onKeyDown={handleEditKey}
            className="bg-transparent outline-none text-current px-2 py-1"
            size={Math.max(editValue.length + 2, 5)}
            style={{ 
              width: `${Math.max(editValue.length + 3, 8)}ch`,
              minWidth: `${Math.max(editValue.length + 3, 8)}ch`
            }}
          />
        ) : (
          <span /* Use span for text to allow click for editing */
            onClick={startEditing}
            className={editable ? "cursor-text" : ""}
          >
            {label}
          </span>
        )}
        {onToggleFavorite && (
          <button
            type="button"
            onClick={handleToggleFavorite} /* Use specific handler for favorite toggle */
            aria-label="Favorit"
            className="flex items-center"
          >
            <IconStar
              size={starIconSize}
              stroke={starStroke}
              fill={starFill} 
              strokeWidth={starStrokeWidth}
            />
          </button>
        )}
        {onRemove && (
          <button
            type="button"
            onClick={handleRemove} /* Use specific handler for remove */
            aria-label="Entfernen"
            className="flex items-center justify-center"
          >
            <X
              className={`${xIconSize} ${
                variant === TagContext.Selected
                  ? "text-white"
                  : variant === TagContext.Favorite 
                    ? "text-gray-800"
                    : "text-gray-700"
              }`}
            />
          </button>
        )}
      </div>
    </button>
  );
}