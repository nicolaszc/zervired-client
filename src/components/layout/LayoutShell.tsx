"use client"

import { useUI } from "@/context/UIContext"
import BackgroundAnimation from "@/components/ui/BackgroundAnimation"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import Dock from "@/components/ui/Dock"
import MobileSearch from "@/components/ui/MobileSearch"
import AdvancedSearch from "@/components/ui/AdvancedSearch"


export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const { state } = useUI()
 
  return (
    <>
      <BackgroundAnimation />
      <Header />

      <main className="flex-1 pb-16">{children}</main>

      <Dock
        intersect={[
          { target: "[data-grid-sentinel]", when: "in", threshold: 0.1, margin: 1 },
        ]}
      />

      {state.isMobile ? <MobileSearch /> : <AdvancedSearch />}

      <Footer />
    </>
  )
}
