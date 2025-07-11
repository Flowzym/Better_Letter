import { useState } from 'react';
import TagButton from '../components/TagButton';
import TagButtonFavorite from '../components/ui/TagButtonFavorite';
import TagButtonSelected from '../components/ui/TagButtonSelected';
import MonthYearInput from '../components/MonthYearInput';
import MonthYearPicker from '../components/MonthYearPicker';
import TagContext from '../types/TagContext';

export default function DebugPreview() {
  const [pickerValue, setPickerValue] = useState('');
  const [inputValue, setInputValue] = useState('');

  return (
    <div className="p-4 space-y-6">
      <h2 className="font-bold">TagButton Varianten</h2>
      <div className="flex gap-2 flex-wrap">
        <TagButtonSelected label="Selected" isFavorite onRemove={() => {}} />
        <TagButtonFavorite label="Favorite" onRemove={() => {}} />
        <TagButton label="Suggestion" variant={TagContext.Suggestion} isFavorite />
      </div>

      <h2 className="font-bold">MonthYearPicker</h2>
      <MonthYearPicker value={pickerValue} onChange={setPickerValue} />

      <h2 className="font-bold">MonthYearInput</h2>
      <MonthYearInput value={inputValue} onChange={setInputValue} />
    </div>
  );
}
