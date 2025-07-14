import React, { useState, useEffect } from 'react';
import AutocompleteInput from './AutocompleteInput';
import TagButtonFavorite from './ui/TagButtonFavorite';
import TagButtonSelected from './ui/TagButtonSelected';
import DatePicker from './DatePicker';
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
      {/* Rest of the component code... */}
    </div>
  );
}