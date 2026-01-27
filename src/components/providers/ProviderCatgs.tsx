import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { CATEGORIES } from '@/constants/categories'
import { ICON_MAP } from '@/constants/icon-map'

export default function ProviderCatgs() {
  return (
    <div className="mx-auto max-w-7xl px-6 pt-8 pb-8">
      <h2 className="mb-8 text-2xl font-semibold bg-radial from-[#efefef] from-40% to-transparent dark:from-[#041f2f] dark:from-40% dark:to-transparent">
        Categorías de Servicio
      </h2>

      <div className="flex justify-between gap-4 flex-wrap">
        {Object.entries(CATEGORIES).map(([slug, category]) => {
          const icon = ICON_MAP[category.icon]

          return (
            <Link
              key={slug}
              href={`/categorias/${slug}`}
              className="
                px-12 py-8 rounded-lg
                bg-[#f2debe] dark:bg-[#003a57]
                text-sky-950/90 dark:text-white/90
                text-xs
                flex flex-col items-center
                hover:scale-[1.03] transition
              "
            >
              <FontAwesomeIcon
                icon={icon}
                className="text-amber-500/70 dark:text-sky-500/70 text-5xl mb-3"
              />
              <p className="text-center">{category.label}</p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
