import type { Metadata, Viewport } from "next";
import './globals.css'
import { ThemeProvider } from '@/context/ThemeContext'
import { UIProvider } from '@/context/UIContext'
import LayoutShell from "@/components/layout/LayoutShell"
import {poppins} from '@/styles/fonts/fonts'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'

config.autoAddCss = false
export const metadata: Metadata = {
  title: 'Zervired',
  description: 'Zervired es el marketplace donde encuentras servicios reales, de personas reales. Explora proveedores confiables en múltiples categorías',
  icons: {
    icon: [
      {
        url: '/icon-light.svg',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark.svg',
        media: '(prefers-color-scheme: dark)',
      },
    ],
  },
  
}
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  interactiveWidget: "resizes-content",
};
export default function RootLayout(
  { children }: { children: React.ReactNode}) {
  return (
    <html lang="es" className={`${poppins.variable}`}>

      <body className="font-sans min-h-screen flex flex-col relative pt-25">

        <ThemeProvider>
          <UIProvider>
        
            <LayoutShell>{children}</LayoutShell>

          </UIProvider>
        </ThemeProvider >
        
      </body>
    </html>
  )
}
