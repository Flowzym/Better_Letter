import { useState, useRef, useEffect } from "react";

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

function displayDate(month?: string, year?: string) {
  if (month && year) return `${month}.${year}`;
  if (year) return year;
  if (month) return month;
  return "";
}

export default function ZeitraumPicker({
  value,
  onChange,
}: ZeitraumPickerProps) {
  const [startMonth, setStartMonth] = useState<string | undefined>(
    value?.startMonth,
  );
  const [startYear, setStartYear] = useState<string | undefined>(
    value?.startYear,
  );
  const [endMonth, setEndMonth] = useState<string | undefined>(value?.endMonth);
  const [endYear, setEndYear] = useState<string | undefined>(value?.endYear);
  const [isCurrent, setIsCurrent] = useState<boolean>(
    value?.isCurrent ?? false,
  );
  const [activeField, setActiveField] = useState<"start" | "end" | null>(null);
  const [startInput, setStartInput] = useState<string>(
    displayDate(value?.startMonth, value?.startYear),
  );
  const [endInput, setEndInput] = useState<string>(
    displayDate(value?.endMonth, value?.endYear),
  );
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
  }, [
    value?.startMonth,
    value?.startYear,
    value?.endMonth,
    value?.endYear,
    value?.isCurrent,
  ]);
  /* eslint-enable react-hooks/exhaustive-deps */

  const years = Array.from({ length: 2025 - 1950 + 1 }, (_, i) =>
    String(2025 - i),
  );
  const months: { label: string; value: string }[] = [
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

  const parseInput = (val: string): { month?: string; year?: string } => {
    const trimmed = val.trim();
    const monthYear = /^(\d{1,2})\.(\d{4})$/.exec(trimmed);
    if (monthYear) {
      return {
        month: monthYear[1].padStart(2, "0"),
        year: monthYear[2],
      };
    }
    const onlyYear = /^(\d{4})$/.exec(trimmed);
    if (onlyYear) {
      return { year: onlyYear[1] };
    }
    return {};
  };

  const closePopup = () => {
    setActiveField(null);
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closePopup();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    setStartInput(displayDate(startMonth, startYear));
  }, [startMonth, startYear]);

  useEffect(() => {
    setEndInput(displayDate(endMonth, endYear));
  }, [endMonth, endYear]);

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
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleMonthSelect = (month?: string) => {
    if (activeField === "start") {
      setStartMonth(month);
      setStartInput(displayDate(month, startYear));
    }
    if (activeField === "end") {
      setEndMonth(month);
      setEndInput(displayDate(month, endYear));
    }
  };

  const handleYearSelect = (year: string) => {
    if (activeField === "start") {
      setStartYear(year);
      setStartInput(displayDate(startMonth, year));
    } else if (activeField === "end") {
      setEndYear(year);
      setEndInput(displayDate(endMonth, year));
    }
    closePopup();
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
          value={startInput}
          placeholder="von"
          onFocus={() => setActiveField("start")}
          onChange={(e) => {
            const val = e.target.value;
            setStartInput(val);
            const parsed = parseInput(val);
            setStartMonth(parsed.month);
            setStartYear(parsed.year);
          }}
          className="w-32 px-2 py-1 border rounded-md focus:outline-none focus:ring-2"
          style={{ "--tw-ring-color": "#F29400" } as React.CSSProperties}
        />
        {!isCurrent && (
          <input
            type="text"
            value={endInput}
            placeholder="bis"
            onFocus={() => setActiveField("end")}
            onChange={(e) => {
              const val = e.target.value;
              setEndInput(val);
              const parsed = parseInput(val);
              setEndMonth(parsed.month);
              setEndYear(parsed.year);
            }}
            className="w-32 px-2 py-1 border rounded-md focus:outline-none focus:ring-2"
            style={{ "--tw-ring-color": "#F29400" } as React.CSSProperties}
          />
        )}
        <label className="ml-2 flex items-center space-x-1 text-sm">
          <input type="checkbox" checked={isCurrent} onChange={toggleCurrent} />
          <span>laufend</span>
        </label>
      </div>
      {activeField && (
        <div
          className="absolute top-full left-0 mt-2 bg-white border rounded-md shadow-lg p-4 flex z-50"
          ref={popupRef}
        >
          <div className="mr-4">
            <div className="text-xs text-gray-500 mb-1">Monat optional</div>
            <div className="flex space-x-2">
              <div className="flex flex-col space-y-1">
                {months.slice(0, 6).map((m) => {
                  const selected =
                    activeField === "start"
                      ? startMonth === m.value
                      : endMonth === m.value;
                  return (
                    <button
                      key={m.label}
                      onMouseDown={() => handleMonthSelect(m.value)}
                      className={`px-2 py-1 h-8 border rounded-md transition-colors duration-150 focus:outline-none focus:ring-0 ${selected ? "bg-[#F29400] text-white" : "bg-gray-100 hover:bg-gray-200"}`}
                    >
                      {m.label}
                    </button>
                  );
                })}
              </div>
              <div className="flex flex-col space-y-1">
                {months.slice(6).map((m) => {
                  const selected =
                    activeField === "start"
                      ? startMonth === m.value
                      : endMonth === m.value;
                  return (
                    <button
                      key={m.label}
                      onMouseDown={() => handleMonthSelect(m.value)}
                      className={`px-2 py-1 h-8 border rounded-md transition-colors duration-150 focus:outline-none focus:ring-0 ${selected ? "bg-[#F29400] text-white" : "bg-gray-100 hover:bg-gray-200"}`}
                    >
                      {m.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="h-48 overflow-y-auto flex flex-col space-y-1 pr-1">
            {years.map((y) => {
              const selected =
                activeField === "start" ? startYear === y : endYear === y;
              return (
                <button
                  key={y}
                  onMouseDown={() => handleYearSelect(y)}
                  className={`px-2 py-1 h-8 text-left border rounded-md transition-colors duration-150 focus:outline-none focus:ring-0 ${selected ? "bg-[#F29400] text-white" : "bg-gray-100 hover:bg-gray-200"}`}
                >
                  {y}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
