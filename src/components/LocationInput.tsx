import TagSelectorWithFavorites from './TagSelectorWithFavorites';

interface LocationInputProps {
  label: string;
  value: string[];
  onChange: (val: string[]) => void;
  suggestions?: string[];
}

export default function LocationInput({ label, value, onChange, suggestions = [] }: LocationInputProps) {
  return (
    <TagSelectorWithFavorites
      label={label}
      value={value}
      onChange={onChange}
      allowCustom={true}
      suggestions={suggestions}
    />
  );
}
