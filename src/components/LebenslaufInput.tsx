import React, { useEffect, useState } from 'react';
import TagSelectorWithFavorites from './TagSelectorWithFavorites';
import ZeitraumPicker from './ZeitraumPicker';
import {
  Berufserfahrung,
  useLebenslaufContext,
} from '../context/LebenslaufContext';

type BerufserfahrungForm = Omit<Berufserfahrung, 'id'>;

const initialExperience: BerufserfahrungForm = {
  firma: '',
  position: [],
  startMonth: null,
  startYear: '',
  endMonth: null,
  endYear: null,
  isCurrent: false,
  aufgabenbeschreibung: '',
};

export default function LebenslaufInput() {
  const {
    berufserfahrungen,
    selectedExperienceId,
    addExperience,
    updateExperience,
    selectExperience,
  } = useLebenslaufContext();

  const [form, setForm] = useState<BerufserfahrungForm>(initialExperience);

  useEffect(() => {
    if (selectedExperienceId !== null) {
      const data = berufserfahrungen.find(exp => exp.id === selectedExperienceId);
      if (data) {
        // remove id when loading into form
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...rest } = data;
        setForm(rest);
      }
    } else {
      setForm(initialExperience);
    }
  }, [selectedExperienceId, berufserfahrungen]);

  const updateField = <K extends keyof BerufserfahrungForm>(field: K, value: BerufserfahrungForm[K]) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (selectedExperienceId !== null) {
      updateExperience(selectedExperienceId, form);
    } else {
      addExperience(form);
    }
    setForm(initialExperience);
    selectExperience(null);
  };


  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">💼 Berufserfahrung</h2>
        <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 space-y-2">
          <ZeitraumPicker
            value={{
              startMonth: form.startMonth ?? undefined,
              startYear: form.startYear ?? undefined,
              endMonth: form.endMonth ?? undefined,
              endYear: form.endYear ?? undefined,
              isCurrent: form.isCurrent,
            }}
            onChange={data => {
              updateField(
                'startMonth',
                data.startMonth !== undefined && data.startMonth !== null
                  ? String(data.startMonth).padStart(2, '0')
                  : null,
              );
              updateField(
                'startYear',
                data.startYear !== undefined && data.startYear !== null ? String(data.startYear) : '',
              );
              updateField(
                'endMonth',
                data.endMonth !== undefined && data.endMonth !== null
                  ? String(data.endMonth).padStart(2, '0')
                  : null,
              );
              updateField(
                'endYear',
                data.endYear !== undefined && data.endYear !== null ? String(data.endYear) : null,
              );
              updateField('isCurrent', data.isCurrent ?? false);
            }}
          />
          <input
            type="text"
            placeholder="Firma"
            className="w-full px-3 py-2 border rounded"
            value={form.firma}
            onChange={e => updateField('firma', e.target.value)}
          />
          <TagSelectorWithFavorites
            label="Positionen"
            value={form.position}
            onChange={val => updateField('position', val)}
            favoritenKey="positionFavoriten"
            options={['Projektmanager', 'Buchhalter', 'Verkäufer', 'Teamleiter']}
            allowCustom={true}
          />
          <textarea
            placeholder="Aufgabenbeschreibung"
            className="w-full px-3 py-2 border rounded h-24"
            value={form.aufgabenbeschreibung}
            onChange={e => updateField('aufgabenbeschreibung', e.target.value)}
          />
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          className="mt-2 text-sm text-orange-600 hover:underline"
        >
          +
        </button>
      </section>
    </div>
  );
}
