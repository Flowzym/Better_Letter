import { useState, useRef } from 'react';

export default function MonthYearInput() {
  const [value, setValue] = useState('');
  const textRef = useRef<HTMLInputElement>(null);
  const pickerRef = useRef<HTMLInputElement>(null);

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

  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const input = e.target;
    const pos = input.selectionStart ?? input.value.length;
    const { value: newVal, caret } = formatInput(
      input.value,
      value,
      pos,
      (e.nativeEvent as InputEvent).inputType || ''
    );
    setValue(newVal);
    setTimeout(() => {
      textRef.current?.setSelectionRange(caret, caret);
    }, 0);
  };

  const handlePickerChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const [year, month] = e.target.value.split('-');
    if (year && month) {
      const formatted = `${month}/${year}`;
      setValue(formatted);
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
      setTimeout(() => input.setSelectionRange(0, 2), 0);
    } else {
      setTimeout(() => input.setSelectionRange(3, 7), 0);
    }
  };

  return (
    <div className="relative inline-flex items-center">
      <input
        type="text"
        placeholder="MM/YYYY"
        value={value}
        onChange={handleTextChange}
        onClick={handleClick}
        ref={textRef}
        inputMode="numeric"
        pattern="\d{2}/\d{4}"
        maxLength={7}
        className="border px-2 py-1 rounded w-28"
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

