import { useEffect, useState } from 'react'

interface CountUpProps {
  /** Final number to count up to */
  target: number
  /** Animation duration in ms */
  duration?: number
  className?: string
}

/**
 * Animates a number from 0 up to `target` once, on mount, using an
 * ease-out curve. Falls back to the final value instantly if the user
 * prefers reduced motion.
 */
export function CountUp({ target, duration = 1600, className }: CountUpProps) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setValue(target)
      return
    }

    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3) // easeOutCubic
      setValue(Math.round(eased * target))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])

  return <span className={className}>{value.toLocaleString('en-IN')}</span>
}
