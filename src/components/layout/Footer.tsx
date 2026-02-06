import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXTwitter, faLinkedinIn, faInstagram } from '@fortawesome/free-brands-svg-icons'
import Image from 'next/image'
import logoWhite from '@/assets/logo/logo-zervired-white.svg'
import logoBlue from '@/assets/logo/logo-zervired-blue.svg'
export default function Footer() {
  return (
    <footer className="bg-amber-500 dark:bg-[#041926] relative z-1" data-footer>
      <div className="mx-auto max-w-7xl px-6 pt-10 pb-20 md:pb-2 text-sm flex flex-col justify-between items-center dark:opacity-75">
        <p className='text-base text-center'><span className="font-semibold">Zervired</span>, el marketplace de servicios reales, para personas reales.</p>
        <div className='rrss mt-4 mb-8 text-center'>
          <p className='mb-1'>Siguenos en:</p>
          <a className='w-8 h-8 text-2xl mx-3' aria-label="LinkedIn de Zervired">
            <FontAwesomeIcon icon={faLinkedinIn} />
          </a>
          <a className='w-8 h-8 text-2xl mx-3' aria-label="Twitter de Zervired">
            <FontAwesomeIcon icon={faXTwitter} />
          </a>
          <a className='w-8 h-8 text-2xl mx-3' aria-label="Instagram de Zervired">
            <FontAwesomeIcon icon={faInstagram} />
          </a>
        </div>  
        <Image
            src={logoBlue}
            alt="Logo Zervired"
            height={60}
            className="h-15 w-auto text-sky-950 mb-3 opacity-80 dark:hidden"
            priority
          />  

        <Image
          src={logoWhite}
          alt="Logo Zervired"
          height={60}
          className="h-15 w-auto text-sky-950 mb-3 opacity-80 hidden dark:block"
          priority
        /> 

        <small>© {new Date().getFullYear()} Zervired</small>
      </div>
    </footer>
  )
}
