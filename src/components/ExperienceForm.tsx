import React, { useMemo } from 'react';
import React, { useMemo, useState } from 'react';
import ZeitraumPicker from './ZeitraumPicker';
import TasksTagInput from './TasksTagInput';
import TextInput from './TextInput';
import CountryDropdown from './CountryDropdown';
import AutocompleteInput from './AutocompleteInput';
import TagSelectorWithFavorites from './TagSelectorWithFavorites';
import { Eraser, Plus } from 'lucide-react';
import CompanyTag from './CompanyTag';
import { Berufserfahrung, useLebenslauf } from '../context/LebenslaufContext';
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
  const { 
    favoriteTasks, 
    favoriteCities, 
    toggleFavoriteCity, 
    favoriteCompanies,
    toggleFavoriteCompany,
    favoritePositions, 
    toggleFavoritePosition 
  } = useLebenslauf();
  
  // Lokale Zustände für die Eingabefelder
  const [companyNameInput, setCompanyNameInput] = useState('');
  const [companyCityInput, setCompanyCityInput] = useState('');
  const [selectedCountryInput, setSelectedCountryInput] = useState('Österreich');

  const hasZeitraumData =
    form.startMonth !== null ||
    form.startYear.trim() !== '' ||
    form.endMonth !== null ||
    form.endYear !== null ||
    form.isCurrent === true;
  const hasCompanyData = form.companies && form.companies.length > 0;
  const hasPositionData = selectedPositions.length > 0;
  const hasTaskData = form.aufgabenbereiche.length > 0;
  
  // Prüft, ob mindestens ein Eingabefeld gefüllt ist
  const hasInputData = companyNameInput.trim() !== '' || companyCityInput.trim() !== '';
  
  // Funktion zum Hinzufügen eines neuen Unternehmenseintrags
  const addCompanyEntry = () => {
    if (!hasInputData) return;
    
    let newEntry = '';
    
    // Format: "Unternehmen, Ort (Land)" oder Variationen
    if (companyNameInput.trim() && companyCityInput.trim()) {
      if (selectedCountryInput && selectedCountryInput !== 'Österreich') {
        newEntry = `${companyNameInput.trim()}, ${companyCityInput.trim()} (${selectedCountryInput})`;
      } else {
        newEntry = `${companyNameInput.trim()}, ${companyCityInput.trim()}`;
      }
    } else if (companyNameInput.trim()) {
      if (selectedCountryInput && selectedCountryInput !== 'Österreich') {
        newEntry = `${companyNameInput.trim()} (${selectedCountryInput})`;
      } else {
        newEntry = companyNameInput.trim();
      }
    } else if (companyCityInput.trim()) {
      if (selectedCountryInput && selectedCountryInput !== 'Österreich') {
        newEntry = `${companyCityInput.trim()} (${selectedCountryInput})`;
      } else {
        newEntry = companyCityInput.trim();
      }
    }
    
    if (newEntry && (!form.companies || !form.companies.includes(newEntry))) {
      onUpdateField('companies', [...(form.companies || []), newEntry]);
    }
    
    // Eingabefelder nicht leeren, damit der Benutzer mehrere ähnliche Einträge hinzufügen kann
  };
  
  // Funktion zum Entfernen eines Unternehmenseintrags
  const removeCompanyEntry = (entry: string) => {
    if (form.companies) {
      onUpdateField('companies', form.companies.filter(c => c !== entry));
    }
  };
  
  // Funktion zum Bearbeiten eines Unternehmenseintrags
  const updateCompanyEntry = (oldEntry: string, newEntry: string) => {
    if (form.companies) {
      onUpdateField('companies', form.companies.map(c => c === oldEntry ? newEntry : c));
    }
  };
  
  // Funktion zum Hinzufügen eines Favoriten zum Eingabefeld
  const addCompanyFavoriteToInput = (favorite: string) => {
    if (companyNameInput.trim()) {
      setCompanyNameInput(companyNameInput.trim() + ' / ' + favorite);
    } else {
      setCompanyNameInput(favorite);
    }
  };
  
  // Funktion zum Hinzufügen eines Ort-Favoriten zum Eingabefeld
  const addCityFavoriteToInput = (favorite: string) => {
    if (companyCityInput.trim()) {
      setCompanyCityInput(companyCityInput.trim() + ' / ' + favorite);
    } else {
      setCompanyCityInput(favorite);
    }
  };
  
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
              onClick={() => {
                onUpdateField('companies', []);
                setCompanyNameInput('');
                setCompanyCityInput('');
                setSelectedCountryInput('Österreich');
              }}
              className="p-1 text-gray-600 hover:text-gray-900"
              title="Unternehmen &amp; Ort zurücksetzen"
            >
              <Eraser className="h-4 w-4" />
            </button>
          )}
        </div>
        
        {/* Bestehende Unternehmenseinträge als Tags anzeigen */}
        {form.companies && form.companies.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {form.companies.map((company, index) => (
              <CompanyTag
                key={`${company}-${index}`}
                label={company}
                onRemove={() => removeCompanyEntry(company)}
                onEdit={(newValue) => updateCompanyEntry(company, newValue)}
              />
            ))}
          </div>
        )}
        
        <div className="space-y-3">
          {/* Unternehmen Eingabefeld */}
          <div>
            <AutocompleteInput
              label=""
              value={companyNameInput}
              onChange={setCompanyNameInput}
              onAdd={() => {}} // Wird nicht verwendet
              onFavoriteClick={(val) => {
                if (val) toggleFavoriteCompany(val);
              }}
              suggestions={favoriteCompanies}
              placeholder="Name des Unternehmens..."
              showFavoritesButton={true}
              showAddButton={false}
            />
            
            {/* Unternehmen Favoriten */}
            {favoriteCompanies.length > 0 && (
              <div className="mt-2">
                <div className="flex items-center space-x-2 mb-1">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#9CA3AF"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="12 2 15 8.5 22 9.3 17 14 18.2 21 12 17.8 5.8 21 7 14 2 9.3 9 8.5 12 2" fill="none" />
                  </svg>
                  <h4 className="text-xs font-medium text-gray-700">Unternehmen-Favoriten:</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {favoriteCompanies.map((company) => (
                    <button
                      key={company}
                      onClick={() => addCompanyFavoriteToInput(company)}
                      className="inline-flex items-center px-3 py-1 bg-white text-gray-700 text-xs rounded-full border border-gray-300 hover:bg-gray-100 transition-colors duration-200"
                    >
                      {company}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Ort Eingabefeld */}
          <div>
            <AutocompleteInput
              label=""
              value={companyCityInput}
              onChange={setCompanyCityInput}
              onAdd={() => {}} // Wird nicht verwendet
              onFavoriteClick={(val) => {
                if (val) toggleFavoriteCity(val);
              }}
              suggestions={favoriteCities}
              placeholder="Ort des Unternehmens..."
              showFavoritesButton={true}
              showAddButton={false}
            />
            
            {/* Ort Favoriten */}
            {favoriteCities.length > 0 && (
              <div className="mt-2">
                <div className="flex items-center space-x-2 mb-1">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#9CA3AF"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="12 2 15 8.5 22 9.3 17 14 18.2 21 12 17.8 5.8 21 7 14 2 9.3 9 8.5 12 2" fill="none" />
                  </svg>
                  <h4 className="text-xs font-medium text-gray-700">Ort-Favoriten:</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {favoriteCities.map((city) => (
                    <button
                      key={city}
                      onClick={() => addCityFavoriteToInput(city)}
                      className="inline-flex items-center px-3 py-1 bg-white text-gray-700 text-xs rounded-full border border-gray-300 hover:bg-gray-100 transition-colors duration-200"
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Land Dropdown */}
          <CountryDropdown
            label=""
            value={selectedCountryInput}
            onChange={setSelectedCountryInput}
          />
          
          {/* Hinzufügen-Button */}
          {hasInputData && (
            <div className="flex justify-end mt-3">
              <button
                onClick={addCompanyEntry}
                className="flex items-center space-x-2 px-3 py-2 text-white rounded-md transition-colors duration-200"
                style={{ backgroundColor: '#F29400' }}
              >
                <Plus className="h-4 w-4" />
                <span>Hinzufügen</span>
              </button>
            </div>
          )}
        </div>
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
          label=""
          value={selectedPositions}
          onChange={(val) => {
            onPositionsChange(val);
            onUpdateField('position', val);
          }}
          options={[]}
          allowCustom={true}
          suggestions={cvSuggestions.positions || []}
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
          aiSuggestions={aiTaskSuggestions || []}
          suggestions={cvSuggestions.aufgabenbereiche}
          positionen={selectedPositions}
        />
      </div>
    </div>
  );
}