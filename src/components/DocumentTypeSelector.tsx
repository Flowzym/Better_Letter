import type { LucideIcon } from 'lucide-react';
import { FileText, Briefcase, Send, GraduationCap, Coffee, Users } from 'lucide-react';

interface DocumentTypeSelectorProps {
  documentTypes: {
    [key: string]: {
      label: string;
      prompt: string;
    };
  };
  selectedType: string;
  onTypeChange: (type: string) => void;
}

// Map document type keys to their respective Lucide icon
const ICON_MAP: Record<string, LucideIcon> = {
  standard: Briefcase,
  berufsfern: Users,
  initiativ: Send,
  ausbildung: GraduationCap,
  praktikum: Coffee,
  aqua: FileText,
};

export default function DocumentTypeSelector({ documentTypes, selectedType, onTypeChange }: DocumentTypeSelectorProps) {
  const typeEntries = Object.entries(documentTypes);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-200">
      <div className="flex items-center space-x-3 mb-4">
        <FileText className="h-6 w-6" style={{ color: '#F29400' }} />
        {/* BOLT-UI-ANPASSUNG 2025-01-15: Titel geändert */}
        <h2 className="text-xl font-semibold text-gray-900">Dokument-Typ</h2>
      </div>
      
      <fieldset>
        <legend className="sr-only">Dokumenttyp auswählen</legend>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {typeEntries.map(([typeKey, typeData]) => {
            const IconComponent = ICON_MAP[typeKey] || FileText;
            const isSelected = selectedType === typeKey;
            const buttonId = `document-type-${typeKey}`;
            
            return (
              <label key={typeKey} htmlFor={buttonId} className="cursor-pointer">
                <input
                  type="radio"
                  id={buttonId}
                  name="documentType"
                  value={typeKey}
                  checked={isSelected}
                  onChange={() => onTypeChange(typeKey)}
                  className="sr-only"
                />
                <div
                  className={`flex items-center space-x-3 px-6 py-4 rounded-lg font-medium transition-all duration-200 border-2 text-left ${
                    isSelected
                      ? 'text-white border-transparent shadow-md'
                      : 'bg-white border-gray-300 text-gray-700 hover:border-orange-300 hover:bg-orange-50'
                  }`}
                  style={isSelected ? { backgroundColor: '#F29400' } : {}}
                  title={`Klicken Sie hier, um "${typeData.label}" auszuwählen`}
                >
                  <IconComponent className="h-5 w-5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-medium">{typeData.label}</div>
                    {/* BOLT-UI-ANPASSUNG 2025-01-15: "Ausgewählt"-Text entfernt */}
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}
