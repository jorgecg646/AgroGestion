"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User } from "@/lib/types"
import { getCurrentUser, setCurrentUser, saveUser, findUserByEmail } from "@/lib/storage"
import GoTrue from "gotrue-js"

const netlifyIdentityUrl = process.env.NEXT_PUBLIC_NETLIFY_IDENTITY_URL
const auth = new GoTrue({ APIUrl: `${netlifyIdentityUrl}`, audience: "" })

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string, farmName: string) => Promise<boolean>
  logout: () => void
  updateUser: (user: User) => void
  netlifyUser: any | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [netlifyUser, setNetlifyUser] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = auth.currentUser()
        if (currentUser) {
          setNetlifyUser(currentUser)
          const storedUser = getCurrentUser() || createUserFromNetlify(currentUser)
          setUser(storedUser)
        } else {
          const storedUser = getCurrentUser()
          setUser(storedUser)
        }
      } catch (error) {
        console.error("Error initializing auth:", error)
      }
      setIsLoading(false)
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const netlifyUser = await auth.login(email, password, true)
      setNetlifyUser(netlifyUser)
      
      // Busca o crea el usuario en la app
      let appUser = findUserByEmail(email)
      if (!appUser) {
        appUser = createUserFromNetlify(netlifyUser)
        saveUser(appUser)
      }
      
      setUser(appUser)
      setCurrentUser(appUser)
      return true
    } catch (error: any) {
      console.error("Login error:", error)
      return false
    }
  }

  const register = async (name: string, email: string, password: string, farmName: string): Promise<boolean> => {
    try {
      // Primero intenta registrarse en Netlify Identity
      const netlifyUser = await auth.signup(email, password, { full_name: name, farm_name: farmName })
      setNetlifyUser(netlifyUser)

      // Si Netlify lo permite, crea el usuario en la app
      const newUser: User = {
        id: netlifyUser.id,
        name,
        email,
        farmName,
        location: { lat: 40.4168, lng: -3.7038 },
      }

      saveUser(newUser)
      setUser(newUser)
      setCurrentUser(newUser)
      return true
    } catch (error: any) {
      console.error("Register error:", error)
      // El error de Netlify Identity indicará si el email ya existe
      return false
    }
  }

  const logout = () => {
    setUser(null)
    setNetlifyUser(null)
    setCurrentUser(null)
  }

  const updateUser = (updatedUser: User) => {
    saveUser(updatedUser)
    setUser(updatedUser)
    setCurrentUser(updatedUser)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateUser, netlifyUser }}>
      {children}
    </AuthContext.Provider>
  )
}

function createUserFromNetlify(netlifyUser: any): User {
  return {
    id: netlifyUser.id,
    name: netlifyUser.user_metadata?.full_name || netlifyUser.email?.split("@")[0] || "Usuario",
    email: netlifyUser.email,
    farmName: netlifyUser.user_metadata?.farm_name || "Mi Finca",
    location: { lat: 40.4168, lng: -3.7038 },
  }
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
