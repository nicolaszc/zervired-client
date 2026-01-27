import Image from 'next/image'
import logoLight from '@/assets/logo/logo-zervired-light.svg'
import logoDark from '@/assets/logo/logo-zervired-dark.svg'
import ThemeSwitch from '@/components/ui/ThemeSwitch'

export default function Header() {
  return (
    <header className="bg-amber-500 dark:bg-[#041926] fixed z-20 w-full top-0">
      <div className="mx-auto max-w-7xl px-6 py-2.5 flex items-center justify-between">

        {/* Logo */}
        <div className="h-20 me-51.5">
          <Image
            src={logoLight}
            alt="Logo Zervired"
            height={80}
            className="h-20 w-auto dark:hidden"
            priority
          />
          <Image
            src={logoDark}
            alt="Logo Zervired"
            height={80}
            className="h-20 w-auto hidden dark:block"
            priority
          />
        </div>

        <div className="flex justify-center items-center text-sm">
          <input
            type="text"
            placeholder="¿Qué servicio buscas?"
            className="w-64 rounded-l-full bg-white/90 px-4 py-2 placeholder-gray-700 focus:outline-none"
          />
          <button className="rounded-r-full bg-sky-950 hover:bg-sky-950/90 dark:bg-amber-500 dark:hover:bg-amber-600 px-6 py-2 text-white cursor-pointer transition">
            Buscar
          </button>
        </div>

        {/* Nav */}
        <nav className="flex justify-end items-center gap-6 text-sm w-80">
          

          <a
            href="#"
            className="rounded-full px-4 py-2 text-white bg-sky-950 hover:bg-sky-950/90 dark:bg-amber-500 hover:dark:bg-amber-500/90"
          >
            Publicar servicio
          </a>

          <ThemeSwitch />
        </nav>
      </div>
    </header>
  )
}
