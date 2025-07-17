import React from "react";
import { LebenslaufProvider } from "../context/LebenslaufContext";
import { ProfileSourceMapping } from "../services/supabaseService";
import LebenslaufInput from "./LebenslaufInput";
import LebenslaufPreview from "./LebenslaufPreview";
import { User } from 'lucide-react';

export default function LebenslaufEditor({
  profileSourceMappings = [],
}: {
  profileSourceMappings?: ProfileSourceMapping[];
}) {
  return (
    <LebenslaufProvider profileSourceMappings={profileSourceMappings}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
        {/* Linke Spalte: Eingabe */}
        <div className="relative">
          <LebenslaufInput />
        </div>

        {/* Rechte Spalte: Vorschau */}
        <div>
          <LebenslaufPreview />
        </div>
      </div>
    </LebenslaufProvider>
  );
}
