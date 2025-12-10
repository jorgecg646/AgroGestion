"use client"

import { useState, useEffect } from "react"
import { AuthProvider, useAuth } from "@/components/auth-context"
import { LoginForm } from "@/components/login-form"
import { Navbar } from "@/components/navbar"
import { Dashboard } from "@/components/dashboard"
import { ExpensesManager } from "@/components/expenses-manager"
import { AnnualSummary } from "@/components/annual-summary"
import { FarmMap } from "@/components/farm-map"
import { Leaf } from "lucide-react"

function AppContent() {
  const { user, isLoading } = useAuth()
  const [currentView, setCurrentView] = useState("expenses")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Mientras se carga, mostrar el loading screen
  if (isLoading || !mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Leaf className="w-8 h-8 text-primary-foreground" />
          </div>
          <p className="text-muted-foreground">Cargando AgroGestión...</p>
        </div>
      </div>
    )
  }

  // Si no hay usuario, mostrar login
  if (!user) {
    return <LoginForm />
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar currentView={currentView} onViewChange={setCurrentView} />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {currentView === "dashboard" && <Dashboard />}
        {currentView === "expenses" && <ExpensesManager />}
        {currentView === "annual" && <AnnualSummary />}
        {currentView === "map" && <FarmMap />}
      </main>
    </div>
  )
}

export default function Home() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
