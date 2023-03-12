import React, { useState, useRef } from 'react'

import { newItem } from '../utils'

import VList from './VList'
import Actions from './Actions'

import './ListWithActions.css'

const addRow = (collection: Record<string, string>[]) => [
  ...collection,
  newItem(collection.length + 1)
]

export type Props = {
  rows: Record<string, string>[]
  rowHeight?: number
  height?: number
}

export default function ListWithActions({
  rows: passedRows,
  rowHeight = 85,
  height = 420
}: Props) {
  const tableRef = useRef<HTMLTableElement | null>(null)

  const [rows, setRows] = useState(passedRows)

  const tbodyHeight = rowHeight * rows.length

  return (
    <div className="ListWithActions">
      <header>
        <h3>
          <code>{rows.length}</code> items
        </h3>

        <Actions
          height={tbodyHeight}
          handleAdd={() => setRows(rows => [...addRow(rows)])}
          scrollRef={tableRef}
        />
      </header>

      <VList rows={rows} ref={tableRef} rowHeight={rowHeight} height={height} />
    </div>
  )
}
