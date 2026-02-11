import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/context/ThemeContext'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import FloatMenu from '@/components/ui/FloatMenu'
import FloatSearch from '@/components/ui/FloatSearch'
import BackgroundAnimation from '@/components/ui/BackgroundAnimation'
import {poppins} from '@/styles/fonts/fonts'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import Script from 'next/script'
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
      <head>
        <Script
          /* id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme');
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else if (theme === 'light') {
                    document.documentElement.classList.remove('dark');
                  } else {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    if (prefersDark) {
                      document.documentElement.classList.add('dark');
                    }
                  }
                } catch (e) {}
              })();
            `,
          }} */
        />
      </head>

      <body className="font-sans min-h-screen flex flex-col relative pt-25">
        <ThemeProvider>

          <BackgroundAnimation />

          <Header />

          <main className="flex-1 pb-16">{children}</main>

          <FloatMenu 
          intersect={[
              { target: '[data-hero]', when: 'in' }
            ]}
          />

          <div className='search-overlay'></div>

          <FloatSearch
            intersect={[
              { target: '[data-hero]', when: 'out' },
              { target: '[data-mobile-menu]', when: 'in' }
            ]}
          />

          <Footer />

        </ThemeProvider >
        
      </body>
    </html>
  )
}
