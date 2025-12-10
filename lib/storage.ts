import type { User, Expense } from "./types"

const USERS_KEY = "agrogestion_users"
const CURRENT_USER_KEY = "agrogestion_current_user"
const EXPENSES_KEY = "agrogestion_expenses"

export function getUsers(): User[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(USERS_KEY)
  return data ? JSON.parse(data) : []
}

export function saveUser(user: User): void {
  const users = getUsers()
  const existingIndex = users.findIndex((u) => u.id === user.id)
  if (existingIndex >= 0) {
    users[existingIndex] = user
  } else {
    users.push(user)
  }
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function findUserByEmail(email: string): User | undefined {
  return getUsers().find((u) => u.email === email)
}

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

export function getExpenses(userId: string): Expense[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(EXPENSES_KEY)
  const allExpenses: Expense[] = data ? JSON.parse(data) : []
  return allExpenses.filter((e) => e.userId === userId)
}

export function saveExpense(expense: Expense): void {
  const data = localStorage.getItem(EXPENSES_KEY)
  const allExpenses: Expense[] = data ? JSON.parse(data) : []
  const existingIndex = allExpenses.findIndex((e) => e.id === expense.id)
  if (existingIndex >= 0) {
    allExpenses[existingIndex] = expense
  } else {
    allExpenses.push(expense)
  }
  localStorage.setItem(EXPENSES_KEY, JSON.stringify(allExpenses))
}

export function deleteExpense(expenseId: string): void {
  const data = localStorage.getItem(EXPENSES_KEY)
  const allExpenses: Expense[] = data ? JSON.parse(data) : []
  const filtered = allExpenses.filter((e) => e.id !== expenseId)
  localStorage.setItem(EXPENSES_KEY, JSON.stringify(filtered))
}
