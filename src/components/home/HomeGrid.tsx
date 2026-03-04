
import ProvidersGrid from '@/components/providers/ProvidersGrid'
import ProviderCategories from '@/components/providers/ProviderCategories'
import FeaturedProviders from '@/components/providers/FeaturedProviders'
import { providers } from '@/data/providers'
import Steps from '@/components/sections/Steps'
export default function HomeGrid() {
  return (
    <>
    
        <section className='relative mt-8 z-1'>
          <Steps />
        </section>
        
        
        <section className='relative mt-8 z-1'>
          <FeaturedProviders context="section" />
        </section>

        <section className='relative mt-8 z-1'>         
          <ProviderCategories  context="section" />
        </section>
       
        <section className="relative mt-8 z-1">
          <ProvidersGrid
            key="home"
            providers={providers}
            title="Servicios disponibles"
          />
        </section>
       
    </>  
    
  )
}
