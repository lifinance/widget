/** @vitest-environment happy-dom */

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { RouteIssueCard } from './RouteIssueCard.js'

let container: HTMLDivElement
let root: Root

beforeEach(() => {
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
})

afterEach(() => {
  act(() => root.unmount())
  container.remove()
})

describe('RouteIssueCard', () => {
  it('holds a button whose answer is already on its way', () => {
    const run = vi.fn()
    act(() => {
      root.render(
        <RouteIssueCard
          variant="cardless"
          content={{
            title: 'Temporarily unavailable',
            description: '',
            action: { label: 'Checking again…', run, disabled: true },
          }}
        />
      )
    })
    const button = container.querySelector('button')
    expect(button?.disabled).toBe(true)
    act(() => button?.click())
    expect(run).not.toHaveBeenCalled()
  })
})
