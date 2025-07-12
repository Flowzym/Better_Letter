import { useState } from 'react';
import { X } from 'lucide-react';
import AutocompleteInput from './AutocompleteInput';
import PositionTag from './PositionTag';
import TagButtonFavorite from './ui/TagButtonFavorite';
import { useLebenslaufContext } from '../context/LebenslaufContext';

interface TagSelectorWithFavoritesProps {
  label: string;
  value: string[];
  onChange: (val: string[]) => void;
  options: string[];
  allowCustom: boolean;
}

export default function TagSelectorWithFavorites({
  label,
  value,
  onChange,
  options,
  allowCustom,
}: TagSelectorWithFavoritesProps) {
  const [inputValue, setInputValue] = useState('');
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const { favoritePositions: favorites, toggleFavoritePosition } = useLebenslaufContext();


  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (!trimmed) return;
    if (!allowCustom && !options.includes(trimmed)) return;
    if (value.includes(trimmed)) return;
    onChange([...value, trimmed]);
  };

  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
  };

  const toggleFavorite = (tag: string) => {
    toggleFavoritePosition(tag);
  };

  const handleAddInput = (val?: string) => {
    addTag(val ?? inputValue);
    setInputValue('');
  };


  const startEdit = (index: number) => {
    setEditIndex(index);
    setEditValue(value[index]);
  };

  const confirmEdit = () => {
    if (editIndex === null) return;
    const trimmed = editValue.trim();
    if (!trimmed) return;
    const newTags = value.map((t, i) => (i === editIndex ? trimmed : t));
    onChange(newTags);
    setEditIndex(null);
    setEditValue('');
  };

  const handleAddFavoriteInput = (val?: string) => {
    const toAdd = (val ?? inputValue).trim();
    if (!toAdd) return;
    toggleFavorite(toAdd);
    setInputValue('');
  };

  return (
    <div className="space-y-4">
      <AutocompleteInput
        value={inputValue}
        onChange={setInputValue}
        onAdd={handleAddInput}
        onAddToFavorites={handleAddFavoriteInput}
        suggestions={options}
        placeholder="Hinzufügen..."
        inputBorderColor="#F29400"
        showFavoritesButton
        showAddButton
        label={label}
      />

      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((tag, index) =>
            editIndex === index ? (
              <div key={`${tag}-${index}`} className="tag">
                <input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={confirmEdit}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') confirmEdit();
                  }}
                  className="text-black px-1 py-0.5 rounded"
                  autoFocus
                />
                <button
                  onClick={() => removeTag(tag)}
                  className="tag-icon-button"
                  aria-label="Entfernen"
                >
                  <X className="tag-icon" />
                </button>
              </div>
            ) : (
              <PositionTag
                key={`${tag}-${index}`}
                label={tag}
                onRemove={() => removeTag(tag)}
                onEdit={() => startEdit(index)}
              />
            )
          )}
        </div>
      )}

      {favorites.filter((f) => !value.includes(f)).length > 0 && (
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#9CA3AF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon
                points="12 2 15 8.5 22 9.3 17 14 18.2 21 12 17.8 5.8 21 7 14 2 9.3 9 8.5 12 2"
                fill="none"
              />
            </svg>
            <h4 className="text-sm font-medium text-gray-700">Favoriten:</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {favorites
              .filter((item) => !value.includes(item))
              .map((item) => (
                <TagButtonFavorite
                  key={item}
                  label={item}
                  onClick={() => addTag(item)}
                  onRemove={() => toggleFavorite(item)}
                />
              ))}
          </div>
        </div>
      )}

    </div>
  );
}

