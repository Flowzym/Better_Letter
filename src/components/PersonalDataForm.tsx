import React, { useState, useRef, useEffect } from 'react';
import { Plus, X, Star } from 'lucide-react';
import DatePicker from './DatePicker';
import TagButtonSelected from './ui/TagButtonSelected';

interface PersonalData {
  // Name und Titel
  vorname: string;
  nachname: string;
  titel: string;
  
  // Geburt
  geburtsdatum: string; // DD.MM.YYYY
  geburtsort: string;
  staatsbuegerschaft: string;
  
  // Personenstand
  personenstand: string;
  kinderGeburtsjahre: string[];
  
  // Adresse
  adresse: string;
  ort: string;
  ausland: boolean;
  auslandLand: string;
  
  // Kontakt
  telefon: string;
  laendervorwahl: string;
  email: string;
  
  // Online
  homepage: string;
  socialMediaLinks: string[];
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

const COUNTRY_CODES = [
  { code: '+43', country: 'Österreich' },
  { code: '+49', country: 'Deutschland' },
  { code: '+41', country: 'Schweiz' },
  { code: '+1', country: 'USA/Kanada' },
  { code: '+44', country: 'Vereinigtes Königreich' },
  { code: '+33', country: 'Frankreich' },
  { code: '+39', country: 'Italien' },
  { code: '+34', country: 'Spanien' },
  { code: '+31', country: 'Niederlande' },
  { code: '+32', country: 'Belgien' },
];

const COUNTRIES = [
  'Afghanistan', 'Albanien', 'Algerien', 'Andorra', 'Angola', 'Antigua und Barbuda',
  'Argentinien', 'Armenien', 'Australien', 'Österreich', 'Aserbaidschan', 'Bahamas',
  'Bahrain', 'Bangladesch', 'Barbados', 'Belarus', 'Belgien', 'Belize', 'Benin',
  'Bhutan', 'Bolivien', 'Bosnien und Herzegowina', 'Botswana', 'Brasilien', 'Brunei',
  'Bulgarien', 'Burkina Faso', 'Burundi', 'Kambodscha', 'Kamerun', 'Kanada',
  'Kap Verde', 'Zentralafrikanische Republik', 'Tschad', 'Chile', 'China', 'Kolumbien',
  'Komoren', 'Kongo', 'Costa Rica', 'Kroatien', 'Kuba', 'Zypern', 'Tschechien',
  'Dänemark', 'Dschibuti', 'Dominica', 'Dominikanische Republik', 'Ecuador', 'Ägypten',
  'El Salvador', 'Äquatorialguinea', 'Eritrea', 'Estland', 'Eswatini', 'Äthiopien',
  'Fidschi', 'Finnland', 'Frankreich', 'Gabun', 'Gambia', 'Georgien', 'Deutschland',
  'Ghana', 'Griechenland', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana',
  'Haiti', 'Honduras', 'Ungarn', 'Island', 'Indien', 'Indonesien', 'Iran', 'Irak',
  'Irland', 'Israel', 'Italien', 'Jamaika', 'Japan', 'Jordanien', 'Kasachstan',
  'Kenia', 'Kiribati', 'Nordkorea', 'Südkorea', 'Kuwait', 'Kirgisistan', 'Laos',
  'Lettland', 'Libanon', 'Lesotho', 'Liberia', 'Libyen', 'Liechtenstein', 'Litauen',
  'Luxemburg', 'Madagaskar', 'Malawi', 'Malaysia', 'Malediven', 'Mali', 'Malta',
  'Marshallinseln', 'Mauretanien', 'Mauritius', 'Mexiko', 'Mikronesien', 'Moldau',
  'Monaco', 'Mongolei', 'Montenegro', 'Marokko', 'Mosambik', 'Myanmar', 'Namibia',
  'Nauru', 'Nepal', 'Niederlande', 'Neuseeland', 'Nicaragua', 'Niger', 'Nigeria',
  'Nordmazedonien', 'Norwegen', 'Oman', 'Pakistan', 'Palau', 'Panama', 'Papua-Neuguinea',
  'Paraguay', 'Peru', 'Philippinen', 'Polen', 'Portugal', 'Katar', 'Rumänien',
  'Russland', 'Ruanda', 'Saint Kitts und Nevis', 'Saint Lucia', 'Saint Vincent und die Grenadinen',
  'Samoa', 'San Marino', 'São Tomé und Príncipe', 'Saudi-Arabien', 'Senegal', 'Serbien',
  'Seychellen', 'Sierra Leone', 'Singapur', 'Slowakei', 'Slowenien', 'Salomonen',
  'Somalia', 'Südafrika', 'Südsudan', 'Spanien', 'Sri Lanka', 'Sudan', 'Suriname',
  'Schweden', 'Schweiz', 'Syrien', 'Taiwan', 'Tadschikistan', 'Tansania', 'Thailand',
  'Timor-Leste', 'Togo', 'Tonga', 'Trinidad und Tobago', 'Tunesien', 'Türkei',
  'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'Vereinigte Arabische Emirate',
  'Vereinigtes Königreich', 'Vereinigte Staaten', 'Uruguay', 'Usbekistan', 'Vanuatu',
  'Vatikanstadt', 'Venezuela', 'Vietnam', 'Jemen', 'Sambia', 'Simbabwe'
];

// PLZ zu Ort Mapping (Beispiel für österreichische PLZ)
const PLZ_TO_ORT: Record<string, string> = {
  '1010': 'Wien',
  '1020': 'Wien',
  '1030': 'Wien',
  '1040': 'Wien',
  '1050': 'Wien',
  '1060': 'Wien',
  '1070': 'Wien',
  '1080': 'Wien',
  '1090': 'Wien',
  '1100': 'Wien',
  '1110': 'Wien',
  '1120': 'Wien',
  '1130': 'Wien',
  '1140': 'Wien',
  '1150': 'Wien',
  '1160': 'Wien',
  '1170': 'Wien',
  '1180': 'Wien',
  '1190': 'Wien',
  '1200': 'Wien',
  '1210': 'Wien',
  '1220': 'Wien',
  '1230': 'Wien',
  '4020': 'Linz',
  '5020': 'Salzburg',
  '6020': 'Innsbruck',
  '8010': 'Graz',
  '9020': 'Klagenfurt',
};

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
  const [showAddOrtButton, setShowAddOrtButton] = useState(false);

  // Favoriten speichern
  useEffect(() => {
    localStorage.setItem('favoriteOrte', JSON.stringify(favoriteOrte));
  }, [favoriteOrte]);

  const updateField = <K extends keyof PersonalData>(field: K, value: PersonalData[K]) => {
    onChange({ ...data, [field]: value });
  };

  const getBorderColor = (value: string | boolean | string[]) => {
    if (Array.isArray(value)) {
      return value.length > 0 ? '#F29400' : '#D1D5DB';
    }
    return value ? '#F29400' : '#D1D5DB';
  };

  const addToFavoriteOrte = () => {
    const ort = data.ort.trim();
    if (ort && !favoriteOrte.includes(ort)) {
      setFavoriteOrte([...favoriteOrte, ort]);
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

  const handleOrtChange = (value: string) => {
    // PLZ zu Ort Konvertierung
    const plzMatch = value.match(/^\d{4}$/);
    if (plzMatch && PLZ_TO_ORT[value]) {
      updateField('ort', PLZ_TO_ORT[value]);
    } else {
      updateField('ort', value);
    }
  };

  return (
    <div className="space-y-6">
      {/* Name und Titel */}
      <div className="bg-white border border-gray-200 rounded shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Titel */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Titel</label>
            <select
              value={data.titel}
              onChange={(e) => updateField('titel', e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
              style={{ borderColor: getBorderColor(data.titel), '--tw-ring-color': '#F29400' } as React.CSSProperties}
            >
              <option value="">Titel auswählen</option>
              {TITEL_OPTIONEN.map(titel => (
                <option key={titel} value={titel}>{titel}</option>
              ))}
            </select>
          </div>

          {/* Vorname */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vorname *</label>
            <input
              type="text"
              value={data.vorname}
              onChange={(e) => updateField('vorname', e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
              style={{ borderColor: getBorderColor(data.vorname), '--tw-ring-color': '#F29400' } as React.CSSProperties}
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
              style={{ borderColor: getBorderColor(data.nachname), '--tw-ring-color': '#F29400' } as React.CSSProperties}
              placeholder="Nachname"
            />
          </div>
        </div>
      </div>

      {/* Geburtsdaten */}
      <div className="bg-white border border-gray-200 rounded shadow-sm p-4">
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
              style={{ borderColor: getBorderColor(data.geburtsort), '--tw-ring-color': '#F29400' } as React.CSSProperties}
              placeholder="Stadt, Land"
            />
          </div>

          {/* Staatsbürgerschaft */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Staatsbürgerschaft</label>
            <select
              value={data.staatsbuegerschaft}
              onChange={(e) => updateField('staatsbuegerschaft', e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
              style={{ borderColor: getBorderColor(data.staatsbuegerschaft), '--tw-ring-color': '#F29400' } as React.CSSProperties}
            >
              <option value="">Land auswählen</option>
              {COUNTRIES.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Personenstand */}
      <div className="bg-white border border-gray-200 rounded shadow-sm p-4">
        <div className="space-y-4">
          {/* Familienstand */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Familienstand</label>
            <select
              value={data.personenstand}
              onChange={(e) => updateField('personenstand', e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
              style={{ borderColor: getBorderColor(data.personenstand), '--tw-ring-color': '#F29400' } as React.CSSProperties}
            >
              <option value="">Familienstand auswählen</option>
              {PERSONENSTAND_OPTIONEN.map(stand => (
                <option key={stand} value={stand}>{stand}</option>
              ))}
            </select>
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
                style={{ borderColor: getBorderColor(kinderjahrInput), '--tw-ring-color': '#F29400' } as React.CSSProperties}
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

      {/* Adresse */}
      <div className="bg-white border border-gray-200 rounded shadow-sm p-4">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Adresse */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Straße und Hausnummer</label>
              <input
                type="text"
                value={data.adresse}
                onChange={(e) => updateField('adresse', e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                style={{ borderColor: getBorderColor(data.adresse), '--tw-ring-color': '#F29400' } as React.CSSProperties}
                placeholder="Musterstraße 123"
              />
            </div>

            {/* Ort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ort</label>
              <div className="relative">
                <input
                  type="text"
                  value={data.ort}
                  onChange={(e) => handleOrtChange(e.target.value)}
                  onFocus={() => setShowAddOrtButton(true)}
                  onBlur={() => setTimeout(() => setShowAddOrtButton(false), 200)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                  style={{ borderColor: getBorderColor(data.ort), '--tw-ring-color': '#F29400' } as React.CSSProperties}
                  placeholder="Ort oder PLZ eingeben"
                />
                {showAddOrtButton && data.ort.trim() && !favoriteOrte.includes(data.ort.trim()) && (
                  <button
                    onClick={addToFavoriteOrte}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 px-2 py-1 text-xs text-white rounded"
                    style={{ backgroundColor: '#F29400' }}
                  >
                    <Star className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Ausland Checkbox */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="ausland"
              checked={data.ausland}
              onChange={(e) => updateField('ausland', e.target.checked)}
              className="focus:ring-2"
              style={{ accentColor: '#F29400', '--tw-ring-color': '#F29400' } as React.CSSProperties}
            />
            <label htmlFor="ausland" className="text-sm text-gray-700">
              Ausland
            </label>
          </div>

          {/* Ausland Land */}
          {data.ausland && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Land</label>
              <select
                value={data.auslandLand}
                onChange={(e) => updateField('auslandLand', e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                style={{ borderColor: getBorderColor(data.auslandLand), '--tw-ring-color': '#F29400' } as React.CSSProperties}
              >
                <option value="">Land auswählen</option>
                {COUNTRIES.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
          )}

          {/* Favoriten-Orte über gesamte Breite */}
          {favoriteOrte.length > 0 && (
            <div className="col-span-full">
              <div className="flex items-center space-x-2 mb-2">
                <Star className="h-4 w-4" style={{ color: '#F29400' }} />
                <span className="text-sm font-medium text-gray-700">Favoriten:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {favoriteOrte.map(ort => (
                  <button
                    key={ort}
                    onClick={() => updateField('ort', ort)}
                    className="inline-flex items-center justify-between px-3 py-1 text-gray-700 text-sm rounded-full border hover:bg-gray-200 transition-colors duration-200"
                    style={{ backgroundColor: '#F3F4F6', borderColor: '#F29400' }}
                  >
                    <span className="mr-2">{ort}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFavoriteOrt(ort);
                      }}
                      className="text-gray-600 hover:text-gray-800"
                      title="Aus Favoriten entfernen"
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

      {/* Kontakt */}
      <div className="bg-white border border-gray-200 rounded shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Telefon */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefonnummer</label>
            <div className="flex space-x-2">
              {/* Ländervorwahl - schmaler */}
              <select
                value={data.laendervorwahl}
                onChange={(e) => updateField('laendervorwahl', e.target.value)}
                className="px-2 py-2 border rounded-md focus:outline-none focus:ring-2 w-16"
                style={{ borderColor: getBorderColor(data.laendervorwahl), '--tw-ring-color': '#F29400' } as React.CSSProperties}
              >
                {COUNTRY_CODES.map(item => (
                  <option key={item.code} value={item.code}>
                    {item.code}
                  </option>
                ))}
              </select>
              
              {/* Telefonnummer - längeres Feld */}
              <input
                type="tel"
                value={data.telefon}
                onChange={(e) => updateField('telefon', e.target.value)}
                className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                style={{ borderColor: getBorderColor(data.telefon), '--tw-ring-color': '#F29400' } as React.CSSProperties}
                placeholder="123 456 7890"
                maxLength={20}
              />
            </div>
          </div>

          {/* E-Mail */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-Mail-Adresse</label>
            <input
              type="email"
              value={data.email}
              onChange={(e) => updateField('email', e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
              style={{ borderColor: getBorderColor(data.email), '--tw-ring-color': '#F29400' } as React.CSSProperties}
              placeholder="name@beispiel.com"
            />
          </div>
        </div>
      </div>

      {/* Online-Präsenz */}
      <div className="bg-white border border-gray-200 rounded shadow-sm p-4">
        <div className="space-y-4">
          {/* Homepage */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Homepage/Portfolio</label>
            <input
              type="url"
              value={data.homepage}
              onChange={(e) => updateField('homepage', e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
              style={{ borderColor: getBorderColor(data.homepage), '--tw-ring-color': '#F29400' } as React.CSSProperties}
              placeholder="https://www.beispiel.com"
            />
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
                className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                style={{ borderColor: getBorderColor(socialMediaInput), '--tw-ring-color': '#F29400' } as React.CSSProperties}
                placeholder="https://linkedin.com/in/..."
              />
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
    </div>
  );
}