import React from 'react';
import { Briefcase } from 'lucide-react';
import InputSection from './InputSection';

interface JobInputProps {
  jobContent: string;
  onJobContentChange: (content: string) => void;
  profileConfig: {
    berufe: string[];
    taetigkeiten: string[];
    skills: string[];
    softskills: string[];
    ausbildung: string[];
  };
}

export default function JobInput({
  jobContent,
  onJobContentChange,
  profileConfig,
}: JobInputProps) {
  return (
    <InputSection
      title="Stellenanzeige"
      icon={<Briefcase className="h-6 w-6 text-orange-600" />}
      onContentChange={onJobContentChange}
      placeholder="Fügen Sie hier die Stellenanzeige ein, einschließlich Anforderungen, Aufgaben und Unternehmensinfos..."
      showUrlInput={true}
      profileConfig={profileConfig}
    />
  );
}