const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedCourses() {
    const courses = [
        {
            courseCode: "326.081",
            title: "Programmierung 1",
            description: "Grundlagen der Programmierung mit Java. Einführung in objektorientierte Programmierung, Datenstrukturen und Algorithmen.",
            ects: 6.0,
            semester: "WS",
            faculty: "Technisch-Naturwissenschaftliche Fakultät",
            department: "Institut für Informatik",
            prerequisites: [],
            language: "German",
            courseType: "VU"
        },
        {
            courseCode: "326.082",
            title: "Programmierung 2",
            description: "Vertiefung der Programmierung. Fortgeschrittene Konzepte der objektorientierten Programmierung, Design Patterns und Softwarearchitektur.",
            ects: 6.0,
            semester: "SS",
            faculty: "Technisch-Naturwissenschaftliche Fakultät",
            department: "Institut für Informatik",
            prerequisites: ["326.081"],
            language: "German",
            courseType: "VU"
        },
        {
            courseCode: "326.083",
            title: "Algorithmen und Datenstrukturen",
            description: "Systematische Einführung in wichtige Algorithmen und Datenstrukturen. Analyse von Komplexität und Effizienz.",
            ects: 6.0,
            semester: "WS",
            faculty: "Technisch-Naturwissenschaftliche Fakultät",
            department: "Institut für Informatik",
            prerequisites: ["326.081"],
            language: "German",
            courseType: "VU"
        },
        {
            courseCode: "326.084",
            title: "Datenbanken",
            description: "Grundlagen relationaler Datenbanken, SQL, Datenbankdesign und -optimierung.",
            ects: 4.5,
            semester: "SS",
            faculty: "Technisch-Naturwissenschaftliche Fakultät",
            department: "Institut für Informatik",
            prerequisites: ["326.081"],
            language: "German",
            courseType: "VU"
        },
        {
            courseCode: "326.085",
            title: "Betriebssysteme",
            description: "Grundlagen von Betriebssystemen, Prozesse, Threads, Speicherverwaltung und Dateisysteme.",
            ects: 6.0,
            semester: "WS",
            faculty: "Technisch-Naturwissenschaftliche Fakultät",
            department: "Institut für Informatik",
            prerequisites: ["326.081"],
            language: "German",
            courseType: "VU"
        },
        {
            courseCode: "326.086",
            title: "Web Engineering",
            description: "Moderne Webtechnologien, HTML, CSS, JavaScript, Node.js und Web-Frameworks.",
            ects: 4.5,
            semester: "SS",
            faculty: "Technisch-Naturwissenschaftliche Fakultät",
            department: "Institut für Informatik",
            prerequisites: ["326.082"],
            language: "German",
            courseType: "VU"
        },
        {
            courseCode: "326.087",
            title: "Software Engineering",
            description: "Methoden und Werkzeuge der Softwareentwicklung, Projektmanagement, Testing und Qualitätssicherung.",
            ects: 6.0,
            semester: "WS",
            faculty: "Technisch-Naturwissenschaftliche Fakultät",
            department: "Institut für Informatik",
            prerequisites: ["326.082"],
            language: "German",
            courseType: "VU"
        },
        {
            courseCode: "326.088",
            title: "Künstliche Intelligenz",
            description: "Grundlagen der KI, maschinelles Lernen, neuronale Netzwerke und ihre Anwendungen.",
            ects: 6.0,
            semester: "SS",
            faculty: "Technisch-Naturwissenschaftliche Fakultät",
            department: "Institut für Informatik",
            prerequisites: ["326.083"],
            language: "German",
            courseType: "VU"
        },
        {
            courseCode: "326.089",
            title: "Mobile Computing",
            description: "Entwicklung mobiler Anwendungen für Android und iOS, UI/UX Design für mobile Geräte.",
            ects: 4.5,
            semester: "WS",
            faculty: "Technisch-Naturwissenschaftliche Fakultät",
            department: "Institut für Informatik",
            prerequisites: ["326.086"],
            language: "German",
            courseType: "VU"
        },
        {
            courseCode: "326.090",
            title: "IT-Sicherheit",
            description: "Grundlagen der IT-Sicherheit, Kryptographie, Netzwerksicherheit und Sicherheitsmanagement.",
            ects: 4.5,
            semester: "SS",
            faculty: "Technisch-Naturwissenschaftliche Fakultät",
            department: "Institut für Informatik",
            prerequisites: ["326.085"],
            language: "German",
            courseType: "VU"
        },
        // Mathematics courses
        {
            courseCode: "326.001",
            title: "Mathematik 1",
            description: "Grundlagen der Mathematik für Informatiker: Analysis, Lineare Algebra und Diskrete Mathematik.",
            ects: 6.0,
            semester: "WS",
            faculty: "Technisch-Naturwissenschaftliche Fakultät",
            department: "Institut für Mathematik",
            prerequisites: [],
            language: "German",
            courseType: "VU"
        },
        {
            courseCode: "326.002",
            title: "Mathematik 2",
            description: "Vertiefung der Mathematik: Wahrscheinlichkeitstheorie, Statistik und numerische Methoden.",
            ects: 6.0,
            semester: "SS",
            faculty: "Technisch-Naturwissenschaftliche Fakultät",
            department: "Institut für Mathematik",
            prerequisites: ["326.001"],
            language: "German",
            courseType: "VU"
        },
        // Business courses
        {
            courseCode: "640.001",
            title: "Grundlagen der Betriebswirtschaft",
            description: "Einführung in die Betriebswirtschaftslehre, Unternehmensführung und Management.",
            ects: 3.0,
            semester: "WS",
            faculty: "Sozial- und Wirtschaftswissenschaftliche Fakultät",
            department: "Institut für Betriebswirtschaft",
            prerequisites: [],
            language: "German",
            courseType: "VO"
        },
        {
            courseCode: "640.002",
            title: "Projektmanagement",
            description: "Methoden und Werkzeuge des Projektmanagements, Agile Methoden und Scrum.",
            ects: 3.0,
            semester: "SS",
            faculty: "Sozial- und Wirtschaftswissenschaftliche Fakultät",
            department: "Institut für Betriebswirtschaft",
            prerequisites: ["640.001"],
            language: "German",
            courseType: "VU"
        },
        // Law courses
        {
            courseCode: "730.001",
            title: "Rechtsinformatik",
            description: "Rechtliche Aspekte der Informatik, Datenschutz, Urheberrecht und IT-Recht.",
            ects: 3.0,
            semester: "WS",
            faculty: "Rechtswissenschaftliche Fakultät",
            department: "Institut für Rechtsinformatik",
            prerequisites: [],
            language: "German",
            courseType: "VO"
        }
    ];

    console.log('Seeding courses...');

    for (const course of courses) {
        try {
            await prisma.course.create({
                data: course
            });
            console.log(`✅ Created course: ${course.courseCode} - ${course.title}`);
        } catch (error) {
            console.log(`❌ Error creating course ${course.courseCode}:`, error.message);
        }
    }

    console.log('Seeding completed!');
}

async function main() {
    try {
        await seedCourses();
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
