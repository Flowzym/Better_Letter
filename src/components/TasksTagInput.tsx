import React, { useMemo, useState } from "react";
import { Lightbulb, X } from "lucide-react";
import TaskTag from "./TaskTag";
import TagButton from "./TagButton";
import TagContext from "../types/TagContext";
import AutocompleteInput from "./AutocompleteInput";
import { getTasksForPositions } from "../constants/positionsToTasks";
import { useLebenslaufContext } from "../context/LebenslaufContext";
import "../styles/_tags.scss";

interface TasksTagInputProps {
  value: string[];
  onChange: (tasks: string[]) => void;
  positionen: string[];
}

export default function TasksTagInput({
  value,
  onChange,
  positionen,
}: TasksTagInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const { favoriteTasks: favorites, toggleFavoriteTask } = useLebenslaufContext();

  const suggestions = useMemo(() => {
    const fromPositions = getTasksForPositions(positionen);
    const unique = Array.from(new Set(fromPositions));
    unique.sort((a, b) => a.localeCompare(b, "de", { sensitivity: "base" }));
    return unique;
  }, [positionen]);

  const filteredSuggestions = suggestions.filter((s) => !value.includes(s));

  const addTask = (task?: string) => {
    const t = (task ?? inputValue).trim();
    if (!t || value.includes(t)) return;
    onChange([...value, t]);
    setInputValue("");
  };

  const removeTask = (task: string) => {
    onChange(value.filter((t) => t !== task));
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
    setEditValue("");
  };

  const toggleFavorite = (task: string) => {
    toggleFavoriteTask(task);
  };


  return (
    <div className="space-y-4">

      <AutocompleteInput
        value={inputValue}
        onChange={setInputValue}
        onAdd={addTask}
        suggestions={filteredSuggestions}
        placeholder="Hinzufügen..."
        buttonColor="orange"
        inputBorderColor="#D1D5DB"
        showFavoritesButton={false}
        showAddButton={false}
      />

      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
            {value.map((task, index) => (
              editIndex === index ? (
                <div key={`${task}-${index}`} className="tag">
                  <input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={confirmEdit}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") confirmEdit();
                    }}
                    className="text-black px-1 py-0.5 rounded"
                    autoFocus
                  />
                  <button
                    onClick={() => removeTask(task)}
                    className="tag-icon-button"
                    aria-label="Entfernen"
                  >
                    <X className="tag-icon" />
                  </button>
                </div>
              ) : (
                <TaskTag
                  key={`${task}-${index}`}
                  label={task}
                  onRemove={() => removeTask(task)}
                  onEdit={() => startEdit(index)}
                />
              )
            ))}
          </div>
      )}

      {filteredSuggestions.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
            <Lightbulb className="h-4 w-4" />
            Vorschläge:
          </h4>
          <div className="flex flex-wrap gap-2">
            {filteredSuggestions.map((s) => {
              const isFavorite = favorites.includes(s);
              return (
                <TagButton
                  key={s}
                  label={s}
                  variant={TagContext.Suggestion}
                  isFavorite={isFavorite}
                  onClick={() => addTask(s)}
                  type="task"
                  onToggleFavorite={toggleFavorite}
                />
              );
            })}
          </div>
        </div>
      )}

      {favorites.filter((f) => !value.includes(f)).length > 0 && (
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#9CA3AF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon
                points="12 2 15 8.5 22 9.3 17 14 18.2 21 12 17.8 5.8 21 7 14 2 9.3 9 8.5 12 2"
                fill="none"
              />
            </svg>
            <h4 className="text-sm font-medium text-gray-700">Favoriten:</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {favorites
              .filter((item) => !value.includes(item))
              .map((item) => (
                <TagButton
                  key={item}
                  label={item}
                  variant={TagContext.Favorites}
                  isFavorite
                  type="task"
                  onClick={() => addTask(item)}
                  onRemove={() => toggleFavorite(item)}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
