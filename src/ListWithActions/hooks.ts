import {
  useRef,
  ForwardedRef,
  useEffect,
  useCallback,
  useState,
  useLayoutEffect,
  RefObject
} from 'react'
import throttle from 'lodash.throttle'

// cubic
function ease(time: number) {
  return 1 - --time * time * time * time
}

function step(start: number, end: number, elapsed: number, duration: number) {
  if (elapsed > duration) return end
  return start + (end - start) * ease(elapsed / duration)
}

type AnimateParams = {
  from?: number
  to?: number
  onTick: (nextValue: number) => void
}

function animate({ from = 0, to = 0, onTick }: AnimateParams) {
  // or move to a parameter
  const duration = 800
  const startTime = performance.now()

  const tick = () => {
    const elapsed = performance.now() - startTime

    window.requestAnimationFrame(() => {
      onTick(step(from, to, elapsed, duration))
      // recurse
      elapsed <= duration && tick()
    })
  }

  tick()
}

export function useForwardRef<T>(forwardedRef: ForwardedRef<T>) {
  const ref = useRef<T>(null)

  useEffect(() => {
    if (!forwardedRef) {
      return
    } else if (typeof forwardedRef === 'function') {
      forwardedRef(ref.current)
    } else {
      forwardedRef.current = ref.current
    }
  }, [forwardedRef])

  return ref
}

export function useThrottledScrollHandler<T extends HTMLElement>(
  scrollRef: RefObject<T>,
  onScroll: (scrollTop: number) => void,
  wait = 25
) {
  const handler = throttle<EventListener>(
    event => onScroll((event.target as T).scrollTop),
    wait,
    { leading: false }
  )

  useEffect(() => {
    const scrollEl = scrollRef?.current
    scrollEl?.addEventListener('scroll', handler)

    return () => {
      scrollEl?.removeEventListener('scroll', handler)
    }
  }, [handler, scrollRef])
}

export function useAnimate<T extends HTMLElement>(scrollRef: RefObject<T>) {
  const [scrollTop, setScrollTop] = useState(0)

  useLayoutEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollTop })
  }, [scrollTop, scrollRef])

  const onTick = useCallback<AnimateParams['onTick']>(
    nextScrollTop => setScrollTop(nextScrollTop),
    []
  )

  return {
    smoothScrollToStart: () =>
      animate({
        from: scrollRef.current?.scrollTop,
        to: 0,
        onTick
      }),
    smoothScrollToEnd: () =>
      animate({
        from: scrollRef.current?.scrollTop,
        to: scrollRef.current?.scrollHeight,
        onTick
      })
  }
}
