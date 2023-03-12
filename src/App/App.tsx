import React, { useState } from 'react'
import { FpsView } from 'react-fps'

import ListWithActions from '../VList'

import './App.css'

const { ceil, random } = Math

const randomString = () => random().toString(20).substring(2)
const fill = (l: number) => new Array(l).fill(0)

export const newItem = (id: string): Record<string, string> => ({
  id,
  description: fill(ceil(random() * 3))
    .map(randomString)
    .join(', '),
  price: (random() * 50).toFixed(2)
})

const oneK = fill(1000).map((_, id) => newItem(String(id + 1)))
const tenK = fill(10 * 1000).map((_, id) => newItem(String(id + 1)))
const hundredK = fill(100 * 1000).map((_, id) => newItem(String(id + 1)))

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
