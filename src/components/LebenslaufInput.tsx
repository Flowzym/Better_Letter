import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Plus, User, Briefcase, GraduationCap, Zap, Heart } from 'lucide-react';
import PersonalDataForm from './PersonalDataForm';
import ExperienceForm from './ExperienceForm';
import ExperienceSection from './ExperienceSection';
import AusbildungForm from './AusbildungForm';
import { useLebenslaufContext } from '../context/LebenslaufContext';
import CVSection from './CVSection';

export type TabType = 'personal' | 'experience' | 'education' | 'skills' | 'softskills';

export default function LebenslaufInput() {
  const {
    berufserfahrungen,
    addExperience,
    updateExperience,
    deleteExperience,
    selectedExperienceId,
    isEditingExperience,
    selectExperience,
    ausbildungen,
    addEducation,
    updateEducation,
    deleteEducation,
    selectedEducationId,
    isEditingEducation,
    selectEducation,
    cvSuggestions,
    setActiveTab,
    activeTab
  } = useLebenslaufContext();

  console.log('Aktiver Tab:', activeTab); // <-- Fügen Sie diese Zeile hier ein
  
  // Get activeTab from context
  
  // Sync local state with context

  // Personal Data State
  const [personalData, setPersonalData] = useState({
    vorname: '',
    nachname: '',
    titel: '',
    geburtsdatum: '',
    geburtsort: '',
    geburtsland: '',
    staatsbuergerschaftCheckbox: false,
    staatsbuergerschaft: '',
    arbeitsmarktzugang: '',
    familienstand: '',
    kinder: [],
    adresse: '',
    plz: '',
    ort: '',
    land: '',
    ausland: false,
    telefon: '',
    telefonVorwahl: '+43',
    email: '',
    socialMedia: [],
  });

  // Experience Form State
  const [experienceForm, setExperienceForm] = useState({
    companies: [],
    position: [],
    startMonth: null,
    startYear: '',
    endMonth: null,
    endYear: null,
    isCurrent: false,
    aufgabenbereiche: []
  });

  // Education Form State
  const [educationForm, setEducationForm] = useState({
    institution: [],
    ausbildungsart: [],
    abschluss: [],
    startMonth: null,
    startYear: '',
    endMonth: null,
    endYear: null,
    isCurrent: false,
    zusatzangaben: ''
  });

  // Load selected experience data into form when selectedExperienceId changes
  useEffect(() => {
    if (selectedExperienceId) {
      const selectedExp = berufserfahrungen.find(exp => exp.id === selectedExperienceId);
      if (selectedExp) {
        setExperienceForm({
          companies: selectedExp.companies || [],
          position: selectedExp.position || [],
          startMonth: selectedExp.startMonth,
          startYear: selectedExp.startYear || '',
          endMonth: selectedExp.endMonth,
          endYear: selectedExp.endYear,
          isCurrent: selectedExp.isCurrent || false,
          aufgabenbereiche: selectedExp.aufgabenbereiche || []
        });
      }
    } else {
      // Clear form when no experience is selected
      setExperienceForm({
        companies: [],
        position: [],
        startMonth: null,
        startYear: '',
        endMonth: null,
        endYear: null,
        isCurrent: false,
        aufgabenbereiche: []
      });
    }
  }, [selectedExperienceId, berufserfahrungen]);

  // Load selected education data into form when selectedEducationId changes
  useEffect(() => {
    if (selectedEducationId) {
      const selectedEdu = ausbildungen.find(edu => edu.id === selectedEducationId);
      if (selectedEdu) {
        setEducationForm({
          institution: selectedEdu.institution || [],
          ausbildungsart: selectedEdu.ausbildungsart || [],
          abschluss: selectedEdu.abschluss || [],
          startMonth: selectedEdu.startMonth,
          startYear: selectedEdu.startYear || '',
          endMonth: selectedEdu.endMonth,
          endYear: selectedEdu.endYear,
          isCurrent: selectedEdu.isCurrent || false,
          zusatzangaben: selectedEdu.zusatzangaben || ''
        });
      }
    } else {
      // Clear form when no education is selected
      setEducationForm({
        institution: [],
        ausbildungsart: [],
        abschluss: [],
        startMonth: null,
        startYear: '',
        endMonth: null,
        endYear: null,
        isCurrent: false,
        zusatzangaben: ''
      });
    }
  }, [selectedEducationId, ausbildungen]);

  const handleExperienceFormChange = <K extends keyof typeof experienceForm>(
    field: K,
    value: typeof experienceForm[K]
  ) => {
    setExperienceForm(prev => ({ ...prev, [field]: value }));
  };

  const handleEducationFormChange = <K extends keyof typeof educationForm>(
    field: K,
    value: typeof educationForm[K]
  ) => {
    setEducationForm(prev => ({ ...prev, [field]: value }));
  };

  const handleAddExperience = async () => {
    await addExperience(experienceForm);
    setExperienceForm({
      companies: [],
      position: [],
      startMonth: null,
      startYear: '',
      endMonth: null,
      endYear: null,
      isCurrent: false,
      aufgabenbereiche: []
    });
  };

  const handleUpdateExperience = async () => {
    if (!selectedExperienceId) return;
    await updateExperience(selectedExperienceId, experienceForm);
  };

  const handleAddEducation = async () => {
    await addEducation(educationForm);
    setEducationForm({
      institution: [],
      ausbildungsart: [],
      abschluss: [],
      startMonth: null,
      startYear: '',
      endMonth: null,
      endYear: null,
      isCurrent: false,
      zusatzangaben: ''
    });
  };

  const handleUpdateEducation = async () => {
    if (!selectedEducationId) return;
    await updateEducation(selectedEducationId, educationForm);
  };

  const tabs = [
    { id: 'personal', label: 'Persönliche Daten', icon: <User className="h-4 w-4" /> },
    { id: 'experience', label: 'Berufserfahrung', icon: <Briefcase className="h-4 w-4" /> },
    { id: 'education', label: 'Ausbildung', icon: <GraduationCap className="h-4 w-4" /> },
    { id: 'skills', label: 'Fachkompetenzen', icon: <Zap className="h-4 w-4" /> },
    { id: 'softskills', label: 'Softskills', icon: <Heart className="h-4 w-4" /> }
  ];

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              activeTab === tab.id
                ? 'bg-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            style={activeTab === tab.id ? { color: '#F29400' } : {}}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'personal' && (
        <PersonalDataForm
          data={personalData}
          onChange={setPersonalData}
        />
      )}

      {activeTab === 'experience' && (
        <div className="space-y-6">
          {/* Experience Form */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 flex items-center justify-between">
              <h3 className="font-medium text-gray-900">
                {isEditingExperience && selectedExperienceId
                  ? 'Berufserfahrung bearbeiten'
                  : 'Neue Berufserfahrung hinzufügen'}
              </h3>
              {isEditingExperience && selectedExperienceId && (
                <button
                  onClick={() => selectExperience(null)}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Abbrechen
                </button>
              )}
            </div>
            <div className="p-4">
              <ExperienceForm
                form={experienceForm}
                selectedPositions={experienceForm.position}
                onUpdateField={handleExperienceFormChange}
                onPositionsChange={positions => handleExperienceFormChange('position', positions)}
                cvSuggestions={cvSuggestions}
              />
              <div className="mt-4 flex justify-end">
                <button
                  onClick={isEditingExperience ? handleUpdateExperience : handleAddExperience}
                  className="px-4 py-2 text-white rounded-md"
                  style={{ backgroundColor: '#F29400' }}
                >
                  {isEditingExperience ? 'Aktualisieren' : 'Hinzufügen'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'education' && (
        <div className="space-y-6">
          {/* Education Form */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 flex items-center justify-between">
              <h3 className="font-medium text-gray-900">
                {isEditingEducation && selectedEducationId
                  ? 'Ausbildung bearbeiten'
                  : 'Neue Ausbildung hinzufügen'}
              </h3>
              {isEditingEducation && selectedEducationId && (
                <button
                  onClick={() => selectEducation(null)}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Abbrechen
                </button>
              )}
            </div>
            <div className="p-4">
              <AusbildungForm
                form={educationForm}
                onUpdateField={handleEducationFormChange}
                cvSuggestions={cvSuggestions}
              />
              <div className="mt-4 flex justify-end">
                <button
                  onClick={isEditingEducation ? handleUpdateEducation : handleAddEducation}
                  className="px-4 py-2 text-white rounded-md"
                  style={{ backgroundColor: '#F29400' }}
                >
                  {isEditingEducation ? 'Aktualisieren' : 'Hinzufügen'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'skills' && (
        <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Fachkompetenzen</h3>
          <p className="text-gray-600">
            Dieser Bereich wird in einer zukünftigen Version implementiert.
          </p>
        </div>
      )}

      {activeTab === 'softskills' && (
        <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Softskills</h3>
          <p className="text-gray-600">
            Dieser Bereich wird in einer zukünftigen Version implementiert.
          </p>
        </div>
      )}
    </div>
  );
}