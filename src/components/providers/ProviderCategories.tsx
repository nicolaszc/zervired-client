import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { CATEGORIES } from '@/constants/categories'
import { ICON_MAP } from '@/constants/icon-map'
import SectionTitle  from '@/components/ui/SectionTitle'

export default function ProviderCategories() {
  return (
    <div className="mx-auto max-w-7xl px-6 pt-8 pb-8">

      <SectionTitle className={''} title={'Categorías de Servicio'} />
      <div className="-mx-6 md:mx-0 overflow-x-auto overflow-y-visible snap-x snap-mandatory scrollbar-hide scroll-px-6">
        <div className="flex gap-6 px-6 md:grid md:grid-cols-6 md:gap-6 md:px-0">

          {Object.entries(CATEGORIES).map(([slug, category]) => {
            const icon = ICON_MAP[category.icon]

            return (
              <Link
                key={slug}
                href={`/categorias/${slug}`}
                className="
                  snap-start
                  min-w-[40%] md:min-w-0
                  theme-card
                  text-xs
                  flex flex-col items-center
                  bg-(--contrast-low-l) dark:bg-(--contrast-low-d)
                  text-(--lowlight-l)/80 dark:text-white/80
                "
              >
                <FontAwesomeIcon
                  icon={icon}
                  className="text-(--primary-l)/70 dark:text-(--highlight-d)/70 text-5xl mb-3"
                />
                <p className="text-center font-light">{category.label}</p>
              </Link>
            )
          })}
          {/* Spacer */}
          <div className="w-px md:hidden shrink-0" />
        </div>
      </div>
      
    </div>
  )
}
