"use client"

import type React from "react"
import { useState, useEffect, useMemo, useCallback } from "react"
import { useAuth } from "./auth-context"
import { getExpensesAsync, saveExpenseAsync, deleteExpenseAsync } from "@/lib/storage"
import { generateMonthlyPDF } from "@/lib/pdf-generator"
import { type Expense, EXPENSE_CATEGORIES, MONTHS } from "@/lib/types"
import { Button, Input, Label } from "@/components/ui/form-elements"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, FileDown, Trash2, Pencil, Search, Receipt, ChevronLeft, ChevronRight, Filter, Loader2, RefreshCw } from "lucide-react"

export function ExpensesManager() {
  const { user } = useAuth()
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null)
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadExpenses = useCallback(async () => {
    if (!user) return
    setIsLoading(true)
    setError(null)
    try {
      const data = await getExpensesAsync(user.id)
      setExpenses(data)
    } catch (err) {
      console.error('Error loading expenses:', err)
      setError('Error al cargar los gastos. Intenta refrescar la página.')
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (user) {
      loadExpenses()
    }
  }, [user, loadExpenses])

  // Initialize month/year only on client mount to avoid SSR/client mismatch
  useEffect(() => {
    setSelectedMonth((m) => m ?? new Date().getMonth() + 1)
    setSelectedYear((y) => y ?? new Date().getFullYear())
  }, [])

  const filteredExpenses = useMemo(() => {
    return expenses
      .filter((e) => e.month === selectedMonth && e.year === selectedYear)
      .filter((e) => filterCategory === "all" || e.category === filterCategory)
      .filter(
        (e) =>
          searchTerm === "" ||
          e.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          e.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
  }, [expenses, selectedMonth, selectedYear, searchTerm, filterCategory])

  const total = filteredExpenses.reduce((sum, e) => sum + e.amount, 0)

  if (selectedYear == null || selectedMonth == null) return null

  const goToPreviousMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12)
      setSelectedYear(selectedYear - 1)
    } else {
      setSelectedMonth(selectedMonth - 1)
    }
  }

  const goToNextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1)
      setSelectedYear(selectedYear + 1)
    } else {
      setSelectedMonth(selectedMonth + 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!user) return

    setIsSaving(true)
    setError(null)

    const formData = new FormData(e.currentTarget)

    const expense: Expense = {
      id: editingExpense?.id || crypto.randomUUID(),
      userId: user.id,
      description: formData.get("description") as string,
      invoiceNumber: formData.get("invoiceNumber") as string,
      amount: Number.parseFloat(formData.get("amount") as string),
      category: formData.get("category") as string,
      date: new Date().toISOString().split("T")[0],
      month: selectedMonth,
      year: selectedYear,
    }

    const success = await saveExpenseAsync(expense)

    if (success) {
      await loadExpenses()
      setIsDialogOpen(false)
      setEditingExpense(null)
    } else {
      setError('Error al guardar el gasto. Inténtalo de nuevo.')
    }

    setIsSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!user) return

    const success = await deleteExpenseAsync(id)
    if (success) {
      await loadExpenses()
    } else {
      setError('Error al eliminar el gasto.')
    }
  }

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense)
    setIsDialogOpen(true)
  }

  const handleDownloadPDF = () => {
    if (!user) return
    const monthExpenses = expenses.filter((e) => e.month === selectedMonth && e.year === selectedYear)
    generateMonthlyPDF(monthExpenses, selectedMonth, selectedYear, user.farmName)
  }

  const years = selectedYear
    ? Array.from({ length: 7 }, (_, i) => selectedYear - 3 + i)
    : []

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Gestión de Gastos</h2>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              Añade, edita y exporta tus gastos mensuales
            </p>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="icon"
              onClick={loadExpenses}
              disabled={isLoading}
              className="rounded-xl border-border"
              title="Refrescar datos"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>

            <Dialog
              open={isDialogOpen}
              onOpenChange={(open) => {
                setIsDialogOpen(open)
                if (!open) setEditingExpense(null)
              }}
            >
              <DialogTrigger asChild>
                <Button className="gradient-primary hover:opacity-90 rounded-xl gap-2 flex-1 sm:flex-none text-primary-foreground">
                  <Plus className="w-5 h-5" />
                  Añadir gasto
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md mx-4 bg-card border-border">
                <DialogHeader>
                  <DialogTitle className="text-xl text-foreground">
                    {editingExpense ? "Editar gasto" : "Nuevo gasto"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-5 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-foreground">
                      Descripción
                    </Label>
                    <Input
                      id="description"
                      name="description"
                      defaultValue={editingExpense?.description}
                      placeholder="Ej: Transporte lechones"
                      required
                      className="h-12 rounded-xl bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="invoiceNumber" className="text-foreground">
                        Nº Factura
                      </Label>
                      <Input
                        id="invoiceNumber"
                        name="invoiceNumber"
                        defaultValue={editingExpense?.invoiceNumber}
                        placeholder="12345"
                        className="h-12 rounded-xl bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="amount" className="text-foreground">
                        Importe (€)
                      </Label>
                      <Input
                        id="amount"
                        name="amount"
                        type="number"
                        step="0.01"
                        defaultValue={editingExpense?.amount}
                        placeholder="0.00"
                        required
                        className="h-12 rounded-xl bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-foreground">
                      Categoría
                    </Label>
                    <Select name="category" defaultValue={editingExpense?.category || EXPENSE_CATEGORIES[0]}>
                      <SelectTrigger className="h-12 rounded-xl bg-secondary/50 border-border text-foreground">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        {EXPENSE_CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat} className="text-foreground">
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-12 rounded-xl gradient-primary hover:opacity-90 text-primary-foreground"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      editingExpense ? "Guardar cambios" : "Añadir gasto"
                    )}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive text-sm p-4 rounded-xl border border-destructive/20 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-destructive" />
            {error}
          </div>
        )}

        <Card className="bg-card/90 backdrop-blur-lg border-border/50 shadow-lg">
          <CardContent className="py-4">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={goToPreviousMonth}
                  className="rounded-xl shrink-0 text-foreground hover:bg-secondary"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <div className="flex items-center gap-2">
                  <Select value={selectedMonth?.toString() ?? ""} onValueChange={(v) => setSelectedMonth(Number.parseInt(v))}>
                    <SelectTrigger className="w-[120px] sm:w-[140px] rounded-xl border-0 bg-secondary/80 text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {MONTHS.map((month, i) => (
                        <SelectItem key={i} value={(i + 1).toString()} className="text-foreground">
                          {month}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedYear?.toString() ?? ""} onValueChange={(v) => setSelectedYear(Number.parseInt(v))}>
                    <SelectTrigger className="w-[90px] sm:w-[100px] rounded-xl border-0 bg-secondary/80 text-foreground">
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
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={goToNextMonth}
                  className="rounded-xl shrink-0 text-foreground hover:bg-secondary"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 rounded-xl border-0 bg-secondary/80 text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-full sm:w-[140px] rounded-xl border-0 bg-secondary/80 text-foreground">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Categoría" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="all" className="text-foreground">
                      Todas
                    </SelectItem>
                    {EXPENSE_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat} className="text-foreground">
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card/90 backdrop-blur-lg border-border/50 shadow-lg">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-foreground">
            <Receipt className="w-5 h-5 text-primary" />
            <span className="hidden sm:inline">Facturas de </span>
            <span className="sm:hidden">{selectedMonth ? MONTHS[selectedMonth - 1].substring(0, 3) + '.' : ''} </span>
            <span className="hidden sm:inline">{selectedMonth ? MONTHS[selectedMonth - 1] : ''} </span>
            {selectedYear}
            <span className="text-sm font-normal text-muted-foreground ml-2">({filteredExpenses.length})</span>
          </CardTitle>
          <Button
            variant="outline"
            onClick={handleDownloadPDF}
            disabled={filteredExpenses.length === 0}
            className="rounded-xl gap-2 bg-card border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-colors w-full sm:w-auto"
          >
            <FileDown className="w-4 h-4" />
            Descargar PDF
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">
              <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Cargando gastos...</p>
            </div>
          ) : filteredExpenses.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-4">
                <Receipt className="w-10 h-10 text-muted-foreground" />
              </div>
              <p className="text-lg font-medium text-foreground">No hay gastos registrados</p>
              <p className="text-muted-foreground mt-1">Añade tu primer gasto para empezar</p>
            </div>
          ) : (
            <>
              <div className="hidden sm:block overflow-x-auto rounded-xl border border-border/50">
                <table className="w-full">
                  <thead>
                    <tr className="bg-secondary/50">
                      <th className="text-left p-3 font-semibold text-sm text-foreground">Descripción</th>
                      <th className="text-left p-3 font-semibold text-sm text-foreground">Nº Factura</th>
                      <th className="text-left p-3 font-semibold text-sm text-foreground">Categoría</th>
                      <th className="text-right p-3 font-semibold text-sm text-foreground">Importe</th>
                      <th className="text-right p-3 font-semibold text-sm text-foreground">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredExpenses.map((expense) => (
                      <tr key={expense.id} className="border-t border-border/30 hover:bg-secondary/30">
                        <td className="p-3 font-medium text-foreground">{expense.description}</td>
                        <td className="p-3 text-muted-foreground">{expense.invoiceNumber || "-"}</td>
                        <td className="p-3">
                          <span className="px-2 py-1 rounded-lg bg-primary/20 text-primary text-xs font-medium">
                            {expense.category}
                          </span>
                        </td>
                        <td className="p-3 text-right font-semibold text-foreground">
                          {expense.amount.toLocaleString("es-ES", { minimumFractionDigits: 2 })} €
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(expense)}
                              className="rounded-lg hover:bg-primary/20 hover:text-primary h-8 w-8"
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(expense.id)}
                              className="rounded-lg hover:bg-destructive/20 hover:text-destructive h-8 w-8"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="sm:hidden space-y-3">
                {filteredExpenses.map((expense) => (
                  <div key={expense.id} className="p-4 rounded-xl border border-border/50 bg-secondary/30">
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-start gap-2">
                        <p className="font-medium text-foreground flex-1 break-words">{expense.description}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {expense.invoiceNumber ? `Nº ${expense.invoiceNumber}` : "Sin número"}
                      </p>
                      <p className="font-bold text-xl text-primary">
                        {expense.amount.toLocaleString("es-ES", { minimumFractionDigits: 2 })} €
                      </p>
                    </div>
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-border/30">
                      <span className="px-2 py-1 rounded-lg bg-primary/20 text-primary text-xs font-medium">
                        {expense.category}
                      </span>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(expense)}
                          className="rounded-lg hover:bg-primary/20 hover:text-primary h-8 w-8"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(expense.id)}
                          className="rounded-lg hover:bg-destructive/20 hover:text-destructive h-8 w-8"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 sm:p-6 rounded-xl bg-secondary/50 border border-border/50">
                <div className="flex flex-col gap-4">
                  <div className="text-center sm:text-left">
                    <p className="text-sm text-muted-foreground mb-1">Total del mes</p>
                    <p className="text-2xl sm:text-3xl font-bold text-foreground break-all">
                      {total.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                    </p>
                  </div>
                  <div className="h-px w-full bg-border" />
                  <div className="text-center sm:text-left">
                    <p className="text-sm text-muted-foreground mb-1">División (Total ÷ 2)</p>
                    <p className="text-xl sm:text-2xl font-bold text-primary break-all">
                      {(total / 2).toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
