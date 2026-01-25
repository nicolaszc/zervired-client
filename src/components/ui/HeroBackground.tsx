'use client'

export default function CircuitBackground() {
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-[0.15] pointer-events-none"
      viewBox="0 0 1000 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0ea5e9" />
        </linearGradient>
      </defs>

      {[...Array(6)].map((_, i) => (
        <path
          key={i}
          d={`M ${50 + i * 120} 0 V 200 H ${200 + i * 80} V 600`}
          stroke="url(#lineGradient)"
          strokeWidth="1.5"
          strokeDasharray="6 10"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="0"
            to="200"
            dur={`${12 + i * 2}s`}
            repeatCount="indefinite"
          />
        </path>
      ))}
    </svg>
  )
}
