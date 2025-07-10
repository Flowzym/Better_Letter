import React from "react";
import { useLebenslaufContext } from "../context/LebenslaufContext";

export default function LebenslaufPreview() {
  const { berufserfahrungen, selectExperience, selectedExperienceIndex } =
    useLebenslaufContext();

  const formatZeitraum = (
    startMonth: string | null,
    startYear: string,
    endMonth: string | null,
    endYear: string | null,
    isCurrent: boolean,
  ) => {
    const format = (m: string | null, y: string | null) =>
      m ? `${m}.${y}` : (y ?? "");
    const start = format(startMonth, startYear);
    const end = isCurrent ? "heute" : format(endMonth, endYear);
    return `${start} – ${end}`;
  };

  return (
    <div className="space-y-4">
      {berufserfahrungen.map((exp, idx) => (
        <div
          key={idx}
          onClick={() => selectExperience(idx)}
          className={`mb-6 border rounded p-4 cursor-pointer ${
            selectedExperienceIndex === idx ? "bg-orange-50" : "bg-gray-50"
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
