import TagSelectorWithFavorites from './TagSelectorWithFavorites';
import ZeitraumPicker from './ZeitraumPicker';
import TasksTagInput from './TasksTagInput';
import { Berufserfahrung } from '../context/LebenslaufContext';

interface ExperienceFormProps {
  form: Omit<Berufserfahrung, 'id'>;
  selectedPositions: string[];
  onUpdateField: <K extends keyof Omit<Berufserfahrung, 'id'>>(field: K, value: Omit<Berufserfahrung, 'id'>[K]) => void;
  onPositionsChange: (val: string[]) => void;
}

export default function ExperienceForm({
  form,
  selectedPositions,
  onUpdateField,
  onPositionsChange,
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
        <h3 className="text-sm font-medium text-gray-700 mb-2">Firma</h3>
        <input
          type="text"
          placeholder="Firma"
          className="w-full px-3 py-2 border rounded"
          value={form.firma}
          onChange={(e) => onUpdateField('firma', e.target.value)}
        />
      </div>

      <div className="bg-white border border-gray-200 rounded shadow-sm p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Positionen</h3>
        <TagSelectorWithFavorites
          label="Positionen"
          value={selectedPositions}
          onChange={(val) => {
            onPositionsChange(val);
            onUpdateField('position', val);
          }}
          options={['Projektmanager', 'Buchhalter', 'Verkäufer', 'Teamleiter']}
          allowCustom={true}
        />
      </div>

      <div className="bg-white border border-gray-200 rounded shadow-sm p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Tätigkeiten</h3>
        <TasksTagInput
          value={form.aufgabenbereiche}
          onChange={(val) => onUpdateField('aufgabenbereiche', val)}
          positionen={selectedPositions}
        />
      </div>
    </div>
  );
}
