import React from 'react';

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

const months = [
  'J\u00e4nner',
  'Februar',
  'M\u00e4rz',
  'April',
  'Mai',
  'Juni',
  'Juli',
  'August',
  'September',
  'Oktober',
  'November',
  'Dezember',
];

export default function ZeitraumPicker({
  startMonth,
  startYear,
  endMonth,
  endYear,
  isCurrent,
  onChange,
}: ZeitraumPickerProps) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1970 + 1 }, (_, i) => 1970 + i);

  const updateField = (
    field: keyof Omit<ZeitraumPickerProps, 'onChange'>,
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
      case 'startMonth':
        data.startMonth = value as number | null;
        break;
      case 'startYear':
        data.startYear = value as number | null;
        break;
      case 'endMonth':
        data.endMonth = value as number | null;
        break;
      case 'endYear':
        data.endYear = value as number | null;
        break;
      case 'isCurrent':
        data.isCurrent = value as boolean;
        if (data.isCurrent) {
          data.endMonth = null;
          data.endYear = null;
        }
        break;
      default:
        break;
    }

    onChange(data);
  };

  return (
    <div className="border rounded-md p-4 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
        <span className="text-sm font-medium text-gray-700 w-24">Startdatum</span>
        <select
          value={startMonth ?? ''}
          onChange={(e) =>
            updateField(
              'startMonth',
              e.target.value ? parseInt(e.target.value, 10) : null,
            )
          }
          className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
          style={{ borderColor: '#F29400', '--tw-ring-color': '#F29400' } as React.CSSProperties}
        >
          <option value="">Monat</option>
          {months.map((m, idx) => {
            const num = String(idx + 1).padStart(2, '0');
            return (
              <option key={idx + 1} value={idx + 1}>
                {num} - {m}
              </option>
            );
          })}
        </select>
        <select
          value={startYear ?? ''}
          onChange={(e) =>
            updateField(
              'startYear',
              e.target.value ? parseInt(e.target.value, 10) : null,
            )
          }
          className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
          style={{ borderColor: '#F29400', '--tw-ring-color': '#F29400' } as React.CSSProperties}
        >
          <option value="">Jahr</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
        <span className="text-sm font-medium text-gray-700 w-24">Enddatum</span>
        <select
          value={endMonth ?? ''}
          onChange={(e) =>
            updateField(
              'endMonth',
              e.target.value ? parseInt(e.target.value, 10) : null,
            )
          }
          disabled={isCurrent}
          className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 disabled:opacity-50"
          style={{ borderColor: '#F29400', '--tw-ring-color': '#F29400' } as React.CSSProperties}
        >
          <option value="">Monat</option>
          {months.map((m, idx) => {
            const num = String(idx + 1).padStart(2, '0');
            return (
              <option key={idx + 1} value={idx + 1}>
                {num} - {m}
              </option>
            );
          })}
        </select>
        <select
          value={endYear ?? ''}
          onChange={(e) =>
            updateField(
              'endYear',
              e.target.value ? parseInt(e.target.value, 10) : null,
            )
          }
          disabled={isCurrent}
          className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 disabled:opacity-50"
          style={{ borderColor: '#F29400', '--tw-ring-color': '#F29400' } as React.CSSProperties}
        >
          <option value="">Jahr</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
      <label className="inline-flex items-center space-x-2">
        <input
          type="checkbox"
          checked={isCurrent}
          onChange={(e) => updateField('isCurrent', e.target.checked)}
          className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
        />
        <span className="text-sm text-gray-700">Derzeit beschäftigt</span>
      </label>
    </div>
  );
}

