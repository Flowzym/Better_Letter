import { useState } from 'react';
import { ChevronDown, Star, X } from 'lucide-react';
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

      {options.length > 0 && (
        <details className="group">
          <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center space-x-2">
            <span>Alle verfügbaren Optionen ({options.length})</span>
            <ChevronDown className="h-4 w-4 group-open:rotate-180 transition-transform" style={{ color: '#F29400' }} />
          </summary>
          <div className="mt-3 space-y-3">
            <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3 bg-gray-50">
              <div className="flex flex-wrap gap-2">
                {options
                  .filter((opt) => !value.includes(opt))
                  .map((opt) => (
                    <div key={opt} className="flex items-center space-x-1">
                      <button
                        onClick={() => addTag(opt)}
                        className="inline-flex items-center justify-between px-3 py-1 bg-white text-gray-700 text-sm rounded-full transition-colors duration-200 border border-gray-300 hover:bg-gray-100"
                      >
                        <span className="mr-2">{opt}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(opt);
                          }}
                          className={`transition-colors duration-200 ${favorites.includes(opt) ? 'hover:opacity-80' : 'text-gray-400 hover:opacity-80'}`}
                          style={{ color: favorites.includes(opt) ? '#F29400' : undefined }}
                          aria-label={favorites.includes(opt) ? `${opt} aus Favoriten entfernen` : `${opt} zu Favoriten hinzufügen`}
                          title={favorites.includes(opt) ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen'}
                        >
                          <Star className={`h-3 w-3 ${favorites.includes(opt) ? 'fill-current' : ''}`} />
                        </button>
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </details>
      )}
    </div>
  );
}

