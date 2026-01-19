import Image from 'next/image';
import { actor } from "@/styles/fonts/fonts";
import { montserrat } from "@/styles/fonts/fonts";
import circuit from "@/assets/img/hero/circuit.webp"
export default function Hero() {
  return (
    <section className="bg-sky-500 relative overflow-hidden">
      <Image
        src={circuit}
        className='object-cover absolute z-0 mix-blend-multiply'
        alt="Logo Zervired"
      />
      <div className="mx-auto max-w-7xl px-6 py-20 text-center relative z-1">
        <h1 className="text-4xl font-semibold tracking-normal text-shadow-lg/20 mt-3" style={montserrat.style}>
          Encuentra servicios cerca de ti
        </h1>

        <p className="mt-1 text-lg text-white/80 font-light uppercase text-xs text-shadow-lg/50 tracking-[.415rem]" style={actor.style}>
          Personas reales ofreciendo servicios reales
        </p>

        <div className="mt-8 flex justify-center gap-0">
          <input
            type="text"
            placeholder="¿Qué servicio buscas?"
            className="w-64 rounded-l-full bg-white/80 px-4 py-2 placeholder-gray-700"
          />
          <button className="rounded-r-full bg-amber-500 px-6 py-2 text-white hover:bg-amber-600">
            Buscar
          </button>
        </div>
      </div>
    </section>
  )
}
