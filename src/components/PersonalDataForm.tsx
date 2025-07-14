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
      {/* Persönliche Daten Card */}
      <Card title="Persönliche Daten">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Titel */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Titel</label>
            <AutocompleteInput
              value={data.titel}
              onChange={(value) => updateData('titel', value)}
              suggestions={titleSuggestions}
              placeholder="z.B. Dr., Mag."
              className="min-w-[120px] w-auto"
              onFavoriteClick={(value) => {
                updateData('titel', value);
                toggleFavorite('titel', value);
              }}
            />
            {/* Titel Favoriten über volle Breite */}
            <div className="mt-2 w-full">
              <div className="flex flex-wrap gap-1">
                {favorites.titel.filter(fav => fav !== data.titel).map((fav) => (
                  <TagButtonFavorite
                    key={fav}
                    text={fav}
                    onClick={() => updateData('titel', fav)}
                    onRemove={() => toggleFavorite('titel', fav)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Vorname */}
          <div className="md:col-span-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">Vorname</label>
            <input
              type="text"
              value={data.vorname}
              onChange={(e) => updateData('vorname', e.target.value)}
              placeholder="Vorname"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': '#F29400' } as React.CSSProperties}
            />
          </div>

          {/* Nachname */}
          <div className="md:col-span-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nachname</label>
            <input
              type="text"
              value={data.nachname}
              onChange={(e) => updateData('nachname', e.target.value)}
              placeholder="Nachname"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': '#F29400' } as React.CSSProperties}
            />
          </div>
        </div>
      </Card>

      {/* Kontakt Card */}
      <Card title="Kontakt">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Telefon */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
            <div className="flex gap-2">
              <select
                value={data.telefonVorwahl}
                onChange={(e) => updateData('telefonVorwahl', e.target.value)}
                className="min-w-[80px] w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                style={{ '--tw-ring-color': '#F29400' } as React.CSSProperties}
              >
                {phoneCountryCodes.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.flag} {country.code}
                  </option>
                ))}
              </select>
              <input
                type="tel"
                value={data.telefon}
                onChange={(e) => updateData('telefon', e.target.value)}
                placeholder="Telefonnummer"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                style={{ '--tw-ring-color': '#F29400' } as React.CSSProperties}
              />
            </div>
          </div>

          {/* E-Mail */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-Mail</label>
            <input
              type="email"
              value={data.email}
              onChange={(e) => updateData('email', e.target.value)}
              placeholder="E-Mail-Adresse"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': '#F29400' } as React.CSSProperties}
            />
          </div>
        </div>
      </Card>

      {/* Adresse Card */}
      <Card title="Adresse">
        <div className="space-y-4">
          {/* Straße & Hausnummer, PLZ, Ort, Ausland */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Straße & Hausnummer</label>
              <input
                type="text"
                value={data.adresse}
                onChange={(e) => updateData('adresse', e.target.value)}
                placeholder="Straße & Hausnummer"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                style={{ '--tw-ring-color': '#F29400' } as React.CSSProperties}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">PLZ</label>
              <input
                type="text"
                value={data.plz}
                onChange={(e) => updateData('plz', e.target.value)}
                placeholder="PLZ"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                style={{ '--tw-ring-color': '#F29400' } as React.CSSProperties}
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Ort</label>
              <AutocompleteInput
                value={data.ort}
                onChange={(value) => updateData('ort', value)}
                suggestions={citySuggestions}
                placeholder="Ort"
                onFavoriteClick={(value) => {
                  updateData('ort', value);
                  toggleFavorite('ort', value);
                }}
              />
              <div className="mt-2 flex flex-wrap gap-1">
                {favorites.ort.filter(fav => fav !== data.ort).map((fav) => (
                  <TagButtonFavorite
                    key={fav}
                    text={fav}
                    onClick={() => updateData('ort', fav)}
                    onRemove={() => toggleFavorite('ort', fav)}
                  />
                ))}
              </div>
            </div>

            <div className="md:col-span-1 flex justify-end items-end">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={data.ausland}
                  onChange={(e) => updateData('ausland', e.target.checked)}
                  className="mr-2"
                />
                Ausland
              </label>
            </div>
          </div>

          {/* Land (nur wenn Ausland aktiviert) */}
          {data.ausland && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Land</label>
              <AutocompleteInput
                value={data.land}
                onChange={(value) => updateData('land', value)}
                suggestions={countrySuggestions}
                placeholder="Land"
                onFavoriteClick={(value) => {
                  updateData('land', value);
                  toggleFavorite('land', value);
                }}
              />
              <div className="mt-2 flex flex-wrap gap-1">
                {favorites.land.filter(fav => fav !== data.land).map((fav) => (
                  <TagButtonFavorite
                    key={fav}
                    text={fav}
                    onClick={() => updateData('land', fav)}
                    onRemove={() => toggleFavorite('land', fav)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Geburtsdaten Card */}
      <Card title="Geburtsdaten">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Geburtsdatum */}
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Geburtsdatum</label>
            <DatePicker
              value={data.geburtsdatum}
              onChange={(value) => updateData('geburtsdatum', value)}
              placeholder="tt.mm.jjjj"
              className="placeholder:text-gray-400"
            />
          </div>

          {/* Geburtsort */}
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Geburtsort</label>
            <AutocompleteInput
              value={data.geburtsort}
              onChange={(value) => updateData('geburtsort', value)}
              suggestions={citySuggestions}
              placeholder="Geburtsort"
              onFavoriteClick={(value) => {
                updateData('geburtsort', value);
                toggleFavorite('geburtsort', value);
              }}
            />
            <div className="mt-2 flex flex-wrap gap-1">
              {favorites.geburtsort.filter(fav => fav !== data.geburtsort).map((fav) => (
                <TagButtonFavorite
                  key={fav}
                  text={fav}
                  onClick={() => updateData('geburtsort', fav)}
                  onRemove={() => toggleFavorite('geburtsort', fav)}
                />
              ))}
            </div>
          </div>

          {/* Geburtsland */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Geburtsland</label>
            <AutocompleteInput
              value={data.geburtsland}
              onChange={(value) => updateData('geburtsland', value)}
              suggestions={countrySuggestions}
              placeholder="Geburtsland"
              onFavoriteClick={(value) => {
                updateData('geburtsland', value);
                toggleFavorite('geburtsland', value);
              }}
            />
            <div className="mt-2 flex flex-wrap gap-1">
              {favorites.geburtsland.filter(fav => fav !== data.geburtsland).map((fav) => (
                <TagButtonFavorite
                  key={fav}
                  text={fav}
                  onClick={() => updateData('geburtsland', fav)}
                  onRemove={() => toggleFavorite('geburtsland', fav)}
                />
              ))}
            </div>
          </div>

          {/* Staatsbürgerschaft Checkbox */}
          <div className="md:col-span-1 flex justify-end items-end">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={data.staatsbuergerschaftCheckbox}
                onChange={(e) => updateData('staatsbuergerschaftCheckbox', e.target.checked)}
                className="mr-2"
              />
              Staatsbürgerschaft
            </label>
          </div>
        </div>

        {/* Staatsbürgerschaft Feld (nur wenn Checkbox aktiviert) */}
        {data.staatsbuergerschaftCheckbox && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Staatsbürgerschaft</label>
            <AutocompleteInput
              value={data.staatsbuergerschaft}
              onChange={(value) => updateData('staatsbuergerschaft', value)}
              suggestions={countrySuggestions}
              placeholder="Staatsbürgerschaft"
              onFavoriteClick={(value) => {
                updateData('staatsbuergerschaft', value);
                toggleFavorite('staatsbuergerschaft', value);
              }}
            />
            <div className="mt-2 flex flex-wrap gap-1">
              {favorites.staatsbuergerschaft.filter(fav => fav !== data.staatsbuergerschaft).map((fav) => (
                <TagButtonFavorite
                  key={fav}
                  text={fav}
                  onClick={() => updateData('staatsbuergerschaft', fav)}
                  onRemove={() => toggleFavorite('staatsbuergerschaft', fav)}
                />
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Personenstand Card */}
      <Card title="Personenstand">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Familienstand */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Familienstand</label>
            <select
              value={data.familienstand}
              onChange={(e) => updateData('familienstand', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': '#F29400' } as React.CSSProperties}
            >
              <option value="">Bitte wählen</option>
              {familienstandOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          {/* Geburtsjahr der Kinder */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Geburtsjahr der Kinder</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newChild}
                onChange={(e) => setNewChild(e.target.value)}
                placeholder="Jahr eingeben"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                style={{ '--tw-ring-color': '#F29400' } as React.CSSProperties}
                onKeyPress={(e) => e.key === 'Enter' && addChild()}
              />
              <button
                onClick={addChild}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                +
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {data.kinder.map((child, index) => (
                <TagButtonSelected
                  key={index}
                  text={child}
                  onClick={() => removeChild(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Arbeitsmarktzugang Card */}
      <Card title="Arbeitsmarktzugang">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Arbeitsmarktzugang</label>
          <AutocompleteInput
            value={data.arbeitsmarktzugang}
            onChange={(value) => updateData('arbeitsmarktzugang', value)}
            suggestions={arbeitsmarktzugangOptions}
            placeholder="Arbeitsmarktzugang"
            onFavoriteClick={(value) => {
              updateData('arbeitsmarktzugang', value);
              toggleFavorite('arbeitsmarktzugang', value);
            }}
          />
          <div className="mt-2 flex flex-wrap gap-1">
            {favorites.arbeitsmarktzugang.filter(fav => fav !== data.arbeitsmarktzugang).map((fav) => (
              <TagButtonFavorite
                key={fav}
                text={fav}
                onClick={() => updateData('arbeitsmarktzugang', fav)}
                onRemove={() => toggleFavorite('arbeitsmarktzugang', fav)}
              />
            ))}
          </div>
        </div>
      </Card>

      {/* Social Media Card */}
      <Card title="Social Media">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Social Media Profile</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newSocialMedia}
              onChange={(e) => setNewSocialMedia(e.target.value)}
              placeholder="Social Media Profil"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': '#F29400' } as React.CSSProperties}
              onKeyPress={(e) => e.key === 'Enter' && addSocialMedia()}
            />
            <button
              onClick={addSocialMedia}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              +
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-1">
            {data.socialMedia.map((social, index) => (
              <TagButtonSelected
                key={index}
                text={social}
                onClick={() => removeSocialMedia(index)}
              />
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}