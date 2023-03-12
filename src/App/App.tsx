import React, { useState, useRef } from 'react'
import { FpsView } from 'react-fps'

import VList, { Actions } from '../VList'

import './App.css'

const { ceil, random } = Math

const randomString = () => random().toString(20).substring(2)
const fill = (l: number) => new Array(l).fill(0)

const item = (id: string): Record<string, string> => ({
  id,
  description: fill(ceil(random() * 3))
    .map(randomString)
    .join(', '),
  price: (random() * 50).toFixed(2)
})

const oneK = fill(1000).map((_, id) => item(String(id + 1)))
const tenK = fill(10 * 1000).map((_, id) => item(String(id + 1)))
const hundredK = fill(100 * 1000).map((_, id) => item(String(id + 1)))

const addRow = (collection: Record<string, string>[]) => [
  ...collection,
  item(String(collection.length + 1))
]

const listProps = {
  rowHeight: 85,
  height: 420
}

function ListWithActions({
  rows: passedRows
}: {
  rows: Record<string, string>[]
}) {
  const tableRef = useRef<HTMLTableElement | null>(null)

  const [rows, setRows] = useState(passedRows)

  const tbodyHeight = listProps.rowHeight * rows.length

  return (
    <>
      <header className="gap">
        <h3>{rows.length} items</h3>

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

function App() {
  const [showFps, setShowFps] = useState(false)

  return (
    <div className="App">
      {showFps && <FpsView />}

      <div className="gap">
        <button onClick={() => setShowFps(!showFps)}>Toggle FPS counter</button>

        <code>
          👀{' '}
          <a href="https://github.com/falsefalse/the-list">
            Check out the code
          </a>
        </code>
      </div>

      <ListWithActions rows={oneK} />

      <ListWithActions rows={tenK} />

      <ListWithActions rows={hundredK} />
    </div>
  )
}

export default App
