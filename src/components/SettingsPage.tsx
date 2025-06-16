import React, { useState, useEffect, useCallback } from 'react';
import { 
  Settings, 
  X, 
  FileText, 
  Palette, 
  Edit3, 
  User, 
  Database, 
  Brain, 
  Save, 
  Plus, 
  Trash2, 
  Download, 
  Upload,
  AlertCircle,
  Check,
  RefreshCw,
  Key,
  Globe,
  Zap,
  Code,
  Server,
  Eye,
  EyeOff,
  RotateCcw,
  Archive,
  CheckSquare,
  Square
} from 'lucide-react';
import ProfileSourceSettings from './ProfileSourceSettings';
import DatabaseStatus from './DatabaseStatus';
import { ProfileSourceMapping } from '../services/supabaseService';

interface SettingsPageProps {
  isOpen: boolean;
  onClose: () => void;
  documentTypes: any;
  onDocumentTypesChange: (types: any) => void;
  editPrompts: any;
  onEditPromptsChange: (prompts: any) => void;
  stylePrompts: any;
  onStylePromptsChange: (prompts: any) => void;
  profileSourceMappings: ProfileSourceMapping[];
  onProfileSourceMappingsChange: (mappings: ProfileSourceMapping[]) => void;
}

type TabType = 'document-types' | 'style-prompts' | 'edit-prompts' | 'profile-config' | 'data-sources' | 'database' | 'ai-config' | 'backup';

interface AIModel {
  id: string;
  name: string;
  provider: 'mistral' | 'openai' | 'anthropic' | 'local' | 'custom';
  endpoint?: string;
  apiKey?: string;
  isActive: boolean;
  maxTokens: number;
  temperature: number;
  description?: string;
}

interface ExportOptions {
  documentTypes: boolean;
  stylePrompts: boolean;
  editPrompts: boolean;
  aiModels: boolean;
  profileSourceMappings: boolean;
  editorSettings: boolean;
  savedProfiles: boolean;
}

export default function SettingsPage({
  isOpen,
  onClose,
  documentTypes,
  onDocumentTypesChange,
  editPrompts,
  onEditPromptsChange,
  stylePrompts,
  onStylePromptsChange,
  profileSourceMappings,
  onProfileSourceMappingsChange
}: SettingsPageProps) {
  const [activeTab, setActiveTab] = useState<TabType>('document-types');
  const [aiModels, setAiModels] = useState<AIModel[]>([]);
  const [currentModel, setCurrentModel] = useState<string>('mistral-large-latest');
  const [showNewPromptForm, setShowNewPromptForm] = useState<string | null>(null);
  const [newPrompt, setNewPrompt] = useState({ key: '', label: '', prompt: '', visible: true });
  const [editingPrompt, setEditingPrompt] = useState<{ type: string; key: string; data: any } | null>(null);
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    documentTypes: true,
    stylePrompts: true,
    editPrompts: true,
    aiModels: true,
    profileSourceMappings: true,
    editorSettings: true,
    savedProfiles: true
  });
  const [importError, setImportError] = useState<string>('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [showNewModelForm, setShowNewModelForm] = useState(false);
  const [newModel, setNewModel] = useState<Partial<AIModel>>({
    name: '',
    provider: 'custom',
    endpoint: '',
    apiKey: '',
    maxTokens: 1500,
    temperature: 0.7,
    description: ''
  });

  // ✅ KORRIGIERT: Load AI models and settings
  useEffect(() => {
    loadAIModels();
    loadCurrentModel();
  }, []); // ✅ KORRIGIERT: Leeres Dependency-Array für Mount-only

  const loadAIModels = useCallback(() => {
    try {
      const saved = localStorage.getItem('aiModels');
      if (saved) {
        setAiModels(JSON.parse(saved));
      } else {
        // Default models
        const defaultModels: AIModel[] = [
          {
            id: 'mistral-large-latest',
            name: 'Mistral Large (Latest)',
            provider: 'mistral',
            isActive: true,
            maxTokens: 1500,
            temperature: 0.7,
            description: 'Aktuelles Mistral Large Modell - empfohlen für beste Ergebnisse'
          },
          {
            id: 'mistral-medium-latest',
            name: 'Mistral Medium (Latest)',
            provider: 'mistral',
            isActive: false,
            maxTokens: 1500,
            temperature: 0.7,
            description: 'Mittleres Mistral Modell - gute Balance zwischen Qualität und Geschwindigkeit'
          },
          {
            id: 'gpt-4',
            name: 'GPT-4',
            provider: 'openai',
            isActive: false,
            maxTokens: 1500,
            temperature: 0.7,
            description: 'OpenAI GPT-4 - benötigt API-Schlüssel'
          }
        ];
        setAiModels(defaultModels);
        localStorage.setItem('aiModels', JSON.stringify(defaultModels));
      }
    } catch (error) {
      console.error('Error loading AI models:', error);
    }
  }, []); // ✅ KORRIGIERT: useCallback

  const loadCurrentModel = useCallback(() => {
    try {
      const saved = localStorage.getItem('currentAIModel');
      if (saved) {
        setCurrentModel(saved);
      }
    } catch (error) {
      console.error('Error loading current model:', error);
    }
  }, []); // ✅ KORRIGIERT: useCallback

  const saveSettings = useCallback(async () => {
    setSaveStatus('saving');
    try {
      localStorage.setItem('documentTypes', JSON.stringify(documentTypes));
      localStorage.setItem('editPrompts', JSON.stringify(editPrompts));
      localStorage.setItem('stylePrompts', JSON.stringify(stylePrompts));
      localStorage.setItem('aiModels', JSON.stringify(aiModels));
      localStorage.setItem('currentAIModel', currentModel);
      
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  }, [documentTypes, editPrompts, stylePrompts, aiModels, currentModel]); // ✅ KORRIGIERT: useCallback mit Dependencies

  const addNewPrompt = useCallback((type: 'document' | 'edit' | 'style') => {
    if (!newPrompt.key || !newPrompt.label || !newPrompt.prompt) return;

    const newItem = {
      label: newPrompt.label,
      prompt: newPrompt.prompt,
      visible: newPrompt.visible
    };

    switch (type) {
      case 'document':
        onDocumentTypesChange({
          ...documentTypes,
          [newPrompt.key]: newItem
        });
        break;
      case 'edit':
        onEditPromptsChange({
          ...editPrompts,
          [newPrompt.key]: newItem
        });
        break;
      case 'style':
        onStylePromptsChange({
          ...stylePrompts,
          [newPrompt.key]: newItem
        });
        break;
    }

    setNewPrompt({ key: '', label: '', prompt: '', visible: true });
    setShowNewPromptForm(null);
  }, [newPrompt, documentTypes, editPrompts, stylePrompts, onDocumentTypesChange, onEditPromptsChange, onStylePromptsChange]); // ✅ KORRIGIERT: useCallback mit Dependencies

  const updatePrompt = useCallback((type: 'document' | 'edit' | 'style', key: string, updates: any) => {
    switch (type) {
      case 'document':
        onDocumentTypesChange({
          ...documentTypes,
          [key]: { ...documentTypes[key], ...updates }
        });
        break;
      case 'edit':
        onEditPromptsChange({
          ...editPrompts,
          [key]: { ...editPrompts[key], ...updates }
        });
        break;
      case 'style':
        onStylePromptsChange({
          ...stylePrompts,
          [key]: { ...stylePrompts[key], ...updates }
        });
        break;
    }
  }, [documentTypes, editPrompts, stylePrompts, onDocumentTypesChange, onEditPromptsChange, onStylePromptsChange]); // ✅ KORRIGIERT: useCallback mit Dependencies

  const deletePrompt = useCallback((type: 'document' | 'edit' | 'style', key: string) => {
    switch (type) {
      case 'document':
        const newDocTypes = { ...documentTypes };
        delete newDocTypes[key];
        onDocumentTypesChange(newDocTypes);
        break;
      case 'edit':
        const newEditPrompts = { ...editPrompts };
        delete newEditPrompts[key];
        onEditPromptsChange(newEditPrompts);
        break;
      case 'style':
        const newStylePrompts = { ...stylePrompts };
        delete newStylePrompts[key];
        onStylePromptsChange(newStylePrompts);
        break;
    }
  }, [documentTypes, editPrompts, stylePrompts, onDocumentTypesChange, onEditPromptsChange, onStylePromptsChange]); // ✅ KORRIGIERT: useCallback mit Dependencies

  const startEditingPrompt = useCallback((type: 'document' | 'edit' | 'style', key: string, data: any) => {
    setEditingPrompt({ type, key, data: { ...data } });
  }, []); // ✅ KORRIGIERT: useCallback

  const saveEditingPrompt = useCallback(() => {
    if (!editingPrompt) return;
    
    updatePrompt(editingPrompt.type as any, editingPrompt.key, editingPrompt.data);
    setEditingPrompt(null);
  }, [editingPrompt, updatePrompt]); // ✅ KORRIGIERT: useCallback mit Dependencies

  const cancelEditingPrompt = useCallback(() => {
    setEditingPrompt(null);
  }, []); // ✅ KORRIGIERT: useCallback

  const addAIModel = useCallback(() => {
    if (!newModel.name) return;

    const model: AIModel = {
      id: `custom-${Date.now()}`,
      name: newModel.name,
      provider: newModel.provider || 'custom',
      endpoint: newModel.endpoint,
      apiKey: newModel.apiKey,
      isActive: false,
      maxTokens: newModel.maxTokens || 1500,
      temperature: newModel.temperature || 0.7,
      description: newModel.description
    };
    
    setAiModels([...aiModels, model]);
    setNewModel({
      name: '',
      provider: 'custom',
      endpoint: '',
      apiKey: '',
      maxTokens: 1500,
      temperature: 0.7,
      description: ''
    });
    setShowNewModelForm(false);
  }, [newModel, aiModels]); // ✅ KORRIGIERT: useCallback mit Dependencies

  const updateAIModel = useCallback((id: string, updates: Partial<AIModel>) => {
    setAiModels(models => 
      models.map(model => 
        model.id === id ? { ...model, ...updates } : model
      )
    );
  }, []); // ✅ KORRIGIERT: useCallback

  const deleteAIModel = useCallback((id: string) => {
    setAiModels(models => models.filter(model => model.id !== id));
    if (currentModel === id) {
      const remainingModels = aiModels.filter(model => model.id !== id);
      if (remainingModels.length > 0) {
        setCurrentModel(remainingModels[0].id);
      }
    }
  }, [currentModel, aiModels]); // ✅ KORRIGIERT: useCallback mit Dependencies

  const toggleExportOption = useCallback((key: keyof ExportOptions) => {
    setExportOptions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  }, []); // ✅ KORRIGIERT: useCallback

  const exportSettings = useCallback(() => {
    const settings: any = {
      exportDate: new Date().toISOString(),
      version: '1.0'
    };

    if (exportOptions.documentTypes) settings.documentTypes = documentTypes;
    if (exportOptions.stylePrompts) settings.stylePrompts = stylePrompts;
    if (exportOptions.editPrompts) settings.editPrompts = editPrompts;
    if (exportOptions.aiModels) settings.aiModels = aiModels;
    if (exportOptions.profileSourceMappings) settings.profileSourceMappings = profileSourceMappings;
    if (exportOptions.editorSettings) {
      const editorSettings = localStorage.getItem('editorSettings');
      if (editorSettings) settings.editorSettings = JSON.parse(editorSettings);
    }
    if (exportOptions.savedProfiles) {
      const savedProfiles = localStorage.getItem('savedProfiles');
      if (savedProfiles) settings.savedProfiles = JSON.parse(savedProfiles);
    }
    
    const dataStr = JSON.stringify(settings, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bewerbungsschreiben-config-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [exportOptions, documentTypes, stylePrompts, editPrompts, aiModels, profileSourceMappings]); // ✅ KORRIGIERT: useCallback mit Dependencies

  const importSettings = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const content = await file.text();
      const settings = JSON.parse(content);
      
      if (settings.documentTypes) onDocumentTypesChange(settings.documentTypes);
      if (settings.editPrompts) onEditPromptsChange(settings.editPrompts);
      if (settings.stylePrompts) onStylePromptsChange(settings.stylePrompts);
      if (settings.aiModels) setAiModels(settings.aiModels);
      if (settings.currentModel) setCurrentModel(settings.currentModel);
      if (settings.profileSourceMappings) onProfileSourceMappingsChange(settings.profileSourceMappings);
      if (settings.editorSettings) localStorage.setItem('editorSettings', JSON.stringify(settings.editorSettings));
      if (settings.savedProfiles) localStorage.setItem('savedProfiles', JSON.stringify(settings.savedProfiles));
      
      setImportError('');
      alert('Einstellungen erfolgreich importiert!');
    } catch (error) {
      setImportError('Fehler beim Importieren der Einstellungen. Bitte überprüfen Sie das Dateiformat.');
    }
    
    event.target.value = '';
  }, [onDocumentTypesChange, onEditPromptsChange, onStylePromptsChange, onProfileSourceMappingsChange]); // ✅ KORRIGIERT: useCallback mit Dependencies

  const resetToDefaults = useCallback(() => {
    if (confirm('Möchten Sie wirklich alle Einstellungen auf die Standardwerte zurücksetzen? Diese Aktion kann nicht rückgängig gemacht werden.')) {
      localStorage.clear();
      window.location.reload();
    }
  }, []); // ✅ KORRIGIERT: useCallback

  const tabs = [
    { id: 'document-types' as const, label: 'Texttyp-Prompts', icon: FileText },
    { id: 'style-prompts' as const, label: 'Stil-Prompts', icon: Palette },
    { id: 'edit-prompts' as const, label: 'Anpassungs-Prompts', icon: Edit3 },
    { id: 'profile-config' as const, label: 'Profileingabe-Konfiguration', icon: User },
    { id: 'data-sources' as const, label: 'Datenquellen-Zuordnungen', icon: Database },
    { id: 'database' as const, label: 'Datenbank', icon: Server },
    { id: 'ai-config' as const, label: 'KI-Konfiguration', icon: Brain },
    { id: 'backup' as const, label: 'Backup/Restore', icon: Archive }
  ];

  const renderPromptSection = (
    title: string,
    prompts: any,
    type: 'document' | 'edit' | 'style',
    onUpdate: (prompts: any) => void
  ) => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <button
          id={`add-${type}-prompt-btn`}
          name={`addPrompt-${type}`}
          onClick={() => setShowNewPromptForm(type)}
          className="flex items-center space-x-2 px-4 py-2 text-white rounded-lg transition-colors duration-200"
          style={{ backgroundColor: '#F29400' }}
        >
          <Plus className="h-4 w-4" />
          <span>Neuen Prompt hinzufügen</span>
        </button>
      </div>

      {showNewPromptForm === type && (
        <div className="border rounded-lg p-4" style={{ backgroundColor: '#FEF7EE', borderColor: '#F29400' }}>
          <h4 className="font-medium mb-4" style={{ color: '#F29400' }}>Neuen {title} hinzufügen</h4>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor={`new-prompt-key-${type}`} className="block text-sm font-medium text-gray-700 mb-1">Schlüssel (ID)</label>
                <input
                  type="text"
                  id={`new-prompt-key-${type}`}
                  name={`newPromptKey-${type}`}
                  value={newPrompt.key}
                  onChange={(e) => setNewPrompt({ ...newPrompt, key: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                  style={{ borderColor: '#F29400', '--tw-ring-color': '#F29400' } as React.CSSProperties}
                  placeholder="z.B. custom_type"
                />
              </div>
              <div>
                <label htmlFor={`new-prompt-label-${type}`} className="block text-sm font-medium text-gray-700 mb-1">Anzeigename</label>
                <input
                  type="text"
                  id={`new-prompt-label-${type}`}
                  name={`newPromptLabel-${type}`}
                  value={newPrompt.label}
                  onChange={(e) => setNewPrompt({ ...newPrompt, label: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                  style={{ borderColor: '#F29400', '--tw-ring-color': '#F29400' } as React.CSSProperties}
                  placeholder="z.B. Benutzerdefinierter Typ"
                />
              </div>
            </div>
            <div>
              <label htmlFor={`new-prompt-text-${type}`} className="block text-sm font-medium text-gray-700 mb-1">Prompt-Text</label>
              <textarea
                id={`new-prompt-text-${type}`}
                name={`newPromptText-${type}`}
                value={newPrompt.prompt}
                onChange={(e) => setNewPrompt({ ...newPrompt, prompt: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                style={{ borderColor: '#F29400', '--tw-ring-color': '#F29400' } as React.CSSProperties}
                placeholder="Geben Sie hier den Prompt-Text ein..."
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`new-prompt-visible-${type}`}
                name={`newPromptVisible-${type}`}
                checked={newPrompt.visible}
                onChange={(e) => setNewPrompt({ ...newPrompt, visible: e.target.checked })}
                className="rounded border-gray-300"
                style={{ accentColor: '#F29400' }}
              />
              <label htmlFor={`new-prompt-visible-${type}`} className="text-sm text-gray-700">
                Prompt in der Benutzeroberfläche anzeigen
              </label>
            </div>
            <div className="flex space-x-2">
              <button
                id={`save-new-prompt-${type}`}
                name={`saveNewPrompt-${type}`}
                onClick={() => addNewPrompt(type)}
                disabled={!newPrompt.key || !newPrompt.label || !newPrompt.prompt}
                className="px-4 py-2 text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors duration-200"
                style={{ backgroundColor: '#F29400' }}
              >
                Hinzufügen
              </button>
              <button
                id={`cancel-new-prompt-${type}`}
                name={`cancelNewPrompt-${type}`}
                onClick={() => {
                  setShowNewPromptForm(null);
                  setNewPrompt({ key: '', label: '', prompt: '', visible: true });
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 hover:bg-gray-400 rounded-lg transition-colors duration-200"
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {Object.entries(prompts).map(([key, prompt]: [string, any]) => (
          <div key={key} className="border rounded-lg p-4 bg-gray-50">
            {editingPrompt && editingPrompt.key === key && editingPrompt.type === type ? (
              // EDIT MODE
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor={`edit-prompt-label-${key}`} className="block text-sm font-medium text-gray-700 mb-1">Anzeigename</label>
                    <input
                      type="text"
                      id={`edit-prompt-label-${key}`}
                      name={`editPromptLabel-${key}`}
                      value={editingPrompt.data.label}
                      onChange={(e) => setEditingPrompt({
                        ...editingPrompt,
                        data: { ...editingPrompt.data, label: e.target.value }
                      })}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                      style={{ borderColor: '#F29400', '--tw-ring-color': '#F29400' } as React.CSSProperties}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`edit-prompt-visible-${key}`}
                      name={`editPromptVisible-${key}`}
                      checked={editingPrompt.data.visible !== false}
                      onChange={(e) => setEditingPrompt({
                        ...editingPrompt,
                        data: { ...editingPrompt.data, visible: e.target.checked }
                      })}
                      className="rounded border-gray-300"
                      style={{ accentColor: '#F29400' }}
                    />
                    <label htmlFor={`edit-prompt-visible-${key}`} className="text-sm text-gray-700">Sichtbar</label>
                  </div>
                </div>
                <div>
                  <label htmlFor={`edit-prompt-text-${key}`} className="block text-sm font-medium text-gray-700 mb-1">Prompt-Text</label>
                  <textarea
                    id={`edit-prompt-text-${key}`}
                    name={`editPromptText-${key}`}
                    value={editingPrompt.data.prompt}
                    onChange={(e) => setEditingPrompt({
                      ...editingPrompt,
                      data: { ...editingPrompt.data, prompt: e.target.value }
                    })}
                    rows={4}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                    style={{ borderColor: '#F29400', '--tw-ring-color': '#F29400' } as React.CSSProperties}
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    id={`save-edit-prompt-${key}`}
                    name={`saveEditPrompt-${key}`}
                    onClick={saveEditingPrompt}
                    className="px-4 py-2 text-white rounded-lg transition-colors duration-200"
                    style={{ backgroundColor: '#F29400' }}
                    aria-label="Änderungen speichern"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <button
                    id={`cancel-edit-prompt-${key}`}
                    name={`cancelEditPrompt-${key}`}
                    onClick={cancelEditingPrompt}
                    className="px-4 py-2 bg-gray-300 text-gray-700 hover:bg-gray-400 rounded-lg transition-colors duration-200"
                    aria-label="Bearbeitung abbrechen"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              // VIEW MODE
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-medium text-gray-900">{prompt.label}</h4>
                    <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded">
                      {key}
                    </span>
                    <button
                      id={`toggle-visibility-${key}`}
                      name={`toggleVisibility-${key}`}
                      onClick={() => updatePrompt(type, key, { visible: !prompt.visible })}
                      className={`p-1 rounded transition-colors duration-200 ${
                        prompt.visible !== false 
                          ? 'text-green-600 hover:bg-green-50' 
                          : 'text-gray-400 hover:bg-gray-100'
                      }`}
                      title={prompt.visible !== false ? 'Prompt ausblenden' : 'Prompt anzeigen'}
                      aria-label={prompt.visible !== false ? 'Prompt ausblenden' : 'Prompt anzeigen'}
                    >
                      {prompt.visible !== false ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {prompt.prompt}
                  </p>
                  {prompt.visible === false && (
                    <p className="text-xs text-gray-500 mt-1 italic">
                      Dieser Prompt ist ausgeblendet und wird nicht in der Benutzeroberfläche angezeigt.
                    </p>
                  )}
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    id={`edit-prompt-${key}`}
                    name={`editPrompt-${key}`}
                    onClick={() => startEditingPrompt(type, key, prompt)}
                    className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                    title="Prompt bearbeiten"
                    aria-label={`Prompt ${prompt.label} bearbeiten`}
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    id={`delete-prompt-${key}`}
                    name={`deletePrompt-${key}`}
                    onClick={() => deletePrompt(type, key)}
                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    title="Prompt löschen"
                    aria-label={`Prompt ${prompt.label} löschen`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[95vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <Settings className="h-6 w-6" style={{ color: '#F29400' }} />
            <h2 className="text-xl font-semibold text-gray-900">App-Konfiguration</h2>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              Erweitert
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              id="save-settings-btn"
              name="saveSettings"
              onClick={saveSettings}
              disabled={saveStatus === 'saving'}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                saveStatus === 'saved' 
                  ? 'bg-green-600 text-white' 
                  : saveStatus === 'error'
                  ? 'bg-red-600 text-white'
                  : 'text-white'
              }`}
              style={saveStatus === 'idle' || saveStatus === 'saving' ? { backgroundColor: '#F29400' } : {}}
            >
              {saveStatus === 'saving' ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : saveStatus === 'saved' ? (
                <Check className="h-4 w-4" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span>
                {saveStatus === 'saving' ? 'Speichern...' : 
                 saveStatus === 'saved' ? 'Gespeichert!' : 
                 saveStatus === 'error' ? 'Fehler!' : 'Speichern'}
              </span>
            </button>
            <button
              id="close-settings-btn"
              name="closeSettings"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              aria-label="Einstellungen schließen"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 border-r border-gray-200 flex-shrink-0">
            <nav className="p-4 space-y-2 overflow-y-auto h-full" role="navigation" aria-label="Einstellungen Navigation">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  id={`tab-${id}`}
                  name={`tab-${id}`}
                  onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors duration-200 ${
                    activeTab === id
                      ? 'text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  style={activeTab === id ? { backgroundColor: '#F29400' } : {}}
                  aria-selected={activeTab === id}
                  role="tab"
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium text-sm">{label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 p-6 overflow-y-auto" role="tabpanel">
              {activeTab === 'document-types' && renderPromptSection(
                'Texttyp-Prompts',
                documentTypes,
                'document',
                onDocumentTypesChange
              )}

              {activeTab === 'style-prompts' && renderPromptSection(
                'Stil-Prompts',
                stylePrompts,
                'style',
                onStylePromptsChange
              )}

              {activeTab === 'edit-prompts' && renderPromptSection(
                'Anpassungs-Prompts',
                editPrompts,
                'edit',
                onEditPromptsChange
              )}

              {activeTab === 'profile-config' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">Profileingabe-Konfiguration</h3>
                  <div className="border rounded-lg p-4" style={{ backgroundColor: '#FEF7EE', borderColor: '#F29400' }}>
                    <p className="text-sm" style={{ color: '#F29400' }}>
                      Die Profileingabe-Konfiguration wird automatisch aus den Datenquellen geladen. 
                      Verwenden Sie die "Datenquellen-Zuordnungen" um die Quellen zu konfigurieren.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'data-sources' && (
                <ProfileSourceSettings
                  sourceMappings={profileSourceMappings}
                  onSourceMappingsChange={onProfileSourceMappingsChange}
                />
              )}

              {activeTab === 'database' && (
                <DatabaseStatus />
              )}

              {activeTab === 'ai-config' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">KI-Konfiguration</h3>
                    <button
                      id="add-ai-model-btn"
                      name="addAIModel"
                      onClick={() => setShowNewModelForm(true)}
                      className="flex items-center space-x-2 px-4 py-2 text-white rounded-lg transition-colors duration-200"
                      style={{ backgroundColor: '#F29400' }}
                    >
                      <Plus className="h-4 w-4" />
                      <span>Modell hinzufügen</span>
                    </button>
                  </div>

                  {/* Current Model */}
                  <div className="border rounded-lg p-4" style={{ backgroundColor: '#FEF7EE', borderColor: '#F29400' }}>
                    <h4 className="font-medium mb-3" style={{ color: '#F29400' }}>Aktuelles Modell</h4>
                    <div className="flex items-center space-x-3">
                      <Brain className="h-5 w-5" style={{ color: '#F29400' }} />
                      <span className="font-medium">
                        {aiModels.find(m => m.id === currentModel)?.name || currentModel}
                      </span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        Aktiv
                      </span>
                    </div>
                  </div>

                  {/* New Model Form */}
                  {showNewModelForm && (
                    <div className="border rounded-lg p-4" style={{ backgroundColor: '#FEF7EE', borderColor: '#F29400' }}>
                      <h4 className="font-medium mb-4" style={{ color: '#F29400' }}>Neues KI-Modell hinzufügen</h4>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="new-model-name" className="block text-sm font-medium text-gray-700 mb-1">Modellname</label>
                            <input
                              type="text"
                              id="new-model-name"
                              name="newModelName"
                              value={newModel.name}
                              onChange={(e) => setNewModel({ ...newModel, name: e.target.value })}
                              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                              style={{ borderColor: '#F29400', '--tw-ring-color': '#F29400' } as React.CSSProperties}
                              placeholder="z.B. Mein lokales Modell"
                            />
                          </div>
                          <div>
                            <label htmlFor="new-model-provider" className="block text-sm font-medium text-gray-700 mb-1">Anbieter</label>
                            <select
                              id="new-model-provider"
                              name="newModelProvider"
                              value={newModel.provider}
                              onChange={(e) => setNewModel({ ...newModel, provider: e.target.value as any })}
                              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                              style={{ borderColor: '#F29400', '--tw-ring-color': '#F29400' } as React.CSSProperties}
                            >
                              <option value="custom">Benutzerdefiniert</option>
                              <option value="local">Lokal</option>
                              <option value="openai">OpenAI</option>
                              <option value="anthropic">Anthropic</option>
                              <option value="mistral">Mistral</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label htmlFor="new-model-endpoint" className="block text-sm font-medium text-gray-700 mb-1">API-Endpoint (optional)</label>
                          <input
                            type="url"
                            id="new-model-endpoint"
                            name="newModelEndpoint"
                            value={newModel.endpoint}
                            onChange={(e) => setNewModel({ ...newModel, endpoint: e.target.value })}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                            style={{ borderColor: '#F29400', '--tw-ring-color': '#F29400' } as React.CSSProperties}
                            placeholder="https://api.example.com/v1/chat/completions"
                          />
                        </div>
                        <div>
                          <label htmlFor="new-model-api-key" className="block text-sm font-medium text-gray-700 mb-1">API-Schlüssel (optional)</label>
                          <input
                            type="password"
                            id="new-model-api-key"
                            name="newModelApiKey"
                            value={newModel.apiKey}
                            onChange={(e) => setNewModel({ ...newModel, apiKey: e.target.value })}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                            style={{ borderColor: '#F29400', '--tw-ring-color': '#F29400' } as React.CSSProperties}
                            placeholder="sk-..."
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="new-model-max-tokens" className="block text-sm font-medium text-gray-700 mb-1">Max Tokens</label>
                            <input
                              type="number"
                              id="new-model-max-tokens"
                              name="newModelMaxTokens"
                              value={newModel.maxTokens}
                              onChange={(e) => setNewModel({ ...newModel, maxTokens: parseInt(e.target.value) })}
                              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                              style={{ borderColor: '#F29400', '--tw-ring-color': '#F29400' } as React.CSSProperties}
                              min="100"
                              max="4000"
                            />
                          </div>
                          <div>
                            <label htmlFor="new-model-temperature" className="block text-sm font-medium text-gray-700 mb-1">Temperature</label>
                            <input
                              type="number"
                              id="new-model-temperature"
                              name="newModelTemperature"
                              value={newModel.temperature}
                              onChange={(e) => setNewModel({ ...newModel, temperature: parseFloat(e.target.value) })}
                              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                              style={{ borderColor: '#F29400', '--tw-ring-color': '#F29400' } as React.CSSProperties}
                              min="0"
                              max="2"
                              step="0.1"
                            />
                          </div>
                        </div>
                        <div>
                          <label htmlFor="new-model-description" className="block text-sm font-medium text-gray-700 mb-1">Beschreibung (optional)</label>
                          <textarea
                            id="new-model-description"
                            name="newModelDescription"
                            value={newModel.description}
                            onChange={(e) => setNewModel({ ...newModel, description: e.target.value })}
                            rows={2}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                            style={{ borderColor: '#F29400', '--tw-ring-color': '#F29400' } as React.CSSProperties}
                            placeholder="Kurze Beschreibung des Modells..."
                          />
                        </div>
                        <div className="flex space-x-2">
                          <button
                            id="save-new-model-btn"
                            name="saveNewModel"
                            onClick={addAIModel}
                            disabled={!newModel.name}
                            className="px-4 py-2 text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors duration-200"
                            style={{ backgroundColor: '#F29400' }}
                          >
                            Hinzufügen
                          </button>
                          <button
                            id="cancel-new-model-btn"
                            name="cancelNewModel"
                            onClick={() => setShowNewModelForm(false)}
                            className="px-4 py-2 bg-gray-300 text-gray-700 hover:bg-gray-400 rounded-lg transition-colors duration-200"
                          >
                            Abbrechen
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Available Models */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Verfügbare Modelle</h4>
                    {aiModels.map((model) => (
                      <div key={model.id} className={`border rounded-lg p-4 ${
                        model.id === currentModel ? 'border-green-200 bg-green-50' : 'bg-gray-50'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h5 className="font-medium text-gray-900">{model.name}</h5>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                model.provider === 'mistral' ? 'bg-blue-100 text-blue-800' :
                                model.provider === 'openai' ? 'bg-green-100 text-green-800' :
                                model.provider === 'anthropic' ? 'bg-purple-100 text-purple-800' :
                                model.provider === 'local' ? 'bg-orange-100 text-orange-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {model.provider}
                              </span>
                              {model.id === currentModel && (
                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                  Aktiv
                                </span>
                              )}
                            </div>
                            {model.description && (
                              <p className="text-sm text-gray-600 mb-2">{model.description}</p>
                            )}
                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                              <div>Max Tokens: {model.maxTokens}</div>
                              <div>Temperature: {model.temperature}</div>
                              {model.endpoint && <div className="col-span-2">Endpoint: {model.endpoint}</div>}
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              id={`activate-model-${model.id}`}
                              name={`activateModel-${model.id}`}
                              onClick={() => setCurrentModel(model.id)}
                              disabled={model.id === currentModel}
                              className="px-3 py-1 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md text-sm transition-colors duration-200"
                            >
                              Aktivieren
                            </button>
                            <button
                              id={`delete-model-${model.id}`}
                              name={`deleteModel-${model.id}`}
                              onClick={() => deleteAIModel(model.id)}
                              className="px-3 py-1 bg-red-600 text-white hover:bg-red-700 rounded-md text-sm transition-colors duration-200"
                              aria-label={`Modell ${model.name} löschen`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'backup' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">Backup/Restore</h3>
                  
                  {/* Export Section */}
                  <div className="border rounded-lg p-4" style={{ backgroundColor: '#FEF7EE', borderColor: '#F29400' }}>
                    <h4 className="font-medium mb-4" style={{ color: '#F29400' }}>Konfiguration exportieren</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Wählen Sie aus, welche Einstellungen exportiert werden sollen:
                    </p>
                    
                    <fieldset>
                      <legend className="sr-only">Export-Optionen auswählen</legend>
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        {Object.entries(exportOptions).map(([key, value]) => (
                          <label key={key} htmlFor={`export-option-${key}`} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              id={`export-option-${key}`}
                              name={`exportOption-${key}`}
                              checked={value}
                              onChange={() => toggleExportOption(key as keyof ExportOptions)}
                              className="rounded border-gray-300"
                              style={{ accentColor: '#F29400' }}
                            />
                            <span className="text-sm text-gray-700">
                              {key === 'documentTypes' ? 'Texttyp-Prompts' :
                               key === 'stylePrompts' ? 'Stil-Prompts' :
                               key === 'editPrompts' ? 'Anpassungs-Prompts' :
                               key === 'aiModels' ? 'KI-Modelle' :
                               key === 'profileSourceMappings' ? 'Datenquellen-Zuordnungen' :
                               key === 'editorSettings' ? 'Editor-Einstellungen' :
                               key === 'savedProfiles' ? 'Gespeicherte Profile' : key}
                            </span>
                          </label>
                        ))}
                      </div>
                    </fieldset>
                    
                    <button
                      id="export-settings-btn"
                      name="exportSettings"
                      onClick={exportSettings}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors duration-200"
                    >
                      <Download className="h-4 w-4" />
                      <span>Exportieren</span>
                    </button>
                  </div>

                  {/* Import Section */}
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <h4 className="font-medium mb-4 text-gray-900">Konfiguration importieren</h4>
                    <div className="relative">
                      <input
                        type="file"
                        id="import-settings-input"
                        name="importSettings"
                        accept=".json"
                        onChange={importSettings}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <label htmlFor="import-settings-input" className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors duration-200 cursor-pointer">
                        <Upload className="h-4 w-4" />
                        <span>Konfigurationsdatei auswählen</span>
                      </label>
                    </div>
                    {importError && (
                      <div className="mt-3 text-sm text-red-600">
                        {importError}
                      </div>
                    )}
                  </div>

                  {/* Reset Section */}
                  <div className="border rounded-lg p-4 bg-red-50 border-red-200">
                    <h4 className="font-medium mb-4 text-red-900">Auf Standardwerte zurücksetzen</h4>
                    <p className="text-sm text-red-700 mb-4">
                      ⚠️ Achtung: Dies löscht alle Ihre Einstellungen und setzt die App auf die Standardkonfiguration zurück.
                    </p>
                    <button
                      id="reset-to-defaults-btn"
                      name="resetToDefaults"
                      onClick={resetToDefaults}
                      className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors duration-200"
                    >
                      <RotateCcw className="h-4 w-4" />
                      <span>Auf Standardwerte zurücksetzen</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}