import type { Metadata } from "next";
import type { Viewport } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { PwaInstallPrompt } from "@/components/pwa-install-prompt";

export const metadata: Metadata = {
  title: "RoamFX",
  description: "Compliance-safe traveller forex marketplace",
  manifest: "/manifest.webmanifest",
  applicationName: "RoamFX",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "RoamFX"
  },
  formatDetection: {
    telephone: false
  },
  icons: {
    icon: "/icons/icon.svg",
    apple: "/icons/icon.svg"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0c7378",
  viewportFit: "cover"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body><Providers>{children}<PwaInstallPrompt /></Providers></body></html>;
}
