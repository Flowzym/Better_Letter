import { useState } from 'react';
import { Star } from 'lucide-react';
import AutocompleteInput from './AutocompleteInput';
import PositionTag from './PositionTag';
import TagButton from './TagButton';
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

  const handleAddInput = () => {
    addTag(inputValue);
    setInputValue('');
  };

  const addToFavorites = (tag: string) => {
    if (!favorites.includes(tag)) {
      toggleFavoritePosition(tag);
    }
  };

  return (
    <div className="space-y-4">
      <AutocompleteInput
        value={inputValue}
        onChange={setInputValue}
        onAdd={handleAddInput}
        onAddToFavorites={allowCustom ? addToFavorites : undefined}
        suggestions={options}
        placeholder="Hinzufügen..."
        buttonColor="orange"
        showFavoritesButton={allowCustom}
        showAddButton={allowCustom}
        label={label}
      />

      {value.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Ausgewählt:</h4>
          <div className="flex flex-wrap gap-2">
            {value.map((tag) => (
              <PositionTag key={tag} label={tag} onRemove={() => removeTag(tag)} />
            ))}
          </div>
        </div>
      )}

      {favorites.filter((f) => !value.includes(f)).length > 0 && (
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Star className="h-4 w-4 fill-current" style={{ color: '#FDE047' }} />
            <h4 className="text-sm font-medium text-gray-700">Favoriten:</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {favorites
              .filter((item) => !value.includes(item))
              .map((item) => (
                <TagButton
                  key={item}
                  label={item}
                  isSuggestion
                  isFavorite
                  onClick={() => addTag(item)}
                  onToggleFavorite={() => toggleFavorite(item)}
                />
              ))}
          </div>
        </div>
      )}

    </div>
  );
}

