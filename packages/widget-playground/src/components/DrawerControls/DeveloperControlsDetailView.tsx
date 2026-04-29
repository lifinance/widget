import { useWidgetEvents, WidgetEvent, type WidgetEvents } from '@lifi/widget'
import { Box, Divider } from '@mui/material'
import type { JSX } from 'react'
import { useEffect, useState } from 'react'
import { useDevView } from '../../hooks/useDevView.js'
import { useEditToolsActions } from '../../store/editTools/useEditToolsActions.js'
import { useSkeletonToolValues } from '../../store/editTools/useSkeletonToolValues.js'
import { setQueryStringParam } from '../../utils/setQueryStringParam.js'
import { Switch } from '../Switch.js'
import { FormValuesDevPanel } from './DesignControls/FormValuesControls.js'
import {
  clearPlaygroundBookmarkStores,
  readPlaygroundBookmarksSeeded,
  seedPlaygroundBookmarkStores,
} from './DesignControls/PlaygroundSettingsControl/BookmarkStoreControls.js'
import { DetailViewHeader } from './DetailViewHeader.js'
import {
  ConfigureLink,
  Content,
  SubtitleDescription,
  Title,
  ToggleDescription,
  ToggleItem,
  ToggleLabel,
  ToggleRow,
  ToggleSection,
} from './DeveloperControlsDetailView.style.js'

interface DeveloperControlsDetailViewProps {
  onBack: () => void
  onReset: () => void
}

type WidgetEventName = (typeof WidgetEvent)[keyof typeof WidgetEvent]
type DeveloperControlsSection = 'main' | 'widget-events'

const widgetEventDescriptions: Record<WidgetEventName, string> = {
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

const widgetEventDisplayOrder: WidgetEventName[] = [
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
  WidgetEvent.PageEntered,
  WidgetEvent.FormFieldChanged,
  WidgetEvent.SettingUpdated,
  WidgetEvent.TokenSearch,
  WidgetEvent.LowAddressActivityConfirmed,
  WidgetEvent.ChainPinned,
]

const eventKeyByValue = Object.fromEntries(
  Object.entries(WidgetEvent).map(([key, value]) => [value, key])
) as Record<WidgetEventName, string>

const initialiseMonitoredEvents = (
  allEventsOn: boolean
): Record<WidgetEventName, boolean> =>
  Object.values(WidgetEvent).reduce(
    (accumulator, eventName) => {
      accumulator[eventName] = allEventsOn
      return accumulator
    },
    {} as Record<WidgetEventName, boolean>
  )

const getAllWidgetEventsOnFromQueryString = (): boolean => {
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search)
    return !!urlParams.get('allWidgetEvents')
  }
  return false
}

export const DeveloperControlsDetailView = ({
  onBack,
  onReset,
}: DeveloperControlsDetailViewProps): JSX.Element => {
  const { isDevView, toggleDevView } = useDevView()
  const widgetEvents = useWidgetEvents()
  const { isSkeletonShown } = useSkeletonToolValues()
  const { setSkeletonShow } = useEditToolsActions()
  const [activeSection, setActiveSection] =
    useState<DeveloperControlsSection>('main')
  const [allWidgetEventsOn, setAllWidgetEventsOn] = useState(
    getAllWidgetEventsOnFromQueryString()
  )
  const [monitoredEvents, setMonitoredEvents] = useState<
    Record<WidgetEventName, boolean>
  >(initialiseMonitoredEvents(allWidgetEventsOn))

  useEffect(() => {
    const listeners: Partial<
      Record<WidgetEventName, (value: unknown) => void>
    > = {}

    ;(Object.values(WidgetEvent) as WidgetEventName[]).forEach((eventName) => {
      if (monitoredEvents[eventName]) {
        const logListener = (value: unknown): void => {
          // biome-ignore lint/suspicious/noConsole: allowed in dev controls
          console.info(eventName, value)
        }
        listeners[eventName] = logListener
        widgetEvents.on(eventName as keyof WidgetEvents, logListener)
      }
    })

    return () => {
      ;(Object.values(WidgetEvent) as WidgetEventName[]).forEach(
        (eventName) => {
          const listener = listeners[eventName]
          if (listener && monitoredEvents[eventName]) {
            widgetEvents.off(eventName as keyof WidgetEvents, listener)
          }
        }
      )
    }
  }, [widgetEvents, monitoredEvents])

  const setAllWidgetEventsOnForPageLoad = (on: boolean): void => {
    setQueryStringParam('allWidgetEvents', on)
    setAllWidgetEventsOn(on)
  }

  const handleAllEventsChange = (): void => {
    const nextAllEventsOn = !allWidgetEventsOn
    setAllWidgetEventsOnForPageLoad(nextAllEventsOn)
    setMonitoredEvents(initialiseMonitoredEvents(nextAllEventsOn))
  }

  const handleEventChange = (eventName: WidgetEventName): void => {
    const updatedEvents = {
      ...monitoredEvents,
      [eventName]: !monitoredEvents[eventName],
    }
    setMonitoredEvents(updatedEvents)
    const areAllEventsOn = (
      Object.values(WidgetEvent) as WidgetEventName[]
    ).every((eventValue) => updatedEvents[eventValue])
    setAllWidgetEventsOnForPageLoad(areAllEventsOn)
  }

  if (activeSection === 'widget-events') {
    return (
      <>
        <DetailViewHeader
          onBack={() => setActiveSection('main')}
          onReset={onReset}
        />
        <Content sx={{ gap: '32px' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Title sx={{ mb: 0 }}>Widget events</Title>
            <SubtitleDescription>
              Turn on listeners to log selected widget events in your browser
              console. No visual changes are shown in the preview.
            </SubtitleDescription>
          </Box>
          <ToggleSection>
            <Divider />
            <ToggleItem>
              <ToggleRow>
                <ToggleLabel>All events on page load</ToggleLabel>
                <Switch
                  checked={allWidgetEventsOn}
                  onChange={handleAllEventsChange}
                  aria-label="Toggle all widget events on page load"
                />
              </ToggleRow>
            </ToggleItem>
            {widgetEventDisplayOrder.map((eventName, index) => (
              <Box key={eventName}>
                <Divider />
                <ToggleItem>
                  <ToggleRow>
                    <ToggleLabel>{eventKeyByValue[eventName]}</ToggleLabel>
                    <Switch
                      checked={monitoredEvents[eventName]}
                      onChange={() => handleEventChange(eventName)}
                      aria-label={`Toggle listener for ${eventKeyByValue[eventName]}`}
                    />
                  </ToggleRow>
                  <ToggleDescription>
                    {widgetEventDescriptions[eventName]}
                  </ToggleDescription>
                </ToggleItem>
                {index === widgetEventDisplayOrder.length - 1 ? (
                  <Divider />
                ) : null}
              </Box>
            ))}
          </ToggleSection>
        </Content>
      </>
    )
  }

  return (
    <>
      <DetailViewHeader onBack={onBack} onReset={onReset} />
      <Content>
        <Title>Developer controls</Title>
        <ToggleSection>
          <ToggleItem>
            <ToggleRow>
              <ToggleLabel>Form values</ToggleLabel>
              <Switch
                checked={isDevView}
                onChange={toggleDevView}
                aria-label="Toggle form values"
              />
            </ToggleRow>
            <ToggleDescription>
              Used for testing prefilled routes and values. It will update the
              widget&apos;s form and URL.
            </ToggleDescription>
            {isDevView ? <FormValuesDevPanel /> : null}
          </ToggleItem>
          <Divider />
          <ToggleItem>
            <ToggleRow>
              <ToggleLabel>Bookmark stores</ToggleLabel>
              <Switch
                checked={readPlaygroundBookmarksSeeded()}
                onChange={(_, checked) => {
                  if (checked) {
                    seedPlaygroundBookmarkStores()
                  } else {
                    clearPlaygroundBookmarkStores()
                  }
                }}
                aria-label="Toggle bookmark stores seed data"
              />
            </ToggleRow>
            <ToggleDescription>
              Toggle to seed or clear dummy wallet addresses for testing the
              &quot;Bookmarked wallets&quot; screen.
            </ToggleDescription>
          </ToggleItem>
          <Divider />
          <ToggleItem>
            <ToggleRow>
              <ToggleLabel>Loading preview</ToggleLabel>
              <Switch
                checked={isSkeletonShown}
                onChange={() => setSkeletonShow(!isSkeletonShown)}
                aria-label="Toggle loading preview"
              />
            </ToggleRow>
            <ToggleDescription>
              Preview the skeleton loader to see how the widget will look while
              data is loading.
            </ToggleDescription>
          </ToggleItem>
          <Divider />
          <ToggleItem>
            <ToggleRow>
              <ToggleLabel>Widget events</ToggleLabel>
            </ToggleRow>
            <ToggleDescription>
              Widget event listeners to log activity in your browser console for
              debugging.
            </ToggleDescription>
            <ConfigureLink
              disableRipple
              type="button"
              onClick={() => setActiveSection('widget-events')}
            >
              Configure
            </ConfigureLink>
          </ToggleItem>
        </ToggleSection>
      </Content>
    </>
  )
}
