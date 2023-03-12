import React, {
  useState,
  useMemo,
  useCallback,
  CSSProperties,
  forwardRef,
  ForwardedRef
} from 'react'
import throttle from 'lodash.throttle'

import { Row, HeaderRow } from './Rows'

import './VList.css'

const { ceil, floor, max } = Math

const SCROLL_THROTTLE = 25

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
  tableRef: ForwardedRef<HTMLTableElement>
) {
  const numberOfRowsToRender = useMemo(
    // double the visible amout so there is always something to scroll down
    () => ceil((height * 2) / rowHeight),
    [height, rowHeight]
  )

  const [scrollState, setScrollState] = useState<ScrollState>({
    start: 0,
    end: numberOfRowsToRender
  })

  // lint has no idea about `throttle`, its okay
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleScroll = useCallback(
    throttle(
      ({ target }) => {
        const scrollTop = (target as HTMLElement).scrollTop
        const start = floor(scrollTop / rowHeight)

        setScrollState({
          start,
          end: start + numberOfRowsToRender
        })
      },
      SCROLL_THROTTLE,
      { leading: false }
    ),
    []
  )

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

      <table className="VList-table" onScroll={handleScroll} ref={tableRef}>
        <tbody>{visibleRows}</tbody>
      </table>
    </div>
  )
}

export default forwardRef(VList)
