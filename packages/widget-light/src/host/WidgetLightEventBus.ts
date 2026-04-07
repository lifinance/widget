import type { HostMessage } from '../shared/protocol.js'
import { WIDGET_LIGHT_SOURCE } from '../shared/protocol.js'
import type { WidgetLightEvents } from '../shared/widgetLightEvents.js'

type SendFn = (msg: HostMessage) => void
type Handler = (data: unknown) => void

/** Module-level singleton — only one `<WidgetLight>` per page is supported. */
const listeners = new Map<string, Set<Handler>>()
const refCounts = new Map<string, number>()
let _sendFn: SendFn | null = null

function sendEventControl(
  event: string,
  type: 'WIDGET_EVENT_SUBSCRIBE' | 'WIDGET_EVENT_UNSUBSCRIBE'
): void {
  _sendFn?.({ source: WIDGET_LIGHT_SOURCE, type, event })
}

function _register(send: SendFn): void {
  _sendFn = send
  for (const [event, count] of refCounts) {
    if (count > 0) {
      sendEventControl(event, 'WIDGET_EVENT_SUBSCRIBE')
    }
  }
}

function _unregister(): void {
  _sendFn = null
  // Clear handlers from the previous session. refCounts is preserved
  // so _register can replay subscriptions to the next iframe.
  listeners.clear()
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
    sendEventControl(key, 'WIDGET_EVENT_SUBSCRIBE')
  }
}

function off<E extends keyof WidgetLightEvents>(
  event: E,
  handler: (data: WidgetLightEvents[E]) => void
): void {
  const key = event as string
  const set = listeners.get(key)

  // Guard against late cleanup calls after _unregister() clears listeners.
  if (!set?.has(handler as Handler)) {
    return
  }
  set.delete(handler as Handler)

  const prev = refCounts.get(key) ?? 0
  const next = Math.max(0, prev - 1)
  refCounts.set(key, next)
  if (prev > 0 && next === 0) {
    sendEventControl(key, 'WIDGET_EVENT_UNSUBSCRIBE')
  }
}

export const WidgetLightEventBus: {
  on: typeof on
  off: typeof off
  _register: typeof _register
  _unregister: typeof _unregister
  _receiveEvent: typeof _receiveEvent
} = {
  on,
  off,
  _register,
  _unregister,
  _receiveEvent,
}
