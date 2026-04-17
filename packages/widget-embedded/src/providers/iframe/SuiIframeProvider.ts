import { BaseIframeProvider } from './BaseIframeProvider.js'

/**
 * Guest-side (iframe) provider for Sui. Delegates transport to GuestBridge.
 *
 * Registers for MVM init state and events, forwards method calls via
 * bridge.sendRpcRequest('MVM', ...).
 */
export class SuiIframeProvider extends BaseIframeProvider {
  constructor() {
    super('MVM')
  }

  request(method: string, params?: unknown): Promise<unknown> {
    return this.sendRequest(method, params)
  }
}
