import React, { useState, useRef, useEffect } from 'react';
import { parseMonthYearInput, calculateCursorPosition } from '../utils/dateUtils';

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
 * Konsolidiert die gemeinsame Logik aus MonthYearInput und MonthYearPicker
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
    const input = e.target;
    const oldPosition = input.selectionStart ?? 0;
    
    const parsed = parseMonthYearInput(input.value);
    onChange(parsed.formatted);
    
    // Cursor-Position anpassen
    setTimeout(() => {
      if (inputRef.current) {
        const newPosition = calculateCursorPosition(value, parsed.formatted, oldPosition);
        inputRef.current.setSelectionRange(newPosition, newPosition);
      }
    }, 0);
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Backspace-Logik für intelligentes Löschen
    if (e.key === 'Backspace') {
      const input = inputRef.current;
      if (!input) return;
      
      const start = input.selectionStart ?? 0;
      const end = input.selectionEnd ?? 0;
      
      // Wenn Monat selektiert ist, lösche nur Monat
      if (value.includes('/') && start === 0 && end === 2) {
        const yearPart = value.split('/')[1] || '';
        onChange(yearPart);
        setTimeout(() => input.setSelectionRange(0, yearPart.length), 0);
        e.preventDefault();
        return;
      }
      
      // Wenn Jahr selektiert ist, lösche nur Jahr
      if (value.includes('/') && start === 3 && end === value.length) {
        const monthPart = value.split('/')[0];
        onChange(monthPart + '/');
        setTimeout(() => input.setSelectionRange(0, 2), 0);
        e.preventDefault();
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