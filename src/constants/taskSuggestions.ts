export const TASK_SUGGESTIONS: Record<string, string[]> = {
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

export function getTaskSuggestionsForBeruf(beruf: string): string[] {
  return TASK_SUGGESTIONS[beruf] || [];
}
