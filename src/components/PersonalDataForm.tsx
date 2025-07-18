import React, { useState, useEffect } from 'react';
import { X, ToggleLeft, ToggleRight } from 'lucide-react';
import AutocompleteInput from './AutocompleteInput';
import TagButtonFavorite from './ui/TagButtonFavorite';
import TagButtonSelected from './ui/TagButtonSelected';
import DatePicker from './DatePicker';
import PhoneInput from './PhoneInput';
import CountryAutocomplete from './CountryAutocomplete';
import CountryDropdown from './CountryDropdown';
import ToggleSwitch from './ToggleSwitch';
import Card from './cards/Card';

interface PersonalData {
  titel: string;
  vorname: string;
  nachname: string;
  telefon: string;
  telefonVorwahl: string;
  email: string;
  adresse: string;
  plz: string;
  ort: string;
  land: string;
  ausland: boolean;
  geburtsdatum: string;
  geburtsort: string;
  geburtsland: string;
  staatsbuergerschaft: string;
  staatsbuergerschaftCheckbox: boolean;
  familienstand: string;
  kinder: string[];
  arbeitsmarktzugang: string;
  socialMedia: string[];
}

interface PersonalDataFormProps {
  data?: PersonalData;
  onChange?: (data: PersonalData) => void;
}

const phoneCountryCodes = [
  { code: '+1', country: 'USA/Canada', flag: '🇺🇸' },
  { code: '+43', country: 'Österreich', flag: '🇦🇹' },
  { code: '+49', country: 'Deutschland', flag: '🇩🇪' },
  { code: '+41', country: 'Schweiz', flag: '🇨🇭' },
  { code: '+33', country: 'Frankreich', flag: '🇫🇷' },
  { code: '+39', country: 'Italien', flag: '🇮🇹' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
];

const titleSuggestions = ['Dr.', 'Mag.', 'DI', 'Prof.', 'MSc', 'BSc', 'MBA'];
const citySuggestions = ['Wien', 'Graz', 'Salzburg', 'Innsbruck', 'Linz', 'Klagenfurt'];
const countrySuggestions = ['Österreich', 'Deutschland', 'Schweiz', 'Italien', 'Frankreich'];
const familienstandOptions = ['Keine Angabe', 'ledig', 'verheiratet', 'geschieden', 'verwitwet'];
const arbeitsmarktzugangOptions = ['Keine Angabe', 'Freier Zugang', 'Beschränkt', 'In Prüfung', 'Asylverfahren', 'Kein Zugang'];

export default function PersonalDataForm({ data = {}, onChange = () => {} }: PersonalDataFormProps) {
  // Ensure data has all required properties with defaults
  const safeData: PersonalData = {
    titel: '',
    vorname: '',
    nachname: '',
    email: '',
    telefon: '',
    telefonVorwahl: '+43',
    adresse: '',
    plz: '',
    ort: '',
    land: '',
    geburtsort: '',
    geburtsland: '',
    geburtsdatum: '',
    staatsangehoerigkeit: '',
    familienstand: '',
    kinder: [],
    socialMedia: [],
    ausland: false,
    staatsbuergerschaftCheckbox: false,
    ...data
  };

  const [favorites, setFavorites] = useState({
    titel: titleSuggestions.slice(0, 4),
    ort: citySuggestions.slice(0, 5),
    geburtsort: citySuggestions.slice(0, 5),
    arbeitsmarktzugang: arbeitsmarktzugangOptions.slice(0, 2),
    land: countrySuggestions.slice(0, 4),
  });

  const [newChild, setNewChild] = useState('');
  const [newSocialMedia, setNewSocialMedia] = useState('');
  const [newHomepage, setNewHomepage] = useState('');
  const [showSocialMedia, setShowSocialMedia] = useState(false);
  
  // Set default values for country fields
  useEffect(() => {
    if (!safeData.geburtsland) {
      updateData('geburtsland', 'Österreich');
    }
  }, []);

  // Sync Staatsbürgerschaft with Geburtsland when checkbox is active and Geburtsland changes
  useEffect(() => {
    if (safeData.geburtsland && safeData.staatsbuergerschaftCheckbox) {
      updateData('staatsbuergerschaft', safeData.geburtsland);
    }
  }, [safeData.geburtsland, safeData.staatsbuergerschaftCheckbox]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem('personalDataFavorites');
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('personalDataFavorites', JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  }, [favorites]);

  const updateData = (field: keyof PersonalData, value: any) => {
    onChange({ ...safeData, [field]: value });
  };

  const toggleFavorite = (category: keyof typeof favorites, value: string) => {
    setFavorites(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value]
    }));
  };

  const addChild = () => {
    if (newChild.trim()) {
      updateData('kinder', [...safeData.kinder, newChild.trim()]);
      setNewChild('');
    }
  };

  const removeChild = (index: number) => {
    updateData('kinder', safeData.kinder.filter((_, i) => i !== index));
  };

  const addSocialMedia = () => {
    if (newSocialMedia.trim()) {
      updateData('socialMedia', [...safeData.socialMedia, newSocialMedia.trim()]);
      setNewSocialMedia('');
    }
  };

  const addHomepage = () => {
    if (newHomepage.trim()) {
      updateData('socialMedia', [...safeData.socialMedia, newHomepage.trim()]);
      setNewHomepage('');
    }
  };

  const removeSocialMedia = (index: number) => {
    updateData('socialMedia', safeData.socialMedia.filter((_, i) => i !== index));
  };

  const handleNumericInput = (value: string, setter: (val: string) => void) => {
    // Nur Ziffern zulassen
    const numericValue = value.replace(/[^\d]/g, '');
    setter(numericValue);
  };

  return (
    <div className="space-y-4">
      {/* Name & Titel */}
      <div className="bg-white border border-gray-200 rounded shadow-sm p-4 space-y-4">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-3">
            <AutocompleteInput
              label="Titel"
              value={safeData.titel}
              onChange={(value) => updateData('titel', value)}
              showAddButton={false}
              onFavoriteClick={(value) => toggleFavorite('titel', value || '')}
              suggestions={[...favorites.titel, ...titleSuggestions]}
              placeholder="Titel"
            />
          </div>
          
          <div className="col-span-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vorname
            </label>
            <div className="relative">
              <input
                type="text"
                id="personal-vorname"
                name="vorname"
                value={safeData.vorname || ''}
                onChange={(e) => updateData('vorname', e.target.value)}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 pr-10"
                placeholder="Vorname"
              />
              {safeData.vorname && (
                <button
                  type="button"
                  onClick={() => updateData('vorname', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-300"
                  aria-label="Vorname löschen"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
          
          <div className="col-span-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nachname
            </label>
            <div className="relative">
              <input
                type="text"
                id="personal-nachname"
                name="nachname"
                value={safeData.nachname || ''}
                onChange={(e) => updateData('nachname', e.target.value)}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 pr-10"
                placeholder="Nachname"
              />
              {safeData.nachname && (
                <button
                  type="button"
                  onClick={() => updateData('nachname', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-300"
                  aria-label="Nachname löschen"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Kontaktdaten */}
      <div className="bg-white border border-gray-200 rounded shadow-sm p-4 space-y-4">
        <div className="space-y-4">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefon
              </label>
              <PhoneInput
                countryCode={safeData.telefonVorwahl || '+43'}
                phoneNumber={safeData.telefon || ''}
                onCountryChange={(code) => updateData('telefonVorwahl', code)}
                onPhoneChange={(phone) => updateData('telefon', phone)}
              />
            </div>
            
            <div className="col-span-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-Mail
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="personal-email"
                  name="email"
                  value={safeData.email || ''}
                  onChange={(e) => updateData('email', e.target.value)}
                  className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 pr-10"
                  placeholder="email@beispiel.com"
                />
                {safeData.email && (
                  <button
                    type="button"
                    onClick={() => updateData('email', '')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-300"
                    aria-label="E-Mail löschen"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Social Media Checkbox */}
          <div className="flex items-center justify-end space-x-2">
            <span className="text-sm font-medium text-gray-700">Social Media / Homepage</span>
            <button
              type="button"
              onClick={() => setShowSocialMedia(!showSocialMedia)}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200"
              title={showSocialMedia ? 'Social Media deaktivieren' : 'Social Media aktivieren'}
            >
              {showSocialMedia ? (
                <ToggleRight className="h-6 w-6" style={{ color: '#F29400' }} />
              ) : (
                <ToggleLeft className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Social Media Fields */}
          {showSocialMedia && (
            <div>
              <div className="grid grid-cols-2 gap-4">
                {/* Social Media */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Social Media
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      id="personal-social-media"
                      name="socialMedia"
                      value={newSocialMedia}
                      onChange={(e) => setNewSocialMedia(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addSocialMedia()}
                      className="flex-1 h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                      placeholder="https://linkedin.com/in/..."
                    />
                    {newSocialMedia.trim() && (
                      <button
                        onClick={addSocialMedia}
                        className="w-10 h-10 text-white rounded-md transition-colors duration-200 flex items-center justify-center"
                        style={{ backgroundColor: '#F6A800' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F29400'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F6A800'}
                      >
                        +
                      </button>
                    )}
                  </div>
                </div>

                {/* Homepage */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Homepage
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      id="personal-homepage"
                      name="homepage"
                      value={newHomepage}
                      onChange={(e) => setNewHomepage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addHomepage()}
                      className="flex-1 h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                      placeholder="https://meine-website.com"
                    />
                    {newHomepage.trim() && (
                      <button
                        onClick={addHomepage}
                        className="w-10 h-10 text-white rounded-md transition-colors duration-200 flex items-center justify-center"
                        style={{ backgroundColor: '#F6A800' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F29400'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F6A800'}
                      >
                        +
                      </button>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Social Media Tags below fields */}
              {safeData.socialMedia.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {safeData.socialMedia.map((link, index) => (
                    <TagButtonSelected
                      key={index}
                      label={link}
                      onRemove={() => removeSocialMedia(index)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Adresse */}
      <div className="bg-white border border-gray-200 rounded shadow-sm p-4 space-y-4">
        <div className="space-y-4">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-5">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Straße & Hausnummer
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="personal-adresse"
                  name="adresse"
                  value={safeData.adresse || ''}
                  onChange={(e) => updateData('adresse', e.target.value)}
                  className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 pr-10"
                  placeholder="Musterstraße 123"
                />
                {safeData.adresse && (
                  <button
                    type="button"
                    onClick={() => updateData('adresse', '')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-300"
                    aria-label="Adresse löschen"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                PLZ
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  id="personal-plz"
                  name="plz"
                  value={safeData.plz || ''}
                  onChange={(e) => handleNumericInput(e.target.value, (val) => updateData('plz', val))}
                  className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 pr-10"
                  placeholder="1010"
                />
                {safeData.plz && (
                  <button
                    type="button"
                    onClick={() => updateData('plz', '')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-300"
                    aria-label="PLZ löschen"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            
            <div className="col-span-5">
              <AutocompleteInput
                label="Ort"
                value={safeData.ort || ''}
                onChange={(value) => updateData('ort', value)}
                showAddButton={false}
                onFavoriteClick={(value) => toggleFavorite('ort', value || '')}
                suggestions={[...favorites.ort, ...citySuggestions]}
                placeholder="Wien"
              />
            </div>
          </div>

          {/* Ausland Checkbox */}
          <div className="flex items-center justify-end space-x-2">
            <span className="text-sm font-medium text-gray-700">Ausland</span>
            <button
              type="button"
              onClick={() => updateData('ausland', !(safeData.ausland || false))}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200"
              title={safeData.ausland ? 'Ausland deaktivieren' : 'Ausland aktivieren'}
            >
              {safeData.ausland ? (
                <ToggleRight className="h-6 w-6" style={{ color: '#F29400' }} />
              ) : (
                <ToggleLeft className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Land Field - shown in new row when Ausland is checked */}
          {safeData.ausland && (
            <div>
              <CountryDropdown
                label="Land"
                value={safeData.land || ''}
                onChange={(value) => updateData('land', value)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Geburtsdaten & Staatsbürgerschaft */}
      <div className="bg-white border border-gray-200 rounded shadow-sm p-4 space-y-4">
          {/* Geburtsdaten mit Checkbox */}
          <div className="grid grid-cols-3 gap-4 items-start">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Geburtsdatum
              </label>
              <DatePicker
                className="w-full"
                value={safeData.geburtsdatum || ''}
                onChange={(value) => updateData('geburtsdatum', value)}
              />
            </div>
            
            <div>
              <AutocompleteInput
                className="w-full"
                label="Geburtsort"
                value={safeData.geburtsort || ''}
                onChange={(value) => updateData('geburtsort', value)}
                showAddButton={false}
                onFavoriteClick={(value) => toggleFavorite('geburtsort', value || '')}
                suggestions={[...favorites.geburtsort, ...citySuggestions]}
               placeholder="Geburtsort"
              />
            </div>
            
            <div>
              <CountryDropdown
                className="w-full"
                label="Geburtsland"
                value={safeData.geburtsland || ''}
                onChange={(value) => updateData('geburtsland', value)}
              />
            </div>
          </div>

          {/* Staatsbürgerschaft Checkbox */}
          <div className="flex items-center justify-end space-x-2">
            <span className="text-sm font-medium text-gray-700">Staatsbürgerschaft</span>
            <ToggleSwitch
              checked={safeData.staatsbuergerschaftCheckbox || false}
              onChange={(checked) => updateData('staatsbuergerschaftCheckbox', checked)}
              label=""
            />
          </div>

          {/* Bedingte Felder für Staatsbürgerschaft und Arbeitsmarktzugang */}
          {safeData.staatsbuergerschaftCheckbox && (
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-6">
                <CountryDropdown
                  label="Staatsbürgerschaft"
                  value={safeData.staatsbuergerschaft || ''}
                  onChange={(value) => updateData('staatsbuergerschaft', value)}
                />
              </div>
              
              <div className="col-span-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Arbeitsmarktzugang
                </label>
                <select
                  id="personal-arbeitsmarktzugang"
                  name="arbeitsmarktzugang"
                  value={safeData.arbeitsmarktzugang || ''}
                  onChange={(e) => updateData('arbeitsmarktzugang', e.target.value)}
                  className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 bg-white"
                >
                  {arbeitsmarktzugangOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
      </div>

      {/* Familienstand */}
      <div className="bg-white border border-gray-200 rounded shadow-sm p-4 space-y-4">
        <div className="space-y-4">
          <div className="grid grid-cols-12 gap-4 items-start">
            <div className="col-span-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Familienstand
              </label>
              <select
                id="personal-familienstand"
                name="familienstand"
                value={safeData.familienstand || ''}
                onChange={(e) => updateData('familienstand', e.target.value)}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 bg-white"
              >
                {familienstandOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            {/* Kinder */}
            <div className="col-span-8">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Geburtsjahre Kinder
              </label>
              
              <div className="flex space-x-2">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  id="personal-kinder"
                  name="kinder"
                  value={newChild}
                  onChange={(e) => handleNumericInput(e.target.value, setNewChild)}
                  onKeyPress={(e) => e.key === 'Enter' && addChild()}
                  className="flex-1 h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                  placeholder="z.B. 2010"
                />
                {newChild.trim() && (
                  <button
                    onClick={addChild}
                    className="w-10 h-10 text-white rounded-md transition-colors duration-200 flex items-center justify-center"
                    style={{ backgroundColor: '#F6A800' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F29400'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F6A800'}
                  >
                    +
                  </button>
                )}
              </div>
              
              {/* Kinder Tags below field */}
              {(safeData.kinder || []).length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {(safeData.kinder || []).map((child, index) => (
                    <TagButtonSelected
                      key={index}
                      label={child}
                      onRemove={() => removeChild(index)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}