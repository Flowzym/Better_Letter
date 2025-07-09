import React, { useCallback, useState } from 'react';
import { TestTube, RefreshCw } from 'lucide-react';
import { KIModelSettings } from '../types/KIModelSettings';
import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionContent,
} from './Accordion';
import EditableText from './EditableText';
import StatusDot from './StatusDot';
import SimpleInput from './SimpleInput';
import StyledButton from './StyledButton';

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
    <Accordion>
      <AccordionItem key={model.id} defaultOpen={false}>
        <AccordionHeader>
          <div className="flex items-center justify-between w-full">
            <EditableText
              value={model.name}
              onChange={(name) => handleModelField(model.id, 'name', name)}
            />
            <StatusDot active={model.active} />
          </div>
        </AccordionHeader>

        <AccordionContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <label className="space-y-1">
              <span className="text-gray-700">Modell</span>
              <select
                value={selected}
                onChange={(e) =>
                  e.target.value !== 'custom' && onModelChange(e.target.value)
                }
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                style={{
                  borderColor: '#F29400',
                  '--tw-ring-color': '#F29400',
                } as React.CSSProperties}
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
                  onChange={(e) =>
                    handleModelField(model.id, 'model', e.target.value)
                  }
                  className="w-full mt-2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                  style={{
                    borderColor: '#F29400',
                    '--tw-ring-color': '#F29400',
                  } as React.CSSProperties}
                />
              )}
            </label>

            <SimpleInput
              label="API-Key"
              value={model.api_key}
              onChange={(val) => handleModelField(model.id, 'api_key', val)}
            />

            <SimpleInput
              label="Endpoint"
              value={model.endpoint}
              onChange={(val) => handleModelField(model.id, 'endpoint', val)}
            />

            <SimpleInput
              label="Temperature"
              type="number"
              value={model.temperature}
              onChange={(val) =>
                handleModelField(model.id, 'temperature', parseFloat(val))
              }
            />

            <SimpleInput
              label="Max Tokens"
              type="number"
              value={model.max_tokens}
              onChange={(val) =>
                handleModelField(model.id, 'max_tokens', parseInt(val, 10))
              }
            />
          </div>

          <div className="flex justify-between mt-3">
            <StyledButton onClick={testModel} disabled={isTesting} className="flex items-center space-x-1 bg-purple-100 text-purple-800 hover:bg-purple-200 disabled:opacity-50">
              {isTesting ? (
                <RefreshCw className="h-3 w-3 animate-spin" />
              ) : (
                <TestTube className="h-3 w-3" />
              )}
              <span>Testen</span>
            </StyledButton>
            <StyledButton onClick={handleSetActive}>Aktivieren</StyledButton>
            <StyledButton variant="destructive" onClick={handleRemove}>🗑️</StyledButton>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export default React.memo(KIModelSettingsItem);

