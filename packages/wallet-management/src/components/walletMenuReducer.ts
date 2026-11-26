import { getConnectErrorMessage } from '../utils/getConnectErrorMessage.js'

export interface WalletMenuError {
  walletName: string
  message?: string
}

export interface WalletMenuState {
  view: 'wallet-list' | 'multi-ecosystem' | 'connecting'
  selectedWalletId?: string
  error?: WalletMenuError
}

export type WalletMenuAction =
  | { type: 'SHOW_WALLET_LIST' }
  | { type: 'SHOW_MULTI_ECOSYSTEM'; id: string }
  | { type: 'SHOW_CONNECTING'; id: string }
  | { type: 'HANDLE_ERROR'; id: string; walletName: string; error: unknown }

// viem keeps "already pending" in `message`; its `shortMessage` is generic.
const isPendingRequest = (error: unknown): boolean => {
  const message = (error as { message?: unknown } | null | undefined)?.message
  return typeof message === 'string' && message.includes('pending')
}

export function walletMenuReducer(
  state: WalletMenuState,
  action: WalletMenuAction
): WalletMenuState {
  switch (action.type) {
    case 'SHOW_WALLET_LIST':
      return { ...state, view: 'wallet-list' }
    case 'SHOW_MULTI_ECOSYSTEM':
      return { view: 'multi-ecosystem', selectedWalletId: action.id }
    case 'SHOW_CONNECTING':
      return { view: 'connecting', selectedWalletId: action.id }
    case 'HANDLE_ERROR':
      // A wallet the user left can fail late; it must not replace another wallet's view.
      if (
        state.view === 'connecting' &&
        state.selectedWalletId !== undefined &&
        state.selectedWalletId !== action.id
      ) {
        return state
      }
      if (isPendingRequest(action.error)) {
        return { view: 'connecting', selectedWalletId: action.id }
      }
      return {
        view: 'wallet-list',
        selectedWalletId: action.id,
        error: {
          walletName: action.walletName,
          message: getConnectErrorMessage(action.error),
        },
      }
    default:
      return state
  }
}
