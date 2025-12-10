"use client"

import { useState, useEffect } from "react"
import { useAuth } from "./auth-context"
import { getExpenses } from "@/lib/storage"
import { type Expense, MONTHS, EXPENSE_CATEGORIES } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3, PieChartIcon, TrendingUp, Calendar, Wallet, ArrowUpRight, ArrowDownRight } from "lucide-react"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from "recharts"

const COLORS = [
  "hsl(150, 60%, 45%)",
  "hsl(95, 50%, 50%)",
  "hsl(35, 70%, 55%)",
  "hsl(200, 50%, 55%)",
  "hsl(280, 40%, 55%)",
  "hsl(10, 60%, 55%)",
  "hsl(180, 50%, 50%)",
  "hsl(60, 55%, 52%)",
  "hsl(320, 45%, 55%)",
  "hsl(120, 45%, 47%)",
  "hsl(45, 60%, 55%)",
]

export function AnnualSummary() {
  const { user } = useAuth()
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [selectedYear, setSelectedYear] = useState<number | null>(null)

  useEffect(() => {
    if (user) {
      setExpenses(getExpenses(user.id))
    }
  }, [user])

  // Initialize selectedYear on client mount to avoid SSR/client mismatch
  useEffect(() => {
    setSelectedYear((y) => y ?? new Date().getFullYear())
  }, [])

  // Don't render until selectedYear is initialized
  if (selectedYear === null) {
    return null
  }

  const yearExpenses = expenses.filter((e) => e.year === selectedYear)
  const yearTotal = yearExpenses.reduce((sum, e) => sum + e.amount, 0)

  const lastYearExpenses = expenses.filter((e) => e.year === selectedYear - 1)
  const lastYearTotal = lastYearExpenses.reduce((sum, e) => sum + e.amount, 0)
  const yearChange = lastYearTotal > 0 ? ((yearTotal - lastYearTotal) / lastYearTotal) * 100 : 0

  const monthlyData = MONTHS.map((month, index) => {
    const monthExpenses = yearExpenses.filter((e) => e.month === index + 1)
    const lastYearMonthExpenses = lastYearExpenses.filter((e) => e.month === index + 1)
    return {
      month: month.substring(0, 3),
      total: monthExpenses.reduce((sum, e) => sum + e.amount, 0),
      lastYear: lastYearMonthExpenses.reduce((sum, e) => sum + e.amount, 0),
    }
  })

  const categoryData = EXPENSE_CATEGORIES.map((category, index) => {
    const catExpenses = yearExpenses.filter((e) => e.category === category)
    const total = catExpenses.reduce((sum, e) => sum + e.amount, 0)
    return {
      name: category,
      value: total,
      color: COLORS[index % COLORS.length],
    }
  })
    .filter((c) => c.value > 0)
    .sort((a, b) => b.value - a.value)

  const years = Array.from({ length: 5 }, (_, i) => selectedYear - i)
  const averageMonthly = yearTotal / 12

  const maxMonth = monthlyData.length > 0
    ? monthlyData.reduce((max, m) => (m.total > max.total ? m : max), monthlyData[0])
    : { month: '-', total: 0 }

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Resumen Anual</h2>
          <p className="text-muted-foreground mt-1">Análisis detallado de tus gastos anuales</p>
        </div>
        <Select value={selectedYear.toString()} onValueChange={(v) => setSelectedYear(Number.parseInt(v))}>
          <SelectTrigger className="w-[140px] rounded-xl bg-card border-border text-foreground">
            <Calendar className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()} className="text-foreground">
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover-lift bg-card/90 backdrop-blur-lg border-border/50 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total {selectedYear}</p>
                <p className="text-3xl font-bold mt-2 text-primary">
                  {yearTotal.toLocaleString("es-ES", { minimumFractionDigits: 2 })} €
                </p>
                {lastYearTotal > 0 && (
                  <div
                    className={`flex items-center gap-1 mt-2 text-sm ${yearChange >= 0 ? "text-destructive" : "text-primary"}`}
                  >
                    {yearChange >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    <span>
                      {Math.abs(yearChange).toFixed(1)}% vs {selectedYear - 1}
                    </span>
                  </div>
                )}
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
                <p className="text-sm font-medium text-muted-foreground">Media mensual</p>
                <p className="text-3xl font-bold mt-2 text-foreground">
                  {averageMonthly.toLocaleString("es-ES", { minimumFractionDigits: 2 })} €
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  División: {(averageMonthly / 2).toLocaleString("es-ES", { minimumFractionDigits: 2 })} €
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift bg-card/90 backdrop-blur-lg border-border/50 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Mes más costoso</p>
                <p className="text-2xl font-bold mt-2 text-foreground">{maxMonth.month}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {maxMonth.total.toLocaleString("es-ES", { minimumFractionDigits: 2 })} €
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-destructive/20 flex items-center justify-center">
                <ArrowUpRight className="w-6 h-6 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift bg-card/90 backdrop-blur-lg border-border/50 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Nº de facturas</p>
                <p className="text-3xl font-bold mt-2 text-foreground">{yearExpenses.length}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  ~{Math.round(yearExpenses.length / 12)} facturas/mes
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-chart-3/20 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-chart-3" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-card/90 backdrop-blur-lg border-border/50 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <BarChart3 className="w-5 h-5 text-primary" />
              Gastos mensuales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(150, 60%, 45%)" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="hsl(150, 60%, 45%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    formatter={(value: number) => [
                      `${value.toLocaleString("es-ES", { minimumFractionDigits: 2 })} €`,
                      "Total",
                    ]}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "12px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      color: "hsl(var(--foreground))",
                    }}
                    labelStyle={{ color: "hsl(var(--foreground))" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="hsl(150, 60%, 45%)"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorTotal)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/90 backdrop-blur-lg border-border/50 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <PieChartIcon className="w-5 h-5 text-primary" />
              Distribución por categoría
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              {categoryData.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-4">
                      <PieChartIcon className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground">No hay datos para mostrar</p>
                  </div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={110}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => [
                        `${value.toLocaleString("es-ES", { minimumFractionDigits: 2 })} €`,
                      ]}
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "12px",
                        color: "hsl(var(--foreground))",
                      }}
                    />
                    <Legend
                      wrapperStyle={{ paddingTop: "20px" }}
                      formatter={(value) => <span style={{ color: "hsl(var(--foreground))" }}>{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card/90 backdrop-blur-lg border-border/50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <TrendingUp className="w-5 h-5 text-primary" />
            Desglose por categoría
          </CardTitle>
        </CardHeader>
        <CardContent>
          {categoryData.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No hay datos para mostrar</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categoryData.map((item) => (
                <div
                  key={item.name}
                  className="p-4 rounded-xl bg-secondary/50 hover:bg-secondary/70 transition-colors border border-border/30"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="font-medium text-foreground">{item.name}</span>
                  </div>
                  <div className="flex items-end justify-between">
                    <p className="text-2xl font-bold text-foreground">
                      {item.value.toLocaleString("es-ES", { minimumFractionDigits: 2 })} €
                    </p>
                    <span className="text-sm px-2 py-1 rounded-lg bg-background/80 text-muted-foreground border border-border/50">
                      {((item.value / yearTotal) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="mt-3 h-2 bg-background/80 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${(item.value / yearTotal) * 100}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
