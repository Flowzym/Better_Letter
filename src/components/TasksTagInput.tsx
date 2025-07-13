import React, { useState } from "react";
import { X } from "lucide-react";
import TaskTag from "./TaskTag";
import TagButtonFavorite from "./ui/TagButtonFavorite";
import TextInputWithButtons from "./TextInputWithButtons";
import { useLebenslaufContext } from "../context/LebenslaufContext";
import { useTagList } from "../hooks/useTagList";
import "../styles/_tags.scss";

interface TasksTagInputProps {
  value: string[];
  onChange: (tasks: string[]) => void;
}

export default function TasksTagInput({ value, onChange }: TasksTagInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const { favoriteTasks: favorites, toggleFavoriteTask } = useLebenslaufContext();

  // unified via useTagList - konsolidierte Tag-Verwaltung
  const { hasTag } = useTagList({
    initialTags: value,
    allowDuplicates: false
  });


  const addTask = (task?: string) => {
    const t = (task ?? inputValue).trim();
    if (!t || hasTag(t)) return;
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

  const handleAddFavoriteInput = (val?: string) => {
    const toAdd = (val ?? inputValue).trim();
    if (!toAdd) return;
    toggleFavorite(toAdd);
    setInputValue("");
  };


  return (
    <div className="space-y-4">

      <TextInputWithButtons
        value={inputValue}
        onChange={setInputValue}
        onAdd={addTask}
        onFavoriteClick={handleAddFavoriteInput}
        placeholder="Hinzufügen..."
      />

      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
            {value.map((task, index) => (
              editIndex === index ? (
                <div key={`${task}-${index}`} className="tag flex-shrink-0">
                  <input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={confirmEdit}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") confirmEdit();
                    }}
                    className="text-black px-2 py-1 rounded bg-white"
                    size={Math.max(editValue.length, 10)}
                    style={{ width: `${Math.max(editValue.length * 0.6 + 2, 8)}ch` }}
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
                <TagButtonFavorite
                  key={item}
                  label={item}
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
