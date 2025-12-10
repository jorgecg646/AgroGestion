"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User } from "@/lib/types"
import { getCurrentUser, setCurrentUser, saveUser, findUserByEmail } from "@/lib/storage"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string, farmName: string) => Promise<boolean>
  logout: () => void
  updateUser: (user: User) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedUser = getCurrentUser()
    setUser(storedUser)
    setIsLoading(false)
  }, [])

  const login = async (email: string, _password: string): Promise<boolean> => {
    const existingUser = findUserByEmail(email)
    if (existingUser) {
      setUser(existingUser)
      setCurrentUser(existingUser)
      return true
    }
    return false
  }

  const register = async (name: string, email: string, _password: string, farmName: string): Promise<boolean> => {
    const existingUser = findUserByEmail(email)
    if (existingUser) {
      return false
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      name,
      email,
      farmName,
      location: { lat: 40.4168, lng: -3.7038 },
    }

    saveUser(newUser)
    setUser(newUser)
    setCurrentUser(newUser)
    return true
  }

  const logout = () => {
    setUser(null)
    setCurrentUser(null)
  }

  const updateUser = (updatedUser: User) => {
    saveUser(updatedUser)
    setUser(updatedUser)
    setCurrentUser(updatedUser)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
