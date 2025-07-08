import React, { useState, useCallback } from 'react';
import { Check, ChevronDown } from 'lucide-react';
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
  'mistral-medium': 'https://api.mistral.ai/v1/chat/completions',
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
  const [isOpen, setIsOpen] = useState(model.active);

  const toggleOpen = useCallback(() => {
    setIsOpen((o) => !o);
  }, []);

  const onModelChange = useCallback(
    (selected: string) => {
      handleModelSelection(model.id, selected);
      if (selected === 'mistral-medium') {
        handleModelField(
          model.id,
          'endpoint',
          'https://api.openrouter.ai/v1/chat/completions'
        );
      } else if (ENDPOINT_MAP[selected]) {
        handleModelField(model.id, 'endpoint', ENDPOINT_MAP[selected]);
      }
    },
    [handleModelSelection, handleModelField, model.id]
  );

  const selected = MODEL_OPTIONS.includes(model.model) ? model.model : 'custom';

  return (
    <details
      open={isOpen}
      onToggle={toggleOpen}
      className={`group border rounded-lg p-4 shadow-sm ${
        model.active ? 'border-orange-400 bg-orange-50' : 'border-gray-200'
      }`}
    >
      <summary className="cursor-pointer flex items-center justify-between">
        <span className="text-lg font-medium">{model.name}</span>
        <div className="flex items-center space-x-2">
          {model.active && (
            <span className="flex items-center text-sm text-orange-600">
              <Check className="h-4 w-4 mr-1" /> Aktiv
            </span>
          )}
          <ChevronDown className="h-4 w-4 group-open:rotate-180 transition-transform" />
        </div>
      </summary>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="space-y-1">
          <span className="text-sm font-medium text-gray-700">Modell</span>
          <select
            value={selected}
            onChange={(e) => {
              if (e.target.value === 'custom') return;
              onModelChange(e.target.value);
            }}
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
          <span className="text-sm font-medium text-gray-700">API-Key</span>
          <input
            type="text"
            value={model.apiKey}
            onChange={(e) => handleModelField(model.id, 'apiKey', e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
            style={{ borderColor: '#F29400', '--tw-ring-color': '#F29400' } as React.CSSProperties}
          />
        </label>
        <label className="space-y-1">
          <span className="text-sm font-medium text-gray-700">Endpoint</span>
          <input
            type="text"
            value={model.endpoint}
            onChange={(e) => handleModelField(model.id, 'endpoint', e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
            style={{ borderColor: '#F29400', '--tw-ring-color': '#F29400' } as React.CSSProperties}
          />
        </label>
        <label className="space-y-1">
          <span className="text-sm font-medium text-gray-700">Temperature</span>
          <input
            type="number"
            min={0}
            max={2}
            step={0.1}
            value={model.temperature}
            onChange={(e) =>
              handleModelField(model.id, 'temperature', parseFloat(e.target.value))
            }
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
            style={{ borderColor: '#F29400', '--tw-ring-color': '#F29400' } as React.CSSProperties}
          />
        </label>
        <label className="space-y-1">
          <span className="text-sm font-medium text-gray-700">Top-P</span>
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
          <span className="text-sm font-medium text-gray-700">Max Tokens</span>
          <input
            type="number"
            min={1}
            value={model.max_tokens}
            onChange={(e) =>
              handleModelField(model.id, 'max_tokens', parseInt(e.target.value, 10))
            }
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
            style={{ borderColor: '#F29400', '--tw-ring-color': '#F29400' } as React.CSSProperties}
          />
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            name={`activeModel-${index}`}
            checked={model.active}
            onChange={() => setActiveModel(model.id)}
            className="rounded border-gray-300"
            style={{ accentColor: '#F29400' }}
          />
          <span className="text-sm text-gray-700">Aktivieren</span>
        </label>
        <button
          onClick={() => removeModel(model.id)}
          className="text-sm text-red-600 hover:underline md:col-span-2 text-left"
        >
          Entfernen
        </button>
      </div>
    </details>
  );
}

export default React.memo(KIModelSettingsItem);
