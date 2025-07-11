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

  const formatInput = (
    raw: string,
    prev: string,
    pos: number,
    inputType: string
  ) => {
    const isDelete = inputType.startsWith('delete');
    const hasSlash = raw.includes('/');
    const digits = raw.replace(/\D/g, '').slice(0, 6);
    const prevDigits = prev.replace(/\D/g, '');
    let caret = pos;
    let formatted = '';

    if (isDelete) {
      if (hasSlash) {
        const [m, y] = raw.split('/');
        const month = m.replace(/\D/g, '').slice(0, 2);
        const year = y.replace(/\D/g, '').slice(0, 4);
        formatted = month + (raw.includes('/') ? '/' : '') + year;
      } else {
        if (digits.length > 2) {
          formatted = digits.slice(0, 2) + '/' + digits.slice(2);
        } else {
          formatted = digits;
        }
      }
    } else {
      if (digits.length <= 2) {
        formatted = digits;
        if (
          digits.length === 2 &&
          !hasSlash &&
          prevDigits.length < 2
        ) {
          formatted += '/';
          if (caret >= 2) caret += 1;
        } else if (hasSlash) {
          formatted += '/';
        }
      } else {
        formatted = digits.slice(0, 2) + '/' + digits.slice(2);
        if (!prev.includes('/') && caret > 2) caret += 1;
      }
    }

    return { value: formatted, caret };
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const pos = input.selectionStart ?? input.value.length;
    const current = displayValue();
    const { value: newVal, caret } = formatInput(
      input.value,
      current,
      pos,
      (e.nativeEvent as InputEvent).inputType || ''
    );
    const digits = newVal.replace(/\D/g, '');
    let newMonth = '';
    let newYear = '';
    if (digits.length <= 2) {
      newMonth = digits;
    } else {
      newMonth = digits.slice(0, 2);
      newYear = digits.slice(2, 6);
    }
    setMonth(newMonth);
    setYear(newYear);
    onChange?.(newVal);
    setTimeout(() => {
      textRef.current?.setSelectionRange(caret, caret);
    }, 0);
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
        onChange={handleTextChange}
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

