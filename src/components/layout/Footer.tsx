export default function Footer() {
  return (
    <footer className="bg-amber-500 dark:bg-[#041926] text-sky-950/60 dark:text-white/60 mt-16 relative z-1">
      <div className="mx-auto max-w-7xl px-6 py-10 text-sm flex justify-between">
        <span>© {new Date().getFullYear()} Zervired</span>
        <span>Servicios prestados por personas</span>
      </div>
    </footer>
  )
}
