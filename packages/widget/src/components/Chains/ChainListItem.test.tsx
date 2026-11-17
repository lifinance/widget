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
import { ChainListItem } from './ChainListItem.js'
import { pinButtonClassName } from './PinChainButton.js'

const chain = {
  id: 143,
  name: 'Monad',
  logoURI: 'https://example.com/monad.svg',
} as ExtendedChain

const theme = createTheme()

let container: HTMLDivElement
let root: Root
let onSelect: Mock<(chain: ExtendedChain) => void>
let onPin: Mock<(chainId: number) => void>

const render = (
  props: Partial<ComponentProps<typeof ChainListItem>> = {}
): void => {
  act(() => {
    root.render(
      <ThemeProvider theme={theme}>
        <ChainListItem
          chain={chain}
          onSelect={onSelect}
          onPin={onPin}
          itemsSize="small"
          size={48}
          start={0}
          isPinned={false}
          isLocked={false}
          withPin={false}
          {...props}
        />
      </ThemeProvider>
    )
  })
}

const clickPin = (): void => {
  const pinButton = container.querySelector<HTMLButtonElement>(
    `.${pinButtonClassName}`
  )
  expect(pinButton).not.toBeNull()
  act(() => {
    pinButton!.click()
  })
}

beforeEach(() => {
  ;(
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
  ).IS_REACT_ACT_ENVIRONMENT = true
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
  onSelect = vi.fn<(chain: ExtendedChain) => void>()
  onPin = vi.fn<(chainId: number) => void>()
})

afterEach(() => {
  act(() => {
    root.unmount()
  })
  container.remove()
})

describe('ChainListItem', () => {
  it('shows the label text', () => {
    render({ label: { text: 'NEW' } })

    expect(container.querySelector('.chain-label')).not.toBeNull()
    expect(container.textContent).toContain('NEW')
  })

  it('shows no label for whitespace text', () => {
    render({ label: { text: '  ' } })

    expect(container.querySelector('.chain-label')).toBeNull()
  })

  it('a locked pin click does not unpin or select', () => {
    render({ withPin: true, isPinned: true, isLocked: true })

    clickPin()

    expect(onPin).not.toHaveBeenCalled()
    expect(onSelect).not.toHaveBeenCalled()
  })

  it('an unlocked pin click unpins', () => {
    render({ withPin: true, isPinned: true, isLocked: false })

    clickPin()

    expect(onPin).toHaveBeenCalledWith(chain.id)
    expect(onSelect).not.toHaveBeenCalled()
  })
})
