import React, {
  useState,
  useMemo,
  useCallback,
  CSSProperties,
  useRef,
  useLayoutEffect
} from 'react'
import throttle from 'lodash.throttle'

import animate from './animate'
import { Row, HeaderRow } from './Rows'

import './VList.css'

const { ceil, floor, max } = Math

type Props = {
  rowHeight: number
  tableHeight: number
  rows: Record<string, string>[]
}

type ScrollState = {
  start: number
  end: number
  scrollTop: number
}

const SCROLL_THROTTLE = 25

function VList({ rows, rowHeight, tableHeight }: Props) {
  const numberOfRowsToRender = useMemo(
    // double the visible amout so there is always something to scroll down
    () => ceil((tableHeight * 2) / rowHeight),
    [tableHeight, rowHeight]
  )

  const [scrollState, setScrollState] = useState<ScrollState>({
    start: 0,
    end: numberOfRowsToRender,
    scrollTop: 0
  })

  // lint has no idea about `throttle`, and it's ok
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleScroll = useCallback(
    throttle(
      ({ target }) => {
        const scrollTop = (target as HTMLElement).scrollTop
        const start = floor(scrollTop / rowHeight)

        setScrollState({
          start,
          end: start + numberOfRowsToRender,
          scrollTop
        })
      },
      SCROLL_THROTTLE,
      { leading: false }
    ),
    []
  )

  const tableRef = useRef<HTMLTableElement>(null)
  useLayoutEffect(() => {
    tableRef.current?.scrollTo({
      top: scrollState.scrollTop
    })
  }, [scrollState.scrollTop])

  const visibleRows = useMemo(() => {
    let { start: index, end } = scrollState

    // there also should be something to scroll up
    index = max(0, index - numberOfRowsToRender)

    return rows
      .slice(index, end)
      .map(r => <Row key={r.id} row={r} index={index++} height={rowHeight} />)
  }, [scrollState, rows, rowHeight, numberOfRowsToRender])

  const tbodyHeight = rowHeight * rows.length

  const cssVars = {
    '--table-height': `${tableHeight}px`,
    '--tbody-height': `${tbodyHeight}px`,
    '--row-height': `${rowHeight}px`
  } as CSSProperties

  const animateScroll = useMemo(
    () => ({
      from: scrollState.scrollTop,
      onUpdate: (scrollTop: number) =>
        setScrollState(state => ({ ...state, scrollTop }))
    }),
    [scrollState.scrollTop]
  )

  // when new row gets added we scroll to the end
  const initialRows = useRef(rows.length)
  useLayoutEffect(() => {
    if (initialRows.current === rows.length) return

    animate({ ...animateScroll, to: tbodyHeight })
    // don't care about anything but the `rows`
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows])

  return (
    <div className="VList-wrapper" style={cssVars}>
      <div className="VList-buttons gap">
        <button
          title="Scroll to top"
          onClick={() => animate({ ...animateScroll, to: 0 })}
        >
          ⬆️
        </button>
        <button
          title="Scroll to bottom"
          onClick={() => animate({ ...animateScroll, to: tbodyHeight })}
        >
          ⬇️
        </button>
      </div>

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

export default VList
