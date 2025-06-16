import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronDown, ChevronUp, Star } from 'lucide-react';
import TextInput from './TextInput';
import AutocompleteInput from './AutocompleteInput';

interface ProfileInputProps {
  onContentChange: (content: string) => void;
  profileConfig: {
    berufe: string[];
    taetigkeiten: string[];
    skills: string[];
    softskills: string[];
    ausbildung: string[];
  };
  initialContent?: string;
}

interface ProfileData {
  ausbildung: string[];
  berufe: string[];
  taetigkeiten: string[];
  skills: string[];
  softskills: string[];
  zusatzangaben: string;
}

interface FavoritesConfig {
  berufe: string[];
  taetigkeiten: string[];
  skills: string[];
  softskills: string[];
  ausbildung: string[];
}

export default function ProfileInput({ onContentChange, profileConfig, initialContent = '' }: ProfileInputProps) {
  const [profileData, setProfileData] = useState<ProfileData>({
    ausbildung: [],
    berufe: [],
    taetigkeiten: [],
    skills: [],
    softskills: [],
    zusatzangaben: initialContent,
  });

  // BOLT-UI-ANPASSUNG 2025-01-15: Ausbildung/Qualifikationen unter Tätigkeiten verschoben
  const [expandedSections, setExpandedSections] = useState({
    berufe: false,
    taetigkeiten: false,
    ausbildung: false,
    skills: false,
    softskills: false,
    zusatzangaben: false,
  });

  const [customInputs, setCustomInputs] = useState({
    ausbildung: '',
    berufe: '',
    taetigkeiten: '',
    skills: '',
    softskills: '',
  });


  // Favoriten-Konfiguration
  const [favoritesConfig, setFavoritesConfig] = useState<FavoritesConfig>(() => {
    try {
      const saved = localStorage.getItem('profileFavorites');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
    
    // Standard-Favoriten (erste 8 Elemente jeder Kategorie)
    return {
      berufe: profileConfig.berufe.slice(0, 8),
      taetigkeiten: profileConfig.taetigkeiten.slice(0, 8),
      skills: profileConfig.skills.slice(0, 8),
      softskills: profileConfig.softskills.slice(0, 8),
      ausbildung: profileConfig.ausbildung.slice(0, 8),
    };
  });

  // ✅ KORRIGIERT: Speichere Favoriten in localStorage
  useEffect(() => {
    localStorage.setItem('profileFavorites', JSON.stringify(favoritesConfig));
  }, [favoritesConfig]); // ✅ KORRIGIERT: favoritesConfig als Dependency


  // ✅ KORRIGIERT: Update zusatzangaben when initialContent changes
  useEffect(() => {
    if (!initialContent) return;
    setProfileData(prev => {
      if (prev.zusatzangaben === initialContent) return prev;
      const newData = { ...prev, zusatzangaben: initialContent };
      updateProfileContent(newData);
      return newData;
    });
  }, [initialContent, updateProfileContent]);

  const updateProfileContent = useCallback((newData: ProfileData) => {
    const sections = [];
    
    // BOLT-UI-ANPASSUNG 2025-01-15: Neue Reihenfolge
    if (newData.berufe.length > 0) {
      sections.push(`BERUFE:\n${newData.berufe.join(', ')}`);
    }
    
    if (newData.taetigkeiten.length > 0) {
      sections.push(`TÄTIGKEITEN:\n${newData.taetigkeiten.join(', ')}`);
    }
    
    if (newData.ausbildung.length > 0) {
      sections.push(`AUSBILDUNG/QUALIFIKATIONEN:\n${newData.ausbildung.join(', ')}`);
    }
    
    if (newData.skills.length > 0) {
      sections.push(`FACHLICHE KOMPETENZEN:\n${newData.skills.join(', ')}`);
    }
    
    if (newData.softskills.length > 0) {
      sections.push(`PERSÖNLICHE KOMPETENZEN:\n${newData.softskills.join(', ')}`);
    }
    
    if (newData.zusatzangaben.trim()) {
      sections.push(`ZUSÄTZLICHE ANGABEN:\n${newData.zusatzangaben.trim()}`);
    }
    
    onContentChange(sections.join('\n\n'));
  }, [onContentChange]); // ✅ KORRIGIERT: useCallback mit onContentChange als Dependency

  const toggleSelection = useCallback((category: keyof Omit<ProfileData, 'zusatzangaben'>, item: string) => {
    const newData = { ...profileData };
    const currentItems = newData[category];
    
    if (currentItems.includes(item)) {
      newData[category] = currentItems.filter(i => i !== item);
    } else {
      newData[category] = [...currentItems, item];
    }
    
    setProfileData(newData);
    updateProfileContent(newData);
  }, [profileData, updateProfileContent]); // ✅ KORRIGIERT: useCallback mit Dependencies

  const addCustomItem = useCallback((category: keyof Omit<ProfileData, 'zusatzangaben'>, customValue?: string) => {
    // Verwende den übergebenen Wert oder den aktuellen Input-Wert
    const valueToAdd = customValue || customInputs[category].trim();
    
    if (valueToAdd && !profileData[category].includes(valueToAdd)) {
      const newData = { ...profileData };
      newData[category] = [...newData[category], valueToAdd];
      setProfileData(newData);
      updateProfileContent(newData);
      
      // Leere das Input-Feld nur wenn kein spezifischer Wert übergeben wurde
      if (!customValue) {
        setCustomInputs({ ...customInputs, [category]: '' });
      } else {
        // Bei Vorschlag-Auswahl auch das Input-Feld leeren
        setCustomInputs({ ...customInputs, [category]: '' });
      }
    }
  }, [profileData, customInputs, updateProfileContent]); // ✅ KORRIGIERT: useCallback mit Dependencies

  const removeItem = useCallback((category: keyof Omit<ProfileData, 'zusatzangaben'>, item: string) => {
    const newData = { ...profileData };
    newData[category] = newData[category].filter(i => i !== item);
    setProfileData(newData);
    updateProfileContent(newData);
  }, [profileData, updateProfileContent]); // ✅ KORRIGIERT: useCallback mit Dependencies

  const toggleSection = useCallback((section: keyof typeof expandedSections) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  }, [expandedSections]); // ✅ KORRIGIERT: useCallback mit Dependencies

  const handleZusatzangabenChange = useCallback((value: string) => {
    const newData = { ...profileData, zusatzangaben: value };
    setProfileData(newData);
    updateProfileContent(newData);
  }, [profileData, updateProfileContent]); // ✅ KORRIGIERT: useCallback mit Dependencies


  const addToFavorites = useCallback((category: keyof FavoritesConfig, item: string) => {
    const newFavorites = { ...favoritesConfig };
    if (!newFavorites[category].includes(item)) {
      newFavorites[category] = [...newFavorites[category], item];
      setFavoritesConfig(newFavorites);
    }
  }, [favoritesConfig]); // ✅ KORRIGIERT: useCallback mit Dependencies

  const toggleFavorite = useCallback((category: keyof FavoritesConfig, item: string) => {
    const newFavorites = { ...favoritesConfig };
    const currentFavorites = newFavorites[category];
    
    if (currentFavorites.includes(item)) {
      newFavorites[category] = currentFavorites.filter(fav => fav !== item);
    } else {
      newFavorites[category] = [...currentFavorites, item];
    }
    
    setFavoritesConfig(newFavorites);
  }, [favoritesConfig]); // ✅ KORRIGIERT: useCallback mit Dependencies

  const removeFavorite = useCallback((category: keyof FavoritesConfig, item: string) => {
    const newFavorites = { ...favoritesConfig };
    newFavorites[category] = newFavorites[category].filter(fav => fav !== item);
    setFavoritesConfig(newFavorites);
  }, [favoritesConfig]); // ✅ KORRIGIERT: useCallback mit Dependencies

  const renderSection = (
    category: keyof Omit<ProfileData, 'zusatzangaben'>,
    title: string,
    icon: string
  ) => {
    const isExpanded = expandedSections[category];
    const selectedItems = profileData[category];
    const availableItems = profileConfig[category] || [];
    const favoriteItems = favoritesConfig[category] || [];
    const sectionId = `profile-section-${category}`;
    const customInputId = `custom-input-${category}`;

    return (
      <div key={category} className="border border-gray-200 rounded-lg overflow-hidden">
        <button
          id={`${sectionId}-toggle`}
          name={`toggle-${category}`}
          onClick={() => toggleSection(category)}
          className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between transition-colors duration-200"
          aria-expanded={isExpanded}
          aria-controls={`${sectionId}-content`}
        >
          <div className="flex items-center space-x-2">
            <span className="text-base">{icon}</span>
            <h3 className="font-medium text-gray-900 text-sm">{title}</h3>
            {selectedItems.length > 0 && (
              <span className="px-2 py-1 text-white text-xs rounded-full" style={{ backgroundColor: '#F29400' }}>
                {selectedItems.length}
              </span>
            )}
          </div>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5" style={{ color: '#F29400' }} />
          ) : (
            <ChevronDown className="h-5 w-5" style={{ color: '#F29400' }} />
          )}
        </button>

        {isExpanded && (
          <div id={`${sectionId}-content`} className="p-4 space-y-4">
            {/* BOLT-UI-ANPASSUNG 2025-01-15: Custom Input mit Autocomplete - Platzhaltertext angepasst */}
            <div>
              <AutocompleteInput
                id={customInputId}
                label={`${title} eingeben:`}
                value={customInputs[category]}
                onChange={(value) => setCustomInputs({ ...customInputs, [category]: value })}
                onAdd={(valueToAdd) => addCustomItem(category, valueToAdd)}
                suggestions={availableItems}
                placeholder="Hinzufügen..." // BOLT-UI-ANPASSUNG 2025-01-15: Platzhaltertext angepasst
                buttonColor="orange"
              />
            </div>

            {/* Selected Items with Favorites Button */}
            {selectedItems.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Ausgewählt:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedItems.map((item) => (
                    <div
                      key={item}
                      className="inline-flex items-center px-3 py-1 text-white text-sm rounded-full"
                      style={{ backgroundColor: '#F29400' }}
                    >
                      <span>{item}</span>
                      <div className="flex items-center ml-2 space-x-1">
                        {/* Favoriten-Button */}
                        <button
                          id={`favorite-${category}-${item.replace(/\s+/g, '-')}`}
                          name={`favorite-${category}-${item}`}
                          onClick={() => addToFavorites(category, item)}
                          className={`p-1 rounded-full transition-colors duration-200 ${
                            favoriteItems.includes(item)
                              ? 'text-yellow-300 hover:text-yellow-200'
                              : 'text-white hover:text-yellow-200'
                          }`}
                          title={favoriteItems.includes(item) ? 'Bereits in Favoriten' : 'Zu Favoriten hinzufügen'}
                          disabled={favoriteItems.includes(item)}
                          aria-label={`${item} zu Favoriten hinzufügen`}
                        >
                          <Star className={`h-3 w-3 ${favoriteItems.includes(item) ? 'fill-current' : ''}`} />
                        </button>
                        {/* Entfernen-Button */}
                        <button
                          id={`remove-${category}-${item.replace(/\s+/g, '-')}`}
                          name={`remove-${category}-${item}`}
                          onClick={() => removeItem(category, item)}
                          className="text-white hover:text-gray-200"
                          aria-label={`${item} entfernen`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Favorite Options - ORANGE UMRANDUNG + X INNERHALB */}
            {favoriteItems.length > 0 && (
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Star className="h-4 w-4 fill-current" style={{ color: '#F29400' }} />
                  <h4 className="text-sm font-medium text-gray-700">Favoriten:</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {favoriteItems
                    .filter(item => !selectedItems.includes(item))
                    .map((item) => (
                      <button
                        key={item}
                        id={`favorite-option-${category}-${item.replace(/\s+/g, '-')}`}
                        name={`favorite-option-${category}-${item}`}
                        onClick={() => toggleSelection(category, item)}
                        className="inline-flex items-center justify-between px-3 py-1 text-gray-700 text-sm rounded-full border hover:bg-gray-200 transition-colors duration-200"
                        style={{ backgroundColor: '#F3F4F6', borderColor: '#F29400' }}
                        aria-label={`${item} auswählen`}
                      >
                        <span className="mr-2">{item}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFavorite(category, item);
                          }}
                          className="text-gray-600 hover:text-gray-800"
                          title="Aus Favoriten entfernen"
                          aria-label={`${item} aus Favoriten entfernen`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </button>
                    ))}
                </div>
              </div>
            )}

            {/* All Available Options - STANDARDMÄSSIG ZUGEKLAPPT + STERN INNERHALB */}
            {availableItems.length > 0 && (
              <details className="group">
                <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center space-x-2">
                  <span>Alle verfügbaren Optionen ({availableItems.length})</span>
                  <ChevronDown className="h-4 w-4 group-open:rotate-180 transition-transform" style={{ color: '#F29400' }} />
                </summary>
                <div className="mt-3 space-y-3">
                  {/* SCROLLBARES FELD - GENAU WIE IM BILD */}
                  <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3 bg-gray-50">
                    <div className="flex flex-wrap gap-2">
                      {availableItems
                        .filter(item => !selectedItems.includes(item))
                        .map((item) => (
                          <div key={item} className="flex items-center space-x-1">
                            <button
                              id={`available-option-${category}-${item.replace(/\s+/g, '-')}`}
                              name={`available-option-${category}-${item}`}
                              onClick={() => toggleSelection(category, item)}
                              className="inline-flex items-center justify-between px-3 py-1 bg-white text-gray-700 text-sm rounded-full transition-colors duration-200 border border-gray-300 hover:bg-gray-100"
                              aria-label={`${item} auswählen`}
                            >
                              <span className="mr-2">{item}</span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFavorite(category, item);
                                }}
                                className={`transition-colors duration-200 ${
                                  favoriteItems.includes(item)
                                    ? 'hover:opacity-80'
                                    : 'text-gray-400 hover:opacity-80'
                                }`}
                                style={{ color: favoriteItems.includes(item) ? '#F29400' : undefined }}
                                title={favoriteItems.includes(item) ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen'}
                                aria-label={favoriteItems.includes(item) ? `${item} aus Favoriten entfernen` : `${item} zu Favoriten hinzufügen`}
                              >
                                <Star className={`h-3 w-3 ${favoriteItems.includes(item) ? 'fill-current' : ''}`} />
                              </button>
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </details>
            )}
          </div>
        )}
      </div>
    );
  };

  const hasProfileData = profileData.ausbildung.length > 0 || 
    profileData.berufe.length > 0 || 
    profileData.taetigkeiten.length > 0 || 
    profileData.skills.length > 0 || 
    profileData.softskills.length > 0 ||
    profileData.zusatzangaben.trim();

  return (
    <div className="space-y-6">
      {/* BOLT-UI-ANPASSUNG 2025-01-15: Keine Überschrift nach Reiterauswahl */}

      <div className="space-y-4">
        {/* BOLT-UI-ANPASSUNG 2025-01-15: Neue Reihenfolge - Ausbildung unter Tätigkeiten */}
        {renderSection('berufe', 'Berufe', '💼')}
        {renderSection('taetigkeiten', 'Tätigkeiten', '⚡')}
        {renderSection('ausbildung', 'Ausbildung/Qualifikationen', '🎓')}
        {renderSection('skills', 'Fachliche Kompetenzen', '🛠️')}
        {renderSection('softskills', 'Persönliche Kompetenzen', '🌟')}

        {/* Zusatzangaben */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <button
            id="zusatzangaben-toggle"
            name="toggle-zusatzangaben"
            onClick={() => toggleSection('zusatzangaben')}
            className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between transition-colors duration-200"
            aria-expanded={expandedSections.zusatzangaben}
            aria-controls="zusatzangaben-content"
          >
            <div className="flex items-center space-x-2">
              <span className="text-base">📝</span>
              <h3 className="font-medium text-gray-900 text-sm">Zusätzliche Angaben</h3>
              {profileData.zusatzangaben.trim() && (
                <span className="px-2 py-1 bg-gray-200 text-gray-800 text-xs rounded-full">
                  Vorhanden
                </span>
              )}
            </div>
            {expandedSections.zusatzangaben ? (
              <ChevronUp className="h-5 w-5" style={{ color: '#F29400' }} />
            ) : (
              <ChevronDown className="h-5 w-5" style={{ color: '#F29400' }} />
            )}
          </button>

          {expandedSections.zusatzangaben && (
            <div id="zusatzangaben-content" className="p-4">
              <TextInput
                id="zusatzangaben-textarea"
                name="zusatzangaben"
                value={profileData.zusatzangaben}
                onChange={handleZusatzangabenChange}
                label=""
                placeholder="Hinzufügen..." // BOLT-UI-ANPASSUNG 2025-01-15: Platzhaltertext angepasst
                rows={6}
              />
            </div>
          )}
        </div>

        {/* BOLT-UI-ANPASSUNG 2025-01-15: Profile verwalten entfernt - nur im Profile-Reiter */}
      </div>

      {/* Summary */}
      {hasProfileData && (
        <div className="p-6 rounded-lg border" style={{ backgroundColor: '#FEF7EE', borderColor: '#F29400' }}>
          <h4 className="font-bold text-xl mb-4" style={{ color: '#F29400' }}>📋 Ausführliche Profil-Zusammenfassung</h4>
          
          <div className="space-y-4" style={{ color: '#F29400' }}>
            {/* BOLT-UI-ANPASSUNG 2025-01-15: Neue Reihenfolge */}
            {profileData.berufe.length > 0 && (
              <div>
                <h5 className="font-bold text-lg mb-2">💼 Berufserfahrung ({profileData.berufe.length})</h5>
                <div className="ml-4 text-gray-700 space-y-1">
                  {profileData.berufe.map((item, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <span style={{ color: '#F29400' }} className="mt-1">•</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {profileData.taetigkeiten.length > 0 && (
              <div>
                <h5 className="font-bold text-lg mb-2">⚡ Tätigkeitsbereiche ({profileData.taetigkeiten.length})</h5>
                <div className="ml-4 text-gray-700 space-y-1">
                  {profileData.taetigkeiten.map((item, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <span style={{ color: '#F29400' }} className="mt-1">•</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {profileData.ausbildung.length > 0 && (
              <div>
                <h5 className="font-bold text-lg mb-2">🎓 Ausbildung & Qualifikationen ({profileData.ausbildung.length})</h5>
                <div className="ml-4 text-gray-700 space-y-1">
                  {profileData.ausbildung.map((item, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <span style={{ color: '#F29400' }} className="mt-1">•</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {profileData.skills.length > 0 && (
              <div>
                <h5 className="font-bold text-lg mb-2">🛠️ Fachliche Kompetenzen ({profileData.skills.length})</h5>
                <div className="ml-4 text-gray-700 space-y-1">
                  {profileData.skills.map((item, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <span style={{ color: '#F29400' }} className="mt-1">•</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {profileData.softskills.length > 0 && (
              <div>
                <h5 className="font-bold text-lg mb-2">🌟 Persönliche Kompetenzen ({profileData.softskills.length})</h5>
                <div className="ml-4 text-gray-700 space-y-1">
                  {profileData.softskills.map((item, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <span style={{ color: '#F29400' }} className="mt-1">•</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {profileData.zusatzangaben.trim() && (
              <div>
                <h5 className="font-bold text-lg mb-2">📝 Zusätzliche Angaben</h5>
                <div className="ml-4 text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {profileData.zusatzangaben}
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-6 pt-4 border-t" style={{ borderColor: '#F29400' }}>
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Gesamtanzahl Einträge:</span>
              <span className="font-bold">
                {profileData.ausbildung.length + profileData.berufe.length + profileData.taetigkeiten.length + 
                 profileData.skills.length + profileData.softskills.length + (profileData.zusatzangaben.trim() ? 1 : 0)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
