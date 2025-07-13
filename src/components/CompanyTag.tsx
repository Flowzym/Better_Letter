import React, { useState, useEffect, useRef } from 'react';
import { useLebenslaufContext } from '../context/LebenslaufContext';
import TagButtonSelected from './ui/TagButtonSelected';

interface CompanyTagProps {
  label: string;
  onRemove: () => void;
  onEdit: (value: string) => void;
}

export default function CompanyTag({ label, onRemove, onEdit }: CompanyTagProps) {
  const { favoriteCompanies, toggleFavoriteCompany } = useLebenslaufContext();
  const isFavorite = favoriteCompanies.includes(label);

  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(label);
  const inputRef = useRef<HTMLInputElement>(null);

  // Setze den Wert nur beim ersten Laden
  useEffect(() => {
  }
  )
  return (
    <TagButtonSelected
      label={label}
      isFavorite={isFavorite}
      onToggleFavorite={() => toggleFavoriteCompany(label)}
      onRemove={onRemove}
      onEdit={onEdit}
    />
  );
}