import React, { useState } from 'react';
import { Star } from 'lucide-react';
import AutocompleteInput from './AutocompleteInput';
import TagButtonFavorite from './ui/TagButtonFavorite';

interface PersonalDataFormProps {
  data: any;
  onChange: (data: any) => void;
}

export function PersonalDataForm({ data, onChange }: PersonalDataFormProps) {
  const [showStatesbuergerschaft, setShowStatesbuergerschaft] = useState(false);
  const [showAuslandField, setShowAuslandField] = useState(false);
  
  // Favoriten States
  const [favoriteTitles] = useState(['Dr.', 'Mag.', 'DI', 'Prof.']);
  const [favoriteOrte] = useState(['Wien', 'Graz', 'Salzburg', 'Innsbruck', 'Linz']);
  const [favoriteGeburtsOrte] = useState(['Wien', 'Graz', 'Salzburg', 'Berlin', 'München']);
  const [favoriteStaatsbuergerschaft] = useState(['Österreich', 'Deutschland', 'Schweiz', 'Italien']);
  const [favoriteArbeitsmarktzugang] = useState(['Unbeschränkt', 'Beschränkt', 'Arbeitserlaubnis erforderlich']);
  
  // Input States für Hinzufügen-Buttons
  const [kinderGeburtsjahr, setKinderGeburtsjahr] = useState('');
  const [socialMediaLink, setSocialMediaLink] = useState('');

  const handleInputChange = (field: string, value: any) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  const addKinderGeburtsjahr = () => {
    if (kinderGeburtsjahr.trim()) {
      const currentKinder = data.kinderGeburtsjahre || [];
      handleInputChange('kinderGeburtsjahre', [...currentKinder, kinderGeburtsjahr.trim()]);
      setKinderGeburtsjahr('');
    }
  };

  const addSocialMediaLink = () => {
    if (socialMediaLink.trim()) {
      const currentLinks = data.socialMediaLinks || [];
      handleInputChange('socialMediaLinks', [...currentLinks, socialMediaLink.trim()]);
      setSocialMediaLink('');
    }
  };

  const removeKinderGeburtsjahr = (index: number) => {
    const currentKinder = data.kinderGeburtsjahre || [];
    handleInputChange('kinderGeburtsjahre', currentKinder.filter((_: any, i: number) => i !== index));
  };

  const removeSocialMediaLink = (index: number) => {
    const currentLinks = data.socialMediaLinks || [];
    handleInputChange('socialMediaLinks', currentLinks.filter((_: any, i: number) => i !== index));
  };

  const phoneCountryCodes = [
    { code: '+43', country: 'AT', flag: '🇦🇹', name: 'Österreich' },
    { code: '+49', country: 'DE', flag: '🇩🇪', name: 'Deutschland' },
    { code: '+41', country: 'CH', flag: '🇨🇭', name: 'Schweiz' },
    { code: '+39', country: 'IT', flag: '🇮🇹', name: 'Italien' },
    { code: '+33', country: 'FR', flag: '🇫🇷', name: 'Frankreich' },
    { code: '+44', country: 'GB', flag: '🇬🇧', name: 'Vereinigtes Königreich' },
    { code: '+1', country: 'US', flag: '🇺🇸', name: 'USA' },
  ];

  return (
    <div className="space-y-6">
      {/* Namenscard */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Titel</label>
            <AutocompleteInput
              value={data.titel || ''}
              onChange={(value) => handleInputChange('titel', value)}
              onFavoriteClick={(value) => handleInputChange('titel', value)}
              suggestions={favoriteTitles}
              placeholder="z.B. Dr., Mag."
              showAddButton={false}
              showFavoritesButton={true}
            />
            {favoriteTitles.filter(title => title !== (data.titel || '')).length > 0 && (
              <div className="mt-2">
                <div className="flex items-center gap-1 mb-2">
                  <Star className="w-4 h-4 fill-current" style={{ color: '#F29400' }} />
                  <span className="text-sm text-gray-600">Favoriten:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {favoriteTitles
                    .filter(title => title !== (data.titel || ''))
                    .map((title, index) => (
                      <TagButtonFavorite
                        key={index}
                        label={title}
                        onClick={() => handleInputChange('titel', title)}
                      />
                    ))}
                </div>
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Vorname</label>
            <input
              type="text"
              value={data.vorname || ''}
              onChange={(e) => handleInputChange('vorname', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                data.vorname ? 'border-orange-500 border-2' : 'border-gray-300'
              }`}
              placeholder="Vorname"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nachname</label>
            <input
              type="text"
              value={data.nachname || ''}
              onChange={(e) => handleInputChange('nachname', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                data.nachname ? 'border-orange-500 border-2' : 'border-gray-300'
              }`}
              placeholder="Nachname"
            />
          </div>
        </div>
      </div>

      {/* Kontaktcard */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
            <div className="flex gap-2">
              <div className="w-40">
                <AutocompleteInput
                  value={data.telefonVorwahl || '+43'}
                  onChange={(value) => {
                    const formattedValue = value.startsWith('+') ? value : `+${value}`;
                    handleInputChange('telefonVorwahl', formattedValue);
                  }}
                  suggestions={phoneCountryCodes}
                  placeholder="+43"
                  formatSuggestion={(item) => (
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{item.flag}</span>
                      <span className="font-mono">{item.code}</span>
                      <span className="text-gray-600">{item.name}</span>
                    </div>
                  )}
                  getSearchableString={(item) => `${item.code} ${item.name}`}
                  getKey={(item) => item.code}
                  showAddButton={false}
                  showFavoritesButton={false}
                />
              </div>
              <input
                type="tel"
                value={data.telefonnummer || ''}
                onChange={(e) => handleInputChange('telefonnummer', e.target.value)}
                className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  data.telefonnummer ? 'border-orange-500 border-2' : 'border-gray-300'
                }`}
                placeholder="Telefonnummer"
                maxLength={20}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">E-Mail</label>
            <input
              type="email"
              value={data.email || ''}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                data.email ? 'border-orange-500 border-2' : 'border-gray-300'
              }`}
              placeholder="E-Mail-Adresse"
            />
          </div>
        </div>
      </div>

      {/* Adresscard */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Straße & Hausnummer</label>
            <input
              type="text"
              value={data.adresse || ''}
              onChange={(e) => handleInputChange('adresse', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                data.adresse ? 'border-orange-500 border-2' : 'border-gray-300'
              }`}
              placeholder="Straße & Hausnummer"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">PLZ</label>
            <input
              type="text"
              value={data.plz || ''}
              onChange={(e) => {
                const plz = e.target.value;
                handleInputChange('plz', plz);
                
                // PLZ zu Ort Konvertierung (Beispiel für österreichische PLZ)
                const plzToOrt: { [key: string]: string } = {
                  '1010': 'Wien',
                  '8010': 'Graz',
                  '5020': 'Salzburg',
                  '6020': 'Innsbruck',
                  '4020': 'Linz'
                };
                
                if (plzToOrt[plz]) {
                  handleInputChange('ort', plzToOrt[plz]);
                }
              }}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                data.plz ? 'border-orange-500 border-2' : 'border-gray-300'
              }`}
              placeholder="PLZ"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ort</label>
            <AutocompleteInput
              value={data.ort || ''}
              onChange={(value) => handleInputChange('ort', value)}
              onFavoriteClick={(value) => handleInputChange('ort', value)}
              suggestions={favoriteOrte}
              placeholder="Ort"
              showAddButton={false}
              showFavoritesButton={true}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div></div>
          <div></div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="ausland"
              checked={showAuslandField}
              onChange={(e) => setShowAuslandField(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="ausland" className="text-sm text-gray-700">Ausland</label>
          </div>
        </div>

        {favoriteOrte.filter(ort => ort !== (data.ort || '')).length > 0 && (
          <div className="mt-4">
            <div className="flex items-center gap-1 mb-2">
              <Star className="w-4 h-4 fill-current" style={{ color: '#F29400' }} />
              <span className="text-sm text-gray-600">Favoriten:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {favoriteOrte
                .filter(ort => ort !== (data.ort || ''))
                .map((ort, index) => (
                  <TagButtonFavorite
                    key={index}
                    label={ort}
                    onClick={() => handleInputChange('ort', ort)}
                  />
                ))}
            </div>
          </div>
        )}

        {showAuslandField && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Land</label>
            <input
              type="text"
              value={data.land || ''}
              onChange={(e) => handleInputChange('land', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                data.land ? 'border-orange-500 border-2' : 'border-gray-300'
              }`}
              placeholder="Land"
            />
          </div>
        )}
      </div>

      {/* Geburtsdatencard */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Geburtsdatum</label>
            <input
              type="date"
              value={data.geburtsdatum || ''}
              onChange={(e) => handleInputChange('geburtsdatum', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                data.geburtsdatum ? 'border-orange-500 border-2' : 'border-gray-300'
              }`}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Geburtsort</label>
            <AutocompleteInput
              value={data.geburtsort || ''}
              onChange={(value) => handleInputChange('geburtsort', value)}
              onFavoriteClick={(value) => handleInputChange('geburtsort', value)}
              suggestions={favoriteGeburtsOrte}
              placeholder="Geburtsort"
              showAddButton={false}
              showFavoritesButton={true}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Geburtsland</label>
            <AutocompleteInput
              value={data.geburtsland || ''}
              onChange={(value) => handleInputChange('geburtsland', value)}
              onFavoriteClick={(value) => handleInputChange('geburtsland', value)}
              suggestions={favoriteStaatsbuergerschaft}
              placeholder="Geburtsland"
              showAddButton={false}
              showFavoritesButton={true}
            />
          </div>

          <div className="flex items-end">
            <div className="flex items-center gap-2 pb-2">
              <input
                type="checkbox"
                id="staatsbuergerschaft"
                checked={showStatesbuergerschaft}
                onChange={(e) => setShowStatesbuergerschaft(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="staatsbuergerschaft" className="text-sm text-gray-700">Staatsbürgerschaft</label>
            </div>
          </div>
        </div>

        {/* Favoriten für Geburtsort */}
        {favoriteGeburtsOrte.filter(ort => ort !== (data.geburtsort || '')).length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-1 mb-2">
              <Star className="w-4 h-4 fill-current" style={{ color: '#F29400' }} />
              <span className="text-sm text-gray-600">Favoriten Geburtsort:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {favoriteGeburtsOrte
                .filter(ort => ort !== (data.geburtsort || ''))
                .map((ort, index) => (
                  <TagButtonFavorite
                    key={index}
                    label={ort}
                    onClick={() => handleInputChange('geburtsort', ort)}
                  />
                ))}
            </div>
          </div>
        )}

        {/* Favoriten für Geburtsland */}
        {favoriteStaatsbuergerschaft.filter(land => land !== (data.geburtsland || '')).length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-1 mb-2">
              <Star className="w-4 h-4 fill-current" style={{ color: '#F29400' }} />
              <span className="text-sm text-gray-600">Favoriten Geburtsland:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {favoriteStaatsbuergerschaft
                .filter(land => land !== (data.geburtsland || ''))
                .map((land, index) => (
                  <TagButtonFavorite
                    key={index}
                    label={land}
                    onClick={() => handleInputChange('geburtsland', land)}
                  />
                ))}
            </div>
          </div>
        )}

        {showStatesbuergerschaft && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Staatsbürgerschaft</label>
              <AutocompleteInput
                value={data.staatsbuergerschaft || ''}
                onChange={(value) => handleInputChange('staatsbuergerschaft', value)}
                onFavoriteClick={(value) => handleInputChange('staatsbuergerschaft', value)}
                suggestions={favoriteStaatsbuergerschaft}
                placeholder="Staatsbürgerschaft"
                showAddButton={false}
                showFavoritesButton={true}
              />
              {favoriteStaatsbuergerschaft.filter(staat => staat !== (data.staatsbuergerschaft || '')).length > 0 && (
                <div className="mt-2">
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-4 h-4 fill-current" style={{ color: '#F29400' }} />
                    <span className="text-sm text-gray-600">Favoriten:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {favoriteStaatsbuergerschaft
                      .filter(staat => staat !== (data.staatsbuergerschaft || ''))
                      .map((staat, index) => (
                        <TagButtonFavorite
                          key={index}
                          label={staat}
                          onClick={() => handleInputChange('staatsbuergerschaft', staat)}
                        />
                      ))}
                  </div>
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Arbeitsmarktzugang</label>
              <AutocompleteInput
                value={data.arbeitsmarktzugang || ''}
                onChange={(value) => handleInputChange('arbeitsmarktzugang', value)}
                onFavoriteClick={(value) => handleInputChange('arbeitsmarktzugang', value)}
                suggestions={favoriteArbeitsmarktzugang}
                placeholder="Arbeitsmarktzugang"
                showAddButton={false}
                showFavoritesButton={true}
              />
              {favoriteArbeitsmarktzugang.filter(zugang => zugang !== (data.arbeitsmarktzugang || '')).length > 0 && (
                <div className="mt-2">
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-4 h-4 fill-current" style={{ color: '#F29400' }} />
                    <span className="text-sm text-gray-600">Favoriten:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {favoriteArbeitsmarktzugang
                      .filter(zugang => zugang !== (data.arbeitsmarktzugang || ''))
                      .map((zugang, index) => (
                        <TagButtonFavorite
                          key={index}
                          label={zugang}
                          onClick={() => handleInputChange('arbeitsmarktzugang', zugang)}
                        />
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Personenstandscard */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Familienstand</label>
            <AutocompleteInput
              value={data.familienstand || ''}
              onChange={(value) => handleInputChange('familienstand', value)}
              suggestions={['Ledig', 'Verheiratet', 'Geschieden', 'Verwitwet', 'Lebensgemeinschaft']}
              placeholder="Familienstand"
              showAddButton={false}
              showFavoritesButton={false}
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Geburtsjahr der Kinder</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={kinderGeburtsjahr}
              onChange={(e) => setKinderGeburtsjahr(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Jahr eingeben"
              min="1900"
              max={new Date().getFullYear()}
            />
            {kinderGeburtsjahr.trim().length > 0 && (
              <button
                onClick={addKinderGeburtsjahr}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                +
              </button>
            )}
          </div>
          
          {data.kinderGeburtsjahre && data.kinderGeburtsjahre.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {data.kinderGeburtsjahre.map((jahr: string, index: number) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                >
                  {jahr}
                  <button
                    onClick={() => removeKinderGeburtsjahr(index)}
                    className="text-red-500 hover:text-red-700 ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Online-Präsenz-Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Homepage/Portfolio</label>
          <input
            type="url"
            value={data.homepage || ''}
            onChange={(e) => handleInputChange('homepage', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              data.homepage ? 'border-orange-500 border-2' : 'border-gray-300'
            }`}
            placeholder="https://..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Social Media Links</label>
          <div className="flex gap-2">
            <input
              type="url"
              value={socialMediaLink}
              onChange={(e) => setSocialMediaLink(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://..."
            />
            {socialMediaLink.trim().length > 0 && (
              <button
                onClick={addSocialMediaLink}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                +
              </button>
            )}
          </div>
          
          {data.socialMediaLinks && data.socialMediaLinks.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {data.socialMediaLinks.map((link: string, index: number) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                >
                  {link}
                  <button
                    onClick={() => removeSocialMediaLink(index)}
                    className="text-red-500 hover:text-red-700 ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}