/** @vitest-environment happy-dom */

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { RouteIssue } from '../../utils/routeIssues/types.js'
import { RouteNotFoundCard } from './RouteNotFoundCard.js'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))
// A card comes back only for a known reason; the builder decides which.
vi.mock('../../hooks/useRouteIssueCard.js', () => ({
  useRouteIssueCard: (issue?: RouteIssue) =>
    issue ? { title: `card:${issue.bucket}`, description: '' } : undefined,
}))
vi.mock('./RouteIssueCard.js', () => ({
  RouteIssueCard: ({ content }: { content: { title: string } }) => (
    <div data-testid="issue-card">{content.title}</div>
  ),
}))

let container: HTMLDivElement
let root: Root

const render = (issues?: readonly RouteIssue[]): void => {
  act(() => {
    root.render(<RouteNotFoundCard issues={issues} />)
  })
}

beforeEach(() => {
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
})

afterEach(() => {
  act(() => root.unmount())
  container.remove()
})

describe('RouteNotFoundCard', () => {
  // Nothing recognised has to leave today's sentence exactly where it was.
  it.each([
    ['no issues', []],
    ['issues not yet known', undefined],
  ])('keeps the generic copy with %s', (_label, issues) => {
    render(issues)
    expect(container.textContent).toContain('info.message.routeNotFound')
    expect(container.querySelector('[data-testid="issue-card"]')).toBe(null)
  })

  it('shows the best-ranked reason in place of the generic copy', () => {
    render([
      { bucket: 'amountTooLow', ruleId: 'a', fromAmount: 1n },
      { bucket: 'liquidity', ruleId: 'b', fromAmount: 1n },
    ])
    const cards = container.querySelectorAll('[data-testid="issue-card"]')
    expect(cards).toHaveLength(1)
    expect(cards[0].textContent).toBe('card:amountTooLow')
    expect(container.textContent).not.toContain('info.message.routeNotFound')
  })
})
