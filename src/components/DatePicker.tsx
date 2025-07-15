import { useState, useRef, useEffect } from "react";
import { Calendar } from "lucide-react";

interface DatePickerProps {
  value: string; // DD.MM.YYYY format
  onChange: (date: string) => void;
}

const months = [
  "Januar", "Februar", "März", "April", "Mai", "Juni",
  "Juli", "August", "September", "Oktober", "November", "Dezember"
];

const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);

export default function DatePicker({ value, onChange }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Parse existing value
  useEffect(() => {
    if (value) {
      const parts = value.split('.');
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10);
        const year = parseInt(parts[2], 10);
        
        if (!isNaN(day) && day >= 1 && day <= 31) setSelectedDay(day);
        if (!isNaN(month) && month >= 1 && month <= 12) setSelectedMonth(month);
        if (!isNaN(year) && year >= 1900 && year <= 2100) setSelectedYear(year);
      }
    } else {
      setSelectedDay(null);
      setSelectedMonth(null);
      setSelectedYear(null);
    }
  }, [value]);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatInput = (input: string) => {
    // Remove all non-digits
    const digits = input.replace(/\D/g, '');
    
    // Auto-format with dots
    if (digits.length <= 2) {
      return digits;
    } else if (digits.length <= 4) {
      return `${digits.slice(0, 2)}.${digits.slice(2)}`;
    } else {
      return `${digits.slice(0, 2)}.${digits.slice(2, 4)}.${digits.slice(4, 8)}`;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = inputRef.current;
    if (!input) return;

    const cursorPos = input.selectionStart ?? 0;
    const oldValue = value;
    const newValue = e.target.value;
    
    // Check if user is typing in a selected field
    const isFieldSelected = input.selectionStart !== input.selectionEnd;
    
    if (isFieldSelected) {
      // User is typing in a selected field - handle digit input
      const digit = newValue.replace(/\D/g, '').slice(-1);
      if (digit) {
        // Determine which field was selected and update accordingly
        if (cursorPos <= 2) {
          // Day field
          const parts = oldValue.split('.');
          const newDay = digit.length === 1 ? `0${digit}` : digit.slice(-2);
          const formatted = `${newDay}.${parts[1] || 'MM'}.${parts[2] || 'YYYY'}`;
          onChange(formatted);
          // Move cursor to end
          setTimeout(() => {
            if (inputRef.current) {
              inputRef.current.setSelectionRange(formatted.length, formatted.length);
            }
          }, 0);
          return;
        } else if (cursorPos <= 5) {
          // Month field
          const parts = oldValue.split('.');
          const newMonth = digit.length === 1 ? `0${digit}` : digit.slice(-2);
          const formatted = `${parts[0] || 'DD'}.${newMonth}.${parts[2] || 'YYYY'}`;
          onChange(formatted);
          // Move cursor to end
          setTimeout(() => {
            if (inputRef.current) {
              inputRef.current.setSelectionRange(formatted.length, formatted.length);
            }
          }, 0);
          return;
        } else {
          // Year field
          const parts = oldValue.split('.');
          const newYear = digit.padStart(4, '0');
          const formatted = `${parts[0] || 'DD'}.${parts[1] || 'MM'}.${newYear}`;
          onChange(formatted);
          // Move cursor to end
          setTimeout(() => {
            if (inputRef.current) {
              inputRef.current.setSelectionRange(formatted.length, formatted.length);
            }
          }, 0);
          return;
        }
      }
    }
    
    // Normal formatting
    const formatted = formatInput(newValue);
    onChange(formatted);
  };

  const handleInputClick = () => {
    const input = inputRef.current;
    if (!input) return;
    
    const pos = input.selectionStart ?? 0;
    const currentValue = value;
    
    // Select appropriate section based on cursor position
    if (currentValue.includes('.')) {
      const firstDot = currentValue.indexOf('.');
      const secondDot = currentValue.lastIndexOf('.');
      
      if (pos <= firstDot) {
        // Day section
        setTimeout(() => input.setSelectionRange(0, firstDot), 0);
      } else if (pos <= secondDot) {
        // Month section
        setTimeout(() => input.setSelectionRange(firstDot + 1, secondDot), 0);
      } else {
        // Year section
        setTimeout(() => input.setSelectionRange(secondDot + 1, currentValue.length), 0);
      }
    } else {
      // Select all if no dots
      setTimeout(() => input.setSelectionRange(0, currentValue.length), 0);
    }
    
    setIsOpen(true);
  };

  const updateDateFromSelection = (day?: number, month?: number, year?: number) => {
    const newDay = day ?? selectedDay;
    const newMonth = month ?? selectedMonth;
    const newYear = year ?? selectedYear;
    
    // Update state
    if (day !== undefined) setSelectedDay(day);
    if (month !== undefined) setSelectedMonth(month);
    if (year !== undefined) setSelectedYear(year);
    
    // Build formatted date string
    const dayStr = newDay ? newDay.toString().padStart(2, '0') : 'DD';
    const monthStr = newMonth ? newMonth.toString().padStart(2, '0') : 'MM';
    const yearStr = newYear ? newYear.toString() : 'YYYY';
    
    const formattedDate = `${dayStr}.${monthStr}.${yearStr}`;
    onChange(formattedDate);
  };

  const handleDaySelect = (day: number) => {
    updateDateFromSelection(day);
  };

  const handleMonthSelect = (monthIndex: number) => {
    const month = monthIndex + 1;
    updateDateFromSelection(undefined, month);
  };

  const handleYearSelect = (year: number) => {
    updateDateFromSelection(undefined, undefined, year);
  };

  const renderDays = () => {
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    
    return (
      <div className="grid grid-cols-7 gap-2">
        {days.map(day => (
          <button
            key={day}
            onClick={() => handleDaySelect(day)}
            className={`w-8 h-8 text-sm rounded hover:bg-gray-200 transition-colors ${
              selectedDay === day ? 'text-white' : 'text-gray-700 bg-gray-100'
            }`}
            style={selectedDay === day ? { backgroundColor: '#F29400' } : {}}
          >
            {day.toString().padStart(2, '0')}
          </button>
        ))}
      </div>
    );
  };

  const renderMonths = () => {
    const firstHalf = months.slice(0, 6);
    const secondHalf = months.slice(6, 12);
    
    return (
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          {firstHalf.map((month, index) => (
            <button
              key={month}
              onClick={() => handleMonthSelect(index)}
              className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-200 transition-colors ${
                selectedMonth === index + 1 ? 'text-white' : 'text-gray-700 bg-gray-100'
              }`}
              style={selectedMonth === index + 1 ? { backgroundColor: '#F29400' } : {}}
            >
              {month}
            </button>
          ))}
        </div>
        <div className="space-y-1">
          {secondHalf.map((month, index) => (
            <button
              key={month}
              onClick={() => handleMonthSelect(index + 6)}
              className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-200 transition-colors ${
                selectedMonth === index + 7 ? 'text-white' : 'text-gray-700 bg-gray-100'
              }`}
              style={selectedMonth === index + 7 ? { backgroundColor: '#F29400' } : {}}
            >
              {month}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderYears = () => {
    return (
      <div className="space-y-1 max-h-48 overflow-y-auto">
        {years.map(year => (
          <button
            key={year}
            onClick={() => handleYearSelect(year)}
            className={`w-full text-center px-3 py-2 text-sm rounded hover:bg-gray-200 transition-colors ${
              selectedYear === year ? 'text-white' : 'text-gray-700 bg-gray-100'
            }`}
            style={selectedYear === year ? { backgroundColor: '#F29400' } : {}}
          >
            {year}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onClick={handleInputClick}
          onFocus={() => setIsOpen(true)}
          className="w-full h-10 px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-1"
          style={{ '--tw-ring-color': '#F29400' } as React.CSSProperties}
          placeholder="TT.MM.JJJJ"
          maxLength={10}
        />
        <Calendar 
          className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>

      {isOpen && (
        <div
          ref={popupRef}
          className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-4 z-50 min-w-[500px]"
        >
          <div className="grid grid-cols-3 gap-6">
            {/* Tage - links */}
            <div>
              {renderDays()}
            </div>

            {/* Monate - mitte (2 Spalten) */}
            <div>
              {renderMonths()}
            </div>

            {/* Jahre - rechts */}
            <div>
              {renderYears()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}