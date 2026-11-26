import { StellarWalletsKit } from '@creit.tech/stellar-wallets-kit'
import type { StellarWallet } from '@lifi/sdk-provider-stellar'
import { assertExpectedSigner } from './assertExpectedSigner.js'

interface CreateSigningMethodsParams {
  walletAddress: string
  networkPassphrase: string
}

type SigningMethods = Required<
  Pick<StellarWallet, 'signTransaction' | 'signAuthEntry'>
>

const readSelectedModuleId = (): string | null => {
  try {
    return StellarWalletsKit.selectedModule.productId
  } catch {
    return null
  }
}

export function createSigningMethods({
  walletAddress,
  networkPassphrase,
}: CreateSigningMethodsParams): SigningMethods {
  return {
    async signTransaction(xdr, opts) {
      const walletId = readSelectedModuleId()
      const result = await StellarWalletsKit.signTransaction(xdr, {
        address: walletAddress,
        networkPassphrase,
        ...opts,
      })
      assertExpectedSigner({
        walletId,
        expectedAddress: walletAddress,
        signerAddress: result.signerAddress,
      })
      return result
    },
    async signAuthEntry(authEntry, opts) {
      const walletId = readSelectedModuleId()
      const result = await StellarWalletsKit.signAuthEntry(authEntry, {
        address: walletAddress,
        networkPassphrase,
        ...opts,
      })
      assertExpectedSigner({
        walletId,
        expectedAddress: walletAddress,
        signerAddress: result.signerAddress,
      })
      return result
    },
  }
}
