import { MapPinned } from "lucide-react";

export function MapPlaceholder() {
  return <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-lg border bg-accent/40 p-6 text-center">
    <MapPinned className="text-primary" />
    <div className="font-medium">Map integration placeholder</div>
    <p className="max-w-sm text-sm text-muted-foreground">Prepared for Google Maps or Mapbox provider injection with partner latitude/longitude, distance sorting, and delivery zones.</p>
  </div>;
}
