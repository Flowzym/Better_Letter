import React, { useState } from 'react';
import { Star, X } from 'lucide-react';
import AutocompleteInput from './AutocompleteInput';
import TagButtonFavorite from './ui/TagButtonFavorite';
import TagButtonSelected from './ui/TagButtonSelected';

interface PersonalDataFormProps {
  data: any;
  onChange: (data: any) => void;
}

export function PersonalDataForm({ data, onChange }: PersonalDataFormProps) {
  const [showStatesbuergerschaft, setShowStatesbuergerschaft] = useState(false);
  const [showAuslandField, setShowAuslandField] = useState(false);
  
  // Favoriten States
  const [favoriteTitles, setFavoriteTitles] = useState(['Dr.', 'Mag.', 'DI', 'Prof.']);
  const [favoriteOrte, setFavoriteOrte] = useState(['Wien', 'Graz', 'Salzburg', 'Innsbruck', 'Linz']);
  const [favoriteGeburtsOrte, setFavoriteGeburtsOrte] = useState(['Wien', 'Graz', 'Salzburg', 'Berlin', 'München']);
  const [favoriteStaatsbuergerschaft, setFavoriteStaatsbuergerschaft] = useState(['Österreich', 'Deutschland', 'Schweiz', 'Italien']);
  const [favoriteArbeitsmarktzugang, setFavoriteArbeitsmarktzugang] = useState(['Unbeschränkt', 'Beschränkt', 'Arbeitserlaubnis erforderlich']);
  const [favoriteLaender, setFavoriteLaender] = useState(['Deutschland', 'Schweiz', 'Italien', 'Frankreich', 'Spanien']);
  
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

  // Favoriten-Handler
  const toggleFavoriteTitle = (title: string) => {
    setFavoriteTitles(prev => 
      prev.includes(title) 
        ? prev.filter(t => t !== title)
        : [...prev, title]
    );
  };

  const toggleFavoriteOrt = (ort: string) => {
    setFavoriteOrte(prev => 
      prev.includes(ort) 
        ? prev.filter(o => o !== ort)
        : [...prev, ort]
    );
  };

  const toggleFavoriteGeburtsort = (ort: string) => {
    setFavoriteGeburtsOrte(prev => 
      prev.includes(ort) 
        ? prev.filter(o => o !== ort)
        : [...prev, ort]
    );
  };

  const toggleFavoriteStaatsbuergerschaft = (staat: string) => {
    setFavoriteStaatsbuergerschaft(prev => 
      prev.includes(staat) 
        ? prev.filter(s => s !== staat)
        : [...prev, staat]
    );
  };

  const toggleFavoriteArbeitsmarktzugang = (zugang: string) => {
    setFavoriteArbeitsmarktzugang(prev => 
      prev.includes(zugang) 
        ? prev.filter(z => z !== zugang)
        : [...prev, zugang]
    );
  };

  const toggleFavoriteLand = (land: string) => {
    setFavoriteLaender(prev => 
      prev.includes(land) 
        ? prev.filter(l => l !== land)
        : [...prev, land]
    );
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
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Titel</label>
            <AutocompleteInput
              value={data.titel || ''}
              onChange={(value) => handleInputChange('titel', value)}
              onFavoriteClick={(value) => {
                handleInputChange('titel', value);
                toggleFavoriteTitle(value);
              }}
              suggestions={favoriteTitles}
              placeholder="z.B. Dr., Mag."
              showAddButton={false}
              showFavoritesButton={true}
              formatSuggestion={(item) => item}
              getSearchableString={(item) => item}
              getKey={(item) => item}
            />
          </div>
          
          <div className="md:col-span-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">Vorname</label>
            <input
              type="text"
              value={data.vorname || ''}
              onChange={(e) => handleInputChange('vorname', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': '#F29400' } as React.CSSProperties}
              placeholder="Vorname"
            />
          </div>
          
          <div className="md:col-span-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">Nachname</label>
            <input
              type="text"
              value={data.nachname || ''}
              onChange={(e) => handleInputChange('nachname', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': '#F29400' } as React.CSSProperties}
              placeholder="Nachname"
            />
          </div>
        </div>

        {/* Titel Favoriten - volle Breite */}
        {favoriteTitles.filter(title => title !== (data.titel || '')).length > 0 && (
          <div className="mt-4">
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
                    onRemove={() => toggleFavoriteTitle(title)}
                  />
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Kontaktcard */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
            <div className="flex gap-2">
              <div className="w-32">
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
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                style={{ '--tw-ring-color': '#F29400' } as React.CSSProperties}
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': '#F29400' } as React.CSSProperties}
              placeholder="E-Mail-Adresse"
            />
          </div>
        </div>
      </div>

      {/* Adresscard */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
          <div className="md:col-span-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Straße & Hausnummer</label>
            <input
              type="text"
              value={data.adresse || ''}
              onChange={(e) => handleInputChange('adresse', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': '#F29400' } as React.CSSProperties}
              placeholder="Straße & Hausnummer"
            />
          </div>
          
          <div className="md:col-span-2">
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': '#F29400' } as React.CSSProperties}
              placeholder="PLZ"
            />
          </div>
          
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">Ort</label>
            <AutocompleteInput
              value={data.ort || ''}
              onChange={(value) => handleInputChange('ort', value)}
              onFavoriteClick={(value) => {
                handleInputChange('ort', value);
                toggleFavoriteOrt(value);
              }}
              suggestions={favoriteOrte}
              placeholder="Ort"
              showAddButton={false}
              showFavoritesButton={true}
              formatSuggestion={(item) => item}
              getSearchableString={(item) => item}
              getKey={(item) => item}
            />
          </div>

          <div className="md:col-span-1 flex items-end">
            <div className="flex items-center gap-2 pb-2">
              <input
                type="checkbox"
                id="ausland"
                checked={showAuslandField}
                onChange={(e) => setShowAuslandField(e.target.checked)}
                className="rounded"
                style={{ accentColor: '#F29400' }}
              />
              <label htmlFor="ausland" className="text-sm text-gray-700 whitespace-nowrap">Ausland</label>
            </div>
          </div>
        </div>

        {favoriteOrte.filter(ort => ort !== (data.ort || '')).length > 0 && (
          <div className="mb-4">
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
                    onRemove={() => toggleFavoriteOrt(ort)}
                  />
                ))}
            </div>
          </div>
        )}

        {showAuslandField && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Land</label>
            <AutocompleteInput
              value={data.land || ''}
              onChange={(value) => handleInputChange('land', value)}
              onFavoriteClick={(value) => {
                handleInputChange('land', value);
                toggleFavoriteLand(value);
              }}
              suggestions={favoriteLaender}
              placeholder="Land"
              showAddButton={false}
              showFavoritesButton={true}
              formatSuggestion={(item) => item}
              getSearchableString={(item) => item}
              getKey={(item) => item}
            />
            
            {favoriteLaender.filter(land => land !== (data.land || '')).length > 0 && (
              <div className="mt-2">
                <div className="flex items-center gap-1 mb-2">
                  <Star className="w-4 h-4 fill-current" style={{ color: '#F29400' }} />
                  <span className="text-sm text-gray-600">Favoriten:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {favoriteLaender
                    .filter(land => land !== (data.land || ''))
                    .map((land, index) => (
                      <TagButtonFavorite
                        key={index}
                        label={land}
                        onClick={() => handleInputChange('land', land)}
                        onRemove={() => toggleFavoriteLand(land)}
                      />
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Geburtsdatencard */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">Geburtsdatum</label>
            <input
              type="date"
              value={data.geburtsdatum || ''}
              onChange={(e) => handleInputChange('geburtsdatum', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': '#F29400' } as React.CSSProperties}
            />
          </div>
          
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">Geburtsort</label>
            <AutocompleteInput
              value={data.geburtsort || ''}
              onChange={(value) => handleInputChange('geburtsort', value)}
              onFavoriteClick={(value) => {
                handleInputChange('geburtsort', value);
                toggleFavoriteGeburtsort(value);
              }}
              suggestions={favoriteGeburtsOrte}
              placeholder="Geburtsort"
              showAddButton={false}
              showFavoritesButton={true}
              formatSuggestion={(item) => item}
              getSearchableString={(item) => item}
              getKey={(item) => item}
            />
          </div>
          
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">Geburtsland</label>
            <AutocompleteInput
              value={data.geburtsland || ''}
              onChange={(value) => handleInputChange('geburtsland', value)}
              onFavoriteClick={(value) => {
                handleInputChange('geburtsland', value);
                toggleFavoriteStaatsbuergerschaft(value);
              }}
              suggestions={favoriteStaatsbuergerschaft}
              placeholder="Geburtsland"
              showAddButton={false}
              showFavoritesButton={true}
              formatSuggestion={(item) => item}
              getSearchableString={(item) => item}
              getKey={(item) => item}
            />
          </div>

          <div className="md:col-span-3 flex items-end">
            <div className="flex items-center gap-2 pb-2">
              <input
                type="checkbox"
                id="staatsbuergerschaft"
                checked={showStatesbuergerschaft}
                onChange={(e) => setShowStatesbuergerschaft(e.target.checked)}
                className="rounded"
                style={{ accentColor: '#F29400' }}
              />
              <label htmlFor="staatsbuergerschaft" className="text-sm text-gray-700 whitespace-nowrap">Staatsbürgerschaft</label>
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
                    onRemove={() => toggleFavoriteGeburtsort(ort)}
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
                    onRemove={() => toggleFavoriteStaatsbuergerschaft(land)}
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
                onFavoriteClick={(value) => {
                  handleInputChange('staatsbuergerschaft', value);
                  toggleFavoriteStaatsbuergerschaft(value);
                }}
                suggestions={favoriteStaatsbuergerschaft}
                placeholder="Staatsbürgerschaft"
                showAddButton={false}
                showFavoritesButton={true}
                formatSuggestion={(item) => item}
                getSearchableString={(item) => item}
                getKey={(item) => item}
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
                          onRemove={() => toggleFavoriteStaatsbuergerschaft(staat)}
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
                onFavoriteClick={(value) => {
                  handleInputChange('arbeitsmarktzugang', value);
                  toggleFavoriteArbeitsmarktzugang(value);
                }}
                suggestions={favoriteArbeitsmarktzugang}
                placeholder="Arbeitsmarktzugang"
                showAddButton={false}
                showFavoritesButton={true}
                formatSuggestion={(item) => item}
                getSearchableString={(item) => item}
                getKey={(item) => item}
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
                          onRemove={() => toggleFavoriteArbeitsmarktzugang(zugang)}
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
              formatSuggestion={(item) => item}
              getSearchableString={(item) => item}
              getKey={(item) => item}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Geburtsjahr der Kinder</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={kinderGeburtsjahr}
                onChange={(e) => setKinderGeburtsjahr(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                style={{ '--tw-ring-color': '#F29400' } as React.CSSProperties}
                placeholder="Jahr eingeben"
                min="1900"
                max={new Date().getFullYear()}
              />
              {kinderGeburtsjahr.trim().length > 0 && (
                <button
                  onClick={addKinderGeburtsjahr}
                  className="px-4 py-2 text-white rounded-md hover:opacity-90 focus:outline-none focus:ring-2"
                  style={{ backgroundColor: '#F29400', '--tw-ring-color': '#F29400' } as React.CSSProperties}
                >
                  +
                </button>
              )}
            </div>
          </div>
        </div>
        
        {data.kinderGeburtsjahre && data.kinderGeburtsjahre.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {data.kinderGeburtsjahre.map((jahr: string, index: number) => (
              <TagButtonSelected
                key={index}
                label={jahr}
                onRemove={() => removeKinderGeburtsjahr(index)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Online-Präsenz-Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Homepage/Portfolio</label>
          <input
            type="url"
            value={data.homepage || ''}
            onChange={(e) => handleInputChange('homepage', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
            style={{ '--tw-ring-color': '#F29400' } as React.CSSProperties}
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
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': '#F29400' } as React.CSSProperties}
              placeholder="https://..."
            />
            {socialMediaLink.trim().length > 0 && (
              <button
                onClick={addSocialMediaLink}
                className="px-4 py-2 text-white rounded-md hover:opacity-90 focus:outline-none focus:ring-2"
                style={{ backgroundColor: '#F29400', '--tw-ring-color': '#F29400' } as React.CSSProperties}
              >
                +
              </button>
            )}
          </div>
          
          {data.socialMediaLinks && data.socialMediaLinks.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {data.socialMediaLinks.map((link: string, index: number) => (
                <TagButtonSelected
                  key={index}
                  label={link}
                  onRemove={() => removeSocialMediaLink(index)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}