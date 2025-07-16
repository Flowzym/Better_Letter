import React from 'react';
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