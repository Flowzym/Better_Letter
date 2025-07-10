import { useState } from 'react';
import { Star, X } from 'lucide-react';
import AutocompleteInput from './AutocompleteInput';

interface TagSelectorWithFavoritesProps {
  label: string;
  value: string[];
  onChange: (val: string[]) => void;
  favoritenKey: string;
  options: string[];
  allowCustom: boolean;
}

export default function TagSelectorWithFavorites({
  label,
  value,
  onChange,
  favoritenKey,
  options,
  allowCustom,
}: TagSelectorWithFavoritesProps) {
  const [inputValue, setInputValue] = useState('');
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(favoritenKey);
      if (stored) {
        return JSON.parse(stored) as string[];
      }
    } catch {
      // ignore parse errors
    }
    return [];
  });

  const saveFavorites = (favs: string[]) => {
    setFavorites(favs);
    try {
      localStorage.setItem(favoritenKey, JSON.stringify(favs.slice(-10)));
    } catch {
      // ignore
    }
  };

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
    saveFavorites(
      favorites.includes(tag)
        ? favorites.filter((f) => f !== tag)
        : [...favorites.slice(-9), tag]
    );
  };

  const handleAddInput = () => {
    addTag(inputValue);
    setInputValue('');
  };

  const addToFavorites = (tag: string) => {
    if (!favorites.includes(tag)) {
      saveFavorites([...favorites.slice(-9), tag]);
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
              <div
                key={tag}
                className="inline-flex items-center px-3 py-1 text-white text-sm rounded-full"
                style={{ backgroundColor: '#F29400' }}
              >
                <span>{tag}</span>
                <button
                  onClick={() => removeTag(tag)}
                  className="ml-2 text-white hover:text-gray-200"
                  aria-label={`${tag} entfernen`}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {favorites.filter((f) => !value.includes(f)).length > 0 && (
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Star className="h-4 w-4 fill-current" style={{ color: '#F29400' }} />
            <h4 className="text-sm font-medium text-gray-700">Favoriten:</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {favorites
              .filter((item) => !value.includes(item))
              .map((item) => (
                <button
                  key={item}
                  onClick={() => addTag(item)}
                  className="inline-flex items-center justify-between px-3 py-1 text-gray-700 text-sm rounded-full border hover:bg-gray-200 transition-colors duration-200"
                  style={{ backgroundColor: '#F3F4F6', borderColor: '#F29400' }}
                >
                  <span className="mr-2">{item}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(item);
                    }}
                    className="text-gray-600 hover:text-gray-800"
                    aria-label={`${item} aus Favoriten entfernen`}
                    title="Aus Favoriten entfernen"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </button>
              ))}
          </div>
        </div>
      )}

    </div>
  );
}

