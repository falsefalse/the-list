import React, { useState } from 'react'
import { FpsView } from 'react-fps'

import VList from '../VList'

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
  tableHeight: 420
}

function App() {
  const [showFps, setShowFps] = useState(true)

  const [rows, setRows] = useState({ oneK, tenK, hundredK })

  return (
    <>
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

      <header>
        <h3>1k items</h3>

        <button
          onClick={() => {
            setRows(rs => ({ ...rs, oneK: addRow(rs.oneK) }))
          }}
        >
          Add a new item
        </button>
      </header>

      <VList rows={rows.oneK} {...listProps} />

      <header>
        <h3>10k items</h3>

        <button
          onClick={() => {
            setRows(rs => ({ ...rs, tenK: addRow(rs.tenK) }))
          }}
        >
          Add a new item
        </button>
      </header>

      <VList rows={rows.tenK} {...listProps} />

      <header>
        <h3>100k items</h3>

        <button
          onClick={() => {
            setRows(rs => ({ ...rs, hundredK: addRow(rs.hundredK) }))
          }}
        >
          Add a new item
        </button>
      </header>

      <VList rows={rows.hundredK} {...listProps} />
    </>
  )
}

export default App
