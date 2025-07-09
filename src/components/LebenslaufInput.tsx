import React from 'react';

export default function LebenslaufInput() {
  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-6 space-y-8">
      {/* Berufserfahrung */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">💼 Berufserfahrung</h2>
        <div className="space-y-4">
          <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
            <input type="text" placeholder="Firma" className="w-full mb-2 px-3 py-2 border rounded" />
            <input type="text" placeholder="Position" className="w-full mb-2 px-3 py-2 border rounded" />
            <input type="text" placeholder="Zeitraum" className="w-full mb-2 px-3 py-2 border rounded" />
            <textarea placeholder="Aufgabenbeschreibung" className="w-full px-3 py-2 border rounded h-24" />
          </div>
          <button className="text-sm text-orange-600 hover:underline">+ Berufserfahrung hinzufügen</button>
        </div>
      </section>

      {/* Ausbildung */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">🎓 Ausbildung</h2>
        <div className="space-y-4">
          <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
            <input type="text" placeholder="Schule / Einrichtung" className="w-full mb-2 px-3 py-2 border rounded" />
            <input type="text" placeholder="Abschluss" className="w-full mb-2 px-3 py-2 border rounded" />
            <input type="text" placeholder="Zeitraum" className="w-full mb-2 px-3 py-2 border rounded" />
          </div>
          <button className="text-sm text-orange-600 hover:underline">+ Ausbildung hinzufügen</button>
        </div>
      </section>

      {/* Kompetenzen */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">🛠 Kompetenzen</h2>
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">Projektmanagement</span>
          <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">Datenanalyse</span>
          <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">Kommunikation</span>
        </div>
        <button className="text-sm text-orange-600 hover:underline mt-2">+ Kompetenz hinzufügen</button>
      </section>

      {/* Ziel/Profiltext */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">🎯 Ziel / Profiltext (optional)</h2>
        <textarea placeholder="Kurzer Einleitungstext zum Lebenslauf (optional)" className="w-full px-3 py-2 border rounded h-24" />
      </section>

      {/* Aktionen */}
      <div className="flex flex-wrap gap-3 pt-4 border-t">
        <button className="bg-white border border-orange-500 text-orange-600 px-4 py-2 rounded hover:bg-orange-50">
          Vorschläge anzeigen
        </button>
        <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50">
          Layout wählen
        </button>
        <button className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
          Exportieren
        </button>
      </div>
    </div>
  );
}
