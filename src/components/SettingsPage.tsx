import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Settings as SettingsIcon,
  Brain,
  FileText,
  Database as DatabaseIcon,
  Download,
  Upload,
  SlidersHorizontal,
  X,
  Save,
  Check,
  ChevronDown
} from 'lucide-react';
import SettingsModal from './SettingsModal';
import TemplateManagerModal, { Template } from './TemplateManagerModal';
import ProfileSourceSettings from './ProfileSourceSettings';
import DatabaseStatus from './DatabaseStatus';
import DatabaseMappingSection from './DatabaseMappingSection';
import { KIModelSettings } from '../types/KIModelSettings';
import { defaultKIModels } from '../constants/kiDefaults';
import {
  loadKIConfigs,
  saveKIConfigs,
  ProfileSourceMapping,
  testSupabaseConnection
} from '../services/supabaseService';

// Tabs handled in this page
type Tab = 'general' | 'ai' | 'prompts' | 'database' | 'templates' | 'import';

interface PromptConfig {
  label: string;
  prompt: string;
  title?: string;
  role?: string;
  style?: string;
  examples?: string;
}

interface PromptState {
  documents: Record<string, PromptConfig>;
  edits: Record<string, PromptConfig>;
  styles: Record<string, PromptConfig>;
}

export default function SettingsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('ai');
  const modelOptions = [
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

  const endpointMap: Record<string, string> = {
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
  const [models, setModels] = useState<KIModelSettings[]>([]);
  const [openModels, setOpenModels] = useState<string[]>([]);
  const [showModelModal, setShowModelModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [connStatus, setConnStatus] = useState<'idle' | 'success' | 'error' | 'loading'>('idle');
  const [prompts, setPrompts] = useState<PromptState>({
    documents: {},
    edits: {},
    styles: {}
  });
  const [autoloadPrompts, setAutoloadPrompts] = useState(
    () => localStorage.getItem('autoloadPrompts') === 'true'
  );
  const [defaultStyle, setDefaultStyle] = useState(
    () => localStorage.getItem('defaultStyle') || ''
  );
  const [templates, setTemplates] = useState<Template[]>(() => {
    try {
      const saved = localStorage.getItem('templates');
      return saved ? (JSON.parse(saved) as Template[]) : [];
    } catch {
      return [];
    }
  });
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [profileSourceMappings, setProfileSourceMappings] = useState<ProfileSourceMapping[]>(() => {
    try {
      const saved = localStorage.getItem('profileSourceMappings');
      return saved ? (JSON.parse(saved) as ProfileSourceMapping[]) : [];
    } catch {
      return [];
    }
  });

  // Load KI models and prompt settings on mount
  useEffect(() => {
    const fetchModels = async () => {
      const fromDB = await loadKIConfigs();
      const merged = [...defaultKIModels];
      fromDB.forEach((m) => {
        const idx = merged.findIndex((d) => d.id === m.id);
        if (idx >= 0) merged[idx] = { ...merged[idx], ...m };
        else merged.push(m);
      });
      setModels(merged);
      setOpenModels(merged.filter((m) => m.active).map((m) => m.id));
    };

    const loadPrompts = (key: string) => {
      try {
        const saved = localStorage.getItem(key);
        return saved ? (JSON.parse(saved) as Record<string, PromptConfig>) : {};
      } catch {
        return {};
      }
    };

    fetchModels();
    setPrompts({
      documents: loadPrompts('documentTypes'),
      edits: loadPrompts('editPrompts'),
      styles: loadPrompts('stylePrompts')
    });
  }, []);

  // Helpers for model and prompt manipulation
  const handleModelField = (
    id: string,
    field: keyof KIModelSettings,
    value: string | number | boolean
  ) => {
    setModels((prev) => prev.map((m) => (m.id === id ? { ...m, [field]: value } : m)));
  };

  const handleModelSelection = (id: string, modelName: string) => {
    setModels((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, model: modelName, endpoint: endpointMap[modelName] ?? m.endpoint }
          : m
      )
    );
  };

  const setActiveModel = (id: string) => {
    setModels((prev) => prev.map((m) => ({ ...m, active: m.id === id })));
    setOpenModels((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const addModel = () => {
    const newModel: KIModelSettings = {
      id: `model_${Date.now()}`,
      name: 'Neues Modell',
      apiKey: '',
      endpoint: endpointMap['mistral-7b-instruct'],
      model: 'mistral-7b-instruct',
      temperature: 0.7,
      top_p: 0.95,
      max_tokens: 1024,
      active: false
    };
    setModels((prev) => [...prev, newModel]);
    setOpenModels((prev) => [...prev, newModel.id]);
  };

  const removeModel = (id: string) => {
    setModels((prev) => prev.filter((m) => m.id !== id));
  };

  const updatePrompt = (
    category: keyof PromptState,
    key: string,
    field: keyof PromptConfig,
    value: string
  ) => {
    setPrompts((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: { ...prev[category][key], [field]: value }
      }
    }));
  };

  const addPrompt = (category: keyof PromptState) => {
    const key = `prompt_${Date.now()}`;
    setPrompts((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]:
          category === 'documents'
            ? { label: '', prompt: '', title: '', role: '', style: '', examples: '' }
            : { label: '', prompt: '' }
      }
    }));
  };

  const removePrompt = (category: keyof PromptState, key: string) => {
    setPrompts((prev) => {
      const newCat = { ...prev[category] };
      delete newCat[key];
      return { ...prev, [category]: newCat };
    });
  };

  useEffect(() => {
    localStorage.setItem('templates', JSON.stringify(templates));
  }, [templates]);

  useEffect(() => {
    localStorage.setItem('profileSourceMappings', JSON.stringify(profileSourceMappings));
  }, [profileSourceMappings]);

  const handleSave = async () => {
    setIsSaving(true);
    await saveKIConfigs(models);
    localStorage.setItem('documentTypes', JSON.stringify(prompts.documents));
    localStorage.setItem('editPrompts', JSON.stringify(prompts.edits));
    localStorage.setItem('stylePrompts', JSON.stringify(prompts.styles));
    localStorage.setItem('autoloadPrompts', JSON.stringify(autoloadPrompts));
    localStorage.setItem('defaultStyle', defaultStyle);
    localStorage.setItem('templates', JSON.stringify(templates));
    localStorage.setItem('profileSourceMappings', JSON.stringify(profileSourceMappings));
    setIsSaving(false);
    navigate(-1);
  };

  const handleTestSupabase = async () => {
    setConnStatus('loading');
    const ok = await testSupabaseConnection();
    setConnStatus(ok ? 'success' : 'error');
  };

  const handleExport = () => {
    const dbMapping = localStorage.getItem('databaseMapping');
    const data = {
      models,
      prompts,
      templates,
      profileSourceMappings,
      autoloadPrompts,
      defaultStyle,
      databaseMapping: dbMapping ? JSON.parse(dbMapping) : null
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'settings.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const content = await file.text();
      const data = JSON.parse(content);
      if (!data.models || !data.prompts) {
        throw new Error('Ungültiges Einstellungsformat');
      }
      setModels(data.models);
      setPrompts(data.prompts);
      if (Array.isArray(data.templates)) setTemplates(data.templates);
      if (Array.isArray(data.profileSourceMappings))
        setProfileSourceMappings(data.profileSourceMappings);
      if (typeof data.autoloadPrompts === 'boolean') setAutoloadPrompts(data.autoloadPrompts);
      if (data.defaultStyle) setDefaultStyle(data.defaultStyle);
      if (data.databaseMapping) {
        localStorage.setItem('databaseMapping', JSON.stringify(data.databaseMapping));
      }
    } catch (err) {
      console.error('Failed to import settings', err);
    }
    e.target.value = '';
  };

  const tabs = [
    { id: 'general', label: 'Allgemein', icon: SlidersHorizontal },
    { id: 'ai', label: 'KI-Einstellungen', icon: Brain },
    { id: 'prompts', label: 'Prompt-Vorlagen', icon: FileText },
    { id: 'database', label: 'Datenbank', icon: DatabaseIcon },
    { id: 'templates', label: 'Template-Manager', icon: FileText },
    { id: 'import', label: 'Import/Export', icon: Download }
  ] as const;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[95vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <SettingsIcon className="h-6 w-6" style={{ color: '#F29400' }} />
            <h2 className="text-xl font-semibold">Einstellungen</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleTestSupabase}
              disabled={connStatus === 'loading'}
              className={`px-3 py-2 text-white rounded-md text-sm ${
                connStatus === 'success'
                  ? 'bg-green-600'
                  : connStatus === 'error'
                  ? 'bg-red-600'
                  : 'bg-blue-600'
              }`}
            >
              {connStatus === 'success'
                ? 'Verbindung erfolgreich'
                : connStatus === 'error'
                ? 'Verbindung fehlgeschlagen'
                : 'Supabase testen'}
            </button>
            <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-gray-600">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <aside className="w-56 border-r border-gray-200 flex-shrink-0 overflow-y-auto">
            <nav className="p-4 space-y-2">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as Tab)}
                  className={`flex items-center w-full px-3 py-2 rounded-md text-sm text-left ${
                    activeTab === id ? 'bg-orange-100 text-orange-700' : 'hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {label}
                </button>
              ))}
            </nav>
          </aside>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {activeTab === 'general' && (
              <div className="space-y-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={autoloadPrompts}
                    onChange={(e) => setAutoloadPrompts(e.target.checked)}
                    className="rounded border-gray-300"
                    style={{ accentColor: '#F29400' }}
                  />
                  <span className="text-sm">Prompts beim Start automatisch laden</span>
                </label>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Standard-Stil</label>
                  <select
                    value={defaultStyle}
                    onChange={(e) => setDefaultStyle(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                    style={{ borderColor: '#F29400', '--tw-ring-color': '#F29400' } as React.CSSProperties}
                  >
                    <option value="">Keiner</option>
                    {Object.entries(prompts.styles).map(([key, p]) => (
                      <option key={key} value={key}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {activeTab === 'ai' && (
              <div className="space-y-6">
                <div className="flex justify-between">
                  <button
                    onClick={addModel}
                    className="px-3 py-2 text-sm text-white rounded-md"
                    style={{ backgroundColor: '#F29400' }}
                  >
                    Modell hinzufügen
                  </button>
                  <button
                    onClick={() => setShowModelModal(true)}
                    className="px-3 py-2 text-sm text-white rounded-md"
                    style={{ backgroundColor: '#F29400' }}
                  >
                    Modelle im Modal bearbeiten
                  </button>
                </div>
                <div className="space-y-4">
                  {[...models]
                    .sort((a, b) => (a.active === b.active ? 0 : a.active ? -1 : 1))
                    .map((model) => {
                      const selected = modelOptions.includes(model.model) ? model.model : 'custom';
                      const isOpen = openModels.includes(model.id);
                      return (
                        <details
                          key={model.id}
                          open={isOpen}
                          onToggle={() =>
                            setOpenModels((prev) =>
                              prev.includes(model.id)
                                ? prev.filter((id) => id !== model.id)
                                : [...prev, model.id]
                            )
                          }
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
                                handleModelSelection(model.id, e.target.value);
                              }}
                              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                              style={{ borderColor: '#F29400', '--tw-ring-color': '#F29400' } as React.CSSProperties}
                            >
                              {modelOptions.map((opt) => (
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
                              min="0"
                              max="2"
                              step="0.1"
                              value={model.temperature}
                              onChange={(e) => handleModelField(model.id, 'temperature', parseFloat(e.target.value))}
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
                              onChange={(e) => handleModelField(model.id, 'top_p', parseFloat(e.target.value))}
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
                              onChange={(e) => handleModelField(model.id, 'max_tokens', parseInt(e.target.value))}
                              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                              style={{ borderColor: '#F29400', '--tw-ring-color': '#F29400' } as React.CSSProperties}
                            />
                          </label>
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="activeModel"
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
                  })}
                </div>
              </div>
            )}

            {activeTab === 'prompts' && (
              <div className="space-y-8">
                {(['documents', 'edits', 'styles'] as (keyof PromptState)[]).map((cat) => (
                  <div key={cat} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">
                        {cat === 'documents'
                          ? 'Dokumenttypen'
                          : cat === 'edits'
                          ? 'Edit-Prompts'
                          : 'Stil-Prompts'}
                      </h3>
                      <button
                        onClick={() => addPrompt(cat)}
                        className="px-3 py-1 text-sm text-white rounded-md"
                        style={{ backgroundColor: '#F29400' }}
                      >
                        Neu
                      </button>
                    </div>
                    <div className="space-y-3">
                      {Object.entries(prompts[cat]).map(([key, p]) => (
                        <div key={key} className="border rounded-lg p-4 space-y-2 bg-gray-50">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <label className="space-y-1">
                              <span className="text-sm font-medium text-gray-700">Label</span>
                              <input
                                type="text"
                                value={p.label}
                                onChange={(e) => updatePrompt(cat, key, 'label', e.target.value)}
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                                style={{ borderColor: '#F29400', '--tw-ring-color': '#F29400' } as React.CSSProperties}
                              />
                            </label>
                            <label className="space-y-1">
                              <span className="text-sm font-medium text-gray-700">Prompt</span>
                              <textarea
                                value={p.prompt}
                                onChange={(e) => updatePrompt(cat, key, 'prompt', e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                                style={{ borderColor: '#F29400', '--tw-ring-color': '#F29400' } as React.CSSProperties}
                              />
                            </label>
                            {cat === 'documents' && (
                              <>
                                <label className="space-y-1">
                                  <span className="text-sm font-medium text-gray-700">Titel</span>
                                  <input
                                    type="text"
                                    value={p.title || ''}
                                    onChange={(e) => updatePrompt(cat, key, 'title', e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                                    style={{ borderColor: '#F29400', '--tw-ring-color': '#F29400' } as React.CSSProperties}
                                  />
                                </label>
                                <label className="space-y-1">
                                  <span className="text-sm font-medium text-gray-700">Rolle</span>
                                  <input
                                    type="text"
                                    value={p.role || ''}
                                    onChange={(e) => updatePrompt(cat, key, 'role', e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                                    style={{ borderColor: '#F29400', '--tw-ring-color': '#F29400' } as React.CSSProperties}
                                  />
                                </label>
                                <label className="space-y-1">
                                  <span className="text-sm font-medium text-gray-700">Stil</span>
                                  <input
                                    type="text"
                                    value={p.style || ''}
                                    onChange={(e) => updatePrompt(cat, key, 'style', e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                                    style={{ borderColor: '#F29400', '--tw-ring-color': '#F29400' } as React.CSSProperties}
                                  />
                                </label>
                                <label className="space-y-1 md:col-span-2">
                                  <span className="text-sm font-medium text-gray-700">Beispiele</span>
                                  <textarea
                                    value={p.examples || ''}
                                    onChange={(e) => updatePrompt(cat, key, 'examples', e.target.value)}
                                    rows={2}
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                                    style={{ borderColor: '#F29400', '--tw-ring-color': '#F29400' } as React.CSSProperties}
                                  />
                                </label>
                              </>
                            )}
                          </div>
                          <div className="text-right">
                            <button
                              onClick={() => removePrompt(cat, key)}
                              className="text-sm text-red-600 hover:underline"
                            >
                              Löschen
                            </button>
                          </div>
                        </div>
                      ))}
                      {Object.keys(prompts[cat]).length === 0 && (
                        <p className="text-sm text-gray-500">Keine Einträge</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'import' && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleExport}
                    className="flex items-center space-x-2 px-4 py-2 text-white rounded-md"
                    style={{ backgroundColor: '#F29400' }}
                  >
                    <Download className="h-4 w-4" />
                    <span>Exportieren</span>
                  </button>
                  <label className="flex items-center space-x-2 px-4 py-2 text-white rounded-md cursor-pointer" style={{ backgroundColor: '#F29400' }}>
                    <Upload className="h-4 w-4" />
                    <span>Importieren</span>
                    <input type="file" accept=".json" onChange={handleImport} className="hidden" />
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'database' && (
              <div className="space-y-6">
                <DatabaseStatus />
                <ProfileSourceSettings
                  sourceMappings={profileSourceMappings}
                  onSourceMappingsChange={setProfileSourceMappings}
                />
                <DatabaseMappingSection />
              </div>
            )}

            {activeTab === 'templates' && (
              <div className="space-y-4">
                <button
                  onClick={() => setShowTemplateModal(true)}
                  className="px-4 py-2 text-white rounded-md"
                  style={{ backgroundColor: '#F29400' }}
                >
                  Vorlagen verwalten
                </button>
                <ul className="list-disc pl-5 text-sm">
                  {templates.map((t) => (
                    <li key={t.id}>{t.name}</li>
                  ))}
                  {templates.length === 0 && <li>Keine Vorlagen</li>}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-2 p-6 border-t border-gray-200">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            Abbrechen
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center space-x-2 px-4 py-2 text-white rounded-md disabled:opacity-50"
            style={{ backgroundColor: '#F29400' }}
          >
            <Save className="h-4 w-4" />
            <span>Speichern</span>
          </button>
        </div>
      </div>

      {showModelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[95vh] overflow-y-auto p-6">
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-semibold">KI Modelle bearbeiten</h3>
              <button onClick={() => setShowModelModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <SettingsModal
              models={models}
              onSave={(updated) => {
                setModels(updated);
                setShowModelModal(false);
              }}
            />
          </div>
        </div>
      )}

      {showTemplateModal && (
        <TemplateManagerModal
          isOpen={showTemplateModal}
          onClose={() => setShowTemplateModal(false)}
          onInsertTemplate={() => {}}
          templates={templates}
          onTemplatesChange={setTemplates}
        />
      )}
    </div>
  );
}
