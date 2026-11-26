import {
  type IOnChangeEvent,
  type ModuleInterface,
  ModuleType,
} from '@creit.tech/stellar-wallets-kit'
import {
  METAMASK_ID,
  MetaMaskModule,
} from '@creit.tech/stellar-wallets-kit/modules/metamask'

const METAMASK_ICON =
  'https://lifinance.github.io/types/src/assets/icons/wallets/metamask.svg'

// SWK races every module's availability probe against 1s.
const ANNOUNCE_TIMEOUT_MS = 1000

export type MetaMaskStellarSessionEndListener = () => void

// Uses MetaMask's EIP-6963 announcement only, so the probe opens no connection
// to the extension. Same match as MetaMask's own `isMetamaskInstalled`, which
// also covers Flask and the mobile in-app browser.
const isMetaMaskAnnounced = (): Promise<boolean> => {
  if (typeof window === 'undefined') {
    return Promise.resolve(false)
  }
  return new Promise((resolve) => {
    let timer: ReturnType<typeof setTimeout> | undefined
    const finish = (available: boolean) => {
      clearTimeout(timer)
      window.removeEventListener('eip6963:announceProvider', onAnnounce)
      resolve(available)
    }
    const onAnnounce = (event: Event) => {
      const rdns = (event as CustomEvent<{ info?: { rdns?: string } }>).detail
        ?.info?.rdns
      if (rdns?.startsWith('io.metamask')) {
        finish(true)
      }
    }
    window.addEventListener('eip6963:announceProvider', onAnnounce)
    timer = setTimeout(() => finish(false), ANNOUNCE_TIMEOUT_MS)
    window.dispatchEvent(new Event('eip6963:requestProvider'))
  })
}

/**
 * Wraps SWK's MetaMaskModule and creates it at the first wallet call. Its
 * constructor opens a transport to the extension and reads the session, which
 * every widget user would otherwise pay for at page load.
 *
 * MetaMask shares one session across ecosystems: a Stellar disconnect revokes
 * only `stellar:pubnet`, and once MetaMask has ended the session itself the
 * wrapper sends no revoke at all.
 */
export class MetaMaskStellarModule implements ModuleInterface {
  moduleType: ModuleType = ModuleType.HOT_WALLET
  productId: string = METAMASK_ID
  productName: string = 'MetaMask'
  productUrl: string = 'https://metamask.io'
  productIcon: string = METAMASK_ICON

  private real: MetaMaskModule | undefined
  private changeCallback: ((event: IOnChangeEvent) => void) | undefined
  private sessionEndListener: MetaMaskStellarSessionEndListener | undefined
  private disconnecting = false
  private sessionEnded = false

  start(): MetaMaskModule {
    if (!this.real) {
      const real = new MetaMaskModule()
      // The adapter emits `disconnect` for its own disconnect too, so only an
      // event the wrapper did not cause means MetaMask ended the session.
      real.adapter.on('disconnect', () => {
        if (this.disconnecting) {
          return
        }
        this.sessionEnded = true
        this.sessionEndListener?.()
      })
      real.adapter.on('connect', () => {
        this.sessionEnded = false
      })
      // MetaMaskModule.onChange adds an adapter listener on every call and
      // never removes one, so subscribe once and forward.
      real.onChange((event) => this.changeCallback?.(event))
      this.real = real
    }
    return this.real
  }

  isAvailable(): Promise<boolean> {
    return isMetaMaskAnnounced()
  }

  getAddress(
    ...args: Parameters<ModuleInterface['getAddress']>
  ): ReturnType<ModuleInterface['getAddress']> {
    return this.start().getAddress(...args)
  }

  signTransaction(
    ...args: Parameters<ModuleInterface['signTransaction']>
  ): ReturnType<ModuleInterface['signTransaction']> {
    return this.start().signTransaction(...args)
  }

  signAuthEntry(
    ...args: Parameters<ModuleInterface['signAuthEntry']>
  ): ReturnType<ModuleInterface['signAuthEntry']> {
    return this.start().signAuthEntry(...args)
  }

  signMessage(
    ...args: Parameters<ModuleInterface['signMessage']>
  ): ReturnType<ModuleInterface['signMessage']> {
    return this.start().signMessage(...args)
  }

  getNetwork(): ReturnType<ModuleInterface['getNetwork']> {
    return this.start().getNetwork()
  }

  onChange(callback: (event: IOnChangeEvent) => void): void {
    this.changeCallback = callback
  }

  onSessionEnd(listener: MetaMaskStellarSessionEndListener): void {
    this.sessionEndListener = listener
  }

  /**
   * True only when MetaMask answers that the origin has no Stellar scope. A
   * missing extension, a timeout or an error is not an answer, so a restored
   * session is kept.
   */
  async checkSessionEnded(): Promise<boolean> {
    try {
      if (!(await this.isAvailable())) {
        return false
      }
      const { isAllowed, error } = await this.start().adapter.isAllowed()
      if (isAllowed || error) {
        return false
      }
      this.sessionEnded = true
      return true
    } catch {
      return false
    }
  }

  // SWK calls this without awaiting it, so nothing may reject.
  async disconnect(): Promise<void> {
    const real = this.real
    if (!real) {
      return
    }
    this.disconnecting = true
    try {
      if (this.sessionEnded) {
        const { error } = await real.adapter.disconnect({
          revokeSession: false,
        })
        if (error) {
          console.warn('MetaMask Stellar disconnect failed:', error)
        }
      } else {
        await real.disconnect()
      }
    } catch (error) {
      console.warn('MetaMask Stellar disconnect failed:', error)
    } finally {
      this.disconnecting = false
    }
  }
}

export const metaMaskStellar: MetaMaskStellarModule =
  new MetaMaskStellarModule()
