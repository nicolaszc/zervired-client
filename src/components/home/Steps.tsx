import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserGear, faAward, faCreditCard } from '@fortawesome/free-solid-svg-icons'

export default function Steps({ className = '' }) {
  return (
        <div className={`flex flex-wrap items-center justify-center ${className}`}>
            <h2 className="text-center text-xl max-w-2xl mx-auto leading-snug bg-radial from-[#efefef] from-40% to-transparent dark:from-[#041f2f] dark:from-40% dark:to-transparent opacity-65 dark:opacity-65 ">
            <span className="font-semibold">Zervired</span> es el marketplace de servicios
            donde encuentras lo que buscas
            </h2>

            <h1 className="w-full px-6 text-center text-3xl md:text-4xl font-semibold mt-3 mb-4 bg-radial from-[#efefef] from-40% to-transparent dark:from-[#041f2f] dark:from-40% dark:to-transparent opacity-95 dark:opacity-85">
            En solo 3 simples pasos
            </h1>

            <ol className='list-none p-0 mb-0 mt-8 text-sm flex'>
              <li className='flex flex-col items-center mx-2 w-27 md:mx-6 md:w-42 bg-radial from-[#efefef] from-40% to-transparent dark:from-[#041f2f] dark:from-40% dark:to-transparent'>
                <FontAwesomeIcon icon={faUserGear} className='text-4xl md:text-6xl mb-4 opacity-50' />
                <span className='font-extralight dark:font-thin block text-center'>Busca un servicio</span>
              </li>
              <li className='flex flex-col items-center mx-2 w-27 md:mx-6 md:w-42 bg-radial from-[#efefef] from-40% to-transparent dark:from-[#041f2f] dark:from-40% dark:to-transparent'>
                <FontAwesomeIcon icon={faAward} className='text-4xl md:text-6xl mb-4 opacity-50' />
                <span className='font-extralight dark:font-thin block text-center'>Elige un provider verificado</span> 
              </li>
              <li className='flex flex-col items-center mx-2 w-27 md:mx-6 md:w-42 bg-radial from-[#efefef] from-40% to-transparent dark:from-[#041f2f] dark:from-40% dark:to-transparent'>
                <FontAwesomeIcon icon={faCreditCard} className='text-4xl md:text-6xl mb-4 opacity-50' />
                <span className='font-extralight dark:font-thin block text-center'>Agenda y contrata fácil y seguro</span> 
              </li>
            </ol>
        </div>
  )
}