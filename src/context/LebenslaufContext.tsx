import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  CVSuggestionConfig,
  loadCVSuggestions,
  ProfileSourceMapping,
} from '../services/supabaseService';

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
  addExperience: (data: Omit<Berufserfahrung, 'id'>) => Promise<void>;
  updateExperience: (id: string, data: Omit<Berufserfahrung, 'id'>) => Promise<void>;
  selectExperience: (id: string | null) => void;
  favoritePositions: string[];
  favoriteTasks: string[];
  favoriteCompanies: string[];
  toggleFavoritePosition: (pos: string) => void;
  toggleFavoriteTask: (task: string) => void;
  toggleFavoriteCompany: (company: string) => void;
  cvSuggestions: CVSuggestionConfig;
}

const LebenslaufContext = createContext<LebenslaufContextType | undefined>(undefined);

export function LebenslaufProvider({
  children,
  profileSourceMappings = [],
}: {
  children: ReactNode;
  profileSourceMappings?: ProfileSourceMapping[];
}) {
  const LOCAL_KEY = 'berufserfahrungen';

  const [berufserfahrungen, setBerufserfahrungen] = useState<Berufserfahrung[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_KEY);
      return saved ? (JSON.parse(saved) as Berufserfahrung[]) : [];
    } catch (err) {
      console.error('Failed to load experiences from localStorage:', err);
      return [];
    }
  });
  const [selectedExperienceId, setSelectedExperienceId] = useState<string | null>(null);
  const [isEditingExperience, setIsEditingExperience] = useState(false);
  const [favoritePositions, setFavoritePositions] = useState<string[]>([]);
  const [favoriteTasks, setFavoriteTasks] = useState<string[]>([]);
  const [favoriteCompanies, setFavoriteCompanies] = useState<string[]>([]);
  const [cvSuggestions, setCvSuggestions] = useState<CVSuggestionConfig>({
    companies: [],
    positions: [],
    aufgabenbereiche: [],
  });

  useEffect(() => {
    if (profileSourceMappings?.length > 0) {
      loadCVSuggestions(profileSourceMappings).then(setCvSuggestions);
    }
  }, [profileSourceMappings]);


  const addExperience = async (data: Omit<Berufserfahrung, 'id'>) => {
    const newExp = { ...data, id: uuidv4() };
    setBerufserfahrungen(prev => {
      const updated = [...prev, newExp];
      localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
      return updated;
    });
    // Persisting to Supabase removed
    setIsEditingExperience(false);
  };

  const updateExperience = async (id: string, data: Omit<Berufserfahrung, 'id'>) => {
    const updatedExp = { ...data, id };
    setBerufserfahrungen(prev => {
      const updated = prev.map(exp => (exp.id === id ? updatedExp : exp));
      localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
      return updated;
    });
    // Persisting to Supabase removed
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
        cvSuggestions,
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
