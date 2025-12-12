"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "./auth-context"
import { Button, Input, Label } from "@/components/ui/form-elements"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Leaf, Mail, Lock, User, Building2, ArrowRight, Sparkles, ShieldCheck, Eye, EyeOff, KeyRound } from "lucide-react"

export function LoginForm() {
  const { login, register, requestPasswordRecovery, recoverPassword } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [showRegisterPassword, setShowRegisterPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("")
  // Estados para el reset de contraseña
  const [recoveryToken, setRecoveryToken] = useState<string | null>(null)
  const [showResetPassword, setShowResetPassword] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false)

  // Detectar recovery_token en la URL al cargar
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash
      if (hash.includes("recovery_token=")) {
        const token = hash.split("recovery_token=")[1]?.split("&")[0]
        if (token) {
          console.log("Recovery token detected:", token)
          setRecoveryToken(token)
          setShowResetPassword(true)
          // Limpiar el hash de la URL
          window.history.replaceState(null, "", window.location.pathname)
        }
      }
    }
  }, [])

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccessMessage("")

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    const success = await login(email, password)
    if (!success) {
      setError("Email o contraseña incorrectos. Verifica tus credenciales.")
    }
    setIsLoading(false)
  }

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccessMessage("")

    const success = await requestPasswordRecovery(forgotPasswordEmail)
    if (success) {
      setSuccessMessage("Te hemos enviado un email con las instrucciones para restablecer tu contraseña.")
      setShowForgotPassword(false)
      setForgotPasswordEmail("")
    } else {
      setError("No se pudo enviar el email. Verifica que el email sea correcto.")
    }
    setIsLoading(false)
  }

  // Función de validación de contraseña reutilizable
  const validatePassword = (password: string, confirmPassword?: string): string | null => {
    if (confirmPassword !== undefined && password !== confirmPassword) {
      return "Las contraseñas no coinciden."
    }
    if (password.length < 6) {
      return "La contraseña debe tener al menos 6 caracteres."
    }
    if (!/[A-Z]/.test(password)) {
      return "La contraseña debe tener al menos una letra mayúscula."
    }
    if (!/[a-z]/.test(password)) {
      return "La contraseña debe tener al menos una letra minúscula."
    }
    return null
  }

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const validationError = validatePassword(newPassword, confirmNewPassword)
    if (validationError) {
      setError(validationError)
      setIsLoading(false)
      return
    }

    if (!recoveryToken) {
      setError("Token de recuperación no válido.")
      setIsLoading(false)
      return
    }

    const success = await recoverPassword(recoveryToken, newPassword)
    if (success) {
      setSuccessMessage("¡Contraseña actualizada correctamente! Ya puedes iniciar sesión.")
      setShowResetPassword(false)
      setRecoveryToken(null)
      setNewPassword("")
      setConfirmNewPassword("")
    } else {
      setError("No se pudo actualizar la contraseña. El enlace puede haber expirado.")
    }
    setIsLoading(false)
  }

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string
    const farmName = formData.get("farmName") as string

    const validationError = validatePassword(password, confirmPassword)
    if (validationError) {
      setError(validationError)
      setIsLoading(false)
      return
    }

    const success = await register(name, email, password, farmName)
    if (!success) {
      setError("No se pudo registrar. Es posible que el email ya esté registrado o la contraseña sea muy débil.")
    }
    setIsLoading(false)
  }

  return (
    <main className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden gradient-primary">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col justify-center px-12 text-primary-foreground">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center">
              <Leaf className="w-8 h-8" />
            </div>
            <span className="text-3xl font-bold">AgroGestión</span>
          </div>

          <h1 className="text-4xl font-bold leading-tight mb-4 text-balance">
            Gestiona tu explotación de forma inteligente
          </h1>
          <p className="text-lg text-primary-foreground/80 mb-8 text-pretty">
            Control total de gastos, facturación mensual y análisis anual para tu actividad agrícola y ganadera.
          </p>

          <div className="space-y-4">
            {[
              "Control de gastos mensuales",
              "Generación de PDFs profesionales",
              "Análisis anual con gráficos",
              "Mapa de tu explotación",
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                  <Sparkles className="w-3 h-3" />
                </div>
                <span className="text-primary-foreground/90">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-primary-foreground/10" />
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-primary-foreground/5" />
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md animate-in">
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary mb-4">
              <Leaf className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">AgroGestión</h1>
          </div>

          <div className="mb-8 hidden lg:block">
            <h2 className="text-2xl font-bold text-foreground">Bienvenido de nuevo</h2>
            <p className="text-muted-foreground mt-1">Accede a tu cuenta para continuar</p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-secondary p-1 rounded-xl h-12">
              <TabsTrigger
                value="login"
                className="rounded-lg text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
              >
                Iniciar Sesión
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className="rounded-lg text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
              >
                Registrarse
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-0 space-y-6">
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-sm font-medium">
                    Email
                  </Label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      id="login-email"
                      name="email"
                      type="email"
                      placeholder="tu@email.com"
                      required
                      className="pl-12 h-12 rounded-xl border-border bg-secondary/50 focus:bg-background focus:border-primary transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-sm font-medium">
                    Contraseña
                  </Label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      id="login-password"
                      name="password"
                      type={showLoginPassword ? "text" : "password"}
                      placeholder="••••••••"
                      required
                      className="pl-12 pr-12 h-12 rounded-xl border-border bg-secondary/50 focus:bg-background focus:border-primary transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={showLoginPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                      {showLoginPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                {error && (
                  <div className="bg-destructive/10 text-destructive text-sm p-4 rounded-xl border border-destructive/20 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-destructive" />
                    {error}
                  </div>
                )}
                {successMessage && (
                  <div className="bg-green-500/10 text-green-600 text-sm p-4 rounded-xl border border-green-500/20 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    {successMessage}
                  </div>
                )}
                <Button
                  type="submit"
                  className="w-full h-12 rounded-xl text-base font-semibold gradient-primary hover:opacity-90 transition-opacity group"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    "Entrando..."
                  ) : (
                    <>
                      Entrar
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(true)
                    setError("")
                    setSuccessMessage("")
                  }}
                  className="w-full text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  ¿Has olvidado tu contraseña?
                </button>
              </form>

              {/* Modal de recuperación de contraseña */}
              {showForgotPassword && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                  <div className="bg-background rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl animate-in">
                    <h3 className="text-xl font-bold text-foreground mb-2">Recuperar contraseña</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Introduce tu email y te enviaremos un enlace para restablecer tu contraseña.
                    </p>
                    <form onSubmit={handleForgotPassword} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="forgot-email" className="text-sm font-medium">
                          Email
                        </Label>
                        <div className="relative group">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                          <Input
                            id="forgot-email"
                            type="email"
                            placeholder="tu@email.com"
                            required
                            value={forgotPasswordEmail}
                            onChange={(e) => setForgotPasswordEmail(e.target.value)}
                            className="pl-12 h-12 rounded-xl border-border bg-secondary/50 focus:bg-background focus:border-primary transition-all"
                          />
                        </div>
                      </div>
                      {error && (
                        <div className="bg-destructive/10 text-destructive text-sm p-4 rounded-xl border border-destructive/20 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-destructive" />
                          {error}
                        </div>
                      )}
                      <div className="flex gap-3">
                        <Button
                          type="button"
                          onClick={() => {
                            setShowForgotPassword(false)
                            setError("")
                            setForgotPasswordEmail("")
                          }}
                          className="flex-1 h-12 rounded-xl text-base font-semibold bg-secondary text-foreground hover:bg-secondary/80 transition-colors"
                          disabled={isLoading}
                        >
                          Cancelar
                        </Button>
                        <Button
                          type="submit"
                          className="flex-1 h-12 rounded-xl text-base font-semibold gradient-primary hover:opacity-90 transition-opacity"
                          disabled={isLoading}
                        >
                          {isLoading ? "Enviando..." : "Enviar enlace"}
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="register" className="mt-0 space-y-6">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Nombre
                    </Label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input
                        id="name"
                        name="name"
                        placeholder="Juan"
                        required
                        className="pl-12 h-12 rounded-xl border-border bg-secondary/50 focus:bg-background focus:border-primary transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="farmName" className="text-sm font-medium">
                      Explotación
                    </Label>
                    <div className="relative group">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input
                        id="farmName"
                        name="farmName"
                        placeholder="Finca El Roble"
                        required
                        className="pl-12 h-12 rounded-xl border-border bg-secondary/50 focus:bg-background focus:border-primary transition-all"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email" className="text-sm font-medium">
                    Email
                  </Label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      id="register-email"
                      name="email"
                      type="email"
                      placeholder="tu@email.com"
                      required
                      className="pl-12 h-12 rounded-xl border-border bg-secondary/50 focus:bg-background focus:border-primary transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password" className="text-sm font-medium">
                    Contraseña
                  </Label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      id="register-password"
                      name="password"
                      type={showRegisterPassword ? "text" : "password"}
                      placeholder="••••••••"
                      required
                      minLength={6}
                      className="pl-12 pr-12 h-12 rounded-xl border-border bg-secondary/50 focus:bg-background focus:border-primary transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={showRegisterPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                      {showRegisterPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-sm font-medium">
                    Confirmar Contraseña
                  </Label>
                  <div className="relative group">
                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      id="confirm-password"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      required
                      minLength={6}
                      className="pl-12 pr-12 h-12 rounded-xl border-border bg-secondary/50 focus:bg-background focus:border-primary transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="accept-privacy"
                    name="acceptPrivacy"
                    required
                    className="mt-1 w-4 h-4 rounded border-border text-primary focus:ring-primary focus:ring-offset-0"
                  />
                  <label htmlFor="accept-privacy" className="text-sm text-muted-foreground">
                    Acepto la{" "}
                    <a href="/privacidad" className="text-primary hover:underline font-medium">
                      política de privacidad
                    </a>{" "}
                    y consiento el tratamiento de mis datos personales para la gestión de mi cuenta.
                  </label>
                </div>
                {error && (
                  <div className="bg-destructive/10 text-destructive text-sm p-4 rounded-xl border border-destructive/20 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-destructive" />
                    {error}
                  </div>
                )}
                <Button
                  type="submit"
                  className="w-full h-12 rounded-xl text-base font-semibold gradient-primary hover:opacity-90 transition-opacity group"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    "Creando cuenta..."
                  ) : (
                    <>
                      Crear cuenta
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <p className="text-center text-muted-foreground text-sm mt-8">
            Gestión profesional para agricultores y ganaderos
          </p>
        </div>
      </div>

      {/* Modal de restablecer contraseña */}
      {showResetPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-background rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl animate-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                <KeyRound className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Nueva contraseña</h3>
                <p className="text-sm text-muted-foreground">Introduce tu nueva contraseña</p>
              </div>
            </div>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-sm font-medium">
                  Nueva contraseña
                </Label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="new-password"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pl-12 pr-12 h-12 rounded-xl border-border bg-secondary/50 focus:bg-background focus:border-primary transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showNewPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-new-password" className="text-sm font-medium">
                  Confirmar nueva contraseña
                </Label>
                <div className="relative group">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="confirm-new-password"
                    type={showConfirmNewPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="pl-12 pr-12 h-12 rounded-xl border-border bg-secondary/50 focus:bg-background focus:border-primary transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showConfirmNewPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showConfirmNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              {error && (
                <div className="bg-destructive/10 text-destructive text-sm p-4 rounded-xl border border-destructive/20 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-destructive" />
                  {error}
                </div>
              )}
              <Button
                type="submit"
                className="w-full h-12 rounded-xl text-base font-semibold gradient-primary hover:opacity-90 transition-opacity group"
                disabled={isLoading}
              >
                {isLoading ? (
                  "Actualizando..."
                ) : (
                  <>
                    Guardar nueva contraseña
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}
