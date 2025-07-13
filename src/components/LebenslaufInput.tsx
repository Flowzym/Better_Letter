import React, { useEffect, useState, useMemo } from 'react';
import ExperienceForm from './ExperienceForm';
import ExperienceSection from './ExperienceSection';
import CVSection from './CVSection';
import AusbildungCard from './cards/AusbildungCard';
import FachkompetenzCard from './cards/FachkompetenzCard';
import SoftskillCard from './cards/SoftskillCard';
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

const initialEducation = {
  institution: "",
  abschluss: "",
  start: "",
  ende: "",
  beschreibung: "",
};

const initialSkill = {
  kategorie: "",
  kompetenzen: [] as string[],
  level: "",
};

const initialSoftskill = {
  text: "",
  bisTags: [] as string[],
};

export default function LebenslaufInput() {
  const {
    berufserfahrungen,
    ausbildungen,
    fachkompetenzen,
    softskills,
    selectedExperienceId,
    isEditingExperience,
    addExperience,
    updateExperience,
    selectExperience,
    addEducation,
    updateEducation,
    deleteEducation,
    addSkill,
    updateSkill,
    deleteSkill,
    addSoftskill,
    updateSoftskill,
    deleteSoftskill,
    cvSuggestions,
  } = useLebenslaufContext();

  const [form, setForm] = useState<BerufserfahrungForm>(initialExperience);
  const [selectedPositions, setSelectedPositions] = useState<string[]>([]);

  const hasCurrentExperienceData = useMemo(() => {
    return (
      form.companies.length > 0 ||
      form.position.length > 0 ||
      form.aufgabenbereiche.length > 0 ||
      form.startMonth !== null ||
      form.startYear.trim() !== '' ||
      form.endMonth !== null ||
      form.endYear !== null ||
      form.isCurrent === true ||
      isEditingExperience
    );
  }, [form, isEditingExperience]);

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

  const handleSubmit = async () => {
    if (isEditingExperience) {
      await handleUpdate();
    } else {
      await handleAdd();
    }
  };

  return (
    <div className="space-y-8">
      <ExperienceSection>
        <ExperienceForm
          form={form}
          selectedPositions={selectedPositions}
          onUpdateField={updateField}
          onPositionsChange={setSelectedPositions}
          cvSuggestions={cvSuggestions}
        />
        {hasCurrentExperienceData && (
          <button
            type="button"
            onClick={handleSubmit}
            className={`block w-[30%] mx-auto text-white font-medium text-sm py-1.5 px-4 rounded-full transition-colors duration-200 ${
              isEditingExperience
                ? 'bg-[#207199] hover:bg-[#1A5C80]'
                : 'bg-[#3E7B0F] hover:bg-[#356A0C]'
            }`}
          >
            {isEditingExperience ? 'Aktualisieren' : 'Hinzufügen'}
          </button>
        )}
      </ExperienceSection>

      <CVSection title="Ausbildung" icon="🎓">
        {ausbildungen.map((entry) => (
          <div key={entry.id} className="space-y-2">
            <AusbildungCard
              data={entry}
              onChange={(data) => updateEducation(entry.id, data)}
            />
            <button
              className="text-red-600 text-sm"
              onClick={() => deleteEducation(entry.id)}
            >
              Entfernen
            </button>
          </div>
        ))}
        <button
          className="w-full border border-gray-300 bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-md hover:bg-gray-100 transition"
          onClick={() => addEducation(initialEducation)}
        >
          Neue Ausbildung hinzufügen
        </button>
      </CVSection>

      <CVSection title="Fachkompetenz" icon="🛠️">
        {fachkompetenzen.map((entry) => (
          <div key={entry.id} className="space-y-2">
            <FachkompetenzCard
              data={entry}
              onChange={(data) => updateSkill(entry.id, data)}
            />
            <button
              className="text-red-600 text-sm"
              onClick={() => deleteSkill(entry.id)}
            >
              Entfernen
            </button>
          </div>
        ))}
        <button
          className="w-full border border-gray-300 bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-md hover:bg-gray-100 transition"
          onClick={() => addSkill(initialSkill)}
        >
          Neue Fachkompetenz hinzufügen
        </button>
      </CVSection>

      <CVSection title="Softskills" icon="🌟">
        {softskills.map((entry) => (
          <div key={entry.id} className="space-y-2">
            <SoftskillCard
              data={entry}
              onChange={(data) => updateSoftskill(entry.id, data)}
            />
            <button
              className="text-red-600 text-sm"
              onClick={() => deleteSoftskill(entry.id)}
            >
              Entfernen
            </button>
          </div>
        ))}
        <button
          className="w-full border border-gray-300 bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-md hover:bg-gray-100 transition"
          onClick={() => addSoftskill(initialSoftskill)}
        >
          Neue Softskill hinzufügen
        </button>
      </CVSection>
    </div>
  );
}
