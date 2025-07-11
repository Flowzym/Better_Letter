import { useState, useEffect, useRef } from 'react';

interface MonthYearInputProps {
  value?: string;
  onChange?: (value: string) => void;
}

export default function MonthYearInput({ value = '', onChange }: MonthYearInputProps) {
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [invalid, setInvalid] = useState(false);
  const monthRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);
  const pickerRef = useRef<HTMLInputElement>(null);

  const isMonth = (m: string) => /^(0[1-9]|1[0-2])$/.test(m);
  const isYear = (y: string) => /^(19(5[5-9]|[6-9]\d)|20([0-4]\d|5[0-5]))$/.test(y);

  useEffect(() => {
    const match = value.match(/^(\d{2})\/(\d{4})$/);
    if (match) {
      setMonth(match[1]);
      setYear(match[2]);
      setInvalid(!(isMonth(match[1]) && isYear(match[2])));
    } else if (/^\d{4}$/.test(value)) {
      setMonth('');
      setYear(value);
      setInvalid(!isYear(value));
    } else {
      setMonth('');
      setYear('');
      setInvalid(false);
    }
  }, [value]);

  const emit = (m: string, y: string) => {
    if (!onChange) return;
    if (m && y) {
      onChange(`${m}/${y}`);
    } else if (y) {
      onChange(y);
    } else if (m) {
      onChange(m);
    } else {
      onChange('');
    }
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 2);
    setMonth(val);
    if (val.length === 2 && isMonth(val)) {
      yearRef.current?.focus();
    }
    setInvalid(!(isMonth(val) && isYear(year)));
    emit(val, year);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (val) {
      let num = parseInt(val, 10);
      if (num < 1955) num = 1955;
      if (num > 2055) num = 2055;
      val = String(num).slice(0, 4);
    }
    setYear(val);
    setInvalid(!(isMonth(month) && isYear(val)));
    emit(month, val);
  };

  const handlePickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [y, m] = e.target.value.split('-');
    if (y && m) {
      setMonth(m);
      setYear(y);
      setInvalid(!(isMonth(m) && isYear(y)));
      onChange?.(`${m}/${y}`);
      yearRef.current?.focus();
    }
  };

  return (
    <div className="relative inline-flex items-center gap-1">
      <input
        ref={monthRef}
        type="text"
        placeholder="MM"
        value={month}
        onChange={handleMonthChange}
        inputMode="numeric"
        className={`border rounded w-12 px-1 text-center ${invalid ? 'border-red-500' : 'border-gray-300'}`}
      />
      <input
        ref={yearRef}
        type="text"
        placeholder="YYYY"
        value={year}
        onChange={handleYearChange}
        inputMode="numeric"
        className={`border rounded w-16 px-1 text-center ${invalid ? 'border-red-500' : 'border-gray-300'}`}
      />
      <button
        type="button"
        onClick={() => pickerRef.current?.showPicker()}
        className="absolute right-1 text-gray-500"
      >
        &#x1F4C5;
      </button>
      <input
        ref={pickerRef}
        type="month"
        onChange={handlePickerChange}
        style={{ position: 'absolute', left: '-9999px' }}
      />
    </div>
  );
}
