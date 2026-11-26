import { VARIAL_ID } from '@creit.tech/stellar-wallets-kit/modules/varial'

interface AssertExpectedSignerParams {
  walletId: string | null | undefined
  expectedAddress: string
  signerAddress: string | undefined
}

// SWK pins @stellar/freighter-api 6.0.0, which drops the requested address, so Varial signs with its active account.
export function assertExpectedSigner({
  walletId,
  expectedAddress,
  signerAddress,
}: AssertExpectedSignerParams): void {
  if (walletId !== VARIAL_ID || !signerAddress) {
    return
  }
  if (signerAddress !== expectedAddress) {
    throw new Error(
      `The wallet signed with account ${signerAddress}, but the widget is connected to ${expectedAddress}. Switch to the connected account in your wallet and try again.`
    )
  }
}
