import React, { useState, useEffect } from 'react';
import { Plus, X, Star } from 'lucide-react';
import DatePicker from './DatePicker';
import TagButtonSelected from './ui/TagButtonSelected';
import AutocompleteInput from './AutocompleteInput';

interface PersonalData {
  // Name und Titel
  vorname: string;
  nachname: string;
  titel: string;
  
  // Geburt
  geburtsdatum: string; // DD.MM.YYYY
  geburtsort: string;
  geburtsland: string;
  showStaatsbuegerschaft: boolean;
  staatsbuegerschaft: string;
  arbeitsmarktzugang: string;
  
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
  'PhD',
  'Dr. med.',
  'Dr. phil.',
  'Dr. rer. nat.',
  'Dr. jur.',
  'Dr. techn.',
  'Univ.-Prof.',
  'Ass.-Prof.',
  'Priv.-Doz.',
  'Hon.-Prof.',
  'em. Prof.',
  'Jr.',
  'Sr.',
  'II',
  'III'
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
  { code: '+43', country: 'Österreich', flag: '🇦🇹' },
  { code: '+49', country: 'Deutschland', flag: '🇩🇪' },
  { code: '+41', country: 'Schweiz', flag: '🇨🇭' },
  { code: '+1', country: 'USA/Kanada', flag: '🇺🇸' },
  { code: '+44', country: 'Vereinigtes Königreich', flag: '🇬🇧' },
  { code: '+33', country: 'Frankreich', flag: '🇫🇷' },
  { code: '+39', country: 'Italien', flag: '🇮🇹' },
  { code: '+34', country: 'Spanien', flag: '🇪🇸' },
  { code: '+31', country: 'Niederlande', flag: '🇳🇱' },
  { code: '+32', country: 'Belgien', flag: '🇧🇪' },
  { code: '+45', country: 'Dänemark', flag: '🇩🇰' },
  { code: '+46', country: 'Schweden', flag: '🇸🇪' },
  { code: '+47', country: 'Norwegen', flag: '🇳🇴' },
  { code: '+358', country: 'Finnland', flag: '🇫🇮' },
  { code: '+48', country: 'Polen', flag: '🇵🇱' },
  { code: '+420', country: 'Tschechien', flag: '🇨🇿' },
  { code: '+421', country: 'Slowakei', flag: '🇸🇰' },
  { code: '+36', country: 'Ungarn', flag: '🇭🇺' },
  { code: '+385', country: 'Kroatien', flag: '🇭🇷' },
  { code: '+386', country: 'Slowenien', flag: '🇸🇮' },
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
  'Nordmazedonien', 'Norwegen', 'Oman', 'Pakistan', 'Palau', 'Panama', 'Papua-Neuguina',
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

const ARBEITSMARKTZUGANG_OPTIONEN = [
  'EU-Bürger (unbeschränkt)',
  'Rot-Weiß-Rot-Karte',
  'Blaue Karte EU',
  'Aufenthaltstitel',
  'Asylberechtigt',
  'Subsidiär Schutzberechtigter',
  'Sonstige Berechtigung'
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

  const [favoriteGeburtsOrte, setFavoriteGeburtsOrte] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('favoriteGeburtsOrte');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [favoriteStaatsbuergerschaften, setFavoriteStaatsbuergerschaften] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('favoriteStaatsbuergerschaften');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [socialMediaInput, setSocialMediaInput] = useState('');
  const [kinderjahrInput, setKinderjahrInput] = useState('');
  const [titelInput, setTitelInput] = useState('');
  const [personenstandInput, setPersonenstandInput] = useState('');
  const [geburtsortInput, setGeburtsortInput] = useState('');
  const [geburtslandInput, setGeburtslandInput] = useState('');
  const [staatsbuegerschaftInput, setStaatsbuegerschaftInput] = useState('');
  const [arbeitsmarktzugangInput, setArbeitsmarktzugangInput] = useState('');
  const [ortInput, setOrtInput] = useState('');
  const [auslandLandInput, setAuslandLandInput] = useState('');

  // Favoriten speichern
  useEffect(() => {
    localStorage.setItem('favoriteOrte', JSON.stringify(favoriteOrte));
  }, [favoriteOrte]);

  useEffect(() => {
    localStorage.setItem('favoriteGeburtsOrte', JSON.stringify(favoriteGeburtsOrte));
  }, [favoriteGeburtsOrte]);

  useEffect(() => {
    localStorage.setItem('favoriteStaatsbuergerschaften', JSON.stringify(favoriteStaatsbuergerschaften));
  }, [favoriteStaatsbuergerschaften]);

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

  const addToFavoriteGeburtsOrte = () => {
    const ort = data.geburtsort.trim();
    if (ort && !favoriteGeburtsOrte.includes(ort)) {
      setFavoriteGeburtsOrte([...favoriteGeburtsOrte, ort]);
    }
  };

  const removeFavoriteGeburtsOrt = (ort: string) => {
    setFavoriteGeburtsOrte(favoriteGeburtsOrte.filter(f => f !== ort));
  };

  const addToFavoriteStaatsbuergerschaften = () => {
    const staat = data.staatsbuegerschaft.trim();
    if (staat && !favoriteStaatsbuergerschaften.includes(staat)) {
      setFavoriteStaatsbuergerschaften([...favoriteStaatsbuergerschaften, staat]);
    }
  };

  const removeFavoriteStaatsbuegerschaft = (staat: string) => {
    setFavoriteStaatsbuergerschaften(favoriteStaatsbuergerschaften.filter(f => f !== staat));
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

  const getSelectedCountryCode = () => {
    return COUNTRY_CODES.find(item => item.code === data.laendervorwahl);
  };

  return (
    <div className="space-y-6">
      {/* Name und Titel */}
      <div className="bg-white border border-gray-200 rounded shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

          {/* Titel */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Titel</label>
            <AutocompleteInput
              value={titelInput}
              onChange={setTitelInput}
              onAdd={(value) => {
                const titel = value || titelInput;
                if (titel.trim()) {
                  updateField('titel', titel.trim());
                  setTitelInput('');
                }
              }}
              suggestions={TITEL_OPTIONEN}
              placeholder="Titel eingeben..."
              showAddButton={titelInput.trim().length > 0}
            />
            {data.titel && (
              <div className="mt-2">
                <TagButtonSelected
                  label={data.titel}
                  onRemove={() => updateField('titel', '')}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Kontakt */}
      <div className="bg-white border border-gray-200 rounded shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Telefon */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefonnummer</label>
            <div className="flex space-x-2">
              {/* Ländervorwahl - mit Flaggen */}
              <select
                value={data.laendervorwahl}
                onChange={(e) => updateField('laendervorwahl', e.target.value)}
                className="px-2 py-2 border rounded-md focus:outline-none focus:ring-2 w-24"
                style={{ borderColor: getBorderColor(data.laendervorwahl), '--tw-ring-color': '#F29400' } as React.CSSProperties}
              >
                {COUNTRY_CODES.map(item => (
                  <option key={item.code} value={item.code}>
                    {item.flag} {item.code}
                  </option>
                ))}
              </select>
              
              {/* Telefonnummer */}
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
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={ortInput}
                  onChange={(e) => {
                    setOrtInput(e.target.value);
                    handleOrtChange(e.target.value);
                  }}
                  className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                  style={{ borderColor: getBorderColor(data.ort), '--tw-ring-color': '#F29400' } as React.CSSProperties}
                  placeholder="Ort oder PLZ eingeben"
                />
                {ortInput.trim() && !favoriteOrte.includes(ortInput.trim()) && (
                  <button
                    onClick={addToFavoriteOrte}
                    className="px-3 py-2 text-white rounded-md transition-colors duration-200"
                    style={{ backgroundColor: '#F29400' }}
                    title="Zu Favoriten hinzufügen"
                  >
                    <Star className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Favoriten-Orte über gesamte Breite */}
          {favoriteOrte.length > 0 && (
            <div className="col-span-full">
              <div className="flex items-center space-x-2 mb-2">
                <Star className="h-4 w-4 fill-current" style={{ color: '#F29400' }} />
                <span className="text-sm font-medium text-gray-700">Favoriten:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {favoriteOrte.map(ort => (
                  <TagButtonSelected
                    key={ort}
                    label={ort}
                    onClick={() => {
                      updateField('ort', ort);
                      setOrtInput(ort);
                    }}
                    onRemove={() => removeFavoriteOrt(ort)}
                  />
                ))}
              </div>
            </div>
          )}

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
              <AutocompleteInput
                value={auslandLandInput}
                onChange={setAuslandLandInput}
                onAdd={(value) => {
                  const land = value || auslandLandInput;
                  if (land.trim()) {
                    updateField('auslandLand', land.trim());
                    setAuslandLandInput('');
                  }
                }}
                suggestions={COUNTRIES}
                placeholder="Land eingeben..."
                showAddButton={auslandLandInput.trim().length > 0}
              />
              {data.auslandLand && (
                <div className="mt-2">
                  <TagButtonSelected
                    label={data.auslandLand}
                    onRemove={() => updateField('auslandLand', '')}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Geburtsdaten */}
      <div className="bg-white border border-gray-200 rounded shadow-sm p-4">
        <div className="space-y-4">
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
              <div className="flex space-x-2">
                <AutocompleteInput
                  value={geburtsortInput}
                  onChange={setGeburtsortInput}
                  onAdd={(value) => {
                    const ort = value || geburtsortInput;
                    if (ort.trim()) {
                      updateField('geburtsort', ort.trim());
                      setGeburtsortInput('');
                    }
                  }}
                  suggestions={COUNTRIES}
                  placeholder="Geburtsort eingeben..."
                  showAddButton={geburtsortInput.trim().length > 0}
                />
                {geburtsortInput.trim() && !favoriteGeburtsOrte.includes(geburtsortInput.trim()) && (
                  <button
                    onClick={addToFavoriteGeburtsOrte}
                    className="px-3 py-2 text-white rounded-md transition-colors duration-200"
                    style={{ backgroundColor: '#F29400' }}
                    title="Zu Favoriten hinzufügen"
                  >
                    <Star className="h-4 w-4" />
                  </button>
                )}
              </div>
              {data.geburtsort && (
                <div className="mt-2">
                  <TagButtonSelected
                    label={data.geburtsort}
                    onRemove={() => updateField('geburtsort', '')}
                  />
                </div>
              )}
              {/* Favoriten für Geburtsort */}
              {favoriteGeburtsOrte.length > 0 && (
                <div className="mt-2">
                  <div className="flex items-center space-x-2 mb-2">
                    <Star className="h-4 w-4 fill-current" style={{ color: '#F29400' }} />
                    <span className="text-sm font-medium text-gray-700">Favoriten:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {favoriteGeburtsOrte.map(ort => (
                      <TagButtonSelected
                        key={ort}
                        label={ort}
                        onClick={() => {
                          updateField('geburtsort', ort);
                          setGeburtsortInput('');
                        }}
                        onRemove={() => removeFavoriteGeburtsOrt(ort)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Geburtsland */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Geburtsland</label>
              <AutocompleteInput
                value={geburtslandInput}
                onChange={setGeburtslandInput}
                onAdd={(value) => {
                  const land = value || geburtslandInput;
                  if (land.trim()) {
                    updateField('geburtsland', land.trim());
                    setGeburtslandInput('');
                  }
                }}
                suggestions={COUNTRIES}
                placeholder="Geburtsland eingeben..."
                showAddButton={geburtslandInput.trim().length > 0}
              />
              {data.geburtsland && (
                <div className="mt-2">
                  <TagButtonSelected
                    label={data.geburtsland}
                    onRemove={() => updateField('geburtsland', '')}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Staatsbürgerschaft Checkbox */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="staatsbuegerschaft"
              checked={data.showStaatsbuegerschaft}
              onChange={(e) => updateField('showStaatsbuegerschaft', e.target.checked)}
              className="focus:ring-2"
              style={{ accentColor: '#F29400', '--tw-ring-color': '#F29400' } as React.CSSProperties}
            />
            <label htmlFor="staatsbuegerschaft" className="text-sm text-gray-700">
              Staatsbürgerschaft
            </label>
          </div>

          {/* Staatsbürgerschaft und Arbeitsmarktzugang */}
          {data.showStaatsbuegerschaft && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Staatsbürgerschaft */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Staatsbürgerschaft</label>
                <div className="flex space-x-2">
                  <AutocompleteInput
                    value={staatsbuegerschaftInput}
                    onChange={setStaatsbuegerschaftInput}
                    onAdd={(value) => {
                      const staat = value || staatsbuegerschaftInput;
                      if (staat.trim()) {
                        updateField('staatsbuegerschaft', staat.trim());
                        setStaatsbuegerschaftInput('');
                      }
                    }}
                    suggestions={COUNTRIES}
                    placeholder="Staatsbürgerschaft eingeben..."
                    showAddButton={staatsbuegerschaftInput.trim().length > 0}
                  />
                  {staatsbuegerschaftInput.trim() && !favoriteStaatsbuergerschaften.includes(staatsbuegerschaftInput.trim()) && (
                    <button
                      onClick={addToFavoriteStaatsbuergerschaften}
                      className="px-3 py-2 text-white rounded-md transition-colors duration-200"
                      style={{ backgroundColor: '#F29400' }}
                      title="Zu Favoriten hinzufügen"
                    >
                      <Star className="h-4 w-4" />
                    </button>
                  )}
                </div>
                {data.staatsbuegerschaft && (
                  <div className="mt-2">
                    <TagButtonSelected
                      label={data.staatsbuegerschaft}
                      onRemove={() => updateField('staatsbuegerschaft', '')}
                    />
                  </div>
                )}
                {/* Favoriten für Staatsbürgerschaft */}
                {favoriteStaatsbuergerschaften.length > 0 && (
                  <div className="mt-2">
                    <div className="flex items-center space-x-2 mb-2">
                      <Star className="h-4 w-4 fill-current" style={{ color: '#F29400' }} />
                      <span className="text-sm font-medium text-gray-700">Favoriten:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {favoriteStaatsbuergerschaften.map(staat => (
                        <TagButtonSelected
                          key={staat}
                          label={staat}
                          onClick={() => {
                            updateField('staatsbuegerschaft', staat);
                            setStaatsbuegerschaftInput('');
                          }}
                          onRemove={() => removeFavoriteStaatsbuegerschaft(staat)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Arbeitsmarktzugang */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Arbeitsmarktzugang</label>
                <AutocompleteInput
                  value={arbeitsmarktzugangInput}
                  onChange={setArbeitsmarktzugangInput}
                  onAdd={(value) => {
                    const zugang = value || arbeitsmarktzugangInput;
                    if (zugang.trim()) {
                      updateField('arbeitsmarktzugang', zugang.trim());
                      setArbeitsmarktzugangInput('');
                    }
                  }}
                  suggestions={ARBEITSMARKTZUGANG_OPTIONEN}
                  placeholder="Arbeitsmarktzugang eingeben..."
                  showAddButton={arbeitsmarktzugangInput.trim().length > 0}
                />
                {data.arbeitsmarktzugang && (
                  <div className="mt-2">
                    <TagButtonSelected
                      label={data.arbeitsmarktzugang}
                      onRemove={() => updateField('arbeitsmarktzugang', '')}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Personenstand */}
      <div className="bg-white border border-gray-200 rounded shadow-sm p-4">
        <div className="space-y-4">
          {/* Familienstand */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Familienstand</label>
            <AutocompleteInput
              value={personenstandInput}
              onChange={setPersonenstandInput}
              onAdd={(value) => {
                const stand = value || personenstandInput;
                if (stand.trim()) {
                  updateField('personenstand', stand.trim());
                  setPersonenstandInput('');
                }
              }}
              suggestions={PERSONENSTAND_OPTIONEN}
              placeholder="Familienstand eingeben..."
              showAddButton={personenstandInput.trim().length > 0}
            />
            {data.personenstand && (
              <div className="mt-2">
                <TagButtonSelected
                  label={data.personenstand}
                  onRemove={() => updateField('personenstand', '')}
                />
              </div>
            )}
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
              {kinderjahrInput.trim() && (
                <button
                  onClick={addKinderjahr}
                  className="px-4 py-2 text-white rounded-md transition-colors duration-200"
                  style={{ backgroundColor: '#F29400' }}
                >
                  <Plus className="h-4 w-4" />
                </button>
              )}
            </div>
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
              {socialMediaInput.trim() && (
                <button
                  onClick={addSocialMediaLink}
                  className="px-4 py-2 text-white rounded-md transition-colors duration-200"
                  style={{ backgroundColor: '#F29400' }}
                >
                  <Plus className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}