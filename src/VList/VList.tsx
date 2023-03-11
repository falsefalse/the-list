import React, { useState, useMemo, CSSProperties } from 'react'
import throttle from 'lodash.throttle'

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
}

function VList({ rows, rowHeight, tableHeight }: Props) {
  const numberOfRowsToRender = useMemo(
    () => ceil((tableHeight * 2) / rowHeight),
    [tableHeight, rowHeight]
  )

  const [scrollState, setScrollState] = useState<ScrollState>({
    start: 0,
    end: numberOfRowsToRender
  })

  const handleScroll = useMemo(
    () =>
      throttle(
        ({ target }) => {
          const scrollTop = (target as HTMLElement).scrollTop
          const start = floor(scrollTop / rowHeight)

          setScrollState({
            start,
            end: start + numberOfRowsToRender
          })
        },
        50,
        { leading: false }
      ),
    [rowHeight, numberOfRowsToRender]
  )

  const visibleRows = useMemo(() => {
    let { start: index, end } = scrollState

    index = max(0, index - numberOfRowsToRender)

    return rows.slice(index, end).map(row => (
      <tr style={{ top: index++ * rowHeight }} key={row.id}>
        <td>Item #{row.id}</td>
        <td>{row.description}</td>
        <td>💲{row.price}</td>
      </tr>
    ))
  }, [scrollState, rows, rowHeight])

  const tbodyHeight = rowHeight * rows.length
  const cssVars = {
    '--table-height': `${tableHeight}px`,
    '--tbody-height': `${tbodyHeight}px`,
    '--row-height': `${rowHeight}px`
  } as CSSProperties

  return (
    <div className="VList-wrapper" style={cssVars}>
      <table>
        <thead>
          <tr>
            <th>Number #️⃣</th>
            <th>Description 🤖</th>
            <th>Price 🎲</th>
          </tr>
        </thead>
      </table>

      <table onScroll={handleScroll} className="VList-table">
        <tbody>{visibleRows}</tbody>
      </table>
    </div>
  )
}

export default VList
