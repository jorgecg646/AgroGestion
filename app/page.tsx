"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { AuthProvider, useAuth } from "@/components/auth-context"
import { LoginForm } from "@/components/login-form"
import { Navbar } from "@/components/navbar"
import { ExpensesManager } from "@/components/expenses-manager"
import { Leaf } from "lucide-react"

// Lazy load heavy components to reduce initial bundle size
const Dashboard = dynamic(() => import("@/components/dashboard").then(mod => ({ default: mod.Dashboard })), {
  loading: () => <div className="flex items-center justify-center p-8"><div className="animate-pulse">Cargando...</div></div>,
  ssr: false,
})

const AnnualSummary = dynamic(() => import("@/components/annual-summary").then(mod => ({ default: mod.AnnualSummary })), {
  loading: () => <div className="flex items-center justify-center p-8"><div className="animate-pulse">Cargando...</div></div>,
  ssr: false,
})

const FarmMap = dynamic(() => import("@/components/farm-map").then(mod => ({ default: mod.FarmMap })), {
  loading: () => <div className="flex items-center justify-center p-8"><div className="animate-pulse">Cargando mapa...</div></div>,
  ssr: false,
})

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
