import React from 'react';
import Card from './Card';
import TextInput from '../TextInput';
import TagSelectorWithFavorites from '../TagSelectorWithFavorites';

interface SoftskillData {
  text: string;
  bisTags: string[];
}

interface SoftskillCardProps {
  data: SoftskillData;
  onChange: (data: SoftskillData) => void;
}

export default function SoftskillCard({ data, onChange }: SoftskillCardProps) {
  return (
    <Card title="Persönliche Kompetenz">
      <TextInput
        label="Beschreibung"
        value={data.text}
        onChange={(v) => onChange({ ...data, text: v })}
        placeholder="Beschreibung"
        rows={4}
      />
      <TagSelectorWithFavorites
        label="BIS-Zuordnung"
        value={data.bisTags}
        onChange={(tags) => onChange({ ...data, bisTags: tags })}
        allowCustom
      />
    </Card>
  );
}
