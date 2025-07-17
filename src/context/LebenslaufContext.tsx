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
  position: string;
  companyName: string;
  companyCity: string;
  companyCountry: string;
  startDate: string;
  endDate: string;
  isCurrentJob: boolean;
  tasks: string[];
  description: string;
}

export interface Ausbildung {
  id: string;
  degree: string;
  institution: string;
  city: string;
  country: string;
  startDate: string;
  endDate: string;
  isCurrentEducation: boolean;
  grade: string;
  description: string;
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
  updatePersonalData: (data: Partial<PersonalData>) => void;
  addExperience: () => void;
  updateExperience: (id: string, data: Partial<Berufserfahrung>) => void;
  deleteExperience: (id: string) => void;
  addEducation: () => void;
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
  updateExperienceField: (id: string, field: keyof Berufserfahrung, value: any) => void;
  updateEducationField: (id: string, field: keyof Ausbildung, value: any) => void;
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
  companies: [],
  tasks: [],
  skills: [],
  softSkills: [],
  degrees: [],
  institutions: []
};

export const LebenslaufProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [personalData, setPersonalData] = useState<PersonalData>(initialPersonalData);
  const [berufserfahrung, setBerufserfahrung] = useState<Berufserfahrung[]>([]);
  const [ausbildung, setAusbildung] = useState<Ausbildung[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [softSkills, setSoftSkills] = useState<string[]>([]);
  const [cvSuggestions, setCvSuggestions] = useState<CVSuggestions>(initialCVSuggestions);
  
  // Favorites
  const [favoritePositions, setFavoritePositions] = useState<string[]>([]);
  const [favoriteCompanies, setFavoriteCompanies] = useState<string[]>([]);
  const [favoriteCities, setFavoriteCities] = useState<string[]>([]);
  const [favoriteTasks, setFavoriteTasks] = useState<string[]>([]);
  const [favoriteSkills, setFavoriteSkills] = useState<string[]>([]);
  const [favoriteSoftSkills, setFavoriteSoftSkills] = useState<string[]>([]);
  const [favoriteDegrees, setFavoriteDegrees] = useState<string[]>([]);
  const [favoriteInstitutions, setFavoriteInstitutions] = useState<string[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedPersonalData = localStorage.getItem('personalData');
    const savedBerufserfahrung = localStorage.getItem('berufserfahrung');
    const savedAusbildung = localStorage.getItem('ausbildung');
    const savedSkills = localStorage.getItem('skills');
    const savedSoftSkills = localStorage.getItem('softSkills');
    const savedCvSuggestions = localStorage.getItem('cvSuggestions');
    const savedFavoritePositions = localStorage.getItem('favoritePositions');
    const savedFavoriteCompanies = localStorage.getItem('favoriteCompanies');
    const savedFavoriteCities = localStorage.getItem('favoriteCities');
    const savedFavoriteTasks = localStorage.getItem('favoriteTasks');
    const savedFavoriteSkills = localStorage.getItem('favoriteSkills');
    const savedFavoriteSoftSkills = localStorage.getItem('favoriteSoftSkills');
    const savedFavoriteDegrees = localStorage.getItem('favoriteDegrees');
    const savedFavoriteInstitutions = localStorage.getItem('favoriteInstitutions');

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
    if (savedFavoritePositions) {
      setFavoritePositions(JSON.parse(savedFavoritePositions));
    }
    if (savedFavoriteCompanies) {
      setFavoriteCompanies(JSON.parse(savedFavoriteCompanies));
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

  const updatePersonalData = (data: Partial<PersonalData>) => {
    setPersonalData(prev => ({ ...prev, ...data }));
  };

  const addExperience = () => {
    const newExperience: Berufserfahrung = {
      id: Date.now().toString(),
      position: '',
      companyName: '',
      companyCity: '',
      companyCountry: '',
      startDate: '',
      endDate: '',
      isCurrentJob: false,
      tasks: [],
      description: ''
    };
    setBerufserfahrung(prev => [...prev, newExperience]);
  };

  const updateExperience = (id: string, data: Partial<Berufserfahrung>) => {
    setBerufserfahrung(prev => 
      prev.map(exp => exp.id === id ? { ...exp, ...data } : exp)
    );
  };

  const deleteExperience = (id: string) => {
    setBerufserfahrung(prev => prev.filter(exp => exp.id !== id));
  };

  const addEducation = () => {
    const newEducation: Ausbildung = {
      id: Date.now().toString(),
      degree: '',
      institution: '',
      city: '',
      country: '',
      startDate: '',
      endDate: '',
      isCurrentEducation: false,
      grade: '',
      description: ''
    };
    setAusbildung(prev => [...prev, newEducation]);
  };

  const updateEducation = (id: string, data: Partial<Ausbildung>) => {
    setAusbildung(prev => 
      prev.map(edu => edu.id === id ? { ...edu, ...data } : edu)
    );
  };

  const deleteEducation = (id: string) => {
    setAusbildung(prev => prev.filter(edu => edu.id !== id));
  };

  const updateSkills = (newSkills: string[]) => {
    setSkills(newSkills);
  };

  const updateSoftSkills = (newSoftSkills: string[]) => {
    setSoftSkills(newSoftSkills);
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
    updatePersonalData,
    addExperience,
    updateExperience,
    deleteExperience,
    addEducation,
    updateEducation,
    deleteEducation,
    updateSkills,
    updateSoftSkills,
    toggleFavoritePosition,
    toggleFavoriteCompany,
    toggleFavoriteCity,
    toggleFavoriteTask,
    toggleFavoriteSkill,
    toggleFavoriteSoftSkill,
    toggleFavoriteDegree,
    toggleFavoriteInstitution,
    updateExperienceField,
    updateEducationField
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