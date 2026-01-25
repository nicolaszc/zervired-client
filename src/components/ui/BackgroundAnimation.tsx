'use client'

const lineGroups = [
  { startY: 150, count: 10, gap: 14 },
  { startY: 450, count: 9, gap: 16 },
  { startY: 900, count: 8, gap: 18 },
]

const LINE_WIDTHS = [0.6, 0.8, 1]

const NODE_SIZES = [
  { halo: 7, glow: 4.5, core: 2.2 },
  { halo: 8, glow: 5, core: 2.4 },
  { halo: 9, glow: 5.5, core: 2.6 },
]

const NODE_KEYPOINTS = [0.3, 0.5, 0.75]

export default function BackgroundAnimation() {
  return (
    <svg
      className="fixed inset-0 w-full h-full z-0 pointer-events-none opacity-[0.5] dark:opacity-[0.25] text-amber-500 dark:text-sky-500"
      viewBox="0 0 1200 700"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="currentColor" />
          <stop offset="100%" stopColor="currentColor" />
        </linearGradient>

        <filter id="lineSoft">
          <feGaussianBlur stdDeviation="0.35" />
        </filter>

        <filter id="nodeGlowSoft" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" />
        </filter>

        <filter id="nodeGlowStrong" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="5" />
        </filter>

        <filter id="coreGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.2" />
        </filter>
      </defs>

      {lineGroups.map((group, gIndex) =>
        [...Array(group.count)].map((_, i) => {
          const y = group.startY + i * group.gap

          const x1 = 180 + (i % 4) * 60
          const x2 = x1 + 160 + (i % 3) * 40
          const x3 = x2 + 200 + (i % 2) * 80

          const path = `
            M 0 ${y}
            H ${x1}
            V ${y + (i % 2 === 0 ? 16 : -12)}
            H ${x2}
            V ${y + (i % 3 === 0 ? 22 : -18)}
            H ${x3}
            H 1200
          `

          const node = NODE_SIZES[i % NODE_SIZES.length]
          const nodeKeyPoint = NODE_KEYPOINTS[i % NODE_KEYPOINTS.length]

          return (
            <g key={`${gIndex}-${i}`}>
              {/* Línea */}
              <path
                id={`path-${gIndex}-${i}`}
                d={path}
                stroke="url(#lineGradient)"
                strokeWidth={LINE_WIDTHS[i % LINE_WIDTHS.length]}
                opacity="0.65"
                filter="url(#lineSoft)"
              />

              {/* Pulso */}
              {i % 3 === 0 && (
                <circle r="2.2" fill="currentColor" opacity="0.6">
                  <animateMotion
                    dur={`${16 + i * 2}s`}
                    repeatCount="indefinite"
                    path={path}
                  />
                </circle>
              )}

              {/* Nodo fijo anclado al path */}
              <g>
                <animateMotion
                  dur="0.001s"
                  fill="freeze"
                  keyPoints={`${nodeKeyPoint};${nodeKeyPoint}`}
                  keyTimes="0;1"
                  calcMode="linear"
                >
                  <mpath xlinkHref={`#path-${gIndex}-${i}`} />
                </animateMotion>

                <circle
                  r={node.halo}
                  fill="currentColor"
                  opacity="0.25"
                  filter="url(#nodeGlowStrong)"
                />

                <circle
                  r={node.glow}
                  fill="currentColor"
                  opacity="0.6"
                  filter="url(#nodeGlowSoft)"
                />

                <circle
                  r={node.core + 0.6}
                  fill="currentColor"
                  opacity="0.5"
                  filter="url(#coreGlow)"
                />

                <circle
                  r={node.core}
                  fill="#ffffff"
                  opacity="1"
                />
              </g>
            </g>
          )
        })
      )}
    </svg>
  )
}
