/**
 * Utilities für Datumseingabe und -validierung
 * Vereinfachte und robuste Implementierung
 */

export interface ParsedMonthYear {
  month?: string;
  year?: string;
  formatted: string;
  isValid: boolean;
  isComplete: boolean;
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
 * @param input - Die Eingabe des Benutzers
 */
export function parseMonthYearInput(input: string): ParsedMonthYear {
  // Nur Ziffern und Schrägstriche zulassen
  const cleaned = input.replace(/[^\d/]/g, '');
  
  if (cleaned.length === 0) {
    return { formatted: '', isValid: false, isComplete: false };
  }
  
  let month: string | undefined;
  let year: string | undefined;
  let formatted: string = '';
  let isValid = false;
  let isComplete = false;
  
  // Aufteilen bei Schrägstrich
  const parts = cleaned.split('/');
  const monthPart = parts[0];
  const yearPart = parts[1];
  
  // Fall 1: Nur Ziffern ohne Schrägstrich
  if (parts.length === 1) {
    const digits = monthPart;
    
    if (digits.length <= 2) {
      // 1-2 Ziffern: könnte Monat sein
      if (digits.length === 1) {
        const num = parseInt(digits, 10);
        if (num >= 1 && num <= 9) {
          month = digits; // Noch nicht formatiert
          formatted = digits;
          isValid = true;
          isComplete = false;
        }
      } else if (digits.length === 2) {
        const num = parseInt(digits, 10);
        if (num >= 1 && num <= 12) {
          month = digits;
          formatted = digits + '/';
          isValid = true;
          isComplete = false;
        } else if (num >= 13 && num <= 99) {
          // Könnte Anfang eines Jahres sein
          year = digits;
          formatted = digits;
          isValid = true;
          isComplete = false;
        }
      }
    } else if (digits.length <= 4) {
      // 3-4 Ziffern: wahrscheinlich Jahr
      year = digits;
      formatted = digits;
      isValid = digits.length === 4 ? isValidYear(digits) : true;
      isComplete = digits.length === 4 && isValidYear(digits);
    }
  }
  
  // Fall 2: Mit Schrägstrich
  else if (parts.length === 2) {
    if (monthPart.length > 0 && monthPart.length <= 2) {
      const monthNum = parseInt(monthPart, 10);
      if (monthNum >= 1 && monthNum <= 12) {
        month = monthPart.length === 1 ? '0' + monthPart : monthPart;
      }
    }
    
    if (yearPart && yearPart.length > 0 && yearPart.length <= 4) {
      year = yearPart;
    }
    
    if (month && year) {
      formatted = `${month}/${year}`;
      isValid = isValidMonth(month) && (year.length === 4 ? isValidYear(year) : true);
      isComplete = isValidMonth(month) && year.length === 4 && isValidYear(year);
    } else if (month) {
      formatted = `${month}/`;
      isValid = true;
      isComplete = false;
    } else if (yearPart) {
      formatted = `/${yearPart}`;
      isValid = false;
      isComplete = false;
    }
  }
  
  return { month, year, formatted, isValid, isComplete };
}

/**
 * Formatiert Monat und Jahr zu MM/YYYY oder YYYY
 */
export function formatMonthYear(month?: string, year?: string): string {
  if (month && year) {
    const formattedMonth = month.length === 1 ? '0' + month : month;
    return `${formattedMonth}/${year}`;
  }
  if (year) {
    return year;
  }
  if (month) {
    const formattedMonth = month.length === 1 ? '0' + month : month;
    return `${formattedMonth}/`;
  }
  return '';
}