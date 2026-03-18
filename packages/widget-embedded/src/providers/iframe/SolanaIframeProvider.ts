import { BaseIframeProvider } from './BaseIframeProvider.js'

/**
 * Guest-side (iframe) provider for Solana. Delegates transport to GuestBridge.
 *
 * Registers for SVM init state and events, forwards method calls via
 * bridge.sendRpcRequest('SVM', ...).
 */
export class SolanaIframeProvider extends BaseIframeProvider {
  constructor() {
    super('SVM')
  }

  request(method: string, params?: unknown): Promise<unknown> {
    return this.sendRequest(method, params)
  }
}
