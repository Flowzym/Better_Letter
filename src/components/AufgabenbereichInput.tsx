import React, { useEffect, useState } from 'react';
import { X, Pencil } from 'lucide-react';
import { ReactSortable } from 'react-sortablejs';
import AutocompleteInput from './AutocompleteInput';
import { getTaskSuggestionsForBeruf } from '../constants/taskSuggestions';

interface AufgabenbereichInputProps {
  beruf: string;
  value: string[];
  onChange: (tasks: string[]) => void;
  enableReorder?: boolean;
}

export default function AufgabenbereichInput({
  beruf,
  value,
  onChange,
  enableReorder = false,
}: AufgabenbereichInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    setSuggestions(getTaskSuggestionsForBeruf(beruf));
  }, [beruf]);

  const addTask = (task?: string) => {
    const t = (task ?? inputValue).trim();
    if (!t) return;
    if (!value.includes(t)) {
      onChange([...value, t]);
    }
    setInputValue('');
  };

  const removeTask = (index: number) => {
    const newTasks = value.filter((_, i) => i !== index);
    onChange(newTasks);
  };

  const startEdit = (index: number) => {
    setEditIndex(index);
    setEditValue(value[index]);
  };

  const confirmEdit = () => {
    if (editIndex === null) return;
    const trimmed = editValue.trim();
    if (!trimmed) return;
    const newTasks = value.map((t, i) => (i === editIndex ? trimmed : t));
    onChange(newTasks);
    setEditIndex(null);
    setEditValue('');
  };

  const suggestionButtons = suggestions
    .filter((s) => !value.includes(s))
    .map((s) => (
      <button
        key={s}
        onClick={() => addTask(s)}
        className="px-3 py-1 text-sm rounded-full border hover:bg-gray-100"
        style={{ borderColor: '#F29400' }}
      >
        {s}
      </button>
    ));

  const tasks = value.map((task, index) => (
    <div
      key={task}
      className="inline-flex items-center px-3 py-1 text-sm rounded-full text-white mb-2 mr-2"
      style={{ backgroundColor: '#F29400' }}
    >
      {editIndex === index ? (
        <input
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={confirmEdit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') confirmEdit();
          }}
          className="text-black px-1 py-0.5 rounded"
          autoFocus
        />
      ) : (
        <span className="mr-2">{task}</span>
      )}
      {editIndex !== index && (
        <button
          onClick={() => startEdit(index)}
          className="mr-1 text-white hover:text-gray-200"
          aria-label="Bearbeiten"
        >
          <Pencil className="h-3 w-3" />
        </button>
      )}
      <button
        onClick={() => removeTask(index)}
        className="text-white hover:text-gray-200"
        aria-label="Entfernen"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  ));

  return (
    <div className="space-y-4">
      <AutocompleteInput
        value={inputValue}
        onChange={setInputValue}
        onAdd={() => addTask()}
        suggestions={suggestions}
        placeholder="Hinzufügen..."
        buttonColor="orange"
      />

      {suggestionButtons.length > 0 && (
        <div className="flex flex-wrap gap-2">{suggestionButtons}</div>
      )}

      {enableReorder ? (
        <ReactSortable list={[...value]} setList={onChange} className="flex flex-wrap">
          {tasks}
        </ReactSortable>
      ) : (
        <div className="flex flex-wrap">{tasks}</div>
      )}
    </div>
  );
}
