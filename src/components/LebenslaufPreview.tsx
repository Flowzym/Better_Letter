import React, { useEffect } from 'react';
import { useLebenslaufData } from '../context/LebenslaufContext';

export default function LebenslaufPreview() {
  const { daten } = useLebenslaufData();

  useEffect(() => {
    console.log('LebenslaufDaten', daten);
  }, [daten]);

  return (
    <div className="border border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 text-gray-500 min-h-[300px]">
      <p className="italic">Hier erscheint die Vorschau deines Lebenslaufs …</p>
    </div>
  );
}
