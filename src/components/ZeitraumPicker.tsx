import { useState, useRef, useEffect } from 'react';

interface ZeitraumValue {
  startMonth?: string;
  startYear?: string;
  endMonth?: string;
  endYear?: string;
  isCurrent?: boolean;
}

interface ZeitraumPickerProps {
  value?: ZeitraumValue;
  onChange?: (val: ZeitraumValue) => void;
}

export default function ZeitraumPicker({ value, onChange }: ZeitraumPickerProps) {
  const [startMonth, setStartMonth] = useState<string | undefined>(value?.startMonth);
  const [startYear, setStartYear] = useState<string | undefined>(value?.startYear);
  const [endMonth, setEndMonth] = useState<string | undefined>(value?.endMonth);
  const [endYear, setEndYear] = useState<string | undefined>(value?.endYear);
  const [isCurrent, setIsCurrent] = useState<boolean>(value?.isCurrent ?? false);
  const [activeField, setActiveField] = useState<'start' | 'end' | null>(null);
  const [tempMonth, setTempMonth] = useState<string | undefined>();
  const popupRef = useRef<HTMLDivElement>(null);

  // synchronize internal state with incoming value without triggering loops
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (value) {
      if (value.startMonth !== startMonth) setStartMonth(value.startMonth);
      if (value.startYear !== startYear) setStartYear(value.startYear);
      if (value.endMonth !== endMonth) setEndMonth(value.endMonth);
      if (value.endYear !== endYear) setEndYear(value.endYear);
      if ((value.isCurrent ?? false) !== isCurrent)
        setIsCurrent(value.isCurrent ?? false);
    }
  }, [value?.startMonth, value?.startYear, value?.endMonth, value?.endYear, value?.isCurrent]);
  /* eslint-enable react-hooks/exhaustive-deps */

  const years = Array.from({ length: 2025 - 1950 + 1 }, (_, i) => String(2025 - i));
  const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));

  const displayDate = (month?: string, year?: string) => {
    if (!year) return '';
    return month ? `${month}.${year}` : year;
  };

  const closePopup = () => {
    setActiveField(null);
    setTempMonth(undefined);
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closePopup();
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  const prevValueRef = useRef<ZeitraumValue>({});

  useEffect(() => {
    if (!onChange) return;
    const newVal = { startMonth, startYear, endMonth, endYear, isCurrent };
    const prev = prevValueRef.current;
    if (
      prev.startMonth !== newVal.startMonth ||
      prev.startYear !== newVal.startYear ||
      prev.endMonth !== newVal.endMonth ||
      prev.endYear !== newVal.endYear ||
      prev.isCurrent !== newVal.isCurrent
    ) {
      prevValueRef.current = newVal;
      onChange(newVal);
    }
  }, [startMonth, startYear, endMonth, endYear, isCurrent, onChange]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        closePopup();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleMonthClick = (month: string) => {
    setTempMonth(month);
    if (activeField === 'start' && startYear) {
      setStartMonth(month);
      closePopup();
    }
    if (activeField === 'end' && endYear) {
      setEndMonth(month);
      closePopup();
    }
  };

  const handleYearClick = (year: string) => {
    if (activeField === 'start') {
      setStartYear(year);
      if (tempMonth) {
        setStartMonth(tempMonth);
      }
      closePopup();
    } else if (activeField === 'end') {
      setEndYear(year);
      if (tempMonth) {
        setEndMonth(tempMonth);
      }
      closePopup();
    }
  };

  const toggleCurrent = () => {
    setIsCurrent((prev) => {
      const next = !prev;
      if (next) {
        setEndMonth(undefined);
        setEndYear(undefined);
      }
      return next;
    });
  };

  return (
    <div className="relative space-y-2">
      <div className="flex items-center space-x-2">
        <input
          type="text"
          readOnly
          value={displayDate(startMonth, startYear)}
          placeholder="von"
          onFocus={() => setActiveField('start')}
          className="w-32 px-2 py-1 border rounded-md focus:outline-none focus:ring-2"
          style={{ '--tw-ring-color': '#F29400' } as React.CSSProperties}
        />
        {!isCurrent && (
          <input
            type="text"
            readOnly
            value={displayDate(endMonth, endYear)}
            placeholder="bis"
            onFocus={() => setActiveField('end')}
            className="w-32 px-2 py-1 border rounded-md focus:outline-none focus:ring-2"
            style={{ '--tw-ring-color': '#F29400' } as React.CSSProperties}
          />
        )}
        <label className="ml-2 flex items-center space-x-1 text-sm">
          <input type="checkbox" checked={isCurrent} onChange={toggleCurrent} />
          <span>laufend</span>
        </label>
      </div>
      {activeField && (
        <div className="absolute top-full left-0 mt-2 bg-white border rounded-md shadow-lg p-4 flex z-50" ref={popupRef}>
          <div className="grid grid-cols-3 gap-2 mr-4">
            {months.map((m) => (
              <button
                key={m}
                onClick={() => handleMonthClick(m)}
                className="px-2 py-1 border rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2"
              >
                {m}
              </button>
            ))}
          </div>
          <div className="h-48 overflow-y-auto flex flex-col space-y-1 pr-1">
            {years.map((y) => (
              <button
                key={y}
                onClick={() => handleYearClick(y)}
                className="px-2 py-1 text-left border rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2"
              >
                {y}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

