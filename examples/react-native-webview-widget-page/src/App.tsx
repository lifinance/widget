import { LiFiWidget, type WidgetConfig } from '@lifi/widget'
import { EthereumProvider } from '@lifi/widget-provider-ethereum'
import { useEffect, useMemo, useState } from 'react'

/**
 * This page is meant to be rendered inside a react-native-webview.
 *
 * The React Native host injects an EIP-1193 provider (announced via EIP-6963)
 * before this page loads - see ../react-native-webview/src/bridge/injectedProvider.ts.
 * From the widget's point of view the host app is just another injected
 * wallet, so no widget internals are involved at all.
 *
 * The host can optionally pass widget config overrides:
 * - via the `config` query param (URI-encoded JSON), read once at load
 * - via postMessage({ type: 'widget:config', config }) at runtime
 */

const readConfigFromQuery = (): Partial<WidgetConfig> => {
  try {
    const raw = new URLSearchParams(window.location.search).get('config')
    return raw ? JSON.parse(decodeURIComponent(raw)) : {}
  } catch {
    return {}
  }
}

export const App = () => {
  const [configOverrides, setConfigOverrides] =
    useState<Partial<WidgetConfig>>(readConfigFromQuery)

  useEffect(() => {
    // RN -> page messages arrive on `document` on Android and `window` on iOS.
    const onMessage = (event: Event) => {
      const data = (event as MessageEvent).data
      if (typeof data !== 'string') {
        return
      }
      try {
        const message = JSON.parse(data)
        if (message?.type === 'widget:config' && message.config) {
          setConfigOverrides(message.config)
        }
      } catch {
        // Not ours - the wallet bridge uses its own message envelope.
      }
    }
    window.addEventListener('message', onMessage)
    document.addEventListener('message', onMessage)
    return () => {
      window.removeEventListener('message', onMessage)
      document.removeEventListener('message', onMessage)
    }
  }, [])

  const config: WidgetConfig = useMemo(
    () => ({
      integrator: 'lifi-rn-webview-example',
      // The widget takes wallet providers explicitly since v4. EVM only here:
      // the RN host's injected EIP-6963 provider is discovered by wagmi's
      // multi-injected-provider discovery inside EthereumProvider.
      providers: [EthereumProvider()],
      appearance: 'light',
      theme: {
        container: {
          height: '100%',
          border: 'none',
        },
      },
      ...configOverrides,
    }),
    [configOverrides]
  )

  return <LiFiWidget integrator={config.integrator} config={config} />
}
