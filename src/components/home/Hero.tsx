export default function Hero() {
  return (
    <section className="bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-20 text-center">
        <h1 className="text-4xl font-semibold tracking-tight">
          Encuentra servicios cerca de ti
        </h1>

        <p className="mt-4 text-lg text-gray-600">
          Personas reales ofreciendo servicios reales
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <input
            type="text"
            placeholder="¿Qué servicio buscas?"
            className="w-64 rounded-md border px-4 py-2"
          />
          <button className="rounded-md bg-black px-6 py-2 text-white hover:bg-gray-800">
            Buscar
          </button>
        </div>
      </div>
    </section>
  )
}
