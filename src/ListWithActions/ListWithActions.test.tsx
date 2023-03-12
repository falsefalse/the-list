import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import ListWithActions, { Props } from './ListWithActions'
import { fill, newItem } from '../utils'

// poor mans `scrollTo` implementation
window.HTMLElement.prototype.scrollTo = function (options) {
  const scrollTop = typeof options != 'number' ? options?.top : 0
  fireEvent.scroll(this, { target: { scrollTop } })

  act(() => {
    jest.runAllTimers()
  })
}

const rowHeight = 5 as const
const height = 15 as const

function getFirstColumn(container: HTMLElement) {
  return Array.from(
    container.querySelectorAll('tbody tr td:first-child').values()
  ).map(tr => tr.textContent)
}

function getRows(container: HTMLElement) {
  return container.querySelectorAll('tbody tr')
}

function scrollToRow(to: number) {
  const scrollEl = screen.getByTestId('vlist-table')
  fireEvent.scroll(scrollEl, {
    target: { scrollTop: to * rowHeight }
  })
  act(() => jest.runAllTimers())
}

function arrangeTest(rows: Props['rows']) {
  return render(<ListWithActions {...{ rowHeight, height, rows }} />)
}

const twoRows = fill(2).map((_, i) => newItem(i))
const twentyFiveRows = fill(25).map((_, i) => newItem(i))

describe('ListWithActions', () => {
  it('renders items', () => {
    const { container } = arrangeTest(twentyFiveRows)

    expect(container.textContent).toContain('25 items')
  })

  it('renders only visible items', () => {
    const { container } = arrangeTest(twentyFiveRows)

    expect(getRows(container)).toHaveLength(6)

    expect(getFirstColumn(container)).toStrictEqual([
      'Item #1',
      'Item #2',
      'Item #3',
      'Item #4',
      'Item #5',
      'Item #6'
    ])
  })

  it('adds new item up on button click', () => {
    const { container } = arrangeTest(twoRows)

    expect(getRows(container)).toHaveLength(2)

    fireEvent.click(screen.getByText('Add new item'))
    fireEvent.click(screen.getByText('Add new item'))
    fireEvent.click(screen.getByText('Add new item'))

    expect(getRows(container)).toHaveLength(5)
  })

  describe('Scrollity scoll', () => {
    beforeEach(() => {
      jest.useFakeTimers()
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it('renders a slice of the rows when list is scrolled', () => {
      const { container } = arrangeTest(twentyFiveRows)

      // to the middle
      scrollToRow(~~(25 / 2))

      // twice as much items so we have something to scroll
      expect(getFirstColumn(container)).toStrictEqual([
        'Item #7',
        'Item #8',
        'Item #9',
        'Item #10',
        'Item #11',
        'Item #12',
        'Item #13',
        'Item #14',
        'Item #15',
        'Item #16',
        'Item #17',
        'Item #18'
      ])

      // to the end
      scrollToRow(25)

      expect(getFirstColumn(container)).toStrictEqual([
        'Item #20',
        'Item #21',
        'Item #22',
        'Item #23',
        'Item #24',
        'Item #25'
      ])
    })

    it('scrolls to bottom up on button click', () => {
      const { container } = arrangeTest(twentyFiveRows)

      fireEvent.click(screen.getByText('⬇️'))
      act(() => {
        jest.advanceTimersByTime(800)
      })

      expect(getFirstColumn(container)).toStrictEqual([
        'Item #20',
        'Item #21',
        'Item #22',
        'Item #23',
        'Item #24',
        'Item #25'
      ])
    })

    it('scrolls to top up on button click', () => {
      const { container } = arrangeTest(twentyFiveRows)

      // go to bottom fist
      fireEvent.click(screen.getByText('⬇️'))
      act(() => {
        jest.advanceTimersByTime(100)
      })

      expect(getFirstColumn(container)).toStrictEqual([
        'Item #20',
        'Item #21',
        'Item #22',
        'Item #23',
        'Item #24',
        'Item #25'
      ])

      // and back to top then
      fireEvent.click(screen.getByText('⬆️'))
      act(() => {
        jest.advanceTimersByTime(100)
      })

      expect(getFirstColumn(container)).toStrictEqual([
        'Item #1',
        'Item #2',
        'Item #3',
        'Item #4',
        'Item #5',
        'Item #6'
      ])
    })

    it('goes to top on button click after list was scrolled', () => {
      const { container } = arrangeTest(twentyFiveRows)

      // to the middle
      scrollToRow(~~(25 / 2))

      expect(getFirstColumn(container)).toStrictEqual([
        'Item #7',
        'Item #8',
        'Item #9',
        'Item #10',
        'Item #11',
        'Item #12',
        'Item #13',
        'Item #14',
        'Item #15',
        'Item #16',
        'Item #17',
        'Item #18'
      ])

      // and back to top
      fireEvent.click(screen.getByText('⬆️'))
      act(() => {
        jest.advanceTimersByTime(100)
      })

      expect(getFirstColumn(container)).toStrictEqual([
        'Item #1',
        'Item #2',
        'Item #3',
        'Item #4',
        'Item #5',
        'Item #6'
      ])
    })
  })
})
