import React, { useState, useRef, useEffect } from 'react';
import { Calendar, X } from 'lucide-react';
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
        
        // Intelligente Punkt-Setzung: Nur wenn Tag oder Monat vorhanden
        const newValue = currentDay && currentMonth ? 
          `${currentDay}.${currentMonth}.${newYear}` : 
          currentDay ? `${currentDay}..${newYear}` : 
          currentMonth ? `.${currentMonth}.${newYear}` :
          `${newYear}`; // Nur Jahr ohne Punkte
        handleInputChange(newValue);
      }
    }
  };

  const handleDaySelect = (selectedDay: string) => {
    // Intelligente Punkt-Setzung basierend auf vorhandenen Werten
    const newValue = month && year ? 
      `${selectedDay}.${month}.${year}` : 
      month ? `${selectedDay}.${month}` : 
      year ? `${selectedDay}..${year}` : 
      selectedDay;
    handleInputChange(newValue);
  };

  const handleMonthSelect = (selectedMonth: string) => {
    // Intelligente Punkt-Setzung basierend auf vorhandenen Werten
    const newValue = day && year ? 
      `${day}.${selectedMonth}.${year}` : 
      day ? `${day}.${selectedMonth}` : 
      year ? `.${selectedMonth}.${year}` : 
      selectedMonth;
    handleInputChange(newValue);
  };

  const handleYearSelect = (selectedYear: string) => {
    // Intelligente Punkt-Setzung: Nur wenn Tag oder Monat vorhanden
    const newValue = day && month ? 
      `${day}.${month}.${selectedYear}` : 
      day ? `${day}..${selectedYear}` : 
      month ? `.${month}.${selectedYear}` : 
      selectedYear; // Nur Jahr ohne Punkte
    handleInputChange(newValue);
    setActiveField(null);
  };

  const clearValue = () => {
    handleInputChange('');
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
          className="pr-20"
        />
        {/* Clear Button */}
        {internalValue && (
          <button
            type="button"
            onClick={clearValue}
            className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-300"
            aria-label="Datum löschen"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        {/* Calendar Icon */}
        <Calendar 
          className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 cursor-pointer"
          onClick={() => setActiveField(activeField ? null : "day")}
        />
      </div>

      {activeField && (
        <div
          ref={popupRef}
          className="absolute top-full left-0 mt-2 bg-white border rounded-md shadow-lg p-4 z-50 min-w-[500px]"
        >
          <div className="grid grid-cols-3 gap-x-4 items-start">
            {/* Tage - links */}
            <div className="flex flex-col space-y-2">
              <div className="grid grid-cols-7 gap-2">
                {days.map((d) => {
                  const selected = day === d;
                  return (
                    <button
                      key={d}
                      onMouseDown={() => handleDaySelect(d)}
                      className={`px-2 py-1 h-8 border rounded-md transition-colors duration-150 focus:outline-none focus:ring-0 text-xs ${
                        selected ? "bg-[#F29400] text-white" : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Monate - mitte */}
            <div className="flex flex-col space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col space-y-2">
                  {months.slice(0, 6).map((m) => {
                    const selected = month === m.value;
                    return (
                      <button
                        key={m.label}
                        onMouseDown={() => handleMonthSelect(m.value)}
                        className={`px-2 py-1 h-8 border rounded-md transition-colors duration-150 focus:outline-none focus:ring-0 text-xs ${
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
                        className={`px-2 py-1 h-8 border rounded-md transition-colors duration-150 focus:outline-none focus:ring-0 text-xs ${
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
            <div className="row-span-2 overflow-y-auto flex flex-col space-y-2 pr-1" style={{ maxHeight: "15rem" }}>
              {years.map((y) => {
                const selected = year === y;
                return (
                  <button
                    key={y}
                    onMouseDown={() => handleYearSelect(y)}
                    className={`px-2 py-1 h-8 text-center border rounded-md transition-colors duration-150 focus:outline-none focus:ring-0 text-xs ${
                      selected ? "bg-[#F29400] text-white" : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    {y}
                  </button>
                );
              })}
            </div>
            
            {/* Info-Text */}
            <div className="col-span-2 text-xs text-gray-400 mt-2">Tag und Monat optional</div>
          </div>
        </div>
      )}
    </div>
  );
}