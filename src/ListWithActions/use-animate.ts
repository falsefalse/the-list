import {
  useEffect,
  useCallback,
  useState,
  useLayoutEffect,
  RefObject
} from 'react'
import throttle from 'lodash.throttle'

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

export function useThrottledScrollHandler(
  callback: (scrollTop: number) => void,
  throttleMsec = 25
) {
  // lint doesn't know about `throttle`, its okay
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(
    throttle(
      ({ target }) => callback((target as HTMLElement).scrollTop),
      throttleMsec,
      { leading: false }
    ),
    []
  )
}

export default function useAnimate<T extends HTMLElement>(
  scrollRef: RefObject<T>
) {
  const [scrollTop, setScrollTop] = useState(0)
  const handleScroll = useThrottledScrollHandler(scrollTop =>
    setScrollTop(scrollTop)
  )

  useEffect(() => {
    const scrollEl = scrollRef.current
    scrollEl?.addEventListener('scroll', handleScroll)

    return () => {
      scrollEl?.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll, scrollRef])

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
