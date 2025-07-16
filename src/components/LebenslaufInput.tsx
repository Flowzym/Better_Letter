import React, { useState, useEffect } from 'react';
import { useLebenslaufContext } from '../context/LebenslaufContext';
import PersonalDataForm from './PersonalDataForm';
import ExperienceForm from './ExperienceForm';
import AusbildungForm from './AusbildungForm';
import ExperienceSection from './ExperienceSection';
import { Plus } from 'lucide-react';

type TabType = 'personal' | 'experience' | 'education' | 'skills' | 'softskills';

const LebenslaufInput: React.FC = () => {
  const {
    personalData,
    updatePersonalData,
    berufserfahrungen,
    selectedExperienceId,
    cvSuggestions,
    selectedEducationId,
    ausbildungen,
    setActiveTab: contextSetActiveTab,
    addExperience,
    updateExperience,
    deleteExperience,
    updateExperienceField,
    addEducation,
    updateEducation,
    deleteEducation,
    updateEducationField,
    selectEducation
  } = useLebenslaufContext();

  const [localActiveTab, setLocalActiveTab] = useState<TabType>('personal');

  // Auto-switch to experience tab when an experience is selected
  useEffect(() => {
    if (selectedExperienceId) {
      if (contextSetActiveTab) {
        contextSetActiveTab('experience');
      }
      setLocalActiveTab('experience');
    }
  }, [selectedExperienceId, contextSetActiveTab]);

  // Auto-switch to education tab when an education is selected
  useEffect(() => {
    if (selectedEducationId) {
      if (contextSetActiveTab) {
        contextSetActiveTab('education');
      }
      setLocalActiveTab('education');
    }
  }, [selectedEducationId, contextSetActiveTab]);

  // Use context value or local state as fallback
  const currentTab = localActiveTab;

  // Function to handle tab changes
  const handleTabChange = (tabId: TabType) => {
    if (contextSetActiveTab) {
      contextSetActiveTab(tabId);
    }
    setLocalActiveTab(tabId);
  };

  const renderTabContent = () => {
    switch (currentTab) {
      case 'personal':
        return <PersonalDataForm data={personalData || {}} onChange={updatePersonalData} />;
      case 'experience':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Berufserfahrung</h3>
              <button
                onClick={() => {
                  addExperience({
                    companies: [],
                    position: [],
                    startMonth: null,
                    startYear: "",
                    endMonth: null,
                    endYear: null,
                    isCurrent: false,
                    aufgabenbereiche: []
                  });
                }}
                className="flex items-center space-x-2 px-4 py-2 text-white rounded-lg transition-colors duration-200"
                style={{ backgroundColor: '#F29400' }}
              >
                <Plus className="h-4 w-4" />
                <span>Neue Berufserfahrung</span>
              </button>
            </div>
            
            <ExperienceSection>
              {selectedExperienceId ? (
                <ExperienceForm
                  form={berufserfahrungen.find(e => e.id === selectedExperienceId) || {
                    companies: [],
                    position: berufserfahrungen.find(e => e.id === selectedExperienceId)?.position || [],
                    startMonth: null,
                    startYear: "",
                    endMonth: null,
                    endYear: null,
                    isCurrent: false,
                    aufgabenbereiche: []
                  }}
                  selectedPositions={berufserfahrungen.find(e => e.id === selectedExperienceId)?.position || []}
                  onUpdateField={(field, value) => {
                    if (selectedExperienceId) {
                      updateExperienceField(selectedExperienceId, field, value);
                    }
                  }}
                  onPositionsChange={(positions) => {
                    if (selectedExperienceId) {
                      updateExperienceField(selectedExperienceId, 'position', positions);
                    }
                  }}
                  cvSuggestions={cvSuggestions}
                />
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <p className="text-gray-600">Wählen Sie eine Berufserfahrung aus oder erstellen Sie eine neue</p>
                </div>
              )}
            </ExperienceSection>
          </div>
        );
      case 'education':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Ausbildung</h3>
              <button
                onClick={() => {
                  addEducation({
                    institution: [],
                    ausbildungsart: [],
                    abschluss: [],
                    startMonth: null, 
                    startYear: "", 
                    endMonth: null, 
                    endYear: null, 
                    isCurrent: false, 
                    zusatzangaben: ""
                  });
                }}
                className="flex items-center space-x-2 px-4 py-2 text-white rounded-lg transition-colors duration-200"
                style={{ backgroundColor: '#F29400' }}
              >
                <Plus className="h-4 w-4" />
                <span>Neue Ausbildung</span>
              </button>
            </div>
            
            {selectedEducationId ? (
              <AusbildungForm
                form={ausbildungen.find(e => e.id === selectedEducationId) || {
                  institution: [],
                  ausbildungsart: [],
                  abschluss: [],
                  startMonth: null, 
                  startYear: "", 
                  endMonth: null, 
                  endYear: null, 
                  isCurrent: false, 
                  zusatzangaben: ""
                }}
                onUpdateField={(field, value) => {
                  if (selectedEducationId) {
                    updateEducationField(selectedEducationId, field, value);
                  }
                }}
                cvSuggestions={cvSuggestions}
              />
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <p className="text-gray-600">Wählen Sie eine Ausbildung aus oder erstellen Sie eine neue</p>
              </div>
            )}
          </div>
        );
      case 'skills':
        return <div className="p-4">Fachkompetenzen - Coming soon</div>;
      case 'softskills':
        return <div className="p-4">Softskills - Coming soon</div>;
      default:
        return <PersonalDataForm />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center gap-2 p-4 border-b border-gray-200">
        <div className="w-5 h-5 text-orange-500">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9M19 9H14V4H5V21H19V9Z"/>
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-gray-800">Lebenslauf</h2>
      </div>

      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-4">
          <button
            onClick={() => handleTabChange('personal')}
            className={`py-3 px-1 border-b-2 font-medium text-sm ${
              currentTab === 'personal'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <div className="w-4 h-4">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9M19 9H14V4H5V21H19V9Z"/>
                </svg>
              </div>
              Persönliche Daten
            </div>
          </button>

          <button
            onClick={() => handleTabChange('experience')}
            className={`py-3 px-1 border-b-2 font-medium text-sm ${
              currentTab === 'experience'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <div className="w-4 h-4">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10,2H14A2,2 0 0,1 16,4V6H20A2,2 0 0,1 22,8V19A2,2 0 0,1 20,21H4A2,2 0 0,1 2,19V8A2,2 0 0,1 4,6H8V4A2,2 0 0,1 10,2M14,6V4H10V6H14Z"/>
                </svg>
              </div>
              Berufserfahrung
            </div>
          </button>

          <button
            onClick={() => handleTabChange('education')}
            className={`py-3 px-1 border-b-2 font-medium text-sm ${
              currentTab === 'education'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <div className="w-4 h-4">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z"/>
                </svg>
              </div>
              Ausbildung
            </div>
          </button>

          <button
            onClick={() => handleTabChange('skills')}
            className={`py-3 px-1 border-b-2 font-medium text-sm ${
              currentTab === 'skills'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <div className="w-4 h-4">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9,5V9H21V5M9,19H21V15H9M9,14H21V10H9M4,9H8L6,7M4,19H8L6,17M4,14H8L6,12"/>
                </svg>
              </div>
              Fachkompetenzen
            </div>
          </button>

          <button
            onClick={() => handleTabChange('softskills')}
            className={`py-3 px-1 border-b-2 font-medium text-sm ${
              currentTab === 'softskills'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <div className="w-4 h-4">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16,4C18.2,4 20,5.8 20,8C20,10.2 18.2,12 16,12C13.8,12 12,10.2 12,8C12,5.8 13.8,4 16,4M16,6A2,2 0 0,0 14,8A2,2 0 0,0 16,10A2,2 0 0,0 18,8A2,2 0 0,0 16,6M8,4C10.2,4 12,5.8 12,8C12,10.2 10.2,12 8,12C5.8,12 4,10.2 4,8C4,5.8 5.8,4 8,4M8,6A2,2 0 0,0 6,8A2,2 0 0,0 8,10A2,2 0 0,0 10,8A2,2 0 0,0 8,6M16,13C18.67,13 24,14.33 24,17V20H8V17C8,14.33 13.33,13 16,13M8,13C10.67,13 16,14.33 16,17V20H0V17C0,14.33 5.33,13 8,13Z"/>
                </svg>
              </div>
              Softskills
            </div>
          </button>
        </nav>
      </div>

      <div className="p-4">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default LebenslaufInput;