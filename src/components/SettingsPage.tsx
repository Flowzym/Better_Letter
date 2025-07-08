import { useEffect, useState } from "react";
import { KIModelSettings } from "../types/KIModelSettings";
import { defaultKIModels } from "../constants/kiDefaults";
import { loadKIConfigs, saveKIConfigs } from "../services/supabaseService";
import SettingsModal from "./SettingsModal";

export default function SettingsPage() {
  const [models, setModels] = useState<KIModelSettings[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const fromDB = await loadKIConfigs();
      const merged = defaultKIModels.map((def) =>
        fromDB.find((m) => m.id === def.id) ?? def
      );
      setModels(merged);
    };
    fetch();
  }, []);

  const handleSave = async (updatedModels: KIModelSettings[]) => {
    await saveKIConfigs(updatedModels);
    setModels(updatedModels);
  };

  return <SettingsModal models={models} onSave={handleSave} />;
}
