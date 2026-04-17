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
 */
export async function handleRpcRequest(
  method: string,
  params: unknown[] | undefined,
  ctx: RpcHandlerContext
): Promise<unknown> {
  const { address, chainId, walletClient, publicClient, switchChain } = ctx

  switch (method) {
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

    case 'eth_sendTransaction': {
      const wc = requireWallet(walletClient, address)
      const [tx] = params as [SendTransactionParams]

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

    case 'personal_sign': {
      const wc = requireWallet(walletClient, address)
      const [rawMessage] = params as [string, string]
      return wc.signMessage({
        account: address!,
        message: { raw: rawMessage as `0x${string}` },
      })
    }

    case 'eth_sign': {
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
      const { EIP712Domain: _domain, ...filteredTypes } = types ?? {}
      return wc.signTypedData({
        account: address!,
        domain,
        types: filteredTypes,
        primaryType,
        message: value,
      })
    }

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

    case 'wallet_sendCalls': {
      const wc = requireWallet(walletClient, address)
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
