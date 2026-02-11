import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserGear, faAward, faCreditCard } from '@fortawesome/free-solid-svg-icons'

export default function Steps({ className = '' }) {
  return (
        <div className={`flex flex-wrap items-center justify-center pt-16 ${className}`}>
            <h2 className="px-6 text-center text-lg leading-snug  bg-s-fade">
            <span className="font-semibold">Zervired</span> <span className='opacity-75'>es el marketplace de servicios
            donde encuentras lo que buscas</span>
            </h2>

            <h1 className="w-full px-6 text-center text-3xl md:text-4xl font-semibold mt-1 mb-4 opacity-85">
              <span className=' bg-s-fade'>En solo 3 simples pasos</span>
            </h1>

            <ol className='list-none p-0 mb-0 mt-8 text-sm flex flex-col items-center md:items-start justify-center md:flex-row'>
              <li className='flex flex-col items-center justify-start w-full md:mx-6 md:w-42  bg-s-fade'>
                <FontAwesomeIcon icon={faUserGear} className='text-4xl md:text-6xl me-2 md:me-0 mb-2 md:mb-4 opacity-90 block md:inline' />
                <span className='font-extralight dark:font-thin block text-center'><h6 className='text-lg font-semibold'>1.</h6>Busca un servicio</span>
              </li>
              <li>
                <svg xmlns="http://www.w3.org/2000/svg" width="34" height="94" fill="none" className='transform-[scale(.45)_rotate(15deg)] md:transform-[scale(.65)_rotate(-80deg)] opacity-50'>
                    <path fill="currentColor" d="M15.62 78.242c-.529-6.6-1.122-13.196-1.575-19.8a437 437 0 0 0-6.7-52.378c-.216-1.13-.522-2.36-.274-3.424.183-.782 1.13-1.796 1.871-1.923.726-.124 1.85.56 2.38 1.224.582.728.772 1.818.984 2.783a337 337 0 0 1 7.105 52.804 176 176 0 0 0 2.31 21.465 19 19 0 0 0 1.707-2.528c1.983-4.208 3.783-8.506 5.907-12.64.466-.906 2.1-1.915 2.992-1.755 1.816.325 1.94 1.987 1.373 3.59-.277.782-.55 1.568-.897 2.32-3.394 7.4-6.722 14.832-10.236 22.174-2.034 4.246-4.35 4.446-6.773.626-4.984-7.858-9.827-15.806-14.715-23.726-.345-.56-.817-1.195-.805-1.786.018-.91.175-2.385.688-2.593a3.97 3.97 0 0 1 3.142.23c.916.553 1.464 1.759 2.098 2.729 2.8 4.282 5.572 8.582 8.355 12.876z"></path>
                </svg>
              </li>
              <li className='flex flex-col items-center justify-start w-full md:mx-6 md:w-42  bg-s-fade'>
                <FontAwesomeIcon icon={faAward} className='text-4xl md:text-6xl me-2 md:me-0 mb-2 md:mb-4 opacity-90' />
                <span className='font-extralight dark:font-thin block text-center'><h6 className='text-lg font-semibold'>2.</h6>Elige un provider verificado</span> 
              </li>
              <li className=' bg-s-fade w-9'>
                <svg xmlns="http://www.w3.org/2000/svg" width="34" height="94" fill="none" className='transform-[scale(.45)_rotate(-5deg)] md:transform-[scale(.65)_rotate(-87deg)] opacity-50'>
                    <path fill="currentColor" d="M15.62 78.242c-.529-6.6-1.122-13.196-1.575-19.8a437 437 0 0 0-6.7-52.378c-.216-1.13-.522-2.36-.274-3.424.183-.782 1.13-1.796 1.871-1.923.726-.124 1.85.56 2.38 1.224.582.728.772 1.818.984 2.783a337 337 0 0 1 7.105 52.804 176 176 0 0 0 2.31 21.465 19 19 0 0 0 1.707-2.528c1.983-4.208 3.783-8.506 5.907-12.64.466-.906 2.1-1.915 2.992-1.755 1.816.325 1.94 1.987 1.373 3.59-.277.782-.55 1.568-.897 2.32-3.394 7.4-6.722 14.832-10.236 22.174-2.034 4.246-4.35 4.446-6.773.626-4.984-7.858-9.827-15.806-14.715-23.726-.345-.56-.817-1.195-.805-1.786.018-.91.175-2.385.688-2.593a3.97 3.97 0 0 1 3.142.23c.916.553 1.464 1.759 2.098 2.729 2.8 4.282 5.572 8.582 8.355 12.876z"></path>
                </svg>
              </li>
              <li className='flex flex-col items-center justify-start w-full md:mx-6 md:w-42  bg-s-fade'>
                <FontAwesomeIcon icon={faCreditCard} className='text-4xl md:text-6xl me-2 md:me-0 mb-2 md:mb-4 opacity-90' />
                <span className='font-extralight dark:font-thin block text-center'><h6 className='text-lg font-semibold'>3.</h6>Agenda y contrata fácil y seguro</span> 
              </li>
            </ol>
        </div>
  )
}