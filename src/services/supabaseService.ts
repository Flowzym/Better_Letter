import { supabase } from '../lib/supabase';
import { KIModelSettings } from '../types/KIModelSettings';

// --- Types --------------------------------------------------------------
export interface ProfileConfig {
  berufe: string[];
  taetigkeiten: string[];
  skills: string[];
  softskills: string[];
  ausbildung: string[];
}

export interface ProfileSourceMapping {
  category: keyof ProfileConfig;
  tableName: string;
  columnName: string;
  isActive: boolean;
}

export interface DatabaseStats {
  totalSuggestions: number;
  categoryCounts: Record<string, number>;
}

export interface SupabaseTable {
  table_name: string;
  columns: string[];
}

// -----------------------------------------------------------------------
// Data helpers
async function getFieldMappings(): Promise<any[]> {
  const { data, error } = await supabase.from('field_mappings').select('*');
  if (error) {
    console.error('Fehler beim Laden der Field-Mappings:', error.message);
    return [];
  }
  return data ?? [];
}

async function getPromptTemplates(): Promise<any[]> {
  const { data, error } = await supabase.from('prompts').select('*');
  if (error) {
    console.error('Fehler beim Laden der Prompt-Vorlagen:', error.message);
    return [];
  }
  return data ?? [];
}

// --- Cache helpers -----------------------------------------------------
const TABLE_CACHE_DURATION = 30000; // 30s
let tableCache: { timestamp: number; tables: SupabaseTable[] } | null = null;
const columnCache: Record<string, { timestamp: number; columns: string[] }> = {};

async function loadKIConfigs(): Promise<KIModelSettings[]> {
  const { data, error } = await supabase.from("ki_settings").select("*");
  if (error) {
    console.error("Fehler beim Laden der KI-Konfigurationen:", error.message);
    return [];
  }
  return data ?? [];
}

async function saveKIConfigs(models: KIModelSettings[]) {
  const { error } = await supabase.from("ki_settings").upsert(models, {
    onConflict: "id",
  });
  if (error) {
    console.error("Fehler beim Speichern der KI-Konfigurationen:", error.message);
  }
}

// -----------------------------------------------------------------------
// Supabase table & column helpers
async function getTableColumns(tableName: string): Promise<string[]> {
  const cached = columnCache[tableName];
  if (cached && Date.now() - cached.timestamp < TABLE_CACHE_DURATION) {
    return cached.columns;
  }

  const columns = await fetchTableColumns(tableName);
  columnCache[tableName] = { timestamp: Date.now(), columns };
  return columns;
}

async function getSupabaseTableNames(forceRefresh = false): Promise<SupabaseTable[]> {
  if (!forceRefresh && tableCache && Date.now() - tableCache.timestamp < TABLE_CACHE_DURATION) {
    return tableCache.tables;
  }

  const { data, error } = await supabase
    .from('available_tables')
    .select('table_name');

  if (error) {
    console.error('Error fetching tables:', error.message);
    return [];
  }

  const tables: SupabaseTable[] = [];
  for (const row of data as { table_name: string }[]) {
    const columns = await getTableColumns(row.table_name);
    tables.push({ table_name: row.table_name, columns });
  }

  tableCache = { timestamp: Date.now(), tables };
  return tables;
}

function invalidateTableCache() {
  tableCache = null;
}

async function testTableColumnMapping(table: string, column: string) {
  const { data, error } = await supabase.from(table).select(column).limit(5);
  if (error) {
    console.error('Mapping test failed:', error.message);
    return { success: false, sampleData: [], error: error.message };
  }
  const samples = (data as Record<string, unknown>[]).map((r) => String(r[column] ?? ''));
  return { success: true, sampleData: samples };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getDatabaseStats(): Promise<any> {
  const { data, error } = await supabase
    .from("system_status")
    .select("*")
    .order("timestamp", { ascending: false })
    .limit(1);

  if (error) {
    console.error(
      "Fehler beim Abrufen der Datenbankstatistiken:",
      error.message
    );
    return null;
  }

  return data?.[0] ?? null;
}

function isSupabaseConfigured(): boolean {
  return Boolean(
    import.meta.env.VITE_SUPABASE_URL &&
    import.meta.env.VITE_SUPABASE_ANON_KEY
  );
}

async function loadProfileSuggestions(
  mappings: ProfileSourceMapping[] = []
): Promise<ProfileConfig> {
  const result: ProfileConfig = {
    berufe: [],
    taetigkeiten: [],
    skills: [],
    softskills: [],
    ausbildung: [],
  };

  for (const m of mappings.filter((m) => m.isActive)) {
    try {
      const { data } = await supabase.from(m.tableName).select(m.columnName);
      const values = (data as Record<string, unknown>[]).map((r) =>
        String(r[m.columnName] ?? '')
      );
      result[m.category] = [...result[m.category], ...values];
    } catch (err) {
      console.error('Error loading profile suggestions:', err);
    }
  }

  return result;
}

async function testSupabaseConnection(): Promise<boolean> {
  const { error } = await supabase.from('ki_settings').select('id').limit(1);
  if (error) {
    console.error('Fehler beim Testen der Supabase-Verbindung:', error.message);
    return false;
  }
  return true;
}

async function fetchTableColumns(tableName: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('available_columns')
    .select('column_name')
    .eq('table_name', tableName)
    .order('column_name');

  if (error) {
    console.error('Error fetching table columns:', error.message);
    return [];
  }

  return (data as { column_name: string }[]).map((row) => row.column_name);
}

export {
  loadKIConfigs,
  saveKIConfigs,
  isSupabaseConfigured,
  loadProfileSuggestions,
  testSupabaseConnection,
  fetchTableColumns,
  getSupabaseTableNames,
  invalidateTableCache,
  getTableColumns,
  testTableColumnMapping,
  getFieldMappings,
  getPromptTemplates,
};
