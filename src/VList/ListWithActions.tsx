import React, { useState, useRef } from 'react'

import { newItem } from '../App'

import VList from './VList'
import Actions from './Actions'

const addRow = (collection: Record<string, string>[]) => [
  ...collection,
  newItem(String(collection.length + 1))
]

const listProps = {
  rowHeight: 85,
  height: 420
}

type Props = {
  rows: Record<string, string>[]
}

export default function ListWithActions({ rows: passedRows }: Props) {
  const tableRef = useRef<HTMLTableElement | null>(null)

  const [rows, setRows] = useState(passedRows)

  const tbodyHeight = listProps.rowHeight * rows.length

  return (
    <>
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

      <VList rows={rows} ref={tableRef} {...listProps} />
    </>
  )
}
