import { useState, useRef, useEffect } from 'react';

interface MonthYearInputProps {
  value?: string;
  onChange?: (value: string) => void;
}
export default function MonthYearInput({ value = '', onChange }: MonthYearInputProps) {
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const textRef = useRef<HTMLInputElement>(null);
  const pickerRef = useRef<HTMLInputElement>(null);

  const displayValue = () => {
    if (month) {
      if (year) return `${month}/${year}`;
      if (month.length === 2) return `${month}/`;
      return month;
    }
    return year;
  };

  const parseValue = (val: string) => {
    if (/^\d{2}\/\d{4}$/.test(val)) {
      return { month: val.slice(0, 2), year: val.slice(3) };
    }
    if (/^\d{4}$/.test(val)) {
      return { month: '', year: val };
    }
    return { month: '', year: '' };
  };

  useEffect(() => {
    const parsed = parseValue(value);
    if (parsed.month !== month) setMonth(parsed.month);
    if (parsed.year !== year) setYear(parsed.year);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/[^0-9]/g, '');
    if (raw.length === 0) {
      setMonth('');
      setYear('');
      onChange?.('');
      return;
    }

    if (raw.length <= 2 && Number(raw) >= 1 && Number(raw) <= 12) {
      const m = raw.padStart(2, '0');
      setMonth(m);
      setYear('');
      onChange?.(m + '/');
      return;
    }

    if (raw.length >= 4) {
      const m = raw.slice(0, 2);
      const y = raw.slice(2, 6);
      setMonth(m);
      setYear(y);
      onChange?.(`${m}/${y}`);
    }
  };

  const handlePickerChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const [yearStr, monthStr] = e.target.value.split('-');
    if (yearStr && monthStr) {
      setMonth(monthStr);
      setYear(yearStr);
      const formatted = `${monthStr}/${yearStr}`;
      onChange?.(formatted);
      textRef.current?.focus();
      setTimeout(() => {
        const p = formatted.length;
        textRef.current?.setSelectionRange(p, p);
      }, 0);
    }
  };

  const openPicker = () => {
    pickerRef.current?.showPicker();
  };

  const handleClick = () => {
    const input = textRef.current;
    if (!input) return;
    const pos = input.selectionStart ?? 0;
    if (pos <= 2) {
      setTimeout(() => input.setSelectionRange(0, Math.min(2, input.value.length)), 0);
    } else {
      const start = month ? 3 : 0;
      setTimeout(() => input.setSelectionRange(start, input.value.length), 0);
    }
  };

  const handleFocus = () => {
    const input = textRef.current;
    if (!input) return;
    setTimeout(() => input.setSelectionRange(0, Math.min(2, input.value.length)), 0);
  };

  const invalid =
    (month.length === 2 && (Number(month) < 1 || Number(month) > 12)) ||
    (year.length === 4 && (Number(year) < 1900 || Number(year) > 2099));

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
    const inc = e.key === 'ArrowUp' ? 1 : -1;
    let numYear = Number(year || '1900');
    numYear += inc;
    if (numYear < 1900) numYear = 1900;
    if (numYear > 2099) numYear = 2099;
    const newYear = String(numYear);
    setYear(newYear);
    const newVal = month ? `${month}/${newYear}` : newYear;
    onChange?.(newVal);
    setTimeout(() => {
      const input = textRef.current;
      if (input) {
        const start = month ? 3 : 0;
        const end = newVal.length;
        input.setSelectionRange(start, end);
      }
    }, 0);
    e.preventDefault();
  };

  return (
    <div className="relative inline-flex items-center">
      <input
        type="text"
        placeholder="MM/YYYY"
        value={displayValue()}
        onChange={handleChange}
        onClick={handleClick}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        ref={textRef}
        inputMode="numeric"
        pattern="\d{2}/\d{4}"
        maxLength={7}
        className={`border px-2 py-1 rounded w-28 ${invalid ? 'border-red-500' : ''}`}
      />
      <button
        type="button"
        onClick={openPicker}
        className="absolute right-1 text-gray-500"
      >
        &#x1F4C5;
      </button>
      <input
        type="month"
        ref={pickerRef}
        onChange={handlePickerChange}
        style={{ position: 'absolute', left: '-9999px' }}
      />
    </div>
  );
}

