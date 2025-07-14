import React, { useEffect, useState, useMemo } from 'react';
import { Trash2, User, GraduationCap, Wrench, FileText, Plus } from 'lucide-react';
import ExperienceForm from './ExperienceForm';
import AusbildungForm from './AusbildungForm';
import PersonalDataForm from './PersonalDataForm';
import {
  Berufserfahrung,
  AusbildungEntry,
  useLebenslaufContext,
  AusbildungEntryForm,
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
  // Berufserfahrung State
  const {
    berufserfahrungen,
    selectedExperienceId,
    isEditingExperience,
    addExperience,
    updateExperience,
    deleteExperience,
    selectExperience,
    // Ausbildung State
    ausbildungen,
    selectedEducationId,
    isEditingEducation,
    addEducation,
    updateEducation,
    deleteEducation,
    selectEducation,
    cvSuggestions,
  } = useLebenslaufContext();

  const [form, setForm] = useState<BerufserfahrungForm>(initialExperience);
  const [selectedPositions, setSelectedPositions] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'experience' | 'education' | 'skills' | 'personal' | 'additional'>('experience');

  // Ausbildung State
  const initialEducation: AusbildungEntryForm = {
    institution: [],
    ausbildungsart: [],
    abschluss: [],
    startMonth: null,
    startYear: "",
    endMonth: null,
    endYear: null,
    isCurrent: false,
    zusatzangaben: "",
  };
  const [educationForm, setEducationForm] = useState<AusbildungEntryForm>(initialEducation);

  // Personal Data State
  const [personalData, setPersonalData] = useState({
    vorname: '',
    nachname: '',
    vorangestellterTitel: '',
    nachgestellterTitel: '',
    geburtsdatum: '',
    geburtsort: '',
    staatsbuegerschaft: '',
    adresse: '',
    ort: '',
    telefon: '',
    laendervorwahl: '+43',
    email: '',
    homepage: '',
    socialMediaLinks: [],
    personenstand: '',
    kinderGeburtsjahre: [],
  });

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

  useEffect(() => {
    if (selectedEducationId !== null) {
      const data = ausbildungen.find((edu) => edu.id === selectedEducationId);
      if (data) {
        const { id, ...rest } = data;
        setEducationForm(rest);
      }
    } else {
      setEducationForm(initialEducation);
    }
  }, [selectedEducationId, ausbildungen]);

  const updateField = <K extends keyof BerufserfahrungForm>(
    field: K,
    value: BerufserfahrungForm[K],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateEducationField = <K extends keyof AusbildungEntryForm>(
    field: K,
    value: AusbildungEntryForm[K],
  ) => {
    setEducationForm((prev) => ({ ...prev, [field]: value }));
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

  const handleAddEducation = async () => {
    await addEducation(educationForm);
    setEducationForm(initialEducation);
    selectEducation(null);
  };

  const handleUpdateEducation = async () => {
    if (selectedEducationId !== null) {
      await updateEducation(selectedEducationId, educationForm);
    }
    setEducationForm(initialEducation);
    selectEducation(null);
  };

  const handleSubmit = async () => {
    if (isEditingExperience) {
      await handleUpdate();
    } else {
      await handleAdd();
    }
  };

  const handleSubmitEducation = async () => {
    if (isEditingEducation) {
      await handleUpdateEducation();
    } else {
      await handleAddEducation();
    }
  };

  return (
    <div className="space-y-6">
      {/* Custom Tab Navigation with Profile Input Style */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('personal')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 border-b-2 ${
            activeTab === 'personal'
              ? 'bg-white shadow-sm text-[#F29400] border-[#F29400]'
              : 'text-gray-600 hover:text-gray-900 border-transparent'
          }`}
        >
          <span>Persönliche Daten</span>
        </button>
        
        <button
          onClick={() => setActiveTab('experience')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 border-b-2 ${
            activeTab === 'experience'
              ? 'bg-white shadow-sm text-[#F29400] border-[#F29400]'
              : 'text-gray-600 hover:text-gray-900 border-transparent'
          }`}
        >
          <span>Berufserfahrung</span>
        </button>
        
        <button
          onClick={() => setActiveTab('education')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 border-b-2 ${
            activeTab === 'education'
              ? 'bg-white shadow-sm text-[#F29400] border-[#F29400]'
              : 'text-gray-600 hover:text-gray-900 border-transparent'
          }`}
        >
          <span>Ausbildung</span>
        </button>
        
        <button
          onClick={() => setActiveTab('skills')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 border-b-2 ${
            activeTab === 'skills'
              ? 'bg-white shadow-sm text-[#F29400] border-[#F29400]'
              : 'text-gray-600 hover:text-gray-900 border-transparent'
          }`}
        >
          <span>Kompetenzen</span>
        </button>
        
        <button
          onClick={() => setActiveTab('additional')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 border-b-2 ${
            activeTab === 'additional'
              ? 'bg-white shadow-sm text-[#F29400] border-[#F29400]'
              : 'text-gray-600 hover:text-gray-900 border-transparent'
          }`}
        >
          <span>Weitere Informationen</span>
        </button>
      </div>

      {activeTab === 'experience' && (
        <div className="space-y-8">
          <div className="p-4 space-y-4 bg-gray-50">
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
          </div>
        </div>
      )}

      {activeTab === 'education' && (
        <div className="space-y-8">
          <div className="p-4 space-y-4 bg-gray-50">
            <AusbildungForm
              form={educationForm}
              onUpdateField={updateEducationField}
              cvSuggestions={cvSuggestions}
            />
            {(educationForm.institution.length > 0 ||
              educationForm.ausbildungsart.length > 0 ||
              educationForm.abschluss.length > 0 ||
              educationForm.startMonth !== null ||
              educationForm.startYear.trim() !== '' ||
              educationForm.endMonth !== null ||
              educationForm.endYear !== null ||
              educationForm.isCurrent === true ||
              isEditingEducation) && (
                <div className="relative flex justify-center">
                  <button
                    type="button"
                    onClick={handleSubmitEducation}
                    className={`w-[30%] text-white font-medium text-sm py-1.5 px-4 rounded-full transition-colors duration-200 ${
                      isEditingEducation
                        ? 'bg-[#207199] hover:bg-[#1A5C80]'
                        : 'bg-[#3E7B0F] hover:bg-[#356A0C]'
                    }`}
                  >
                    {isEditingEducation ? 'Aktualisieren' : 'Hinzufügen'}
                  </button>
                </div>
              )}
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
          <PersonalDataForm
            data={personalData}
            onChange={setPersonalData}
          />
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