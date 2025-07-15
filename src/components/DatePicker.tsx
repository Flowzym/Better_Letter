import { useState, useRef, useEffect } from "react";
import { Calendar } from "lucide-react";
import DateInputBase from './DateInputBase';

interface DatePickerProps {
  value: string; // TT.MM.JJJJ format
  onChange: (date: string) => void;
}

const months = [
  { label: "Januar", value: "01" },
  { label: "Februar", value: "02" },
  { label: "März", value: "03" },
  { label: "April", value: "04" },
  { label: "Mai", value: "05" },
  { label: "Juni", value: "06" },
  { label: "Juli", value: "07" },
  { label: "August", value: "08" },
  { label: "September", value: "09" },
  { label: "Oktober", value: "10" },
  { label: "November", value: "11" },
  { label: "Dezember", value: "12" },
];

const years = Array.from({ length: 2025 - 1950 + 1 }, (_, i) =>
  String(2025 - i),
);

const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));

function parseDate(dateStr: string) {
  const parts = dateStr.split('.');
  return {
    day: parts[0] || '',
    month: parts[1] || '',
    year: parts[2] || ''
  };
}

function formatDate(day: string, month: string, year: string) {
  if (day && month && year) {
    return `${day}.${month}.${year}`;
  }
  if (day && month) {
    return `${day}.${month}.`;
  }
  if (day) {
    return `${day}.`;
  }
  return '';
}

export default function DatePicker({ value, onChange }: DatePickerProps) {
  const [activeField, setActiveField] = useState<"day" | "month" | "year" | null>(null);
  const [internalValue, setInternalValue] = useState(value);
  const popupRef = useRef<HTMLDivElement>(null);

  // Synchronisiere mit externem Wert
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  // Parse current date
  const { day, month, year } = parseDate(internalValue);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setActiveField(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close popup on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveField(null);
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  const handleInputChange = (newValue: string) => {
    setInternalValue(newValue);
    onChange(newValue);
  };

  const handleInputFocus = () => {
    setActiveField("day");
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Jahr-Navigation mit Pfeiltasten
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      const { day: currentDay, month: currentMonth, year: currentYear } = parseDate(internalValue);
      
      if (currentYear && currentYear.length === 4) {
        const increment = e.key === 'ArrowUp' ? 1 : -1;
        let newYear = parseInt(currentYear, 10) + increment;
        
        // Jahr-Grenzen einhalten
        if (newYear < 1950) newYear = 1950;
        if (newYear > 2025) newYear = 2025;
        
        const newValue = formatDate(currentDay, currentMonth, String(newYear));
        handleInputChange(newValue);
      }
    }
  };

  const handleDaySelect = (selectedDay: string) => {
    const newValue = formatDate(selectedDay, month, year);
    handleInputChange(newValue);
  };

  const handleMonthSelect = (selectedMonth: string) => {
    const newValue = formatDate(day, selectedMonth, year);
    handleInputChange(newValue);
  };

  const handleYearSelect = (selectedYear: string) => {
    const newValue = formatDate(day, month, selectedYear);
    handleInputChange(newValue);
    setActiveField(null);
  };

  return (
    <div className="relative">
      <div className="relative">
        <DateInputBase
          value={internalValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleInputKeyDown}
          className="pr-10"
        />
        <Calendar 
          className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 cursor-pointer"
          onClick={() => setActiveField(activeField ? null : "day")}
        />
      </div>

      {activeField && (
        <div
          ref={popupRef}
          className="absolute top-full left-0 mt-2 bg-white border rounded-md shadow-lg p-4 z-50 min-w-[600px]"
        >
          <div className="grid grid-cols-3 gap-x-8 items-start">
            {/* Tage - links (7x5 Grid) */}
            <div className="flex flex-col space-y-2">
              <div className="grid grid-cols-7 gap-2">
                {days.map((d) => {
                  const selected = day === d;
                  return (
                    <button
                      key={d}
                      onMouseDown={() => handleDaySelect(d)}
                      className={`px-2 py-1 h-8 text-center border rounded-md transition-colors duration-150 focus:outline-none focus:ring-0 text-sm ${
                        selected ? "bg-[#F29400] text-white" : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Monate - mitte (2 Spalten: Januar-Juni | Juli-Dezember) */}
            <div className="flex flex-col space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-2">
                  {months.slice(0, 6).map((m) => {
                    const selected = month === m.value;
                    return (
                      <button
                        key={m.label}
                        onMouseDown={() => handleMonthSelect(m.value)}
                        className={`px-3 py-1 h-8 text-center border rounded-md transition-colors duration-150 focus:outline-none focus:ring-0 text-sm w-24 ${
                          selected ? "bg-[#F29400] text-white" : "bg-gray-100 hover:bg-gray-200"
                        }`}
                      >
                        {m.label}
                      </button>
                    );
                  })}
                </div>
                <div className="flex flex-col space-y-2">
                  {months.slice(6).map((m) => {
                    const selected = month === m.value;
                    return (
                      <button
                        key={m.label}
                        onMouseDown={() => handleMonthSelect(m.value)}
                        className={`px-3 py-1 h-8 text-center border rounded-md transition-colors duration-150 focus:outline-none focus:ring-0 text-sm w-24 ${
                          selected ? "bg-[#F29400] text-white" : "bg-gray-100 hover:bg-gray-200"
                        }`}
                      >
                        {m.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Jahre - rechts */}
            <div className="overflow-y-auto flex flex-col space-y-2 pr-1" style={{ maxHeight: "15rem" }}>
              {years.map((y) => {
                const selected = year === y;
                return (
                  <button
                    key={y}
                    onMouseDown={() => handleYearSelect(y)}
                    className={`px-3 py-1 h-8 text-center border rounded-md transition-colors duration-150 focus:outline-none focus:ring-0 text-sm w-16 ${
                      selected ? "bg-[#F29400] text-white" : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    {y}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}