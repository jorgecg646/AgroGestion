"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "./auth-context"
import { getExpensesAsync } from "@/lib/storage"
import { MONTHS, EXPENSE_CATEGORIES, type Expense } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Wallet, Calendar, PiggyBank, Receipt, Loader2 } from "lucide-react"

export function Dashboard() {
  const { user } = useAuth()
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState<Date | null>(null)

  const loadExpenses = useCallback(async () => {
    if (!user) return
    setIsLoading(true)
    try {
      const data = await getExpensesAsync(user.id)
      setExpenses(data)
    } catch (err) {
      console.error('Error loading expenses:', err)
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (user) {
      loadExpenses()
    }
  }, [user, loadExpenses])

  useEffect(() => {
    setCurrentDate(new Date())
  }, [])

  if (!currentDate) return null

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    )
  }

  const currentMonth = currentDate.getMonth() + 1
  const currentYear = currentDate.getFullYear()

  const thisMonthExpenses = expenses.filter((e) => e.month === currentMonth && e.year === currentYear)
  const thisMonthTotal = thisMonthExpenses.reduce((sum, e) => sum + e.amount, 0)

  const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1
  const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear
  const lastMonthExpenses = expenses.filter((e) => e.month === lastMonth && e.year === lastMonthYear)
  const lastMonthTotal = lastMonthExpenses.reduce((sum, e) => sum + e.amount, 0)

  const yearExpenses = expenses.filter((e) => e.year === currentYear)
  const yearTotal = yearExpenses.reduce((sum, e) => sum + e.amount, 0)

  const percentChange = lastMonthTotal > 0 ? ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100 : 0

  const categoryTotals = EXPENSE_CATEGORIES.map((cat) => ({
    category: cat,
    total: yearExpenses.filter((e) => e.category === cat).reduce((sum, e) => sum + e.amount, 0),
  }))
    .filter((c) => c.total > 0)
    .sort((a, b) => b.total - a.total)

  const topCategory = categoryTotals[0]

  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate()
  const avgDailyExpense = thisMonthTotal / currentDate.getDate()

  return (
    <div className="space-y-8 animate-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground">
            {currentDate.getHours() < 12
              ? "Buenos días"
              : currentDate.getHours() < 20
                ? "Buenas tardes"
                : "Buenas noches"}
            , {user?.name?.split(" ")[0]}
          </h2>
          <p className="text-muted-foreground mt-1">
            {user?.farmName} • {MONTHS[currentMonth - 1]} {currentYear}
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/80 px-4 py-2 rounded-xl border border-border/50">
          <Calendar className="w-4 h-4" />
          <span>{currentDate.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })}</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover-lift bg-card/90 backdrop-blur-lg border-border/50 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Gastos este mes</p>
                <p className="text-3xl font-bold mt-2 text-foreground">
                  {thisMonthTotal.toLocaleString("es-ES", { minimumFractionDigits: 2 })} €
                </p>
                <p className="text-xs text-muted-foreground mt-1">{thisMonthExpenses.length} facturas</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift bg-card/90 backdrop-blur-lg border-border/50 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">vs. Mes anterior</p>
                <p className={`text-3xl font-bold mt-2 ${percentChange >= 0 ? "text-destructive" : "text-primary"}`}>
                  {percentChange >= 0 ? "+" : ""}
                  {percentChange.toFixed(1)}%
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {lastMonthTotal.toLocaleString("es-ES", { minimumFractionDigits: 2 })} € en {MONTHS[lastMonth - 1]}
                </p>
              </div>
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${percentChange >= 0 ? "bg-destructive/20" : "bg-primary/20"}`}
              >
                {percentChange >= 0 ? (
                  <TrendingUp className="w-6 h-6 text-destructive" />
                ) : (
                  <TrendingDown className="w-6 h-6 text-primary" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift bg-card/90 backdrop-blur-lg border-border/50 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total anual</p>
                <p className="text-3xl font-bold mt-2 text-foreground">
                  {yearTotal.toLocaleString("es-ES", { minimumFractionDigits: 2 })} €
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {yearExpenses.length} facturas en {currentYear}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift bg-card/90 backdrop-blur-lg border-border/50 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Mayor gasto</p>
                <p className="text-2xl font-bold mt-2 text-foreground truncate">
                  {topCategory ? topCategory.category : "-"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {topCategory
                    ? `${topCategory.total.toLocaleString("es-ES", { minimumFractionDigits: 2 })} €`
                    : "Sin datos"}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-warning/20 flex items-center justify-center">
                <PiggyBank className="w-6 h-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card/90 backdrop-blur-lg border-border/50 shadow-lg">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Receipt className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Media diaria este mes</p>
                <p className="text-xl font-bold text-foreground">
                  {avgDailyExpense.toLocaleString("es-ES", { minimumFractionDigits: 2 })} €/día
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Proyección mensual</p>
              <p className="text-xl font-bold text-muted-foreground">
                {(avgDailyExpense * daysInMonth).toLocaleString("es-ES", { minimumFractionDigits: 2 })} €
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-card/90 backdrop-blur-lg border-border/50 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between text-foreground">
              <span className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-primary" />
                Últimas facturas
              </span>
              <span className="text-sm font-normal text-muted-foreground">{MONTHS[currentMonth - 1]}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {thisMonthExpenses.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-4">
                  <Receipt className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">No hay facturas este mes</p>
                <p className="text-sm text-muted-foreground mt-1">Añade tu primer gasto</p>
              </div>
            ) : (
              <div className="space-y-3">
                {thisMonthExpenses.slice(0, 5).map((expense, i) => (
                  <div
                    key={expense.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-secondary/50 hover:bg-secondary/70 transition-colors gap-2"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                        {i + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-foreground truncate">{expense.description}</p>
                        <p className="text-xs text-muted-foreground">{expense.category}</p>
                      </div>
                    </div>
                    <span className="font-semibold text-foreground text-right sm:text-left ml-13 sm:ml-0">
                      {expense.amount.toLocaleString("es-ES", { minimumFractionDigits: 2 })} €
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card/90 backdrop-blur-lg border-border/50 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-foreground">
              <PiggyBank className="w-5 h-5 text-primary" />
              Gastos por categoría
            </CardTitle>
          </CardHeader>
          <CardContent>
            {categoryTotals.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-4">
                  <PiggyBank className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">No hay datos este año</p>
              </div>
            ) : (
              <div className="space-y-4">
                {categoryTotals.slice(0, 5).map((item, i) => {
                  const colors = ["bg-primary", "bg-accent", "bg-chart-3", "bg-chart-4", "bg-chart-5"]
                  return (
                    <div key={item.category}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">{item.category}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-foreground">
                            {item.total.toLocaleString("es-ES", { minimumFractionDigits: 2 })} €
                          </span>
                          <span className="text-xs text-muted-foreground px-2 py-0.5 bg-secondary rounded-full">
                            {((item.total / yearTotal) * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${colors[i % colors.length]}`}
                          style={{ width: `${(item.total / yearTotal) * 100}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
