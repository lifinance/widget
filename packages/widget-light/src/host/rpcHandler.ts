import type { PublicClient, WalletClient } from 'viem'
import { fromHex, isHex, toHex } from 'viem'

export interface RpcHandlerContext {
  address: `0x${string}` | undefined
  chainId: number | undefined
  walletClient: WalletClient | null | undefined
  publicClient: PublicClient | undefined
  switchChain(chainId: number): Promise<void>
}

/**
 * Routes an EIP-1193 RPC request from the guest iframe to the appropriate
 * host-side action using viem's WalletClient / PublicClient.
 *
 * Method routing table
 * ──────────────────────────────────────────────────────────────────────────
 * Served from host state (no round-trip):
 *   eth_accounts, eth_requestAccounts, eth_chainId, net_version
 *
 * Wallet methods (require connected walletClient):
 *   eth_sendTransaction, personal_sign, eth_sign, eth_signTypedData_v4
 *   wallet_switchEthereumChain, wallet_addEthereumChain
 *
 * EIP-5792 batch call methods (proxied through walletClient.request):
 *   wallet_sendCalls, wallet_getCallsStatus, wallet_showCallsStatus
 *   wallet_getCapabilities
 *
 * Everything else:
 *   Forwarded to publicClient.request (read-only node RPC)
 * ──────────────────────────────────────────────────────────────────────────
 */
export async function handleRpcRequest(
  method: string,
  params: unknown[] | undefined,
  ctx: RpcHandlerContext
): Promise<unknown> {
  const { address, chainId, walletClient, publicClient, switchChain } = ctx

  switch (method) {
    // -----------------------------------------------------------------------
    // Account / chain reads — served from host state, no round-trip
    // -----------------------------------------------------------------------

    case 'eth_accounts':
      return address ? [address] : []

    case 'eth_requestAccounts':
      if (!address) {
        throw rpcError(
          4100,
          'No accounts available. Connect your wallet in the host application.'
        )
      }
      return [address]

    case 'eth_chainId':
      return chainId ? toHex(chainId) : '0x1'

    case 'net_version':
      return chainId?.toString() ?? '1'

    // -----------------------------------------------------------------------
    // Transaction signing — requires wallet
    // -----------------------------------------------------------------------

    case 'eth_sendTransaction': {
      const wc = requireWallet(walletClient, address)
      const [tx] = params as [SendTransactionParams]

      // viem discriminates between legacy (gasPrice) and EIP-1559
      // (maxFeePerGas / maxPriorityFeePerGas) transaction types — they cannot
      // coexist in the same call. Build the fee fields conditionally and cast
      // to avoid union exhaustion while keeping all real fields typed.
      const baseTx = {
        account: address!,
        chain: null,
        to: tx.to,
        value:
          tx.value != null ? fromHex(ensureHex(tx.value), 'bigint') : undefined,
        data: tx.data as `0x${string}` | undefined,
        gas: tx.gas != null ? fromHex(ensureHex(tx.gas), 'bigint') : undefined,
        nonce:
          tx.nonce != null ? fromHex(ensureHex(tx.nonce), 'number') : undefined,
      }

      const feeTx =
        tx.maxFeePerGas != null || tx.maxPriorityFeePerGas != null
          ? {
              ...baseTx,
              maxFeePerGas:
                tx.maxFeePerGas != null
                  ? fromHex(ensureHex(tx.maxFeePerGas), 'bigint')
                  : undefined,
              maxPriorityFeePerGas:
                tx.maxPriorityFeePerGas != null
                  ? fromHex(ensureHex(tx.maxPriorityFeePerGas), 'bigint')
                  : undefined,
            }
          : {
              ...baseTx,
              gasPrice:
                tx.gasPrice != null
                  ? fromHex(ensureHex(tx.gasPrice), 'bigint')
                  : undefined,
            }

      return wc.sendTransaction(
        feeTx as Parameters<typeof wc.sendTransaction>[0]
      )
    }

    // -----------------------------------------------------------------------
    // Message signing
    // -----------------------------------------------------------------------

    case 'personal_sign': {
      // personal_sign(message, address) — note: reversed from eth_sign
      const wc = requireWallet(walletClient, address)
      const [rawMessage] = params as [string, string]
      return wc.signMessage({
        account: address!,
        message: { raw: rawMessage as `0x${string}` },
      })
    }

    case 'eth_sign': {
      // eth_sign(address, data) — deprecated but still needed
      const wc = requireWallet(walletClient, address)
      const [, data] = params as [string, string]
      return wc.signMessage({
        account: address!,
        message: { raw: data as `0x${string}` },
      })
    }

    case 'eth_signTypedData_v4': {
      const wc = requireWallet(walletClient, address)
      const [, typedDataJson] = params as [string, string]
      const typedData = JSON.parse(typedDataJson)
      const { domain, types, message: value, primaryType } = typedData
      // EIP-712 domain type must be excluded from types for viem
      const { EIP712Domain: _domain, ...filteredTypes } = types ?? {}
      return wc.signTypedData({
        account: address!,
        domain,
        types: filteredTypes,
        primaryType,
        message: value,
      })
    }

    // -----------------------------------------------------------------------
    // Chain management
    // -----------------------------------------------------------------------

    case 'wallet_switchEthereumChain': {
      const [{ chainId: hexChainId }] = params as [{ chainId: string }]
      const targetChainId = fromHex(hexChainId as `0x${string}`, 'number')
      await switchChain(targetChainId)
      return null
    }

    case 'wallet_addEthereumChain': {
      const wc = requireWallet(walletClient, address)
      return wc.request({
        method: 'wallet_addEthereumChain',
        params: params as never,
      })
    }

    // -----------------------------------------------------------------------
    // EIP-5792 — Wallet Call API
    // Forwarded transparently to the walletClient. If the connected wallet
    // does not support these methods it will throw and the error is propagated
    // back to the guest as a standard RPC error.
    // -----------------------------------------------------------------------

    case 'wallet_sendCalls': {
      const wc = requireWallet(walletClient, address)
      // EIP-5792 — forwarded raw; wallet rejects if unsupported
      return wc.request({
        method: 'wallet_sendCalls',
        params: params as never,
      })
    }

    case 'wallet_getCallsStatus': {
      const wc = requireWallet(walletClient, address)
      return wc.request({
        method: 'wallet_getCallsStatus',
        params: params as never,
      })
    }

    case 'wallet_showCallsStatus': {
      const wc = requireWallet(walletClient, address)
      return wc.request({
        method: 'wallet_showCallsStatus',
        params: params as never,
      })
    }

    case 'wallet_getCapabilities': {
      // Optional — return empty capabilities if wallet doesn't support EIP-5792
      if (!walletClient) {
        return {}
      }
      try {
        return await walletClient.request({
          method: 'wallet_getCapabilities',
          params: params as never,
        })
      } catch {
        return {}
      }
    }

    // -----------------------------------------------------------------------
    // Everything else — forward to the public (read-only) client
    // -----------------------------------------------------------------------

    default: {
      if (!publicClient) {
        throw rpcError(-32603, 'Internal error: no public client available')
      }
      return publicClient.request({
        method: method as never,
        params: params as never,
      })
    }
  }
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

interface SendTransactionParams {
  to?: `0x${string}`
  value?: string
  data?: string
  gas?: string
  gasPrice?: string
  maxFeePerGas?: string
  maxPriorityFeePerGas?: string
  nonce?: string
}

function requireWallet(
  wc: WalletClient | null | undefined,
  address: `0x${string}` | undefined
): WalletClient {
  if (!wc || !address) {
    throw rpcError(
      4100,
      'Wallet not connected. Connect your wallet in the host application.'
    )
  }
  return wc
}

function ensureHex(value: string): `0x${string}` {
  return isHex(value) ? value : `0x${Number(value).toString(16)}`
}

function rpcError(code: number, message: string, data?: unknown): Error {
  const err = new Error(message) as Error & { code: number; data?: unknown }
  err.code = code
  err.data = data
  return err
}
