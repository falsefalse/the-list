import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'

import ListWithActions, { Props } from './ListWithActions'
import { fill, newItem } from '../utils'

function getFirstColumn(container: Element) {
  return Array.from(
    container.querySelectorAll('tbody tr td:first-child').values()
  ).map(({ textContent }) => textContent)
}

function getRows(container: Element) {
  return container.querySelectorAll('tbody tr')
}

// poor mans `scrollTo({ top: number })` implementation
window.HTMLElement.prototype.scrollTo = function (optsOrNumber) {
  let scrollTop =
    typeof optsOrNumber == 'number' ? optsOrNumber : optsOrNumber?.top || 0

  scrollTop =
    scrollTop >= this.scrollHeight
      ? this.scrollHeight - this.offsetHeight
      : scrollTop

  fireEvent.scroll(this, { target: { scrollTop } })

  act(() => jest.runAllTimers())
}

function arrangeTest(rows: Props['rows'], useDefaults = false) {
  const effectiveProps = !useDefaults
    ? {
        // three rows are visible
        height: 15,
        rowHeight: 5,
        rows
      }
    : { rows }

  const { container } = render(<ListWithActions {...effectiveProps} />)
  const scrollEl = container.querySelector('.VList-table')!

  const {
    // need these for scrolling to work, same as in comp definition
    rowHeight = 85,
    height = 420,
    rows: { length }
  } = effectiveProps

  Object.defineProperty(scrollEl, 'scrollHeight', {
    value: rowHeight * length
  })
  Object.defineProperty(scrollEl, 'offsetHeight', {
    value: height
  })

  return { container, scrollEl }
}

const twoRows = fill(2).map((_, i) => newItem(i))
const twentyFiveRows = fill(25).map((_, i) => newItem(i))

describe('ListWithActions', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('uses default heights when those are not passed', () => {
    const { container } = arrangeTest(twentyFiveRows, true)

    expect(container.textContent).toContain('25 items')
    expect(getRows(container)).toHaveLength(10)
  })

  it('renders twice as much items as is visible', () => {
    const { container } = arrangeTest(twentyFiveRows)

    expect(container.textContent).toContain('25 items')
    expect(getRows(container)).toHaveLength(6)
    expect(getFirstColumn(container)).toStrictEqual([
      'Item #1', // visible
      'Item #2', // visible
      'Item #3', // visible
      'Item #4',
      'Item #5',
      'Item #6'
    ])
  })

  describe('Scrolling', () => {
    it('renders a slice of the rows when list is scrolled', () => {
      const { container, scrollEl } = arrangeTest(twentyFiveRows)

      // to the middle
      scrollEl.scrollTo({ top: scrollEl.scrollHeight / 2 })

      // enough items to scroll both ways
      expect(getFirstColumn(container)).toStrictEqual([
        'Item #10',
        'Item #11',
        'Item #12',
        'Item #13', // visible
        'Item #14', // visible
        'Item #15', // visible
        'Item #16',
        'Item #17',
        'Item #18'
      ])

      // to the end
      scrollEl.scrollTo({ top: scrollEl.scrollHeight })

      // enough items to scroll up
      expect(getFirstColumn(container)).toStrictEqual([
        'Item #20',
        'Item #21',
        'Item #22',
        'Item #23', // visible
        'Item #24', // visible
        'Item #25' // visible
      ])
    })
  })

  describe('Actions', () => {
    describe('Scrolling from the middle of the list', () => {
      let container: Element

      beforeEach(() => {
        const result = arrangeTest(twentyFiveRows)
        const { scrollEl } = result
        container = result.container

        // scroll to the middle
        scrollEl.scrollTo({ top: scrollEl.scrollHeight / 2 })

        expect(getFirstColumn(container)).toStrictEqual([
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
      })

      it('scrolls to top from current scroll position', () => {
        fireEvent.click(screen.getByText('⬆️'))
        act(() => jest.runAllTimers())

        expect(getFirstColumn(container)).toStrictEqual([
          'Item #1',
          'Item #2',
          'Item #3',
          'Item #4',
          'Item #5',
          'Item #6'
        ])
      })

      it('scrolls to bottom from current scroll position', () => {
        fireEvent.click(screen.getByText('⬇️'))
        act(() => jest.runAllTimers())

        expect(getFirstColumn(container)).toStrictEqual([
          'Item #20',
          'Item #21',
          'Item #22',
          'Item #23',
          'Item #24',
          'Item #25'
        ])
      })
    })

    it('adds new item up on button click', () => {
      const { container } = arrangeTest(twoRows)

      expect(getRows(container)).toHaveLength(2)

      fireEvent.click(screen.getByText('Add new item'))
      fireEvent.click(screen.getByText('Add new item'))
      fireEvent.click(screen.getByText('Add new item'))

      expect(getRows(container)).toHaveLength(5)
    })

    it('scrolls to bottom up on button click', () => {
      const { container } = arrangeTest(twentyFiveRows)

      fireEvent.click(screen.getByText('⬇️'))
      act(() => jest.runAllTimers())

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
      act(() => jest.runAllTimers())

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
      act(() => jest.runAllTimers())

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
