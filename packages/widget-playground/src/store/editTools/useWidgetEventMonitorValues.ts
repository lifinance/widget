import type { WidgetEventName } from '../../utils/events.js'
import { useEditToolsStore } from './EditToolsProvider.js'

export const useWidgetEventMonitorValues = (): {
  allWidgetEventsOn: boolean
  monitoredEvents: Record<WidgetEventName, boolean>
} => {
  const { allWidgetEventsOn, monitoredEvents } = useEditToolsStore(
    (store) => store.widgetEventsControl
  )

  return {
    allWidgetEventsOn,
    monitoredEvents,
  }
}
