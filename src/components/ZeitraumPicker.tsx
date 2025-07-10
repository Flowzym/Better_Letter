import React from "react";

interface ZeitraumPickerProps {
  startMonth: number | null;
  startYear: number | null;
  endMonth: number | null;
  endYear: number | null;
  isCurrent: boolean;
  onChange: (data: {
    startMonth: number | null;
    startYear: number | null;
    endMonth: number | null;
    endYear: number | null;
    isCurrent: boolean;
  }) => void;
}

// Months displayed as two digit numbers (01 - 12)
const months = Array.from({ length: 12 }, (_, i) =>
  String(i + 1).padStart(2, "0"),
);

export default function ZeitraumPicker({
  startMonth,
  startYear,
  endMonth,
  endYear,
  isCurrent,
  onChange,
}: ZeitraumPickerProps) {
  const currentYear = new Date().getFullYear();
  // Years descending from currentYear down to 1950
  const years = Array.from(
    { length: currentYear - 1950 + 1 },
    (_, i) => currentYear - i,
  );

  const updateField = (
    field: keyof Omit<ZeitraumPickerProps, "onChange">,
    value: number | boolean | null,
  ) => {
    const data = {
      startMonth,
      startYear,
      endMonth,
      endYear,
      isCurrent,
    };

    switch (field) {
      case "startMonth":
        data.startMonth = value as number | null;
        break;
      case "startYear":
        data.startYear = value as number | null;
        break;
      case "endMonth":
        data.endMonth = value as number | null;
        break;
      case "endYear":
        data.endYear = value as number | null;
        break;
      case "isCurrent":
        data.isCurrent = value as boolean;
        if (data.isCurrent) {
          data.endMonth = null;
          data.endYear = null;
        }
        break;
      default:
        break;
    }

    if (data.startYear !== null && (data.isCurrent || data.endYear !== null)) {
      onChange(data);
    }
  };

  return (
    <div className="border rounded-md p-4 space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4">
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-gray-700 w-24">
          Startdatum
        </span>
        <select
          value={startMonth ?? ""}
          onChange={(e) =>
            updateField(
              "startMonth",
              e.target.value ? parseInt(e.target.value, 10) : null,
            )
          }
          className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
          style={
            {
              borderColor: "#F29400",
              "--tw-ring-color": "#F29400",
            } as React.CSSProperties
          }
        >
          <option value="">Monat</option>
          {months.map((month) => (
            <option key={month} value={parseInt(month, 10)}>
              {month}
            </option>
          ))}
        </select>
        <select
          value={startYear ?? ""}
          onChange={(e) =>
            updateField(
              "startYear",
              e.target.value ? parseInt(e.target.value, 10) : null,
            )
          }
          className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
          style={
            {
              borderColor: "#F29400",
              "--tw-ring-color": "#F29400",
            } as React.CSSProperties
          }
        >
          <option value="">Jahr</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
      {!isCurrent && (
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700 w-24">
            Enddatum
          </span>
          <select
            value={endMonth ?? ""}
            onChange={(e) =>
              updateField(
                "endMonth",
                e.target.value ? parseInt(e.target.value, 10) : null,
              )
            }
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
            style={
              {
                borderColor: "#F29400",
                "--tw-ring-color": "#F29400",
              } as React.CSSProperties
            }
          >
            <option value="">Monat</option>
            {months.map((month) => (
              <option key={month} value={parseInt(month, 10)}>
                {month}
              </option>
            ))}
          </select>
          <select
            value={endYear ?? ""}
            onChange={(e) =>
              updateField(
                "endYear",
                e.target.value ? parseInt(e.target.value, 10) : null,
              )
            }
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
            style={
              {
                borderColor: "#F29400",
                "--tw-ring-color": "#F29400",
              } as React.CSSProperties
            }
          >
            <option value="">Jahr</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      )}
      <label className="inline-flex items-center space-x-2">
        <input
          type="checkbox"
          checked={isCurrent}
          onChange={(e) => updateField("isCurrent", e.target.checked)}
          className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
        />
        <span className="text-sm text-gray-700">Derzeit beschäftigt</span>
      </label>
    </div>
  );
}
