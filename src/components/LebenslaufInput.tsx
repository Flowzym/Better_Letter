import React, { useEffect } from 'react';
import { useLebenslaufData } from '../context/LebenslaufContext';

export default function LebenslaufInput() {
  const { daten, setDaten } = useLebenslaufData();

  // Init: mind. 1 Erfahrungseintrag sicherstellen
  useEffect(() => {
    if (daten.erfahrungen.length === 0) {
      setDaten(prev => ({
        ...prev,
        erfahrungen: [
          {
            firma: '',
            position: '',
            zeitraum: '',
            beschreibung: '',
          },
        ],
      }));
    }
  }, [daten.erfahrungen, setDaten]);

  const erfahrung = daten.erfahrungen[0];

  const updateErfahrung = (field: keyof typeof erfahrung, value: string) => {
    const updated = [...daten.erfahrungen];
    updated[0] = { ...updated[0], [field]: value };
    setDaten(prev => ({ ...prev, erfahrungen: updated }));
  };

  return (
    <div className="space-y-8">
      {/* Berufserfahrung */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">💼 Berufserfahrung</h2>
        <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 space-y-2">
          <input
            type="text"
            placeholder="Firma"
            className="w-full px-3 py-2 border rounded"
            value={erfahrung?.firma || ''}
            onChange={e => updateErfahrung('firma', e.target.value)}
          />
          <input
            type="text"
            placeholder="Position"
            className="w-full px-3 py-2 border rounded"
            value={erfahrung?.position || ''}
            onChange={e => updateErfahrung('position', e.target.value)}
          />
          <input
            type="text"
            placeholder="Zeitraum"
            className="w-full px-3 py-2 border rounded"
            value={erfahrung?.zeitraum || ''}
            onChange={e => updateErfahrung('zeitraum', e.target.value)}
          />
          <textarea
            placeholder="Aufgabenbeschreibung"
            className="w-full px-3 py-2 border rounded h-24"
            value={erfahrung?.beschreibung || ''}
            onChange={e => updateErfahrung('beschreibung', e.target.value)}
          />
        </div>
        <button className="text-sm text-orange-600 hover:underline mt-2">
          + Weitere Erfahrung hinzufügen
        </button>
      </section>
    </div>
  );
}
