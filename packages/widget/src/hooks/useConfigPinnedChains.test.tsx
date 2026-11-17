/** @vitest-environment happy-dom */

import type { ExtendedChain } from '@lifi/sdk'
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { WidgetContext } from '../providers/WidgetProvider/WidgetProvider.js'
import type { FormType } from '../stores/form/types.js'
import type { PinnedChain } from '../types/widget.js'
import { useConfigPinnedChains } from './useConfigPinnedChains.js'

const chains = [{ id: 1 }, { id: 137 }] as ExtendedChain[]

let pinnedIds: number[]

const Probe = ({ side }: { side: FormType | undefined }): null => {
  pinnedIds = [...useConfigPinnedChains(chains, side).keys()]
  return null
}

let root: Root

beforeEach(() => {
  pinnedIds = []
  root = createRoot(document.createElement('div'))
})

afterEach(() => {
  act(() => {
    root.unmount()
  })
})

const render = (pinned: PinnedChain[], side: FormType | undefined) => {
  act(() => {
    root.render(
      <WidgetContext
        value={
          {
            elementId: '',
            integrator: '',
            chains: { pinned },
          } as never
        }
      >
        <Probe side={side} />
      </WidgetContext>
    )
  })
}

describe('useConfigPinnedChains', () => {
  it('returns pins for the side', () => {
    render([{ chainId: 137 }, { chainId: 1, side: 'to' }], 'from')
    expect(pinnedIds).toEqual([137])
  })

  it('updates when the config changes', () => {
    render([{ chainId: 137 }], 'from')
    expect(pinnedIds).toEqual([137])
    render([{ chainId: 1 }], 'from')
    expect(pinnedIds).toEqual([1])
  })

  it('returns no pins without a side', () => {
    render([{ chainId: 137 }], undefined)
    expect(pinnedIds).toEqual([])
  })
})
