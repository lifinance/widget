import EventEmitter from 'eventemitter3'
import type { WalletManagementEvents } from '../types/events.js'

export type WalletManagementEventEmitter = EventEmitter<WalletManagementEvents>

export const walletManagementEvents: WalletManagementEventEmitter =
  new EventEmitter<WalletManagementEvents>()

export const useWalletManagementEvents = (): WalletManagementEventEmitter =>
  walletManagementEvents
