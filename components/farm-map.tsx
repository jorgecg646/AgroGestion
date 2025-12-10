"use client"

import { useState, useEffect } from "react"
import { useAuth } from "./auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button, Input, Label } from "@/components/ui/form-elements"
import { MapPin, Save, Navigation, Info, ExternalLink } from "lucide-react"
import dynamic from "next/dynamic"

const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false })
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false })
const useMapEvents = dynamic(() => import("react-leaflet").then((mod) => mod.useMapEvents), { ssr: false }) as any

// Componente wrapper para TileLayer con tipado relajado
const TileLayerWrapper = (props: any) => {
  const Component = TileLayer as any
  return <Component {...props} />
}

function LocationMarker({
  position,
  setPosition,
}: { position: [number, number]; setPosition: (pos: [number, number]) => void }) {
  const MapEventsComponent = () => {
    const map = (useMapEvents as any)({
      click(e: any) {
        setPosition([e.latlng.lat, e.latlng.lng])
      },
    })
    return null
  }

  return (
    <>
      <MapEventsComponent />
      <Marker position={position}>
        <Popup>Tu explotación</Popup>
      </Marker>
    </>
  )
}

export function FarmMap() {
  const { user, updateUser } = useAuth()
  const [position, setPosition] = useState<[number, number]>([40.4168, -3.7038])
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (user?.location) {
      setPosition([user.location.lat, user.location.lng])
    }
  }, [user])

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition([pos.coords.latitude, pos.coords.longitude])
        },
        (error) => {
          console.error("Error getting location:", error)
        },
      )
    }
  }

  const handleSaveLocation = () => {
    if (!user) return
    setIsSaving(true)

    updateUser({
      ...user,
      location: { lat: position[0], lng: position[1] },
    })

    setTimeout(() => {
      setIsSaving(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }, 500)
  }

  if (!mounted) {
    return (
      <div className="space-y-6 animate-in">
        <h2 className="text-3xl font-bold text-foreground">Mapa de la Explotación</h2>
        <Card className="bg-card/90 backdrop-blur-lg border-border/50 shadow-lg">
          <CardContent className="h-[500px] flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-4 animate-pulse">
                <MapPin className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">Cargando mapa...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Mapa de la Explotación</h2>
          <p className="text-muted-foreground mt-1">Marca la ubicación de tu finca en el mapa</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <Card className="bg-card/90 backdrop-blur-lg border-border/50 shadow-lg overflow-hidden">
            <CardContent className="p-0">
              <div className="h-[550px]">
                <link
                  rel="stylesheet"
                  href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
                  integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
                  crossOrigin=""
                />
                {/* @ts-ignore */}
                <MapContainer center={position} zoom={13} style={{ height: "100%", width: "100%" }}>
                  <TileLayerWrapper
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <LocationMarker position={position} setPosition={setPosition} />
                </MapContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="bg-card/90 backdrop-blur-lg border-border/50 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg text-foreground">
                <MapPin className="w-5 h-5 text-primary" />
                {user?.farmName}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="lat" className="text-xs text-muted-foreground">
                    Latitud
                  </Label>
                  <Input
                    id="lat"
                    value={position[0].toFixed(6)}
                    readOnly
                    className="rounded-xl bg-secondary/80 border-0 font-mono text-sm text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lng" className="text-xs text-muted-foreground">
                    Longitud
                  </Label>
                  <Input
                    id="lng"
                    value={position[1].toFixed(6)}
                    readOnly
                    className="rounded-xl bg-secondary/80 border-0 font-mono text-sm text-foreground"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <Button
                  onClick={getCurrentLocation}
                  variant="outline"
                  className="w-full rounded-xl gap-2 bg-card border-border text-foreground hover:bg-secondary"
                >
                  <Navigation className="w-4 h-4" />
                  Mi ubicación
                </Button>
                <Button
                  onClick={handleSaveLocation}
                  className={`w-full rounded-xl gap-2 transition-all ${saved ? "bg-primary" : "gradient-primary hover:opacity-90"} text-primary-foreground`}
                  disabled={isSaving}
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? "Guardando..." : saved ? "Guardado" : "Guardar ubicación"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/90 backdrop-blur-lg border-border/50 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm text-foreground">
                <Info className="w-4 h-4 text-primary" />
                Sobre el mapa
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-3">
              <p>
                <strong className="text-foreground">Fuente:</strong> OpenStreetMap
              </p>
              <p>Proyecto colaborativo de mapas libres y editables. Los datos son gratuitos bajo licencia ODbL.</p>
              <a
                href="https://www.openstreetmap.org"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-primary hover:underline"
              >
                Visitar OpenStreetMap
                <ExternalLink className="w-3 h-3" />
              </a>
            </CardContent>
          </Card>

          <div className="p-4 rounded-xl bg-primary/20 border border-primary/30">
            <p className="text-sm text-foreground">
              <strong>Consejo:</strong> Haz clic en el mapa para marcar la ubicación exacta de tu explotación.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
