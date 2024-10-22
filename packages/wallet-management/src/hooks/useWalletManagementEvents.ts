import _mitt, { type EventHandlerMap, type EventType, type Emitter } from 'mitt'
import type { WalletManagementEvents } from '../types/events.js'
// https://github.com/developit/mitt/issues/191
const mitt = _mitt as unknown as <Events extends Record<EventType, unknown>>(
  all?: EventHandlerMap<Events>
) => Emitter<Events>

export const widgetEvents = mitt<WalletManagementEvents>()

export const useWalletManagementEvents = () => {
  return widgetEvents
}
