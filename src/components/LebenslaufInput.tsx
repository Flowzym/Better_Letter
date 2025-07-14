import React, { useEffect, useState, useMemo } from 'react';
import { Trash2, User, GraduationCap, Wrench, FileText, Plus } from 'lucide-react';
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
    deleteExperience,
    selectExperience,
    cvSuggestions,
  } = useLebenslaufContext();

  const [form, setForm] = useState<BerufserfahrungForm>(initialExperience);
  const [selectedPositions, setSelectedPositions] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'experience' | 'education' | 'skills' | 'personal' | 'additional'>('experience');

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
    <div className="space-y-6">
      {/* Custom Tab Navigation with Profile Input Style */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('experience')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
            activeTab === 'experience'
              ? 'bg-white shadow-sm text-[#F29400] text-base'
              : 'text-gray-600 hover:text-gray-900 text-sm'
          }`}
        >
          <span>Berufserfahrung</span>
        </button>
        
        <button
          onClick={() => setActiveTab('education')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
            activeTab === 'education'
              ? 'bg-white shadow-sm text-[#F29400] text-base'
              : 'text-gray-600 hover:text-gray-900 text-sm'
          }`}
        >
          <span>Ausbildung</span>
        </button>
        
        <button
          onClick={() => setActiveTab('skills')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
            activeTab === 'skills'
              ? 'bg-white shadow-sm text-[#F29400] text-base'
              : 'text-gray-600 hover:text-gray-900 text-sm'
          }`}
        >
          <span>Kompetenzen</span>
        </button>
        
        <button
          onClick={() => setActiveTab('personal')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
            activeTab === 'personal'
              ? 'bg-white shadow-sm text-[#F29400] text-base'
              : 'text-gray-600 hover:text-gray-900 text-sm'
          }`}
        >
          <span>Persönliche Daten</span>
        </button>
        
        <button
          onClick={() => setActiveTab('additional')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
            activeTab === 'additional'
              ? 'bg-white shadow-sm text-[#F29400] text-base'
              : 'text-gray-600 hover:text-gray-900 text-sm'
          }`}
        >
          <span>Weitere Informationen</span>
        </button>
      </div>

      {activeTab === 'experience' && (
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
              <div className="relative flex justify-center">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className={`w-[30%] text-white font-medium text-sm py-1.5 px-4 rounded-full transition-colors duration-200 ${
                    isEditingExperience
                      ? 'bg-[#207199] hover:bg-[#1A5C80]'
                      : 'bg-[#3E7B0F] hover:bg-[#356A0C]'
                  }`}
                >
                  {isEditingExperience ? 'Aktualisieren' : 'Hinzufügen'}
                </button>
                <div className="absolute right-0 flex items-center space-x-2">
                  {isEditingExperience && selectedExperienceId && (
                    <button
                      type="button"
                      onClick={() => deleteExperience(selectedExperienceId)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors duration-200"
                      title="Eintrag löschen"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </ExperienceSection>
        </div>
      )}

      {activeTab === 'education' && (
        <div className="p-6">
          <div className="text-center text-gray-500 p-10 border border-dashed border-gray-300 rounded-xl bg-gray-50">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">🎓 Ausbildung & Qualifikationen</h3>
            <p>Hier entsteht der neue Ausbildungs-Editor, angelehnt an die Berufserfahrung.</p>
            <p className="text-sm mt-2">Struktur wird ähnlich der Berufserfahrung-Karten aufgebaut.</p>
          </div>
        </div>
      )}

      {activeTab === 'skills' && (
        <div className="p-6">
          <div className="text-center text-gray-500 p-10 border border-dashed border-gray-300 rounded-xl bg-gray-50">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">🛠️ Fachliche & Persönliche Kompetenzen</h3>
            <p>Hier entsteht der neue Kompetenzen-Editor für fachliche und persönliche Fähigkeiten.</p>
            <p className="text-sm mt-2">Fachliche und persönliche Kompetenzen werden hier verwaltet.</p>
          </div>
        </div>
      )}

      {activeTab === 'personal' && (
        <div className="p-6">
          <div className="text-center text-gray-500 p-10 border border-dashed border-gray-300 rounded-xl bg-gray-50">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">👤 Persönliche Daten</h3>
            <p>Hier entsteht der Editor für persönliche Daten.</p>
            <p className="text-sm mt-2">Name, Kontaktdaten, Geburtsdatum, etc.</p>
          </div>
        </div>
      )}

      {activeTab === 'additional' && (
        <div className="p-6">
          <div className="text-center text-gray-500 p-10 border border-dashed border-gray-300 rounded-xl bg-gray-50">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">📋 Weitere Informationen</h3>
            <p>Hier entsteht der Editor für zusätzliche Informationen.</p>
            <p className="text-sm mt-2">Hobbys, Sprachen, Zertifikate, etc.</p>
          </div>
        </div>
      )}
    </div>
  );
}