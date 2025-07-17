import React, { useMemo, useState } from 'react';
import { Trash2, Plus, Calendar, Building, Briefcase, FileText, Star, X, ToggleLeft, ToggleRight } from 'lucide-react';
import { ReactSortable } from 'react-sortablejs';
import { useLebenslauf } from "../context/LebenslaufContext";
import EditablePreviewText from './EditablePreviewText';

export default function LebenslaufPreview() {
  const { 
    berufserfahrung, 
    ausbildung,
    selectExperience, 
    selectedExperienceId,
    deleteExperience,
    selectEducation,
    selectedEducationId,
    deleteEducation,
    updateEducationField,
    updateExperienceTask,
    updateExperienceTasksOrder,
    addExperienceTask,
    updateExperienceField,
    favoriteTasks,
    toggleFavoriteTask
  } = useLebenslauf();

  const [newTaskInputs, setNewTaskInputs] = useState<Record<string, string>>({});
  const [showAllExpanded, setShowAllExpanded] = useState(false);

  const sortedErfahrungen = useMemo(() => {
    console.log('Berufserfahrungen für Vorschau:', berufserfahrung);
    return [...berufserfahrung].sort((a, b) => {
      // Neue Einträge ohne Zeitraum kommen immer nach oben
      const aHasTime = a.startYear && a.startYear.trim();
      const bHasTime = b.startYear && b.startYear.trim();
      
      if (!aHasTime && !bHasTime) return 0;
      if (!aHasTime) return -1;
      if (!bHasTime) return 1;
      
      const yearA = parseInt(a.startYear || '0', 10);
      const yearB = parseInt(b.startYear || '0', 10);
      const monthA = parseInt(a.startMonth || '0', 10);
      const monthB = parseInt(b.startMonth || '0', 10);

      if (yearA !== yearB) return yearB - yearA;
      return monthB - monthA;
    });
  }, [berufserfahrung]);

  const sortedAusbildungen = useMemo(() => {
    console.log('Ausbildungen für Vorschau:', ausbildung);
    return [...ausbildung].sort((a, b) => {
      // Neue Einträge ohne Zeitraum kommen immer nach oben
      const aHasTime = a.startYear && a.startYear.trim();
      const bHasTime = b.startYear && b.startYear.trim();
      
      if (!aHasTime && !bHasTime) return 0;
      if (!aHasTime) return -1;
      if (!bHasTime) return 1;
      
      const yearA = parseInt(a.startYear || '0', 10);
      const yearB = parseInt(b.startYear || '0', 10);
      const monthA = parseInt(a.startMonth || '0', 10);
      const monthB = parseInt(b.startMonth || '0', 10);

      if (yearA !== yearB) return yearB - yearA;
      return monthB - monthA;
    });
  }, [ausbildung]);

  const formatZeitraum = (
    startMonth: string | null,
    startYear: string | null,
    endMonth: string | null,
    endYear: string | null,
    isCurrent: boolean,
  ) => {
    const format = (m: string | null | undefined, y: string | null | undefined) => {
      if (!y) return '';
      return m ? `${m}.${y}` : y;
    };

    const start = format(startMonth ?? undefined, startYear ?? undefined);
    const end = isCurrent ? 'heute' : format(endMonth ?? undefined, endYear ?? undefined);

    if (!start && !end) return '';
    if (start && end) return `${start} – ${end}`;
    return start || end;
  };

  const handleAddTask = (expId: string) => {
    const newTask = newTaskInputs[expId]?.trim();
    if (newTask) {
      addExperienceTask(expId, newTask);
      setNewTaskInputs(prev => ({ ...prev, [expId]: '' }));
    }
  };

  const handleExperienceFieldUpdate = (expId: string, field: string, value: string) => {
    if (field === 'companies') {
      // Parse the combined company info string
      const companies = value.split('//').map(part => part.trim()).filter(Boolean);
      updateExperienceField(expId, 'companies', companies);
    } else if (field === 'position') {
      updateExperienceField(expId, 'position', value.split(' / '));
    } else if (field === 'zeitraum') {
      // Zeitraum-Bearbeitung ist komplexer und würde eine spezielle Komponente erfordern
      // Für diesen Prototyp belassen wir es bei der einfachen Textbearbeitung
      console.log('Zeitraum bearbeiten:', value);
    }
  };

  const handleEducationFieldUpdate = (eduId: string, field: string, value: string) => {
    if (field === 'institution') {
      updateEducationField(eduId, 'institution', value.split(', '));
    } else if (field === 'ausbildungsart') {
      const parts = value.split(' - ');
      updateEducationField(eduId, 'ausbildungsart', parts[0].split(' / '));
      if (parts.length > 1) {
        updateEducationField(eduId, 'abschluss', parts[1].split(' / '));
      }
    } else if (field === 'zeitraum') {
      // Zeitraum-Bearbeitung ist komplexer und würde eine spezielle Komponente erfordern
      // Für diesen Prototyp belassen wir es bei der einfachen Textbearbeitung
      console.log('Zeitraum bearbeiten:', value);
    }
  };

  const removeTask = (expId: string, taskIndex: number) => {
    const experience = berufserfahrung.find(exp => exp.id === expId);
    if (experience && experience.aufgabenbereiche) {
      const newTasks = experience.aufgabenbereiche.filter((_, index) => index !== taskIndex);
      updateExperienceField(expId, 'aufgabenbereiche', newTasks);
    }
  };

  const toggleTaskFavorite = (task: string) => {
    toggleFavoriteTask(task);
  };

  const isExpanded = (id: string, type: 'experience' | 'education') => {
    if (showAllExpanded) return true;
    return type === 'experience' ? selectedExperienceId === id : selectedEducationId === id;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header mit Toggle-Button */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <h2 className="text-lg font-semibold text-gray-900">📄 Vorschau</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">
            {showAllExpanded ? 'Alle ausgeklappt' : 'Nur aktive ausgeklappt'}
          </span>
          <button
            onClick={() => setShowAllExpanded(!showAllExpanded)}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200"
            title={showAllExpanded ? 'Nur aktive Einträge ausklappen' : 'Alle Einträge ausklappen'}
          >
            {showAllExpanded ? (
              <ToggleRight className="h-6 w-6" style={{ color: '#F29400' }} />
            ) : (
              <ToggleLeft className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Scrollbarer Inhalt */}
      <div className="flex-1 overflow-y-auto space-y-1">
        {/* Berufserfahrung */}
        <div>
          <h3 className="font-bold text-xl mb-2">Berufserfahrung</h3>
          <div className="space-y-1">
            {sortedErfahrungen.map((exp, index) => {
              const isSelected = selectedExperienceId === exp.id;
              const isCardExpanded = isExpanded(exp.id, 'experience');
              
              return (
                <div key={exp.id} className="relative">
                  {/* Vertikale Trennlinie zwischen Karten */}
                  {index > 0 && (
                    <div className="w-full h-px bg-gray-200 mb-1"></div>
                  )}
                  
                  <div
                    onClick={() => selectExperience(exp.id)}
                    className={`p-4 cursor-pointer transition-all duration-200 ${
                      isSelected 
                        ? "border border-[#F29400] bg-white rounded-md py-2" 
                        : "bg-white hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      {/* Zeitraum */}
                      <EditablePreviewText
                        value={formatZeitraum(
                          exp.startMonth,
                          exp.startYear,
                          exp.endMonth,
                          exp.endYear,
                          exp.isCurrent,
                        )}
                        onSave={(newValue) => handleExperienceFieldUpdate(exp.id, 'zeitraum', newValue)}
                        className="text-sm text-gray-500"
                        placeholder="Zeitraum eingeben..."
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteExperience(exp.id);
                        }}
                        className="text-red-500 hover:text-red-700 p-1 rounded transition-colors duration-200"
                        title="Berufserfahrung löschen"
                        aria-label="Berufserfahrung löschen"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Position */}
                    <div className="mb-1">
                      <EditablePreviewText
                        value={Array.isArray(exp.position) ? exp.position.join(' / ') : (exp.position || "")}
                        onSave={(newValue) => handleExperienceFieldUpdate(exp.id, 'position', newValue)}
                        className="font-bold text-lg text-gray-900"
                        placeholder="Position eingeben..."
                      />
                    </div>

                    {/* Unternehmen/Ort */}
                    <div className="mb-1">
                      <EditablePreviewText
                        value={Array.isArray(exp.companies) ? exp.companies.join(' // ') : (exp.companies || "")}
                        onSave={(newValue) => handleExperienceFieldUpdate(exp.id, 'companies', newValue)}
                        className="text-gray-700"
                        placeholder="Unternehmen eingeben..."
                      />
                    </div>

                    {/* Erweiterte Inhalte nur bei ausgeklapptem Zustand */}
                    {isCardExpanded && (
                      <>
                        {/* Weitere Angaben */}
                        {exp.zusatzangaben && (
                          <div className="mb-2 border-t pt-1 border-gray-100">
                            <div className="flex items-start space-x-2">
                              <FileText className="h-4 w-4 mt-1 text-gray-400 flex-shrink-0" />
                              <EditablePreviewText
                                value={exp.zusatzangaben}
                                onSave={(newValue) => updateExperienceField(exp.id, 'zusatzangaben', newValue)}
                                isTextArea={true}
                                placeholder="Weitere Angaben eingeben..."
                              />
                            </div>
                          </div>
                        )}

                        {/* Auflistung Tätigkeiten */}
                        {Array.isArray(exp.aufgabenbereiche) && exp.aufgabenbereiche.length > 0 && (
                          <ReactSortable
                            list={exp.aufgabenbereiche.map((task, index) => ({ id: `${exp.id}-${index}`, content: task || '' }))}
                            setList={(newList) => {
                              const newTasks = newList.map(item => item.content || '');
                              updateExperienceTasksOrder(exp.id, newTasks);
                            }}
                            tag="ul"
                            className="list-disc list-inside mt-2 space-y-0 text-black"
                          >
                            {exp.aufgabenbereiche.map((aufgabe, i) => (
                              <li 
                                key={`${exp.id}-${i}`}
                                data-id={`${exp.id}-${i}`}
                                className="cursor-move hover:bg-gray-50 rounded py-1 px-2 transition-colors duration-200 group relative"
                              >
                                <div className="flex items-start justify-between">
                                  <EditablePreviewText
                                    value={aufgabe}
                                    onSave={(newValue) => updateExperienceTask(exp.id, i, newValue)}
                                    placeholder="Aufgabe eingeben..."
                                    className="flex-1 pr-2"
                                  />
                                  {/* Hover-Buttons für Tätigkeiten */}
                                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center space-x-1 flex-shrink-0">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleTaskFavorite(aufgabe);
                                      }}
                                      className="p-0.5 hover:bg-gray-200 rounded transition-colors duration-200"
                                      title={favoriteTasks.includes(aufgabe) ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen'}
                                    >
                                      <Star 
                                        className={`h-4 w-4 ${favoriteTasks.includes(aufgabe) ? 'fill-current text-yellow-500' : 'text-gray-400'}`} 
                                      />
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        removeTask(exp.id, i);
                                      }}
                                      className="p-0.5 hover:bg-gray-200 rounded transition-colors duration-200"
                                      title="Aufgabe löschen"
                                    >
                                      <X className="h-4 w-4 text-gray-400 hover:text-red-500" />
                                    </button>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ReactSortable>
                        )}
                        
                        {/* Neue Aufgabe hinzufügen */}
                        {selectedExperienceId === exp.id && (
                          <div className="mt-2 flex items-center space-x-2">
                            <input
                              type="text"
                              value={newTaskInputs[exp.id] || ''}
                              onChange={(e) => setNewTaskInputs(prev => ({ ...prev, [exp.id]: e.target.value }))}
                              onKeyPress={(e) => e.key === 'Enter' && handleAddTask(exp.id)}
                              placeholder="Neue Aufgabe hinzufügen..."
                              className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500"
                            />
                            <button
                              onClick={() => handleAddTask(exp.id)}
                              disabled={!newTaskInputs[exp.id]?.trim()}
                              className="p-1 text-white rounded hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                              style={{ backgroundColor: '#F29400' }}
                              title="Aufgabe hinzufügen"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
            {berufserfahrung.length === 0 && (
              <div className="border border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 text-gray-500">
                <p className="italic">
                  Hier erscheint die Vorschau deines Lebenslaufs …
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Ausbildung */}
        <div>
          <h3 className="font-bold text-xl mb-2">Ausbildung</h3>
          <div className="space-y-1">
            {sortedAusbildungen.map((edu, index) => {
              const isSelected = selectedEducationId === edu.id;
              const isCardExpanded = isExpanded(edu.id, 'education');
              
              return (
                <div key={edu.id} className="relative">
                  {/* Horizontale Trennlinie zwischen Karten */}
                  {index > 0 && (
                    <div className="w-full h-px bg-gray-200 mb-1"></div>
                  )}
                  
                  <div
                    onClick={() => selectEducation(edu.id)}
                    className={`p-4 cursor-pointer transition-all duration-200 ${
                      isSelected 
                        ? "border border-[#F29400] bg-white rounded-md py-2" 
                        : "bg-white hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      {/* Zeitraum */}
                      <EditablePreviewText
                        value={formatZeitraum(
                          edu.startMonth,
                          edu.startYear,
                          edu.endMonth,
                          edu.endYear,
                          edu.isCurrent,
                        )}
                        onSave={(newValue) => handleEducationFieldUpdate(edu.id, 'zeitraum', newValue)}
                        className="text-sm text-gray-500"
                        placeholder="Zeitraum eingeben..."
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteEducation(edu.id);
                        }}
                        className="text-red-500 hover:text-red-700 p-1 rounded transition-colors duration-200"
                        title="Ausbildung löschen"
                        aria-label="Ausbildung löschen"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Ausbildungsart */}
                    <div className="mb-1">
                      <EditablePreviewText
                        value={`${Array.isArray(edu.ausbildungsart) ? edu.ausbildungsart.join(" / ") : (edu.ausbildungsart || "")} - ${Array.isArray(edu.abschluss) ? edu.abschluss.join(" / ") : (edu.abschluss || "")}`}
                        onSave={(newValue) => handleEducationFieldUpdate(edu.id, 'ausbildungsart', newValue)}
                        className="font-bold text-lg text-gray-900"
                        placeholder="Ausbildungsart und Abschluss eingeben..."
                      />
                    </div>

                    {/* Erweiterte Inhalte nur bei ausgeklapptem Zustand */}
                    {isCardExpanded && (
                      <>
                        {/* Institution */}
                        <div className="mb-1">
                          <EditablePreviewText
                            value={Array.isArray(edu.institution) ? edu.institution.join(', ') : (edu.institution || "")}
                            onSave={(newValue) => handleEducationFieldUpdate(edu.id, 'institution', newValue)}
                            className="italic text-gray-500"
                            placeholder="Institution eingeben..."
                          />
                        </div>
                        
                        {/* Bearbeitbare Zusatzangaben */}
                        {edu.zusatzangaben && (
                          <div className="text-black mt-1">
                            <EditablePreviewText
                              value={edu.zusatzangaben}
                              onSave={(newValue) => updateEducationField(edu.id, 'zusatzangaben', newValue)}
                              isTextArea={true}
                              placeholder="Zusatzangaben eingeben..."
                            />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
            {sortedAusbildungen.length === 0 && (
              <div className="border border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 text-gray-500">
                <p className="italic">
                  Hier erscheint die Vorschau deiner Ausbildung …
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}