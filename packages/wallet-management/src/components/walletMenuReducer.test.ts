import { describe, expect, it } from 'vitest'
import { walletMenuReducer, type WalletMenuState } from './walletMenuReducer.js'

const withError: WalletMenuState = {
  view: 'wallet-list',
  error: { walletName: 'Varial', message: 'm' },
}

describe('walletMenuReducer', () => {
  it('keeps the connecting view while a request is pending', () => {
    // viem keeps "already pending" in message only; shortMessage is generic.
    const pending = Object.assign(
      new Error("Request of type 'wallet_requestPermissions' already pending"),
      { shortMessage: 'Requested resource not available.' }
    )

    expect(
      walletMenuReducer(
        { view: 'connecting', selectedWalletId: 'metaMask' },
        {
          type: 'HANDLE_ERROR',
          id: 'metaMask',
          walletName: 'MetaMask',
          error: pending,
        }
      )
    ).toEqual({ view: 'connecting', selectedWalletId: 'metaMask' })
  })

  it('returns to the list with the error', () => {
    expect(
      walletMenuReducer(
        { view: 'connecting', selectedWalletId: 'varial' },
        {
          type: 'HANDLE_ERROR',
          id: 'varial',
          walletName: 'Varial',
          error: { code: -4, message: 'The user rejected this request.' },
        }
      )
    ).toEqual({
      view: 'wallet-list',
      selectedWalletId: 'varial',
      error: {
        walletName: 'Varial',
        message: 'The user rejected this request.',
      },
    })
  })

  it('stores no message when the error has none', () => {
    expect(
      walletMenuReducer(
        { view: 'connecting' },
        { type: 'HANDLE_ERROR', id: 'x', walletName: 'X', error: {} }
      ).error
    ).toEqual({ walletName: 'X', message: undefined })
  })

  it('clears the error on a new connect', () => {
    expect(
      walletMenuReducer(withError, { type: 'SHOW_CONNECTING', id: 'xbull' })
        .error
    ).toBeUndefined()
  })

  it('clears the error on the ecosystem view', () => {
    expect(
      walletMenuReducer(withError, {
        type: 'SHOW_MULTI_ECOSYSTEM',
        id: 'phantom',
      }).error
    ).toBeUndefined()
  })

  it('keeps the error when it only shows the list', () => {
    expect(
      walletMenuReducer(withError, { type: 'SHOW_WALLET_LIST' }).error
    ).toEqual({ walletName: 'Varial', message: 'm' })
  })
})
