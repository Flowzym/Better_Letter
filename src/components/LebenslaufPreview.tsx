import React, { useMemo, useState } from 'react';
import { Trash2, Plus, Calendar, Building, Briefcase } from 'lucide-react';
import { ReactSortable } from 'react-sortablejs';
import { useLebenslaufContext } from "../context/LebenslaufContext";
import EditablePreviewText from './EditablePreviewText';
import TextInputWithButtons from './TextInputWithButtons';

export default function LebenslaufPreview() {
  const { 
    berufserfahrungen, 
    selectExperience, 
    selectedExperienceId,
    deleteExperience,
    ausbildungen,
    selectEducation,
    selectedEducationId,
    deleteEducation,
    updateEducationField,
    updateExperienceTask,
    updateExperienceTasksOrder,
    addExperienceTask,
    updateExperienceField
  } =
    useLebenslaufContext();

  const [newTaskInputs, setNewTaskInputs] = useState<Record<string, string>>({});

  const sortedErfahrungen = useMemo(() => {
    return [...berufserfahrungen].sort((a, b) => {
      const yearA = parseInt(a.startYear || '0', 10);
      const yearB = parseInt(b.startYear || '0', 10);
      const monthA = parseInt(a.startMonth || '0', 10);
      const monthB = parseInt(b.startMonth || '0', 10);

      if (yearA !== yearB) return yearB - yearA;
      return monthB - monthA;
    });
  }, [berufserfahrungen]);

  const sortedAusbildungen = useMemo(() => {
    return [...ausbildungen].sort((a, b) => {
      const yearA = parseInt(a.startYear || '0', 10);
      const yearB = parseInt(b.startYear || '0', 10);
      const monthA = parseInt(a.startMonth || '0', 10);
      const monthB = parseInt(b.startMonth || '0', 10);

      if (yearA !== yearB) return yearB - yearA;
      return monthB - monthA;
    });
  }, [ausbildungen]);

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
      updateExperienceField(expId, 'companies', value.split(', '));
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

  return (
    <>
      <h3 className="font-bold text-xl mb-4">Berufserfahrung</h3>
    <div className="space-y-4">
      {sortedErfahrungen.map((exp) => (
        <div
          key={exp.id}
          onClick={() => selectExperience(exp.id)}
          className={`mb-6 border rounded p-4 cursor-pointer ${
            selectedExperienceId === exp.id ? "border-orange-500 border-2 bg-white" : "border border-gray-200 bg-white"
          }`}
        >
          <div className="flex justify-between items-start mb-1">
            <div className="flex items-center">
              {/* Icon entfernt */}
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
            </div>
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
          <div className="flex items-center mb-1">
            {/* Icon entfernt */}
            <EditablePreviewText
              value={Array.isArray(exp.position) ? exp.position.join(" / ") : (exp.position || "")}
              onSave={(newValue) => handleExperienceFieldUpdate(exp.id, 'position', newValue)}
              className="font-bold text-lg text-gray-900"
              placeholder="Position eingeben..."
            />
          </div>

           <div className="flex items-center mb-1">
              {/* Icon entfernt */}
              <EditablePreviewText
                value={Array.isArray(exp.companies) ? exp.companies.join(', ') : (exp.companies || "")}
                onSave={(newValue) => handleExperienceFieldUpdate(exp.id, 'companies', newValue)}
                className="italic text-gray-500"
                placeholder="Unternehmen eingeben..."
            />
          </div>
          
          {/* Drag-and-Drop Aufgabenbereiche */}
          {Array.isArray(exp.aufgabenbereiche) && exp.aufgabenbereiche.length > 0 && (
            <ReactSortable
              list={exp.aufgabenbereiche.map((task, index) => ({ id: `${exp.id}-${index}`, content: task }))}
              setList={(newList) => {
                const newTasks = newList.map(item => item.content);
                updateExperienceTasksOrder(exp.id, newTasks);
              }}
              tag="ul"
              className="list-disc list-inside mt-1 space-y-px text-black"
            >
              {exp.aufgabenbereiche.map((aufgabe, i) => (
                <li 
                  key={`${exp.id}-${i}`}
                  data-id={`${exp.id}-${i}`}
                  className="cursor-move hover:bg-gray-50 rounded p-1 transition-colors duration-200"
                >
                  <EditablePreviewText
                    value={aufgabe}
                    onSave={(newValue) => updateExperienceTask(exp.id, i, newValue)}
                    placeholder="Aufgabe eingeben..."
                  />
                </li>
              ))}
            </ReactSortable>
          )}
          
          {/* Neue Aufgabe hinzufügen */}
          {selectedExperienceId === exp.id && (
          <div className="mt-1 flex items-center space-x-2">
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
        </div>
      ))}
      {berufserfahrungen.length === 0 && (
        <div className="border border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 text-gray-500">
          <p className="italic">
            Hier erscheint die Vorschau deines Lebenslaufs …
          </p>
        </div>
      )}
    </div>

      <h3 className="font-bold text-xl mb-4 mt-8">Ausbildung</h3>
    <div className="space-y-4">
      {sortedAusbildungen.map((edu) => (
        <div
          key={edu.id}
          onClick={() => selectEducation(edu.id)}
          className={`mb-6 border rounded p-4 cursor-pointer ${
            selectedEducationId === edu.id ? "border-orange-500 border-2 bg-white" : "border border-gray-200 bg-white"
          }`}
        >
          <div className="flex justify-between items-start mb-1">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1 text-gray-400" />
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
            </div>
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
          <div className="flex items-center mb-0">
            <Briefcase className="h-4 w-4 mr-1 text-gray-400" />
            <EditablePreviewText
              value={`${Array.isArray(edu.ausbildungsart) ? edu.ausbildungsart.join(" / ") : (edu.ausbildungsart || "")} - ${Array.isArray(edu.abschluss) ? edu.abschluss.join(" / ") : (edu.abschluss || "")}`}
              onSave={(newValue) => handleEducationFieldUpdate(edu.id, 'ausbildungsart', newValue)}
              className="font-bold text-lg text-gray-900"
              placeholder="Ausbildungsart und Abschluss eingeben..."
            />
          </div>
          <div className="flex items-center mb-1">
            <Building className="h-4 w-4 mr-1 text-gray-400" />
            <EditablePreviewText
              value={Array.isArray(edu.institution) ? edu.institution.join(', ') : (edu.institution || "")}
              onSave={(newValue) => handleEducationFieldUpdate(edu.id, 'institution', newValue)}
              className="italic text-gray-500"
              placeholder="Institution eingeben..."
            />
          </div>
          
          {/* Bearbeitbare Zusatzangaben */}
          <div className="text-black mt-2">
            <EditablePreviewText
              value={edu.zusatzangaben}
              onSave={(newValue) => updateEducationField(edu.id, 'zusatzangaben', newValue)}
              isTextArea={true}
              placeholder="Zusatzangaben eingeben..."
            />
          </div>
        </div>
      ))}
      {sortedAusbildungen.length === 0 && (
        <div className="border border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 text-gray-500">
          <p className="italic">
            Hier erscheint die Vorschau deiner Ausbildung …
          </p>
        </div>
      )}
    </div>
    </>
  );
}
