import { CurrentAccountSigner, type DAppKit } from '@mysten/dapp-kit-react'

export class WalletSigner extends CurrentAccountSigner {
  #dAppKit: DAppKit

  constructor(dAppKit: DAppKit) {
    super(dAppKit)
    this.#dAppKit = dAppKit
  }

  override toSuiAddress(): string {
    const { account } = this.#dAppKit.stores.$connection.get()
    if (!account) {
      throw new Error('No account is connected.')
    }
    return account.address
  }
}
