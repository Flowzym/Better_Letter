import React, { useEffect, useState } from 'react';
import ExperienceForm from './ExperienceForm';
import ExperienceSection from './ExperienceSection';
import {
  Berufserfahrung,
  useLebenslaufContext,
} from "../context/LebenslaufContext";

type BerufserfahrungForm = Omit<Berufserfahrung, "id">;

const initialExperience: BerufserfahrungForm = {
  companies: [],
  position: [],
  startMonth: null,
  startYear: "",
  endMonth: null,
  endYear: null,
  isCurrent: false,
  aufgabenbereiche: [],
};

export default function LebenslaufInput() {
  const {
    berufserfahrungen,
    selectedExperienceId,
    isEditingExperience,
    addExperience,
    updateExperience,
    selectExperience,
  } = useLebenslaufContext();

  const [form, setForm] = useState<BerufserfahrungForm>(initialExperience);
  const [selectedPositions, setSelectedPositions] = useState<string[]>([]);

  useEffect(() => {
    if (selectedExperienceId !== null) {
      const data = berufserfahrungen.find(
        (exp) => exp.id === selectedExperienceId,
      );
      if (data) {
        // remove id when loading into form
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...rest } = data;
        setForm(rest);
        setSelectedPositions(rest.position);
      }
    } else {
      setForm(initialExperience);
      setSelectedPositions([]);
    }
  }, [selectedExperienceId, berufserfahrungen]);

  const updateField = <K extends keyof BerufserfahrungForm>(
    field: K,
    value: BerufserfahrungForm[K],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAdd = async () => {
    await addExperience(form);
    setForm(initialExperience);
    setSelectedPositions([]);
    selectExperience(null);
  };

  const handleUpdate = async () => {
    if (selectedExperienceId !== null) {
      await updateExperience(selectedExperienceId, form);
    }
    setForm(initialExperience);
    setSelectedPositions([]);
    selectExperience(null);
  };

  return (
    <div className="space-y-8">
      <ExperienceSection>
        <ExperienceForm
          form={form}
          selectedPositions={selectedPositions}
          onUpdateField={updateField}
          onPositionsChange={setSelectedPositions}
        />
        <button
          className={`w-full border border-gray-300 bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-md hover:bg-gray-100 transition`}
          onClick={isEditingExperience ? handleUpdate : handleAdd}
        >
          {isEditingExperience ? 'Aktualisieren' : 'Hinzufügen'}
        </button>
      </ExperienceSection>
    </div>
  );
}
