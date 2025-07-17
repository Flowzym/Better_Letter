import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types
export interface PersonalData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  birthDate: string;
  nationality: string;
  maritalStatus: string;
}

export interface Berufserfahrung {
  id: string;
  companyName: string;
  companyCity: string;
  companyCountry: string;
  position: string[];
  startMonth: string | null;
  startYear: string;
  endMonth: string | null;
  endYear: string | null;
  isCurrent: boolean;
  aufgabenbereiche: string[];
}

export interface Ausbildung {
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

export interface CVSuggestions {
  positions: string[];
  companies: string[];
  tasks: string[];
  skills: string[];
  softSkills: string[];
  degrees: string[];
  institutions: string[];
}

export type TabType = 'personal' | 'experience' | 'education' | 'skills' | 'softskills';

export interface LebenslaufContextType {
  personalData: PersonalData;
  berufserfahrung: Berufserfahrung[];
  ausbildung: Ausbildung[];
  skills: string[];
  softSkills: string[];
  cvSuggestions: CVSuggestions;
  favoritePositions: string[];
  favoriteCompanies: string[];
  favoriteCities: string[];
  favoriteTasks: string[];
  favoriteSkills: string[];
  favoriteSoftSkills: string[];
  favoriteDegrees: string[];
  favoriteInstitutions: string[];
  favoriteAusbildungsarten: string[];
  favoriteAbschluesse: string[];
  selectedExperienceId: string | null;
  selectedEducationId: string | null;
  activeTab: TabType;
  updatePersonalData: (data: Partial<PersonalData>) => void;
  addExperience: (data: Partial<Berufserfahrung>) => void;
  updateExperience: (id: string, data: Partial<Berufserfahrung>) => void;
  deleteExperience: (id: string) => void;
  addEducation: (data: Partial<Ausbildung>) => void;
  updateEducation: (id: string, data: Partial<Ausbildung>) => void;
  deleteEducation: (id: string) => void;
  updateSkills: (skills: string[]) => void;
  updateSoftSkills: (softSkills: string[]) => void;
  toggleFavoritePosition: (position: string) => void;
  toggleFavoriteCompany: (company: string) => void;
  toggleFavoriteCity: (city: string) => void;
  toggleFavoriteTask: (task: string) => void;
  toggleFavoriteSkill: (skill: string) => void;
  toggleFavoriteSoftSkill: (softSkill: string) => void;
  toggleFavoriteDegree: (degree: string) => void;
  toggleFavoriteInstitution: (institution: string) => void;
  toggleFavoriteAusbildungsart: (ausbildungsart: string) => void;
  toggleFavoriteAbschluss: (abschluss: string) => void;
  selectExperience: (id: string) => void;
  selectEducation: (id: string) => void;
  setActiveTab: (tab: TabType) => void;
  updateExperienceField: (id: string, field: keyof Berufserfahrung, value: any) => void;
  updateEducationField: (id: string, field: keyof Ausbildung, value: any) => void;
  updateExperienceTask: (expId: string, taskIndex: number, newTask: string) => void;
  updateExperienceTasksOrder: (expId: string, newTasks: string[]) => void;
  addExperienceTask: (expId: string, task: string) => void;
}

const LebenslaufContext = createContext<LebenslaufContextType | undefined>(undefined);

const initialPersonalData: PersonalData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  postalCode: '',
  country: '',
  birthDate: '',
  nationality: '',
  maritalStatus: ''
};

const initialCVSuggestions: CVSuggestions = {
  positions: [],
  companies: [], // This is still needed for cvSuggestions.companies
  tasks: [],
  skills: [],
  softSkills: [],
  degrees: [],
  institutions: []
};

interface LebenslaufProviderProps {
  children: ReactNode;
  profileSourceMappings?: any; // Add the missing prop
}

export const LebenslaufProvider: React.FC<LebenslaufProviderProps> = ({ 
  children, 
  profileSourceMappings 
}) => {
  const [personalData, setPersonalData] = useState<PersonalData>(initialPersonalData);
  const [berufserfahrung, setBerufserfahrung] = useState<Berufserfahrung[]>([]);
  const [ausbildung, setAusbildung] = useState<Ausbildung[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [softSkills, setSoftSkills] = useState<string[]>([]);
  const [cvSuggestions, setCvSuggestions] = useState<CVSuggestions>(initialCVSuggestions);
  
  const [selectedExperienceId, setSelectedExperienceId] = useState<string | null>(null);
  const [selectedEducationId, setSelectedEducationId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('personal');
  
  // Favorites
  const [favoritePositions, setFavoritePositions] = useState<string[]>([]);
  const [favoriteCompanies, setFavoriteCompanies] = useState<string[]>([]);
  const [favoriteCities, setFavoriteCities] = useState<string[]>([]);
  const [favoriteTasks, setFavoriteTasks] = useState<string[]>([]);
  const [favoriteSkills, setFavoriteSkills] = useState<string[]>([]);
  const [favoriteSoftSkills, setFavoriteSoftSkills] = useState<string[]>([]);
  const [favoriteDegrees, setFavoriteDegrees] = useState<string[]>([]);
  const [favoriteInstitutions, setFavoriteInstitutions] = useState<string[]>([]);
  const [favoriteAusbildungsarten, setFavoriteAusbildungsarten] = useState<string[]>([]);
  const [favoriteAbschluesse, setFavoriteAbschluesse] = useState<string[]>([]);

  // Load cvSuggestions using profileSourceMappings
  useEffect(() => {
    const loadCvSuggestions = async () => {
      if (profileSourceMappings) {
        try {
          // Import supabaseService dynamically to avoid circular dependencies
          const { loadCVSuggestions } = await import('../services/supabaseService');
          const suggestions = await loadCVSuggestions(profileSourceMappings);
          setCvSuggestions(suggestions);
        } catch (error) {
          console.error('Error loading CV suggestions:', error);
          // Keep default suggestions if loading fails
        }
      }
    };

    loadCvSuggestions();
  }, [profileSourceMappings]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedPersonalData = localStorage.getItem('personalData');
    const savedBerufserfahrung = localStorage.getItem('berufserfahrung');
    const savedAusbildung = localStorage.getItem('ausbildung');
    const savedSkills = localStorage.getItem('skills');
    const savedSoftSkills = localStorage.getItem('softSkills');
    const savedCvSuggestions = localStorage.getItem('cvSuggestions');
    const savedSelectedExperienceId = localStorage.getItem('selectedExperienceId');
    const savedActiveTab = localStorage.getItem('activeTab');
    const savedFavoritePositions = localStorage.getItem('favoritePositions');
    const savedFavoriteCompanies = localStorage.getItem('favoriteCompanies');
    const savedFavoriteCities = localStorage.getItem('favoriteCities');
    const savedFavoriteTasks = localStorage.getItem('favoriteTasks');
    const savedFavoriteSkills = localStorage.getItem('favoriteSkills');
    const savedFavoriteSoftSkills = localStorage.getItem('favoriteSoftSkills');
    const savedFavoriteDegrees = localStorage.getItem('favoriteDegrees');
    const savedFavoriteInstitutions = localStorage.getItem('favoriteInstitutions');
    const savedFavoriteAusbildungsarten = localStorage.getItem('favoriteAusbildungsarten');
    const savedFavoriteAbschluesse = localStorage.getItem('favoriteAbschluesse');

    if (savedPersonalData) {
      setPersonalData(JSON.parse(savedPersonalData));
    }
    if (savedBerufserfahrung) {
      setBerufserfahrung(JSON.parse(savedBerufserfahrung));
    }
    if (savedAusbildung) {
      setAusbildung(JSON.parse(savedAusbildung));
    }
    if (savedSkills) {
      setSkills(JSON.parse(savedSkills));
    }
    if (savedSoftSkills) {
      setSoftSkills(JSON.parse(savedSoftSkills));
    }
    if (savedCvSuggestions) {
      setCvSuggestions(JSON.parse(savedCvSuggestions));
    }
    if (savedSelectedExperienceId) {
      setSelectedExperienceId(JSON.parse(savedSelectedExperienceId));
    }
    if (savedActiveTab) {
      setActiveTab(JSON.parse(savedActiveTab));
    }
    if (savedFavoritePositions) {
      setFavoritePositions(JSON.parse(savedFavoritePositions));
    }
    if (savedFavoriteCompanies) { 
      setFavoriteCities(JSON.parse(savedFavoriteCities));
    }
    if (savedFavoriteCities) {
      setFavoriteCities(JSON.parse(savedFavoriteCities));
    }
    if (savedFavoriteTasks) {
      setFavoriteTasks(JSON.parse(savedFavoriteTasks));
    }
    if (savedFavoriteSkills) {
      setFavoriteSkills(JSON.parse(savedFavoriteSkills));
    }
    if (savedFavoriteSoftSkills) {
      setFavoriteSoftSkills(JSON.parse(savedFavoriteSoftSkills));
    }
    if (savedFavoriteDegrees) {
      setFavoriteDegrees(JSON.parse(savedFavoriteDegrees));
    }
    if (savedFavoriteInstitutions) {
      setFavoriteInstitutions(JSON.parse(savedFavoriteInstitutions));
    }
    if (savedFavoriteAusbildungsarten) {
      setFavoriteAusbildungsarten(JSON.parse(savedFavoriteAusbildungsarten));
    }
    if (savedFavoriteAbschluesse) {
      setFavoriteAbschluesse(JSON.parse(savedFavoriteAbschluesse));
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('personalData', JSON.stringify(personalData));
  }, [personalData]);

  useEffect(() => {
    localStorage.setItem('berufserfahrung', JSON.stringify(berufserfahrung));
  }, [berufserfahrung]);

  useEffect(() => {
    localStorage.setItem('ausbildung', JSON.stringify(ausbildung));
  }, [ausbildung]);

  useEffect(() => {
    localStorage.setItem('skills', JSON.stringify(skills));
  }, [skills]);

  useEffect(() => {
    localStorage.setItem('softSkills', JSON.stringify(softSkills));
  }, [softSkills]);

  useEffect(() => {
    localStorage.setItem('cvSuggestions', JSON.stringify(cvSuggestions));
  }, [cvSuggestions]);

  useEffect(() => {
    if (selectedExperienceId !== undefined) { // Only save if not undefined
      localStorage.setItem('selectedExperienceId', JSON.stringify(selectedExperienceId));
    }
  }, [selectedExperienceId]);

  useEffect(() => {
    localStorage.setItem('selectedEducationId', JSON.stringify(selectedEducationId));
  }, [selectedEducationId]);

  useEffect(() => {
    localStorage.setItem('activeTab', JSON.stringify(activeTab));
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem('favoritePositions', JSON.stringify(favoritePositions));
  }, [favoritePositions]);

  useEffect(() => {
    localStorage.setItem('favoriteCompanies', JSON.stringify(favoriteCompanies));
  }, [favoriteCompanies]);

  useEffect(() => {
    localStorage.setItem('favoriteCities', JSON.stringify(favoriteCities));
  }, [favoriteCities]);

  useEffect(() => {
    localStorage.setItem('favoriteTasks', JSON.stringify(favoriteTasks));
  }, [favoriteTasks]);

  useEffect(() => {
    localStorage.setItem('favoriteSkills', JSON.stringify(favoriteSkills));
  }, [favoriteSkills]);

  useEffect(() => {
    localStorage.setItem('favoriteSoftSkills', JSON.stringify(favoriteSoftSkills));
  }, [favoriteSoftSkills]);

  useEffect(() => {
    localStorage.setItem('favoriteDegrees', JSON.stringify(favoriteDegrees));
  }, [favoriteDegrees]);

  useEffect(() => {
    localStorage.setItem('favoriteInstitutions', JSON.stringify(favoriteInstitutions));
  }, [favoriteInstitutions]);

  useEffect(() => {
    localStorage.setItem('favoriteAusbildungsarten', JSON.stringify(favoriteAusbildungsarten));
  }, [favoriteAusbildungsarten]);

  useEffect(() => {
    localStorage.setItem('favoriteAbschluesse', JSON.stringify(favoriteAbschluesse));
  }, [favoriteAbschluesse]);

  const updatePersonalData = (data: Partial<PersonalData>) => {
    setPersonalData(prev => ({ ...prev, ...data }));
  };

  const addExperience = (data: Partial<Berufserfahrung> = {}) => {
    const newExperience: Berufserfahrung = {
      id: Date.now().toString(),
      companyName: '',
      companyCity: '',
      companyCountry: '',
      position: [],
      startMonth: null,
      startYear: "",
      endMonth: null,
      endYear: null,
      isCurrent: false,
      aufgabenbereiche: [],
      ...data
    };
    setBerufserfahrung(prev => [...prev, newExperience]);
    setSelectedExperienceId(newExperience.id);
  };

  const updateExperience = (id: string, data: Partial<Berufserfahrung>) => {
    setBerufserfahrung(prev => 
      prev.map(exp => exp.id === id ? { ...exp, ...data } : exp)
    );
  };

  const deleteExperience = (id: string) => {
    setBerufserfahrung(prev => prev.filter(exp => exp.id !== id));
    if (selectedExperienceId === id) {
      setSelectedExperienceId(null);
    }
  };

  const addEducation = (data: Partial<Ausbildung> = {}) => {
    const newEducation: Ausbildung = {
      id: Date.now().toString(),
      institution: [],
      ausbildungsart: [],
      abschluss: [],
      startMonth: null,
      startYear: "",
      endMonth: null,
      endYear: null,
      isCurrent: false,
      zusatzangaben: "",
      ...data
    };
    setAusbildung(prev => [...prev, newEducation]);
    setSelectedEducationId(newEducation.id);
  };

  const updateEducation = (id: string, data: Partial<Ausbildung>) => {
    setAusbildung(prev => 
      prev.map(edu => edu.id === id ? { ...edu, ...data } : edu)
    );
  };

  const deleteEducation = (id: string) => {
    setAusbildung(prev => prev.filter(edu => edu.id !== id));
    if (selectedEducationId === id) {
      setSelectedEducationId(null);
    }
  };

  const updateSkills = (newSkills: string[]) => {
    setSkills(newSkills);
  };

  const updateSoftSkills = (newSoftSkills: string[]) => {
    setSoftSkills(newSoftSkills);
  };

  const selectExperience = (id: string) => {
    setSelectedExperienceId(id);
  };

  const selectEducation = (id: string) => {
    setSelectedEducationId(id);
  };

  const toggleFavoritePosition = (position: string) => {
    setFavoritePositions(prev => 
      prev.includes(position) 
        ? prev.filter(p => p !== position)
        : [...prev, position]
    );
  };

  const toggleFavoriteCompany = (company: string) => {
    setFavoriteCompanies(prev => 
      prev.includes(company) 
        ? prev.filter(c => c !== company)
        : [...prev, company]
    );
  };

  const toggleFavoriteCity = (city: string) => {
    setFavoriteCities(prev => 
      prev.includes(city) 
        ? prev.filter(c => c !== city)
        : [...prev, city]
    );
  };

  const toggleFavoriteTask = (task: string) => {
    setFavoriteTasks(prev => 
      prev.includes(task) 
        ? prev.filter(t => t !== task)
        : [...prev, task]
    );
  };

  const toggleFavoriteSkill = (skill: string) => {
    setFavoriteSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const toggleFavoriteSoftSkill = (softSkill: string) => {
    setFavoriteSoftSkills(prev => 
      prev.includes(softSkill) 
        ? prev.filter(s => s !== softSkill)
        : [...prev, softSkill]
    );
  };

  const toggleFavoriteDegree = (degree: string) => {
    setFavoriteDegrees(prev => 
      prev.includes(degree) 
        ? prev.filter(d => d !== degree)
        : [...prev, degree]
    );
  };

  const toggleFavoriteInstitution = (institution: string) => {
    setFavoriteInstitutions(prev => 
      prev.includes(institution) 
        ? prev.filter(i => i !== institution)
        : [...prev, institution]
    );
  };

  const toggleFavoriteAusbildungsart = (ausbildungsart: string) => {
    setFavoriteAusbildungsarten(prev => 
      prev.includes(ausbildungsart) 
        ? prev.filter(a => a !== ausbildungsart)
        : [...prev, ausbildungsart]
    );
  };

  const toggleFavoriteAbschluss = (abschluss: string) => {
    setFavoriteAbschluesse(prev => 
      prev.includes(abschluss) 
        ? prev.filter(a => a !== abschluss)
        : [...prev, abschluss]
    );
  };

  const updateExperienceField = (id: string, field: keyof Berufserfahrung, value: any) => {
    setBerufserfahrung(prev => 
      prev.map(exp => exp.id === id ? { ...exp, [field]: value } : exp)
    );
  };

  const updateEducationField = (id: string, field: keyof Ausbildung, value: any) => {
    setAusbildung(prev => 
      prev.map(edu => edu.id === id ? { ...edu, [field]: value } : edu)
    );
  };

  const updateExperienceTask = (expId: string, taskIndex: number, newTask: string) => {
    setBerufserfahrung(prev => 
      prev.map(exp => {
        if (exp.id === expId) {
          const newTasks = [...exp.aufgabenbereiche];
          newTasks[taskIndex] = newTask;
          return { ...exp, aufgabenbereiche: newTasks };
        }
        return exp;
      })
    );
  };

  const updateExperienceTasksOrder = (expId: string, newTasks: string[]) => {
    setBerufserfahrung(prev => 
      prev.map(exp => 
        exp.id === expId ? { ...exp, aufgabenbereiche: newTasks } : exp
      )
    );
  };

  const addExperienceTask = (expId: string, task: string) => {
    setBerufserfahrung(prev => 
      prev.map(exp => 
        exp.id === expId 
          ? { ...exp, aufgabenbereiche: [...exp.aufgabenbereiche, task] }
          : exp
      )
    );
  };

  const value: LebenslaufContextType = {
    personalData,
    berufserfahrung,
    ausbildung,
    skills,
    softSkills,
    cvSuggestions,
    favoritePositions,
    favoriteCompanies,
    favoriteCities,
    favoriteTasks,
    favoriteSkills,
    favoriteSoftSkills,
    favoriteDegrees,
    favoriteInstitutions,
    favoriteAusbildungsarten,
    favoriteAbschluesse,
    selectedExperienceId,
    selectedEducationId,
    activeTab,
    updatePersonalData,
    addExperience,
    updateExperience,
    deleteExperience,
    addEducation,
    updateEducation,
    deleteEducation,
    updateSkills,
    updateSoftSkills,
    selectExperience,
    selectEducation,
    selectEducation,
    setActiveTab,
    toggleFavoritePosition,
    toggleFavoriteCompany,
    toggleFavoriteCity,
    toggleFavoriteTask,
    toggleFavoriteSkill,
    toggleFavoriteSoftSkill,
    toggleFavoriteDegree,
    toggleFavoriteInstitution,
    toggleFavoriteAusbildungsart,
    toggleFavoriteAbschluss,
    updateExperienceField,
    updateEducationField,
    updateExperienceTask,
    updateExperienceTasksOrder,
    addExperienceTask
  };

  return (
    <LebenslaufContext.Provider value={value}>
      {children}
    </LebenslaufContext.Provider>
  );
};

export const useLebenslauf = () => {
  const context = useContext(LebenslaufContext);
  if (context === undefined) {
    throw new Error('useLebenslauf must be used within a LebenslaufProvider');
  }
  return context;
};