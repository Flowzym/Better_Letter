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
 * @param input - Die neue Eingabe
 * @param oldValue - Der vorherige Wert (für Kontext)
 * @param selectionStart - Cursor-Position vor der Änderung
 * @param selectionEnd - End-Position der Selektion vor der Änderung
 */
export function parseMonthYearInput(input: string, oldValue?: string, selectionStart?: number): ParsedMonthYear {
  // Nur Ziffern extrahieren, maximal 6 Zeichen
  const digits = input.replace(/\D/g, '').slice(0, 6);
  
  let month: string | undefined;
  let year: string | undefined;
  let formatted = '';
  let shouldMoveCursor = false;
  
  if (digits.length === 0) {
    return { formatted: '', isValid: false, shouldMoveCursor: false };
  }
  
  // ✅ KORRIGIERT: Präzise Erkennung einer Monat-Markierung
  const wasMonthSelected = oldValue && oldValue.includes('/') && 
    selectionStart !== undefined && selectionEnd !== undefined &&
    selectionStart === 0 && selectionEnd === 2;
  
  // Spezialfall: Monat wurde markiert und einzelne Ziffer eingegeben
  if (wasMonthSelected && digits.length === 1) {
    const oldParts = oldValue.split('/');
    const oldYear = oldParts[1] || '';
    
    // Einzelne Ziffer bei markiertem Monat → Platzhalter
    month = digits + '.';
    year = oldYear;
    formatted = `${month}/${year}`;
    return { month, year, formatted, isValid: false, shouldMoveCursor: false };
  }
  
  // ✅ KORRIGIERT: Platzhalter wird vervollständigt (z.B. "1." → "11")
  if (oldValue && oldValue.includes('.') && oldValue.includes('/')) {
    const oldParts = oldValue.split('/');
    const oldMonthPart = oldParts[0]; // z.B. "1."
    const oldYear = oldParts[1] || '';
    
    // Wenn der alte Monat einen Platzhalter hatte und jetzt 2 Ziffern eingegeben wurden
    if (oldMonthPart.includes('.') && digits.length >= 2) {
      const num = parseInt(digits, 10);
      if (num >= 1 && num <= 12) {
        month = digits.padStart(2, '0');
        year = oldYear;
        formatted = `${month}/${year}`;
        return { month, year, formatted, isValid: true, shouldMoveCursor: true };
      } else {
        // Ungültiger Monat → als Jahr behandeln
        year = digits.slice(0, 4);
        formatted = year;
        return { year, formatted, isValid: false, shouldMoveCursor: false };
      }
    }
  }
  
  if (digits.length <= 2) {
    // Prüfe ob es ein gültiger Monat ist (01-12)
    const num = parseInt(digits, 10);
    if (digits.length === 2 && num >= 1 && num <= 12) {
      // Gültiger Monat - füge "/" hinzu
      month = digits.padStart(2, '0');
      formatted = digits + '/';
      shouldMoveCursor = true; // Cursor soll nach "/" springen
    } else {
      // Ungültiger Monat oder nur eine Ziffer - behandle als Jahr
      year = digits;
      formatted = digits;
    }
  } else if (digits.length <= 6) {
    // 3-4 Ziffern: Prüfe ersten zwei Ziffern
    const firstTwo = digits.slice(0, 2);
    const num = parseInt(firstTwo, 10);
    
    if (num >= 1 && num <= 12) {
      // Erste zwei Ziffern sind gültiger Monat
      month = firstTwo;
      year = digits.slice(2, 6); // Maximal 4 Ziffern für Jahr
      formatted = `${month}/${year}`;
    } else {
      // Erste zwei Ziffern sind kein gültiger Monat - behandle als Jahr
      year = digits.slice(0, 4); // Maximal 4 Ziffern für Jahr
      formatted = year;
    }
  }
  
  // Validierung
  const monthValid = !month || month.includes('.') || isValidMonth(month);
  const yearValid = !year || (year.length === 4 && isValidYear(year));
  const isValid = monthValid && yearValid;
  
  return {
    month,
    year,
    formatted,
    isValid,
    shouldMoveCursor
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
  oldPosition: number,
  shouldMoveCursor: boolean = false
): number {
  // Wenn explizit Cursor bewegt werden soll (z.B. nach "/" bei Monat)
  if (shouldMoveCursor && newValue.includes('/') && !oldValue.includes('/')) {
    return newValue.length; // Cursor ans Ende (nach "/")
  }
  
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