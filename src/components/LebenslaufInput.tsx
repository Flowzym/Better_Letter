import React, { useState, useRef, useEffect } from 'react';
import TagButtonSelected from './ui/TagButtonSelected';

// Initial data structure for personal data
interface PersonalData {
  // Name und Titel
  vorname: string;
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
// Options for titles (vorangestellt and nachgestellt combined)
  'Mag.',
  'Dipl.-Ing.',
  'Ing.',
  'MSc',
  'BSc',
  'MBA',
  'PhD'
];

// Options for marital status
const PERSONENSTAND_OPTIONEN = [
  'ledig',
  'verheiratet',
  'geschieden',
  'verwitwet',
  'in Partnerschaft',
  'getrennt lebend'
];

// Country codes for phone numbers (simplified for dropdown)
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
  { code: '+32', country: 'Belgien', flag: '🇧🇪' }
];

// Full list of countries for dropdown selection
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
  '9020': 'Klagenfurt'
};

interface PersonalDataFormProps {
  data: PersonalData;
  onChange: (data: PersonalData) => void;
}

export default function PersonalDataForm({ data, onChange }: PersonalDataFormProps) {
  // Rest of the component implementation...
}