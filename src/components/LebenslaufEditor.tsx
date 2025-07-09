import React from "react";
import { LebenslaufProvider } from "../context/LebenslaufContext";
import LebenslaufInput from "./LebenslaufInput";
import LebenslaufPreview from "./LebenslaufPreview";

export default function LebenslaufEditor() {
  return (
    <LebenslaufProvider>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Linke Spalte: Eingabe */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <LebenslaufInput />
        </div>

        {/* Rechte Spalte: Vorschau */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">📄 Vorschau</h2>
          <LebenslaufPreview />
        </div>
      </div>
    </LebenslaufProvider>
  );
}
