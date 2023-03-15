import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'

import ListWithActions, { Props } from './ListWithActions'
import { fill, newItem } from '../utils'

// poor mans `scrollTo` implementation
window.HTMLElement.prototype.scrollTo = function (optsOrNumber) {
  const scrollTop =
    typeof optsOrNumber == 'number' ? optsOrNumber : optsOrNumber?.top

  fireEvent.scroll(this, { target: { scrollTop } })

  act(() => {
    jest.runAllTimers()
  })
}

function getFirstColumn(container: Element) {
  return Array.from(
    container.querySelectorAll('tbody tr td:first-child').values()
  ).map(({ textContent }) => textContent)
}

function getRows(container: Element) {
  return container.querySelectorAll('tbody tr')
}

function scrollToRow(scrollEl: Element, rowNumber: number, rowHeight: number) {
  fireEvent.scroll(scrollEl, { target: { scrollTop: rowNumber * rowHeight } })
  act(() => jest.runAllTimers())
}

function arrangeTest(rows: Props['rows'], useDefaults = false) {
  const effectiveProps = !useDefaults
    ? {
        height: 15,
        rowHeight: 5,
        rows
      }
    : { rows }

  const { container } = render(<ListWithActions {...effectiveProps} />)

  const scrollEl = container.querySelector('.VList-table')!
  const {
    rowHeight = 85, // same as in component definiton
    rows: { length }
  } = effectiveProps

  Object.defineProperty(scrollEl, 'scrollHeight', {
    configurable: true,
    value: rowHeight * length
  })

  return { container, rowHeight, scrollEl }
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
      const { container, rowHeight, scrollEl } = arrangeTest(twentyFiveRows)

      // to the middle
      scrollToRow(scrollEl, ~~(25 / 2), rowHeight)

      // enough items to scroll both ways
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
      scrollToRow(scrollEl, 25, rowHeight)

      // enough items to scroll to top
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

    it('goes to top on button click after list was scrolled', () => {
      const { container, rowHeight, scrollEl } = arrangeTest(twentyFiveRows)

      // to the middle
      scrollToRow(scrollEl, ~~(25 / 2), rowHeight)

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
