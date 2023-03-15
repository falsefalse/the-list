import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'

import App from './App'

jest.mock('react-fps', () => ({
  FpsView: () => <>FPS Counter</>
}))

describe('App', () => {
  it('renders three sets of rows', () => {
    render(<App />)
    ;['1000', '10000', '100000'].forEach(count =>
      expect(screen.getByText(count)).toBeInTheDocument()
    )
  })

  it('toggles fps counter', () => {
    render(<App />)

    expect(screen.queryByText('Show FPS')).toBeInTheDocument()
    expect(screen.queryByText('Hide FPS')).not.toBeInTheDocument()
    expect(screen.queryByText('FPS Counter')).not.toBeInTheDocument()

    fireEvent.click(screen.getByText('Show FPS'))

    expect(screen.queryByText('Show FPS')).not.toBeInTheDocument()
    expect(screen.queryByText('Hide FPS')).toBeInTheDocument()
    expect(screen.queryByText('FPS Counter')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Hide FPS'))

    expect(screen.queryByText('Show FPS')).toBeInTheDocument()
    expect(screen.queryByText('Hide FPS')).not.toBeInTheDocument()
    expect(screen.queryByText('FPS Counter')).not.toBeInTheDocument()
  })
})
