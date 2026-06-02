import { useWidgetEvents, type WidgetEvents } from '@lifi/widget'
import { useEffect, useMemo, useRef } from 'react'
import { allWidgetEventNames, type WidgetEventName } from '../utils/events.js'

export const useWidgetEventConsoleLogging = (
  monitoredEvents: Record<WidgetEventName, boolean>
): void => {
  const widgetEvents = useWidgetEvents()
  const monitoredEventsRef = useRef(monitoredEvents)
  monitoredEventsRef.current = monitoredEvents

  const stableListeners = useMemo(() => {
    const map: Record<string, (value: unknown) => void> = {}
    for (const eventName of allWidgetEventNames) {
      map[eventName] = (value: unknown): void => {
        if (monitoredEventsRef.current[eventName]) {
          // biome-ignore lint/suspicious/noConsole: allowed in dev controls
          console.info(eventName, value)
        }
      }
    }
    return map
  }, [])

  useEffect(() => {
    for (const eventName of allWidgetEventNames) {
      widgetEvents.on(
        eventName as keyof WidgetEvents,
        stableListeners[eventName]
      )
    }

    return () => {
      for (const eventName of allWidgetEventNames) {
        widgetEvents.off(
          eventName as keyof WidgetEvents,
          stableListeners[eventName]
        )
      }
    }
  }, [widgetEvents, stableListeners])
}
