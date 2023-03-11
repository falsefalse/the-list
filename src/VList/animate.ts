function getValue(
  start: number,
  end: number,
  elapsed: number,
  duration: number
) {
  if (elapsed > duration) return end
  return start + (end - start) * easing(elapsed / duration)
}

function easing(time: number) {
  return 1 - --time * time * time * time
}

type AnimateParams = {
  from: number
  to: number
  onUpdate: (scrollTop: number) => void
  duration?: number
}

export default function animate({
  from,
  to,
  onUpdate,
  duration = 800
}: AnimateParams) {
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
