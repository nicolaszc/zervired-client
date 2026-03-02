// src/lib/uiMotion.ts
import type React from "react"

type DockMotionArgs = {
  index: number
  open: boolean
  stepMs: number
  // delays expresados en "steps" (multiplicados por stepMs)
  openSteps: number[]
  closeSteps: number[]
  moveMs?: number
  blurMs?: number
}

export function dockMotionStyle({
  index,
  open,
  stepMs,
  openSteps,
  closeSteps,
  moveMs,
  blurMs,
}: DockMotionArgs): React.CSSProperties {
  const move = moveMs ?? stepMs
  const blur = blurMs ?? 180

  const steps = open ? openSteps : closeSteps
  const staggerSteps = steps[index] ?? 0
  const staggerMs = staggerSteps * stepMs

  return {
    transitionProperty: "translate, backdrop-filter",
    transitionDuration: `${move}ms, ${blur}ms`,
    transitionTimingFunction: "cubic-bezier(0.2,0,0,1), ease-out",
    transitionDelay: `calc(var(--dock-phase-delay, 0ms) + ${staggerMs}ms), 0ms`,
  }
}
export function dockRootMotionStyle(args: {
  open: boolean
  stepMs: number
  openDelaySteps?: number
  closeDelaySteps?: number
  durationMultiplier?: number
}): React.CSSProperties {
  const { open, stepMs, openDelaySteps = 0, closeDelaySteps = 4, durationMultiplier = 2.5 } = args

  const delaySteps = open ? openDelaySteps : closeDelaySteps

  return {
    transitionProperty: "translate",
    transitionDuration: `${Math.round(stepMs * durationMultiplier)}ms`,
    transitionTimingFunction: "cubic-bezier(0.2,0,0,1)",
    transitionDelay: `${delaySteps * stepMs}ms`,
  }
}

/* export function simpleDelayStyle(args: {
  open: boolean
  stepMs: number
  openSteps: number
  closeSteps: number
  durationSteps?: number
  property?: string
}): React.CSSProperties {
  const {
    open,
    stepMs,
    openSteps,
    closeSteps,
    durationSteps = 1,
    property = "grid-template-rows",
  } = args

  const delaySteps = open ? openSteps : closeSteps
  return {
    transitionProperty: property,
    transitionDuration: `${durationSteps * stepMs}ms`,
    transitionTimingFunction: "cubic-bezier(0.2,0,0,1)",
    transitionDelay: `${delaySteps * stepMs}ms`,
  }
} */



export function dockPhaseDelayStyle(args: {
  open: boolean
  stepMs: number
  openSteps: number
  closeSteps: number
}): React.CSSProperties & Record<"--dock-phase-delay", string> {
  const { open, stepMs, openSteps, closeSteps } = args
  const ms = (open ? openSteps : closeSteps) * stepMs
  return { "--dock-phase-delay": `${ms}ms` }
}