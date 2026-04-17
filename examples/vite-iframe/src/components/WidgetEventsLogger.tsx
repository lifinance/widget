import {
  useWidgetLightEvents,
  WidgetLightEvent,
  type WidgetLightEvents,
} from '@lifi/widget-light'
import { useEffect } from 'react'

/**
 * Subscribes to all widget-light events and logs them to the console.
 * Demonstrates that `useWidgetLightEvents` can be used in any component,
 * independent of where `<LiFiWidgetLight>` is mounted.
 */
export function WidgetEventsLogger() {
  const events = useWidgetLightEvents()

  useEffect(() => {
    const eventNames = Object.values(WidgetLightEvent) as Array<
      keyof WidgetLightEvents
    >

    const handlers = eventNames.map((eventName) => {
      const handler = (data: WidgetLightEvents[typeof eventName]) => {
        console.log(`[WidgetLightEvent] ${eventName}`, data)
      }
      events.on(eventName, handler)
      return { eventName, handler }
    })

    return () => {
      for (const { eventName, handler } of handlers) {
        events.off(eventName, handler)
      }
    }
  }, [events])

  return null
}
