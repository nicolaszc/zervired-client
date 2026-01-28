import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXTwitter, faLinkedinIn, faInstagram } from '@fortawesome/free-brands-svg-icons'
export default function Footer() {
  return (
    <footer className="bg-amber-500 dark:bg-[#041926] mt-16 relative z-1">
      <div className="mx-auto max-w-7xl px-6 pt-10 pb-2 text-sm flex flex-col justify-between items-center dark:opacity-75">
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
        <small>© {new Date().getFullYear()} Zervired</small>
      </div>
    </footer>
  )
}
