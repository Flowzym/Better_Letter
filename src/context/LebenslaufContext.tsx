import React, { createContext, useContext, useState, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface Berufserfahrung {
  id: string;
  firma: string;
  position: string[];
  startMonth: string | null;
  startYear: string;
  endMonth: string | null;
  endYear: string | null;
  isCurrent: boolean;
  aufgabenbereiche: string[];
}

interface LebenslaufContextType {
  berufserfahrungen: Berufserfahrung[];
  selectedExperienceId: string | null;
  addExperience: (data: Omit<Berufserfahrung, 'id'>) => void;
  updateExperience: (id: string, data: Omit<Berufserfahrung, 'id'>) => void;
  selectExperience: (id: string | null) => void;
}

const LebenslaufContext = createContext<LebenslaufContextType | undefined>(undefined);

export function LebenslaufProvider({ children }: { children: ReactNode }) {
  const [berufserfahrungen, setBerufserfahrungen] = useState<Berufserfahrung[]>([]);
  const [selectedExperienceId, setSelectedExperienceId] = useState<string | null>(null);

  const addExperience = (data: Omit<Berufserfahrung, 'id'>) => {
    setBerufserfahrungen(prev => [...prev, { ...data, id: uuidv4() }]);
  };

  const updateExperience = (id: string, data: Omit<Berufserfahrung, 'id'>) => {
    setBerufserfahrungen(prev =>
      prev.map(exp => (exp.id === id ? { ...data, id } : exp))
    );
  };

  const selectExperience = (id: string | null) => {
    setSelectedExperienceId(id);
  };

  return (
    <LebenslaufContext.Provider
      value={{ berufserfahrungen, selectedExperienceId, addExperience, updateExperience, selectExperience }}
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
