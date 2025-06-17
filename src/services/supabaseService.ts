import { createClient } from '@supabase/supabase-js';

// Diese Umgebungsvariablen werden automatisch von Bolt bereitgestellt
// wenn Sie auf "Connect to Supabase" klicken
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface ProfileSuggestion {
  id: string;
  category: 'berufe' | 'taetigkeiten' | 'skills' | 'softskills' | 'ausbildung';
  value: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProfileConfig {
  berufe: string[];
  taetigkeiten: string[];
  skills: string[];
  softskills: string[];
  ausbildung: string[];
}

export interface ProfileSourceMapping {
  category: 'berufe' | 'taetigkeiten' | 'skills' | 'softskills' | 'ausbildung';
  tableName: string;
  columnName: string;
  isActive: boolean;
}

export interface DatabaseStats {
  totalSuggestions: number;
  categoryCounts: { [key: string]: number };
  totalFromMappings?: number;
  mappingStats?: { [key: string]: number };
}

export interface SupabaseTable {
  table_name: string;
  columns: string[];
}

/**
 * Lädt alle verfügbaren Tabellennamen aus der Supabase-Datenbank
 * Komplett überarbeitete Tabellenerkennung mit aggressiver Suche
 */
export async function getSupabaseTableNames(forceRefresh: boolean = false): Promise<SupabaseTable[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  // Reduzierter Cache für bessere Aktualität
  const cacheKey = 'supabase_tables_cache';
  const cacheTimeKey = 'supabase_tables_cache_time';
  const cacheValidityMs = 10 * 1000; // Nur 10 Sekunden Cache

  // Prüfe Cache, außer bei forceRefresh
  if (!forceRefresh) {
    try {
      const cachedTables = localStorage.getItem(cacheKey);
      const cacheTime = localStorage.getItem(cacheTimeKey);
      
      if (cachedTables && cacheTime) {
        const timeDiff = Date.now() - parseInt(cacheTime);
        if (timeDiff < cacheValidityMs) {
          return JSON.parse(cachedTables);
        }
      }
    } catch (_error) {
      // Silent error handling
    }
  }

  try {
    // Verwende aggressive Tabellenerkennung
    const tables = await detectAllTablesAggressive();
    
    // Cache die Ergebnisse
    try {
      localStorage.setItem(cacheKey, JSON.stringify(tables));
      localStorage.setItem(cacheTimeKey, Date.now().toString());
    } catch (_error) {
      // Silent cache error
    }
    
    return tables;
  } catch (_error) {
    // Fallback zu gecachten Daten oder leerer Liste
    try {
      const cachedTables = localStorage.getItem(cacheKey);
      if (cachedTables) {
        return JSON.parse(cachedTables);
      }
    } catch (_cacheError) {
      // Silent cache error
    }
    
    return [];
  }
}

/**
 * Sichere Tabellenabfrage - behandelt nicht existierende Tabellen graceful
 */
async function safeTableQuery(tableName: string): Promise<{ exists: boolean; hasData: boolean }> {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);

    if (error) {
      // Tabelle existiert nicht (42P01) oder andere Zugriffsfehler
      if (error.code === '42P01') {
        return { exists: false, hasData: false };
      }
      // Andere Fehler (z.B. Berechtigungen) - Tabelle existiert aber ist nicht zugänglich
      return { exists: true, hasData: false };
    }

    return { exists: true, hasData: data !== null };
  } catch (error: unknown) {
    // Netzwerk- oder andere unerwartete Fehler
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code: string }).code === '42P01'
    ) {
      return { exists: false, hasData: false };
    }
    return { exists: false, hasData: false };
  }
}

/**
 * Aggressive Tabellenerkennung - findet ALLE Tabellen
 * Verwendet systematische Brute-Force-Suche mit verbesserter Fehlerbehandlung
 */
async function detectAllTablesAggressive(): Promise<SupabaseTable[]> {
  const discoveredTables: SupabaseTable[] = [];
  const tableNames = new Set<string>();

  // Strategie 1: Bekannte Tabellen aus dem Schema (ohne problematische)
  const knownTables = [
    'profile_suggestions',
    'BIS_Berufe', 
    'BIS_Berufsausbildungen_Lehrberufe',
    'BIS_Berufe_Veraltet',
    'profile_suggestions_duplicate'
  ];

  for (const tableName of knownTables) {
    const result = await safeTableQuery(tableName);
    if (result.exists) {
      tableNames.add(tableName);
    }
  }

  // Strategie 2: Systematische Suche nach häufigen Mustern (reduziert und sicherer)
  const baseNames = [
    'berufe', 'taetigkeiten', 'skills', 'softskills', 'ausbildung',
    'qualifikationen', 'kompetenzen', 'faehigkeiten', 'fertigkeiten',
    'bildung', 'weiterbildung', 'zertifikate', 'zertifizierungen',
    'jobs', 'job_titles', 'professions', 'occupations',
    'categories', 'options', 'data', 'items', 'entries',
    'suggestions', 'values', 'liste', 'list'
  ];

  const prefixes = [
    '', 'bis_', 'BIS_', 'data_', 'app_', 'profile_', 'job_', 'user_'
  ];

  const suffixes = [
    '', '_data', '_list', '_suggestions', '_options', '_categories',
    '_items', '_entries', '_values', '_table'
  ];

  // Generiere alle Kombinationen (begrenzt auf sinnvolle Anzahl)
  const candidates: string[] = [];
  
  for (const prefix of prefixes) {
    for (const base of baseNames) {
      for (const suffix of suffixes) {
        const candidate = prefix + base + suffix;
        if (!tableNames.has(candidate) && !candidates.includes(candidate)) {
          candidates.push(candidate);
        }
        
        // Auch mit Großbuchstaben am Anfang
        const capitalizedBase = base.charAt(0).toUpperCase() + base.slice(1);
        const candidateCapitalized = prefix + capitalizedBase + suffix;
        if (!tableNames.has(candidateCapitalized) && !candidates.includes(candidateCapitalized)) {
          candidates.push(candidateCapitalized);
        }
      }
    }
  }

  // Teste Kandidaten in kleineren Batches mit besserer Fehlerbehandlung
  const batchSize = 3;
  const maxCandidates = 100; // Begrenze die Anzahl der Tests
  
  for (let i = 0; i < Math.min(candidates.length, maxCandidates); i += batchSize) {
    const batch = candidates.slice(i, i + batchSize);
    
    const promises = batch.map(async (tableName) => {
      const result = await safeTableQuery(tableName);
      if (result.exists) {
        return tableName;
      }
      return null;
    });

    try {
      const results = await Promise.allSettled(promises);
      results.forEach((result) => {
        if (result.status === 'fulfilled' && result.value) {
          tableNames.add(result.value);
        }
      });
    } catch (_error) {
      // Silent error handling
    }
    
    // Längere Pause zwischen Batches um Server zu schonen
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Konvertiere gefundene Tabellennamen zu SupabaseTable-Objekten mit Spalten
  const sortedTableNames = Array.from(tableNames).sort();
  
  for (const tableName of sortedTableNames) {
    try {
      const columns = await getTableColumns(tableName);
      discoveredTables.push({
        table_name: tableName,
        columns
      });
    } catch (_error) {
      // Füge Tabelle auch ohne Spalten hinzu
      discoveredTables.push({
        table_name: tableName,
        columns: []
      });
    }
  }
  
  return discoveredTables;
}

/**
 * Lädt Spalten für eine spezifische Tabelle
 * Optimierte Spalten-Erkennung mit besserer Fehlerbehandlung
 */
export async function getTableColumns(tableName: string): Promise<string[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  try {
    // Verwende sichere Tabellenabfrage
    const result = await safeTableQuery(tableName);
    
    if (!result.exists) {
      return [];
    }

    // Versuche eine Abfrage mit Limit 1 um Spalten zu ermitteln
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);

    if (!error && data !== null) {
      if (data.length > 0) {
        const columns = Object.keys(data[0]);
        return columns;
      } else {
        // Versuche RPC-Funktion für Spalten (falls verfügbar)
        try {
          const { data: rpcData, error: rpcError } = await supabase
            .rpc('get_table_columns', { table_name: tableName });
          
          if (!rpcError && rpcData && Array.isArray(rpcData)) {
            return rpcData;
          }
        } catch (_rpcError) {
          // Silent RPC error
        }
        
        return [];
      }
    }
    
    return [];
  } catch (_error: unknown) {
    return [];
  }
}

/**
 * Lädt Profil-Vorschläge basierend auf den konfigurierten Datenquellen
 * Verbesserte Datenladung mit besserer Fehlerbehandlung
 */
export async function loadProfileSuggestions(
  sourceMappings?: ProfileSourceMapping[]
): Promise<ProfileConfig> {
  if (!isSupabaseConfigured()) {
    return getDefaultProfileConfig();
  }

  try {
    const config: ProfileConfig = {
      berufe: [],
      taetigkeiten: [],
      skills: [],
      softskills: [],
      ausbildung: [],
    };

    // Wenn keine Mappings vorhanden sind, verwende die Standard-Tabelle
    if (!sourceMappings || sourceMappings.length === 0) {
      return await loadFromDefaultTable();
    }

    // Lade Daten aus den konfigurierten Quellen
    const activeMappings = sourceMappings.filter(m => m.isActive);
    
    if (activeMappings.length === 0) {
      return getDefaultProfileConfig();
    }

    const loadPromises = activeMappings.map(async (mapping) => {
      try {
        // Prüfe zuerst, ob die Tabelle existiert
        const tableResult = await safeTableQuery(mapping.tableName);
        if (!tableResult.exists) {
          return { category: mapping.category, values: [], error: 'Table does not exist' };
        }

        const { data, error } = await supabase
          .from(mapping.tableName)
          .select(mapping.columnName)
          .order(mapping.columnName);

        if (error) {
          return { category: mapping.category, values: [], error: error.message };
        }

        if (data && config[mapping.category]) {
          const values = data
            .map(item => item[mapping.columnName])
            .filter(value => value && typeof value === 'string')
            .map(value => value.trim())
            .filter(value => value.length > 0);

          return { category: mapping.category, values, error: null };
        }
        
        return { category: mapping.category, values: [], error: 'No data found' };
      } catch (error: unknown) {
        return {
          category: mapping.category,
          values: [],
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    });

    const results = await Promise.allSettled(loadPromises);
    
    // Sammle alle erfolgreich geladenen Daten
    let hasAnyData = false;
    
    results.forEach((result) => {
      if (result.status === 'fulfilled' && result.value) {
        const { category, values, error } = result.value;
        
        if (values.length > 0) {
          // Entferne Duplikate und füge neue Werte hinzu
          config[category] = [...new Set([...config[category], ...values])];
          hasAnyData = true;
        }
      }
    });

    // Fallback zu Standard-Daten für leere Kategorien
    const defaultConfig = getDefaultProfileConfig();
    
    Object.keys(config).forEach(key => {
      const categoryKey = key as keyof ProfileConfig;
      if (config[categoryKey].length === 0) {
        config[categoryKey] = defaultConfig[categoryKey];
      }
    });

    // Wenn gar keine Daten geladen wurden, verwende komplett Standard-Konfiguration
    if (!hasAnyData) {
      return defaultConfig;
    }
    
    return config;
  } catch (_error) {
    // Alle Methoden fehlgeschlagen - verwende Standard-Konfiguration
    return getDefaultProfileConfig();
  }
}

/**
 * Lädt Daten aus der Standard-Tabelle (profile_suggestions)
 */
async function loadFromDefaultTable(): Promise<ProfileConfig> {
  try {
    // Prüfe zuerst, ob die Tabelle existiert
    const tableResult = await safeTableQuery('profile_suggestions');
    if (!tableResult.exists) {
      return getDefaultProfileConfig();
    }
    
    const { data, error } = await supabase
      .from('profile_suggestions')
      .select('category, value')
      .order('value');

    if (error) {
      // Tabelle existiert nicht oder ist nicht zugänglich - verwende Standard-Daten
      return getDefaultProfileConfig();
    }

    // Gruppiere die Daten nach Kategorien
    const config: ProfileConfig = {
      berufe: [],
      taetigkeiten: [],
      skills: [],
      softskills: [],
      ausbildung: [],
    };

    data?.forEach((suggestion) => {
      if (config[suggestion.category]) {
        config[suggestion.category].push(suggestion.value);
      }
    });

    // Fallback zu Standard-Daten für leere Kategorien
    const defaultConfig = getDefaultProfileConfig();
    Object.keys(config).forEach(key => {
      const categoryKey = key as keyof ProfileConfig;
      if (config[categoryKey].length === 0) {
        config[categoryKey] = defaultConfig[categoryKey];
      }
    });
    
    return config;
  } catch (_error) {
    // Fehler beim Laden - verwende Standard-Konfiguration
    return getDefaultProfileConfig();
  }
}

/**
 * Testet eine spezifische Tabellen-Spalten-Kombination
 */
export async function testTableColumnMapping(
  tableName: string, 
  columnName: string
): Promise<{ success: boolean; sampleData: string[]; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { success: false, sampleData: [], error: 'Supabase ist nicht konfiguriert' };
  }

  try {
    // Prüfe zuerst, ob die Tabelle existiert
    const tableResult = await safeTableQuery(tableName);
    if (!tableResult.exists) {
      return { 
        success: false, 
        sampleData: [], 
        error: `Tabelle '${tableName}' existiert nicht in der Datenbank` 
      };
    }
    
    const { data, error } = await supabase
      .from(tableName)
      .select(columnName)
      .limit(5);

    if (error) {
      return { 
        success: false, 
        sampleData: [], 
        error: `Fehler beim Zugriff auf ${tableName}.${columnName}: ${error.message}` 
      };
    }

    if (!data) {
      return { 
        success: false, 
        sampleData: [], 
        error: 'Keine Daten erhalten' 
      };
    }

    const sampleData = data
      .map(item => item[columnName])
      .filter(value => value && typeof value === 'string')
      .map(value => value.trim())
      .filter(value => value.length > 0);

    return {
      success: true,
      sampleData,
      error: sampleData.length === 0 ? 'Spalte enthält keine gültigen Textdaten' : undefined
    };
  } catch (error: unknown) {
    return {
      success: false,
      sampleData: [],
      error: `Unerwarteter Fehler: ${error instanceof Error ? error.message : 'Unbekannt'}`
    };
  }
}

/**
 * Invalidiert den Tabellen-Cache
 */
export function invalidateTableCache(): void {
  try {
    localStorage.removeItem('supabase_tables_cache');
    localStorage.removeItem('supabase_tables_cache_time');
  } catch (_error) {
    // Silent cache error
  }
}

/**
 * Fügt einen neuen Profil-Vorschlag hinzu
 */
export async function addProfileSuggestion(
  category: ProfileSuggestion['category'],
  value: string
): Promise<ProfileSuggestion | null> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase ist nicht konfiguriert');
  }

  // Prüfe zuerst, ob die Tabelle existiert
  const tableResult = await safeTableQuery('profile_suggestions');
  if (!tableResult.exists) {
    throw new Error('Die Tabelle profile_suggestions existiert nicht in der Datenbank');
  }

  // Prüfe, ob der Vorschlag bereits existiert
  const { data: existing } = await supabase
    .from('profile_suggestions')
    .select('id')
    .eq('category', category)
    .eq('value', value)
    .single();

  if (existing) {
    throw new Error('Dieser Vorschlag existiert bereits in dieser Kategorie.');
  }

  const { data, error } = await supabase
    .from('profile_suggestions')
    .insert([
      {
        category,
        value: value.trim(),
        is_default: false,
      },
    ])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Entfernt einen Profil-Vorschlag
 */
export async function removeProfileSuggestion(
  category: ProfileSuggestion['category'],
  value: string
): Promise<void> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase ist nicht konfiguriert');
  }

  // Prüfe zuerst, ob die Tabelle existiert
  const tableResult = await safeTableQuery('profile_suggestions');
  if (!tableResult.exists) {
    throw new Error('Die Tabelle profile_suggestions existiert nicht in der Datenbank');
  }

  const { error } = await supabase
    .from('profile_suggestions')
    .delete()
    .eq('category', category)
    .eq('value', value);

  if (error) {
    throw error;
  }
}

/**
 * Lädt Vorschläge für eine bestimmte Kategorie
 */
export async function loadSuggestionsByCategory(
  category: ProfileSuggestion['category']
): Promise<string[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  try {
    // Prüfe zuerst, ob die Tabelle existiert
    const tableResult = await safeTableQuery('profile_suggestions');
    if (!tableResult.exists) {
      return [];
    }

    const { data, error } = await supabase
      .from('profile_suggestions')
      .select('value')
      .eq('category', category)
      .order('value');

    if (error) {
      return [];
    }

    return data?.map((item) => item.value) || [];
  } catch (_error) {
    return [];
  }
}

/**
 * Sucht nach Vorschlägen basierend auf einem Suchbegriff
 */
export async function searchProfileSuggestions(
  category: ProfileSuggestion['category'],
  searchTerm: string
): Promise<string[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  try {
    // Prüfe zuerst, ob die Tabelle existiert
    const tableResult = await safeTableQuery('profile_suggestions');
    if (!tableResult.exists) {
      return [];
    }

    const { data, error } = await supabase
      .from('profile_suggestions')
      .select('value')
      .eq('category', category)
      .ilike('value', `%${searchTerm}%`)
      .order('value')
      .limit(20);

    if (error) {
      return [];
    }

    return data?.map((item) => item.value) || [];
  } catch (_error) {
    return [];
  }
}

/**
 * Prüft, ob Supabase konfiguriert ist
 */
export function isSupabaseConfigured(): boolean {
  return !!(supabaseUrl && supabaseAnonKey && 
           supabaseUrl !== 'your-supabase-url' && 
           supabaseUrl !== 'undefined' &&
           supabaseAnonKey !== 'your-anon-key' &&
           supabaseAnonKey !== 'undefined');
}

/**
 * Testet die Datenbankverbindung
 */
export async function testDatabaseConnection(): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    return false;
  }

  try {
    // Versuche eine einfache Abfrage auf die profile_suggestions Tabelle
    const result = await safeTableQuery('profile_suggestions');
    return result.exists;
  } catch (_error) {
    return false;
  }
}

/**
 * Lädt erweiterte Datenbank-Statistiken
 * Berücksichtigt jetzt auch die konfigurierten Mappings
 */
export async function getDatabaseStats(sourceMappings?: ProfileSourceMapping[]): Promise<DatabaseStats> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase ist nicht konfiguriert');
  }

  // Prüfe zuerst, ob die Standard-Tabelle existiert
  const tableResult = await safeTableQuery('profile_suggestions');
  let totalCount = 0;
  let categoryData: Record<string, unknown>[] = []; // generic record for dynamic columns

    if (tableResult.exists) {
      // Gesamtanzahl der Vorschläge aus Standard-Tabelle
      const { count: totalCountResult, error: totalError } = await supabase
        .from('profile_suggestions')
        .select('*', { count: 'exact', head: true });

      if (!totalError) {
        totalCount = totalCountResult || 0;
      }

      // Anzahl pro Kategorie aus Standard-Tabelle
      const { data: categoryDataResult, error: categoryError } = await supabase
        .from('profile_suggestions')
        .select('category')
        .order('category');

      if (!categoryError) {
        categoryData = categoryDataResult || [];
      }
    }

    // Zähle Kategorien aus Standard-Tabelle
    const categoryCounts: { [key: string]: number } = {};
    categoryData.forEach((item) => {
      categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
    });

    // Zusätzliche Statistiken aus konfigurierten Mappings
    let totalFromMappings = 0;
    const mappingStats: { [key: string]: number } = {};

    if (sourceMappings && sourceMappings.length > 0) {
      const activeMappings = sourceMappings.filter(m => m.isActive);
      
      for (const mapping of activeMappings) {
        try {
          const tableResult = await safeTableQuery(mapping.tableName);
          if (tableResult.exists) {
            const { count, error } = await supabase
              .from(mapping.tableName)
              .select('*', { count: 'exact', head: true });

            if (!error && count !== null) {
              const mappingKey = `${mapping.tableName}.${mapping.columnName}`;
              mappingStats[mappingKey] = count;
              totalFromMappings += count;
            }
          }
        } catch (_error) {
          // Silent error handling
        }
      }
    }

  const stats: DatabaseStats = {
    totalSuggestions: totalCount,
    categoryCounts,
    totalFromMappings,
    mappingStats
  };

  return stats;
}

/**
 * Standard-Profil-Konfiguration als Fallback
 */
function getDefaultProfileConfig(): ProfileConfig {
  return {
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
}

/**
 * Exportiert alle Profil-Vorschläge als JSON
 */
export async function exportProfileSuggestions(): Promise<ProfileSuggestion[]> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase ist nicht konfiguriert');
  }

  // Prüfe zuerst, ob die Tabelle existiert
  const tableResult = await safeTableQuery('profile_suggestions');
  if (!tableResult.exists) {
    throw new Error('Die Tabelle profile_suggestions existiert nicht in der Datenbank');
  }

  const { data, error } = await supabase
    .from('profile_suggestions')
    .select('*')
    .order('category, value');

  if (error) {
    throw error;
  }

  return data || [];
}

/**
 * Importiert Profil-Vorschläge aus einem JSON-Array
 */
export async function importProfileSuggestions(suggestions: Omit<ProfileSuggestion, 'id' | 'created_at' | 'updated_at'>[]): Promise<void> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase ist nicht konfiguriert');
  }

  // Prüfe zuerst, ob die Tabelle existiert
  const tableResult = await safeTableQuery('profile_suggestions');
  if (!tableResult.exists) {
    throw new Error('Die Tabelle profile_suggestions existiert nicht in der Datenbank');
  }

  const { error } = await supabase
    .from('profile_suggestions')
    .insert(suggestions);

  if (error) {
    throw error;
  }
}