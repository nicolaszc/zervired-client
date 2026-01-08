export default function Header() {
  return (
    <header className="border-b">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <div className="text-xl font-semibold">
          Zervired
        </div>

        <nav className="flex items-center gap-6 text-sm">
          <a href="#" className="text-gray-600 hover:text-black">
            Explorar
          </a>
          <a
            href="#"
            className="rounded-md bg-black px-4 py-2 text-white hover:bg-gray-800"
          >
            Publicar servicio
          </a>
        </nav>
      </div>
    </header>
  )
}
