import React, { useState, useEffect } from 'react';
import {
  Settings,
  X,
  Save,
  RotateCcw,
  Eye,
  Type,
  Layout,
  Monitor,
  Smartphone,
  Tablet
} from 'lucide-react';

export interface EditorSettings {
  // General
  theme: 'snow' | 'bubble';
  minHeight: number;
  placeholderText: string;
  placeholderEnabled: boolean;
  placeholderColor: string;
  readOnly: boolean;
  autoFocus: boolean;
  
  // Toolbar
  toolbarMode: 'wrap' | 'scroll' | 'popup';
  toolbarAutoHide: boolean;
  toolbarPosition: 'top' | 'bottom';
  
  // Content style
  fontSize: number;
  fontFamily: string;
  
  // Button visibility
  visibleButtons: string[];
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsChange: (settings: EditorSettings) => void;
  currentSettings: EditorSettings;
}

const DEFAULT_SETTINGS: EditorSettings = {
  theme: 'snow',
  minHeight: 400,
  placeholderText: 'Hier können Sie Ihr Bewerbungsschreiben schreiben oder bearbeiten...',
  placeholderEnabled: true,
  placeholderColor: '#9ca3af',
  readOnly: false,
  autoFocus: false,
  toolbarMode: 'wrap',
  toolbarAutoHide: false,
  toolbarPosition: 'top',
  fontSize: 14,
  fontFamily: 'Roboto',
  visibleButtons: [
    'undo', 'redo', 'bold', 'italic', 'underline', 'strike',
    'header', 'font', 'size', 'color', 'background',
    'list', 'bullet', 'indent', 'outdent',
    'align', 'link', 'blockquote', 'clean'
  ]
};

export default function SettingsModal({ 
  isOpen, 
  onClose, 
  onSettingsChange, 
  currentSettings 
}: SettingsModalProps) {
  const [settings, setSettings] = useState<EditorSettings>(currentSettings);
  const [activeTab, setActiveTab] = useState<'general' | 'toolbar' | 'content' | 'buttons'>('general');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    setSettings(currentSettings);
    setHasUnsavedChanges(false);
  }, [currentSettings]);

  useEffect(() => {
    const hasChanges = JSON.stringify(settings) !== JSON.stringify(currentSettings);
    setHasUnsavedChanges(hasChanges);
  }, [settings, currentSettings]);

  // Close modal with Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        if (hasUnsavedChanges) {
          if (confirm('Sie haben ungespeicherte Änderungen. Möchten Sie das Fenster wirklich schließen?')) {
            onClose();
          }
        } else {
          onClose();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose, hasUnsavedChanges]);

  const handleSave = () => {
    onSettingsChange(settings);
    onClose();
  };

  const handleReset = () => {
    if (confirm('Möchten Sie alle Einstellungen auf die Standardwerte zurücksetzen?')) {
      setSettings(DEFAULT_SETTINGS);
    }
  };

  const updateSetting = <K extends keyof EditorSettings>(key: K, value: EditorSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const toggleButton = (buttonId: string) => {
    const newButtons = settings.visibleButtons.includes(buttonId)
      ? settings.visibleButtons.filter(id => id !== buttonId)
      : [...settings.visibleButtons, buttonId];
    updateSetting('visibleButtons', newButtons);
  };

  const getPreviewHeight = () => {
    switch (previewDevice) {
      case 'mobile': return Math.min(settings.minHeight, 300);
      case 'tablet': return Math.min(settings.minHeight, 400);
      default: return settings.minHeight;
    }
  };

  if (!isOpen) return null;

  const tabs = [
    { id: 'general' as const, label: 'Allgemein', icon: Settings },
    { id: 'toolbar' as const, label: 'Symbolleiste', icon: Layout },
    { id: 'content' as const, label: 'Inhaltsstil', icon: Type },
    { id: 'buttons' as const, label: 'Buttons', icon: Eye }
  ];

  const deviceIcons = {
    desktop: Monitor,
    tablet: Tablet,
    mobile: Smartphone
  };

  const availableButtons = [
    { id: 'undo', label: 'Rückgängig' },
    { id: 'redo', label: 'Wiederholen' },
    { id: 'bold', label: 'Fett' },
    { id: 'italic', label: 'Kursiv' },
    { id: 'underline', label: 'Unterstrichen' },
    { id: 'strike', label: 'Durchgestrichen' },
    { id: 'header', label: 'Überschrift' },
    { id: 'font', label: 'Schriftart' },
    { id: 'size', label: 'Schriftgröße' },
    { id: 'color', label: 'Textfarbe' },
    { id: 'background', label: 'Hintergrundfarbe' },
    { id: 'list', label: 'Listen' },
    { id: 'indent', label: 'Einzug' },
    { id: 'align', label: 'Ausrichtung' },
    { id: 'link', label: 'Link' },
    { id: 'blockquote', label: 'Zitat' },
    { id: 'clean', label: 'Formatierung entfernen' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[95vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <Settings className="h-6 w-6" style={{ color: '#F29400' }} />
            <h2 className="text-xl font-semibold text-gray-900">Editor-Einstellungen</h2>
            {hasUnsavedChanges && (
              <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                Ungespeicherte Änderungen
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 border-r border-gray-200 flex-shrink-0">
            <nav className="p-4 space-y-2 overflow-y-auto h-full">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors duration-200 ${
                    activeTab === id
                      ? 'text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  style={activeTab === id ? { backgroundColor: '#F29400' } : {}}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 p-6 overflow-y-auto">
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">Allgemeine Editor-Einstellungen</h3>
                  
                  {/* Theme Selection */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">Editor-Theme</label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => updateSetting('theme', 'snow')}
                        className={`p-4 border-2 rounded-lg transition-all duration-200 ${
                          settings.theme === 'snow'
                            ? 'border-orange-400 bg-orange-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <div className="text-center">
                          <div className="w-full h-16 bg-white border border-gray-300 rounded mb-2 flex items-center justify-center">
                            <div className="text-xs text-gray-500">Standard Theme</div>
                          </div>
                          <div className="text-sm font-medium">Snow (Standard)</div>
                          <div className="text-xs text-gray-500">Klassischer Rich Text Editor</div>
                        </div>
                      </button>
                      
                      <button
                        onClick={() => updateSetting('theme', 'bubble')}
                        className={`p-4 border-2 rounded-lg transition-all duration-200 ${
                          settings.theme === 'bubble'
                            ? 'border-orange-400 bg-orange-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <div className="text-center">
                          <div className="w-full h-16 bg-gray-50 border border-gray-300 rounded mb-2 flex items-center justify-center">
                            <div className="text-xs text-gray-500">Bubble Theme</div>
                          </div>
                          <div className="text-sm font-medium">Bubble</div>
                          <div className="text-xs text-gray-500">Minimalistisch, Toolbar bei Auswahl</div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Min Height */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Mindesthöhe des Editors
                    </label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="range"
                        min="200"
                        max="800"
                        step="50"
                        value={settings.minHeight}
                        onChange={(e) => updateSetting('minHeight', parseInt(e.target.value))}
                        className="flex-1"
                        style={{ accentColor: '#F29400' }}
                      />
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          min="200"
                          max="800"
                          value={settings.minHeight}
                          onChange={(e) => updateSetting('minHeight', parseInt(e.target.value) || 400)}
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2"
                          style={{ '--tw-ring-color': '#F29400' } as React.CSSProperties}
                        />
                        <span className="text-sm text-gray-500">px</span>
                      </div>
                    </div>
                    
                    {/* Live Preview */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-gray-700">Vorschau:</span>
                        <div className="flex space-x-1">
                          {Object.entries(deviceIcons).map(([device, Icon]) => (
                            <button
                              key={device}
                              onClick={() =>
                                // Object.entries loses literal types
                                setPreviewDevice(device as keyof typeof deviceIcons)
                              }
                              className={`p-1 rounded ${
                                previewDevice === device
                                  ? 'text-white'
                                  : 'text-gray-400 hover:text-gray-600'
                              }`}
                              style={previewDevice === device ? { backgroundColor: '#F29400' } : {}}
                              title={device}
                            >
                              <Icon className="h-4 w-4" />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div 
                        className="border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500 text-sm transition-all duration-200"
                        style={{ 
                          height: `${getPreviewHeight()}px`,
                          maxWidth: previewDevice === 'mobile' ? '320px' : previewDevice === 'tablet' ? '768px' : '100%'
                        }}
                      >
                        Editor-Bereich ({getPreviewHeight()}px Höhe)
                      </div>
                    </div>
                  </div>

                  {/* Placeholder Settings */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-medium text-gray-700">
                        Platzhaltertext
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={settings.placeholderEnabled}
                          onChange={(e) => updateSetting('placeholderEnabled', e.target.checked)}
                          className="rounded border-gray-300"
                          style={{ accentColor: '#F29400' }}
                        />
                        <span className="text-sm text-gray-600">Aktiviert</span>
                      </label>
                    </div>
                    
                    {settings.placeholderEnabled && (
                      <div className="space-y-3">
                        <textarea
                          value={settings.placeholderText}
                          onChange={(e) => updateSetting('placeholderText', e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 text-sm"
                          style={{ '--tw-ring-color': '#F29400' } as React.CSSProperties}
                          placeholder="Text eingeben, der angezeigt wird wenn der Editor leer ist..."
                        />
                        
                        <div className="flex items-center space-x-4">
                          <label className="text-sm font-medium text-gray-700">Schriftfarbe:</label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="color"
                              value={settings.placeholderColor}
                              onChange={(e) => updateSetting('placeholderColor', e.target.value)}
                              className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                            />
                            <input
                              type="text"
                              value={settings.placeholderColor}
                              onChange={(e) => updateSetting('placeholderColor', e.target.value)}
                              className="w-24 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2"
                              style={{ '--tw-ring-color': '#F29400' } as React.CSSProperties}
                              placeholder="#9ca3af"
                            />
                          </div>
                        </div>
                        
                        {/* Placeholder Preview */}
                        <div className="mt-3 p-3 border border-gray-300 rounded-lg bg-gray-50">
                          <div className="text-xs font-medium text-gray-700 mb-2">Vorschau:</div>
                          <div 
                            className="italic"
                            style={{ color: settings.placeholderColor }}
                          >
                            {settings.placeholderText}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Additional Options */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Weitere Optionen</h4>
                    <div className="space-y-3">
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={settings.readOnly}
                          onChange={(e) => updateSetting('readOnly', e.target.checked)}
                          className="rounded border-gray-300"
                          style={{ accentColor: '#F29400' }}
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-700">Nur-Lese-Modus</div>
                          <div className="text-xs text-gray-500">Editor ist schreibgeschützt</div>
                        </div>
                      </label>
                      
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={settings.autoFocus}
                          onChange={(e) => updateSetting('autoFocus', e.target.checked)}
                          className="rounded border-gray-300"
                          style={{ accentColor: '#F29400' }}
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-700">Automatischer Fokus</div>
                          <div className="text-xs text-gray-500">Editor erhält automatisch den Fokus beim Laden</div>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'toolbar' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">Symbolleiste konfigurieren</h3>
                  
                  {/* Toolbar Settings */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Verhalten</label>
                      <select
                        value={settings.toolbarMode}
                        onChange={(e) =>
                          updateSetting(
                            'toolbarMode',
                            e.target.value as EditorSettings['toolbarMode']
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                        style={{ '--tw-ring-color': '#F29400' } as React.CSSProperties}
                      >
                        <option value="wrap">Umbruch (Standard)</option>
                        <option value="scroll">Horizontal scrollen</option>
                        <option value="popup">Popup bei Bedarf</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                      <select
                        value={settings.toolbarPosition}
                        onChange={(e) =>
                          updateSetting(
                            'toolbarPosition',
                            e.target.value as EditorSettings['toolbarPosition']
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                        style={{ '--tw-ring-color': '#F29400' } as React.CSSProperties}
                      >
                        <option value="top">Oben (Standard)</option>
                        <option value="bottom">Unten</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={settings.toolbarAutoHide}
                        onChange={(e) => updateSetting('toolbarAutoHide', e.target.checked)}
                        className="rounded border-gray-300"
                        style={{ accentColor: '#F29400' }}
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-700">Automatisch ausblenden</div>
                        <div className="text-xs text-gray-500">Toolbar bei Inaktivität ausblenden</div>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {activeTab === 'content' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">Inhaltsstil</h3>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Schriftgröße (px)</label>
                      <input
                        type="number"
                        value={settings.fontSize}
                        onChange={(e) => updateSetting('fontSize', parseInt(e.target.value) || 14)}
                        min="8"
                        max="72"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                        style={{ '--tw-ring-color': '#F29400' } as React.CSSProperties}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Schriftart</label>
                      <select
                        value={settings.fontFamily}
                        onChange={(e) => updateSetting('fontFamily', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                        style={{ '--tw-ring-color': '#F29400' } as React.CSSProperties}
                      >
                        <option value="Roboto">Roboto</option>
                        <option value="Arial">Arial</option>
                        <option value="Times New Roman">Times New Roman</option>
                        <option value="Helvetica">Helvetica</option>
                        <option value="Georgia">Georgia</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* Font Preview */}
                  <div className="mt-4 p-4 border border-gray-300 rounded-lg bg-gray-50">
                    <div className="text-xs font-medium text-gray-700 mb-2">Vorschau:</div>
                    <div 
                      style={{ 
                        fontSize: `${settings.fontSize}px`,
                        fontFamily: settings.fontFamily
                      }}
                    >
                      Dies ist ein Beispieltext in der gewählten Schriftart und -größe.
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'buttons' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">Sichtbare Buttons</h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {availableButtons.map(button => (
                      <label key={button.id} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.visibleButtons.includes(button.id)}
                          onChange={() => toggleButton(button.id)}
                          className="rounded border-gray-300"
                          style={{ accentColor: '#F29400' }}
                        />
                        <span className="text-sm text-gray-700">{button.label}</span>
                      </label>
                    ))}
                  </div>
                  
                  <div className="mt-6 p-4 border border-gray-300 rounded-lg bg-gray-50">
                    <div className="text-xs font-medium text-gray-700 mb-2">
                      Ausgewählte Buttons: {settings.visibleButtons.length}
                    </div>
                    <div className="text-xs text-gray-500">
                      Deaktivierte Buttons werden in der Toolbar ausgeblendet.
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
              <button
                onClick={handleReset}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Zurücksetzen</span>
              </button>
              
              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
                >
                  Abbrechen
                </button>
                <button
                  onClick={handleSave}
                  disabled={!hasUnsavedChanges}
                  className="flex items-center space-x-2 px-4 py-2 text-white rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: '#F29400' }}
                >
                  <Save className="h-4 w-4" />
                  <span>Speichern</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}