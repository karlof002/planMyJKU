-- PlanMyJKU Database Schema for Supabase
-- Run this in the Supabase SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS "users" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "firstName" VARCHAR(255) NOT NULL,
    "lastName" VARCHAR(255) NOT NULL,
    "studentId" VARCHAR(255),
    "password" VARCHAR(255) NOT NULL,
    "isVerified" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email verification table
CREATE TABLE IF NOT EXISTS "email_verifications" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "code" VARCHAR(255) NOT NULL,
    "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Courses table
CREATE TABLE IF NOT EXISTS "courses" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "courseCode" VARCHAR(255) UNIQUE NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "ects" DECIMAL(4,2) NOT NULL,
    "semester" VARCHAR(10) NOT NULL,
    "faculty" VARCHAR(255) NOT NULL,
    "department" VARCHAR(255),
    "prerequisites" TEXT[] DEFAULT '{}',
    "language" VARCHAR(50) DEFAULT 'German',
    "courseType" VARCHAR(50) NOT NULL,
    "isActive" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Semesters table
CREATE TABLE IF NOT EXISTS "semesters" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "name" VARCHAR(255) NOT NULL,
    "year" INTEGER NOT NULL,
    "type" VARCHAR(10) NOT NULL,
    "isActive" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User courses table
CREATE TABLE IF NOT EXISTS "user_courses" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "courseId" UUID NOT NULL REFERENCES "courses"("id") ON DELETE CASCADE,
    "status" VARCHAR(50) NOT NULL,
    "grade" DECIMAL(3,2),
    "ects" DECIMAL(4,2),
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE("userId", "courseId")
);

-- Semester courses table
CREATE TABLE IF NOT EXISTS "semester_courses" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "semesterId" UUID NOT NULL REFERENCES "semesters"("id") ON DELETE CASCADE,
    "courseId" UUID NOT NULL REFERENCES "courses"("id") ON DELETE CASCADE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE("semesterId", "courseId")
);

-- Activities table
CREATE TABLE IF NOT EXISTS "activities" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "startTime" TIMESTAMP WITH TIME ZONE NOT NULL,
    "endTime" TIMESTAMP WITH TIME ZONE NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "color" VARCHAR(20) DEFAULT '#3b82f6',
    "courseId" UUID REFERENCES "courses"("id") ON DELETE SET NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Templates table
CREATE TABLE IF NOT EXISTS "templates" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "name" VARCHAR(255) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "type" VARCHAR(50) NOT NULL,
    "color" VARCHAR(20) DEFAULT '#3b82f6',
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activity types table
CREATE TABLE IF NOT EXISTS "activity_types" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "name" VARCHAR(255) NOT NULL,
    "color" VARCHAR(20) NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "idx_users_email" ON "users"("email");
CREATE INDEX IF NOT EXISTS "idx_courses_courseCode" ON "courses"("courseCode");
CREATE INDEX IF NOT EXISTS "idx_user_courses_userId" ON "user_courses"("userId");
CREATE INDEX IF NOT EXISTS "idx_user_courses_courseId" ON "user_courses"("courseId");
CREATE INDEX IF NOT EXISTS "idx_activities_userId" ON "activities"("userId");
CREATE INDEX IF NOT EXISTS "idx_activities_startTime" ON "activities"("startTime");
CREATE INDEX IF NOT EXISTS "idx_semesters_userId" ON "semesters"("userId");
CREATE INDEX IF NOT EXISTS "idx_semester_courses_semesterId" ON "semester_courses"("semesterId");

-- Insert some sample courses for JKU Informatik
INSERT INTO "courses" ("courseCode", "title", "description", "ects", "semester", "faculty", "courseType") VALUES
('326.081', 'Einführung in die Programmierung', 'Grundlagen der Programmierung mit Java', 6.0, 'WS', 'TNF', 'VU'),
('326.082', 'Datenstrukturen und Algorithmen', 'Grundlegende Datenstrukturen und Algorithmen', 6.0, 'SS', 'TNF', 'VU'),
('326.083', 'Softwareentwicklung', 'Methoden der Softwareentwicklung', 6.0, 'WS', 'TNF', 'VU'),
('326.084', 'Betriebssysteme', 'Grundlagen von Betriebssystemen', 6.0, 'SS', 'TNF', 'VU'),
('326.085', 'Datenbanken', 'Grundlagen von Datenbanksystemen', 6.0, 'WS', 'TNF', 'VU'),
('326.086', 'Web Engineering', 'Entwicklung von Webanwendungen', 6.0, 'SS', 'TNF', 'VU'),
('326.087', 'Machine Learning', 'Grundlagen des maschinellen Lernens', 6.0, 'WS', 'TNF', 'VU'),
('326.088', 'IT-Sicherheit', 'Grundlagen der IT-Sicherheit', 6.0, 'SS', 'TNF', 'VU')
ON CONFLICT ("courseCode") DO NOTHING;

-- Enable Row Level Security (RLS) for better security
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "activities" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "templates" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "activity_types" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "semesters" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "user_courses" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "semester_courses" ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (users can only access their own data)
CREATE POLICY "Users can view own profile" ON "users" FOR SELECT USING (id = auth.uid()::uuid);
CREATE POLICY "Users can update own profile" ON "users" FOR UPDATE USING (id = auth.uid()::uuid);

CREATE POLICY "Users can manage own activities" ON "activities" FOR ALL USING ("userId" = auth.uid()::uuid);
CREATE POLICY "Users can manage own templates" ON "templates" FOR ALL USING ("userId" = auth.uid()::uuid);
CREATE POLICY "Users can manage own activity types" ON "activity_types" FOR ALL USING ("userId" = auth.uid()::uuid);
CREATE POLICY "Users can manage own semesters" ON "semesters" FOR ALL USING ("userId" = auth.uid()::uuid);
CREATE POLICY "Users can manage own courses" ON "user_courses" FOR ALL USING ("userId" = auth.uid()::uuid);

-- Allow public read access to courses
CREATE POLICY "Anyone can view courses" ON "courses" FOR SELECT TO public USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updating timestamps
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON "users" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON "courses" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_semesters_updated_at BEFORE UPDATE ON "semesters" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_courses_updated_at BEFORE UPDATE ON "user_courses" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_semester_courses_updated_at BEFORE UPDATE ON "semester_courses" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_activities_updated_at BEFORE UPDATE ON "activities" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON "templates" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_activity_types_updated_at BEFORE UPDATE ON "activity_types" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
