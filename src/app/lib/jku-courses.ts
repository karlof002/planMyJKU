import * as cheerio from 'cheerio';

interface Course {
  courseCode: string;
  title: string;
  ects: number;
  semester: string;
  courseType: string;
  description?: string;
  faculty: string;
  department?: string;
  language: string;
}

// JKU Informatik Kurse scraper
export async function scrapeJKUInformatikCourses(): Promise<Course[]> {
  const courses: Course[] = [];

  try {
    // Verschiedene URLs für Informatik-LVAs
    const urls = [
      'https://www.jku.at/studium/studienangebot/studien/bachelor/informatik/',
      'https://www.jku.at/studium/studienangebot/studien/master/informatik/',
      // Weitere URLs können hier hinzugefügt werden
    ];

    for (const url of urls) {
      const response = await fetch(url);
      const html = await response.text();
      const $ = cheerio.load(html);

      // Hier würde der spezifische Parser für die JKU-Seite kommen
      // Da die Struktur komplex ist, ist es besser, die Daten manuell zu sammeln
    }

  } catch (error) {
    console.error('Error scraping JKU courses:', error);
  }

  return courses;
}

// Echte JKU Informatik-Kurse basierend auf dem offiziellen Studienplan
export function getJKUInformatikCourses(): Course[] {
  return [
    // Propädeutikum
    {
      courseCode: "KV.PROP",
      title: "Propädeutikum",
      ects: 1.5,
      semester: "WS",
      courseType: "KV",
      description: "Einführung in das Informatikstudium",
      faculty: "Informatik",
      department: "TNF",
      language: "Deutsch"
    },

    // Theorie (36 ECTS)
    {
      courseCode: "UE.ALGEBRA",
      title: "Algebra für Informatik",
      ects: 3,
      semester: "WS",
      courseType: "UE",
      description: "Übungen zur Algebra für Informatik",
      faculty: "Informatik",
      department: "TNF",
      language: "Deutsch"
    },
    {
      courseCode: "VL.ALGEBRA",
      title: "Algebra für Informatik",
      ects: 3,
      semester: "WS",
      courseType: "VL",
      description: "Algebraische Grundlagen der Informatik",
      faculty: "Informatik",
      department: "TNF",
      language: "Deutsch"
    },
    {
      courseCode: "UE.ANALYSIS",
      title: "Analysis für Informatik",
      ects: 3,
      semester: "SS",
      courseType: "UE",
      description: "Übungen zur Analysis für Informatik",
      faculty: "Informatik",
      department: "TNF",
      language: "Deutsch"
    },
    {
      courseCode: "VL.ANALYSIS",
      title: "Analysis für Informatik",
      ects: 3,
      semester: "SS",
      courseType: "VL",
      description: "Mathematische Analysis für Informatiker",
      faculty: "Informatik",
      department: "TNF",
      language: "Deutsch"
    },
    {
      courseCode: "UE.BERECHENB",
      title: "Berechenbarkeit und Komplexität",
      ects: 1.5,
      semester: "WS",
      courseType: "UE",
      description: "Übungen zu Berechenbarkeit und Komplexität",
      faculty: "Informatik",
      department: "TNF",
      language: "Deutsch"
    },
    {
      courseCode: "VL.BERECHENB",
      title: "Berechenbarkeit und Komplexität",
      ects: 3,
      semester: "WS",
      courseType: "VL",
      description: "Theoretische Grundlagen der Berechenbarkeit",
      faculty: "Informatik",
      department: "TNF",
      language: "Deutsch"
    },
    {
      courseCode: "UE.DISKRETE",
      title: "Diskrete Strukturen",
      ects: 1.5,
      semester: "WS",
      courseType: "UE",
      description: "Übungen zu diskreten Strukturen",
      faculty: "Informatik",
      department: "TNF",
      language: "Deutsch"
    },
    {
      courseCode: "VL.DISKRETE",
      title: "Diskrete Strukturen",
      ects: 3,
      semester: "WS",
      courseType: "VL",
      description: "Mathematische diskrete Strukturen",
      faculty: "Informatik",
      department: "TNF",
      language: "Deutsch"
    },
    {
      courseCode: "UE.FORMAL",
      title: "Formal Models",
      ects: 1.5,
      semester: "SS",
      courseType: "UE",
      description: "Übungen zu formalen Modellen",
      faculty: "Informatik",
      department: "TNF",
      language: "English"
    },
    {
      courseCode: "VL.FORMAL",
      title: "Formal Models",
      ects: 3,
      semester: "SS",
      courseType: "VL",
      description: "Formale Modelle der Informatik",
      faculty: "Informatik",
      department: "TNF",
      language: "English"
    },
    {
      courseCode: "UE.LOGIC",
      title: "Logic",
      ects: 1.5,
      semester: "SS",
      courseType: "UE",
      description: "Übungen zur Logik",
      faculty: "Informatik",
      department: "TNF",
      language: "English"
    },
    {
      courseCode: "VL.LOGIC",
      title: "Logic",
      ects: 3,
      semester: "SS",
      courseType: "VL",
      description: "Mathematische Logik",
      faculty: "Informatik",
      department: "TNF",
      language: "English"
    },
    {
      courseCode: "UE.STATISTIK",
      title: "Statistik",
      ects: 3,
      semester: "SS",
      courseType: "UE",
      description: "Übungen zur Statistik",
      faculty: "Informatik",
      department: "TNF",
      language: "Deutsch"
    },
    {
      courseCode: "VL.STATISTIK",
      title: "Statistik",
      ects: 3,
      semester: "SS",
      courseType: "VL",
      description: "Statistik für Informatiker",
      faculty: "Informatik",
      department: "TNF",
      language: "Deutsch"
    },

    // Hardware (19.5 ECTS)
    {
      courseCode: "UE.RECHNERARCH",
      title: "Rechnerarchitektur",
      ects: 1.5,
      semester: "WS",
      courseType: "UE",
      description: "Übungen zur Rechnerarchitektur",
      faculty: "Informatik",
      department: "TNF",
      language: "Deutsch"
    },
    {
      courseCode: "VL.RECHNERARCH",
      title: "Rechnerarchitektur",
      ects: 4.5,
      semester: "WS",
      courseType: "VL",
      description: "Aufbau und Architektur von Computern",
      faculty: "Informatik",
      department: "TNF",
      language: "Deutsch"
    },
    {
      courseCode: "UE.DIGITAL",
      title: "Digitale Schaltungen",
      ects: 1.5,
      semester: "SS",
      courseType: "UE",
      description: "Übungen zu digitalen Schaltungen",
      faculty: "Informatik",
      department: "TNF",
      language: "Deutsch"
    },
    {
      courseCode: "VL.DIGITAL",
      title: "Digitale Schaltungen",
      ects: 3,
      semester: "SS",
      courseType: "VL",
      description: "Grundlagen digitaler Schaltungen",
      faculty: "Informatik",
      department: "TNF",
      language: "Deutsch"
    },
    {
      courseCode: "UE.DSP",
      title: "Digital Signal Processing",
      ects: 1.5,
      semester: "WS",
      courseType: "UE",
      description: "Übungen zur digitalen Signalverarbeitung",
      faculty: "Informatik",
      department: "TNF",
      language: "English"
    },
    {
      courseCode: "VL.DSP",
      title: "Digital Signal Processing",
      ects: 3,
      semester: "WS",
      courseType: "VL",
      description: "Digitale Signalverarbeitung",
      faculty: "Informatik",
      department: "TNF",
      language: "English"
    },
    {
      courseCode: "UE.ELEKTRONIK",
      title: "Elektronik",
      ects: 1.5,
      semester: "SS",
      courseType: "UE",
      description: "Übungen zur Elektronik",
      faculty: "Informatik",
      department: "TNF",
      language: "Deutsch"
    },
    {
      courseCode: "VL.ELEKTRONIK",
      title: "Elektronik",
      ects: 3,
      semester: "SS",
      courseType: "VL",
      description: "Grundlagen der Elektronik",
      faculty: "Informatik",
      department: "TNF",
      language: "Deutsch"
    },

    // Software (31.5 ECTS)
    {
      courseCode: "UE.ADS1",
      title: "Algorithmen und Datenstrukturen 1",
      ects: 1.5,
      semester: "WS",
      courseType: "UE",
      description: "Übungen zu Algorithmen und Datenstrukturen 1",
      faculty: "Informatik",
      department: "TNF",
      language: "Deutsch"
    },
    {
      courseCode: "VL.ADS1",
      title: "Algorithmen und Datenstrukturen 1",
      ects: 3,
      semester: "WS",
      courseType: "VL",
      description: "Grundlegende Algorithmen und Datenstrukturen",
      faculty: "Informatik",
      department: "TNF",
      language: "Deutsch"
    },
    {
      courseCode: "UE.ADS2",
      title: "Algorithmen und Datenstrukturen 2",
      ects: 1.5,
      semester: "SS",
      courseType: "UE",
      description: "Übungen zu Algorithmen und Datenstrukturen 2",
      faculty: "Informatik",
      department: "TNF",
      language: "Deutsch"
    },
    {
      courseCode: "VL.ADS2",
      title: "Algorithmen und Datenstrukturen 2",
      ects: 3,
      semester: "SS",
      courseType: "VL",
      description: "Erweiterte Algorithmen und Datenstrukturen",
      faculty: "Informatik",
      department: "TNF",
      language: "Deutsch"
    },
    {
      courseCode: "PR.SOFTDEV2",
      title: "Praktikum aus Softwareentwicklung 2",
      ects: 3,
      semester: "SS",
      courseType: "PR",
      description: "Praktikum zur Softwareentwicklung",
      faculty: "Informatik",
      department: "TNF",
      language: "Deutsch"
    },
    {
      courseCode: "UE.SE",
      title: "Software Engineering",
      ects: 1.5,
      semester: "WS",
      courseType: "UE",
      description: "Übungen zum Software Engineering",
      faculty: "Informatik",
      department: "TNF",
      language: "Deutsch"
    },
    {
      courseCode: "VL.SE",
      title: "Software Engineering",
      ects: 3,
      semester: "WS",
      courseType: "VL",
      description: "Grundlagen des Software Engineering",
      faculty: "Informatik",
      department: "TNF",
      language: "Deutsch"
    },
    {
      courseCode: "UE.SOFTDEV1",
      title: "Softwareentwicklung 1",
      ects: 3,
      semester: "WS",
      courseType: "UE",
      description: "Übungen zur Softwareentwicklung 1",
      faculty: "Informatik",
      department: "TNF",
      language: "Deutsch"
    },
    {
      courseCode: "VL.SOFTDEV1",
      title: "Softwareentwicklung 1",
      ects: 3,
      semester: "WS",
      courseType: "VL",
      description: "Grundlagen der Softwareentwicklung",
      faculty: "Informatik",
      department: "TNF",
      language: "Deutsch"
    },
    {
      courseCode: "UE.SOFTDEV2",
      title: "Softwareentwicklung 2",
      ects: 3,
      semester: "SS",
      courseType: "UE",
      description: "Übungen zur Softwareentwicklung 2",
      faculty: "Informatik",
      department: "TNF",
      language: "Deutsch"
    },
    {
      courseCode: "VL.SOFTDEV2",
      title: "Softwareentwicklung 2",
      ects: 3,
      semester: "SS",
      courseType: "VL",
      description: "Erweiterte Softwareentwicklung",
      faculty: "Informatik",
      department: "TNF",
      language: "Deutsch"
    },
    {
      courseCode: "UE.SYSPROG",
      title: "Systems Programming",
      ects: 1.5,
      semester: "SS",
      courseType: "UE",
      description: "Übungen zur Systemprogrammierung",
      faculty: "Informatik",
      department: "TNF",
      language: "English"
    },
    {
      courseCode: "VL.SYSPROG",
      title: "Systems Programming",
      ects: 1.5,
      semester: "SS",
      courseType: "VL",
      description: "Systemprogrammierung",
      faculty: "Informatik",
      department: "TNF",
      language: "English"
    },

    // Systeme (24 ECTS)
    {
      courseCode: "UE.BS",
      title: "Betriebssysteme",
      ects: 1.5,
      semester: "WS",
      courseType: "UE",
      description: "Übungen zu Betriebssystemen",
      faculty: "Informatik",
      department: "TNF",
      language: "Deutsch"
    },
    {
      courseCode: "VL.BS",
      title: "Betriebssysteme",
      ects: 3,
      semester: "WS",
      courseType: "VL",
      description: "Grundlagen von Betriebssystemen",
      faculty: "Informatik",
      department: "TNF",
      language: "Deutsch"
    },
    {
      courseCode: "UE.EMBEDDED",
      title: "Embedded and Pervasive Systems",
      ects: 1.5,
      semester: "SS",
      courseType: "UE",
      description: "Übungen zu Embedded Systems",
      faculty: "Informatik",
      department: "TNF",
      language: "English"
    },
    {
      courseCode: "VL.EMBEDDED",
      title: "Embedded and Pervasive Systems",
      ects: 3,
      semester: "SS",
      courseType: "VL",
      description: "Eingebettete und pervasive Systeme",
      faculty: "Informatik",
      department: "TNF",
      language: "English"
    },
    {
      courseCode: "UE.MULTIMEDIA",
      title: "Multimediasysteme",
      ects: 1.5,
      semester: "WS",
      courseType: "UE",
      description: "Übungen zu Multimediasystemen",
      faculty: "Informatik",
      department: "TNF",
      language: "Deutsch"
    },
    {
      courseCode: "VL.MULTIMEDIA",
      title: "Multimediasysteme",
      ects: 3,
      semester: "WS",
      courseType: "VL",
      description: "Multimedia-Technologien und -Systeme",
      faculty: "Informatik",
      department: "TNF",
      language: "Deutsch"
    },
    {
      courseCode: "UE.NETWORKS",
      title: "Computernetzwerke",
      ects: 1.5,
      semester: "SS",
      courseType: "UE",
      description: "Übungen zu Computernetzwerken",
      faculty: "Informatik",
      department: "TNF",
      language: "Deutsch"
    },
    {
      courseCode: "VL.NETWORKS",
      title: "Computernetzwerke",
      ects: 3,
      semester: "SS",
      courseType: "VL",
      description: "Netzwerkprotokolle und -architekturen",
      faculty: "Informatik",
      department: "TNF",
      language: "Deutsch"
    },
    {
      courseCode: "UE.COMPILER",
      title: "Compilerbau",
      ects: 3,
      semester: "WS",
      courseType: "UE",
      description: "Übungen zum Compilerbau",
      faculty: "Informatik",
      department: "TNF",
      language: "Deutsch"
    },
    {
      courseCode: "VL.COMPILER",
      title: "Compilerbau",
      ects: 3,
      semester: "WS",
      courseType: "VL",
      description: "Übersetzer und Sprachverarbeitung",
      faculty: "Informatik",
      department: "TNF",
      language: "Deutsch"
    },

    // Anwendungen (22.5 ECTS)
    {
      courseCode: "UE.AI",
      title: "Artificial Intelligence",
      ects: 1.5,
      semester: "SS",
      courseType: "UE",
      description: "Übungen zur Künstlichen Intelligenz",
      faculty: "Informatik",
      department: "TNF",
      language: "English"
    },
    {
      courseCode: "VL.AI",
      title: "Artificial Intelligence",
      ects: 3,
      semester: "SS",
      courseType: "VL",
      description: "Künstliche Intelligenz und Expertensysteme",
      faculty: "Informatik",
      department: "TNF",
      language: "English"
    },
    {
      courseCode: "VL.ML_INTRO",
      title: "Introduction to Machine Learning",
      ects: 3,
      semester: "WS",
      courseType: "VL",
      description: "Einführung in maschinelles Lernen",
      faculty: "Informatik",
      department: "TNF",
      language: "English"
    },
    {
      courseCode: "UE.CG",
      title: "Computer Graphics",
      ects: 1.5,
      semester: "WS",
      courseType: "UE",
      description: "Übungen zur Computergrafik",
      faculty: "Informatik",
      department: "TNF",
      language: "English"
    },
    {
      courseCode: "VL.CG",
      title: "Computer Graphics",
      ects: 3,
      semester: "WS",
      courseType: "VL",
      description: "3D-Grafik und Visualisierung",
      faculty: "Informatik",
      department: "TNF",
      language: "English"
    },
    {
      courseCode: "UE.DB1",
      title: "Datenbanken und Informationssysteme 1",
      ects: 3,
      semester: "WS",
      courseType: "UE",
      description: "Übungen zu Datenbanken 1",
      faculty: "Informatik",
      department: "TNF",
      language: "Deutsch"
    },
    {
      courseCode: "VL.DB1",
      title: "Datenbanken und Informationssysteme 1",
      ects: 3,
      semester: "WS",
      courseType: "VL",
      description: "Relationale Datenbanken und SQL",
      faculty: "Informatik",
      department: "TNF",
      language: "Deutsch"
    },
    {
      courseCode: "UE.DB2",
      title: "Datenbanken und Informationssysteme 2",
      ects: 1.5,
      semester: "SS",
      courseType: "UE",
      description: "Übungen zu Datenbanken 2",
      faculty: "Informatik",
      department: "TNF",
      language: "Deutsch"
    },
    {
      courseCode: "VL.DB2",
      title: "Datenbanken und Informationssysteme 2",
      ects: 3,
      semester: "SS",
      courseType: "VL",
      description: "Erweiterte Datenbanktechnologien",
      faculty: "Informatik",
      department: "TNF",
      language: "Deutsch"
    },

    // Bachelorarbeit
    {
      courseCode: "PR.PROJEKT",
      title: "Projektpraktikum",
      ects: 7.5,
      semester: "WS",
      courseType: "PR",
      description: "Projektpraktikum zur Bachelorarbeit",
      faculty: "Informatik",
      department: "TNF",
      language: "Deutsch"
    }
  ];
}
