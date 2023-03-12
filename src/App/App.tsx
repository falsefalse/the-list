import React, { useState } from 'react'
import { FpsView } from 'react-fps'

import ListWithActions from '../VList'

import { fill, newItem } from '../utils'

import './App.css'

const oneK = fill(1000).map((_, id) => newItem(id + 1))
const tenK = fill(10 * 1000).map((_, id) => newItem(id + 1))
const hundredK = fill(100 * 1000).map((_, id) => newItem(id + 1))

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
