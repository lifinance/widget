import { useWidgetEvents, WidgetEvent, type WidgetEvents } from '@lifi/widget'
import { Box, Collapse, Divider } from '@mui/material'
import type { JSX } from 'react'
import { useCallback, useEffect, useState } from 'react'
import { useDevView } from '../../hooks/useDevView.js'
import { useEditToolsActions } from '../../store/editTools/useEditToolsActions.js'
import { useHeaderAndFooterToolValues } from '../../store/editTools/useHeaderAndFooterToolValues.js'
import { useLayoutValues } from '../../store/editTools/useLayoutValues.js'
import { useSkeletonToolValues } from '../../store/editTools/useSkeletonToolValues.js'
import { useConfig } from '../../store/widgetConfig/useConfig.js'
import { useConfigActions } from '../../store/widgetConfig/useConfigActions.js'
import { useConfigVariant } from '../../store/widgetConfig/useConfigValues.js'
import {
  clearPlaygroundBookmarkStores,
  readPlaygroundBookmarksSeeded,
  seedPlaygroundBookmarkStores,
} from '../../utils/bookmarkStores.js'
import { docsLinks } from '../../utils/docsLinks.js'
import { setQueryStringParam } from '../../utils/setQueryStringParam.js'
import { DetailViewHeader } from '../DetailView/DetailViewHeader.js'
import { DocsLink } from '../DocsLink/DocsLink.js'
import { Switch } from '../Switch.style.js'
import {
  ConfigureLink,
  Content,
  SubtitleDescription,
  SubViewPanel,
  SubViewTrack,
  Title,
  ToggleDescription,
  ToggleItem,
  ToggleLabel,
  ToggleRow,
  ToggleSection,
} from './DeveloperControlsDetailView.style.js'
import { FormValuesDevPanel } from './FormValuesControls.js'

interface DeveloperControlsDetailViewProps {
  onBack: () => void
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
}: DeveloperControlsDetailViewProps): JSX.Element => {
  const { isDevView, toggleDevView } = useDevView()
  const widgetEvents = useWidgetEvents()
  const { isSkeletonShown } = useSkeletonToolValues()
  const { showMockHeader, showMockFooter } = useHeaderAndFooterToolValues()
  const { selectedLayoutId } = useLayoutValues()
  const { variant } = useConfigVariant()
  const isDrawerVariant = variant === 'drawer'
  const isFullHeight = selectedLayoutId === 'full-height'
  const isSkeletonEnabled = !isDrawerVariant
  const { config } = useConfig()
  const { setHeader } = useConfigActions()
  const {
    setSkeletonShow,
    setIsDevView,
    setHeaderVisibility,
    setFooterVisibility,
  } = useEditToolsActions()

  const [activeSection, setActiveSection] =
    useState<DeveloperControlsSection>('main')
  const [allWidgetEventsOn, setAllWidgetEventsOn] = useState(
    getAllWidgetEventsOnFromQueryString()
  )
  const [monitoredEvents, setMonitoredEvents] = useState<
    Record<WidgetEventName, boolean>
  >(initialiseMonitoredEvents(allWidgetEventsOn))

  const setAllWidgetEventsOnForPageLoad = useCallback((on: boolean): void => {
    setQueryStringParam('allWidgetEvents', on)
    setAllWidgetEventsOn(on)
  }, [])

  const handleHeaderVisibilityChange = useCallback(
    (_: React.ChangeEvent<HTMLInputElement>, checked: boolean): void => {
      setHeaderVisibility(checked)
      if (config?.theme?.header?.position === 'fixed') {
        setHeader({ position: 'fixed', top: checked ? 48 : 0 })
      }
    },
    [setHeaderVisibility, setHeader, config?.theme?.header?.position]
  )

  const handleReset = useCallback((): void => {
    setIsDevView(false)
    setSkeletonShow(false)
    setHeaderVisibility(false)
    setFooterVisibility(false)
    if (config?.theme?.header?.position === 'fixed') {
      setHeader({ position: 'fixed', top: 0 })
    }
    setAllWidgetEventsOnForPageLoad(false)
    setMonitoredEvents(initialiseMonitoredEvents(false))
  }, [
    setIsDevView,
    setSkeletonShow,
    setHeaderVisibility,
    setFooterVisibility,
    setHeader,
    config?.theme?.header?.position,
    setAllWidgetEventsOnForPageLoad,
  ])

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

  return (
    <SubViewTrack showSubView={activeSection === 'widget-events'}>
      <SubViewPanel>
        <DetailViewHeader onBack={onBack} onReset={handleReset} />
        <Content>
          <Title>Developer controls</Title>
          <DocsLink href={docsLinks.configure} />
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
              <Collapse in={isDevView} unmountOnExit>
                <Box sx={{ paddingTop: '12px' }}>
                  <FormValuesDevPanel />
                </Box>
              </Collapse>
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
                &quot;Bookmarked wallets&quot; screen. The page will reload.
              </ToggleDescription>
            </ToggleItem>
            <Divider />
            <ToggleItem
              sx={{
                opacity: isSkeletonEnabled ? 1 : 0.5,
                pointerEvents: isSkeletonEnabled ? 'auto' : 'none',
              }}
            >
              <ToggleRow>
                <ToggleLabel>Loading preview</ToggleLabel>
                <Switch
                  checked={isSkeletonShown}
                  onChange={() => setSkeletonShow(!isSkeletonShown)}
                  aria-label="Toggle loading preview"
                />
              </ToggleRow>
              <ToggleDescription>
                Preview the skeleton loader to see how the widget will look
                while data is loading. Only available for compact and wide
                variants.
              </ToggleDescription>
            </ToggleItem>
            <Divider />
            <ToggleItem
              sx={{
                opacity: isFullHeight ? 1 : 0.5,
                pointerEvents: isFullHeight ? 'auto' : 'none',
              }}
            >
              <ToggleRow>
                <ToggleLabel>Mock header</ToggleLabel>
                <Switch
                  checked={showMockHeader}
                  onChange={handleHeaderVisibilityChange}
                  aria-label="Toggle mock header"
                />
              </ToggleRow>
              <ToggleDescription>
                Show a mock header element above the widget. Only available for
                compact variant in full-height layout.
              </ToggleDescription>
            </ToggleItem>
            <Divider />
            <ToggleItem
              sx={{
                opacity: isFullHeight ? 1 : 0.5,
                pointerEvents: isFullHeight ? 'auto' : 'none',
              }}
            >
              <ToggleRow>
                <ToggleLabel>Mock footer</ToggleLabel>
                <Switch
                  checked={showMockFooter}
                  onChange={(_, checked) => {
                    setFooterVisibility(checked)
                  }}
                  aria-label="Toggle mock footer"
                />
              </ToggleRow>
              <ToggleDescription>
                Show a mock footer element below the widget. Only available for
                compact variant in full-height layout.
              </ToggleDescription>
            </ToggleItem>
            <Divider />
            <ToggleItem>
              <ToggleRow>
                <ToggleLabel>Widget events</ToggleLabel>
              </ToggleRow>
              <ToggleDescription>
                Widget event listeners to log activity in your browser console
                for debugging.
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
      </SubViewPanel>
      <SubViewPanel>
        <DetailViewHeader
          onBack={() => setActiveSection('main')}
          onReset={handleReset}
        />
        <Content sx={{ gap: '32px' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Title sx={{ mb: 0 }}>Widget events</Title>
            <SubtitleDescription>
              Turn on listeners to log selected widget events in your browser
              console. No visual changes are shown in the preview.
            </SubtitleDescription>
            <DocsLink href={docsLinks.events} />
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
      </SubViewPanel>
    </SubViewTrack>
  )
}
