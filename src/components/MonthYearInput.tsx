import { useState, useRef, useEffect } from 'react';

interface MonthYearInputProps {
  value?: string;
  onChange?: (value: string) => void;
}
export default function MonthYearInput({ value = '', onChange }: MonthYearInputProps) {
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [isInvalid, setIsInvalid] = useState(false);
  const textRef = useRef<HTMLInputElement>(null);
  const pickerRef = useRef<HTMLInputElement>(null);

  const selectPart = (pos: number) => {
    const input = textRef.current;
    if (!input) return;
    if (pos <= 2) {
      setTimeout(() => input.setSelectionRange(0, 2), 0);
    } else {
      setTimeout(() => input.setSelectionRange(3, 7), 0);
    }
  };

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

  const validMonth = (val: string) => {
    const m = parseInt(val, 10);
    return val.length === 2 && m >= 1 && m <= 12;
  };

  const validYear = (val: string) => {
    const y = parseInt(val, 10);
    return val.length === 4 && y >= 1955 && y <= 2055;
  };

  useEffect(() => {
    const parsed = parseValue(value);
    if (parsed.month !== month) setMonth(parsed.month);
    if (parsed.year !== year) setYear(parsed.year);
    setIsInvalid(!(validMonth(parsed.month) && validYear(parsed.year)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    if (raw.length === 0) {
      setMonth('');
      setYear('');
      setIsInvalid(false);
      onChange?.('');
      return;
    }

    if (raw.length <= 2 && Number(raw) >= 1 && Number(raw) <= 12) {
      const m = raw.padStart(2, '0');
      setMonth(m);
      setYear('');
      setIsInvalid(!(validMonth(m) && validYear('')));
      onChange?.(m + '/');
      return;
    }

    if (raw.length >= 4) {
      const m = raw.slice(0, 2);
      const y = raw.slice(2, 6);
      setMonth(m);
      setYear(y);
      setIsInvalid(!(validMonth(m) && validYear(y)));
      onChange?.(`${m}/${y}`);
    }
    if (raw.length >= 2 && raw.length < 4) {
      setIsInvalid(true);
    }
  };

  const handlePickerChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const [yearStr, monthStr] = e.target.value.split('-');
    if (yearStr && monthStr) {
      setMonth(monthStr);
      setYear(yearStr);
      setIsInvalid(!(validMonth(monthStr) && validYear(yearStr)));
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

  const handleMouseUp = () => {
    const pos = textRef.current?.selectionStart ?? 0;
    selectPart(pos);
  };

  const handleFocus = () => {
    const pos = textRef.current?.selectionStart ?? 0;
    selectPart(pos);
  };


  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const caret = input.selectionStart ?? 0;

    if (e.key === 'Backspace' && caret === 3) {
      e.preventDefault();
      selectPart(0);
      return;
    }

    if (e.key === '/') {
      const raw = input.value.replace(/[^0-9]/g, '');
      const m = parseInt(raw.slice(0, 2), 10);
      if (raw.length !== 2 || m < 1 || m > 12) {
        e.preventDefault();
      }
      return;
    }

    if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
    const inc = e.key === 'ArrowUp' ? 1 : -1;
    let numYear = Number(year || '1955');
    numYear += inc;
    if (numYear < 1955) numYear = 1955;
    if (numYear > 2055) numYear = 2055;
    const newYear = String(numYear);
    setYear(newYear);
    const newVal = month ? `${month}/${newYear}` : newYear;
    setIsInvalid(!(validMonth(month) && validYear(newYear)));
    onChange?.(newVal);
    setTimeout(() => {
      const node = textRef.current;
      if (node) {
        const start = month ? 3 : 0;
        const end = newVal.length;
        node.setSelectionRange(start, end);
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
        onMouseUp={handleMouseUp}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        ref={textRef}
        inputMode="numeric"
        pattern="\d{2}/\d{4}"
        maxLength={7}
        className={`border px-2 py-1 rounded w-28 ${isInvalid ? 'border-red-500' : 'border-gray-300'}`}
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

