import type { WidgetLightEvents } from '../shared/widgetLightEvents.js'
import { WidgetLightEventBus } from './WidgetLightEventBus.js'

export interface WidgetLightEventEmitter {
  on<E extends keyof WidgetLightEvents>(
    event: E,
    handler: (data: WidgetLightEvents[E]) => void
  ): void
  off<E extends keyof WidgetLightEvents>(
    event: E,
    handler: (data: WidgetLightEvents[E]) => void
  ): void
}

// Stable module-level reference — no useMemo needed since these are
// module-level functions, not closures over React state.
const emitter: WidgetLightEventEmitter = {
  on: WidgetLightEventBus.on,
  off: WidgetLightEventBus.off,
}

/**
 * React hook that returns a typed event emitter for widget events.
 *
 * Can be used in any component — does not need to be co-located with
 * `<WidgetLight>` or `useWidgetLightHost`.
 *
 * @example
 * function MyComponent() {
 *   const events = useWidgetLightEvents()
 *   useEffect(() => {
 *     const handler = (route) => console.log('Route completed', route)
 *     events.on('routeExecutionCompleted', handler)
 *     return () => events.off('routeExecutionCompleted', handler)
 *   }, [events])
 * }
 */
export function useWidgetLightEvents(): WidgetLightEventEmitter {
  return emitter
}
