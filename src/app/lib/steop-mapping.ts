// StEOP Kurse Mapping für JKU Informatik
export const STEOP_REQUIRED_COURSES = [
    "VL.ALGEBRA",    // Algebra für Informatik (3 ECTS)
    "VL.ADS1",       // Algorithmen und Datenstrukturen 1 (3 ECTS) 
    "VL.DB1",        // Datenbanken und Informationssysteme 1 (3 ECTS)
    "VL.DIGITAL",    // Digitale Schaltungen (3 ECTS)
    "VL.ELEKTRONIK", // Elektronik (3 ECTS)
    "VL.LOGIC",      // Logic (3 ECTS)
    "VL.MULTIMEDIA", // Multimediasysteme (3 ECTS)
    "VL.SOFTDEV1"    // Softwareentwicklung 1 (3 ECTS)
];

export const STEOP_ALLOWED_COURSES = [
    "UE.ALGEBRA",     // Algebra für Informatik (3 ECTS)
    "UE.ADS1",        // Algorithmen und Datenstrukturen 1 (1.5 ECTS)
    "VL.ANALYSIS",    // Analysis für Informatik (3 ECTS)
    "UE.ANALYSIS",    // Analysis für Informatik (3 ECTS)
    "UE.BS",          // Betriebssysteme (1.5 ECTS)
    "VL.BS",          // Betriebssysteme (3 ECTS)
    "UE.DB1",         // Datenbanken und Informationssysteme 1 (3 ECTS)
    "UE.DIGITAL",     // Digitale Schaltungen (1.5 ECTS)
    "UE.DISKRETE",    // Diskrete Strukturen (1.5 ECTS)
    "VL.DISKRETE",    // Diskrete Strukturen (3 ECTS)
    "UE.ELEKTRONIK",  // Elektronik (1.5 ECTS)
    "KV.ETHIK",       // Ethik und Gender Studies (3 ECTS)
    "UE.LOGIC",       // Logic (1.5 ECTS)
    "UE.MULTIMEDIA",  // Multimediasysteme (1.5 ECTS)
    "KV.PROP",        // Propädeutikum (1.5 ECTS)
    "KV.PRAESENT",    // Präsentations- und Arbeitstechnik (3 ECTS)
    "VL.RECHTS",      // Rechtsgrundlagen der Informatik (3 ECTS)
    "UE.SOFTDEV1",    // Softwareentwicklung 1 (3 ECTS)
    "UE.SOFTDEV2",    // Softwareentwicklung 2 (3 ECTS)
    "VL.SOFTDEV2",    // Softwareentwicklung 2 (3 ECTS)
    "VL.STATISTIK",   // Statistik (3 ECTS)
    "UE.STATISTIK",   // Statistik
    // Weitere begleitende Kurse
    "KV.ETHIK_GENDER", // Ethik und Gender Studies  
    "KV.PROJEKT_ORG",  // Projektorganisation
    "VL.WIRTSCHAFT"    // Wirtschaftsgrundlagen der Informatik
];

// Hilfsfunktion um StEOP Status zu bestimmen
export function getSteopStatus(courseCode: string) {
    return {
        isSteopRequired: STEOP_REQUIRED_COURSES.includes(courseCode),
        isSteopAllowed: STEOP_ALLOWED_COURSES.includes(courseCode)
    };
}
