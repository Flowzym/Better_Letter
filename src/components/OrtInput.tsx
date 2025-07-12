import TagSelectorWithFavorites from './TagSelectorWithFavorites';

interface OrtInputProps {
  value: string[];
  onChange: (val: string[]) => void;
  suggestions?: string[];
}

export default function OrtInput({ value, onChange, suggestions = [] }: OrtInputProps) {
  return (
    <TagSelectorWithFavorites
      label="Ort"
      value={value}
      onChange={onChange}
      allowCustom={true}
      suggestions={suggestions}
    />
  );
}
