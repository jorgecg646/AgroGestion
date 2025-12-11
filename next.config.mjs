/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: [
      '@radix-ui/react-accordion',
      '@radix-ui/react-alert-dialog',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-popover',
      '@radix-ui/react-select',
      '@radix-ui/react-tabs',
      '@radix-ui/react-toast',
      '@radix-ui/react-tooltip',
      'lucide-react',
      'recharts',
      'date-fns',
    ],
    // Optimiza CSS reduciendo chunks
    optimizeCss: true,
    // Usar browserslist para SWC (evita polyfills innecesarios)
    browsersListForSwc: true,
    // No incluir polyfills para navegadores legacy
    legacyBrowsers: false,
  },
  // Optimizaciones de rendimiento
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  // Configuración para reducir polyfills
  swcMinify: true,
}

export default nextConfig

