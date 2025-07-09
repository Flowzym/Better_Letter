import React from 'react';
import { Briefcase, Sparkles, AlertTriangle } from 'lucide-react';
import InputSection from './InputSection';
import StyleSelector from './StyleSelector';
import CoverLetterDisplay from './CoverLetterDisplay';
import { ProfileConfig, ProfileSourceMapping, DatabaseStats, isSupabaseConfigured } from '../services/supabaseService';

interface JobInputAndPreviewProps {
  className?: string;
  jobContent: string;
  onJobContentChange: (content: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  cvContent: string;
  coverLetter: string;
  isEditing: boolean;
  onEdit: (instruction: string) => void;
  onContentChange: (content: string) => void;
  editPrompts: {
    [key: string]: { label: string; prompt: string };
  };
  selectedStyles: string[];
  onStylesChange: (styles: string[]) => void;
  stylePrompts: {
    [key: string]: { label: string; prompt: string };
  };
  error: string;
  profileConfig: ProfileConfig;
  profileSourceMappings: ProfileSourceMapping[];
  databaseStats: DatabaseStats | null;
}

export default function JobInputAndPreview({
  className = '',
  jobContent,
  onJobContentChange,
  onGenerate,
  isGenerating,
  cvContent,
  coverLetter,
  isEditing,
  onEdit,
  onContentChange,
  editPrompts,
  selectedStyles,
  onStylesChange,
  stylePrompts,
  error,
  profileConfig,
  profileSourceMappings,
  databaseStats,
}: JobInputAndPreviewProps) {
  return (
    <div className={className}>
      <InputSection
        title="Stellenanzeige"
        icon={<Briefcase className="h-6 w-6 text-orange-600" />}
        onContentChange={onJobContentChange}
        placeholder="F\u00fcgen Sie hier die Stellenanzeige ein, einschlie\u00dflich Anforderungen, Aufgaben und Unternehmensinfos..."
        showUrlInput={true}
        profileConfig={profileConfig}
      />

      <StyleSelector
        selectedStyles={selectedStyles}
        onStylesChange={onStylesChange}
        stylePrompts={stylePrompts}
      />

      <div className="flex justify-center mb-8">
        <button
          onClick={onGenerate}
          disabled={isGenerating || !cvContent.trim() || !jobContent.trim()}
          className="flex items-center space-x-3 px-8 py-4 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200 shadow-lg"
          style={{ backgroundColor: '#F29400' }}
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span className="text-lg">Wird generiert...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              <span className="text-lg">Bewerbungsschreiben generieren</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-red-700">
            <AlertTriangle className="h-5 w-5 flex-shrink-0" />
            <p className="font-medium">{error}</p>
          </div>
        </div>
      )}

      <CoverLetterDisplay
        content={coverLetter}
        isLoading={isGenerating}
        isEditing={isEditing}
        onEdit={onEdit}
        onContentChange={onContentChange}
        editPrompts={editPrompts}
      />

      <div className="mt-12 text-center">
        <p className="text-gray-500">
          Powered by Mistral AI \u2022 Quill Editor
          {isSupabaseConfigured() && (
            <span className="ml-2">\u2022 Profil-Daten von Supabase</span>
          )}
          {profileSourceMappings.length > 0 && (
            <span className="ml-2">\u2022 {profileSourceMappings.filter(m => m.isActive).length} aktive Datenquellen</span>
          )}
          {databaseStats && databaseStats.totalFromMappings > 0 && (
            <span className="ml-2">\u2022 {databaseStats.totalFromMappings.toLocaleString('de-DE')} Mapping-Eintr\u00e4ge</span>
          )}
        </p>
      </div>
    </div>
  );
}
