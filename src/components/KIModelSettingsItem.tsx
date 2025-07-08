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

function KIModelSettingsItem({
  model,
  index,
  handleModelField,
  handleModelSelection,
  setActiveModel,
  removeModel
}: KIModelSettingsItemProps) {
  const [testState, setTestState] = useState<'untested' | 'success' | 'error'>('untested');
  const [isTesting, setIsTesting] = useState(false);

  const onModelChange = useCallback(
    (selected: string) => {
      handleModelSelection(model.id, selected);
      if (ENDPOINT_MAP[selected]) {
        handleModelField(model.id, 'endpoint', ENDPOINT_MAP[selected]);
      }
    },
    [handleModelField, handleModelSelection, model.id]
  );

  const handleRemove = useCallback(() => removeModel(model.id), [removeModel, model.id]);

  const handleSetActive = useCallback(() => setActiveModel(model.id), [setActiveModel, model.id]);

  const selected = MODEL_OPTIONS.includes(model.model) ? model.model : 'custom';

  const testModel = useCallback(async () => {
    setIsTesting(true);
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

      if (res.ok) {
        setTestState('success');
      } else {
        setTestState('error');
      }
    } catch {
      setTestState('error');
    } finally {
      setIsTesting(false);
    }
  }, [model]);

  const statusColor =
    testState === 'success'
      ? 'bg-green-500'
      : testState === 'error'
      ? 'bg-red-500'
      : 'bg-yellow-500';

  return (
    <div data-index={index} className="relative">
      <button
        onClick={handleRemove}
        className="absolute top-2 right-2 p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
        title="Entfernen"
      >
        <Trash2 className="h-4 w-4" />
      </button>

      <details
        className={`border rounded-lg shadow-sm ${model.active ? 'border-orange-400 bg-orange-50' : 'border-gray-200'}`}
        open
      >
        <summary
          onClick={handleSetActive}
          className="flex items-center justify-between p-4 pr-8 cursor-pointer list-none"
        >
          <div className="flex items-center space-x-2">
            <span className={`w-3 h-3 rounded-full ${statusColor}`}></span>
            <span className="text-lg font-medium">{model.name}</span>
            {model.active && (
              <span
                className="ml-2 px-2 py-0.5 text-xs text-white rounded"
                style={{ backgroundColor: '#F29400' }}
              >
                Aktiv
              </span>
            )}
          </div>
        </summary>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 pt-0 text-sm">
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

        <div className="px-4 pb-4">
          <button
            onClick={testModel}
            disabled={isTesting}
            className="flex items-center space-x-1 px-3 py-1 bg-purple-100 text-purple-800 hover:bg-purple-200 rounded-md text-xs disabled:opacity-50"
          >
            {isTesting ? (
              <RefreshCw className="h-3 w-3 animate-spin" />
            ) : (
              <TestTube className="h-3 w-3" />
            )}
            <span>Testen</span>
          </button>
        </div>
      </details>
    </div>
  );
}

export default React.memo(KIModelSettingsItem);

