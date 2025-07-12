import TagSelectorWithFavorites from './TagSelectorWithFavorites';
import ZeitraumPicker from './ZeitraumPicker';
import TasksTagInput from './TasksTagInput';
import CompaniesTagInput from './CompaniesTagInput';
import { Berufserfahrung } from '../context/LebenslaufContext';
import { CVSuggestionConfig } from '../services/supabaseService';

interface ExperienceFormProps {
  form: Omit<Berufserfahrung, 'id'>;
  selectedPositions: string[];
  onUpdateField: <K extends keyof Omit<Berufserfahrung, 'id'>>(field: K, value: Omit<Berufserfahrung, 'id'>[K]) => void;
  onPositionsChange: (val: string[]) => void;
  cvSuggestions: CVSuggestionConfig;
}

export default function ExperienceForm({
  form,
  selectedPositions,
  onUpdateField,
  onPositionsChange,
  cvSuggestions,
}: ExperienceFormProps) {
  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded shadow-sm p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Zeitraum</h3>
        <ZeitraumPicker
          value={{
            startMonth: form.startMonth ?? undefined,
            startYear: form.startYear ?? undefined,
            endMonth: form.endMonth ?? undefined,
            endYear: form.endYear ?? undefined,
            isCurrent: form.isCurrent,
          }}
          onChange={(data) => {
            onUpdateField(
              'startMonth',
              data.startMonth !== undefined && data.startMonth !== null
                ? String(data.startMonth).padStart(2, '0')
                : null,
            );
            onUpdateField(
              'startYear',
              data.startYear !== undefined && data.startYear !== null ? String(data.startYear) : '',
            );
            onUpdateField(
              'endMonth',
              data.endMonth !== undefined && data.endMonth !== null
                ? String(data.endMonth).padStart(2, '0')
                : null,
            );
            onUpdateField(
              'endYear',
              data.endYear !== undefined && data.endYear !== null ? String(data.endYear) : null,
            );
            onUpdateField('isCurrent', data.isCurrent ?? false);
          }}
        />
      </div>

      <div className="bg-white border border-gray-200 rounded shadow-sm p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Unternehmen &amp; Ort</h3>
        <div className="flex flex-wrap gap-2">
          <div className="w-full md:w-1/2">
            <CompaniesTagInput
              value={form.companies}
              onChange={(val) => onUpdateField('companies', val)}
              suggestions={cvSuggestions.companies}
            />
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded shadow-sm p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Positionen</h3>
        <TagSelectorWithFavorites
          value={selectedPositions}
          onChange={(val) => {
            onPositionsChange(val);
            onUpdateField('position', val);
          }}
          allowCustom={true}
          suggestions={cvSuggestions.positions}
        />
      </div>

      <div className="bg-white border border-gray-200 rounded shadow-sm p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Tätigkeiten</h3>
        <TasksTagInput
          value={form.aufgabenbereiche}
          onChange={(val) => onUpdateField('aufgabenbereiche', val)}
          positionen={selectedPositions}
          suggestions={cvSuggestions.aufgabenbereiche}
        />
      </div>
    </div>
  );
}
