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
  options?: string[];
  allowCustom: boolean;
  suggestions?: string[];
}

export default function TagSelectorWithFavorites({
  label,
  value,
  onChange,
  options = [],
  allowCustom,
  suggestions,
}: TagSelectorWithFavoritesProps) {
  const [inputValue, setInputValue] = useState('');
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const { favoritePositions: favorites, toggleFavoritePosition } = useLebenslaufContext();


  const addTag = (val?: string) => {
    if (!val && !inputValue.trim()) return;
    const trimmed = val || inputValue.trim();
    const opts = suggestions ?? options;
    if (!allowCustom && !opts.includes(trimmed)) return;
    if (value.includes(trimmed)) return;
    onChange([...value, trimmed]);
    setInputValue('');
  };

  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
  };

  const toggleFavorite = (val?: string) => {
    if (!val && !inputValue.trim()) return;
    const position = val || inputValue.trim();
    toggleFavoritePosition(position);
    setInputValue('');
  };

  const updateTag = (oldTag: string, newTag: string) => {
    const trimmed = newTag.trim();
    if (!trimmed) return;
    const updatedTags = value.map(tag => tag === oldTag ? trimmed : tag);
    onChange(updatedTags);
  };

  return (
    <div className="space-y-4">
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((tag, index) => (
            <PositionTag
              key={`${tag}-${index}`}
              label={tag}
              onRemove={() => removeTag(tag)}
              onEdit={(newTag) => updateTag(tag, newTag)}
            />
          ))}
        </div>
      )}

      <AutocompleteInput
        value={inputValue}
        onChange={setInputValue}
        onAdd={addTag}
        onFavoriteClick={toggleFavorite}
        suggestions={suggestions ?? options}
        placeholder="Hinzufügen..."
        showFavoritesButton
        showAddButton
        label={label}
        className="w-full"
      />

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

