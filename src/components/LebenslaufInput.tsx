import React, { useEffect, useState } from 'react';
import TagSelectorWithFavorites from './TagSelectorWithFavorites';
import ZeitraumPicker from './ZeitraumPicker';
import {
  Berufserfahrung,
  useLebenslaufContext,
} from '../context/LebenslaufContext';

const initialExperience: Berufserfahrung = {
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
    selectedExperienceIndex,
    addExperience,
    updateExperience,
    selectExperience,
  } = useLebenslaufContext();

  const [form, setForm] = useState<Berufserfahrung>(initialExperience);

  useEffect(() => {
    if (selectedExperienceIndex !== null) {
      const data = berufserfahrungen[selectedExperienceIndex];
      if (data) {
        setForm(data);
      }
    } else {
      setForm(initialExperience);
    }
  }, [selectedExperienceIndex, berufserfahrungen]);

  const updateField = <K extends keyof Berufserfahrung>(field: K, value: Berufserfahrung[K]) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (selectedExperienceIndex !== null) {
      updateExperience(selectedExperienceIndex, form);
    } else {
      addExperience(form);
    }
    setForm(initialExperience);
    selectExperience(null);
  };

  const parseMonth = (val: string | null): number | null =>
    val !== null && val !== '' ? parseInt(val, 10) : null;

  const parseYear = (val: string | null): number | null =>
    val !== null && val !== '' ? parseInt(val, 10) : null;

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">💼 Berufserfahrung</h2>
        <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 space-y-2">
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
          <ZeitraumPicker
            startMonth={parseMonth(form.startMonth)}
            startYear={parseYear(form.startYear) ?? null}
            endMonth={parseMonth(form.endMonth)}
            endYear={parseYear(form.endYear)}
            isCurrent={form.isCurrent}
            onChange={data => {
              updateField('startMonth', data.startMonth !== null ? String(data.startMonth).padStart(2, '0') : null);
              updateField('startYear', data.startYear !== null ? String(data.startYear) : '');
              updateField('endMonth', data.endMonth !== null ? String(data.endMonth).padStart(2, '0') : null);
              updateField('endYear', data.endYear !== null ? String(data.endYear) : null);
              updateField('isCurrent', data.isCurrent);
            }}
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
