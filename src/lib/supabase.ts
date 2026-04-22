import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are not set. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file')
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
)

export type Database = {
  public: {
    Tables: {
      translations: {
        Row: {
          id: string
          language: string
          key: string
          value: string
          namespace: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          language: string
          key: string
          value: string
          namespace?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          language?: string
          key?: string
          value?: string
          namespace?: string
          created_at?: string
          updated_at?: string
        }
      }
      contact_submissions: {
        Row: {
          id: string
          name: string
          email: string
          company?: string
          phone?: string
          store_area?: number
          requirement_type?: string
          need_oem: boolean
          message: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          company?: string
          phone?: string
          store_area?: number
          requirement_type?: string
          need_oem?: boolean
          message: string
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          company?: string
          phone?: string
          store_area?: number
          requirement_type?: string
          need_oem?: boolean
          message?: string
          status?: string
          created_at?: string
        }
      }
    }
  }
}
