export const POSITIONS_TO_TASKS: Record<string, string[]> = {
  Softwareentwickler: [
    'Programmierung',
    'Code Review',
    'Testing',
    'Deployment',
    'Dokumentation'
  ],
  Projektmanager: [
    'Projektplanung',
    'Ressourcenmanagement',
    'Budgetkontrolle',
    'Stakeholder-Kommunikation'
  ],
  Techniker: ['Reparatur', 'Wartung', 'Ressourcenmanagement'],
  'Marketing Manager': [
    'Kampagnenplanung',
    'Marktanalysen',
    'Content-Erstellung',
    'Erfolgskontrolle'
  ],
};

export function getTasksForPosition(position: string): string[] {
  return POSITIONS_TO_TASKS[position] || [];
}

export function getTasksForPositions(positions: string[]): string[] {
  const tasks = positions.flatMap(p => getTasksForPosition(p));
  return Array.from(new Set(tasks));
}
