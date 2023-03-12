import React, { useState } from 'react'
import { FpsView } from 'react-fps'

import ListWithActions from '../ListWithActions'

import { fill, newItem } from '../utils'

import './App.css'

const oneK = fill(1000).map((_, i) => newItem(i))
const tenK = fill(10 * 1000).map((_, i) => newItem(i))
const hundredK = fill(100 * 1000).map((_, i) => newItem(i))

function App() {
  const [showFps, setShowFps] = useState(false)

  return (
    <div className="App">
      {showFps && <FpsView />}

      <div className="gap">
        <code>
          👀{' '}
          <a href="https://github.com/falsefalse/the-list">
            Check out the code
          </a>
        </code>

        <button onClick={() => setShowFps(!showFps)}>
          {showFps ? 'Hide' : 'Show'} FPS
        </button>
      </div>

      <ListWithActions rows={oneK} />

      <ListWithActions rows={tenK} />

      <ListWithActions rows={hundredK} />
    </div>
  )
}

export default App
