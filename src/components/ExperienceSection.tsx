import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ExperienceSectionProps {
  children: React.ReactNode;
}

export default function ExperienceSection({ children }: ExperienceSectionProps) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <section className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between transition-colors duration-200"
        aria-expanded={isOpen}
      >
        <div className="flex items-center space-x-2">
          {/* Titel entfernt - wird jetzt über Tab-Navigation angezeigt */}
        </div>
        {isOpen ? (
          <ChevronUp className="h-5 w-5" style={{ color: '#F29400' }} />
        ) : (
          <ChevronDown className="h-5 w-5" style={{ color: '#F29400' }} />
        )}
      </button>
      {isOpen && <div className="p-4 space-y-4 bg-gray-50">{children}</div>}
    </section>
  );
}
