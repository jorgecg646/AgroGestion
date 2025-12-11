import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface DbExpense {
    id: string
    user_id: string
    description: string
    invoice_number: string
    amount: number
    category: string
    date: string
    month: number
    year: number
    created_at?: string
    updated_at?: string
}
