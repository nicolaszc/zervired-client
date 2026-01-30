import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import BackgroundAnimation from '@/components/ui/BackgroundAnimation'
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${poppins.variable}`}>
      <body className="font-sans min-h-screen flex flex-col relative pt-25">
        <BackgroundAnimation />
        <Header />
        <main className="flex-1 pb-16 bg-[#efefef] dark:bg-[#041f2f]">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
