import Image from 'next/image';
import logo from '@/assets/logo/servired.svg'; // Static import  return (
export default function Header() {
  return (
    <header className="bg-black/20">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <div className="text-xl font-semibold">
          <Image
      src={logo}
      height={100}
      alt="Logo Zervired"
    />
        </div>

        <nav className="flex items-center gap-6 text-sm">
          <a href="#" className="text-white/50 hover:text-white">
            Explorar
          </a>
          <a
            href="#"
            className="rounded-md bg-sky-500 px-4 py-2 text-white hover:bg-sky-700"
          >
            Publicar servicio
          </a>
        </nav>
      </div>
    </header>
  )
}
