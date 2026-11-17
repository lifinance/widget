/** @vitest-environment happy-dom */

import type { ExtendedChain } from '@lifi/sdk'
import { ThemeProvider } from '@mui/material/styles'
import type { ComponentProps } from 'react'
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  type Mock,
  vi,
} from 'vitest'
import { createTheme } from '../../themes/createTheme.js'
import { ChainSelectItem } from './ChainSelectItem.js'

const chain = {
  id: 143,
  key: 'mon',
  name: 'Monad',
  logoURI: 'https://example.com/monad.svg',
} as ExtendedChain

const theme = createTheme()

let container: HTMLDivElement
let root: Root
let onSelect: Mock<(id: number) => void>

const render = (
  props: Partial<ComponentProps<typeof ChainSelectItem>> = {}
): void => {
  act(() => {
    root.render(
      <ThemeProvider theme={theme}>
        <ChainSelectItem
          chain={chain}
          isSelected={false}
          isAllNetworks={false}
          onSelect={onSelect}
          {...props}
        />
      </ThemeProvider>
    )
  })
}

const getBadge = (): Element | null => container.querySelector('.chain-badge')

beforeEach(() => {
  ;(
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
  ).IS_REACT_ACT_ENVIRONMENT = true
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
  onSelect = vi.fn<(id: number) => void>()
})

afterEach(() => {
  act(() => {
    root.unmount()
  })
  container.remove()
})

describe('ChainSelectItem', () => {
  it('shows a badge for a short label', () => {
    render({ label: { text: 'NEW' } })

    expect(getBadge()?.textContent).toBe('NEW')
  })

  it('shows the trimmed label text in the badge', () => {
    render({ label: { text: ' NEW ' } })

    expect(getBadge()?.textContent).toBe('NEW')
  })

  it('shows no badge for a long label', () => {
    render({ label: { text: 'Promo' } })

    expect(getBadge()).toBeNull()
  })

  it('shows no badge for whitespace text', () => {
    render({ label: { text: '  ' } })

    expect(getBadge()).toBeNull()
  })

  it('shows no badge without a label', () => {
    render()

    expect(getBadge()).toBeNull()
  })

  it('lets only a tile with a badge overflow its edge', () => {
    render({ label: { text: 'NEW' } })
    const badgeTile = container.querySelector('button')
    expect(getComputedStyle(badgeTile!).overflow).toBe('visible')

    render({ label: { text: 'Promo' } })
    const plainTile = container.querySelector('button')
    expect(getComputedStyle(plainTile!).overflow).not.toBe('visible')
  })

  it('selects the chain on click', () => {
    render()

    const button = container.querySelector<HTMLButtonElement>('button')
    expect(button).not.toBeNull()
    act(() => {
      button!.click()
    })

    expect(onSelect).toHaveBeenCalledWith(chain.id)
  })
})
