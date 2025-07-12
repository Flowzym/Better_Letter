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
 * @param selectionEnd - End-Position der Selektion vor der Änderung
 */
export function parseMonthYearInput(input: string, oldValue?: string, selectionStart?: number, selectionEnd?: number): ParsedMonthYear {
  // Nur Ziffern extrahieren, maximal 6 Zeichen
  const digits = input.replace(/\D/g, '').slice(0, 6);
  
  let month: string | undefined;
  let year: string | undefined;
  let formatted: string = '';
  let shouldMoveCursor = false;
  
  if (digits.length === 0) {
    return { formatted: '', isValid: false, shouldMoveCursor: false };
  }
  
  // --- Special handling for placeholder (e.g., "1." for single digit month) ---
  const wasMonthSelected = oldValue && oldValue.includes('/') && 
    selectionStart !== undefined && selectionEnd !== undefined &&
    selectionStart === 0 && selectionEnd === 2;
  
  if (wasMonthSelected && cleanedInput.length === 1 && parseInt(cleanedInput, 10) >= 0 && parseInt(cleanedInput, 10) <= 9) {
    // User typed a single digit while month was selected, create placeholder
    month = cleanedInput + '.';
    const oldParts = oldValue.split('/');
    year = oldParts[1] || ''; // Keep old year
    formatted = `${month}/${year}`;
    isValid = false; // Not a fully valid date yet
    return { month, year, formatted, isValid, shouldMoveCursor: false };
  }
  
  // If user types a second digit to complete a placeholder month (e.g., '1.' -> '11')
  if (oldValue && oldValue.includes('./') && cleanedInput.length === 2 && isValidMonth(cleanedInput)) {
    month = cleanedInput;
    const oldParts = oldValue.split('/');
    year = oldParts[1] || ''; // Keep old year
    formatted = `${month}/${year}`;
    isValid = isValidMonth(month) && isValidYear(year);
    shouldMoveCursor = true; // Move cursor after '/'
    return { month, year, formatted, isValid, shouldMoveCursor: true };
  }
  // --- End special handling ---

  const parts = cleanedInput.split('/');
  let monthPart = parts[0];
  let yearPart = parts[1];

  // Normal parsing logic for month
  if (monthPart.length === 2 && isValidMonth(monthPart)) {
    month = monthPart;
  } else if (monthPart.length === 1 && parseInt(monthPart, 10) > 1) { // e.g., user types '2', assume '02'
    month = '0' + monthPart;
  } else if (monthPart.length > 2) { // If more than 2 digits, assume it's part of the year or invalid month
    yearPart = monthPart; // Treat monthPart as year
    month = undefined;
  }

  // Normal parsing logic for year
  if (yearPart && yearPart.length <= 4) {
    year = yearPart;
  } else if (monthPart && monthPart.length <= 4 && !month) { // If month is not valid, treat monthPart as year
    year = monthPart;
    month = undefined;
  }

  // Construct formatted string
  if (month && year) {
    formatted = `${month}/${year}`;
    isValid = isValidMonth(month) && isValidYear(year);
  } else if (month) {
    formatted = `${month}/`;
    isValid = isValidMonth(month);
    shouldMoveCursor = true; // Suggest moving cursor after '/'
  } else if (year) {
    formatted = year;
    isValid = isValidYear(year);
  }

  // Final validation for year range
  if (year && year.length === 4) {
    const numYear = parseInt(year, 10);
    if (numYear < 1900 || numYear > 2099) {
      isValid = false; // Year out of range
    }
  }

  return { month, year, formatted, isValid, shouldMoveCursor };
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
  // If explicitly move cursor (e.g., after "/" for month)
  if (shouldMoveCursor && newValue.includes('/') && !oldValue.includes('/')) {
    return newValue.indexOf('/') + 1; // Cursor after '/'
  }

  // If a slash was added and cursor was after month part
  const hadSlash = oldValue.includes('/');
  const hasSlash = newValue.includes('/');

  if (!hadSlash && hasSlash && oldPosition > 2) {
    return oldPosition + 1;
  }

  // If a slash was removed
  if (hadSlash && !hasSlash && oldPosition > 2) {
    return oldPosition - 1;
  }

  // Handle placeholder dot
  if (newValue.includes('./') && !oldValue.includes('./')) {
    return newValue.indexOf('.') + 1; // Cursor after '.'
  }

  return Math.min(oldPosition, newValue.length);
}
    
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