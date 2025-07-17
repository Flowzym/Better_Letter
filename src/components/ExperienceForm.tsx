import React, { useMemo, useState } from 'react';
import ZeitraumPicker from './ZeitraumPicker';
import TasksTagInput from './TasksTagInput';
import CountryDropdown from './CountryDropdown';
import { Eraser, Plus, Star, Lightbulb } from 'lucide-react';
import AutocompleteInput from './AutocompleteInput';
import TagSelectorWithFavorites from './TagSelectorWithFavorites';
import CompanyTag from './CompanyTag';
import TagButtonFavorite from './ui/TagButtonFavorite';
import { Berufserfahrung, useLebenslauf } from '../context/LebenslaufContext';
import { CVSuggestionConfig } from '../services/supabaseService';
import { getTasksForPositions } from '../constants/positionsToTasks';
import TextInput from './TextInput';

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
    favoriteCompanies: favorites,
    toggleFavoriteCompany,
    toggleFavoriteCity,
    favoritePositions, 
    toggleFavoritePosition 
  } = useLebenslauf();
  
  // Lokale Zustände für die Eingabefelder
  const [isCompanyInputFocused, setIsCompanyInputFocused] = useState(false);
  const [isCityInputFocused, setIsCityInputFocused] = useState(false);
  const [companyNameInput, setCompanyNameInput] = useState('');
  const [companyCityInput, setCompanyCityInput] = useState('');
  const [selectedCountryInput, setSelectedCountryInput] = useState('Österreich');
  const [showForeignCountry, setShowForeignCountry] = useState(false);
  const [isPositionInputFocused, setIsPositionInputFocused] = useState(false);

  const hasZeitraumData =
    form.startMonth !== null ||
    form.startYear.trim() !== '' ||
    form.endMonth !== null ||
    form.endYear !== null ||
    form.isCurrent === true;
  const hasCompanyData = form.companies && form.companies.length > 0;
  const hasPositionData = selectedPositions.length > 0;
  const hasTaskData = form.aufgabenbereiche.length > 0;
  const hasAdditionalInfo = form.zusatzangaben && form.zusatzangaben.trim().length > 0;

  // Prüft, ob mindestens ein Eingabefeld gefüllt ist
  const hasInputData = companyNameInput.trim() !== '' || companyCityInput.trim() !== '';
  
  // Funktion zum Hinzufügen eines neuen Unternehmenseintrags
  const addCompanyEntry = () => {
    if (!hasInputData) return;
    
    let newEntry = '';

    // Format: "Unternehmen, Ort (Land)" oder Variationen
    if (companyNameInput.trim() && companyCityInput.trim()) {
      if (showForeignCountry && selectedCountryInput && selectedCountryInput !== 'Österreich') {
        newEntry = `${companyNameInput.trim()}, ${companyCityInput.trim()} (${selectedCountryInput})`;
      } else {
        newEntry = `${companyNameInput.trim()}, ${companyCityInput.trim()}`;
      }
    } else if (companyNameInput.trim()) {
      if (showForeignCountry && selectedCountryInput && selectedCountryInput !== 'Österreich') {
        newEntry = `${companyNameInput.trim()} (${selectedCountryInput})`;
      } else {
        newEntry = companyNameInput.trim();
      }
    } else if (companyCityInput.trim()) {
      if (showForeignCountry && selectedCountryInput && selectedCountryInput !== 'Österreich') {
        newEntry = `${companyCityInput.trim()} (${selectedCountryInput})`;
      } else {
        newEntry = companyCityInput.trim();
      }
    }
    
    if (newEntry && (!form.companies || !form.companies.includes(newEntry))) {
      onUpdateField('companies', [...(form.companies || []), newEntry]);
    }

    // Eingabefelder leeren nach dem Hinzufügen
    setCompanyNameInput('');
    setCompanyCityInput(''); 
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
  
  // Funktion zum direkten Hinzufügen eines Unternehmens-Favoriten
  const addCompanyFavorite = (favorite: string) => {
    let newEntry = favorite;
    
    if ((!form.companies || !form.companies.includes(newEntry))) {
      onUpdateField('companies', [...(form.companies || []), newEntry]);
    }
  };
  
  // Funktion zum Hinzufügen eines Ort-Favoriten zum Eingabefeld
  const addCityFavoriteToInput = (favorite: string) => {
    if (companyCityInput.trim()) {
      const currentCities = companyCityInput.trim().split(/,\s*|&\s*/).map(s => s.trim());

      if (!currentCities.includes(favorite)) {
        if (currentCities.length === 1) {
          setCompanyCityInput(`${currentCities[0]} & ${favorite}`);
        } else {
          // Entferne das letzte "&" wenn vorhanden
          const lastCity = currentCities.pop() || '';
          const otherCities = currentCities.join(', ');
          setCompanyCityInput(`${otherCities}${otherCities ? ', ' : ''}${lastCity} & ${favorite}`);
        }
      }
    } else {
      setCompanyCityInput(favorite);
    }
  };
  
  // KI-Vorschläge für Tätigkeiten basierend auf den ausgewählten Positionen
  const aiTaskSuggestions = useMemo(() => {
    if (!selectedPositions || selectedPositions.length === 0) return [];
    const suggestions = getTasksForPositions(selectedPositions);
    return suggestions;
  }, [selectedPositions]);
  
  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded shadow-sm p-4">
        <div className="flex justify-between mb-2">
          <h3 className="text-sm font-bold text-gray-700">Zeitraum</h3>
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
          <h3 className="text-sm font-bold text-gray-700">Unternehmen & Ort</h3>
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
          {/* Unternehmen & Ort Eingabefelder nebeneinander */}
          <div className="flex space-x-2 items-start">
            <div className="flex-1 relative">
              <AutocompleteInput
                label="" 
                id="company-name-input"
                value={companyNameInput}
                onChange={setCompanyNameInput}
                onAdd={() => {}} // Wird nicht verwendet
                onFocus={() => setIsCompanyInputFocused(true)}
                onBlur={() => setTimeout(() => setIsCompanyInputFocused(false), 100)} // Verzögerung hinzugefügt
                onFavoriteClick={(val) => {
                  const valueToAdd = val || companyNameInput.trim();
                  if (valueToAdd) toggleFavoriteCompany(valueToAdd);
                  setCompanyNameInput('');
                }}
                suggestions={favorites}
                placeholder="Name des Unternehmens..."
                showFavoritesButton={isCompanyInputFocused}
                showAddButton={false}
                buttonColor="orange"
              />
            </div>
            
            <div className="flex-1 relative">
              <AutocompleteInput
                label=""
                id="company-city-input"
                value={companyCityInput}
                onChange={setCompanyCityInput}
                onFocus={() => setIsCityInputFocused(true)}
                onBlur={() => setTimeout(() => setIsCityInputFocused(false), 100)} // Verzögerung hinzugefügt
                onAdd={() => {}} // Wird nicht verwendet
                onFavoriteClick={(val) => {
                  const valueToAdd = val || companyCityInput.trim();
                  if (valueToAdd) toggleFavoriteCity(valueToAdd);
                  setCompanyCityInput('');
                }}
                suggestions={favoriteCities}
                placeholder="Ort des Unternehmens..."
                showFavoritesButton={isCityInputFocused}
                showAddButton={false}
                buttonColor="orange"
              />
            </div>
            
            {/* Hinzufügen-Button */}
            {hasInputData && (
              <button 
                onClick={addCompanyEntry} 
                className="flex items-center justify-center px-3 py-2 h-10 text-white rounded-md transition-colors duration-200"
                style={{ backgroundColor: '#F29400' }}
                title="Unternehmen und Ort zusammen hinzufügen"
              >
                <Plus className="h-4 w-4 mr-1" />
                <span>Hinzufügen</span>
              </button>
            )}
          </div>
          
          {/* Unternehmen Favoriten */}
          {favorites.length > 0 && (
            <div className="mt-4"> 
              <div className="flex items-center space-x-2 mb-1">
                <Star className="h-4 w-4 text-gray-400" />
                <h4 className="text-xs font-medium text-gray-700">Unternehmen-Favoriten:</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {favorites
                  .filter(company => !form.companies?.includes(company))
                  .map((company) => (
                  <TagButtonFavorite
                    key={company}
                    label={company}
                    onClick={() => addCompanyFavorite(company)}
                    onRemove={() => toggleFavoriteCompany(company)}
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* Ort Favoriten */}
          {favoriteCities.length > 0 && (
            <div className="mt-4"> 
              <div className="flex items-center space-x-2 mb-1">
                <Star className="h-4 w-4 text-gray-400" />
                <h4 className="text-xs font-medium text-gray-700">Ort-Favoriten:</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {favoriteCities.map((city) => (
                  <TagButtonFavorite
                    key={city}
                    label={city}
                    onClick={() => addCityFavoriteToInput(city)}
                    onRemove={() => toggleFavoriteCity(city)}
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* Ausland Checkbox */}
          <div className="flex items-center justify-end mt-4">
            <input
              type="checkbox" 
              id="show-foreign-country"
              checked={showForeignCountry}
              onChange={(e) => setShowForeignCountry(e.target.checked)}
              className="mr-2"
              style={{ accentColor: '#F29400' }}
            />
            <label htmlFor="show-foreign-country" className="text-sm text-gray-700">
              Ausland
            </label>
          </div>
          
          {/* Land Dropdown - nur anzeigen wenn Ausland ausgewählt */}
          {showForeignCountry && (
            <div className="mt-4">
              <CountryDropdown
                label=""
                value={selectedCountryInput}
                onChange={setSelectedCountryInput}
              />
            </div>
          )}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded shadow-sm p-4">
        <div className="flex justify-between mb-2">
          <h3 className="text-sm font-bold text-gray-700">Position</h3>
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
            console.log('Positions changed:', val);
            onPositionsChange(val);
            onUpdateField('position', val);
          }}
          onFocus={() => setIsPositionInputFocused(true)}
          onBlur={() => setTimeout(() => setIsPositionInputFocused(false), 100)}
          showFavoritesButton={isPositionInputFocused}
          options={[]}
          allowCustom={true}
          suggestions={cvSuggestions.positions || []}
        />
      </div>

      <div className="bg-white border border-gray-200 rounded shadow-sm p-4">
        <div className="flex justify-between mb-2">
          <h3 className="text-sm font-bold text-gray-700">Tätigkeiten</h3>
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
      
      <div className="bg-white border border-gray-200 rounded shadow-sm p-4">
        <div className="flex justify-between mb-2">
          <h3 className="text-sm font-bold text-gray-700">Weitere Angaben</h3>
          {(form.zusatzangaben && form.zusatzangaben.trim().length > 0) && (
            <button
              type="button"
              onClick={() => onUpdateField('zusatzangaben', '')}
              className="p-1 text-gray-600 hover:text-gray-900"
              title="Weitere Angaben zurücksetzen"
              aria-label="Weitere Angaben zurücksetzen"
            >
              <Eraser className="h-4 w-4" />
            </button>
          )}
        </div>
        <TextInput
          value={form.zusatzangaben || ''}
          onChange={(val) => onUpdateField('zusatzangaben', val)}
          label=""
          placeholder="Zusätzliche Informationen zur Berufserfahrung..."
          rows={4}
          id="experience-additional-info"
          name="experience-additional-info"
        />
      </div>
    </div>
  );
}