"use client"

import { useAuth } from "./auth-context"
import { Button } from "@/components/ui/form-elements"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Leaf, User, LogOut, Menu, LayoutDashboard, Receipt, BarChart3, MapPin, Moon, Sun } from "lucide-react"
import { useState, useEffect } from "react"

interface NavbarProps {
  currentView: string
  onViewChange: (view: string) => void
}

export function Navbar({ currentView, onViewChange }: NavbarProps) {
  const { user, logout } = useAuth()
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const dark = document.documentElement.classList.contains("dark")
    setIsDark(dark)
  }, [])

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark")
    setIsDark(!isDark)
  }

  const navItems = [
    { id: "expenses", label: "Gastos", icon: Receipt },
    { id: "dashboard", label: "Panel", icon: LayoutDashboard },
    { id: "annual", label: "Resumen Anual", icon: BarChart3 },
    { id: "map", label: "Mapa", icon: MapPin },
  ]

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-xl border-b border-border">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl gradient-primary">
            <Leaf className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground hidden sm:block">AgroGestión</span>
        </div>

        <nav className="hidden md:flex items-center gap-1 bg-secondary/80 p-1 rounded-xl border border-border/50">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.id}
                variant={currentView === item.id ? "default" : "ghost"}
                size="sm"
                onClick={() => onViewChange(item.id)}
                className={`gap-2 rounded-lg transition-all ${
                  currentView === item.id
                    ? "gradient-primary text-primary-foreground shadow-md"
                    : "text-foreground hover:bg-primary/20 hover:text-primary"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Button>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-xl hover:bg-secondary text-foreground"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden rounded-xl hover:bg-secondary">
                <Menu className="h-5 w-5 text-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-card border-border">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <DropdownMenuItem
                    key={item.id}
                    onClick={() => onViewChange(item.id)}
                    className="gap-2 text-foreground hover:bg-secondary"
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 rounded-xl border-border bg-card hover:bg-secondary">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <span className="hidden sm:inline font-medium text-foreground">{user?.name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-card border-border">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="font-semibold text-foreground">{user?.name}</span>
                  <span className="text-xs text-muted-foreground">{user?.farmName}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem onClick={logout} className="text-destructive gap-2 hover:bg-destructive/10">
                <LogOut className="h-4 w-4" />
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
