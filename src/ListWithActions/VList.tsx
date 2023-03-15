import React, {
  useState,
  useMemo,
  CSSProperties,
  forwardRef,
  ForwardedRef
} from 'react'

import { Row, HeaderRow } from './Rows'
import { useForwardRef, useThrottledScrollHandler } from './hooks'

import './VList.css'

const { ceil, floor, max } = Math

type Props = {
  rowHeight: number
  height: number
  rows: Record<string, string>[]
}

type ScrollState = {
  start: number
  end: number
}

function VList(
  { rows, rowHeight, height }: Props,
  forwardedRef: ForwardedRef<HTMLTableElement>
) {
  const numberOfRowsToRender = ceil(height / rowHeight) * 2

  const [scrollState, setScrollState] = useState<ScrollState>({
    start: 0,
    end: numberOfRowsToRender
  })

  const scrollRef = useForwardRef(forwardedRef)

  useThrottledScrollHandler(scrollRef, scrollTop => {
    const start = floor(scrollTop / rowHeight)

    setScrollState({
      start,
      end: start + numberOfRowsToRender
    })
  })

  const visibleRows = useMemo(() => {
    let { start: index, end } = scrollState

    // there also should be something to scroll up to
    index = max(0, index - numberOfRowsToRender)

    return rows
      .slice(index, end)
      .map(r => <Row key={r.id} row={r} index={index++} height={rowHeight} />)
  }, [scrollState, rows, rowHeight, numberOfRowsToRender])

  const tbodyHeight = rowHeight * rows.length

  const cssVars = {
    '--table-height': `${height}px`,
    '--tbody-height': `${tbodyHeight}px`,
    '--row-height': `${rowHeight}px`
  } as CSSProperties

  return (
    <div className="VList-wrapper" style={cssVars}>
      <table>
        <thead>
          <HeaderRow />
        </thead>
      </table>

      <table className="VList-table" ref={scrollRef}>
        <tbody>{visibleRows}</tbody>
      </table>
    </div>
  )
}

export default forwardRef(VList)
