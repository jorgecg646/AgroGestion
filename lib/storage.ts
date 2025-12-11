import type { User, Expense } from "./types"
import { supabase, type DbExpense } from "./supabase"

const CURRENT_USER_KEY = "agrogestion_current_user"

// ============ USER FUNCTIONS (localStorage - for session persistence) ============

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null
  const data = localStorage.getItem(CURRENT_USER_KEY)
  return data ? JSON.parse(data) : null
}

export function setCurrentUser(user: User | null): void {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
  } else {
    localStorage.removeItem(CURRENT_USER_KEY)
  }
}

export function saveUser(user: User): void {
  // Users are managed by Netlify Identity, we just store locally for session
  setCurrentUser(user)
}

export function findUserByEmail(email: string): User | undefined {
  const currentUser = getCurrentUser()
  return currentUser?.email === email ? currentUser : undefined
}

// ============ EXPENSE FUNCTIONS (Supabase) ============

// Convert database expense to app expense
function dbToExpense(db: DbExpense): Expense {
  return {
    id: db.id,
    userId: db.user_id,
    description: db.description,
    invoiceNumber: db.invoice_number,
    amount: Number(db.amount),
    category: db.category,
    date: db.date,
    month: db.month,
    year: db.year,
  }
}

// Convert app expense to database expense
function expenseToDb(expense: Expense): Omit<DbExpense, 'created_at' | 'updated_at'> {
  return {
    id: expense.id,
    user_id: expense.userId,
    description: expense.description,
    invoice_number: expense.invoiceNumber,
    amount: expense.amount,
    category: expense.category,
    date: expense.date,
    month: expense.month,
    year: expense.year,
  }
}

export async function getExpensesAsync(userId: string): Promise<Expense[]> {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching expenses:', error)
    return []
  }

  return (data || []).map(dbToExpense)
}

export async function saveExpenseAsync(expense: Expense): Promise<boolean> {
  const dbExpense = expenseToDb(expense)

  const { error } = await supabase
    .from('expenses')
    .upsert(dbExpense, { onConflict: 'id' })

  if (error) {
    console.error('Error saving expense:', error)
    return false
  }

  return true
}

export async function deleteExpenseAsync(expenseId: string): Promise<boolean> {
  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', expenseId)

  if (error) {
    console.error('Error deleting expense:', error)
    return false
  }

  return true
}

// ============ LEGACY SYNC FUNCTIONS (for backwards compatibility during migration) ============

// These are kept for backwards compatibility but now return empty/noop
export function getExpenses(_userId: string): Expense[] {
  console.warn('getExpenses is deprecated, use getExpensesAsync instead')
  return []
}

export function saveExpense(_expense: Expense): void {
  console.warn('saveExpense is deprecated, use saveExpenseAsync instead')
}

export function deleteExpense(_expenseId: string): void {
  console.warn('deleteExpense is deprecated, use deleteExpenseAsync instead')
}

// Legacy user functions (no longer used but kept for compatibility)
export function getUsers(): User[] {
  return []
}
