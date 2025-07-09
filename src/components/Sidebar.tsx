import React, { useState } from 'react';
import DocumentTypeSelector from './DocumentTypeSelector';

interface SidebarProps {
  className?: string;
  documentTypes: {
    [key: string]: {
      label: string;
      prompt: string;
    };
  };
  selectedType: string;
  onTypeChange: (type: string) => void;
}

export default function Sidebar({
  className = '',
  documentTypes,
  selectedType,
  onTypeChange,
}: SidebarProps) {
  const [open, setOpen] = useState(true);

  return (
    <div className={`${className} overflow-y-auto`}>
      <button
        onClick={() => setOpen(!open)}
        className="mb-2 text-sm text-gray-700"
      >
        {open ? '▾ Dokument-Typ' : '▸ Dokument-Typ'}
      </button>
      {open && (
        <DocumentTypeSelector
          documentTypes={documentTypes}
          selectedType={selectedType}
          onTypeChange={onTypeChange}
        />
      )}
    </div>
  );
}
