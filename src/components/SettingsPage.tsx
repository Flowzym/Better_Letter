import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { KIModelSettings } from "../types/KIModelSettings";
import { defaultKIModels } from "../constants/kiDefaults";
import { loadKIConfigs, saveKIConfigs } from "../services/supabaseService";
import SettingsModal from "./SettingsModal";

interface SettingsPageProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsPage({ isOpen, onClose }: SettingsPageProps) {
  const [models, setModels] = useState<KIModelSettings[]>([]);

  useEffect(() => {
    if (!isOpen) return;
    const fetch = async () => {
      const fromDB = await loadKIConfigs();
      const merged = defaultKIModels.map((def) =>
        fromDB.find((m) => m.id === def.id) ?? def
      );
      setModels(merged);
    };
    fetch();
  }, [isOpen]);

  const handleSave = async (updatedModels: KIModelSettings[]) => {
    await saveKIConfigs(updatedModels);
    setModels(updatedModels);
  };

  if (!isOpen) return null;

  console.log("SettingsPage gerendert");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-xl max-h-[95vh] overflow-y-auto p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>
        <SettingsModal models={models} onSave={handleSave} />
      </div>
    </div>
  );
}
