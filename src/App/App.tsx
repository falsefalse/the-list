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

const thousandItems = fill(1000).map((_, id) => item(String(id + 1)))
const hundredThousandsItems = fill(100 * 1000).map((_, id) =>
  item(String(id + 1))
)

const listProps = {
  rowHeight: 85,
  tableHeight: 420
}

function App() {
  const [showFps, setShowFps] = useState(true)

  return (
    <>
      {showFps && <FpsView />}

      <button onClick={() => setShowFps(!showFps)}>Toggle FPS counter</button>

      <header>
        <h3>1k items</h3>
      </header>

      <VList rows={thousandItems} {...listProps} />

      <header>
        <h3>100k items</h3>
      </header>

      <VList rows={hundredThousandsItems} {...listProps} />
    </>
  )
}

export default App
