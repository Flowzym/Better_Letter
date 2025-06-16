import React, { useMemo, useRef, useEffect, useState, useCallback } from 'react';
import ForwardedReactQuill from './ForwardedReactQuill';
import 'react-quill/dist/quill.snow.css';
import CustomToolbar from './CustomToolbar';
import TemplateManagerModal, { Template } from './TemplateManagerModal';
import SettingsModal, { EditorSettings } from './SettingsModal';

interface QuillEditorProps {
  value: string;
  onChange: (content: string) => void;
}

// BOLT-UI-ANPASSUNG 2025-01-15: Default settings angepasst
const DEFAULT_SETTINGS: EditorSettings = {
  theme: 'snow',
  minHeight: 400,
  placeholderText: '', // BOLT-UI-ANPASSUNG 2025-01-15: Kein Platzhaltertext im Editor
  placeholderEnabled: false, // BOLT-UI-ANPASSUNG 2025-01-15: Platzhalter deaktiviert
  placeholderColor: '#9ca3af',
  readOnly: false,
  autoFocus: false, // BOLT-UI-ANPASSUNG 2025-01-15: AutoFocus deaktiviert
  toolbarMode: 'wrap',
  toolbarAutoHide: false,
  toolbarPosition: 'top',
  fontSize: 14,
  fontFamily: 'Roboto',
  visibleButtons: [
    'undo', 'redo', 'bold', 'italic', 'underline', 'strike',
    'header', 'font', 'size', 'color', 'background',
    'list', 'bullet', 'indent', 'outdent',
    'align', 'link', 'blockquote', 'clean',
    'selectAll', 'copy', 'paste', 'print', 'templates'
  ]
};

// Default templates
const DEFAULT_TEMPLATES: Template[] = [
  {
    id: '1',
    name: 'Standard Bewerbung',
    content: `<p>Sehr geehrte Damen und Herren,</p>
<p>hiermit bewerbe ich mich um die ausgeschriebene Stelle als [Position] in Ihrem Unternehmen.</p>
<p>Durch meine Erfahrungen in [Bereich] bringe ich die notwendigen Qualifikationen für diese Position mit. Besonders interessiert mich [spezifischer Aspekt der Stelle].</p>
<p>Über eine Einladung zu einem persönlichen Gespräch würde ich mich sehr freuen.</p>
<p>Mit freundlichen Grüßen<br>[Ihr Name]</p>`,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Geschäftsbrief',
    content: `<p>Sehr geehrte Damen und Herren,</p>
<p>vielen Dank für Ihr Interesse an unserem Unternehmen und unseren Dienstleistungen.</p>
<p>Gerne möchten wir Ihnen unser Angebot unterbreiten und stehen für weitere Fragen zur Verfügung.</p>
<p>Mit freundlichen Grüßen<br>[Ihr Name]<br>[Unternehmen]</p>`,
    createdAt: new Date().toISOString()
  }
];

export default function QuillEditor({ value, onChange }: QuillEditorProps) {
  const quillRef = useRef<any>(null);
  const [zoom, setZoom] = useState(140); // BOLT-UI-ANPASSUNG 2025-01-15: Standard 140% Zoom, aber als 100% angezeigt
  const [displayZoom, setDisplayZoom] = useState(100); // BOLT-UI-ANPASSUNG 2025-01-15: User sieht 100%
  const [showTemplates, setShowTemplates] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [clipboardError, setClipboardError] = useState<string>('');
  
  // Load settings and templates from localStorage
  const [settings, setSettings] = useState<EditorSettings>(() => {
    try {
      const saved = localStorage.getItem('quillEditorSettings');
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });
  
  const [templates, setTemplates] = useState<Template[]>(() => {
    try {
      const saved = localStorage.getItem('quillEditorTemplates');
      return saved ? JSON.parse(saved) : DEFAULT_TEMPLATES;
    } catch {
      return DEFAULT_TEMPLATES;
    }
  });

  // Save settings and templates to localStorage
  useEffect(() => {
    localStorage.setItem('quillEditorSettings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('quillEditorTemplates', JSON.stringify(templates));
  }, [templates]);

  // BOLT-UI-ANPASSUNG 2025-01-15: Zoom-Synchronisation zwischen internem und Display-Zoom
  useEffect(() => {
    // Berechne Display-Zoom basierend auf internem Zoom (140% = 100% für User)
    const calculatedDisplayZoom = Math.round((zoom / 140) * 100);
    setDisplayZoom(calculatedDisplayZoom);
  }, [zoom]);

  // BOLT-FIX 2025-01-15: Clipboard error handler mit useCallback stabilisiert
  const showClipboardError = useCallback((message: string) => {
    setClipboardError(message);
    setTimeout(() => setClipboardError(''), 3000);
  }, []);

  // Generic scroll position preservation
  const preserveScrollPosition = useCallback((action: () => void) => {
    const quill = quillRef.current?.getEditor();
    if (!quill || !quill.root) return action();

    const scroll = quill.root.scrollTop;
    action();

    setTimeout(() => {
      if (quill && quill.root) {
        quill.root.scrollTop = scroll;
      }
    }, 0);
  }, []);

  // BOLT-FIX 2025-01-15: Alle Handler mit useCallback stabilisiert und Fehlerbehandlung verbessert
  const customHandlers = useMemo(() => ({
    undo: () => {
      preserveScrollPosition(() => {
        const quill = quillRef.current?.getEditor();
        if (quill && quill.history) {
          try {
            quill.history.undo();
          } catch (error) {
            // BOLT-FIX 2025-01-15: Stille Fehlerbehandlung wenn Editor nicht bereit
          }
        }
      });
    },
    redo: () => {
      preserveScrollPosition(() => {
        const quill = quillRef.current?.getEditor();
        if (quill && quill.history) {
          try {
            quill.history.redo();
          } catch (error) {
            // BOLT-FIX 2025-01-15: Stille Fehlerbehandlung wenn Editor nicht bereit
          }
        }
      });
    },
    selectAll: () => {
      const quill = quillRef.current?.getEditor();
      if (quill && quill.setSelection) {
        try {
          const length = quill.getLength ? quill.getLength() : 0;
          quill.setSelection(0, length);
        } catch (error) {
          // BOLT-FIX 2025-01-15: Stille Fehlerbehandlung wenn Editor nicht bereit
        }
      }
    },
    copy: async () => {
      try {
        const quill = quillRef.current?.getEditor();
        if (quill && quill.getSelection && quill.getText) {
          const selection = quill.getSelection();
          if (selection && selection.length > 0 && typeof selection.index === 'number') {
            const text = quill.getText(selection.index, selection.length);
            await navigator.clipboard.writeText(text);
          } else {
            const text = quill.getText();
            await navigator.clipboard.writeText(text);
          }
        }
      } catch (error) {
        showClipboardError('Zugriff auf die Zwischenablage verweigert. Bitte erlauben Sie den Zugriff in Ihren Browsereinstellungen.');
      }
    },
    paste: async () => {
      try {
        const text = await navigator.clipboard.readText();
        const quill = quillRef.current?.getEditor();
        if (quill && quill.insertText && quill.getSelection) {
          const selection = quill.getSelection() || { index: quill.getLength ? quill.getLength() : 0, length: 0 };
          if (typeof selection.index === 'number') {
            quill.insertText(selection.index, text);
          }
        }
      } catch (error) {
        showClipboardError('Zugriff auf die Zwischenablage verweigert. Verwenden Sie Strg+V zum Einfügen.');
      }
    },
    print: () => {
      window.print();
    },
    templates: () => {
      setShowTemplates(true);
    },
    settings: () => {
      setShowSettings(true);
    }
  }), [preserveScrollPosition, showClipboardError]);

  // Quill modules configuration - Toolbar completely disabled
  const modules = useMemo(() => ({
    toolbar: false,
    history: {
      delay: 1000,
      maxStack: 100,
      userOnly: true
    }
  }), []);

  // All supported formats
  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent', 'align',
    'link', 'color', 'background'
  ];

  // BOLT-UI-ANPASSUNG 2025-01-15: Zoom functions angepasst für Display-Zoom
  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev + 14, 280)); // 14% Schritte (entspricht 10% Display)
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev - 14, 70)); // 14% Schritte (entspricht 10% Display)
  }, []);

  const handleZoomReset = useCallback(() => {
    setZoom(140); // Zurück zu 140% intern (100% Display)
  }, []);

  const handleZoomChange = useCallback((newDisplayZoom: number) => {
    // Konvertiere Display-Zoom zu internem Zoom
    const newInternalZoom = Math.round((newDisplayZoom / 100) * 140);
    setZoom(newInternalZoom);
  }, []);

  const handleChange = useCallback((content: string) => {
    onChange(content);
  }, [onChange]);

  const handleInsertTemplate = useCallback((template: Template) => {
    onChange(template.content);
    setShowTemplates(false);
  }, [onChange]);

  const handleSettingsChange = useCallback((newSettings: EditorSettings) => {
    setSettings(newSettings);
  }, []);

  // BOLT-FIX 2025-01-15: Keyboard shortcuts mit besserer Fehlerbehandlung
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'z':
            if (!e.shiftKey) {
              e.preventDefault();
              customHandlers.undo();
            }
            break;
          case 'y':
            e.preventDefault();
            customHandlers.redo();
            break;
          case 'a':
            e.preventDefault();
            customHandlers.selectAll();
            break;
          case 'p':
            e.preventDefault();
            customHandlers.print();
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [customHandlers]);

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* BOLT-UI-ANPASSUNG 2025-01-15: Toolbar wieder oben wie ursprünglich */}
      <div className="main-content w-full">
        {/* BOLT-UI-ANPASSUNG 2025-01-15: Toolbar mit vergrößertem Abstand zur Editorfläche */}
        <div className="toolbar-wrapper" style={{ marginBottom: '24px' }}>
          <CustomToolbar
            quillRef={quillRef}
            onUndo={customHandlers.undo}
            onRedo={customHandlers.redo}
            onSelectAll={customHandlers.selectAll}
            onCopy={customHandlers.copy}
            onPaste={customHandlers.paste}
            onPrint={customHandlers.print}
            onTemplates={customHandlers.templates}
            onSettings={customHandlers.settings}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onZoomReset={handleZoomReset}
            zoom={displayZoom} // BOLT-UI-ANPASSUNG 2025-01-15: Display-Zoom für User
            onZoomChange={handleZoomChange}
            minZoom={50} // Display-Zoom Grenzen
            maxZoom={200}
            clipboardError={clipboardError}
          />
        </div>

        {/* BOLT-UI-ANPASSUNG 2025-01-15: Editor root mit A4-Simulation */}
        <div className="editor-root">
          <div className="editor-paper-sheet mt-4 mb-8">
            <div 
              className="bg-white shadow-lg rounded-lg overflow-hidden mx-auto"
              style={{
                width: '794px', // BOLT-UI-ANPASSUNG 2025-01-15: A4-Breite (21cm)
                minHeight: '1123px', // BOLT-UI-ANPASSUNG 2025-01-15: A4-Höhe (29.7cm)
                transform: `scale(${zoom / 100})`,
                transformOrigin: 'top center',
                transition: 'transform 0.3s ease'
              }}
            >
              {/* BOLT-FIX 2025-01-15: ReactQuill durch ForwardedReactQuill ersetzt */}
              <ForwardedReactQuill
                ref={quillRef}
                value={value}
                onChange={handleChange}
                modules={modules}
                formats={formats}
                placeholder="" // BOLT-UI-ANPASSUNG 2025-01-15: Kein Platzhalter
                readOnly={settings.readOnly}
                theme={settings.theme}
                style={{
                  height: '1123px', // BOLT-UI-ANPASSUNG 2025-01-15: A4-Höhe
                  fontFamily: settings.fontFamily,
                  fontSize: `${settings.fontSize}px`
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Template Manager Modal */}
      <TemplateManagerModal
        isOpen={showTemplates}
        onClose={() => setShowTemplates(false)}
        onInsertTemplate={handleInsertTemplate}
        templates={templates}
        onTemplatesChange={setTemplates}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onSettingsChange={handleSettingsChange}
        currentSettings={settings}
      />
    </div>
  );
}