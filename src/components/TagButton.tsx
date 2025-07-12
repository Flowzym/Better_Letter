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
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditValue(label);
  }, [label]);

  const baseClasses =
    "rounded-full border flex items-center gap-1 text-sm px-2 py-1";
  const contentClasses =
    variant === TagContext.Favorite
      ? "flex items-center space-x-2"
      : "flex items-center gap-1";

  let variantClasses = "";
  if (variant === TagContext.Selected) {
    variantClasses = "bg-[#F29400] text-white border-[#F29400]";
  } else if (variant === TagContext.Suggestion) {
    variantClasses = "bg-white text-gray-700 border-gray-300";
  } else if (variant === TagContext.Favorite) {
    variantClasses = "bg-gray-100 text-gray-800 border-[#FDE047] border-2 px-3";
  } else {
    variantClasses = "bg-white text-gray-700 border-[#F29400]";
  }

  const starStroke = isFavorite
    ? "#FDE047"
    : variant === TagContext.Selected
      ? "#FFFFFF"
      : "#4B5563";
  const starFill = isFavorite ? "#FDE047" : "none";

  const startEditing = (e: React.MouseEvent) => {
    if (!editable) return;
    e.stopPropagation();
    setEditing(true);
    setTimeout(() => inputRef.current?.select(), 0);
  };

  const finishEditing = () => {
    setEditing(false);
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== label) {
      onEdit?.(trimmed);
    } else {
      setEditValue(label);
    }
  };

  const handleEditKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      finishEditing();
    } else if (e.key === "Escape") {
      e.preventDefault();
      setEditValue(label);
      setEditing(false);
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite?.(label, type);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove?.();
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${baseClasses} ${variantClasses}`}
    >
      <div className={contentClasses}>
        {editing ? (
          <input
            ref={inputRef}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={finishEditing}
            onKeyDown={handleEditKey}
            className="bg-transparent focus:outline-none w-20 text-current px-1"
          />
        ) : (
          <span
            onClick={startEditing}
            className={editable ? "cursor-text" : ""}
          >
            {label}
          </span>
        )}
        {onToggleFavorite && (
          <button
            type="button"
            onClick={handleToggleFavorite}
            aria-label="Favorit"
            className="flex items-center"
          >
            <IconStar
              size={14}
              stroke={starStroke}
              fill={starFill}
              strokeWidth={2}
            />
          </button>
        )}
        {onRemove && (
          <button
            type="button"
            onClick={handleRemove}
            aria-label="Entfernen"
            className="flex items-center justify-center"
          >
            <X
              className={`w-3 h-3 ${
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
