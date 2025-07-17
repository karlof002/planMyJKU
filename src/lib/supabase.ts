import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database schema types for better TypeScript support
export interface Database {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string
                    email: string
                    firstName: string
                    lastName: string
                    studentId: string | null
                    password: string
                    isVerified: boolean
                    createdAt: string
                    updatedAt: string
                }
                Insert: {
                    id?: string
                    email: string
                    firstName: string
                    lastName: string
                    studentId?: string | null
                    password: string
                    isVerified?: boolean
                    createdAt?: string
                    updatedAt?: string
                }
                Update: {
                    id?: string
                    email?: string
                    firstName?: string
                    lastName?: string
                    studentId?: string | null
                    password?: string
                    isVerified?: boolean
                    createdAt?: string
                    updatedAt?: string
                }
            }
            courses: {
                Row: {
                    id: string
                    courseCode: string
                    title: string
                    description: string | null
                    ects: number
                    semester: string
                    faculty: string
                    department: string | null
                    prerequisites: string[]
                    language: string
                    courseType: string
                    isActive: boolean
                    createdAt: string
                    updatedAt: string
                }
                Insert: {
                    id?: string
                    courseCode: string
                    title: string
                    description?: string | null
                    ects: number
                    semester: string
                    faculty: string
                    department?: string | null
                    prerequisites?: string[]
                    language?: string
                    courseType: string
                    isActive?: boolean
                    createdAt?: string
                    updatedAt?: string
                }
                Update: {
                    id?: string
                    courseCode?: string
                    title?: string
                    description?: string | null
                    ects?: number
                    semester?: string
                    faculty?: string
                    department?: string | null
                    prerequisites?: string[]
                    language?: string
                    courseType?: string
                    isActive?: boolean
                    createdAt?: string
                    updatedAt?: string
                }
            }
            activities: {
                Row: {
                    id: string
                    userId: string
                    title: string
                    description: string | null
                    startTime: string
                    endTime: string
                    type: string
                    color: string
                    courseId: string | null
                    createdAt: string
                    updatedAt: string
                }
                Insert: {
                    id?: string
                    userId: string
                    title: string
                    description?: string | null
                    startTime: string
                    endTime: string
                    type: string
                    color?: string
                    courseId?: string | null
                    createdAt?: string
                    updatedAt?: string
                }
                Update: {
                    id?: string
                    userId?: string
                    title?: string
                    description?: string | null
                    startTime?: string
                    endTime?: string
                    type?: string
                    color?: string
                    courseId?: string | null
                    createdAt?: string
                    updatedAt?: string
                }
            }
        }
    }
}
