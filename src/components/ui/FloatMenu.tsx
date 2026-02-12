'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTheme } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'
import ThemeSwitch from '@/components/ui/ThemeSwitch'
import { useIntersection } from '@/hooks/useIntersection'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisV, faAngleUp } from '@fortawesome/free-solid-svg-icons'
import { faEnvelope } from '@fortawesome/free-regular-svg-icons'
import { faWhatsapp} from '@fortawesome/free-brands-svg-icons'
import useIsMobile from '@/hooks/useIsMobile'

interface Rule {
  target: string
  when: 'in' | 'out'
}
interface Props {
  intersect?: Rule[]
}

export default function FloatMenu({ intersect }: Props) {
    const isMobile = useIsMobile()
    const map = useIntersection(
    intersect?.map(r => r.target) ?? [],
    { threshold: .9}
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

        
       
        if(!isMobile) {
            window.addEventListener('scroll', onScroll)
            console.log('desktop')
            const open = () => setOpen(true)
            open()
            return () => {
                window.removeEventListener('scroll', onScroll)          
            }
        }else{
            console.log('mobile')
        }

        

    }, [mounted, onScroll, isMobile])


    return (
    <div
        suppressHydrationWarning
        className={cn(
            'fixed bottom-[30%] md:bottom-[50%] translate-y-1/2 md:translate-y-1/5 end-0 px-3.5 py-2 z-30 rounded-l-lg gap-2 text-sky-950/80 dark:text-white/80 text-sm backdrop-blur bg-sky-950/10 dark:bg-white/10 transition-all duration-200 ease-out',
            visible && !dark && 'bg-white/50'
        )}
    >
        {/* SUBMENU */}
        <div
            className={`
            grid transition-[grid-template-rows] duration-200 ease-out',
            ${open ? 'grid-rows-[1fr] delay-300' : 'grid-rows-[0fr] delay-600'}
            `}
        >
            <div
            className={`
                overflow-hidden flex flex-col items-center
                transition-opacity duration-300 ease-out
                ${open ? 'opacity-100 delay-600' : 'opacity-0 delay-300'}
            `}
            >
                <button
                    className="text-lg w-6 h-9.5 flex justify-center items-center cursor-pointer border-b border-sky-950/20 dark:border-white/20 hover:text-sky-500 dark:hover:text-amber-500"
                    aria-label="Scroll to top"
                >
                    <FontAwesomeIcon icon={faAngleUp} />
                </button>

                <ThemeSwitch />

                <button
                    className="text-lg w-6 h-9.5 flex justify-center items-center cursor-pointer border-b border-sky-950/20 dark:border-white/20 hover:text-sky-500 dark:hover:text-amber-500"
                    aria-label="Contact"
                >
                    <FontAwesomeIcon icon={faEnvelope} />
                </button>

                <button
                    className="text-lg w-6 h-9.5 flex justify-center items-center cursor-pointer border-b border-sky-950/20 dark:border-white/20 hover:text-sky-500 dark:hover:text-amber-500"
                    aria-label="Contact"
                >
                    <FontAwesomeIcon icon={faWhatsapp} />
                </button>
            </div>      
        </div>

        {/* TOGGLE */}
        <button
            onClick={() => setOpen(!open)}
            className={cn(
                "text-lg w-6 h-9.5 flex justify-center items-center cursor-pointer hover:text-sky-500 dark:hover:text-amber-500",
                !open && "heartbeat"
            )}
            aria-label="Toggle float menu"
        >
            <FontAwesomeIcon icon={faEllipsisV} />
        </button>
    </div>
  )
}
