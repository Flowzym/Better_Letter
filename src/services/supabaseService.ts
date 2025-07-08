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
