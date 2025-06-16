/**
 * Definiert die verschiedenen Typen von Nachrichten, die gesendet werden können.
 */
export enum MessageType {
    PING = 'PING',
    GET_DATA = 'GET_DATA',
    PROCESS_TEXT = 'PROCESS_TEXT',
    // Fügen Sie hier weitere Nachrichtentypen hinzu
}

/**
 * Basisstruktur für alle gesendeten Nachrichten.
 */
export interface BaseMessage {
    type: MessageType;
    payload?: any; // Optionale Daten, die mit der Nachricht gesendet werden
}

/**
 * Struktur für die Antwort auf eine Nachricht.
 */
export interface ResponseMessage {
    success: boolean; // Zeigt an, ob die Operation erfolgreich war
    data?: any;      // Optionale Daten im Erfolgsfall
    error?: string;  // Fehlermeldung im Fehlerfall
}