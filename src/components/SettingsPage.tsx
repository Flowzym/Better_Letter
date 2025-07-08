import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Save, Check } from 'lucide-react';
import { KIModelSettings } from '../types/KIModelSettings';
import { defaultKIModels } from '../constants/kiDefaults';
import { loadKIConfigs, saveKIConfigs } from '../services/supabaseService';

export default function SettingsPage() {
  const navigate = useNavigate();
  const [models, setModels] = useState<KIModelSettings[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const fromDB = await loadKIConfigs();
      const merged = [...defaultKIModels];
      fromDB.forEach((dbModel) => {
        const idx = merged.findIndex((m) => m.id === dbModel.id);
        if (idx >= 0) {
          merged[idx] = { ...merged[idx], ...dbModel };
        } else {
          merged.push(dbModel);
        }
      });
      setModels(merged);
    };
    fetch();
  }, []);

  const updateModel = (
    id: string,
    field: keyof KIModelSettings,
    value: string | number | boolean
  ) => {
    setModels((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  const setActive = (id: string) => {
    setModels((prev) =>
      prev.map((m) => ({ ...m, active: m.id === id }))
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    await saveKIConfigs(models);
    setIsSaving(false);
    navigate(-1);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[95vh] overflow-y-auto relative p-6">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>

        <h2 className="text-2xl font-semibold mb-6">KI Einstellungen</h2>

        <div className="space-y-6">
          {models.map((model) => (
            <div
              key={model.id}
              className={`border rounded-lg p-4 space-y-4 ${
                model.active ? 'border-orange-400 bg-orange-50' : 'border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">{model.name}</h3>
                {model.active && (
                  <span className="flex items-center text-sm text-orange-600">
                    <Check className="h-4 w-4 mr-1" /> Aktiv
                  </span>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="space-y-1">
                  <span className="text-sm font-medium text-gray-700">Modell</span>
                  <input
                    type="text"
                    value={model.model}
                    onChange={(e) => updateModel(model.id, 'model', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                    style={{ borderColor: '#F29400', '--tw-ring-color': '#F29400' } as React.CSSProperties}
                  />
                </label>
                <label className="space-y-1">
                  <span className="text-sm font-medium text-gray-700">API-Key</span>
                  <input
                    type="text"
                    value={model.apiKey}
                    onChange={(e) => updateModel(model.id, 'apiKey', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                    style={{ borderColor: '#F29400', '--tw-ring-color': '#F29400' } as React.CSSProperties}
                  />
                </label>
                <label className="space-y-1">
                  <span className="text-sm font-medium text-gray-700">Endpoint</span>
                  <input
                    type="text"
                    value={model.endpoint}
                    onChange={(e) => updateModel(model.id, 'endpoint', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                    style={{ borderColor: '#F29400', '--tw-ring-color': '#F29400' } as React.CSSProperties}
                  />
                </label>
                <label className="space-y-1">
                  <span className="text-sm font-medium text-gray-700">Temperature</span>
                  <input
                    type="number"
                    min="0"
                    max="2"
                    step="0.1"
                    value={model.temperature}
                    onChange={(e) =>
                      updateModel(model.id, 'temperature', parseFloat(e.target.value))
                    }
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                    style={{ borderColor: '#F29400', '--tw-ring-color': '#F29400' } as React.CSSProperties}
                  />
                </label>
                <label className="space-y-1">
                  <span className="text-sm font-medium text-gray-700">Top-P</span>
                  <input
                    type="number"
                    min="0"
                    max="1"
                    step="0.01"
                    value={model.top_p}
                    onChange={(e) =>
                      updateModel(model.id, 'top_p', parseFloat(e.target.value))
                    }
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                    style={{ borderColor: '#F29400', '--tw-ring-color': '#F29400' } as React.CSSProperties}
                  />
                </label>
                <label className="space-y-1">
                  <span className="text-sm font-medium text-gray-700">Max Tokens</span>
                  <input
                    type="number"
                    min="1"
                    value={model.max_tokens}
                    onChange={(e) =>
                      updateModel(model.id, 'max_tokens', parseInt(e.target.value))
                    }
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                    style={{ borderColor: '#F29400', '--tw-ring-color': '#F29400' } as React.CSSProperties}
                  />
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="activeModel"
                    checked={model.active}
                    onChange={() => setActive(model.id)}
                    className="rounded border-gray-300"
                    style={{ accentColor: '#F29400' }}
                  />
                  <span className="text-sm text-gray-700">Aktivieren</span>
                </label>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-between">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            Abbrechen
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center space-x-2 px-4 py-2 text-white rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#F29400' }}
          >
            <Save className="h-4 w-4" />
            <span>Speichern</span>
          </button>
        </div>
      </div>
    </div>
  );
}
