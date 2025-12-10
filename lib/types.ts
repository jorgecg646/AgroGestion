export interface User {
  id: string
  name: string
  email: string
  farmName: string
  location?: {
    lat: number
    lng: number
  }
}

export interface Expense {
  id: string
  userId: string
  description: string
  invoiceNumber: string
  amount: number
  category: string
  date: string
  month: number
  year: number
}

export interface MonthlyReport {
  month: number
  year: number
  expenses: Expense[]
  total: number
}

export const EXPENSE_CATEGORIES = [
  "Transporte",
  "Seguros",
  "Sanidad Animal",
  "Suministros",
  "Combustible",
  "Alimentación Animal",
  "Maquinaria",
  "Veterinario",
  "Semillas",
  "Fertilizantes",
  "Otros",
] as const

export const MONTHS = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
]
