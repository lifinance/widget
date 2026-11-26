/** @vitest-environment happy-dom */

import type { Route } from '@lifi/sdk'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import type { ReactNode } from 'react'
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { WidgetMode } from '../../types/widget.js'

const config = vi.hoisted(() => ({ mode: 'default' as WidgetMode }))

vi.mock('../../providers/WidgetProvider/WidgetProvider.js', () => ({
  useWidgetConfig: () => ({ mode: config.mode }),
}))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))

vi.mock('./RouteToken.js', () => ({
  RouteToken: () => <div data-testid="route-token" />,
}))

const { RouteCard } = await import('./RouteCard.js')
const { RouteCardSkeleton } = await import('./RouteCardSkeleton.js')

const theme = createTheme({ cssVariables: true })

const createRoute = (tags: string[] = []): Route =>
  ({
    id: 'route-1',
    fromAmount: '10000000',
    toAmount: '1000000000000000',
    fromToken: { address: '0x1', chainId: 42161, decimals: 6, symbol: 'USDC' },
    toToken: { address: '0x0', chainId: 10, decimals: 18, symbol: 'ETH' },
    tags,
    steps: [{ estimate: { feeCosts: [], gasCosts: [] }, includedSteps: [] }],
  }) as unknown as Route

let container: HTMLDivElement
let root: Root

const render = (node: ReactNode) => {
  act(() => {
    root.render(<ThemeProvider theme={theme}>{node}</ThemeProvider>)
  })
}

const card = () => container.querySelector('.MuiCard-root')

beforeEach(() => {
  ;(
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
  ).IS_REACT_ACT_ENVIRONMENT = true
  config.mode = 'default'
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
})

afterEach(() => {
  act(() => root.unmount())
  container.remove()
})

describe('RouteCard', () => {
  it.each(['default', 'refuel'] as const)(
    'calls onClick in %s mode',
    (mode) => {
      config.mode = mode
      const onClick = vi.fn()
      render(<RouteCard route={createRoute()} onClick={onClick} />)
      const token = container.querySelector('[data-testid="route-token"]')
      act(() => {
        ;(token as HTMLElement).click()
      })
      expect(onClick).toHaveBeenCalledTimes(1)
    }
  )

  it('renders no card in refuel mode when the variant is cardless', () => {
    config.mode = 'refuel'
    render(<RouteCard route={createRoute()} variant="cardless" />)
    expect(card()).toBeNull()
  })

  it('hides the tags row in refuel mode', () => {
    config.mode = 'refuel'
    render(<RouteCard route={createRoute(['CHEAPEST'])} />)
    expect(container.textContent).not.toContain('main.tags.cheapest')

    config.mode = 'default'
    render(<RouteCard route={createRoute(['CHEAPEST'])} />)
    expect(container.textContent).toContain('main.tags.cheapest')
  })
})

describe('RouteCardSkeleton', () => {
  it('renders a card in refuel mode', () => {
    config.mode = 'refuel'
    render(<RouteCardSkeleton />)
    expect(card()).not.toBeNull()

    render(<RouteCardSkeleton variant="cardless" />)
    expect(card()).toBeNull()
  })
})
