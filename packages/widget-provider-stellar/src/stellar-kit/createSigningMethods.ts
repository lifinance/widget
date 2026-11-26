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
      const options = { address: walletAddress, networkPassphrase, ...opts }
      const result = await StellarWalletsKit.signTransaction(xdr, options)
      assertExpectedSigner({
        walletId,
        expectedAddress: options.address ?? walletAddress,
        signerAddress: result.signerAddress,
      })
      return result
    },
    async signAuthEntry(authEntry, opts) {
      const walletId = readSelectedModuleId()
      const options = { address: walletAddress, networkPassphrase, ...opts }
      const result = await StellarWalletsKit.signAuthEntry(authEntry, options)
      assertExpectedSigner({
        walletId,
        expectedAddress: options.address ?? walletAddress,
        signerAddress: result.signerAddress,
      })
      return result
    },
  }
}
