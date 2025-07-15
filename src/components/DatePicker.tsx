import React, { useState, useRef, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import DateInputBase from './DateInputBase';

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
}

// Helper functions
const parseDate = (dateStr: string) => {
  const parts = dateStr.split('.');
  return {
    day: parts[0] || '',
    month: parts[1] || '',
    year: parts[2] || ''
  };
};

// Generate arrays
const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
const years = Array.from({ length: 76 }, (_, i) => String(2025 - i));
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

export default function DatePicker({ value, onChange }: DatePickerProps) {
  const [activeField, setActiveField] = useState<"day" | "month" | "year" | null>(null);
  const [internalValue, setInternalValue] = useState(value);
  const popupRef = useRef<HTMLDivElement>(null);

  // Synchronisiere mit externem Wert
  useEffect(() => {
    console.log('DatePicker: External value changed:', value);
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
    console.log('DatePicker: Input changed from', internalValue, 'to', newValue);
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
        
        const newValue = currentDay && currentMonth ? 
          `${currentDay}.${currentMonth}.${newYear}` : 
          currentDay ? `${currentDay}..${newYear}` : `..${newYear}`;
        handleInputChange(newValue);
      }
    }
  };

  const handleDaySelect = (selectedDay: string) => {
    const newValue = month && year ? 
      `${selectedDay}.${month}.${year}` : 
      month ? `${selectedDay}.${month}.` : `${selectedDay}..`;
    handleInputChange(newValue);
  };

  const handleMonthSelect = (selectedMonth: string) => {
    const newValue = day && year ? 
      `${day}.${selectedMonth}.${year}` : 
      day ? `${day}.${selectedMonth}.` : `.${selectedMonth}.`;
    handleInputChange(newValue);
  };

  const handleYearSelect = (selectedYear: string) => {
    const newValue = day && month ? 
      `${day}.${month}.${selectedYear}` : 
      day ? `${day}.${month || ''}.${selectedYear}` : 
      month ? `${day || ''}.${month}.${selectedYear}` : `..${selectedYear}`;
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
          className="absolute top-full left-0 mt-2 bg-white border rounded-md shadow-lg p-4 z-50 min-w-[480px]"
        >
          <div className="grid grid-cols-[200px_180px_70px] gap-x-3 items-start">
            {/* Tage - links (7x5 Grid) - PERFEKT QUADRATISCH */}
            <div className="flex flex-col">
              <div className="grid grid-cols-7 gap-1">
                {days.map((d) => {
                  const selected = day === d;
                  return (
                    <button
                      key={d}
                      onMouseDown={() => handleDaySelect(d)}
                      className={`w-6 h-6 text-center border rounded-md transition-colors duration-150 focus:outline-none focus:ring-0 text-xs ${
                        selected ? "bg-[#F29400] text-white" : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Monate - mitte (2 Spalten) - KOMPAKTE BUTTONS */}
            <div className="flex flex-col">
              <div className="grid grid-cols-2 gap-1">
                <div className="flex flex-col space-y-1">
                  {months.slice(0, 6).map((m) => {
                    const selected = month === m.value;
                    return (
                      <button
                        key={m.label}
                        onMouseDown={() => handleMonthSelect(m.value)}
                        className={`w-20 h-6 text-center border rounded-md transition-colors duration-150 focus:outline-none focus:ring-0 text-xs ${
                          selected ? "bg-[#F29400] text-white" : "bg-gray-100 hover:bg-gray-200"
                        }`}
                      >
                        {m.label}
                      </button>
                    );
                  })}
                </div>
                <div className="flex flex-col space-y-1">
                  {months.slice(6).map((m) => {
                    const selected = month === m.value;
                    return (
                      <button
                        key={m.label}
                        onMouseDown={() => handleMonthSelect(m.value)}
                        className={`w-20 h-6 text-center border rounded-md transition-colors duration-150 focus:outline-none focus:ring-0 text-xs ${
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

            {/* Jahre - rechts - KOMPAKTE BUTTONS OHNE ABSTAND ZUR SCROLLBAR */}
            <div className="overflow-y-auto flex flex-col space-y-1 pr-0" style={{ maxHeight: "15rem" }}>
              {years.map((y) => {
                const selected = year === y;
                return (
                  <button
                    key={y}
                    onMouseDown={() => handleYearSelect(y)}
                    className={`w-14 h-6 text-center border rounded-md transition-colors duration-150 focus:outline-none focus:ring-0 text-xs ${
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