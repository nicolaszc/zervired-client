import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXTwitter, faLinkedinIn, faInstagram } from '@fortawesome/free-brands-svg-icons'
export default function Footer() {
  return (
    <footer className="bg-amber-500 dark:bg-[#041926] text-sky-950/60 dark:text-white/60 mt-16 relative z-1">
      <div className="mx-auto max-w-7xl px-6 py-10 text-sm flex flex-col md:flex-row justify-between items-center">
        <span>© {new Date().getFullYear()} Zervired</span>
        <div className='rrss my-4 md:my-0 text-center'>
          <p className='mb-2'>Siguenos en:</p>
          <a className='w-8 h-8 text-2xl mx-3'>
            <FontAwesomeIcon icon={faLinkedinIn} />
          </a>
          <a className='w-8 h-8 text-2xl mx-3'>
            <FontAwesomeIcon icon={faXTwitter} />
          </a>
          <a className='w-8 h-8 text-2xl mx-3'>
            <FontAwesomeIcon icon={faInstagram} />
          </a>
        </div>
        <span>Servicios prestados por personas</span>
      </div>
    </footer>
  )
}
