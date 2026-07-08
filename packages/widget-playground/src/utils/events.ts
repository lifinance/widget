import { WidgetEvent } from '@lifi/widget'

export type WidgetEventName = (typeof WidgetEvent)[keyof typeof WidgetEvent]

export const allWidgetEventNames = Object.values(
  WidgetEvent
) as WidgetEventName[]

export const widgetEventDescriptions: Record<WidgetEventName, string> = {
  [WidgetEvent.AppearanceChanged]:
    'The event fires when the user changes the appearance (light/dark/system) via the widget settings.',
  [WidgetEvent.AvailableRoutes]:
    'The event fires when available routes are returned after the user has selected source and destination tokens, entered an amount, and requested the routes.',
  [WidgetEvent.ChainPinned]:
    'The event fires when the user pins or unpins a chain in the UI.',
  [WidgetEvent.ContactSupport]:
    'The event fires when the user clicks on the Contact support button on the Transaction Details page.',
  [WidgetEvent.DestinationChainTokenSelected]:
    'The event fires when the user selects the destination chain and token.',
  [WidgetEvent.FormFieldChanged]:
    'The event fires whenever a form value is changed in the widget.',
  [WidgetEvent.LowAddressActivityConfirmed]:
    'The event fires when the user confirms proceeding despite a low address activity warning for the specified address and chain.',
  [WidgetEvent.NavigationTabChanged]:
    'The event fires when the user switches between navigation tabs in the widget header.',
  [WidgetEvent.PageEntered]:
    'The event fires when the user navigates to a page in the widget.',
  [WidgetEvent.RouteExecutionCompleted]:
    'The event fires when the execution is completed successfully.',
  [WidgetEvent.RouteExecutionFailed]:
    'The event fires when the execution has failed.',
  [WidgetEvent.RouteExecutionStarted]:
    'The event fires when the user clicks on the Start swapping or Start bridging button.',
  [WidgetEvent.RouteExecutionUpdated]:
    'The event fires when there is an update to the Route object during execution.',
  [WidgetEvent.RouteHighValueLoss]:
    'The event fires when the High Value Loss bottom sheet appears on the screen.',
  [WidgetEvent.RouteSelected]:
    'The event fires when the user selects a specific route from the list of available routes.',
  [WidgetEvent.SendToWalletToggled]:
    'The event fires when the user clicks on the wallet icon next to the action button on the main page to show/hide the destination wallet selection UI.',
  [WidgetEvent.SettingUpdated]:
    'The event fires whenever a setting is updated in the widget.',
  [WidgetEvent.SourceChainTokenSelected]:
    'The event fires when the user selects the source chain and token.',
  [WidgetEvent.TokenSearch]:
    'The event fires when the user searches for a token (includes the query value and the matched token results).',
  [WidgetEvent.WidgetExpanded]:
    'The event fires when the side panel with routes is shown to the user. Only available in the wide widget variant.',
}

export const widgetEventDisplayOrder: WidgetEventName[] = [
  WidgetEvent.AvailableRoutes,
  WidgetEvent.RouteSelected,
  WidgetEvent.RouteExecutionStarted,
  WidgetEvent.RouteExecutionUpdated,
  WidgetEvent.RouteExecutionCompleted,
  WidgetEvent.RouteExecutionFailed,
  WidgetEvent.RouteHighValueLoss,
  WidgetEvent.ContactSupport,
  WidgetEvent.SourceChainTokenSelected,
  WidgetEvent.DestinationChainTokenSelected,
  WidgetEvent.SendToWalletToggled,
  WidgetEvent.WidgetExpanded,
  WidgetEvent.NavigationTabChanged,
  WidgetEvent.PageEntered,
  WidgetEvent.FormFieldChanged,
  WidgetEvent.SettingUpdated,
  WidgetEvent.AppearanceChanged,
  WidgetEvent.TokenSearch,
  WidgetEvent.LowAddressActivityConfirmed,
  WidgetEvent.ChainPinned,
]

export const eventKeyByValue = Object.fromEntries(
  Object.entries(WidgetEvent).map(([key, value]) => [value, key])
) as Record<WidgetEventName, string>

/** Builds a full event monitor map with every widget event on or off. */
export const initialiseMonitoredEvents = (
  allEventsOn: boolean
): Record<WidgetEventName, boolean> =>
  allWidgetEventNames.reduce(
    (accumulator, eventName) => {
      accumulator[eventName] = allEventsOn
      return accumulator
    },
    {} as Record<WidgetEventName, boolean>
  )

export const areAllWidgetEventsOn = (
  events: Record<WidgetEventName, boolean>
): boolean => allWidgetEventNames.every((name) => events[name])

/** Reads ?allWidgetEvents=true from the page URL. */
export const getAllWidgetEventsOnFromQueryString = (): boolean => {
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get('allWidgetEvents') === 'true'
  }
  return false
}
