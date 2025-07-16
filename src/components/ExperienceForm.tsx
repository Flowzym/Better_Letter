import React, { useMemo } from 'react';
import TagSelectorWithFavorites from './TagSelectorWithFavorites';
import ZeitraumPicker from './ZeitraumPicker';
import TasksTagInput from './TasksTagInput';
import CompaniesTagInput from './CompaniesTagInput';
import { Eraser } from 'lucide-react';
import { Berufserfahrung, useLebenslaufContext } from '../context/LebenslaufContext';
import { CVSuggestionConfig } from '../services/supabaseService';
import { getTasksForPositions } from '../constants/positionsToTasks';

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
  const { favoriteTasks, favoriteCompanies } = useLebenslaufContext();

  const hasZeitraumData =
    form.startMonth !== null ||
    form.startYear.trim() !== '' ||
    form.endMonth !== null ||
    form.endYear !== null ||
    form.isCurrent === true;
  const hasCompanyData = form.companies.length > 0;
  const hasPositionData = selectedPositions.length > 0;
  const hasTaskData = form.aufgabenbereiche.length > 0;
  
  // KI-Vorschläge für Tätigkeiten basierend auf den ausgewählten Positionen
  const aiTaskSuggestions = useMemo(() => {
    if (!selectedPositions || selectedPositions.length === 0) return [];
    const suggestions = getTasksForPositions(selectedPositions);
    console.log('AI Task Suggestions:', suggestions);
    return suggestions;
  }, [selectedPositions]);
  
  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded shadow-sm p-4">
        <div className="flex justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-700">Zeitraum</h3>
          {hasZeitraumData && (
            <button
              type="button"
              onClick={() => {
                onUpdateField('startMonth', null);
                onUpdateField('startYear', '');
                onUpdateField('endMonth', null);
                onUpdateField('endYear', null);
                onUpdateField('isCurrent', false);
              }}
              className="p-1 text-gray-600 hover:text-gray-900"
              title="Zeitraum zurücksetzen"
            >
              <Eraser className="h-4 w-4" />
            </button>
          )}
        </div>
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
        <div className="flex justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-700">Unternehmen &amp; Ort</h3>
          {hasCompanyData && (
            <button
              type="button"
              onClick={() => onUpdateField('companies', [])}
              className="p-1 text-gray-600 hover:text-gray-900"
              title="Unternehmen &amp; Ort zurücksetzen"
            >
              <Eraser className="h-4 w-4" />
            </button>
          )}
        </div>
        <CompaniesTagInput
          value={form.companies}
          onChange={(val) => onUpdateField('companies', val)}
          suggestions={cvSuggestions.companies}
        />
      </div>

      <div className="bg-white border border-gray-200 rounded shadow-sm p-4">
        <div className="flex justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-700">Position</h3>
          {hasPositionData && (
            <button
              type="button"
              onClick={() => {
                onPositionsChange([]);
                onUpdateField('position', []);
              }}
              className="p-1 text-gray-600 hover:text-gray-900"
              title="Position zurücksetzen"
            >
              <Eraser className="h-4 w-4" />
            </button>
          )}
        </div>
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
        <div className="flex justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-700">Tätigkeiten</h3>
          {hasTaskData && (
            <button
              type="button"
              onClick={() => onUpdateField('aufgabenbereiche', [])}
              className="p-1 text-gray-600 hover:text-gray-900"
              title="Tätigkeiten zurücksetzen"
            >
              <Eraser className="h-4 w-4" />
            </button>
          )}
        </div>
        <TasksTagInput
          value={form.aufgabenbereiche}
          onChange={(val) => onUpdateField('aufgabenbereiche', val)}
          aiSuggestions={aiTaskSuggestions}
          suggestions={cvSuggestions.aufgabenbereiche}
          positionen={selectedPositions}
        />
      </div>
    </div>
  );
}
