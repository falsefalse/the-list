import React, { RefObject } from 'react'

import { useAnimate } from './hooks'

type Props<T> = {
  handleAdd: () => void
  scrollRef: RefObject<T>
}

export default function Actions<T extends HTMLElement>({
  handleAdd,
  scrollRef
}: Props<T>) {
  const { smoothScrollToStart, smoothScrollToEnd } = useAnimate(scrollRef)

  return (
    <div className="gap">
      <button
        onClick={() => {
          handleAdd()
          smoothScrollToEnd()
        }}
      >
        Add new item
      </button>

      <div className="gap gap-small">
        <button title="Scroll to top" onClick={smoothScrollToStart}>
          ⬆️
        </button>
        <button title="Scroll to bottom" onClick={smoothScrollToEnd}>
          ⬇️
        </button>
      </div>
    </div>
  )
}
