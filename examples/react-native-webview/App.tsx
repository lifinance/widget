/**
 * Example host app: the LI.FI widget running inside a WebView, with this
 * app's wallet serving the widget via the EIP-1193/6963 postMessage bridge.
 *
 * Run the widget page first (see ../widget-page), then point WIDGET_PAGE_URL
 * at it. Load the page from a real origin (LAN IP in dev) - a file:// bundle
 * gets an opaque origin, which breaks localStorage on Android and origin
 * checks on iOS.
 */
import { useMemo, useRef } from 'react'
import { Alert, Platform, SafeAreaView, StatusBar, StyleSheet } from 'react-native'
import { WebView, type WebViewMessageEvent } from 'react-native-webview'
import { generatePrivateKey } from 'viem/accounts'
import { buildInjectedProvider } from './src/bridge/injectedProvider'
import { isBridgeRequest } from './src/bridge/types'
import { type ApprovalRequest, WalletHost } from './src/bridge/walletHost'

// Dev server of ../widget-page. Use your machine's LAN IP for a device,
// localhost works for the iOS simulator.
const WIDGET_PAGE_URL = Platform.select({
  ios: 'http://localhost:5173',
  default: 'http://192.168.1.10:5173',
})!

// Ephemeral dev account, new on every app launch. Fund it only for a
// receipts run; never hardcode a real key.
const DEV_PRIVATE_KEY = generatePrivateKey()

const requestApproval = (request: ApprovalRequest): Promise<boolean> =>
  new Promise((resolve) => {
    Alert.alert('LI.FI widget', request.summary, [
      { text: 'Reject', style: 'cancel', onPress: () => resolve(false) },
      { text: 'Approve', onPress: () => resolve(true) },
    ])
  })

export default function App() {
  // `WebView<object>`: react-native-webview declares `WebView<P = undefined>
  // extends Component<WebViewProps & P>`, and under TypeScript 6 an
  // intersection with `undefined` collapses to `never`, so any use of `ref`
  // (which forces inference of P) type-errors. Pinning P to `object` keeps
  // WebViewProps intact.
  const webViewRef = useRef<WebView<object>>(null)

  const walletHost = useMemo(
    () =>
      new WalletHost({
        privateKey: DEV_PRIVATE_KEY,
        requestApproval,
        postToPage: (json) => webViewRef.current?.postMessage(json),
      }),
    []
  )

  const injectedJavaScriptBeforeContentLoaded = useMemo(
    () =>
      buildInjectedProvider({
        name: 'LI.FI RN Example',
        rdns: 'fi.li.example.rn',
        // 1x1 green px placeholder; EIP-6963 requires a data:/https: URI.
        icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        initialChainIdHex: walletHost.chainIdHex,
      }),
    [walletHost]
  )

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <WebView<object>
        ref={webViewRef}
        source={{ uri: WIDGET_PAGE_URL }}
        injectedJavaScriptBeforeContentLoaded={injectedJavaScriptBeforeContentLoaded}
        onMessage={(event: WebViewMessageEvent) => {
          try {
            const message = JSON.parse(event.nativeEvent.data)
            if (isBridgeRequest(message)) {
              walletHost.handleRequest(message)
            }
          } catch {
            // Non-bridge traffic (or malformed) - not ours.
          }
        }}
        // The widget is an SPA; avoid iOS rubber-banding inside it.
        bounces={false}
        webviewDebuggingEnabled={true}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
})
