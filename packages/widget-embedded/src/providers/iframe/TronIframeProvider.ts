import { BaseIframeProvider } from './BaseIframeProvider.js'

/**
 * Guest-side (iframe) provider for Tron. Delegates transport to GuestBridge.
 *
 * Registers for TVM init state and events, forwards method calls via
 * bridge.sendRpcRequest('TVM', ...).
 */
export class TronIframeProvider extends BaseIframeProvider {
  constructor() {
    super('TVM')
  }

  request(method: string, params?: unknown): Promise<unknown> {
    return this.sendRequest(method, params)
  }
}
