"use client"

import Link from "next/link"
import { Leaf, ArrowLeft, Shield, Database, Lock, UserCheck, Mail } from "lucide-react"

export default function PrivacidadPage() {
    return (
        <main className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium">Volver</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                            <Leaf className="w-4 h-4 text-primary-foreground" />
                        </div>
                        <span className="font-bold text-foreground">AgroGestión</span>
                    </div>
                </div>
            </header>

            {/* Content */}
            <div className="container mx-auto px-4 py-12 max-w-3xl">
                <div className="mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary mb-6">
                        <Shield className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">Política de Privacidad</h1>
                    <p className="text-muted-foreground">Última actualización: Diciembre 2025</p>
                </div>

                <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
                    {/* Introducción */}
                    <section className="bg-card rounded-2xl p-6 border border-border">
                        <p className="text-muted-foreground leading-relaxed">
                            En <strong className="text-foreground">AgroGestión</strong> nos comprometemos a proteger tu privacidad.
                            Esta política describe qué datos recopilamos, cómo los utilizamos y cuáles son tus derechos
                            en relación con tu información personal.
                        </p>
                    </section>

                    {/* Datos que recopilamos */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Database className="w-5 h-5 text-primary" />
                            </div>
                            <h2 className="text-xl font-semibold text-foreground m-0">Datos que Recopilamos</h2>
                        </div>
                        <div className="bg-card rounded-2xl p-6 border border-border space-y-4">
                            <p className="text-muted-foreground">Al registrarte en AgroGestión, recopilamos:</p>
                            <ul className="space-y-3 text-muted-foreground">
                                <li className="flex items-start gap-3">
                                    <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                                    <span><strong className="text-foreground">Correo electrónico:</strong> Para identificarte y permitir el acceso a tu cuenta.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                                    <span><strong className="text-foreground">Nombre:</strong> Para personalizar tu experiencia en la aplicación.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                                    <span><strong className="text-foreground">Nombre de la explotación:</strong> Para identificar tu actividad agrícola o ganadera.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                                    <span><strong className="text-foreground">Datos de gastos:</strong> Los registros que introduces para gestionar tu actividad.</span>
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* Cómo usamos tus datos */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Lock className="w-5 h-5 text-primary" />
                            </div>
                            <h2 className="text-xl font-semibold text-foreground m-0">Cómo Usamos tus Datos</h2>
                        </div>
                        <div className="bg-card rounded-2xl p-6 border border-border space-y-4">
                            <p className="text-muted-foreground">Utilizamos tu información exclusivamente para:</p>
                            <ul className="space-y-3 text-muted-foreground">
                                <li className="flex items-start gap-3">
                                    <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                                    <span>Gestionar tu cuenta y autenticación.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                                    <span>Almacenar y mostrar tus registros de gastos.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                                    <span>Generar informes y análisis de tu actividad.</span>
                                </li>
                            </ul>
                            <p className="text-muted-foreground pt-2 border-t border-border">
                                <strong className="text-foreground">No vendemos ni compartimos</strong> tus datos con terceros
                                para fines de marketing ni publicidad.
                            </p>
                        </div>
                    </section>

                    {/* Almacenamiento */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Database className="w-5 h-5 text-primary" />
                            </div>
                            <h2 className="text-xl font-semibold text-foreground m-0">Almacenamiento y Seguridad</h2>
                        </div>
                        <div className="bg-card rounded-2xl p-6 border border-border space-y-4">
                            <ul className="space-y-3 text-muted-foreground">
                                <li className="flex items-start gap-3">
                                    <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                                    <span><strong className="text-foreground">Autenticación:</strong> Utilizamos Netlify Identity, un servicio seguro que cumple con estándares de la industria.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                                    <span><strong className="text-foreground">Datos de la aplicación:</strong> Se almacenan de forma segura en Supabase, una plataforma de base de datos en la nube con cifrado y protección de datos conforme a estándares de seguridad internacionales.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                                    <span><strong className="text-foreground">Contraseñas:</strong> Nunca almacenamos contraseñas en texto plano; se gestionan de forma segura mediante Netlify Identity.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                                    <span><strong className="text-foreground">Sincronización:</strong> Tus datos se sincronizan automáticamente entre dispositivos para que puedas acceder desde cualquier lugar.</span>
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* Tus derechos */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <UserCheck className="w-5 h-5 text-primary" />
                            </div>
                            <h2 className="text-xl font-semibold text-foreground m-0">Tus Derechos</h2>
                        </div>
                        <div className="bg-card rounded-2xl p-6 border border-border space-y-4">
                            <p className="text-muted-foreground">De acuerdo con el RGPD, tienes derecho a:</p>
                            <ul className="space-y-3 text-muted-foreground">
                                <li className="flex items-start gap-3">
                                    <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                                    <span><strong className="text-foreground">Acceso:</strong> Solicitar una copia de tus datos personales.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                                    <span><strong className="text-foreground">Rectificación:</strong> Corregir datos inexactos o incompletos.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                                    <span><strong className="text-foreground">Supresión:</strong> Solicitar la eliminación de tu cuenta y datos.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                                    <span><strong className="text-foreground">Portabilidad:</strong> Obtener tus datos en un formato estructurado.</span>
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* Contacto */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Mail className="w-5 h-5 text-primary" />
                            </div>
                            <h2 className="text-xl font-semibold text-foreground m-0">Contacto</h2>
                        </div>
                        <div className="bg-card rounded-2xl p-6 border border-border">
                            <p className="text-muted-foreground">
                                Si tienes preguntas sobre esta política de privacidad o deseas ejercer tus derechos,
                                puedes contactarnos a través del correo electrónico asociado a la aplicación.
                            </p>
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <div className="mt-12 pt-8 border-t border-border text-center">
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} AgroGestión. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </main>
    )
}
