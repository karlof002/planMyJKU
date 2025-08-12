# 🎓 planMyJKU – Study Planning Platform for JKU Linz

A comprehensive **Next.js 15** web application designed for students at **Johannes Kepler University (JKU) Linz** to organize courses, plan semesters, and track academic progress — with a special focus on **StEOP (Studieneingangs- und Orientierungsphase)** support.

---

## 🌟 Features

### 📚 Course Catalog
- Advanced search and filtering by **faculty**, **semester**, **course type**, and **StEOP status**.
- Detailed course info including **ECTS points**, descriptions, and prerequisites.
- **Color-coded StEOP integration** for easy identification.

### 📅 Semester Management
- Create **individual semesters** (WS/SS) with year specification.
- **Drag-and-drop course planning** interface.
- Automatic **ECTS total calculation** per semester.
- Status management for active/inactive semesters.

### 📊 Study Progress Tracking
- Dashboard overview with **progress visualization**.
- Statistics for ECTS distribution.
- Visual indicators for achievements and milestones.
- Goal management for academic targets.

### 📆 Calendar Integration
- Full semester calendar overview.
- Appointment and activity management.
- **Recurring event templates**.
- Timeline view for visual semester layout.

### 🟥🟩⚪ StEOP Support
- **Red** = StEOP-mandatory  
- **Green** = StEOP-allowed  
- **Gray** = Post-StEOP  
- Intelligent filtering by StEOP categories.
- Progress tracking toward StEOP completion.

---

## 🛠 Tech Stack

- **Frontend:** Next.js 15 + TypeScript
- **Styling:** Tailwind CSS with Dark/Light mode
- **Database:** Prisma ORM with PostgreSQL / SQLite
- **Authentication:** Custom JWT-based auth
- **Deployment:** Vercel-ready configuration

---

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+
- PostgreSQL or SQLite database

### **Installation**
```bash
# Clone repository
git clone https://github.com/karlof002/planMyJKU.git
cd planMyJKU

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Fill in DATABASE_URL, JWT_SECRET, etc.

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
