// import * as cheerio from 'cheerio' // Für zukünftige Scraping-Funktionalität;

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
            // const $ = cheerio.load(html); // Unused for now

            // Hier würde der spezifische Parser für die JKU-Seite kommen
            // Da die Struktur komplex ist, ist es besser, die Daten manuell zu sammeln
            console.log(`Fetched ${html.length} characters from ${url}`);
        }

    } catch (error) {
        console.error('Error scraping JKU courses:', error);
    }

    return courses;
}

// Vordefinierte Informatik-Kurse basierend auf dem JKU Studienplan
export function getJKUInformatikCourses(): Course[] {
    return [
        // Bachelor Informatik - 1. Semester
        {
            courseCode: "326.001",
            title: "Mathematik 1 für Informatik",
            ects: 6,
            semester: "WS",
            courseType: "VU",
            description: "Grundlagen der Mathematik für Informatiker",
            faculty: "Informatik",
            department: "TNF",
            language: "Deutsch"
        },
        {
            courseCode: "326.002",
            title: "Einführung in die Programmierung",
            ects: 4,
            semester: "WS",
            courseType: "VU",
            description: "Grundlagen der Programmierung mit Java",
            faculty: "Informatik",
            department: "TNF",
            language: "Deutsch"
        },
        {
            courseCode: "326.003",
            title: "Programmierung",
            ects: 6,
            semester: "WS",
            courseType: "VU",
            description: "Vertiefung der Programmierkenntnisse",
            faculty: "Informatik",
            department: "TNF",
            language: "Deutsch"
        },
        {
            courseCode: "326.004",
            title: "Formale Methoden der Informatik",
            ects: 4,
            semester: "WS",
            courseType: "VU",
            description: "Mathematische Grundlagen der Informatik",
            faculty: "Informatik",
            department: "TNF",
            language: "Deutsch"
        },

        // Bachelor Informatik - 2. Semester
        {
            courseCode: "326.011",
            title: "Mathematik 2 für Informatik",
            ects: 6,
            semester: "SS",
            courseType: "VU",
            description: "Fortsetzung der mathematischen Grundlagen",
            faculty: "Informatik",
            department: "TNF",
            language: "Deutsch"
        },
        {
            courseCode: "326.012",
            title: "Algorithmen und Datenstrukturen 1",
            ects: 6,
            semester: "SS",
            courseType: "VU",
            description: "Grundlegende Algorithmen und Datenstrukturen",
            faculty: "Informatik",
            department: "TNF",
            language: "Deutsch"
        },
        {
            courseCode: "326.013",
            title: "Objektorientierte Programmierung",
            ects: 4,
            semester: "SS",
            courseType: "VU",
            description: "OOP-Konzepte und Design Patterns",
            faculty: "Informatik",
            department: "TNF",
            language: "Deutsch"
        },
        {
            courseCode: "326.014",
            title: "Computertechnik",
            ects: 4,
            semester: "SS",
            courseType: "VU",
            description: "Grundlagen der Computerhardware",
            faculty: "Informatik",
            department: "TNF",
            language: "Deutsch"
        },

        // Bachelor Informatik - 3. Semester  
        {
            courseCode: "326.021",
            title: "Algorithmen und Datenstrukturen 2",
            ects: 6,
            semester: "WS",
            courseType: "VU",
            description: "Erweiterte Algorithmen und Datenstrukturen",
            faculty: "Informatik",
            department: "TNF",
            language: "Deutsch"
        },
        {
            courseCode: "326.022",
            title: "Betriebssysteme",
            ects: 4,
            semester: "WS",
            courseType: "VU",
            description: "Grundlagen von Betriebssystemen",
            faculty: "Informatik",
            department: "TNF",
            language: "Deutsch"
        },
        {
            courseCode: "326.023",
            title: "Datenbanken 1",
            ects: 4,
            semester: "WS",
            courseType: "VU",
            description: "Relationale Datenbanken und SQL",
            faculty: "Informatik",
            department: "TNF",
            language: "Deutsch"
        },
        {
            courseCode: "326.024",
            title: "Softwareentwicklung",
            ects: 6,
            semester: "WS",
            courseType: "VU",
            description: "Software Engineering Prinzipien",
            faculty: "Informatik",
            department: "TNF",
            language: "Deutsch"
        },

        // Bachelor Informatik - 4. Semester
        {
            courseCode: "326.031",
            title: "Theoretische Informatik",
            ects: 6,
            semester: "SS",
            courseType: "VU",
            description: "Automaten, Sprachen und Berechenbarkeit",
            faculty: "Informatik",
            department: "TNF",
            language: "Deutsch"
        },
        {
            courseCode: "326.032",
            title: "Rechnernetze",
            ects: 4,
            semester: "SS",
            courseType: "VU",
            description: "Netzwerkprotokolle und -architekturen",
            faculty: "Informatik",
            department: "TNF",
            language: "Deutsch"
        },
        {
            courseCode: "326.033",
            title: "Human Computer Interaction",
            ects: 4,
            semester: "SS",
            courseType: "VU",
            description: "Benutzeroberflächen und Usability",
            faculty: "Informatik",
            department: "TNF",
            language: "Deutsch"
        },
        {
            courseCode: "326.034",
            title: "Compilerbau",
            ects: 4,
            semester: "SS",
            courseType: "VU",
            description: "Übersetzer und Sprachverarbeitung",
            faculty: "Informatik",
            department: "TNF",
            language: "Deutsch"
        },

        // Master Informatik - Weitere Kurse
        {
            courseCode: "326.051",
            title: "Advanced Algorithms",
            ects: 6,
            semester: "WS",
            courseType: "VU",
            description: "Fortgeschrittene Algorithmen und Komplexität",
            faculty: "Informatik",
            department: "TNF",
            language: "English"
        },
        {
            courseCode: "326.052",
            title: "Machine Learning",
            ects: 6,
            semester: "SS",
            courseType: "VU",
            description: "Grundlagen des maschinellen Lernens",
            faculty: "Informatik",
            department: "TNF",
            language: "English"
        },
        {
            courseCode: "326.053",
            title: "Distributed Systems",
            ects: 4,
            semester: "WS",
            courseType: "VU",
            description: "Verteilte Systeme und Parallelverarbeitung",
            faculty: "Informatik",
            department: "TNF",
            language: "English"
        },
        {
            courseCode: "326.054",
            title: "Software Architecture",
            ects: 4,
            semester: "SS",
            courseType: "VU",
            description: "Entwurf großer Softwaresysteme",
            faculty: "Informatik",
            department: "TNF",
            language: "English"
        },

        // Wahlpflichtfächer
        {
            courseCode: "326.061",
            title: "Web Engineering",
            ects: 4,
            semester: "WS",
            courseType: "VU",
            description: "Entwicklung von Webanwendungen",
            faculty: "Informatik",
            department: "TNF",
            language: "Deutsch"
        },
        {
            courseCode: "326.062",
            title: "Mobile Computing",
            ects: 4,
            semester: "SS",
            courseType: "VU",
            description: "Entwicklung mobiler Anwendungen",
            faculty: "Informatik",
            department: "TNF",
            language: "Deutsch"
        },
        {
            courseCode: "326.063",
            title: "Computer Graphics",
            ects: 4,
            semester: "WS",
            courseType: "VU",
            description: "3D-Grafik und Visualisierung",
            faculty: "Informatik",
            department: "TNF",
            language: "English"
        },
        {
            courseCode: "326.064",
            title: "Artificial Intelligence",
            ects: 6,
            semester: "SS",
            courseType: "VU",
            description: "Künstliche Intelligenz und Expertensysteme",
            faculty: "Informatik",
            department: "TNF",
            language: "English"
        }
    ];
}
