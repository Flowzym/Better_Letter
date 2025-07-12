import { useState, useEffect, useRef } from 'react';

interface MonthYearInputProps {
  value: string;
  onChange: (val: string) => void;
}

const isValidMonth = (m: string) => /^(0[1-9]|1[0-2])$/.test(m);
const isValidYear = (y: string) => /^(19(5[5-9]|[6-9]\d)|20([0-4]\d|5[0-5]))$/.test(y);

export default function MonthYearInput({ value, onChange }: MonthYearInputProps) {
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const match = value.match(/^(\d{2})\/(\d{4})$/);
    if (match) {
      setMonth(match[1]);
      setYear(match[2]);
    } else {
      setMonth('');
      setYear('');
    }
  }, [value]);

  const formatValue = (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, 6);
    let m = '';
    let y = '';

    if (digits.length >= 2 && isValidMonth(digits.slice(0, 2))) {
      m = digits.slice(0, 2);
      y = digits.slice(2);
    } else {
      y = digits;
    }

    if (y.length > 4) y = y.slice(0, 4);

    const numYear = Number(y);
    if (y.length === 4 && !isValidYear(y)) {
      if (numYear < 1955) y = '1955';
      if (numYear > 2055) y = '2055';
    }

    return m ? m + (y ? `/${y}` : '/') : y;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const pos = input.selectionStart ?? input.value.length;
    const formatted = formatValue(input.value);
    onChange(formatted);
    const match = formatted.match(/^(\d{2})\/?(\d*)$/);
    if (match) {
      setMonth(match[1]);
      setYear(match[2]);
    } else if (/^\d{4}$/.test(formatted)) {
      setMonth('');
      setYear(formatted);
    } else {
      setMonth('');
      setYear('');
    }

    setTimeout(() => {
      if (inputRef.current) {
        let caret = pos;
        const hadSlash = value.includes('/');
        const hasSlash = formatted.includes('/');
        if (!hadSlash && hasSlash && pos > 2) caret += 1;
        if (hadSlash && !hasSlash && pos > 2) caret -= 1;
        inputRef.current.setSelectionRange(caret, caret);
      }
    }, 0);
  };

  const selectSection = () => {
    const input = inputRef.current;
    if (!input) return;
    const pos = input.selectionStart ?? 0;
    if (value.includes('/') && pos <= 2) {
      setTimeout(() => input.setSelectionRange(0, 2), 0);
    } else if (value.includes('/')) {
      setTimeout(() => input.setSelectionRange(3, value.length), 0);
    } else {
      setTimeout(() => input.setSelectionRange(0, value.length), 0);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Backspace') return;
    const input = inputRef.current;
    if (!input) return;
    const start = input.selectionStart ?? 0;
    const end = input.selectionEnd ?? 0;
    if (value.includes('/') && start === 0 && end === 2) {
      onChange(year);
      setMonth('');
      setTimeout(() => input.setSelectionRange(0, year.length), 0);
      e.preventDefault();
    } else if (value.includes('/') && start === 3 && end === value.length) {
      onChange(month + '/');
      setYear('');
      setTimeout(() => input.setSelectionRange(0, 2), 0);
      e.preventDefault();
    }
  };

  return (
    <input
      ref={inputRef}
      type="text"
      placeholder="MM/YYYY"
      value={value}
      onChange={handleChange}
      onClick={selectSection}
      onFocus={selectSection}
      onKeyDown={handleKeyDown}
      inputMode="numeric"
      pattern="\d{2}/\d{4}"
      maxLength={7}
      className="border px-2 py-1 rounded w-28"
    />
  );
}
