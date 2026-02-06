'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useTheme } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'
import ThemeSwitch from '@/components/ui/ThemeSwitch'
import { useIntersection } from '@/hooks/useIntersection'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisV, faAngleUp } from '@fortawesome/free-solid-svg-icons'
import { faEnvelope } from '@fortawesome/free-regular-svg-icons'
import { faWhatsapp} from '@fortawesome/free-brands-svg-icons'
interface Rule {
  target: string
  when: 'in' | 'out'
}
interface Props {
  intersect?: Rule[]
}

export default function FloatMenu({ intersect }: Props) {

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
    //const [onHero, setOnHero] = useState(true)
    const [offset, setOffset] = useState(0)
    const [mounted, setMounted] = useState(false)

    const velocity = useRef(0)
    const lastScroll = useRef(0)
    const raf = useRef<number | null>(null)

    const { theme } = useTheme()
    const dark = theme === 'dark'

    const [isMobile] = useState(() => {
        if (typeof window === 'undefined') return false
        return window.matchMedia('(max-width: 640px)').matches
    })   

    useEffect(() => {
        Promise.resolve().then(() => setMounted(true))
    }, [])

    useEffect(() => {
    if (!isMobile) {
        Promise.resolve().then(() => setOpen(true))
    }
    }, [isMobile])

    // Resorte (loop)
    const animate = useCallback(() => {
        const step = () => {
        setOffset(o => {
            const k = 0.05
            const damping = 0.85

            const force = -k * o
            velocity.current = (velocity.current + force) * damping
            const next = o + velocity.current

            if (Math.abs(next) < 0.1 && Math.abs(velocity.current) < 0.1) {
            velocity.current = 0
            return 0
            }

            return next
        })

        raf.current = requestAnimationFrame(step)
        }

        step()
    }, [])

    // Scroll: estira + cierra
    const onScroll = useCallback(() => {
        if (open) setOpen(false)

        const current = window.scrollY
        const delta = current - lastScroll.current
        lastScroll.current = current

        const raw = delta * 0.5
        velocity.current = velocity.current * 0.7 + raw * 0.3

        setOffset(o => Math.max(-40, Math.min(40, o + velocity.current)))
    }, [open, setOpen])

    // Mount
   useEffect(() => {
        if (!mounted) return

        lastScroll.current = window.scrollY

        if (!isMobile) {
            animate()
            window.addEventListener('scroll', onScroll, { passive: true })
        } else {
            const close = () => setOpen(false)
            window.addEventListener('scroll', close, { passive: true })
        }

        return () => {
            window.removeEventListener('scroll', onScroll)
            if (raf.current) cancelAnimationFrame(raf.current)
        }

    }, [mounted, animate, onScroll, isMobile])
/* 
    // Detect hero
    useEffect(() => {
        const hero = document.querySelector('[data-hero]')
        if (!hero) return

        const observer = new IntersectionObserver(
        ([entry]) => setOnHero(entry.isIntersecting),
        { threshold: 0.9 }
        )

        observer.observe(hero)
        return () => observer.disconnect()
    }, []) */

    return (
    <div
        suppressHydrationWarning
        style={mounted && !isMobile ? { transform: `translateY(${offset}px)` } : undefined}
        className={cn(
            'fixed bottom-[50%] translate-y-1/2 md:translate-y-2/5 end-0 px-3.5 py-2 z-30 rounded-l-lg gap-2 text-sky-950/80 dark:text-white/80 text-sm backdrop-blur bg-sky-950/10 dark:bg-white/10 transition-all duration-200 ease-out',
            visible && !dark && 'bg-white/50'
        )}
    >
        {/* SUBMENU */}
        <div
            className={`
            grid transition-[grid-template-rows] duration-500 ease-out',
            ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr] delay-700'}
            `}
        >
            <div
            className={`
                overflow-hidden flex flex-col items-center
                transition-opacity duration-1000 ease-out
                ${open ? 'opacity-100 delay-500' : 'opacity-0'}
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
