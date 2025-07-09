import React, { useEffect } from 'react';
import { useLebenslaufData, Erfahrung } from '../context/LebenslaufContext';
import TagSelectorWithFavorites from './TagSelectorWithFavorites';
import ZeitraumPicker from './ZeitraumPicker';

function formatZeitraumText({
  startMonth,
  startYear,
  endMonth,
  endYear,
  isCurrent,
}: {
  startMonth: number | null;
  startYear: number | null;
  endMonth: number | null;
  endYear: number | null;
  isCurrent: boolean;
}) {
  const format = (m: number | null, y: number | null) => (m ? `${m}/${y}` : y);
  const start = format(startMonth, startYear);
  const end = isCurrent ? 'heute' : format(endMonth, endYear);
  return `${start} – ${end}`;
}

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
            startMonth: null,
            startYear: null,
            endMonth: null,
            endYear: null,
            isCurrent: false,
          },
        ],
      }));
    }
  }, [daten.erfahrungen, setDaten]);

  const erfahrung = daten.erfahrungen[0];

  const updateErfahrung = <K extends keyof Erfahrung>(
    field: K,
    value: Erfahrung[K],
  ) => {
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
          <TagSelectorWithFavorites
            label="Position"
            value={erfahrung?.position ? [erfahrung.position] : []}
            onChange={(val) => updateErfahrung('position', val[0] || '')}
            favoritenKey="positionFavoriten"
            options={[
              'Projektmanager',
              'Buchhalter',
              'Verkäufer',
              'Teamleiter',
            ]}
            allowCustom={true}
          />
          <ZeitraumPicker
            startMonth={erfahrung?.startMonth ?? null}
            startYear={erfahrung?.startYear ?? null}
            endMonth={erfahrung?.endMonth ?? null}
            endYear={erfahrung?.endYear ?? null}
            isCurrent={erfahrung?.isCurrent ?? false}
            onChange={(data) => {
              updateErfahrung('startMonth', data.startMonth);
              updateErfahrung('startYear', data.startYear);
              updateErfahrung('endMonth', data.endMonth);
              updateErfahrung('endYear', data.endYear);
              updateErfahrung('isCurrent', data.isCurrent);
              updateErfahrung('zeitraum', formatZeitraumText(data));
            }}
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
