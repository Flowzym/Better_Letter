import React, { useEffect, useMemo, useState } from "react";
import { Star, Pencil, X } from "lucide-react";
import AutocompleteInput from "./AutocompleteInput";
import { getTasksForPositions } from "../constants/positionsToTasks";
import "../styles/Tags.css";

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
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem("taskFavoriten");
      if (stored) {
        return JSON.parse(stored) as string[];
      }
    } catch {
      // ignore
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        "taskFavoriten",
        JSON.stringify(favorites.slice(-10)),
      );
    } catch {
      // ignore
    }
  }, [favorites]);

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
    setFavorites(
      favorites.includes(task)
        ? favorites.filter((f) => f !== task)
        : [...favorites.slice(-9), task],
    );
  };

  const addToFavorites = (task: string) => {
    if (!favorites.includes(task)) {
      setFavorites([...favorites.slice(-9), task]);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-700">
        Aufgaben/Tätigkeiten
      </h3>

      <AutocompleteInput
        value={inputValue}
        onChange={setInputValue}
        onAdd={() => addTask()}
        onAddToFavorites={(val) => addToFavorites(val ?? inputValue)}
        suggestions={filteredSuggestions}
        placeholder="Hinzufügen..."
        buttonColor="orange"
        showFavoritesButton
      />

      {value.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Ausgewählt:
          </h4>
          <div className="flex flex-wrap gap-2">
            {value.map((task, index) => (
              <div key={`${task}-${index}`} className="tag">
                {editIndex === index ? (
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
                ) : (
                  <span className="mr-1">{task}</span>
                )}
                {editIndex !== index && (
                  <>
                    <button
                      onClick={() => toggleFavorite(task)}
                      className="tag-icon-button"
                      aria-label="Favorit"
                    >
                      <Star
                        className={`tag-icon ${favorites.includes(task) ? "fill-current" : ""}`}
                      />
                    </button>
                    <button
                      onClick={() => startEdit(index)}
                      className="tag-icon-button"
                      aria-label="Bearbeiten"
                    >
                      <Pencil className="tag-icon" />
                    </button>
                  </>
                )}
                <button
                  onClick={() => removeTask(task)}
                  className="tag-icon-button"
                  aria-label="Entfernen"
                >
                  <X className="tag-icon" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {filteredSuggestions.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Vorschläge:
          </h4>
          <div className="flex flex-wrap gap-2">
            {filteredSuggestions.map((s) => (
              <div key={s} className="flex items-center space-x-1">
                <button
                  onClick={() => addTask(s)}
                  className="tag bg-white text-gray-700 border hover:bg-gray-100"
                  style={{ borderColor: "#F29400" }}
                >
                  {s}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(s);
                  }}
                  className="tag-icon-button"
                  aria-label="Zu Favoriten"
                >
                  <Star
                    className={`tag-icon ${favorites.includes(s) ? "fill-current" : ""}`}
                    style={{
                      color: favorites.includes(s) ? "#F29400" : undefined,
                    }}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {favorites.filter((f) => !value.includes(f)).length > 0 && (
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Star className="h-4 w-4" style={{ color: "#F29400" }} />
            <h4 className="text-sm font-medium text-gray-700">Favoriten:</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {favorites
              .filter((item) => !value.includes(item))
              .map((item) => (
                <button
                  key={item}
                  onClick={() => addTask(item)}
                  className="tag bg-white text-gray-700 border hover:bg-gray-100"
                  style={{ borderColor: "#F29400" }}
                >
                  <span className="mr-2">{item}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(item);
                    }}
                    className="tag-icon-button"
                    aria-label="Aus Favoriten entfernen"
                    title="Aus Favoriten entfernen"
                  >
                    <Star className="tag-icon fill-current" />
                  </button>
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
