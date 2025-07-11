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

  const isMonth = (val: string) => /^(0[1-9]|1[0-2])$/.test(val);

  const isYear = (val: string) =>
    /^(19(5[5-9]|[6-9]\d)|20([0-4]\d|5[0-5]))$/.test(val);

  useEffect(() => {
    const parsed = parseValue(value);
    if (parsed.month !== month) setMonth(parsed.month);
    if (parsed.year !== year) setYear(parsed.year);
    setIsInvalid(!(isMonth(parsed.month) && isYear(parsed.year)));
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

    if (raw.length === 2 && isMonth(raw)) {
      setMonth(raw);
      setYear('');
      setIsInvalid(!(isMonth(raw) && isYear('')));
      onChange?.(`${raw}/`);
      return;
    }

    const m = raw.slice(0, 2);
    const y = raw.slice(2, 6);
    setMonth(m);
    setYear(y);
    const valid = isMonth(m) && isYear(y);
    setIsInvalid(!valid);

    let formatted = m;
    if (y) formatted += `/${y}`;
    onChange?.(formatted);
  };

  const handlePickerChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const [yearStr, monthStr] = e.target.value.split('-');
    if (yearStr && monthStr) {
      setMonth(monthStr);
      setYear(yearStr);
      setIsInvalid(!(isMonth(monthStr) && isYear(yearStr)));
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

    if (e.key === 'Backspace') {
      const selStart = input.selectionStart ?? 0;
      const selEnd = input.selectionEnd ?? 0;
      if (selStart === selEnd && selStart === 3) {
        e.preventDefault();
        setMonth('');
        setIsInvalid(!(isMonth('') && isYear(year)));
        onChange?.(year);
        setTimeout(() => {
          const node = textRef.current;
          if (node) node.setSelectionRange(0, year.length);
        }, 0);
        return;
      }
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
    setIsInvalid(!(isMonth(month) && isYear(newYear)));
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
        onKeyDown={(e) => {
          if (e.key === 'Backspace') {
            const caret = textRef.current?.selectionStart ?? 0;
            const sel = (textRef.current?.selectionEnd ?? caret) - caret;

            if (caret <= 2 || sel > 0) {
              e.preventDefault();
              setMonth('');
              const newVal = year ? '/' + year : '';
              setIsInvalid(!(isMonth('') && isYear(year)));
              onChange?.(newVal);
              setTimeout(() => textRef.current?.setSelectionRange(0, 0));
              return;
            }
          }
          handleKeyDown(e);
        }}
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

