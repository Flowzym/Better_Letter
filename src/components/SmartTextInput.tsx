import type { ChangeEvent, CSSProperties, KeyboardEvent } from "react";

interface SmartTextInputProps {
  value: string;
  onChange: (val: string) => void;
  onAdd: (val: string) => void;
  onAddFavorite: (val: string) => void;
  placeholder?: string;
}

export default function SmartTextInput({
  value,
  onChange,
  onAdd,
  onAddFavorite,
  placeholder = "",
}: SmartTextInputProps) {
  const hasInput = value.trim().length > 0;

  const handleAdd = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    onChange("");
  };

  const handleAddFavorite = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onAddFavorite(trimmed);
    onChange("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="relative flex items-center">
      <input
        type="text"
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          onChange(e.target.value)
        }
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full px-3 py-2 pr-16 border rounded-md focus:outline-none focus:ring-2"
        style={
          {
            borderColor: "#F29400",
            "--tw-ring-color": "#F29400",
          } as CSSProperties
        }
      />
      <div
        className={`absolute right-2 flex gap-1 transition-opacity -translate-y-1/2 ${
          hasInput ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        style={{ top: "50%" }}
      >
        <button
          type="button"
          onClick={handleAdd}
          className="w-7 h-7 flex items-center justify-center rounded-md text-white"
          style={{ backgroundColor: "#F6A800" }}
        >
          <span className="leading-none">+</span>
        </button>
        <button
          type="button"
          onClick={handleAddFavorite}
          className="w-7 h-7 flex items-center justify-center rounded-md text-white"
          style={{ backgroundColor: "#F6A800" }}
        >
          <span className="leading-none">★</span>
        </button>
      </div>
    </div>
  );
}
