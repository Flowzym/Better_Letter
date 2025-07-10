import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Berufserfahrung {
  firma: string;
  position: string;
  startMonth: string | null;
  startYear: string;
  endMonth: string | null;
  endYear: string | null;
  isCurrent: boolean;
  aufgabenbeschreibung: string;
}

interface LebenslaufContextType {
  berufserfahrungen: Berufserfahrung[];
  selectedExperienceIndex: number | null;
  addExperience: (data: Berufserfahrung) => void;
  updateExperience: (index: number, data: Berufserfahrung) => void;
  selectExperience: (index: number | null) => void;
}

const LebenslaufContext = createContext<LebenslaufContextType | undefined>(undefined);

export function LebenslaufProvider({ children }: { children: ReactNode }) {
  const [berufserfahrungen, setBerufserfahrungen] = useState<Berufserfahrung[]>([]);
  const [selectedExperienceIndex, setSelectedExperienceIndex] = useState<number | null>(null);

  const addExperience = (data: Berufserfahrung) => {
    setBerufserfahrungen(prev => [...prev, data]);
  };

  const updateExperience = (index: number, data: Berufserfahrung) => {
    setBerufserfahrungen(prev => prev.map((exp, i) => (i === index ? data : exp)));
  };

  const selectExperience = (index: number | null) => {
    setSelectedExperienceIndex(index);
  };

  return (
    <LebenslaufContext.Provider
      value={{ berufserfahrungen, selectedExperienceIndex, addExperience, updateExperience, selectExperience }}
    >
      {children}
    </LebenslaufContext.Provider>
  );
}

export function useLebenslaufContext() {
  const context = useContext(LebenslaufContext);
  if (!context) {
    throw new Error('useLebenslaufContext must be used within LebenslaufProvider');
  }
  return context;
}
