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
        setSelectedDay(parseInt(parts[0], 10));
        setSelectedMonth(parseInt(parts[1], 10));
        setSelectedYear(parseInt(parts[2], 10));
      }
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

  const handleDaySelect = (day: number) => {
    setSelectedDay(day);
    if (selectedMonth && selectedYear) {
      const formattedDate = `${day.toString().padStart(2, '0')}.${selectedMonth.toString().padStart(2, '0')}.${selectedYear}`;
      onChange(formattedDate);
      setIsOpen(false);
    }
  };

  const handleMonthSelect = (monthIndex: number) => {
    setSelectedMonth(monthIndex + 1);
    if (selectedDay && selectedYear) {
      const formattedDate = `${selectedDay.toString().padStart(2, '0')}.${(monthIndex + 1).toString().padStart(2, '0')}.${selectedYear}`;
      onChange(formattedDate);
      setIsOpen(false);
    }
  };

  const handleYearSelect = (year: number) => {
    setSelectedYear(year);
    if (selectedDay && selectedMonth) {
      const formattedDate = `${selectedDay.toString().padStart(2, '0')}.${selectedMonth.toString().padStart(2, '0')}.${year}`;
      onChange(formattedDate);
      setIsOpen(false);
    }
  };

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month, 0).getDate();
  };

  const renderDays = () => {
    if (!selectedMonth || !selectedYear) return null;
    
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    
    return (
      <div className="grid grid-cols-7 gap-1">
        {days.map(day => (
          <button
            key={day}
            onClick={() => handleDaySelect(day)}
            className={`p-2 text-sm rounded hover:bg-gray-100 ${
              selectedDay === day ? 'text-white' : 'text-gray-700'
            }`}
            style={selectedDay === day ? { backgroundColor: '#F29400' } : {}}
          >
            {day}
          </button>
        ))}
      </div>
    );
  };

  const getBorderColor = () => {
    return '#D1D5DB';
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onClick={() => setIsOpen(true)}
          className="w-full h-10 px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2"
          style={{ borderColor: getBorderColor(), '--tw-ring-color': '#F29400' } as React.CSSProperties}
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
          className="absolute top-full left-0 mt-1 bg-white border rounded-md shadow-lg p-4 z-50 min-w-[400px]"
        >
          <div className="grid grid-cols-3 gap-4">
            {/* Tage - links */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Tag</h4>
              {selectedMonth && selectedYear ? (
                renderDays()
              ) : (
                <p className="text-xs text-gray-500">Erst Monat und Jahr wählen</p>
              )}
            </div>

            {/* Monate - mitte */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Monat</h4>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {months.map((month, index) => (
                  <button
                    key={month}
                    onClick={() => handleMonthSelect(index)}
                    className={`w-full text-left px-2 py-1 text-sm rounded hover:bg-gray-100 ${
                      selectedMonth === index + 1 ? 'text-white' : 'text-gray-700'
                    }`}
                    style={selectedMonth === index + 1 ? { backgroundColor: '#F29400' } : {}}
                  >
                    {month}
                  </button>
                ))}
              </div>
            </div>

            {/* Jahre - rechts */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Jahr</h4>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {years.map(year => (
                  <button
                    key={year}
                    onClick={() => handleYearSelect(year)}
                    className={`w-full text-left px-2 py-1 text-sm rounded hover:bg-gray-100 ${
                      selectedYear === year ? 'text-white' : 'text-gray-700'
                    }`}
                    style={selectedYear === year ? { backgroundColor: '#F29400' } : {}}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}