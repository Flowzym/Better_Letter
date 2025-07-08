import { KIModelSettings } from "../types/KIModelSettings";
import { useState } from "react";

export default function SettingsModal({
  models,
  onSave,
}: {
  models: KIModelSettings[];
  onSave: (models: KIModelSettings[]) => void;
}) {
  const [localModels, setLocalModels] = useState(models);

  const updateModel = (
    id: string,
    field: keyof KIModelSettings,
    value: unknown
  ) => {
    const updated = localModels.map((m) =>
      m.id === id ? { ...m, [field]: value } : m
    );
    setLocalModels(updated);
  };

  return (
    <div className="space-y-4">
      {localModels.map((model) => (
        <div key={model.id} className="border p-4 rounded-md">
          <h2 className="text-lg font-semibold">{model.name}</h2>
          <label>
            API Key:
            <input
              value={model.api_key}
              onChange={(e) => updateModel(model.id, "api_key", e.target.value)}
              className="input"
            />
          </label>
          <label>
            Model:
            <input
              value={model.model}
              onChange={(e) => updateModel(model.id, "model", e.target.value)}
              className="input"
            />
          </label>
          <label>
            Temperature:
            <input
              type="number"
              step="0.01"
              value={model.temperature}
              onChange={(e) => updateModel(model.id, "temperature", parseFloat(e.target.value))}
              className="input"
            />
          </label>
          <label>
            Top_p:
            <input
              type="number"
              step="0.01"
              value={model.top_p}
              onChange={(e) => updateModel(model.id, "top_p", parseFloat(e.target.value))}
              className="input"
            />
          </label>
          <label>
            Max Tokens:
            <input
              type="number"
              value={model.max_tokens}
              onChange={(e) => updateModel(model.id, "max_tokens", parseInt(e.target.value))}
              className="input"
            />
          </label>
          <label>
            Aktiv:
            <input
              type="checkbox"
              checked={model.active}
              onChange={(e) => updateModel(model.id, "active", e.target.checked)}
            />
          </label>
        </div>
      ))}
      <button
        className="btn btn-primary mt-4"
        onClick={() => onSave(localModels)}
      >
        Speichern
      </button>
    </div>
  );
}
