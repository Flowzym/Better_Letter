import React, { useRef } from 'react';

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
 * Einfache, robuste Implementierung ohne komplexe Parsing-Logik
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
    
    // Einfache Formatierung: nur Ziffern und Schrägstrich erlauben
    const cleaned = newValue.replace(/[^\d/]/g, '');
    
    // Maximal 7 Zeichen (MM/YYYY)
    const limited = cleaned.slice(0, 7);
    
    onChange(limited);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = inputRef.current;
    if (!input) return;
    
    const start = input.selectionStart ?? 0;
    const end = input.selectionEnd ?? 0;
    const hasSelection = start !== end;
    
    // Spezialbehandlung nur für Ziffern-Eingabe bei Selektion
    if (/^\d$/.test(e.key) && hasSelection) {
      const digit = e.key;
      
      // FALL 1: "MM/YYYY" und Monat (MM) ist selektiert
      if (value === "MM/YYYY" && start === 0 && end === 2) {
        e.preventDefault();
        
        // Erste Ziffer: mit führender Null formatieren
        const formattedMonth = digit.padStart(2, '0');
        onChange(`${formattedMonth}/YYYY`);
        
        // Monat markiert lassen für weitere Eingabe
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.setSelectionRange(0, 2);
          }
        }, 0);
        return;
      }
      
      // FALL 2: "0X/YYYY" und Monat ist selektiert - zweite Ziffer eingeben
      if (value.match(/^0\d\/YYYY$/) && start === 0 && end === 2) {
        e.preventDefault();
        
        // Zweite Ziffer: erste Ziffer + neue Ziffer
        const firstDigit = value[1];
        const newMonth = firstDigit + digit;
        
        // Validierung: Monat muss zwischen 01-12 sein
        const monthNum = parseInt(newMonth, 10);
        if (monthNum >= 1 && monthNum <= 12) {
          onChange(`${newMonth}/YYYY`);
          
          // Jahr markieren für nächste Eingabe
          setTimeout(() => {
            if (inputRef.current) {
              inputRef.current.setSelectionRange(3, 7);
            }
          }, 0);
        }
        return;
      }
      
      // FALL 3: "MM/YYYY" und Jahr (YYYY) ist selektiert
      if (value === "MM/YYYY" && start === 3 && end === 7) {
        e.preventDefault();
        
        onChange(`MM/${digit}`);
        
        // Cursor nach der eingegebenen Ziffer setzen
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.setSelectionRange(4, 4);
          }
        }, 0);
        return;
      }
      
      // FALL 4: Normaler Monat selektiert (z.B. "01/2024" und "01" ist markiert)
      if (value.includes('/') && start === 0 && end === 2) {
        e.preventDefault();
        
        const yearPart = value.split('/')[1] || '';
        const formattedMonth = digit.padStart(2, '0');
        onChange(`${formattedMonth}/${yearPart}`);
        
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.setSelectionRange(0, 2);
          }
        }, 0);
        return;
      }
      
      // FALL 5: Normales Jahr selektiert (z.B. "01/2024" und "2024" ist markiert)
      if (value.includes('/') && start === 3 && end === value.length) {
        e.preventDefault();
        
        const monthPart = value.split('/')[0];
        onChange(`${monthPart}/${digit}`);
        
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.setSelectionRange(4, 4);
          }
        }, 0);
        return;
      }
    }
    
    // Externe KeyDown-Handler aufrufen
    onKeyDown?.(e);
  };

  const handleClick = () => {
    const input = inputRef.current;
    if (!input) return;
    
    const pos = input.selectionStart ?? 0;
    
    // Intelligente Selektion basierend auf Position
    if (value.includes('/')) {
      if (pos <= 2) {
        // Monat selektieren
        setTimeout(() => input.setSelectionRange(0, 2), 0);
      } else {
        // Jahr selektieren
        setTimeout(() => input.setSelectionRange(3, value.length), 0);
      }
    } else {
      // Gesamten Wert selektieren
      setTimeout(() => input.setSelectionRange(0, value.length), 0);
    }
  };

  return (
    <input
      ref={inputRef}
      type="text"
      value={value}
      onChange={handleChange}
      onClick={handleClick}
      onFocus={onFocus}
      onBlur={onBlur}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      disabled={disabled}
      inputMode="numeric"
      pattern="\d{2}/\d{4}"
      maxLength={7}
      className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#F29400] ${className}`}
      style={{ borderColor: '#D1D5DB' }}
    />
  );
}