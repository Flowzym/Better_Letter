import React, { useRef } from 'react';
import { parseMonthYearInput, isValidMonth, isValidYear } from '../utils/dateUtils';

interface MonthYearInputBaseProps {
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
 * Basis-Komponente für Monat/Jahr-Eingabe
 * Robuste Implementierung mit intelligenter Cursor-Positionierung
 */
export default function MonthYearInputBase({
  value,
  onChange,
  placeholder = "MM/YYYY",
  disabled = false,
  className = "",
  onFocus,
  onBlur,
  onKeyDown
}: MonthYearInputBaseProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const input = inputRef.current;
    if (!input) return;

    // Aktuelle Cursor-Position merken
    const cursorPos = input.selectionStart ?? 0;
    const oldLength = value.length;
    const newLength = newValue.length;
    
    // Parse den neuen Wert
    const parsed = parseMonthYearInput(newValue);
    
    // Bestimme neue Cursor-Position
    let newCursorPos = cursorPos;
    
    // Wenn Text länger wurde (Zeichen hinzugefügt)
    if (newLength > oldLength) {
      const diff = newLength - oldLength;
      
      // Wenn ein Schrägstrich automatisch hinzugefügt wurde
      if (parsed.formatted.includes('/') && !value.includes('/')) {
        // Cursor nach dem Schrägstrich positionieren
        newCursorPos = parsed.formatted.indexOf('/') + 1;
      } else {
        // Normale Eingabe: Cursor um die Anzahl der hinzugefügten Zeichen verschieben
        newCursorPos = cursorPos + diff;
      }
    }
    // Wenn Text kürzer wurde (Zeichen gelöscht)
    else if (newLength < oldLength) {
      // Cursor-Position beibehalten oder anpassen
      newCursorPos = Math.min(cursorPos, parsed.formatted.length);
    }
    
    // Wert aktualisieren
    onChange(parsed.formatted);
    
    // Cursor-Position setzen
    setTimeout(() => {
      if (inputRef.current) {
        const finalPos = Math.min(newCursorPos, parsed.formatted.length);
        inputRef.current.setSelectionRange(finalPos, finalPos);
      }
    }, 0);
  };

  const handleClick = () => {
    const input = inputRef.current;
    if (!input) return;
    
    const pos = input.selectionStart ?? 0;
    
    // Intelligente Selektion basierend auf Position und Inhalt
    if (value.includes('/')) {
      const slashPos = value.indexOf('/');
      if (pos <= slashPos) {
        // Monat selektieren (MM)
        setTimeout(() => input.setSelectionRange(0, slashPos), 0);
      } else {
        // Jahr selektieren (YYYY)
        setTimeout(() => input.setSelectionRange(slashPos + 1, value.length), 0);
      }
    } else if (value.length === 4 && isValidYear(value)) {
      // Nur Jahr vorhanden: ganzes Jahr selektieren
      setTimeout(() => input.setSelectionRange(0, value.length), 0);
    } else if (value.length <= 2) {
      // Nur Monat vorhanden: ganzen Monat selektieren
      setTimeout(() => input.setSelectionRange(0, value.length), 0);
    } else {
      // Fallback: alles selektieren
      setTimeout(() => input.setSelectionRange(0, value.length), 0);
    }
  };

  const handleBlur = () => {
    // Beim Verlassen des Feldes: Wert validieren und formatieren
    const parsed = parseMonthYearInput(value);
    
    if (parsed.month && !parsed.year) {
      // Nur Monat eingegeben: führende Null hinzufügen wenn nötig
      const formattedMonth = parsed.month.length === 1 ? '0' + parsed.month : parsed.month;
      if (isValidMonth(formattedMonth)) {
        onChange(formattedMonth);
      } else {
        // Ungültiger Monat: löschen
        onChange('');
      }
    } else if (parsed.year && !parsed.month) {
      // Nur Jahr eingegeben: beibehalten wenn gültig
      if (parsed.year.length === 4 && isValidYear(parsed.year)) {
        onChange(parsed.year);
      } else if (parsed.year.length < 4) {
        // Unvollständiges Jahr: löschen
        onChange('');
      }
    } else if (parsed.month && parsed.year) {
      // Monat und Jahr: beide formatieren
      const formattedMonth = parsed.month.length === 1 ? '0' + parsed.month : parsed.month;
      if (isValidMonth(formattedMonth)) {
        if (parsed.year.length === 4 && isValidYear(parsed.year)) {
          onChange(`${formattedMonth}/${parsed.year}`);
        } else {
          // Ungültiges Jahr: nur Monat behalten
          onChange(formattedMonth);
        }
      } else {
        // Ungültiger Monat: alles löschen
        onChange('');
      }
    } else if (value.trim() && !parsed.isValid) {
      // Ungültige Eingabe: löschen
      onChange('');
    }
    
    // Externe onBlur-Handler aufrufen
    onBlur?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = inputRef.current;
    if (!input) return;
    
    const start = input.selectionStart ?? 0;
    const end = input.selectionEnd ?? 0;
    const hasSelection = start !== end;
    
    // Spezialbehandlung für Ziffern-Eingabe bei Selektion
    if (/^\d$/.test(e.key) && hasSelection) {
      const digit = e.key;
      
      // Fall 1: Monat ist selektiert
      if (value.includes('/')) {
        const slashPos = value.indexOf('/');
        if (start === 0 && end === slashPos) {
          e.preventDefault();
          
          // Erste Ziffer für Monat
          const yearPart = value.substring(slashPos + 1);
          const newValue = `${digit}/${yearPart}`;
          onChange(newValue);
          
          // Cursor nach der Ziffer positionieren
          setTimeout(() => {
            if (inputRef.current) {
              inputRef.current.setSelectionRange(1, 1);
            }
          }, 0);
          return;
        }
        
        // Fall 2: Jahr ist selektiert
        if (start === slashPos + 1 && end === value.length) {
          e.preventDefault();
          
          const monthPart = value.substring(0, slashPos + 1);
          const newValue = `${monthPart}${digit}`;
          onChange(newValue);
          
          // Cursor nach der Ziffer positionieren
          setTimeout(() => {
            if (inputRef.current) {
              inputRef.current.setSelectionRange(slashPos + 2, slashPos + 2);
            }
          }, 0);
          return;
        }
      }
      
      // Fall 3: Alles ist selektiert oder nur Jahr vorhanden
      if ((start === 0 && end === value.length) || (value.length === 4 && isValidYear(value))) {
        e.preventDefault();
        
        // Neue Eingabe beginnen
        onChange(digit);
        
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.setSelectionRange(1, 1);
          }
        }, 0);
        return;
      }
    }
    
    // Externe KeyDown-Handler aufrufen
    onKeyDown?.(e);
  };

  return (
    <input
      ref={inputRef}
      type="text"
      value={value}
      onChange={handleChange}
      onClick={handleClick}
      onFocus={onFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      disabled={disabled}
      inputMode="numeric"
      maxLength={7}
      className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#F29400] ${className}`}
      style={{ borderColor: '#D1D5DB' }}
    />
  );
}