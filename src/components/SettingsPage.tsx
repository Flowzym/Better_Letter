import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { KIModelSettings } from "../types/KIModelSettings";
import { defaultKIModels } from "../constants/kiDefaults";
import { loadKIConfigs, saveKIConfigs } from "../services/supabaseService";
import SettingsModal from "./SettingsModal";

export default function SettingsPage() {
  const navigate = useNavigate();
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


  console.log("SettingsPage gerendert");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-xl max-h-[95vh] overflow-y-auto p-6 relative">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>
        <SettingsModal models={models} onSave={handleSave} />
      </div>
    </div>
  );
}
