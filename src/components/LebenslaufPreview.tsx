import React, { useMemo } from 'react';
import { useLebenslaufContext } from "../context/LebenslaufContext";

export default function LebenslaufPreview() {
  const { berufserfahrungen, selectExperience, selectedExperienceId } =
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
          <p className="italic text-gray-500">{exp.firma}</p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-black">
            {exp.aufgabenbeschreibung
              .split("\n")
              .filter((a) => a.trim() !== "")
              .map((aufgabe, i) => (
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
  );
}
