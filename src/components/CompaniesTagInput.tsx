import { useState, useRef } from 'react';
import CompanyTag from './CompanyTag';
import TagButtonFavorite from './ui/TagButtonFavorite';
import { useLebenslaufContext } from '../context/LebenslaufContext';

interface CompaniesTagInputProps {
  value: string[];
  onChange: (companies: string[]) => void;
}

export default function CompaniesTagInput({ value, onChange }: CompaniesTagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { favoriteCompanies: favorites, toggleFavoriteCompany } =
    useLebenslaufContext();

  const addCompany = (val?: string) => {
    const c = (val ?? inputValue).trim();
    if (!c || value.includes(c)) return;
    onChange([...value, c]);
    setInputValue('');
  };

  const removeCompany = (c: string) => {
    onChange(value.filter((v) => v !== c));
  };

  const updateCompany = (oldVal: string, newVal: string) => {
    onChange(value.map((v) => (v === oldVal ? newVal : v)));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addCompany();
    }
  };

  const handleAddFavorite = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    toggleFavoriteCompany(trimmed);
    setInputValue('');
  };

  return (
    <div className="space-y-2">
      <div className="flex space-x-1">
        <input
          ref={inputRef}
          type="text"
          placeholder="Firma hinzufügen..."
          className="flex-1 px-3 py-2 border rounded"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={() => addCompany()}
          className="px-3 py-2 rounded text-white bg-yellow-400"
          aria-label="Hinzufügen"
        >
          +
        </button>
        <button
          onClick={handleAddFavorite}
          className="px-2 py-1 rounded text-white bg-yellow-300 text-sm"
          aria-label="Als Favorit hinzufügen"
        >
          ★
        </button>
      </div>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((c) => (
            <CompanyTag
              key={c}
              label={c}
              onRemove={() => removeCompany(c)}
              onEdit={(val) => updateCompany(c, val)}
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
                <TagButtonFavorite
                  key={f}
                  label={f}
                  onClick={() => addCompany(f)}
                  onRemove={() => toggleFavoriteCompany(f)}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
