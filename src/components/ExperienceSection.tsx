interface ExperienceSectionProps {
  children: React.ReactNode;
}

export default function ExperienceSection({ children }: ExperienceSectionProps) {
  return (
    <div className="p-4 space-y-4 bg-gray-50 border border-gray-200 rounded-lg">
      {children}
    </div>
  );
}
