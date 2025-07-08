import { supabase } from "../lib/supabase";
import { KIModelSettings } from "../types/KIModelSettings";

export async function loadKIConfigs(): Promise<KIModelSettings[]> {
  const { data, error } = await supabase.from("ki_settings").select("*");
  if (error) {
    console.error("Fehler beim Laden der KI-Konfigurationen:", error.message);
    return [];
  }
  return data ?? [];
}

export async function saveKIConfigs(models: KIModelSettings[]) {
  const { error } = await supabase.from("ki_settings").upsert(models, {
    onConflict: "id",
  });
  if (error) {
    console.error("Fehler beim Speichern der KI-Konfigurationen:", error.message);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getDatabaseStats(): Promise<any> {
  try {
    const { data, error } = await supabase
      .from("usage_stats")
      .select("*")
      .order("timestamp", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Fehler beim Abrufen der Datenbankstatistiken:", error.message);
      return null;
    }

    return data ?? null;
  } catch (err) {
    console.error("Unerwarteter Fehler beim Abrufen der Datenbankstatistiken:", err);
    return null;
  }
}
