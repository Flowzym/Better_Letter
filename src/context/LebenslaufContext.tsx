import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Erfahrung {
  firma: string;
  position: string;
  zeitraum: string;
  beschreibung: string;
}

export interface Ausbildung {
  institution: string;
  abschluss: string;
  zeitraum: string;
}

export interface LebenslaufDaten {
  erfahrungen: Erfahrung[];
  ausbildung: Ausbildung[];
  kompetenzen: string[];
  zieltext: string;
}

interface LebenslaufContextType {
  daten: LebenslaufDaten;
  setDaten: React.Dispatch<React.SetStateAction<LebenslaufDaten>>;
}

const defaultDaten: LebenslaufDaten = {
  erfahrungen: [],
  ausbildung: [],
  kompetenzen: [],
  zieltext: '',
};

const LebenslaufContext = createContext<LebenslaufContextType | undefined>(undefined);

export function LebenslaufProvider({ children }: { children: ReactNode }) {
  const [daten, setDaten] = useState<LebenslaufDaten>(defaultDaten);

  return (
    <LebenslaufContext.Provider value={{ daten, setDaten }}>
      {children}
    </LebenslaufContext.Provider>
  );
}

export function useLebenslaufData() {
  const context = useContext(LebenslaufContext);
  if (!context) {
    throw new Error('useLebenslaufData muss innerhalb von LebenslaufProvider verwendet werden');
  }
  return context;
}
