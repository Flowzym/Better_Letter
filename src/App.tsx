import React, { useState, useEffect, useCallback } from 'react';
import { User, Briefcase, Sparkles, AlertTriangle, Settings } from 'lucide-react';
import InputSection from './components/InputSection';
import CoverLetterDisplay from './components/CoverLetterDisplay';
import StyleSelector from './components/StyleSelector';
import DocumentTypeSelector from './components/DocumentTypeSelector';
import SettingsPage from './components/SettingsPage';
import { generateCoverLetter, editCoverLetter } from './services/mistralService';
import {
  loadProfileSuggestions,
  isSupabaseConfigured,
  ProfileConfig,
  ProfileSourceMapping,
  DatabaseStats,
  testDatabaseConnection,
  getDatabaseStats
} from './services/supabaseService';

const DEFAULT_DOCUMENT_TYPES = {
  standard: {
    label: 'Normales Bewerbungsschreiben',
    prompt: `Du bist ein Experte für Bewerbungsschreiben. Erstelle ein professionelles, individuelles Bewerbungsschreiben basierend auf folgenden Informationen:

Erstelle ein überzeugendes Bewerbungsschreiben, das:
- Die relevanten Erfahrungen und Fähigkeiten aus dem Lebenslauf hervorhebt
- Konkret auf die Anforderungen der Stellenanzeige eingeht
- Professionell und authentisch klingt
- Eine klare Struktur mit Einleitung, Hauptteil und Schluss hat
- Motivation und Interesse für die Position zum Ausdruck bringt

Das Bewerbungsschreiben soll in deutscher Sprache verfasst werden und professionellen Standards entsprechen.`
  },
  berufsfern: {
    label: 'Bewerbung für berufsferne Stellen',
    prompt: `Du bist ein Experte für Bewerbungsschreiben. Erstelle ein professionelles Bewerbungsschreiben für eine berufsferne Stelle basierend auf folgenden Informationen:

Erstelle ein überzeugendes Bewerbungsschreiben, das:
- Transferable Skills und übertragbare Kompetenzen aus dem bisherigen Werdegang hervorhebt
- Motivation für den Berufswechsel authentisch begründet
- Lernbereitschaft und Anpassungsfähigkeit betont
- Soft Skills und persönliche Eigenschaften in den Vordergrund stellt
- Zeigt, wie bisherige Erfahrungen in neuen Kontext übertragen werden können
- Interesse an der neuen Branche/dem neuen Bereich glaubhaft vermittelt

Das Bewerbungsschreiben soll trotz berufsferner Ausrichtung professionell und überzeugend wirken.`
  },
  initiativ: {
    label: 'Initiativbewerbung',
    prompt: `Du bist ein Experte für Bewerbungsschreiben. Erstelle ein professionelles Initiativbewerbungsschreiben basierend auf folgenden Informationen:

Erstelle ein überzeugendes Initiativbewerbungsschreiben, das:
- Eigeninitiative und proaktives Handeln demonstriert
- Interesse am Unternehmen und dessen Werten/Zielen zeigt
- Mehrwert für das Unternehmen klar kommuniziert
- Flexibilität bezüglich verschiedener Einsatzbereiche ausdrückt
- Motivation für die Kontaktaufnahme überzeugend begründet
- Bereitschaft für ein Kennenlerngespräch signalisiert
- Auch ohne konkrete Stellenausschreibung professionell wirkt

Das Initiativbewerbungsschreiben soll neugierig machen und zum Gespräch einladen.`
  },
  ausbildung: {
    label: 'Motivationsschreiben für Ausbildung',
    prompt: `Du bist ein Experte für Bewerbungsschreiben. Erstelle ein professionelles Motivationsschreiben für eine Ausbildung basierend auf folgenden Informationen:

Erstelle ein überzeugendes Motivationsschreiben, das:
- Motivation für die gewählte Ausbildung authentisch begründet
- Interesse am Berufsbild und der Branche zeigt
- Lernbereitschaft und Engagement hervorhebt
- Relevante Vorerfahrungen (Praktika, Schule, Hobbys) einbezieht
- Persönliche Stärken und Eigenschaften für die Ausbildung betont
- Ziele und Vorstellungen für die berufliche Zukunft ausdrückt
- Begeisterung für praktisches Lernen und Arbeiten vermittelt

Das Motivationsschreiben soll jugendlich-authentisch, aber dennoch professionell wirken.`
  },
  praktikum: {
    label: 'Bewerbung für Praktikum',
    prompt: `Du bist ein Experte für Bewerbungsschreiben. Erstelle ein professionelles Praktikumsbewerbungsschreiben basierend auf folgenden Informationen:

Erstelle ein überzeugendes Praktikumsbewerbungsschreiben, das:
- Lernziele und Interesse am Praktikumsbereich klar definiert
- Motivation für das spezifische Unternehmen/die Organisation zeigt
- Bisherige relevante Erfahrungen (auch aus Schule/Studium) einbezieht
- Bereitschaft zu lernen und sich einzubringen betont
- Praktische Anwendung von theoretischem Wissen anstrebt
- Flexibilität und Anpassungsfähigkeit ausdrückt
- Dankbarkeit für die Lernmöglichkeit vermittelt

Das Praktikumsbewerbungsschreiben soll motiviert und lernbegierig wirken.`
  },
  aqua: {
    label: 'Arbeitsplatznahe Qualifizierung (AQUA)',
    prompt: `Du bist ein Experte für Bewerbungsschreiben. Erstelle ein professionelles Bewerbungsschreiben für eine arbeitsplatznahe Qualifizierung (AQUA) basierend auf folgenden Informationen:

Erstelle ein überzeugendes Bewerbungsschreiben, das:
- Motivation für berufliche Weiterentwicklung und Qualifizierung zeigt
- Bereitschaft zur Veränderung und zum Lernen betont
- Bisherige Berufserfahrung als Grundlage für Weiterentwicklung nutzt
- Interesse an praktischer, arbeitsplatznaher Qualifizierung ausdrückt
- Ziele für die berufliche Neuorientierung klar formuliert
- Engagement und Durchhaltevermögen vermittelt
- Dankbarkeit für die Förderungsmöglichkeit zeigt

Das Bewerbungsschreiben soll Entwicklungspotential und Motivation für berufliche Neuausrichtung vermitteln.`
  }
};

const DEFAULT_EDIT_PROMPTS = {
  shorter: { 
    label: 'Kürzer', 
    prompt: 'Mache den folgenden Text kürzer und prägnanter, ohne wichtige Informationen zu verlieren:' 
  },
  longer: { 
    label: 'Länger', 
    prompt: 'Erweitere den folgenden Text mit mehr Details und Ausführungen:' 
  },
  simpler: { 
    label: 'Einfacher', 
    prompt: 'Vereinfache die Sprache des folgenden Textes und verwende einfachere Wörter:' 
  },
  complex: { 
    label: 'Komplexer', 
    prompt: 'Verwende eine gehobenere und komplexere Sprache für den folgenden Text:' 
  },
  b1: { 
    label: 'B1-Niveau', 
    prompt: 'Schreibe den folgenden Text auf B1-Sprachniveau um (mittleres Deutsch):' 
  },
};

const DEFAULT_STYLE_PROMPTS = {
  sachlich: { 
    label: 'Sachlich/Klassisch', 
    prompt: 'sachlichen und klassischen Stil mit formeller, professioneller Sprache' 
  },
  motiviert: { 
    label: 'Motiviert', 
    prompt: 'motivierten und enthusiastischen Stil mit positiver, energiegeladener Sprache' 
  },
  unkonventionell: { 
    label: 'Unkonventionell', 
    prompt: 'unkonventionellen und kreativen Stil mit originellen Formulierungen' 
  },
  foerderkontext: { 
    label: 'Förderkontext', 
    prompt: 'für Fördermaßnahmen geeigneten Stil mit Betonung auf Entwicklungspotential und Lernbereitschaft' 
  },
  ausbildung: { 
    label: 'Ausbildung', 
    prompt: 'für Ausbildungsplätze passenden Stil mit Fokus auf Motivation und Lernwillen' 
  },
  aqua: { 
    label: 'AQUA', 
    prompt: 'für AQUA-Maßnahmen angemessenen Stil mit Betonung auf berufliche Neuorientierung' 
  },
  lehrstelle: { 
    label: 'Lehrstelle', 
    prompt: 'für Lehrstellen optimierten Stil mit Fokus auf praktisches Lernen und Engagement' 
  },
};

const DEFAULT_PROFILE_CONFIG: ProfileConfig = {
  berufe: [
    'Softwareentwickler', 'Projektmanager', 'Marketing Manager', 'Vertriebsmitarbeiter', 'Buchhalter',
    'Personalreferent', 'Grafik Designer', 'Kundenberater', 'Teamleiter', 'Sachbearbeiter',
    'Ingenieur', 'Techniker', 'Analyst', 'Berater', 'Koordinator', 'Verkäufer', 'Friseur',
    'Koch', 'Krankenpfleger', 'Lehrer', 'Mechaniker', 'Elektriker', 'Bauarbeiter', 'Reinigungskraft'
  ],
  taetigkeiten: [
    'Programmierung', 'Projektleitung', 'Kundenbetreuung', 'Datenanalyse', 'Qualitätssicherung',
    'Teamführung', 'Budgetplanung', 'Prozessoptimierung', 'Schulungen', 'Dokumentation',
    'Berichtswesen', 'Konzeptentwicklung', 'Marktanalyse', 'Verhandlungsführung', 'Präsentationen',
    'Verkauf', 'Beratung', 'Administration', 'Wartung', 'Installation'
  ],
  skills: [
    'Microsoft Office', 'Excel', 'PowerPoint', 'SAP', 'CRM-Systeme', 'SQL', 'Python', 'Java',
    'HTML/CSS', 'Adobe Creative Suite', 'AutoCAD', 'Projektmanagement-Tools', 'ERP-Systeme',
    'Datenbanken', 'Webentwicklung', 'Social Media Marketing', 'SEO/SEM', 'Buchhaltungssoftware',
    'Photoshop', 'Word', 'Outlook', 'PowerBI', 'Tableau'
  ],
  softskills: [
    'Teamfähigkeit', 'Kommunikationsstärke', 'Problemlösungskompetenz', 'Organisationstalent',
    'Flexibilität', 'Belastbarkeit', 'Eigeninitiative', 'Zuverlässigkeit', 'Kreativität',
    'Analytisches Denken', 'Empathie', 'Führungsqualitäten', 'Zeitmanagement', 'Lernbereitschaft',
    'Kundenorientierung', 'Konfliktfähigkeit', 'Präsentationsfähigkeiten', 'Verhandlungsgeschick',
    'Stressresistenz', 'Durchsetzungsvermögen'
  ],
  ausbildung: [
    'Bachelor Informatik', 'Master BWL', 'Ausbildung Kaufmann/-frau für Büromanagement', 'Fachhochschulreife',
    'Abitur', 'Realschulabschluss', 'Hauptschulabschluss', 'Promotion', 'MBA', 'Techniker',
    'Meister', 'IHK-Zertifikat', 'Sprachzertifikat', 'IT-Zertifizierung', 'Weiterbildung',
    'Umschulung', 'Praktikum', 'Volontariat', 'Trainee-Programm', 'Duales Studium',
    'Bachelor BWL', 'Master Informatik', 'Fachinformatiker', 'Industriekaufmann'
  ]
};

// Helper function to merge profile config with defaults
const loadProfileConfigFromStorage = () => {
  try {
    const saved = localStorage.getItem('profileConfig');
    if (!saved) {
      return DEFAULT_PROFILE_CONFIG;
    }
    
    const savedConfig = JSON.parse(saved);
    
    // Merge with defaults to ensure all required arrays exist
    const mergedConfig = {
      berufe: Array.isArray(savedConfig.berufe) ? savedConfig.berufe : DEFAULT_PROFILE_CONFIG.berufe,
      taetigkeiten: Array.isArray(savedConfig.taetigkeiten) ? savedConfig.taetigkeiten : DEFAULT_PROFILE_CONFIG.taetigkeiten,
      skills: Array.isArray(savedConfig.skills) ? savedConfig.skills : DEFAULT_PROFILE_CONFIG.skills,
      softskills: Array.isArray(savedConfig.softskills) ? savedConfig.softskills : DEFAULT_PROFILE_CONFIG.softskills,
      ausbildung: Array.isArray(savedConfig.ausbildung) ? savedConfig.ausbildung : DEFAULT_PROFILE_CONFIG.ausbildung,
    };
    
    return mergedConfig;
  } catch (error) {
    console.error('Error loading profileConfig from localStorage:', error);
    return DEFAULT_PROFILE_CONFIG;
  }
};

// Helper function to load profile source mappings from localStorage
const loadProfileSourceMappingsFromStorage = (): ProfileSourceMapping[] => {
  try {
    const saved = localStorage.getItem('profileSourceMappings');
    if (!saved) {
      return [];
    }
    
    const savedMappings = JSON.parse(saved);
    return Array.isArray(savedMappings) ? savedMappings : [];
  } catch (error) {
    console.error('Error loading profileSourceMappings from localStorage:', error);
    return [];
  }
};

// Helper functions for localStorage
function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const saved = localStorage.getItem(key);
    return saved ? (JSON.parse(saved) as T) : defaultValue;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
}

function App() {
  const [cvContent, setCvContent] = useState('');
  const [jobContent, setJobContent] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [databaseStats, setDatabaseStats] = useState<DatabaseStats | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  
  // Load settings from localStorage with defaults
  const [documentTypes, setDocumentTypes] = useState(() => 
    loadFromStorage('documentTypes', DEFAULT_DOCUMENT_TYPES)
  );
  const [selectedDocumentType, setSelectedDocumentType] = useState(() => 
    loadFromStorage('selectedDocumentType', 'standard')
  );
  const [editPrompts, setEditPrompts] = useState(() => 
    loadFromStorage('editPrompts', DEFAULT_EDIT_PROMPTS)
  );
  const [stylePrompts, setStylePrompts] = useState(() => 
    loadFromStorage('stylePrompts', DEFAULT_STYLE_PROMPTS)
  );
  const [profileConfig, setProfileConfig] = useState<ProfileConfig>(() => 
    loadProfileConfigFromStorage()
  );
  const [profileSourceMappings, setProfileSourceMappings] = useState<ProfileSourceMapping[]>(() =>
    loadProfileSourceMappingsFromStorage()
  );
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);

  useEffect(() => {
    const input = document.getElementById('dummy-initial-blur') as HTMLInputElement | null;
    if (input) {
      input.focus();
      setTimeout(() => input.blur(), 10);
    }
  }, []);

  // Load database statistics if Supabase is configured
  useEffect(() => {
    const loadStats = async () => {
      if (isSupabaseConfigured()) {
        try {
          const isConnected = await testDatabaseConnection();

          if (isConnected) {
            try {
              const stats = await getDatabaseStats(profileSourceMappings);
              setDatabaseStats(stats);
            } catch (error) {
              console.error('Failed to load database stats:', error);
            }
          }
        } catch {
          // Ignore connection errors; stats remain null
        }
      }
    };

    loadStats();
  }, [profileSourceMappings]);

  // Load profile suggestions from Supabase on component mount
  useEffect(() => {
    const loadProfileData = async () => {
        if (isSupabaseConfigured()) {
          try {
            console.log('Loading profile data with mappings:', profileSourceMappings);
            const supabaseConfig = await loadProfileSuggestions(profileSourceMappings, true); // Force refresh
            console.log('Loaded profile config:', supabaseConfig);
            setProfileConfig(supabaseConfig);
            // Don't save to localStorage when using Supabase
          } catch (error) {
            console.error('Failed to load profile suggestions from Supabase:', error);
            // Keep using localStorage fallback
          }
        }
      };

    loadProfileData();
  }, [profileSourceMappings]);

  // Save settings to localStorage whenever they change (except profileConfig when using Supabase)
  useEffect(() => {
    saveToStorage('documentTypes', documentTypes);
  }, [documentTypes]);

  useEffect(() => {
    saveToStorage('selectedDocumentType', selectedDocumentType);
  }, [selectedDocumentType]);

  useEffect(() => {
    saveToStorage('editPrompts', editPrompts);
  }, [editPrompts]);

  useEffect(() => {
    saveToStorage('stylePrompts', stylePrompts);
  }, [stylePrompts]);

  useEffect(() => {
    // Only save to localStorage if Supabase is not configured
    if (!isSupabaseConfigured()) {
      saveToStorage('profileConfig', profileConfig);
    }
  }, [profileConfig]);

  useEffect(() => {
    saveToStorage('profileSourceMappings', profileSourceMappings);
  }, [profileSourceMappings]);

  // ✅ KORRIGIERT: Memoisiere handleGenerate mit useCallback
  const handleGenerate = useCallback(async () => {
    if (!cvContent.trim() || !jobContent.trim()) {
      setError('Bitte füllen Sie sowohl den Lebenslauf als auch die Stellenanzeige aus.');
      return;
    }

    setIsGenerating(true);
    setError('');
    
    try {
      const basePrompt = documentTypes[selectedDocumentType]?.prompt || documentTypes.standard.prompt;
      
      const result = await generateCoverLetter({
        cvContent: cvContent.trim(),
        jobDescription: jobContent.trim(),
        basePrompt,
        styles: selectedStyles,
        stylePrompts: Object.fromEntries(
          Object.entries(stylePrompts).map(([key, value]) => [key, value.prompt])
        ),
      });
      setCoverLetter(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein unerwarteter Fehler ist aufgetreten.');
    } finally {
      setIsGenerating(false);
    }
  }, [cvContent, jobContent, documentTypes, selectedDocumentType, selectedStyles, stylePrompts]);

  // ✅ KORRIGIERT: Memoisiere handleEdit mit useCallback
  const handleEdit = useCallback(async (instruction: string) => {
    if (!coverLetter.trim()) return;

    setIsEditing(true);
    setError('');
    
    try {
      const result = await editCoverLetter(coverLetter, instruction);
      setCoverLetter(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler beim Bearbeiten ist aufgetreten.');
    } finally {
      setIsEditing(false);
    }
  }, [coverLetter]);

  // ✅ KORRIGIERT: Memoisiere handleDirectContentChange mit useCallback
  const handleDirectContentChange = useCallback((newContent: string) => {
    setCoverLetter(newContent);
  }, []);



  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* BOLT-UI-ANPASSUNG 2025-01-15: Header - Titel und Icon linksbündig, Header kleiner */}
        <div className="relative mb-8">
          {/* BOLT-UI-ANPASSUNG 2025-01-15: Nur Zahnradsymbol oben rechts */}
          <div className="absolute top-0 right-0">
            <button
              onClick={() => setShowSettings(true)}
              className="flex items-center p-2 bg-white rounded-lg shadow-sm border hover:bg-gray-50 transition-colors duration-200"
              title="App-Konfiguration öffnen"
            >
              <Settings className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          
          {/* BOLT-UI-ANPASSUNG 2025-01-15: Titel und Logo linksbündig und kleiner */}
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-orange-500 p-2 rounded-xl shadow-lg" style={{ backgroundColor: '#F29400' }}>
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Bewerbungsschreiben Generator
            </h1>
          </div>
        </div>

        {/* Settings Modal */}
        <SettingsPage
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          documentTypes={documentTypes}
          onDocumentTypesChange={setDocumentTypes}
          editPrompts={editPrompts}
          onEditPromptsChange={setEditPrompts}
          stylePrompts={stylePrompts}
          onStylePromptsChange={setStylePrompts}
          profileSourceMappings={profileSourceMappings}
          onProfileSourceMappingsChange={setProfileSourceMappings}
        />

        {/* Document Type Selector */}
        <DocumentTypeSelector
          documentTypes={documentTypes}
          selectedType={selectedDocumentType}
          onTypeChange={setSelectedDocumentType}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* CV Input */}
          <InputSection
            title="Lebenslauf / Profil"
            icon={<User className="h-6 w-6 text-orange-600" />}
            onContentChange={setCvContent}
            placeholder="Geben Sie hier Ihre beruflichen Erfahrungen, Qualifikationen, Fähigkeiten und relevanten Informationen aus Ihrem Lebenslauf ein..."
            isProfileSection={true}
            profileConfig={profileConfig}
          />

          {/* Job Description Input */}
          <InputSection
            title="Stellenanzeige"
            icon={<Briefcase className="h-6 w-6 text-orange-600" />}
            onContentChange={setJobContent}
            placeholder="Fügen Sie hier die Stellenanzeige ein, einschließlich Anforderungen, Aufgaben und Unternehmensinfos..."
            showUrlInput={true}
            profileConfig={profileConfig}
          />
        </div>

        {/* Style Selector */}
        <StyleSelector
          selectedStyles={selectedStyles}
          onStylesChange={setSelectedStyles}
          stylePrompts={stylePrompts}
        />

        {/* Generate Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !cvContent.trim() || !jobContent.trim()}
            className="flex items-center space-x-3 px-8 py-4 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200 shadow-lg"
            style={{ 
              backgroundColor: '#F29400',
              ':hover': { backgroundColor: '#E8850C' }
            } as React.CSSProperties}
          >
            {/* BOLT-UI-ANPASSUNG 2025-01-15: Animation beim Generieren */}
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span className="text-lg">Wird generiert...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                <span className="text-lg">Bewerbungsschreiben generieren</span>
              </>
            )}
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-red-700">
              <AlertTriangle className="h-5 w-5 flex-shrink-0" />
              <p className="font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Cover Letter Display */}
        <input
          type="text"
          id="dummy-initial-blur"
          style={{ opacity: 0, position: "absolute", top: 0, left: 0, zIndex: -1, width: 1, height: 1 }}
          tabIndex={-1}
          aria-hidden="true"
        />
        <CoverLetterDisplay
          content={coverLetter}
          isLoading={isGenerating}
          isEditing={isEditing}
          onEdit={handleEdit}
          onContentChange={handleDirectContentChange}
          editPrompts={editPrompts}
        />

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-gray-500">
            Powered by Mistral AI • Quill Editor
            {isSupabaseConfigured() && (
              <span className="ml-2">• Profil-Daten von Supabase</span>
            )}
            {profileSourceMappings.length > 0 && (
              <span className="ml-2">• {profileSourceMappings.filter(m => m.isActive).length} aktive Datenquellen</span>
            )}
            {databaseStats && databaseStats.totalFromMappings > 0 && (
              <span className="ml-2">• {databaseStats.totalFromMappings.toLocaleString('de-DE')} Mapping-Einträge</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
