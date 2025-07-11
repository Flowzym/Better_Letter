import React, { useEffect, useRef, useState, ChangeEvent, KeyboardEvent } from 'react';

interface MonthYearInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

function formatValue(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 6);
  if (digits.length <= 2) {
    return digits;
  }
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function isValid(val: string): boolean {
  const match = /^(\d{2})\/(\d{4})$/.exec(val);
  if (!match) return false;
  const month = parseInt(match[1], 10);
  return month >= 1 && month <= 12;
}

export default function MonthYearInput({
  value = '',
  onChange,
  placeholder = 'MM/JJJJ',
  className = '',
}: MonthYearInputProps) {
  const [internal, setInternal] = useState(formatValue(value));
  const inputRef = useRef<HTMLInputElement>(null);
  const prevDigitsRef = useRef<string>(internal.replace(/\D/g, ''));
  const [valid, setValid] = useState(isValid(internal));

  useEffect(() => {
    if (value !== internal) {
      setInternal(formatValue(value));
    }
  }, [value]);

  useEffect(() => {
    setValid(isValid(internal));
  }, [internal]);

  const setCursorSection = (section: 'month' | 'year') => {
    const input = inputRef.current;
    if (!input) return;
    if (section === 'month') {
      input.setSelectionRange(0, Math.min(2, input.value.length));
    } else {
      input.setSelectionRange(3, input.value.length);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const formatted = formatValue(e.target.value);
    const digits = formatted.replace(/\D/g, '');
    const prev = prevDigitsRef.current;
    prevDigitsRef.current = digits;
    setInternal(formatted);
    if (onChange) onChange(formatted);
    if (digits.length === 2 && prev.length < 2) {
      setTimeout(() => setCursorSection('year'), 0);
    }
  };

  const handleClick = () => {
    const pos = inputRef.current?.selectionStart ?? 0;
    if (pos <= 2) setCursorSection('month');
    else setCursorSection('year');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === '/') {
      e.preventDefault();
      return;
    }
    if (e.key === 'ArrowRight') {
      const pos = inputRef.current?.selectionStart ?? 0;
      if (pos <= 2 && internal.length >= 7) {
        e.preventDefault();
        setCursorSection('year');
      }
    } else if (e.key === 'ArrowLeft') {
      const pos = inputRef.current?.selectionStart ?? 0;
      if (pos >= 3) {
        e.preventDefault();
        setCursorSection('month');
      }
    }
  };

  return (
    <input
      ref={inputRef}
      type="text"
      className={`px-2 py-1 border rounded-md focus:outline-none focus:ring-2 ${className} ${
        valid || internal === '' ? '' : 'border-red-500'
      }`}
      style={{ '--tw-ring-color': '#F29400' } as React.CSSProperties}
      placeholder={placeholder}
      value={internal}
      onChange={handleChange}
      onClick={handleClick}
      onFocus={handleClick}
      onKeyDown={handleKeyDown}
    />
  );
}
