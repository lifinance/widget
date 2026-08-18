/**
 * Builds the JavaScript injected into the WebView BEFORE the widget page
 * loads (`injectedJavaScriptBeforeContentLoaded`).
 *
 * It materializes an EIP-1193 provider inside the page and announces it via
 * EIP-6963, so the widget's wallet-management discovers the React Native
 * host app exactly like any injected browser wallet - name, icon and all.
 * No widget internals are touched; this is just another wallet as far as
 * the page is concerned.
 *
 * Mechanics:
 * - `request({ method, params })` posts an id-tagged envelope to RN over
 *   `window.ReactNativeWebView.postMessage` and returns a Promise held in a
 *   pending map until the correlated response comes back.
 * - RN -> page traffic arrives via a `message` event - on `window` for iOS
 *   WKWebView and on `document` for Android - so both are listened to.
 * - Responses reject with the exact ProviderRpcError shape RN sent (4001 on
 *   user rejection is what lets the widget's execution state machine recover
 *   instead of hanging).
 * - `chainChanged`/`accountsChanged` events from RN are re-emitted through
 *   the provider's emitter, keeping wagmi inside the widget in sync with the
 *   host wallet after chain switches.
 *
 * Everything is wrapped in an IIFE with no leaks besides the provider itself.
 */

export interface InjectedProviderOptions {
  /** Wallet name shown by the widget's wallet menu (EIP-6963 info.name). */
  name: string
  /** Data URI or https icon (EIP-6963 requires a data/https URI). */
  icon: string
  /** RDNS identifier, e.g. `app.example.wallet` (EIP-6963 info.rdns). */
  rdns: string
  /** Hex chain id the provider starts on, e.g. `0x1`. */
  initialChainIdHex: string
  /**
   * Also expose the provider as `window.ethereum` when nothing else claims
   * it. The widget discovers via EIP-6963 either way; this widens
   * compatibility with anything that still probes `window.ethereum`.
   */
  claimWindowEthereum?: boolean
}

export const buildInjectedProvider = ({
  name,
  icon,
  rdns,
  initialChainIdHex,
  claimWindowEthereum = true,
}: InjectedProviderOptions): string => `
(function () {
  'use strict';
  if (window.__lifiRnBridgeInstalled) { return; }
  window.__lifiRnBridgeInstalled = true;

  var BRIDGE_SOURCE = 'lifi-rn-wallet-bridge';

  var nextId = 1;
  var pending = Object.create(null); // id -> { resolve, reject }
  var listeners = Object.create(null); // event -> [fn]
  var chainId = ${JSON.stringify(initialChainIdHex)};
  var accounts = [];

  function emit(event, payload) {
    var fns = listeners[event] || [];
    for (var i = 0; i < fns.length; i++) {
      try { fns[i](payload); } catch (e) { /* listener errors are theirs */ }
    }
  }

  function toProviderError(error) {
    // Preserve the EIP-1193 shape RN sent: { code, message, data? }.
    var err = new Error(error && error.message ? error.message : 'Internal error.');
    err.code = error && typeof error.code === 'number' ? error.code : -32603;
    if (error && error.data !== undefined) { err.data = error.data; }
    return err;
  }

  var provider = {
    isLiFiRnBridge: true,
    // Some libraries feature-detect MetaMask; do not pretend to be it.
    isMetaMask: false,

    request: function (args) {
      if (!args || typeof args.method !== 'string') {
        return Promise.reject(toProviderError({ code: -32600, message: 'Invalid request.' }));
      }
      // Answer trivial state locally to avoid a bridge round-trip storm
      // (wagmi polls eth_chainId/eth_accounts aggressively).
      if (args.method === 'eth_chainId') { return Promise.resolve(chainId); }
      if (args.method === 'eth_accounts') { return Promise.resolve(accounts.slice()); }

      var id = nextId++;
      var message = JSON.stringify({
        source: BRIDGE_SOURCE,
        kind: 'request',
        id: id,
        method: args.method,
        params: args.params || [],
      });
      return new Promise(function (resolve, reject) {
        pending[id] = { resolve: resolve, reject: reject, method: args.method };
        window.ReactNativeWebView.postMessage(message);
      });
    },

    on: function (event, fn) {
      (listeners[event] = listeners[event] || []).push(fn);
      return provider;
    },
    removeListener: function (event, fn) {
      var fns = listeners[event] || [];
      var index = fns.indexOf(fn);
      if (index >= 0) { fns.splice(index, 1); }
      return provider;
    },
    // Legacy aliases some tooling still calls.
    enable: function () { return provider.request({ method: 'eth_requestAccounts' }); },
  };

  function handleBridgeMessage(raw) {
    var message;
    try { message = JSON.parse(raw); } catch (e) { return; }
    if (!message || message.source !== BRIDGE_SOURCE) { return; }

    if (message.kind === 'response') {
      var entry = pending[message.id];
      if (!entry) { return; }
      delete pending[message.id];
      if (message.error) {
        entry.reject(toProviderError(message.error));
        return;
      }
      // Track state the local fast-paths serve.
      if (entry.method === 'eth_requestAccounts' && Array.isArray(message.result)) {
        var hadAccounts = accounts.length > 0;
        accounts = message.result.slice();
        if (!hadAccounts && accounts.length) {
          emit('connect', { chainId: chainId });
          emit('accountsChanged', accounts.slice());
        }
      }
      if (
        (entry.method === 'wallet_switchEthereumChain' ||
          entry.method === 'wallet_addEthereumChain') &&
        message.newChainId
      ) {
        // RN confirms the post-switch chain alongside the (null) result.
        chainId = message.newChainId;
      }
      entry.resolve(message.result);
      return;
    }

    if (message.kind === 'event') {
      if (message.event === 'chainChanged') {
        chainId = message.params;
      }
      if (message.event === 'accountsChanged' && Array.isArray(message.params)) {
        accounts = message.params.slice();
      }
      emit(message.event, message.params);
    }
  }

  function onMessage(event) {
    if (typeof event.data === 'string') { handleBridgeMessage(event.data); }
  }
  // iOS WKWebView delivers RN->page messages on window, Android on document.
  window.addEventListener('message', onMessage);
  document.addEventListener('message', onMessage);

  // --- EIP-6963 announcement -------------------------------------------
  var providerInfo = {
    uuid: (crypto.randomUUID && crypto.randomUUID()) ||
      'lifi-rn-' + Math.random().toString(36).slice(2),
    name: ${JSON.stringify(name)},
    icon: ${JSON.stringify(icon)},
    rdns: ${JSON.stringify(rdns)},
  };
  function announce() {
    try {
      window.dispatchEvent(new CustomEvent('eip6963:announceProvider', {
        detail: Object.freeze({ info: providerInfo, provider: provider }),
      }));
    } catch (e) { /* CustomEvent exists in every WebView we target */ }
  }
  window.addEventListener('eip6963:requestProvider', announce);
  announce();

  ${claimWindowEthereum ? `if (!window.ethereum) { window.ethereum = provider; }` : ''}
})();
true; // injectedJavaScriptBeforeContentLoaded must evaluate to a truthy string
`
