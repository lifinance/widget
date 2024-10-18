import type { WidgetConfig } from '@lifi/widget'
import { describe, expect, test } from 'vitest'
import { cloneStructuredConfig } from './cloneStructuredConfig'

describe('cloneStructuredConfig', () => {
  test('performs a deep clone', () => {
    const config = {
      theme: {
        palette: {
          primary: {
            main: '#5C67FF',
          },
        },
      },
    } as Partial<WidgetConfig>

    const copy = cloneStructuredConfig(config)

    expect(copy).toEqual({
      theme: {
        palette: {
          primary: {
            main: '#5C67FF',
          },
        },
      },
    })

    expect(copy.theme).not.toBe(config.theme)
    expect(copy.theme?.palette).not.toBe(config.theme?.palette)
    expect(copy.theme?.palette?.primary).not.toBe(
      config.theme?.palette?.primary
    )
  })

  test('passes the walletConfig as a shallow reference', () => {
    const onConnect = async () => {}

    const config = {
      walletConfig: { onConnect },
    }

    const copy = cloneStructuredConfig(config)

    expect(copy.walletConfig?.onConnect).toBe(onConnect)

    expect(config.walletConfig?.onConnect).toBe(onConnect)
  })
})
