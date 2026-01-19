import { coda } from "@/styles/fonts/fonts";
import { montserrat } from "@/styles/fonts/fonts";
export default function Hero() {
  return (
    <section className="bg-sky-500">
      <div className="mx-auto max-w-7xl px-6 py-20 text-center">
        <h1 className="text-4xl font-semibold tracking-normal" style={montserrat.style}>
          Encuentra servicios cerca de ti
        </h1>

        <p className="mt-4 text-lg text-sky-950/70 font-light">
          Personas reales ofreciendo servicios reales
        </p>

        <div className="mt-8 flex justify-center gap-0">
          <input
            type="text"
            placeholder="¿Qué servicio buscas?"
            className="w-64 rounded-l-md bg-sky-950/20 px-4 py-2"
          />
          <button className="rounded-r-md bg-sky-950/50 px-6 py-2 text-white hover:bg-gray-800">
            Buscar
          </button>
        </div>
      </div>
    </section>
  )
}
