import { useState } from 'react';
import { Database as DatabaseIcon, Plus, Trash2 } from 'lucide-react';

interface MappingRow {
  dbField: string;
  appField: string;
}

const STORAGE_KEY = 'databaseMapping';

export default function DatabaseMappingSection() {
  const loadInitial = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          tableName: parsed.tableName || '',
          isActive: parsed.isActive ?? true,
          mappings: Array.isArray(parsed.mappings) ? parsed.mappings : []
        };
      }
    } catch {
      // ignore
    }
    return { tableName: '', isActive: true, mappings: [] as MappingRow[] };
  };

  const initial = loadInitial();
  const [tableName, setTableName] = useState(initial.tableName);
  const [isActive, setIsActive] = useState<boolean>(initial.isActive);
  const [mappings, setMappings] = useState<MappingRow[]>(initial.mappings);

  const updateRow = (index: number, field: keyof MappingRow, value: string) => {
    setMappings(prev => prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)));
  };

  const addRow = () => {
    setMappings(prev => [...prev, { dbField: '', appField: '' }]);
  };

  const removeRow = (index: number) => {
    setMappings(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const data = { tableName, isActive, mappings };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (err) {
      console.error('Failed to save mapping', err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 space-y-4">
      <div className="flex items-center space-x-3">
        <DatabaseIcon className="h-6 w-6" style={{ color: '#F29400' }} />
        <h3 className="text-lg font-medium text-gray-900">Datenbank-Zuordnung</h3>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Tabellenname</label>
        <input
          type="text"
          value={tableName}
          onChange={e => setTableName(e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
          style={{ borderColor: '#F29400', '--tw-ring-color': '#F29400' } as React.CSSProperties}
        />
      </div>

      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={isActive}
          onChange={e => setIsActive(e.target.checked)}
          className="rounded border-gray-300"
          style={{ accentColor: '#F29400' }}
        />
        <span className="text-sm">Mapping aktiv</span>
      </label>

      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2 text-sm font-medium text-gray-700">
          <span>Datenbankfeld</span>
          <span>App-Feld</span>
        </div>
        {mappings.map((row, index) => (
          <div key={index} className="grid grid-cols-2 gap-2 items-center">
            <input
              type="text"
              value={row.dbField}
              onChange={e => updateRow(index, 'dbField', e.target.value)}
              className="px-2 py-1 border rounded focus:outline-none focus:ring-2"
              style={{ borderColor: '#F29400', '--tw-ring-color': '#F29400' } as React.CSSProperties}
            />
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={row.appField}
                onChange={e => updateRow(index, 'appField', e.target.value)}
                className="flex-1 px-2 py-1 border rounded focus:outline-none focus:ring-2"
                style={{ borderColor: '#F29400', '--tw-ring-color': '#F29400' } as React.CSSProperties}
              />
              <button
                onClick={() => removeRow(index)}
                className="p-1 text-red-600 hover:text-red-800"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
        <button
          onClick={addRow}
          className="flex items-center space-x-1 text-sm text-white px-3 py-1 rounded-md"
          style={{ backgroundColor: '#F29400' }}
        >
          <Plus className="h-4 w-4" />
          <span>Zeile hinzufügen</span>
        </button>
      </div>

      <div className="text-right">
        <button
          onClick={handleSave}
          className="px-4 py-2 text-white rounded-md"
          style={{ backgroundColor: '#F29400' }}
        >
          Speichern
        </button>
      </div>
    </div>
  );
}
