/**
 * DEV-ONLY automation channel - stripped before the PR (or kept behind
 * __DEV__ if maintainers want it; decided at review).
 *
 * The iOS a11y tree does not expose WKWebView DOM, so driving the widget
 * from test tooling via coordinates is flaky. Instead, the app (dev builds
 * only) polls a host-side command server and executes arbitrary JS inside
 * the WebView via injectJavaScript, reporting results back. Test scripts on
 * the host can then click widget elements by selector/text, type amounts,
 * and read DOM state deterministically.
 *
 * Protocol: GET  http://<host>:5199/next    -> { id, code } | 204
 *           POST http://<host>:5199/result  <- { id, ok, value }
 */
import type { WebView } from 'react-native-webview'

const HOST = 'http://localhost:5199'
const POLL_MS = 700

export const startDevAutomation = (
  getWebView: () => WebView<object> | null
): (() => void) => {
  if (!__DEV__) {
    return () => {}
  }
  let stopped = false

  const tick = async () => {
    if (stopped) {
      return
    }
    try {
      const response = await fetch(`${HOST}/next`)
      if (response.status === 200) {
        const { id, code } = await response.json()
        // Wrap the snippet: its completion value is posted back through the
        // page's ReactNativeWebView channel with the command id attached.
        const wrapped = `
(function () {
  var send = function (ok, value) {
    try {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        source: 'dev-automation', id: ${JSON.stringify(id)}, ok: ok,
        value: (function () { try { return JSON.stringify(value); } catch (e) { return String(value); } })(),
      }));
    } catch (e) {}
  };
  try {
    var result = (function () { ${code} })();
    if (result && typeof result.then === 'function') {
      result.then(function (v) { send(true, v); }, function (e) { send(false, e && (e.message || String(e))); });
    } else {
      send(true, result);
    }
  } catch (e) {
    send(false, e && (e.message || String(e)));
  }
})(); true;`
        getWebView()?.injectJavaScript(wrapped)
      }
    } catch {
      // Host server not running - stay quiet, keep polling.
    }
    setTimeout(tick, POLL_MS)
  }
  tick()
  return () => {
    stopped = true
  }
}

/** Forward a page automation result to the host server. Fire and forget. */
export const reportAutomationResult = (payload: unknown): void => {
  fetch(`${HOST}/result`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).catch(() => {})
}
