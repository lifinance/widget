/**
 * React Native side of the wallet bridge.
 *
 * Receives the widget page's EIP-1193 requests (forwarded by the injected
 * provider), serves them with viem, and pushes responses/events back into
 * the page. Signing keys never enter the WebView: the page only ever sees
 * request/response envelopes.
 *
 * The example keeps signing in-process (a viem local account) on purpose -
 * an external WalletConnect wallet works identically as another EIP-1193
 * source on the host, but app-switching suspends WKWebView JS timers on
 * iOS, which freezes the widget mid-route. Documented in the README.
 */
import {
  http,
  type Address,
  type Chain,
  createPublicClient,
  createWalletClient,
  numberToHex,
  type PublicClient,
} from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { arbitrum, base, mainnet, optimism, polygon } from 'viem/chains'
import {
  type BridgeRequest,
  type BridgeResponse,
  ProviderErrors,
} from './types'

export interface ApprovalRequest {
  method: string
  /** Human-readable summary rendered by the approval sheet. */
  summary: string
  params?: unknown[]
}

export interface WalletHostOptions {
  /**
   * Dev-only private key. The example generates an ephemeral one when
   * omitted; never ship a hardcoded key anywhere near production code.
   */
  privateKey: `0x${string}`
  initialChain?: Chain
  /**
   * Called for every state-changing request (connect, sign, send).
   * Resolve `true` to approve, `false` to reject with EIP-1193 code 4001 -
   * the widget's route execution recovers cleanly from exactly that shape.
   */
  requestApproval: (request: ApprovalRequest) => Promise<boolean>
  /** Sends a JSON string into the WebView (webViewRef.postMessage). */
  postToPage: (json: string) => void
}

const SUPPORTED_CHAINS: Chain[] = [mainnet, base, arbitrum, optimism, polygon]

export class WalletHost {
  private readonly account
  private chain: Chain
  private publicClients = new Map<number, PublicClient>()
  private connected = false

  constructor(private readonly options: WalletHostOptions) {
    this.account = privateKeyToAccount(options.privateKey)
    this.chain = options.initialChain ?? mainnet
  }

  get address(): Address {
    return this.account.address
  }

  get chainIdHex(): string {
    return numberToHex(this.chain.id)
  }

  /** Entry point: wire to WebView onMessage with the parsed request. */
  async handleRequest(request: BridgeRequest): Promise<void> {
    try {
      const result = await this.dispatch(request)
      this.respond({ id: request.id, ...result })
    } catch (error) {
      const { code, message, data } = normalizeError(error)
      this.respond({ id: request.id, error: { code, message, data } })
    }
  }

  private async dispatch(
    request: BridgeRequest
  ): Promise<{ result: unknown; newChainId?: string }> {
    const params = request.params ?? []
    switch (request.method) {
      case 'eth_requestAccounts': {
        if (!this.connected) {
          const approved = await this.options.requestApproval({
            method: request.method,
            summary: `Connect wallet ${shorten(this.account.address)} to the LI.FI widget?`,
          })
          if (!approved) {
            throw ProviderErrors.userRejected
          }
          this.connected = true
        }
        return { result: [this.account.address] }
      }

      case 'eth_accounts':
        return { result: this.connected ? [this.account.address] : [] }

      case 'eth_chainId':
        return { result: this.chainIdHex }

      case 'net_version':
        return { result: String(this.chain.id) }

      case 'wallet_switchEthereumChain': {
        const target = (params[0] as { chainId?: string })?.chainId
        const next = SUPPORTED_CHAINS.find(
          (chain) => numberToHex(chain.id) === target?.toLowerCase()
        )
        if (!next) {
          // 4902 tells the widget the chain needs adding - do NOT swallow
          // this into a generic error or chain switching UX breaks.
          throw ProviderErrors.chainNotAdded
        }
        this.chain = next
        const newChainId = this.chainIdHex
        // Event AND response-side confirmation: wagmi listens for the
        // event; the injected provider also updates its fast-path cache
        // from `newChainId` so eth_chainId never serves a stale value.
        this.emit('chainChanged', newChainId)
        return { result: null, newChainId }
      }

      case 'wallet_addEthereumChain': {
        // The example supports a fixed chain set; adding an already-known
        // chain behaves like a switch, anything else is 4902.
        return this.dispatch({
          ...request,
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: (params[0] as { chainId?: string })?.chainId }],
        })
      }

      case 'personal_sign': {
        // params: [hexMessage, address]
        const approved = await this.options.requestApproval({
          method: request.method,
          summary: 'Sign message from the LI.FI widget?',
          params,
        })
        if (!approved) {
          throw ProviderErrors.userRejected
        }
        const signature = await this.account.signMessage({
          message: { raw: params[0] as `0x${string}` },
        })
        return { result: signature }
      }

      case 'eth_signTypedData_v4': {
        // params: [address, typedDataJson]
        const approved = await this.options.requestApproval({
          method: request.method,
          summary: 'Sign typed data from the LI.FI widget?',
          params,
        })
        if (!approved) {
          throw ProviderErrors.userRejected
        }
        const typedData = JSON.parse(params[1] as string)
        const signature = await this.account.signTypedData(typedData)
        return { result: signature }
      }

      case 'eth_sendTransaction': {
        const tx = params[0] as {
          to?: `0x${string}`
          data?: `0x${string}`
          value?: `0x${string}`
          gas?: `0x${string}`
        }
        const approved = await this.options.requestApproval({
          method: request.method,
          summary: `Send transaction on ${this.chain.name} to ${shorten(tx.to ?? '0x')}?`,
          params,
        })
        if (!approved) {
          throw ProviderErrors.userRejected
        }
        const walletClient = createWalletClient({
          account: this.account,
          chain: this.chain,
          transport: http(),
        })
        const hash = await walletClient.sendTransaction({
          to: tx.to,
          data: tx.data,
          value: tx.value ? BigInt(tx.value) : undefined,
          gas: tx.gas ? BigInt(tx.gas) : undefined,
        })
        return { result: hash }
      }

      default: {
        // Read-path passthrough (eth_call, eth_estimateGas, eth_getBalance,
        // eth_blockNumber, receipts, logs, fee history...). This is what
        // lets wagmi inside the widget function fully against the bridge.
        const client = this.getPublicClient()
        const result = await client.request({
          method: request.method as never,
          params: params as never,
        })
        return { result }
      }
    }
  }

  private getPublicClient(): PublicClient {
    let client = this.publicClients.get(this.chain.id)
    if (!client) {
      client = createPublicClient({ chain: this.chain, transport: http() })
      this.publicClients.set(this.chain.id, client)
    }
    return client
  }

  private respond(response: Omit<BridgeResponse, 'source' | 'kind'>): void {
    this.options.postToPage(
      JSON.stringify({
        source: 'lifi-rn-wallet-bridge',
        kind: 'response',
        ...response,
      })
    )
  }

  private emit(event: 'chainChanged' | 'accountsChanged', params: unknown): void {
    this.options.postToPage(
      JSON.stringify({
        source: 'lifi-rn-wallet-bridge',
        kind: 'event',
        event,
        params,
      })
    )
  }
}

const shorten = (address: string): string =>
  address.length > 12 ? `${address.slice(0, 6)}…${address.slice(-4)}` : address

const normalizeError = (
  error: unknown
): { code: number; message: string; data?: unknown } => {
  const candidate = error as { code?: unknown; message?: unknown; data?: unknown }
  if (typeof candidate?.code === 'number' && typeof candidate?.message === 'string') {
    return {
      code: candidate.code,
      message: candidate.message,
      data: candidate.data,
    }
  }
  return {
    ...ProviderErrors.internal,
    data: candidate?.message ?? String(error),
  }
}
