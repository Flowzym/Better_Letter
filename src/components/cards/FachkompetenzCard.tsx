import React from 'react';
import Card from './Card';
import Dropdown from '../Dropdown';
import TagSelectorWithFavorites from '../TagSelectorWithFavorites';

const KATEGORIEN = ['Programmiersprachen', 'Frameworks', 'Tools'];

interface FachkompetenzData {
  kategorie: string;
  kompetenzen: string[];
  level?: string;
}

interface FachkompetenzCardProps {
  data: FachkompetenzData;
  onChange: (data: FachkompetenzData) => void;
}

export default function FachkompetenzCard({ data, onChange }: FachkompetenzCardProps) {
  return (
    <Card title="Fachliche Kompetenz">
      <Dropdown
        label="Kategorie"
        options={KATEGORIEN}
        value={data.kategorie}
        onChange={(v) => onChange({ ...data, kategorie: v })}
      />
      <TagSelectorWithFavorites
        label="Kompetenz"
        value={data.kompetenzen}
        onChange={(tags) => onChange({ ...data, kompetenzen: tags })}
        allowCustom
      />
      <Dropdown
        label="Level"
        options={['Anfänger', 'Fortgeschritten', 'Experte']}
        value={data.level ?? ''}
        onChange={(v) => onChange({ ...data, level: v })}
      />
    </Card>
  );
}
