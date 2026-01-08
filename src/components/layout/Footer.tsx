export default function Footer() {
  return (
    <footer className="border-t mt-16">
      <div className="mx-auto max-w-7xl px-6 py-10 text-sm text-gray-500 flex justify-between">
        <span>© {new Date().getFullYear()} Zervired</span>
        <span>Servicios prestados por personas</span>
      </div>
    </footer>
  )
}
