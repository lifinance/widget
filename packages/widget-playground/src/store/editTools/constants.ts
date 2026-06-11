import { initialiseMonitoredEvents } from '../../utils/events.js'
import type { EditToolsValues } from './types.js'

export const defaultDrawerWidth = 392

export const defaultEditToolsValues: EditToolsValues = {
  formValues: undefined,
  drawer: {
    open: true,
  },
  fontControl: {
    selectedFont: undefined,
  },
  playgroundSettings: {
    viewportColorLight: undefined,
    viewportColorDark: undefined,
  },
  skeletonControl: {
    show: false,
  },
  headerAndFooterControl: {
    showMockHeader: false,
    showMockFooter: false,
    isFooterFixed: false,
  },
  isDevView: false,
  widgetEventsControl: {
    allWidgetEventsOn: false,
    monitoredEvents: initialiseMonitoredEvents(false),
  },
}
