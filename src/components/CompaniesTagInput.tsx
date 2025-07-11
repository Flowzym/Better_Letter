import { useState, useRef } from 'react';
import TagButton from './TagButton';
import TagContext from '../types/TagContext';
import { useLebenslaufContext } from '../context/LebenslaufContext';

interface CompaniesTagInputProps {
  value: string[];
  onChange: (companies: string[]) => void;
}

export default function CompaniesTagInput({ value, onChange }: CompaniesTagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { favoriteCompanies: favorites, toggleFavoriteCompany } = useLebenslaufContext();

  const addCompany = (val?: string) => {
    const c = (val ?? inputValue).trim();
    if (!c || value.includes(c)) return;
    onChange([...value, c]);
    setInputValue('');
  };

  const handleEditCompany = (label: string) => {
    removeCompany(label);
    setInputValue(label);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const removeCompany = (c: string) => {
    onChange(value.filter((v) => v !== c));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addCompany();
    }
  };

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="text"
        placeholder="Firma hinzufügen..."
        className="w-full px-3 py-2 border rounded"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((c) => (
            <TagButton
              key={c}
              label={c}
              variant={TagContext.Selected}
              isFavorite={favorites.includes(c)}
              onToggleFavorite={toggleFavoriteCompany}
              onRemove={() => removeCompany(c)}
              onEdit={() => handleEditCompany(c)}
              type="company"
            />
          ))}
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
              <polygon points="12 2 15 8.5 22 9.3 17 14 18.2 21 12 17.8 5.8 21 7 14 2 9.3 9 8.5 12 2" fill="none" />
            </svg>
            <h4 className="text-sm font-medium text-gray-700">Favoriten:</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {favorites
              .filter((f) => !value.includes(f))
              .map((f) => (
                <TagButton
                  key={f}
                  label={f}
                  variant={TagContext.Favorites}
                  isFavorite
                  onClick={() => addCompany(f)}
                  onRemove={() => toggleFavoriteCompany(f)}
                  type="company"
                />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
