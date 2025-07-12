import React from 'react';
import Card from './Card';
import TextInput from '../TextInput';
import MonthYearInputBase from '../MonthYearInputBase';

interface AusbildungData {
  institution: string;
  abschluss: string;
  start: string;
  ende: string;
  beschreibung: string;
}

interface AusbildungCardProps {
  data: AusbildungData;
  onChange: (data: AusbildungData) => void;
  onDelete?: () => void;
}

export default function AusbildungCard({ data, onChange }: AusbildungCardProps) {
  return (
    <Card title="Ausbildung / Qualifikation">
      <TextInput
        label="Institution"
        value={data.institution}
        onChange={(v) => onChange({ ...data, institution: v })}
        placeholder="Institution"
        rows={2}
      />
      <TextInput
        label="Abschluss"
        value={data.abschluss}
        onChange={(v) => onChange({ ...data, abschluss: v })}
        placeholder="Abschluss"
        rows={2}
      />
      <div className="flex space-x-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start</label>
          <MonthYearInputBase
            value={data.start}
            onChange={(v) => onChange({ ...data, start: v })}
            className="w-28"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ende</label>
          <MonthYearInputBase
            value={data.ende}
            onChange={(v) => onChange({ ...data, ende: v })}
            className="w-28"
          />
        </div>
      </div>
      <TextInput
        label="Beschreibung"
        value={data.beschreibung}
        onChange={(v) => onChange({ ...data, beschreibung: v })}
        placeholder="Beschreibung"
        rows={4}
      />
    </Card>
  );
}
