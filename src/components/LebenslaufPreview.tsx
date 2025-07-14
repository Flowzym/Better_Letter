import React, { useMemo } from 'react';
import { useLebenslaufContext } from "../context/LebenslaufContext";

export default function LebenslaufPreview() {
  const { 
    berufserfahrungen, 
    selectExperience, 
    selectedExperienceId,
    ausbildungen,
    selectEducation,
    selectedEducationId
  } =
    useLebenslaufContext();

  const sortedErfahrungen = useMemo(() => {
    return [...berufserfahrungen].sort((a, b) => {
      const yearA = parseInt(a.startYear || '0', 10);
      const yearB = parseInt(b.startYear || '0', 10);
      const monthA = parseInt(a.startMonth || '0', 10);
      const monthB = parseInt(b.startMonth || '0', 10);

      if (yearA !== yearB) return yearB - yearA;
      return monthB - monthA;
    });
  }, [berufserfahrungen]);

  const sortedAusbildungen = useMemo(() => {
    return [...ausbildungen].sort((a, b) => {
      const yearA = parseInt(a.startYear || '0', 10);
      const yearB = parseInt(b.startYear || '0', 10);
      const monthA = parseInt(a.startMonth || '0', 10);
      const monthB = parseInt(b.startMonth || '0', 10);

      if (yearA !== yearB) return yearB - yearA;
      return monthB - monthA;
    });
  }, [ausbildungen]);

  const formatZeitraum = (
    startMonth: string | null,
    startYear: string | null,
    endMonth: string | null,
    endYear: string | null,
    isCurrent: boolean,
  ) => {
    const format = (m: string | null | undefined, y: string | null | undefined) => {
      if (!y) return '';
      return m ? `${m}.${y}` : y;
    };

    const start = format(startMonth ?? undefined, startYear ?? undefined);
    const end = isCurrent ? 'heute' : format(endMonth ?? undefined, endYear ?? undefined);

    if (!start && !end) return '';
    if (start && end) return `${start} – ${end}`;
    return start || end;
  };

  return (
    <>
      <h3 className="font-bold text-xl mb-4">Berufserfahrung</h3>
    <div className="space-y-4">
      {sortedErfahrungen.map((exp) => (
        <div
          key={exp.id}
          onClick={() => selectExperience(exp.id)}
          className={`mb-6 border rounded p-4 cursor-pointer ${
            selectedExperienceId === exp.id ? "bg-orange-50" : "bg-gray-50"
          }`}
        >
          <p className="text-sm text-gray-500">
            {formatZeitraum(
              exp.startMonth,
              exp.startYear,
              exp.endMonth,
              exp.endYear,
              exp.isCurrent,
            )}
          </p>
          <p className="font-bold text-lg text-gray-900">
            {exp.position.join(" / ")}
          </p>
          <p className="italic text-gray-500">{exp.companies.join(', ')}</p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-black">
            {(exp.aufgabenbereiche || []).map((aufgabe, i) => (
              <li key={i}>{aufgabe}</li>
            ))}
          </ul>
        </div>
      ))}
      {berufserfahrungen.length === 0 && (
        <div className="border border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 text-gray-500">
          <p className="italic">
            Hier erscheint die Vorschau deines Lebenslaufs …
          </p>
        </div>
      )}
    </div>

      <h3 className="font-bold text-xl mb-4 mt-8">Ausbildung</h3>
    <div className="space-y-4">
      {sortedAusbildungen.map((edu) => (
        <div
          key={edu.id}
          onClick={() => selectEducation(edu.id)}
          className={`mb-6 border rounded p-4 cursor-pointer ${
            selectedEducationId === edu.id ? "bg-orange-50" : "bg-gray-50"
          }`}
        >
          <p className="text-sm text-gray-500">
            {formatZeitraum(
              edu.startMonth,
              edu.startYear,
              edu.endMonth,
              edu.endYear,
              edu.isCurrent,
            )}
          </p>
          <p className="font-bold text-lg text-gray-900">
            {edu.ausbildungsart.join(" / ")} - {edu.abschluss.join(" / ")}
          </p>
          <p className="italic text-gray-500">{edu.institution.join(', ')}</p>
          {edu.zusatzangaben && <p className="text-black mt-2">{edu.zusatzangaben}</p>}
        </div>
      ))}
      {sortedAusbildungen.length === 0 && (
        <div className="border border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 text-gray-500">
          <p className="italic">
            Hier erscheint die Vorschau deiner Ausbildung …
          </p>
        </div>
      )}
    </div>
    </>
    </div>
  );
}
