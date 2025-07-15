import React, { useState, useEffect } from 'react';
import AutocompleteInput from './AutocompleteInput';
import TagButtonFavorite from './ui/TagButtonFavorite';
import TagButtonSelected from './ui/TagButtonSelected';
import DatePicker from './DatePicker';
import PhoneInput from './PhoneInput';
import CountryAutocomplete from './CountryAutocomplete';
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
  data: PersonalData;
  onChange: (data: PersonalData) => void;
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
const familienstandOptions = ['ledig', 'verheiratet', 'geschieden', 'verwitwet'];
const arbeitsmarktzugangOptions = ['EU-Bürger', 'Arbeitserlaubnis', 'Rot-Weiß-Rot Karte'];

export default function PersonalDataForm({ data, onChange }: PersonalDataFormProps) {
  const [favorites, setFavorites] = useState({
    titel: titleSuggestions.slice(0, 4),
    ort: citySuggestions.slice(0, 5),
    geburtsort: citySuggestions.slice(0, 5),
    geburtsland: countrySuggestions.slice(0, 4),
    staatsbuergerschaft: countrySuggestions.slice(0, 4),
    arbeitsmarktzugang: arbeitsmarktzugangOptions.slice(0, 2),
    land: countrySuggestions.slice(0, 4),
  });

  const [newChild, setNewChild] = useState('');
  const [newSocialMedia, setNewSocialMedia] = useState('');
  const [showSocialMedia, setShowSocialMedia] = useState(false);

  const updateData = (field: keyof PersonalData, value: any) => {
    onChange({ ...data, [field]: value });
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
      updateData('kinder', [...data.kinder, newChild.trim()]);
      setNewChild('');
    }
  };

  const removeChild = (index: number) => {
    updateData('kinder', data.kinder.filter((_, i) => i !== index));
  };

  const addSocialMedia = () => {
    if (newSocialMedia.trim()) {
      updateData('socialMedia', [...data.socialMedia, newSocialMedia.trim()]);
      setNewSocialMedia('');
    }
  };

  const removeSocialMedia = (index: number) => {
    updateData('socialMedia', data.socialMedia.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Name & Titel */}
      <Card title="">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-3">
            <AutocompleteInput
              label="Titel"
              value={data.titel}
              onChange={(value) => updateData('titel', value)}
              onAdd={(value) => updateData('titel', value || '')}
              onFavoriteClick={(value) => toggleFavorite('titel', value || '')}
              suggestions={[...favorites.titel, ...titleSuggestions]}
              placeholder="Titel eingeben"
              showFavoritesButton
            />
          </div>
          
          <div className="col-span-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vorname
            </label>
            <input
              type="text"
              value={data.vorname}
              onChange={(e) => updateData('vorname', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
              placeholder="Vorname eingeben"
            />
          </div>
          
          <div className="col-span-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nachname
            </label>
            <input
              type="text"
              value={data.nachname}
              onChange={(e) => updateData('nachname', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
              placeholder="Nachname eingeben"
            />
          </div>
        </div>
      </Card>

      {/* Kontaktdaten */}
      <Card title="">
        <div className="space-y-4">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefon
              </label>
              <PhoneInput
                countryCode={data.telefonVorwahl}
                phoneNumber={data.telefon}
                onCountryChange={(code) => updateData('telefonVorwahl', code)}
                onPhoneChange={(phone) => updateData('telefon', phone)}
              />
            </div>
            
            <div className="col-span-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-Mail
              </label>
              <input
                type="email"
                value={data.email}
                onChange={(e) => updateData('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                placeholder="email@beispiel.com"
              />
            </div>
          </div>

          {/* Social Media Checkbox */}
          <div className="flex items-center justify-end">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showSocialMedia}
                onChange={(e) => setShowSocialMedia(e.target.checked)}
                className="focus:ring-1"
                style={{ accentColor: '#F29400', '--tw-ring-color': '#F29400' } as React.CSSProperties}
              />
              <span className="text-sm font-medium text-gray-500">Social Media / Homepage</span>
            </label>
          </div>

          {/* Social Media Fields */}
          {showSocialMedia && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Social Media / Homepage
              </label>
              
              {data.socialMedia.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {data.socialMedia.map((link, index) => (
                    <TagButtonSelected
                      key={index}
                      label={link}
                      onRemove={() => removeSocialMedia(index)}
                    />
                  ))}
                </div>
              )}
              
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newSocialMedia}
                  onChange={(e) => setNewSocialMedia(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addSocialMedia()}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                  placeholder="https://linkedin.com/in/..."
                />
                <button
                  onClick={addSocialMedia}
                  className="px-4 py-2 text-white rounded-md"
                  style={{ backgroundColor: '#F29400' }}
                >
                  Hinzufügen
                </button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Adresse */}
      <Card title="">
        <div className="space-y-4">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-5">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Straße & Hausnummer
              </label>
              <input
                type="text"
                value={data.adresse}
                onChange={(e) => updateData('adresse', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                placeholder="Musterstraße 123"
              />
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                PLZ
              </label>
              <input
                type="text"
                value={data.plz}
                onChange={(e) => updateData('plz', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                placeholder="1010"
              />
            </div>
            
            <div className="col-span-5">
              <AutocompleteInput
                label="Ort"
                value={data.ort}
                onChange={(value) => updateData('ort', value)}
                onAdd={(value) => updateData('ort', value || '')}
                onFavoriteClick={(value) => toggleFavorite('ort', value || '')}
                suggestions={[...favorites.ort, ...citySuggestions]}
                placeholder="Wien"
                showFavoritesButton
              />
            </div>
          </div>

          {/* Ausland Checkbox */}
          <div className="flex items-center justify-end">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={data.ausland}
                onChange={(e) => updateData('ausland', e.target.checked)}
                className="focus:ring-1"
                style={{ accentColor: '#F29400', '--tw-ring-color': '#F29400' } as React.CSSProperties}
              />
              <span className="text-sm font-medium text-gray-500">Ausland</span>
            </label>
          </div>

          {/* Land Field - shown in new row when Ausland is checked */}
          {data.ausland && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Land
              </label>
              <input
                type="text"
                value={data.land}
                onChange={(e) => updateData('land', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                placeholder="Deutschland"
              />
            </div>
          )}
        </div>
      </Card>

      {/* Geburtsdaten & Staatsbürgerschaft */}
      <Card title="">
        <>
          {/* Geburtsdaten mit Checkbox */}
          <div className="grid grid-cols-12 gap-4 items-center">
            <div className="col-span-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Geburtsdatum
              </label>
              <DatePicker
                value={data.geburtsdatum}
                onChange={(value) => updateData('geburtsdatum', value)}
              />
            </div>
            
            <div className="col-span-4">
              <AutocompleteInput
                label="Geburtsort"
                value={data.geburtsort}
                onChange={(value) => updateData('geburtsort', value)}
                onAdd={(value) => updateData('geburtsort', value || '')}
                onFavoriteClick={(value) => toggleFavorite('geburtsort', value || '')}
                suggestions={[...favorites.geburtsort, ...citySuggestions]}
                placeholder="Geburtsort eingeben"
                showFavoritesButton
              />
            </div>
            
            <div className="col-span-4">
              <AutocompleteInput
                label="Geburtsland"
                value={data.geburtsland}
                onChange={(value) => updateData('geburtsland', value)}
                onAdd={(value) => updateData('geburtsland', value || '')}
                onFavoriteClick={(value) => toggleFavorite('geburtsland', value || '')}
                suggestions={[...favorites.geburtsland, ...countrySuggestions]}
                placeholder="Geburtsland eingeben"
                showFavoritesButton
              />
            </div>
          </div>

          {/* Staatsbürgerschaft Checkbox */}
          <div className="flex items-center justify-end">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={data.staatsbuergerschaftCheckbox}
                onChange={(e) => updateData('staatsbuergerschaftCheckbox', e.target.checked)}
                className="focus:ring-1"
                style={{ accentColor: '#F29400', '--tw-ring-color': '#F29400' } as React.CSSProperties}
              />
              <span className="text-sm font-medium text-gray-500">Staatsbürgerschaft & Arbeitsmarktzugang</span>
            </label>
          </div>

          {/* Bedingte Felder für Staatsbürgerschaft und Arbeitsmarktzugang */}
          {data.staatsbuergerschaftCheckbox && (
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-6">
                <AutocompleteInput
                  label="Staatsbürgerschaft"
                  value={data.staatsbuergerschaft}
                  onChange={(value) => updateData('staatsbuergerschaft', value)}
                  onAdd={(value) => updateData('staatsbuergerschaft', value || '')}
                  onFavoriteClick={(value) => toggleFavorite('staatsbuergerschaft', value || '')}
                  suggestions={[...favorites.staatsbuergerschaft, ...countrySuggestions]}
                  placeholder="Staatsbürgerschaft eingeben"
                  showFavoritesButton
                />
              </div>
              
              <div className="col-span-6">
                <AutocompleteInput
                  label="Arbeitsmarktzugang"
                  value={data.arbeitsmarktzugang}
                  onChange={(value) => updateData('arbeitsmarktzugang', value)}
                  onAdd={(value) => updateData('arbeitsmarktzugang', value || '')}
                  onFavoriteClick={(value) => toggleFavorite('arbeitsmarktzugang', value || '')}
                  suggestions={[...favorites.arbeitsmarktzugang, ...arbeitsmarktzugangOptions]}
                  placeholder="Arbeitsmarktzugang eingeben"
                  showFavoritesButton
                />
              </div>
            </div>
          )}
        </>
      </Card>

      {/* Familienstand */}
      <Card title="">
        <div className="space-y-4">
          <div className="grid grid-cols-12 gap-4 items-start">
            <div className="col-span-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Familienstand
              </label>
              <select
                value={data.familienstand}
                onChange={(e) => updateData('familienstand', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
              >
                <option value="">Familienstand auswählen</option>
                {familienstandOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            {/* Kinder */}
            <div className="col-span-8">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kinder (Geburtsjahre)
              </label>
              
              {data.kinder.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {data.kinder.map((child, index) => (
                    <TagButtonSelected
                      key={index}
                      label={child}
                      onRemove={() => removeChild(index)}
                    />
                  ))}
                </div>
              )}
              
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newChild}
                  onChange={(e) => setNewChild(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addChild()}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                  placeholder="z.B. 2010"
                />
                <button
                  onClick={addChild}
                  className="px-4 py-2 text-white rounded-md"
                  style={{ backgroundColor: '#F29400' }}
                >
                  Hinzufügen
                </button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}