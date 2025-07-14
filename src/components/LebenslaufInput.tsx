import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Plus, User, Briefcase, GraduationCap, Zap, Heart } from 'lucide-react';
import PersonalDataForm from './PersonalDataForm';
import ExperienceForm from './ExperienceForm';
import ExperienceSection from './ExperienceSection';
import AusbildungForm from './AusbildungForm';
import { useLebenslaufContext } from '../context/LebenslaufContext';
import CVSection from './CVSection';

type TabType = 'personal' | 'experience' | 'education' | 'skills' | 'softskills';

export default function LebenslaufInput() {
  const [activeTab, setActiveTab] = useState<TabType>('personal');
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
    cvSuggestions
  } = useLebenslaufContext();

  // Personal Data State
  const [personalData, setPersonalData] = useState({
    vorname: '',
    nachname: '',
    titel: '',
    geburtsdatum: '',
    geburtsort: '',
    staatsbuegerschaft: '',
    personenstand: '',
    kinderGeburtsjahre: [],
    adresse: '',
    ort: '',
    ausland: false,
    auslandLand: '',
    telefon: '',
    laendervorwahl: '+43',
    email: '',
    homepage: '',
    socialMediaLinks: [],
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
          {/* Existing Experience Entries */}
          {berufserfahrungen.length > 0 && (
            <ExperienceSection>
              {berufserfahrungen.map(exp => (
                <div
                  key={exp.id}
                  className={`border rounded-lg p-4 cursor-pointer ${
                    selectedExperienceId === exp.id ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
                  }`}
                  onClick={() => {
                    selectExperience(exp.id);
                    setExperienceForm({
                      companies: exp.companies,
                      position: exp.position,
                      startMonth: exp.startMonth,
                      startYear: exp.startYear,
                      endMonth: exp.endMonth,
                      endYear: exp.endYear,
                      isCurrent: exp.isCurrent,
                      aufgabenbereiche: exp.aufgabenbereiche
                    });
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-gray-900">
                        {exp.position.join(' / ')}
                      </div>
                      <div className="text-sm text-gray-600">
                        {exp.companies.join(', ')}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {exp.startMonth && exp.startYear
                          ? `${exp.startMonth}/${exp.startYear}`
                          : exp.startYear}{' '}
                        -{' '}
                        {exp.isCurrent
                          ? 'heute'
                          : exp.endMonth && exp.endYear
                          ? `${exp.endMonth}/${exp.endYear}`
                          : exp.endYear || ''}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          if (selectedExperienceId === exp.id) {
                            selectExperience(null);
                          } else {
                            deleteExperience(exp.id);
                          }
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  {exp.aufgabenbereiche.length > 0 && (
                    <div className="mt-2">
                      <div className="text-xs text-gray-500">Aufgabenbereiche:</div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {exp.aufgabenbereiche.map((task, i) => (
                          <span
                            key={i}
                            className="inline-block px-2 py-1 text-xs bg-gray-100 rounded"
                          >
                            {task}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </ExperienceSection>
          )}

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
          {/* Existing Education Entries */}
          {ausbildungen.length > 0 && (
            <div className="space-y-4">
              {ausbildungen.map(edu => (
                <div
                  key={edu.id}
                  className={`border rounded-lg p-4 cursor-pointer ${
                    selectedEducationId === edu.id ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
                  }`}
                  onClick={() => {
                    selectEducation(edu.id);
                    setEducationForm({
                      institution: edu.institution,
                      ausbildungsart: edu.ausbildungsart,
                      abschluss: edu.abschluss,
                      startMonth: edu.startMonth,
                      startYear: edu.startYear,
                      endMonth: edu.endMonth,
                      endYear: edu.endYear,
                      isCurrent: edu.isCurrent,
                      zusatzangaben: edu.zusatzangaben
                    });
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-gray-900">
                        {edu.ausbildungsart.join(' / ')} {edu.abschluss.length > 0 && `- ${edu.abschluss.join(', ')}`}
                      </div>
                      <div className="text-sm text-gray-600">
                        {edu.institution.join(', ')}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {edu.startMonth && edu.startYear
                          ? `${edu.startMonth}/${edu.startYear}`
                          : edu.startYear}{' '}
                        -{' '}
                        {edu.isCurrent
                          ? 'heute'
                          : edu.endMonth && edu.endYear
                          ? `${edu.endMonth}/${edu.endYear}`
                          : edu.endYear || ''}
                      </div>
                      {edu.zusatzangaben && (
                        <div className="text-sm text-gray-700 mt-2">
                          {edu.zusatzangaben}
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          if (selectedEducationId === edu.id) {
                            selectEducation(null);
                          } else {
                            deleteEducation(edu.id);
                          }
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

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