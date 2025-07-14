import React, { useState, useRef, useEffect } from 'react';
import { Plus, X, Star, Calendar, Globe, Phone, Mail, Link as LinkIcon, Users } from 'lucide-react';
import DatePicker from './DatePicker';
import CountryAutocomplete from './CountryAutocomplete';
import PhoneInput from './PhoneInput';
import TagButtonSelected from './ui/TagButtonSelected';

interface PersonalData {
  // Name und Titel
  vorname: string;
  nachname: string;
  vorangestellterTitel: string;
  nachgestellterTitel: string;
  
  // Geburt
  geburtsdatum: string; // DD.MM.YYYY
  geburtsort: string;
  staatsbuegerschaft: string;
  
  // Adresse
  adresse: string;
  ort: string;
  
  // Kontakt
  telefon: string;
  laendervorwahl: string;
  email: string;
  
  // Online
  homepage: string;
  socialMediaLinks: string[];
  
  // Personenstand
  personenstand: string;
  kinderGeburtsjahre: string[];
}

const TITEL_OPTIONEN = [
  'Dr.',
  'Prof.',
  'Prof. Dr.',
  'Mag.',
  'Dipl.-Ing.',
  'Ing.',
  'MSc',
  'BSc',
  'MBA',
  'PhD'
];

const PERSONENSTAND_OPTIONEN = [
  'ledig',
  'verheiratet',
  'geschieden',
  'verwitwet',
  'in Partnerschaft',
  'getrennt lebend'
];

interface PersonalDataFormProps {
  data: PersonalData;
  onChange: (data: PersonalData) => void;
}

export default function PersonalDataForm({ data, onChange }: PersonalDataFormProps) {
  const [favoriteOrte, setFavoriteOrte] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('favoriteOrte');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [socialMediaInput, setSocialMediaInput] = useState('');
  const [kinderjahrInput, setKinderjahrInput] = useState('');

  // Favoriten speichern
  useEffect(() => {
    localStorage.setItem('favoriteOrte', JSON.stringify(favoriteOrte));
  }, [favoriteOrte]);

  const updateField = <K extends keyof PersonalData>(field: K, value: PersonalData[K]) => {
    onChange({ ...data, [field]: value });
  };

  const addToFavoriteOrte = (ort: string) => {
    if (ort.trim() && !favoriteOrte.includes(ort.trim())) {
      setFavoriteOrte([...favoriteOrte, ort.trim()]);
    }
  };

  const removeFavoriteOrt = (ort: string) => {
    setFavoriteOrte(favoriteOrte.filter(f => f !== ort));
  };

  const addSocialMediaLink = () => {
    const link = socialMediaInput.trim();
    if (link && !data.socialMediaLinks.includes(link)) {
      updateField('socialMediaLinks', [...data.socialMediaLinks, link]);
      setSocialMediaInput('');
    }
  };

  const removeSocialMediaLink = (link: string) => {
    updateField('socialMediaLinks', data.socialMediaLinks.filter(l => l !== link));
  };

  const addKinderjahr = () => {
    const jahr = kinderjahrInput.trim();
    if (jahr && !data.kinderGeburtsjahre.includes(jahr)) {
      updateField('kinderGeburtsjahre', [...data.kinderGeburtsjahre, jahr]);
      setKinderjahrInput('');
    }
  };

  const removeKinderjahr = (jahr: string) => {
    updateField('kinderGeburtsjahre', data.kinderGeburtsjahre.filter(j => j !== jahr));
  };

  return (
    <div className="space-y-6">
      {/* Name und Titel */}
      <div className="bg-white border border-gray-200 rounded shadow-sm p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center">
          <Users className="h-4 w-4 mr-2" style={{ color: '#F29400' }} />
          Name und Titel
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Vorangestellter Titel */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vorangestellter Titel</label>
            <div className="relative">
              <input
                list="vorangestellte-titel"
                value={data.vorangestellterTitel}
                onChange={(e) => updateField('vorangestellterTitel', e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                style={{ borderColor: '#F29400', '--tw-ring-color': '#F29400' } as React.CSSProperties}
                placeholder="z.B. Dr., Prof."
              />
              <datalist id="vorangestellte-titel">
                {TITEL_OPTIONEN.map(titel => (
                  <option key={titel} value={titel} />
                ))}
              </datalist>
            </div>
          </div>

          {/* Vorname */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vorname *</label>
            <input
              type="text"
              value={data.vorname}
              onChange={(e) => updateField('vorname', e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
              style={{ borderColor: '#F29400', '--tw-ring-color': '#F29400' } as React.CSSProperties}
              placeholder="Vorname"
            />
          </div>

          {/* Nachname */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nachname *</label>
            <input
              type="text"
              value={data.nachname}
              onChange={(e) => updateField('nachname', e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
              style={{ borderColor: '#F29400', '--tw-ring-color': '#F29400' } as React.CSSProperties}
              placeholder="Nachname"
            />
          </div>

          {/* Nachgestellter Titel */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nachgestellter Titel</label>
            <div className="relative">
              <input
                list="nachgestellte-titel"
                value={data.nachgestellterTitel}
                onChange={(e) => updateField('nachgestellterTitel', e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                style={{ borderColor: '#F29400', '--tw-ring-color': '#F29400' } as React.CSSProperties}
                placeholder="z.B. MSc, MBA"
              />
              <datalist id="nachgestellte-titel">
                {TITEL_OPTIONEN.filter(t => !t.includes('.')).map(titel => (
                  <option key={titel} value={titel} />
                ))}
                <option value="MSc" />
                <option value="BSc" />
                <option value="MBA" />
                <option value="PhD" />
              </datalist>
            </div>
          </div>
        </div>
      </div>

      {/* Geburt */}
      <div className="bg-white border border-gray-200 rounded shadow-sm p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center">
          <Calendar className="h-4 w-4 mr-2" style={{ color: '#F29400' }} />
          Geburtsdaten
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Geburtsdatum */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Geburtsdatum</label>
            <DatePicker
              value={data.geburtsdatum}
              onChange={(date) => updateField('geburtsdatum', date)}
            />
          </div>

          {/* Geburtsort */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Geburtsort</label>
            <input
              type="text"
              value={data.geburtsort}
              onChange={(e) => updateField('geburtsort', e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
              style={{ borderColor: '#F29400', '--tw-ring-color': '#F29400' } as React.CSSProperties}
              placeholder="Stadt, Land"
            />
          </div>

          {/* Staatsbürgerschaft */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Staatsbürgerschaft</label>
            <CountryAutocomplete
              value={data.staatsbuegerschaft}
              onChange={(country) => updateField('staatsbuegerschaft', country)}
              placeholder="Land auswählen"
            />
          </div>
        </div>
      </div>

      {/* Adresse */}
      <div className="bg-white border border-gray-200 rounded shadow-sm p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center">
          <Globe className="h-4 w-4 mr-2" style={{ color: '#F29400' }} />
          Adresse
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Adresse */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Straße und Hausnummer</label>
            <input
              type="text"
              value={data.adresse}
              onChange={(e) => updateField('adresse', e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
              style={{ borderColor: '#F29400', '--tw-ring-color': '#F29400' } as React.CSSProperties}
              placeholder="Musterstraße 123"
            />
          </div>

          {/* Ort mit Favoriten */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">PLZ und Ort</label>
            <div className="relative">
              <input
                list="favorite-orte"
                value={data.ort}
                onChange={(e) => updateField('ort', e.target.value)}
                onBlur={() => {
                  if (data.ort.trim()) {
                    addToFavoriteOrte(data.ort);
                  }
                }}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                style={{ borderColor: '#F29400', '--tw-ring-color': '#F29400' } as React.CSSProperties}
                placeholder="1010 Wien"
              />
              <datalist id="favorite-orte">
                {favoriteOrte.map(ort => (
                  <option key={ort} value={ort} />
                ))}
              </datalist>
            </div>
            
            {/* Favoriten-Orte anzeigen */}
            {favoriteOrte.length > 0 && (
              <div className="mt-2">
                <div className="flex items-center space-x-2 mb-1">
                  <Star className="h-3 w-3" style={{ color: '#F29400' }} />
                  <span className="text-xs text-gray-600">Favoriten:</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {favoriteOrte.map(ort => (
                    <button
                      key={ort}
                      onClick={() => updateField('ort', ort)}
                      className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full hover:bg-gray-200 transition-colors duration-200"
                    >
                      <span className="mr-1">{ort}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFavoriteOrt(ort);
                        }}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Kontakt */}
      <div className="bg-white border border-gray-200 rounded shadow-sm p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center">
          <Phone className="h-4 w-4 mr-2" style={{ color: '#F29400' }} />
          Kontaktdaten
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Telefon */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefonnummer</label>
            <PhoneInput
              countryCode={data.laendervorwahl}
              phoneNumber={data.telefon}
              onCountryChange={(code) => updateField('laendervorwahl', code)}
              onPhoneChange={(phone) => updateField('telefon', phone)}
            />
          </div>

          {/* E-Mail */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-Mail-Adresse</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="email"
                value={data.email}
                onChange={(e) => updateField('email', e.target.value)}
                className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                style={{ borderColor: '#F29400', '--tw-ring-color': '#F29400' } as React.CSSProperties}
                placeholder="name@beispiel.com"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Online-Präsenz */}
      <div className="bg-white border border-gray-200 rounded shadow-sm p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center">
          <LinkIcon className="h-4 w-4 mr-2" style={{ color: '#F29400' }} />
          Online-Präsenz
        </h3>
        
        <div className="space-y-4">
          {/* Homepage */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Homepage/Portfolio</label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="url"
                value={data.homepage}
                onChange={(e) => updateField('homepage', e.target.value)}
                className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                style={{ borderColor: '#F29400', '--tw-ring-color': '#F29400' } as React.CSSProperties}
                placeholder="https://www.beispiel.com"
              />
            </div>
          </div>

          {/* Social Media Links */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Social Media Links</label>
            
            {/* Ausgewählte Links */}
            {data.socialMediaLinks.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {data.socialMediaLinks.map((link, index) => (
                  <TagButtonSelected
                    key={index}
                    label={link}
                    onRemove={() => removeSocialMediaLink(link)}
                  />
                ))}
              </div>
            )}

            {/* Eingabefeld */}
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="url"
                  value={socialMediaInput}
                  onChange={(e) => setSocialMediaInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSocialMediaLink();
                    }
                  }}
                  className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                  style={{ borderColor: '#F29400', '--tw-ring-color': '#F29400' } as React.CSSProperties}
                  placeholder="https://linkedin.com/in/..."
                />
              </div>
              <button
                onClick={addSocialMediaLink}
                disabled={!socialMediaInput.trim()}
                className="px-4 py-2 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                style={{ backgroundColor: '#F29400' }}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Personenstand */}
      <div className="bg-white border border-gray-200 rounded shadow-sm p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center">
          <Users className="h-4 w-4 mr-2" style={{ color: '#F29400' }} />
          Personenstandsdaten
        </h3>
        
        <div className="space-y-4">
          {/* Personenstand */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Familienstand</label>
            <div className="relative">
              <input
                list="personenstand-optionen"
                value={data.personenstand}
                onChange={(e) => updateField('personenstand', e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                style={{ borderColor: '#F29400', '--tw-ring-color': '#F29400' } as React.CSSProperties}
                placeholder="Familienstand auswählen"
              />
              <datalist id="personenstand-optionen">
                {PERSONENSTAND_OPTIONEN.map(stand => (
                  <option key={stand} value={stand} />
                ))}
              </datalist>
            </div>
          </div>

          {/* Kinder Geburtsjahre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Geburtsjahr(e) der Kinder</label>
            
            {/* Ausgewählte Jahre */}
            {data.kinderGeburtsjahre.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {data.kinderGeburtsjahre.map((jahr, index) => (
                  <TagButtonSelected
                    key={index}
                    label={jahr}
                    onRemove={() => removeKinderjahr(jahr)}
                  />
                ))}
              </div>
            )}

            {/* Eingabefeld */}
            <div className="flex space-x-2">
              <input
                type="number"
                min="1950"
                max={new Date().getFullYear()}
                value={kinderjahrInput}
                onChange={(e) => setKinderjahrInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addKinderjahr();
                  }
                }}
                className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                style={{ borderColor: '#F29400', '--tw-ring-color': '#F29400' } as React.CSSProperties}
                placeholder="z.B. 2010"
              />
              <button
                onClick={addKinderjahr}
                disabled={!kinderjahrInput.trim()}
                className="px-4 py-2 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                style={{ backgroundColor: '#F29400' }}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}