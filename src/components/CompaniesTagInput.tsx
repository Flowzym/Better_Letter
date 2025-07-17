import { useState } from 'react';
import CompanyTag from './CompanyTag';
import TagButtonFavorite from './ui/TagButtonFavorite';
import { X, Plus, Star } from 'lucide-react';
import { useLebenslaufContext } from '../context/LebenslaufContext';

interface CompaniesTagInputProps {
  value: string[];
  onChange: (companies: string[]) => void;
  suggestions?: string[];
}

export default function CompaniesTagInput({ value, onChange, suggestions = [] }: CompaniesTagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
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

  const handleAddFavoriteInput = (val?: string) => {
    const company = (val ?? inputValue).trim();
    if (!company) return;
    toggleFavoriteCompany(company);
    setInputValue('');
  };

  return (
    <div className="space-y-2">
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
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

      <div className="flex items-center w-full space-x-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addCompany()}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
            placeholder="Hinzufügen..."
            className="w-full px-3 h-10 border rounded-md transition-all focus:outline-none focus:ring-1 pr-10"
            style={{
              borderColor: '#D1D5DB',
              '--tw-ring-color': '#F29400'
            } as React.CSSProperties}
          />
          {inputValue.trim().length > 0 && (
            <button
              type="button"
              onClick={() => setInputValue('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-300"
              aria-label="Textfeld leeren"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        {(inputValue.trim().length > 0 || isInputFocused) && (
          <div className="flex-shrink-0 flex space-x-2">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                addCompany();
              }}
              className="w-10 h-10 bg-[#F6A800] hover:bg-[#F29400] text-white rounded-md flex items-center justify-center transition-colors duration-200"
            >
              <Plus className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                handleAddFavoriteInput();
              }}
              className="w-10 h-10 bg-[#F6A800] hover:bg-[#F29400] text-white rounded-md flex items-center justify-center transition-colors duration-200"
            >
              <Star className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

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