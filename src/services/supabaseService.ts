import { supabase } from "../lib/supabase";
import { KIModelSettings } from "../types/KIModelSettings";

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getDatabaseStats(): Promise<any> {
  const { data, error } = await supabase
    .from("usage_stats")
    .select("*")
    .order("timestamp", { ascending: false })
    .limit(1);

  if (error) {
    console.error(error.message);
    return null;
  }

  return data?.[0] ?? null;
}

function isSupabaseConfigured(): boolean {
  return Boolean(
    import.meta.env.VITE_SUPABASE_URL &&
    import.meta.env.VITE_SUPABASE_KEY
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function loadProfileSuggestions(): Promise<any[]> {
  const { data, error } = await supabase
    .from("profile_suggestions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error.message);
    return [];
  }

  return data ?? [];
}

async function testDatabaseConnection(): Promise<boolean> {
  const { error } = await supabase
    .from("profile_suggestions")
    .select("id")
    .limit(1);
  if (error) {
    console.error(error.message);
    return false;
  }
  return true;
}

async function fetchTableColumns(tableName: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('information_schema.columns')
    .select('column_name')
    .eq('table_name', tableName)
    .order('ordinal_position');

  if (error) {
    console.error('Error fetching table columns:', error.message);
    return [];
  }

  return (data as { column_name: string }[]).map((row) => row.column_name);
}

export {
  loadKIConfigs,
  saveKIConfigs,
  getDatabaseStats,
  isSupabaseConfigured,
  loadProfileSuggestions,
  testDatabaseConnection,
  fetchTableColumns,
};
