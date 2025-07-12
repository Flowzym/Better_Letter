import React, { useState, useRef, useEffect } from 'react';
import { Plus, Star } from 'lucide-react';

interface AutocompleteInputProps {
  value: string;
  onChange: (value: string) => void;
  onAdd: (valueToAdd?: string) => void;
  onAddToFavorites?: (valueToAdd?: string) => void;
  suggestions: string[];
  placeholder: string;
  disabled?: boolean;
  className?: string;
  inputBorderColor?: string;
  showFavoritesButton?: boolean;
  showAddButton?: boolean;
  id?: string;
  label?: string;
}

export default function AutocompleteInput({
  value,
  onChange,
  onAdd,
  onAddToFavorites,
  suggestions,
  placeholder,
  disabled = false,
  className = '',
  inputBorderColor = '#F29400',
  showFavoritesButton = false,
  showAddButton = true,
  id,
  label
}: AutocompleteInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const hasInput = value.trim().length > 0;

  // Generate unique IDs if not provided
  const inputId = id || `autocomplete-input-${Math.random().toString(36).substr(2, 9)}`;
  const favoritesButtonId = `${inputId}-favorites`;
  const addButtonId = `${inputId}-add`;

  // Focus management - mark as profile input
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.classList.add('profile-input');
      container.classList.add('autocomplete-input');
    }
  }, []);

  // Intelligent filtering and sorting of suggestions
  useEffect(() => {
    if (value.trim() && value.length > 0) {
      const searchTerm = value.toLowerCase();
      
      const startsWithMatches: string[] = [];
      const containsMatches: string[] = [];
      
      suggestions.forEach(suggestion => {
        const suggestionLower = suggestion.toLowerCase();
        
        if (suggestionLower === searchTerm) {
          return;
        }
        
        if (suggestionLower.startsWith(searchTerm)) {
          startsWithMatches.push(suggestion);
        } else if (suggestionLower.includes(searchTerm)) {
          containsMatches.push(suggestion);
        }
      });
      
      startsWithMatches.sort((a, b) => a.localeCompare(b, 'de', { sensitivity: 'base' }));
      containsMatches.sort((a, b) => a.localeCompare(b, 'de', { sensitivity: 'base' }));
      
      const combinedResults = [...startsWithMatches, ...containsMatches];
      const limitedResults = combinedResults.slice(0, 8);
      
      setFilteredSuggestions(limitedResults);
      setIsOpen(limitedResults.length > 0);
    } else {
      setFilteredSuggestions([]);
      setIsOpen(false);
    }
    setHighlightedIndex(-1);
  }, [value, suggestions]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Focus event handler - prevents editor focus
  const handleFocus = (e: React.FocusEvent) => {
    // Mark the input as active for focus management
    if (e.currentTarget) {
      e.currentTarget.setAttribute('data-profile-input-active', 'true');
    }
  };

  const handleBlur = (e: React.FocusEvent) => {
    // Remove the marking after short delay
    setTimeout(() => {
      if (e.currentTarget) {
        e.currentTarget.removeAttribute('data-profile-input-active');
      }
    }, 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || filteredSuggestions.length === 0) {
      if (e.key === 'Enter') {
        e.preventDefault();
        onAdd();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        setHighlightedIndex(prev => 
          prev < filteredSuggestions.length - 1 ? prev + 1 : 0
        );
        e.preventDefault();
        break;
      case 'ArrowUp':
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : filteredSuggestions.length - 1);
        e.preventDefault();
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredSuggestions.length) {
          handleSuggestionSelect(filteredSuggestions[highlightedIndex]);
        } else {
          onAdd();
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        e.preventDefault();
        break;
      case 'Tab':
        if (highlightedIndex >= 0 && highlightedIndex < filteredSuggestions.length) {
          handleSuggestionSelect(filteredSuggestions[highlightedIndex]);
          e.preventDefault();
        }
        break;
    }
  };

  const handleSuggestionSelect = (suggestion: string) => {
    onChange(suggestion);
    setIsOpen(false);
    setHighlightedIndex(-1);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onAdd(suggestion);
    onChange('');
    setIsOpen(false);
    setHighlightedIndex(-1);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleAddToFavorites = () => {
    if (onAddToFavorites && value.trim()) {
      onAddToFavorites(value.trim());
      onChange('');
    }
  };


  return (
    <div
      ref={containerRef}
      className={`relative ${className} profile-input autocomplete-input`}
    >
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          id={inputId}
          name={`autocomplete-${inputId}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full px-3 py-2 pr-16 border rounded-md text-sm focus:outline-none focus:ring-2 focus:border-orange-500"
          style={{
            borderColor: inputBorderColor,
            '--tw-ring-color': inputBorderColor
          } as React.CSSProperties}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          role="combobox"
        />

        {/* Favorites button */}
        {showFavoritesButton && onAddToFavorites && (
          <button
            id={favoritesButtonId}
            name={`favorites-${inputId}`}
            onClick={handleAddToFavorites}
            disabled={disabled || !hasInput}
            className={`absolute right-8 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-md text-white transition-opacity duration-200 hover:shadow ${
              hasInput ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            style={{ backgroundColor: '#F59E0B' }}
            title="Zu Favoriten hinzufügen"
            aria-label="Zu Favoriten hinzufügen"
          >
            <Star className="w-4 h-4" />
          </button>
        )}

        {/* Add button */}
        {showAddButton && (
          <button
            id={addButtonId}
            name={`add-${inputId}`}
            onClick={() => onAdd()}
            disabled={disabled || !hasInput}
            className={`absolute right-0 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-md text-white transition-opacity duration-200 hover:shadow ${
              hasInput ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            style={{ backgroundColor: '#F59E0B' }}
            title="Hinzufügen"
            aria-label="Hinzufügen"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}

        {/* Dropdown with improved sorting */}
        {isOpen && filteredSuggestions.length > 0 && (
          <div
            className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-md shadow-lg max-h-48 overflow-y-auto z-50 autocomplete-dropdown"
            style={{ borderColor: inputBorderColor }}
            role="listbox"
            aria-label="Vorschläge"
          >
            {filteredSuggestions.map((suggestion, index) => {
              const searchTerm = value.toLowerCase();
              const suggestionLower = suggestion.toLowerCase();
              const startsWithSearch = suggestionLower.startsWith(searchTerm);
                
                return (
                  <button
                    key={suggestion}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none ${
                      index === highlightedIndex ? 'text-white' : 'text-gray-900'
                    }`}
                    style={index === highlightedIndex ? { backgroundColor: '#F29400' } : {}}
                    title={startsWithSearch ? 'Beginnt mit Ihrer Eingabe' : 'Enthält Ihre Eingabe'}
                    role="option"
                    aria-selected={index === highlightedIndex}
                  >
                    <span className={startsWithSearch ? 'font-medium' : 'font-normal'}>
                      {suggestion}
                    </span>
                    {startsWithSearch && (
                      <span className="ml-2 text-xs opacity-60">
                        ↗
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
      </div>
    </div>
  );
}