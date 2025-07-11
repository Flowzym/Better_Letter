import React, { createContext, useContext, useState, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface Berufserfahrung {
  id: string;
  companies: string[];
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
  isEditingExperience: boolean;
  addExperience: (data: Omit<Berufserfahrung, 'id'>) => void;
  updateExperience: (id: string, data: Omit<Berufserfahrung, 'id'>) => void;
  selectExperience: (id: string | null) => void;
  favoritePositions: string[];
  favoriteTasks: string[];
  favoriteCompanies: string[];
  toggleFavoritePosition: (pos: string) => void;
  toggleFavoriteTask: (task: string) => void;
  toggleFavoriteCompany: (company: string) => void;
}

const LebenslaufContext = createContext<LebenslaufContextType | undefined>(undefined);

export function LebenslaufProvider({ children }: { children: ReactNode }) {
  const [berufserfahrungen, setBerufserfahrungen] = useState<Berufserfahrung[]>([]);
  const [selectedExperienceId, setSelectedExperienceId] = useState<string | null>(null);
  const [isEditingExperience, setIsEditingExperience] = useState(false);
  const [favoritePositions, setFavoritePositions] = useState<string[]>([]);
  const [favoriteTasks, setFavoriteTasks] = useState<string[]>([]);
  const [favoriteCompanies, setFavoriteCompanies] = useState<string[]>([]);

  const addExperience = (data: Omit<Berufserfahrung, 'id'>) => {
    setBerufserfahrungen(prev => [...prev, { ...data, id: uuidv4() }]);
    setIsEditingExperience(false);
  };

  const updateExperience = (id: string, data: Omit<Berufserfahrung, 'id'>) => {
    setBerufserfahrungen(prev =>
      prev.map(exp => (exp.id === id ? { ...data, id } : exp))
    );
    setIsEditingExperience(false);
  };

  const selectExperience = (id: string | null) => {
    setSelectedExperienceId(id);
    setIsEditingExperience(id !== null);
  };

  const toggleFavoritePosition = (pos: string) => {
    setFavoritePositions(prev =>
      prev.includes(pos) ? prev.filter(p => p !== pos) : [...prev, pos]
    );
  };

  const toggleFavoriteCompany = (company: string) => {
    setFavoriteCompanies(prev =>
      prev.includes(company) ? prev.filter(c => c !== company) : [...prev, company]
    );
  };

  const toggleFavoriteTask = (task: string) => {
    setFavoriteTasks(prev =>
      prev.includes(task) ? prev.filter(t => t !== task) : [...prev, task]
    );
  };

  return (
    <LebenslaufContext.Provider
      value={{
        berufserfahrungen,
        selectedExperienceId,
        isEditingExperience,
        addExperience,
        updateExperience,
        selectExperience,
        favoritePositions,
        favoriteTasks,
        favoriteCompanies,
        toggleFavoritePosition,
        toggleFavoriteTask,
        toggleFavoriteCompany,
      }}
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
