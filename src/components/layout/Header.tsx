import Image from 'next/image'
import logoLight from '@/assets/logo/logo-zervired-light.svg'
import logoDark from '@/assets/logo/logo-zervired-dark.svg'
import ThemeSwitch from '@/components/ui/ThemeSwitch'

export default function Header() {
  return (
    <header className="bg-amber-500 dark:bg-[#041926] fixed z-20 w-full top-0">
      <div className="mx-auto max-w-7xl px-6 py-[10px] flex items-center justify-between">

        {/* Logo */}
        <div className="h-[80px]">
          <Image
            src={logoLight}
            alt="Logo Zervired"
            height={80}
            className="h-[80px] w-auto dark:hidden"
            priority
          />
          <Image
            src={logoDark}
            alt="Logo Zervired"
            height={80}
            className="h-[80px] w-auto hidden dark:block"
            priority
          />
        </div>

        {/* Nav */}
        <nav className="flex items-center gap-6 text-sm">
          <a href="#" className="text-sky-950/80 dark:text-white/80 hover:text-white">
            Explorar
          </a>

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
