import React, { RefObject } from 'react'

import useAnimate from './use-animate'

type Props<T> = {
  handleAdd: () => void
  height: number
  scrollRef: RefObject<T>
}

export default function Actions<T extends HTMLElement>({
  handleAdd,
  height,
  scrollRef
}: Props<T>) {
  const { smoothScrollTo } = useAnimate(scrollRef)

  return (
    <div className="VList-actions gap">
      <button
        onClick={() => {
          handleAdd()
          smoothScrollTo(height)
        }}
      >
        Add new item
      </button>

      <div className="gap gap-small">
        <button title="Scroll to top" onClick={() => smoothScrollTo(0)}>
          ⬆️
        </button>
        <button title="Scroll to bottom" onClick={() => smoothScrollTo(height)}>
          ⬇️
        </button>
      </div>
    </div>
  )
}
