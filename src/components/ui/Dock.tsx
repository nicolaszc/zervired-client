'use client'

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { useTheme } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'
import ThemeSwitch from '@/components/ui/ThemeSwitch'
import { useIntersection } from '@/hooks/useIntersection'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisV, faAngleUp, faSearch } from '@fortawesome/free-solid-svg-icons'
import { faEnvelope } from '@fortawesome/free-regular-svg-icons'
import { faWhatsapp} from '@fortawesome/free-brands-svg-icons'
import useIsMobile from '@/hooks/useIsMobile'
import useViewportSize from '@/hooks/useViewportSize'
interface Rule {
  target: string
  when: 'in' | 'out'
}
interface Props {
  intersect?: Rule[]
}

export default function Dock({ intersect }: Props) {
    const isMobile = useIsMobile()
    const { height } = useViewportSize()
    const rootMargin = `${Math.round(height * 0.5)}px 0px 0px 0px`
    const map = useIntersection(
    intersect?.map(r => r.target) ?? [],
    {
    threshold: 0.99,
    rootMargin: rootMargin
    }
    )

    const visible = intersect
    ? intersect.some(rule =>
        rule.when === 'in'
            ? map[rule.target]
            : !map[rule.target]
        )
    : true
    const [open, setOpen] = useState(false)

    const [mounted, setMounted] = useState(false)


    const { theme } = useTheme()
    const dark = theme === 'dark'  
    useEffect(() => {
        Promise.resolve().then(() => setMounted(true))
    }, [])

    const onScroll = useCallback(() => {
         setOpen(false)
    
           
    }, [setOpen])

    // Mount
   useEffect(() => {
        if (!mounted) return

        
       window.addEventListener('scroll', onScroll)
        if(!isMobile) {
            
            console.log('desktop')
            const open = () => setOpen(true)
            open()
           
            
        }else{
            console.log('mobile')
        }

        return () => {
            window.removeEventListener('scroll', onScroll)          
        }

    }, [mounted, onScroll, isMobile])

    const transition_duration = 300;
    //const search_transition_duration = useRef(500);


   /*  const triggerEl = document.querySelector<HTMLButtonElement>('.trigger');
    const targetEl = document.querySelector<HTMLButtonElement>('.target');

    const dockIsLeaving = triggerEl?.getAttribute('data-is-leaving');
    const targetDirection = targetEl?.getAttribute('data-direction');

    //const search_transition_duration = useRef(0);
    const [searchDelay, setSearchDelay] =  useState(0); 
    useEffect(() => {

      //search_transition_duration.current = 0
      console.log('entro')
     
      if (dockIsLeaving == "true") {
      
        if (targetDirection === "down") {
          // Activar delay solo en este caso
          //search_transition_duration.current = 500  
          console.log('bajando')
          //const searchDelay = () => setSearchDelay( 5000)
          //searchDelay() 
          
        } else {
          //search_transition_duration.current = 0
          console.log(('subiendo'))
          //const searchDelay = () => setSearchDelay(0)
          //searchDelay() 
          //return
        }
      }else{
         return
      }

      
    }, [visible, open, dockIsLeaving, targetDirection]);  */

return (

  <div
    id="dock"
    className={cn(
      "flex flex-col fixed bottom-[30%] md:bottom-[50%] end-0 z-30",
      open ? "translate-y-3/5" : "translate-y-2/5"
    )}
    style={{
      transitionDuration: transition_duration * 1 + "ms",
      transitionDelay: open ? transition_duration * 0 + "ms" : transition_duration * 4 + "ms"
    }}
    data-is-leaving={!open ? "false" : "true"}
  >
    <div
      suppressHydrationWarning
      className={cn("flex flex-col text-(--primary-d)/80 dark:text-white/80")}
    >
      {/* SUBMENU */}
      <div
        className={cn(
          "grid",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div
          className="flex flex-col items-center gap-y-2"
          style={{
            transitionDuration: transition_duration * 1 + "ms",
            transitionDelay: !open
              ? transition_duration * 4 + "ms"
              : transition_duration * 1 + "ms"
          }}
        >
          <button
            className={cn("trigger",
              open ? "translate-x-0" : "translate-x-full cerrando"
            )}
            style={{
              transitionDuration: transition_duration * 1 + "ms",
              transitionDelay: !open
                ? transition_duration * 0 + "ms"
                : transition_duration * 4 + "ms"
            }}
            aria-label="Scroll to top"
            data-is-leaving={!open ? "true" : "false"}
          >
            <FontAwesomeIcon icon={faAngleUp} />
          </button>

          <ThemeSwitch
            className={cn(
              open ? "translate-x-0" : "translate-x-full"
            )}
            style={{
              transitionDuration: transition_duration * 1 + "ms",
              transitionDelay: !open
                ? transition_duration * 1 + "ms"
                : transition_duration * 3 + "ms"
            }}
            aria-label="Dark Mode Switch"
          />

          <button
            className={cn(
              open ? "translate-x-0 abrio" : "translate-x-full cerro"
            )}
            style={{
              transitionDuration: transition_duration * 1 + "ms",
              transitionDelay: !open
                ? transition_duration * 2 + "ms"
                : transition_duration * 2 + "ms"
            }}
            aria-label="Contact"
          >
            <FontAwesomeIcon icon={faEnvelope} />
          </button>

          <button
            className={cn(
              open ? "translate-x-0" : "translate-x-full"
            )}
            style={{
              transitionDuration: transition_duration * 1 + "ms",
              transitionDelay: !open
                ? transition_duration * 3 + "ms"
                : transition_duration * 1 + "ms"
            }}
            aria-label="Whatsapp"
          >
            <FontAwesomeIcon icon={faWhatsapp} />
          </button>
        </div>
      </div>

      {/* TOGGLE */}
      <button onClick={() => setOpen(!open)} aria-label="Toggle Dock">
        <FontAwesomeIcon
          icon={faEllipsisV}
          className={cn(!open && "heartbeat")}
        />
      </button>
    </div>

    {isMobile && (
      <button
        className={cn(
          "target duration-500",
          !visible
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0 pointer-events-none",
        )}
         style={{
              transitionDuration: transition_duration * 1 + "ms",
              transitionDelay: /* searchDelay */ 0 + "ms"
            }} 
        
        aria-label="Toggle Search"
        data-direction={visible ? "up" : "down"}
      >
        <FontAwesomeIcon icon={faSearch} />
      </button>
      
    )}
  </div>
)
}
