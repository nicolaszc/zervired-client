'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTheme } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'
import ThemeSwitch from '@/components/ui/ThemeSwitch'
import { useIntersection } from '@/hooks/useIntersection'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisV, faAngleUp, faSearchPlus } from '@fortawesome/free-solid-svg-icons'
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

export default function FloatMenu({ intersect }: Props) {
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


    return (
        <div className='fixed bottom-[30%] md:bottom-[50%] translate-y-1/2 md:translate-y-1/5 end-0 z-30'>
        <div
            suppressHydrationWarning
            className={cn(
                'px-3.5 py-2 rounded-l-lg gap-2 text-(--primary-d)/80 dark:text-white/80 text-sm backdrop-blur bg-(--primary-d)/10 dark:bg-white/10 transition-all duration-200 ease-out',
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
                        className="text-lg w-6 h-9.5 flex justify-center items-center cursor-pointer border-b border-(--primary-d)/20 dark:border-white/20 hover:text-(--highlight-d) dark:hover:text-(--primary-l)"
                        aria-label="Scroll to top"
                    >
                        <FontAwesomeIcon icon={faAngleUp} />
                    </button>

                    <ThemeSwitch />

                    <button
                        className="text-lg w-6 h-9.5 flex justify-center items-center cursor-pointer border-b border-(--primary-d)/20 dark:border-white/20 hover:text-(--highlight-d) dark:hover:text-(--primary-l)"
                        aria-label="Contact"
                    >
                        <FontAwesomeIcon icon={faEnvelope} />
                    </button>

                    <button
                        className="text-lg w-6 h-9.5 flex justify-center items-center cursor-pointer border-b border-(--primary-d)/20 dark:border-white/20 hover:text-(--highlight-d) dark:hover:text-(--primary-l)"
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
                    "text-lg w-6 h-9.5 flex justify-center items-center cursor-pointer hover:text-(--highlight-d) dark:hover:text-(--primary-l)",
                    !open && "heartbeat"
                )}
                aria-label="Toggle float menu"
            >
                <FontAwesomeIcon icon={faEllipsisV} />
            </button>
        </div>

        {isMobile && (   

            <button className={cn(
            "rounded-l-lg py-2 mt-2",
            "gap-2 text-(--primary-d)/80 dark:text-white/80",
            "backdrop-blur bg-(--primary-d)/10 dark:bg-white/10)",
            "translate-y-0 translate-x-[calc(100vw-((--spacing)*12))]",
            "px-3.5 py-2 h-13.5 w-13 z-30",
            "bg-(--primary-d)/10 dark:bg-white/10",
            "text-lg ",
            "flex justify-center items-center",
            " hover:text-(--highlight-d) dark:hover:text-(--primary-l)",
            "cursor-pointer",
            "transition-all duration-500 ease-out",
            visible
            ? "translate-x-none opacity-100"
            : "translate-x-full opacity-0 pointer-events-none",
            )} 
            aria-label="Toggle float menu">
            <FontAwesomeIcon icon={faSearchPlus} className='w-6 h-9.5'/>
            </button>

        )}
    </div>
  )
}
