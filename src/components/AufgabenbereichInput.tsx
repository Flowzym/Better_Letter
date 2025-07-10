import React, { useEffect, useState, useMemo } from 'react';
import { X, Pencil, Star, ChevronDown } from 'lucide-react';
import AutocompleteInput from './AutocompleteInput';
import { getTaskSuggestionsForBeruf } from '../constants/taskSuggestions';

interface AufgabenbereichInputProps {
  value: string[];
  onChange: (neueListe: string[]) => void;
  positionen: string[];
  vorschlaege?: string[];
  favoriten?: string[];
}

export default function AufgabenbereichInput({
  value,
  onChange,
  positionen,
  vorschlaege = [],
  favoriten = [],
}: AufgabenbereichInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('aufgabenFavoriten');
      if (stored) {
        return JSON.parse(stored) as string[];
      }
    } catch {
      // ignore parse errors
    }
    return favoriten;
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        'aufgabenFavoriten',
        JSON.stringify(favorites.slice(-10))
      );
    } catch {
      // ignore
    }
  }, [favorites]);

  const allOptions = useMemo(() => {
    const fromPositions = positionen.flatMap((p) =>
      getTaskSuggestionsForBeruf(p)
    );
    const combined = [...fromPositions, ...vorschlaege];
    const unique = Array.from(new Set(combined));
    unique.sort((a, b) => a.localeCompare(b, 'de', { sensitivity: 'base' }));
    return unique;
  }, [positionen, vorschlaege]);

  const addTask = (task?: string) => {
    const t = (task ?? inputValue).trim();
    if (!t || value.includes(t)) return;
    onChange([...value, t]);
    setInputValue('');
  };

  const removeTask = (task: string) => {
    onChange(value.filter((t) => t !== task));
  };

  const startEdit = (index: number) => {
    setEditIndex(index);
    setEditValue(value[index]);
  };

  const confirmEdit = () => {
    if (editIndex === null) return;
    const trimmed = editValue.trim();
    if (!trimmed) return;
    const newTasks = value.map((t, i) => (i === editIndex ? trimmed : t));
    onChange(newTasks);
    setEditIndex(null);
    setEditValue('');
  };

  const addToFavorites = (task: string) => {
    if (!favorites.includes(task)) {
      setFavorites([...favorites.slice(-9), task]);
    }
  };

  const toggleFavorite = (task: string) => {
    setFavorites(
      favorites.includes(task)
        ? favorites.filter((f) => f !== task)
        : [...favorites.slice(-9), task]
    );
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-700">Aufgaben/Tätigkeiten</h3>

      <AutocompleteInput
        value={inputValue}
        onChange={setInputValue}
        onAdd={() => addTask()}
        onAddToFavorites={(val) => addToFavorites(val ?? inputValue)}
        suggestions={allOptions}
        placeholder="Hinzufügen..."
        buttonColor="orange"
        showFavoritesButton
      />

      {allOptions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {allOptions.map((s) => (
            <button
              key={s}
              onClick={() => addTask(s)}
              className={`px-3 py-1 text-sm rounded-full border ${
                value.includes(s) ? 'text-white' : 'hover:bg-gray-100'
              }`}
              style={
                value.includes(s)
                  ? { backgroundColor: '#F29400', borderColor: '#F29400' }
                  : { borderColor: '#F29400' }
              }
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((task, index) => (
            <div
              key={`${task}-${index}`}
              className="inline-flex items-center px-3 py-1 text-sm rounded-full text-white"
              style={{ backgroundColor: '#F29400' }}
            >
              {editIndex === index ? (
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
              ) : (
                <span className="mr-2">{task}</span>
              )}
              {editIndex !== index && (
                <button
                  onClick={() => startEdit(index)}
                  className="mr-1 text-white hover:text-gray-200"
                  aria-label="Bearbeiten"
                >
                  <Pencil className="h-3 w-3" />
                </button>
              )}
              <button
                onClick={() => removeTask(task)}
                className="text-white hover:text-gray-200"
                aria-label="Entfernen"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
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
                  onClick={() => addTask(item)}
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

      {allOptions.length > 0 && (
        <details className="group">
          <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center space-x-2">
            <span>Alle verfügbaren Optionen ({allOptions.length})</span>
            <ChevronDown
              className="h-4 w-4 group-open:rotate-180 transition-transform"
              style={{ color: '#F29400' }}
            />
          </summary>
          <div className="mt-3 space-y-3">
            <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3 bg-gray-50">
              <div className="flex flex-wrap gap-2">
                {allOptions
                  .filter((opt) => !value.includes(opt))
                  .map((opt) => (
                    <div key={opt} className="flex items-center space-x-1">
                      <button
                        onClick={() => addTask(opt)}
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
                          aria-label={
                            favorites.includes(opt)
                              ? `${opt} aus Favoriten entfernen`
                              : `${opt} zu Favoriten hinzufügen`
                          }
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

