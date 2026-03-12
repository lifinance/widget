import type { HostMessage } from '../shared/protocol.js'
import { WIDGET_LIGHT_SOURCE } from '../shared/protocol.js'
import type { WidgetLightEvents } from '../shared/widgetLightEvents.js'

type SendFn = (msg: HostMessage) => void
type Handler = (data: unknown) => void

const listeners = new Map<string, Set<Handler>>()
const refCounts = new Map<string, number>()
let _sendFn: SendFn | null = null

function sendSubscribe(event: string): void {
  _sendFn?.({
    source: WIDGET_LIGHT_SOURCE,
    type: 'WIDGET_EVENT_SUBSCRIBE',
    event,
  })
}

function sendUnsubscribe(event: string): void {
  _sendFn?.({
    source: WIDGET_LIGHT_SOURCE,
    type: 'WIDGET_EVENT_UNSUBSCRIBE',
    event,
  })
}

function _register(send: SendFn): void {
  _sendFn = send
  // Replay existing subscriptions to the newly registered iframe
  for (const [event, count] of refCounts) {
    if (count > 0) {
      send({
        source: WIDGET_LIGHT_SOURCE,
        type: 'WIDGET_EVENT_SUBSCRIBE',
        event,
      })
    }
  }
}

function _unregister(): void {
  _sendFn = null
}

function _receiveEvent(event: string, data: unknown): void {
  const handlers = listeners.get(event)
  if (!handlers) {
    return
  }
  for (const h of handlers) {
    h(data)
  }
}

function on<E extends keyof WidgetLightEvents>(
  event: E,
  handler: (data: WidgetLightEvents[E]) => void
): void {
  const key = event as string
  let set = listeners.get(key)
  if (!set) {
    set = new Set()
    listeners.set(key, set)
  }
  set.add(handler as Handler)

  const prev = refCounts.get(key) ?? 0
  refCounts.set(key, prev + 1)
  if (prev === 0) {
    sendSubscribe(key)
  }
}

function off<E extends keyof WidgetLightEvents>(
  event: E,
  handler: (data: WidgetLightEvents[E]) => void
): void {
  const key = event as string
  listeners.get(key)?.delete(handler as Handler)

  const prev = refCounts.get(key) ?? 0
  const next = Math.max(0, prev - 1)
  refCounts.set(key, next)
  if (prev > 0 && next === 0) {
    sendUnsubscribe(key)
  }
}

export const WidgetLightEventBus = {
  on,
  off,
  _register,
  _unregister,
  _receiveEvent,
}
