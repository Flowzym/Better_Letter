/**
 * Utilities für Datumseingabe und -validierung
 * Komplett neu implementiert für robuste Eingabe
 */

export interface ParsedMonthYear {
  month?: string;
  year?: string;
  formatted: string;
  isValid: boolean;
  isComplete: boolean;
}

export interface RawParsedInput {
  monthPart: string;
  yearPart: string;
  hasSlash: boolean;
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
 * Validiert einen zweistelligen Monat (01-12)
 */
export function isValidTwoDigitMonth(month: string): boolean {
  if (month.length !== 2) return false;
  const num = parseInt(month, 10);
  return num >= 1 && num <= 12;
}

/**
 * Validiert ein vierstelliges Jahr (1900-2099)
 */
export function isValidFourDigitYear(year: string): boolean {
  if (year.length !== 4) return false;
  const num = parseInt(year, 10);
  return num >= 1900 && num <= 2099;
}

/**
 * Formatiert einen Monat mit führender Null
 */
export function formatMonth(month: string): string {
  if (!month) return '';
  if (month.length === 1) return '0' + month;
  return month;
}

/**
 * Parst rohe Eingabe ohne Formatierung
 */
export function parseRawMonthYearInput(input: string): RawParsedInput {
  // Nur Ziffern und Schrägstriche zulassen
  const cleaned = input.replace(/[^\d/]/g, '');
  
  const hasSlash = cleaned.includes('/');
  const parts = cleaned.split('/');
  
  let monthPart = '';
  let yearPart = '';
  
  if (hasSlash) {
    monthPart = parts[0] || '';
    yearPart = parts[1] || '';
  } else {
    // Ohne Schrägstrich: Entscheiden ob Monat oder Jahr
    if (cleaned.length <= 2) {
      monthPart = cleaned;
    } else {
      yearPart = cleaned;
    }
  }
  
  // Validierung
  let isValid = true;
  if (monthPart && monthPart.length === 2) {
    isValid = isValid && isValidTwoDigitMonth(monthPart);
  }
  if (yearPart && yearPart.length === 4) {
    isValid = isValid && isValidFourDigitYear(yearPart);
  }
  
  return {
    monthPart,
    yearPart,
    hasSlash,
    isValid
  };
}

/**
 * Parst eine MM/YYYY Eingabe und gibt strukturierte Daten zurück
 */
export function parseMonthYearInput(input: string): ParsedMonthYear {
  const raw = parseRawMonthYearInput(input);
  
  let month: string | undefined;
  let year: string | undefined;
  const formatted = input;
  const isValid = raw.isValid;
  let isComplete = false;
  
  // Monat verarbeiten
  if (raw.monthPart) {
    if (raw.monthPart.length === 2 && isValidTwoDigitMonth(raw.monthPart)) {
      month = raw.monthPart;
    } else if (raw.monthPart.length === 1) {
      const num = parseInt(raw.monthPart, 10);
      if (num >= 1 && num <= 9) {
        month = raw.monthPart; // Noch nicht formatiert
      }
    }
  }
  
  // Jahr verarbeiten
  if (raw.yearPart) {
    if (raw.yearPart.length === 4 && isValidFourDigitYear(raw.yearPart)) {
      year = raw.yearPart;
    } else if (raw.yearPart.length > 0 && raw.yearPart.length < 4) {
      year = raw.yearPart; // Unvollständig aber gültig
    }
  }
  
  // Vollständigkeit prüfen
  if (month && year && month.length === 2 && year.length === 4) {
    isComplete = isValidTwoDigitMonth(month) && isValidFourDigitYear(year);
  } else if (year && year.length === 4 && !month) {
    isComplete = isValidFourDigitYear(year);
  }
  
  return { month, year, formatted, isValid, isComplete };
}

/**
 * Formatiert Monat und Jahr zu MM/YYYY oder YYYY
 */
export function formatMonthYear(month?: string, year?: string): string {
  if (month && year) {
    const formattedMonth = formatMonth(month);
    return `${formattedMonth}/${year}`;
  }
  if (year) {
    return year;
  }
  if (month) {
    const formattedMonth = formatMonth(month);
    return formattedMonth;
  }
  return '';
}