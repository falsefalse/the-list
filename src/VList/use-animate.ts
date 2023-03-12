import { useState, useLayoutEffect, RefObject } from 'react'

function getValue(
  start: number,
  end: number,
  elapsed: number,
  duration: number
) {
  if (elapsed > duration) return end
  return start + (end - start) * easing(elapsed / duration)
}

// cubic
function easing(time: number) {
  return 1 - --time * time * time * time
}

type AnimateParams = {
  from: number
  to: number
  onUpdate: (scrollTop: number) => void
  duration?: number
}

function animate({ from, to, onUpdate, duration = 800 }: AnimateParams) {
  const startTime = performance.now()

  const tick = () => {
    const elapsed = performance.now() - startTime

    window.requestAnimationFrame(() => {
      onUpdate(getValue(from, to, elapsed, duration))
      // recurse
      elapsed <= duration && tick()
    })
  }

  tick()
}

export default function useAnimate<T extends HTMLElement>(
  scrollRef: RefObject<T>
) {
  const [scrollTop, setScrollTop] = useState(0)

  useLayoutEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollTop })
  }, [scrollTop, scrollRef])

  return {
    smoothScrollTo: (to: number) => {
      animate({
        from: scrollTop,
        to,
        onUpdate: scrollTop => setScrollTop(scrollTop)
      })
    }
  }
}
