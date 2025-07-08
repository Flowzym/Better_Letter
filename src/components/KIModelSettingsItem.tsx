import React, { useCallback, useState } from 'react';
import { Trash2, TestTube, RefreshCw } from 'lucide-react';
import { KIModelSettings } from '../types/KIModelSettings';

interface KIModelSettingsItemProps {
  model: KIModelSettings;
  index: number;
  handleModelField: (
    id: string,
    field: keyof KIModelSettings,
    value: string | number | boolean
  ) => void;
  handleModelSelection: (id: string, modelName: string) => void;
  setActiveModel: (id: string) => void;
  removeModel: (id: string) => void;
}

const MODEL_OPTIONS = [
  'mistral-7b-instruct',
  'mistral-tiny',
  'mistral-small',
  'mistral-medium',
  'mistral-large',
  'mixtral-8x7b',
  'openrouter/mixtral',
  'gpt-3.5-turbo',
  'gpt-4',
  'claude-3-opus'
];

const ENDPOINT_MAP: Record<string, string> = {
  'mistral-7b-instruct': 'https://api.mistral.ai/v1/chat/completions',
  'mistral-tiny': 'https://api.mistral.ai/v1/chat/completions',
  'mistral-small': 'https://api.mistral.ai/v1/chat/completions',
  'mistral-medium': 'https://api.openrouter.ai/v1/chat/completions',
  'mistral-large': 'https://api.mistral.ai/v1/chat/completions',
  'mixtral-8x7b': 'https://api.mistral.ai/v1/chat/completions',
  'openrouter/mixtral': 'https://openrouter.ai/api/v1/chat/completions',
  'gpt-3.5-turbo': 'https://api.openai.com/v1/chat/completions',
  'gpt-4': 'https://api.openai.com/v1/chat/completions',
  'claude-3-opus': 'https://api.anthropic.com/v1/messages'
};

export default function KIModelSettingsItem({
  model,
  index,
  handleModelField,
  handleModelSelection,
  setActiveModel,
  removeModel
}: KIModelSettingsItemProps) {
  const [testState, setTestState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const onModelChange = useCallback(
    (selected: string) => {
      handleModelSelection(model.id, selected);
      if (ENDPOINT_MAP[selected]) {
        handleModelField(model.id, 'endpoint', ENDPOINT_MAP[selected]);
      }
    },
    [handleModelField, handleModelSelection, model.id]
  );

  const selected = MODEL_OPTIONS.includes(model.model) ? model.model : 'custom';

  const testModel = useCallback(async () => {
    setTestState('loading');
    try {
      const res = await fetch(model.endpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${model.api_key}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: model.model,
          messages: [{ role: 'user', content: 'Test' }]
        })
      });
      if (!res.ok) throw new Error('Request failed');
      setTestState('success');
    } catch {
      setTestState('error');
    }
  }, [model]);

  const statusSymbol = testState === 'success' ? '🟢' : testState === 'error' ? '🔴' : '⚪';

  return (
    <div
      data-index={index}
      className={`relative border rounded-lg p-4 shadow-sm ${
        model.active ? 'border-orange-400 bg-orange-50' : 'border-gray-200'
      }`}
    >
      <button
        onClick={() => removeModel(model.id)}
        className="absolute top-2 right-2 p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
        title="Entfernen"
      >
        <Trash2 className="h-4 w-4" />
      </button>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-medium">{model.name}</h3>
          <span>{statusSymbol}</span>
        </div>
        {model.active ? (
          <span className="text-sm text-orange-600 font-medium">Aktives Modell</span>
        ) : (
          <button
            onClick={() => setActiveModel(model.id)}
            className="text-sm text-orange-600 hover:underline"
          >
            Aktivieren
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 text-sm">
        <label className="space-y-1">
          <span className="text-gray-700">Modell</span>
          <select
            value={selected}
            onChange={(e) => e.target.value !== 'custom' && onModelChange(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
            style={{ borderColor: '#F29400', '--tw-ring-color': '#F29400' } as React.CSSProperties}
          >
            {MODEL_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
            <option value="custom">Benutzerdefiniert…</option>
          </select>
          {selected === 'custom' && (
            <input
              type="text"
              value={model.model}
              onChange={(e) => handleModelField(model.id, 'model', e.target.value)}
              className="w-full mt-2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
              style={{ borderColor: '#F29400', '--tw-ring-color': '#F29400' } as React.CSSProperties}
            />
          )}
        </label>
        <label className="space-y-1">
          <span className="text-gray-700">API-Key</span>
          <input
            type="text"
            value={model.api_key}
            onChange={(e) => handleModelField(model.id, 'api_key', e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
            style={{ borderColor: '#F29400', '--tw-ring-color': '#F29400' } as React.CSSProperties}
          />
        </label>
        <label className="space-y-1">
          <span className="text-gray-700">Endpoint</span>
          <input
            type="text"
            value={model.endpoint}
            onChange={(e) => handleModelField(model.id, 'endpoint', e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
            style={{ borderColor: '#F29400', '--tw-ring-color': '#F29400' } as React.CSSProperties}
          />
        </label>
        <label className="space-y-1">
          <span className="text-gray-700">Temperature</span>
          <input
            type="number"
            min={0}
            max={2}
            step={0.1}
            value={model.temperature}
            onChange={(e) => handleModelField(model.id, 'temperature', parseFloat(e.target.value))}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
            style={{ borderColor: '#F29400', '--tw-ring-color': '#F29400' } as React.CSSProperties}
          />
        </label>
        <label className="space-y-1">
          <span className="text-gray-700">Top-P</span>
          <input
            type="number"
            min={0}
            max={1}
            step={0.01}
            value={model.top_p}
            onChange={(e) => handleModelField(model.id, 'top_p', parseFloat(e.target.value))}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
            style={{ borderColor: '#F29400', '--tw-ring-color': '#F29400' } as React.CSSProperties}
          />
        </label>
        <label className="space-y-1">
          <span className="text-gray-700">Max Tokens</span>
          <input
            type="number"
            min={1}
            value={model.max_tokens}
            onChange={(e) => handleModelField(model.id, 'max_tokens', parseInt(e.target.value, 10))}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
            style={{ borderColor: '#F29400', '--tw-ring-color': '#F29400' } as React.CSSProperties}
          />
        </label>
      </div>

      <div className="mt-4">
        <button
          onClick={testModel}
          disabled={testState === 'loading'}
          className="flex items-center space-x-1 px-3 py-1 bg-purple-100 text-purple-800 hover:bg-purple-200 rounded-md text-xs disabled:opacity-50"
        >
          {testState === 'loading' ? (
            <RefreshCw className="h-3 w-3 animate-spin" />
          ) : (
            <TestTube className="h-3 w-3" />
          )}
          <span>Testen</span>
        </button>
      </div>
    </div>
  );
}
