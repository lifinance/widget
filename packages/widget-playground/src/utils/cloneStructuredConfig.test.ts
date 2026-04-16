import type { WidgetConfig } from '@lifi/widget'
import { describe, expect, test } from 'vitest'
import { cloneStructuredConfig } from './cloneStructuredConfig.js'

describe('cloneStructuredConfig', () => {
  test('performs a deep clone', () => {
    const config = {
      theme: {
        colorSchemes: {
          light: {
            palette: {
              primary: {
                main: '#5C67FF',
              },
            },
          },
        },
      },
    } as Partial<WidgetConfig>

    const copy = cloneStructuredConfig(config)

    expect(copy).toEqual({
      theme: {
        colorSchemes: {
          light: {
            palette: {
              primary: {
                main: '#5C67FF',
              },
            },
          },
        },
      },
    })

    expect(copy.theme).not.toBe(config.theme)
    expect(copy.theme?.colorSchemes).not.toBe(config.theme?.colorSchemes)
    expect(copy.theme?.colorSchemes?.light?.palette?.primary).not.toBe(
      config.theme?.colorSchemes?.light?.palette?.primary
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
