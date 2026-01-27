import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserGear, faAward, faCreditCard } from '@fortawesome/free-solid-svg-icons'

export default function Steps({ className = '' }) {
  return (
        <div className={`flex flex-wrap items-center justify-center ${className}`}>
            <h1 className="w-full text-center text-4xl font-semibold tracking-normal text-shadow-lg text-shadow-amber-950/50 dark:text-shadow-sky-950/50 mt-3 mb-4 text-white bg-radial from-[#efefef] from-40% to-transparent dark:from-[#041f2f] dark:from-40% dark:to-transparent">3 simples pasos y encuentra tu servicio</h1>
            <ol className='list-none text-white text-shadow-lg text-shadow-amber-950/50 dark:text-shadow-sky-950/50 p-0 mb-0 mt-8 text-sm flex'>
              <li className='flex flex-col items-center mx-2 w-27 md:mx-6 md:w-42 bg-radial from-[#efefef] from-40% to-transparent dark:from-[#041f2f] dark:from-40% dark:to-transparent'>
                <FontAwesomeIcon icon={faUserGear} className='text-6xl mb-4 text-white/50' />
                <span className='font-thin block text-center'>Busca un servicio</span>
              </li>
              <li className='flex flex-col items-center mx-2 w-27 md:mx-6 md:w-42 bg-radial from-[#efefef] from-40% to-transparent dark:from-[#041f2f] dark:from-40% dark:to-transparent'>
                <FontAwesomeIcon icon={faAward} className='text-6xl mb-4 text-white/50' />
                <span className='font-thin block text-center'>Elige un provider verificado</span> 
              </li>
              <li className='flex flex-col items-center mx-2 w-27 md:mx-6 md:w-42 bg-radial from-[#efefef] from-40% to-transparent dark:from-[#041f2f] dark:from-40% dark:to-transparent'>
                <FontAwesomeIcon icon={faCreditCard} className='text-6xl mb-4 text-white/50' />
                <span className='font-thin block text-center'>Agenda y contrata fácil y seguro</span> 
              </li>
            </ol>
        </div>
  )
}