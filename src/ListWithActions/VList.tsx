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

function VList(
  { rows, rowHeight, height }: Props,
  forwardedRef: ForwardedRef<HTMLTableElement>
) {
  const [currentRow, setCurrentRow] = useState(0)

  const scrollRef = useForwardRef(forwardedRef)

  useThrottledScrollHandler(scrollRef, scrollTop =>
    setCurrentRow(floor(scrollTop / rowHeight))
  )

  const numberOfRowsThatFit = ceil(height / rowHeight)

  const visibleRows = useMemo(() => {
    let start = max(0, currentRow - numberOfRowsThatFit)
    let end = currentRow + numberOfRowsThatFit * 2

    return rows
      .slice(start, end)
      .map(r => <Row key={r.id} row={r} index={start++} height={rowHeight} />)
  }, [currentRow, rows, rowHeight, numberOfRowsThatFit])

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
