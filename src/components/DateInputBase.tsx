import React, { useRef, useState, useEffect } from 'react';

interface DateInputBaseProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

/**
 * Basis-Komponente für Datumseingabe (TT.MM.JJJJ)
 * Basiert auf MonthYearInputBase, erweitert um Tagesunterstützung
 */
export default function DateInputBase({
  value,
  onChange,
  placeholder = "TT.MM.JJJJ",
  disabled = false,
  className = "",
  onFocus,
  onBlur,
  onKeyDown
}: DateInputBaseProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [internalValue, setInternalValue] = useState(value);

  // Synchronisiere mit externem value
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  /**
   * Formatiert die Eingabe während des Tippens
   */
  const applyFormatting = (input: string): string => {
    // Nur Ziffern zulassen
    const cleaned = input.replace(/[^\d]/g, '');
    
    if (cleaned.length === 0) {
      return '';
    }
    
    // Auto-Formatierung: TTMMJJJJ -> TT.MM.JJJJ
    if (cleaned.length <= 2) {
      return cleaned;
    } else if (cleaned.length <= 4) {
      return `${cleaned.slice(0, 2)}.${cleaned.slice(2)}`;
    } else {
      return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 4)}.${cleaned.slice(4, 8)}`;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const input = inputRef.current;
    if (!input) return;

    // Aktuelle Cursor-Position merken
    const cursorPos = input.selectionStart ?? 0;
    const oldValue = internalValue;
    
    // Formatierung anwenden
    const formatted = applyFormatting(newValue);
    
    // Neue Cursor-Position berechnen
    let newCursorPos = cursorPos;
    
    // Automatische Punkte hinzugefügt
    if (formatted.length > oldValue.length && formatted.includes('.') && !newValue.includes('.')) {
      const dotsAdded = (formatted.match(/\./g) || []).length - (oldValue.match(/\./g) || []).length;
      newCursorPos = cursorPos + dotsAdded;
    }
    
    // Wert aktualisieren
    setInternalValue(formatted);
    onChange(formatted);
    
    // Cursor-Position setzen
    setTimeout(() => {
      if (inputRef.current) {
        const finalPos = Math.min(newCursorPos, formatted.length);
        inputRef.current.setSelectionRange(finalPos, finalPos);
      }
    }, 0);
  };

  const handleClick = () => {
    const input = inputRef.current;
    if (!input) return;
    
    const pos = input.selectionStart ?? 0;
    const currentValue = internalValue;
    
    // Intelligente Selektion basierend auf Position
    if (currentValue.includes('.')) {
      const firstDot = currentValue.indexOf('.');
      const secondDot = currentValue.lastIndexOf('.');
      
      if (pos <= firstDot) {
        // Tag selektieren
        setTimeout(() => input.setSelectionRange(0, firstDot), 0);
      } else if (pos <= secondDot) {
        // Monat selektieren
        setTimeout(() => input.setSelectionRange(firstDot + 1, secondDot), 0);
      } else {
        // Jahr selektieren
        setTimeout(() => input.setSelectionRange(secondDot + 1, currentValue.length), 0);
      }
    } else {
      // Alles selektieren wenn keine Punkte
      setTimeout(() => input.setSelectionRange(0, currentValue.length), 0);
    }
  };

  const handleBlur = () => {
    // Validierung beim Verlassen des Feldes
    const parts = internalValue.split('.');
    let isValid = true;
    
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const year = parseInt(parts[2], 10);
      
      if (parts[0].length !== 2 || day < 1 || day > 31) isValid = false;
      if (parts[1].length !== 2 || month < 1 || month > 12) isValid = false;
      if (parts[2].length !== 4 || year < 1900 || year > 2099) isValid = false;
    } else if (internalValue.trim() && internalValue !== '') {
      isValid = false;
    }
    
    if (!isValid && internalValue.trim()) {
      setInternalValue('');
      onChange('');
    }
    
    onBlur?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = inputRef.current;
    if (!input) return;
    
    const start = input.selectionStart ?? 0;
    const end = input.selectionEnd ?? 0;
    const hasSelection = start !== end;
    const currentValue = internalValue;
    
    // Spezialbehandlung für Ziffern-Eingabe bei Selektion
    if (/^\d$/.test(e.key) && hasSelection) {
      const digit = e.key;
      
      // Bestimme welches Feld selektiert ist
      if (currentValue.includes('.')) {
        const firstDot = currentValue.indexOf('.');
        const secondDot = currentValue.lastIndexOf('.');
        
        // Tag selektiert
        if (start === 0 && end === firstDot) {
          e.preventDefault();
          const monthPart = currentValue.substring(firstDot + 1, secondDot);
          const yearPart = currentValue.substring(secondDot + 1);
          const newValue = `${digit.padStart(2, '0')}.${monthPart}.${yearPart}`;
          
          setInternalValue(newValue);
          onChange(newValue);
          
          setTimeout(() => {
            if (inputRef.current) {
              inputRef.current.setSelectionRange(1, 1);
            }
          }, 0);
          return;
        }
        
        // Monat selektiert
        if (start === firstDot + 1 && end === secondDot) {
          e.preventDefault();
          const dayPart = currentValue.substring(0, firstDot);
          const yearPart = currentValue.substring(secondDot + 1);
          const newValue = `${dayPart}.${digit.padStart(2, '0')}.${yearPart}`;
          
          setInternalValue(newValue);
          onChange(newValue);
          
          setTimeout(() => {
            if (inputRef.current) {
              inputRef.current.setSelectionRange(firstDot + 2, firstDot + 2);
            }
          }, 0);
          return;
        }
        
        // Jahr selektiert
        if (start === secondDot + 1 && end === currentValue.length) {
          e.preventDefault();
          const dayPart = currentValue.substring(0, firstDot);
          const monthPart = currentValue.substring(firstDot + 1, secondDot);
          const newValue = `${dayPart}.${monthPart}.${digit}`;
          
          setInternalValue(newValue);
          onChange(newValue);
          
          setTimeout(() => {
            if (inputRef.current) {
              inputRef.current.setSelectionRange(secondDot + 2, secondDot + 2);
            }
          }, 0);
          return;
        }
      }
    }
    
    onKeyDown?.(e);
  };

  return (
    <input
      ref={inputRef}
      type="text"
      value={internalValue}
      onChange={handleChange}
      onClick={handleClick}
      onFocus={onFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      disabled={disabled}
      inputMode="numeric"
      maxLength={10}
      className={`w-full h-10 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 ${className}`}
      style={{ '--tw-ring-color': '#F29400' } as React.CSSProperties}
    />
  );
}