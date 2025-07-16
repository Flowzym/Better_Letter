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

export interface AusbildungEntry {
  id: string;
  institution: string[];
  ausbildungsart: string[];
  abschluss: string[];
  startMonth: string | null;
  startYear: string;
  endMonth: string | null;
  endYear: string | null;
  isCurrent: boolean;
  zusatzangaben: string;
}

export type AusbildungEntryForm = Omit<AusbildungEntry, 'id'>;

export interface FachkompetenzEntry {
  id: string;
  kategorie: string;
  kompetenzen: string[];
  level?: string;
}

export interface SoftskillEntry {
  id: string;
  text: string;
  bisTags: string[];
}

interface LebenslaufContextType {
  berufserfahrungen: Berufserfahrung[];
  ausbildungen: AusbildungEntry[];
  fachkompetenzen: FachkompetenzEntry[];
  softskills: SoftskillEntry[];
  selectedExperienceId: string | null;
  isEditingExperience: boolean;
  addExperience: (data: Omit<Berufserfahrung, 'id'>) => Promise<void>;
  updateExperience: (id: string, data: Omit<Berufserfahrung, 'id'>) => Promise<void>;
  deleteExperience: (id: string) => Promise<void>;
  selectExperience: (id: string | null) => void;
  selectedEducationId: string | null;
  isEditingEducation: boolean;
  addEducation: (data: AusbildungEntryForm) => Promise<void>;
  updateEducation: (id: string, data: AusbildungEntryForm) => Promise<void>;
  deleteEducation: (id: string) => Promise<void>;
  selectEducation: (id: string | null) => void;
  addSkill: (data: Omit<FachkompetenzEntry, 'id'>) => Promise<void>;
  updateSkill: (id: string, data: Omit<FachkompetenzEntry, 'id'>) => Promise<void>;
  deleteSkill: (id: string) => Promise<void>;
  addSoftskill: (data: Omit<SoftskillEntry, 'id'>) => Promise<void>;
  updateSoftskill: (id: string, data: Omit<SoftskillEntry, 'id'>) => Promise<void>;
  deleteSoftskill: (id: string) => Promise<void>;
  favoritePositions: string[];
  favoriteTasks: string[];
  favoriteCompanies: string[];
  toggleFavoritePosition: (pos: string) => void;
  toggleFavoriteTask: (task: string) => void;
  toggleFavoriteCompany: (company: string) => void;
  favoriteInstitutions: string[];
  favoriteAusbildungsarten: string[];
  favoriteAbschluesse: string[];
  toggleFavoriteInstitution: (institution: string) => void;
  toggleFavoriteAusbildungsart: (art: string) => void;
  toggleFavoriteAbschluss: (abschluss: string) => void;
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
  const LOCAL_EDU_KEY = 'ausbildungen';
  const LOCAL_SKILL_KEY = 'fachkompetenzen';
  const LOCAL_SOFT_KEY = 'softskills';

  const [berufserfahrungen, setBerufserfahrungen] = useState<Berufserfahrung[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_KEY);
      return saved ? (JSON.parse(saved) as Berufserfahrung[]) : [];
    } catch (err) {
      console.error('Failed to load experiences from localStorage:', err);
      return [];
    }
  });

  const [ausbildungen, setAusbildungen] = useState<AusbildungEntry[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_EDU_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as AusbildungEntry[];
        // Ensure all institution fields are arrays
        return parsed.map(entry => ({
          ...entry,
          institution: Array.isArray(entry.institution) 
            ? entry.institution 
            : typeof entry.institution === 'string' 
              ? [entry.institution] 
              : [],
          ausbildungsart: Array.isArray(entry.ausbildungsart) 
            ? entry.ausbildungsart 
            : typeof entry.ausbildungsart === 'string' 
              ? [entry.ausbildungsart] 
              : [],
          abschluss: Array.isArray(entry.abschluss) 
            ? entry.abschluss 
            : typeof entry.abschluss === 'string' 
              ? [entry.abschluss] 
              : []
        }));
      }
      return [];
    } catch (err) {
      console.error('Failed to load educations from localStorage:', err);
      return [];
    }
  });

  const [fachkompetenzen, setFachkompetenzen] = useState<FachkompetenzEntry[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_SKILL_KEY);
      return saved ? (JSON.parse(saved) as FachkompetenzEntry[]) : [];
    } catch (err) {
      console.error('Failed to load skills from localStorage:', err);
      return [];
    }
  });

  const [softskills, setSoftskills] = useState<SoftskillEntry[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_SOFT_KEY);
      return saved ? (JSON.parse(saved) as SoftskillEntry[]) : [];
    } catch (err) {
      console.error('Failed to load softskills from localStorage:', err);
      return [];
    }
  });
  const [selectedExperienceId, setSelectedExperienceId] = useState<string | null>(null);
  const [isEditingExperience, setIsEditingExperience] = useState(false);
  const [selectedEducationId, setSelectedEducationId] = useState<string | null>(null);
  const [isEditingEducation, setIsEditingEducation] = useState(false);
  const [favoritePositions, setFavoritePositions] = useState<string[]>([]);
  const [favoriteInstitutions, setFavoriteInstitutions] = useState<string[]>([]);
  const [favoriteAusbildungsarten, setFavoriteAusbildungsarten] = useState<string[]>([]);
  const [favoriteAbschluesse, setFavoriteAbschluesse] = useState<string[]>([]);
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

  const deleteExperience = async (id: string) => {
    setBerufserfahrungen(prev => {
      const updated = prev.filter(exp => exp.id !== id);
      localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
      return updated;
    });
    setSelectedExperienceId(null);
    setIsEditingExperience(false);
  };

  const addEducation = async (data: AusbildungEntryForm) => {
    const newEntry: AusbildungEntry = { ...data, id: uuidv4() };
    setAusbildungen(prev => {
      const updated = [...prev, newEntry];
      localStorage.setItem(LOCAL_EDU_KEY, JSON.stringify(updated));
      return updated;
    });
    setIsEditingEducation(false);
  };

  const updateEducation = async (id: string, data: AusbildungEntryForm) => {
    const updatedEntry: AusbildungEntry = { ...data, id };
    setAusbildungen(prev => {
      const updated = prev.map(e => (e.id === id ? updatedEntry : e));
      localStorage.setItem(LOCAL_EDU_KEY, JSON.stringify(updated));
      return updated;
    });
    setIsEditingEducation(false);
  };

  const deleteEducation = async (id: string) => {
    setAusbildungen(prev => {
      const updated = prev.filter(e => e.id !== id);
      localStorage.setItem(LOCAL_EDU_KEY, JSON.stringify(updated));
      return updated;
    });
    setSelectedEducationId(null);
    setIsEditingEducation(false);
  };

  const addSkill = async (data: Omit<FachkompetenzEntry, 'id'>) => {
    const newEntry = { ...data, id: uuidv4() };
    setFachkompetenzen(prev => {
      const updated = [...prev, newEntry];
      localStorage.setItem(LOCAL_SKILL_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const updateSkill = async (id: string, data: Omit<FachkompetenzEntry, 'id'>) => {
    const updatedEntry = { ...data, id };
    setFachkompetenzen(prev => {
      const updated = prev.map(s => (s.id === id ? updatedEntry : s));
      localStorage.setItem(LOCAL_SKILL_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const deleteSkill = async (id: string) => {
    setFachkompetenzen(prev => {
      const updated = prev.filter(s => s.id !== id);
      localStorage.setItem(LOCAL_SKILL_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const addSoftskill = async (data: Omit<SoftskillEntry, 'id'>) => {
    const newEntry = { ...data, id: uuidv4() };
    setSoftskills(prev => {
      const updated = [...prev, newEntry];
      localStorage.setItem(LOCAL_SOFT_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const updateSoftskill = async (id: string, data: Omit<SoftskillEntry, 'id'>) => {
    const updatedEntry = { ...data, id };
    setSoftskills(prev => {
      const updated = prev.map(s => (s.id === id ? updatedEntry : s));
      localStorage.setItem(LOCAL_SOFT_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const deleteSoftskill = async (id: string) => {
    setSoftskills(prev => {
      const updated = prev.filter(s => s.id !== id);
      localStorage.setItem(LOCAL_SOFT_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const selectExperience = (id: string | null) => {
    setSelectedExperienceId(id);
    setIsEditingExperience(id !== null);
  };

  const selectEducation = (id: string | null) => {
    setSelectedEducationId(id);
    setIsEditingEducation(id !== null);
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

  const toggleFavoriteInstitution = (institution: string) => {
    setFavoriteInstitutions(prev =>
      prev.includes(institution) ? prev.filter(i => i !== institution) : [...prev, institution]
    );
  };

  const toggleFavoriteAusbildungsart = (art: string) => {
    setFavoriteAusbildungsarten(prev =>
      prev.includes(art) ? prev.filter(a => a !== art) : [...prev, art]
    );
  };

  const toggleFavoriteAbschluss = (abschluss: string) => {
    setFavoriteAbschluesse(prev =>
      prev.includes(abschluss) ? prev.filter(a => a !== abschluss) : [...prev, abschluss]
    );
  };

  return (
    <LebenslaufContext.Provider
      value={{
        berufserfahrungen,
        ausbildungen,
        fachkompetenzen,
        softskills,
        selectedExperienceId,
        isEditingExperience,
        selectedEducationId,
        isEditingEducation,
        addExperience,
        updateExperience,
        deleteExperience,
        selectExperience,
        addEducation,
        updateEducation,
        deleteEducation,
        selectEducation,
        addEducation,
        updateEducation,
        deleteEducation,
        addSkill,
        updateSkill,
        deleteSkill,
        addSoftskill,
        updateSoftskill,
        deleteSoftskill,
        favoritePositions,
        favoriteTasks,
        favoriteCompanies,
        favoriteInstitutions,
        favoriteAusbildungsarten,
        favoriteAbschluesse,
        toggleFavoriteInstitution,
        toggleFavoriteAusbildungsart,
        toggleFavoriteAbschluss,
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
