# AgroGestion

AgroGestion es una pequeña aplicación web para la gestión agrícola desarrollada con Next.js y TypeScript. Provee componentes para autenticación, gestión de gastos, visualización de parcelas y generación de PDFs, pensada como base para proyectos de administración de fincas y datos agrícolas.

**Estado:** En desarrollo

**Demo / Capturas:**
- (Añadir capturas o enlace a demo cuando estén disponibles)

**Características principales**

- **Autenticación básica:** flujo y componentes de login.
- **Gestión de gastos:** pantalla y componentes para registrar gastos.
- **Resumen anual:** vistas y componentes para resumen de datos.
- **Mapa de finca:** componente para mostrar parcelas o ubicaciones.
- **Generación de PDF:** utilidades en `lib/pdf-generator.ts`.

**Tecnologías**

- `Next.js` (App Router)
- `TypeScript`
- `pnpm` como gestor de paquetes
- `PostCSS` (configuración presente)

**Estructura principal del proyecto**

Raíz del proyecto (resumen):

```
app/                # Rutas y páginas (App Router)
components/         # Componentes React reutilizables
	ui/               # Componentes UI (card, dialog, select, etc.)
hooks/              # Hooks personalizados
lib/                # Utilidades (pdf-generator, storage, types...)
public/             # Archivos estáticos
styles/             # CSS global y estilos
README.md           # Este archivo
package.json
```

Algunos ficheros importantes:

- `components/navbar.tsx` — barra de navegación global.
- `components/login-form.tsx` — formulario de autenticación.
- `components/expenses-manager.tsx` — gestión de gastos.
- `components/annual-summary.tsx` — resumen anual.
- `lib/pdf-generator.ts` — utilidades para exportar información en PDF.

**Instalación y desarrollo**

1. Clona el repositorio:

```bash
git clone <tu-repo-url>
cd AgroGestion
```

2. Instala dependencias (usa `pnpm`):

```bash
pnpm install
```

3. Ejecuta la aplicación en modo desarrollo:

```bash
pnpm dev
```

4. Construir para producción:

```bash
pnpm build
pnpm start
```

Si usas `npm` o `yarn`, adapta los comandos (`npm install` / `npm run dev`, etc.).

**Buenas prácticas y notas**

- El proyecto usa el nuevo App Router de Next.js (estructura `app/`).
- Mantén los hooks y utilidades en `hooks/` y `lib/` respectivamente para reutilización.
- Añade variables de entorno en un fichero `.env.local` si integras servicios externos.

**Contribuir**

1. Crea una rama con un nombre descriptivo: `feature/mi-cambio`.
2. Haz commits pequeños y claros.
3. Abre Pull Request para revisión.

Si quieres que te ayude a añadir un CONTRIBUTING.md o a configurar CI/CD, dímelo y lo preparo.

**Licencia**

Por defecto sin licencia. Añade un archivo `LICENSE` si quieres publicar el proyecto.

**Contacto**

Para más información o colaboración: abre un issue o contáctame en el repositorio.
