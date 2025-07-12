/**
 * Utilities für Datumseingabe und -validierung
 * Konsolidiert die Parsing/Validierung aus MonthYearInput und MonthYearPicker
 */

export interface ParsedMonthYear {
  month?: string;
  year?: string;
  formatted: string;
  isValid: boolean;
}

/**
 * Validiert einen Monat (01-12)
 */
export function isValidMonth(month: string): boolean {
  if (!month || month.length !== 2) return false;
  const num = parseInt(month, 10);
  return num >= 1 && num <= 12;
}

/**
 * Validiert ein Jahr (1900-2099)
 */
export function isValidYear(year: string): boolean {
  if (!year || year.length !== 4) return false;
  const num = parseInt(year, 10);
  return num >= 1900 && num <= 2099;
}

/**
 * Parst eine MM/YYYY Eingabe und gibt strukturierte Daten zurück
 */
export function parseMonthYearInput(input: string): ParsedMonthYear {
  // Nur Ziffern extrahieren, maximal 6 Zeichen
  const digits = input.replace(/\D/g, '').slice(0, 6);
  
  let month: string | undefined;
  let year: string | undefined;
  let formatted = '';
  
  if (digits.length === 0) {
    return { formatted: '', isValid: false };
  }
  
  if (digits.length <= 2) {
    // Prüfe ob es ein gültiger Monat ist (01-12)
    const num = parseInt(digits, 10);
    if (digits.length === 2 && num >= 1 && num <= 12) {
      // Gültiger Monat - füge "/" hinzu
      month = digits.padStart(2, '0');
      formatted = digits + '/';
    } else {
      // Ungültiger Monat oder nur eine Ziffer - behandle als Jahr
      formatted = digits;
    }
  } else if (digits.length <= 4) {
    // 3-4 Ziffern: Prüfe ersten zwei Ziffern
    const firstTwo = digits.slice(0, 2);
    const num = parseInt(firstTwo, 10);
    
    if (num >= 1 && num <= 12) {
      // Erste zwei Ziffern sind gültiger Monat
      month = firstTwo;
      year = digits.slice(2);
      formatted = `${month}/${year}`;
    } else {
      // Erste zwei Ziffern sind kein gültiger Monat - behandle als Jahr
      year = digits;
      formatted += '/';
    }
  } else {
    // Mehr als 4 Ziffern: Monat und Jahr
    const monthPart = digits.slice(0, 2);
    const yearPart = digits.slice(2);
    
    if (isValidMonth(monthPart)) {
      month = monthPart;
      year = yearPart;
      formatted = `${month}/${year}`;
    } else {
      // Ungültiger Monat - behandle als Jahr (maximal 4 Ziffern)
      year = digits.slice(0, 4);
      formatted = year;
    }
  }
  
  // Validierung
  const monthValid = !month || isValidMonth(month);
  const yearValid = !year || (year.length === 4 && isValidYear(year));
  const isValid = monthValid && yearValid;
  
  return {
    month,
    year,
    formatted,
    isValid
  };
}

/**
 * Formatiert Monat und Jahr zu MM/YYYY oder YYYY
 */
export function formatMonthYear(month?: string, year?: string): string {
  if (month && year) {
    return `${month}/${year}`;
  }
  if (year) {
    return year;
  }
  if (month) {
    return `${month}/`;
  }
  return '';
}

/**
 * Berechnet die neue Cursor-Position nach Formatierung
 */
export function calculateCursorPosition(
  oldValue: string,
  newValue: string,
  oldPosition: number
): number {
  // Wenn ein Slash hinzugefügt wurde und der Cursor nach Position 2 war
  const hadSlash = oldValue.includes('/');
  const hasSlash = newValue.includes('/');
  
  if (!hadSlash && hasSlash && oldPosition > 2) {
    return oldPosition + 1;
  }
  
  // Wenn ein Slash entfernt wurde
  if (hadSlash && !hasSlash && oldPosition > 2) {
    return oldPosition - 1;
  }
  
  return Math.min(oldPosition, newValue.length);
}