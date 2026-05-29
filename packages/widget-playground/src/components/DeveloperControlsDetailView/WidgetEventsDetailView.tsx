import { Divider } from '@mui/material'
import type { JSX } from 'react'
import { useCallback } from 'react'
import { useEditToolsActions } from '../../store/editTools/useEditToolsActions.js'
import { useWidgetEventMonitorValues } from '../../store/editTools/useWidgetEventMonitorValues.js'
import { docsLinks } from '../../utils/docsLinks.js'
import type { WidgetEventName } from '../../utils/events.js'
import {
  areAllWidgetEventsOn,
  eventKeyByValue,
  initialiseMonitoredEvents,
  widgetEventDescriptions,
  widgetEventDisplayOrder,
} from '../../utils/events.js'
import { setQueryStringParam } from '../../utils/setQueryStringParam.js'
import {
  Content,
  Description,
  Title,
  TitleSection,
} from '../DetailView/DetailView.style.js'
import { DetailViewHeader } from '../DetailView/DetailViewHeader.js'
import { SlideViewPanel } from '../DetailView/SlideView.style.js'
import { DocsLink } from '../DocsLink/DocsLink.js'
import { ToggleSection } from './DeveloperControlsDetailView.style.js'
import { DeveloperToggleItem } from './DeveloperToggleItem.js'

interface WidgetEventsDetailViewProps {
  onBack: () => void
}

export const WidgetEventsDetailView = ({
  onBack,
}: WidgetEventsDetailViewProps): JSX.Element => {
  const { allWidgetEventsOn, monitoredEvents } = useWidgetEventMonitorValues()
  const { setWidgetEventMonitors } = useEditToolsActions()

  const setAllWidgetEventsOnForPageLoad = useCallback(
    (on: boolean): void => {
      setQueryStringParam('allWidgetEvents', on)
      setWidgetEventMonitors(on, initialiseMonitoredEvents(on))
    },
    [setWidgetEventMonitors]
  )

  const handleEventChange = (eventName: WidgetEventName): void => {
    const updatedEvents = {
      ...monitoredEvents,
      [eventName]: !monitoredEvents[eventName],
    }
    const allOn = areAllWidgetEventsOn(updatedEvents)
    setQueryStringParam('allWidgetEvents', allOn)
    setWidgetEventMonitors(allOn, updatedEvents)
  }

  return (
    <SlideViewPanel>
      <DetailViewHeader onBack={onBack} />
      <Content>
        <TitleSection>
          <Title>Widget events</Title>
          <Description>
            Turn on listeners to log selected widget events in your browser
            console. No visual changes are shown in the preview.
          </Description>
          <DocsLink href={docsLinks.events} />
        </TitleSection>
        <ToggleSection>
          <DeveloperToggleItem
            label="All events on page load"
            checked={allWidgetEventsOn}
            onChange={() => setAllWidgetEventsOnForPageLoad(!allWidgetEventsOn)}
            ariaLabel="Toggle all widget events on page load"
          />
          {widgetEventDisplayOrder.map((eventName) => (
            <DeveloperToggleItem
              key={eventName}
              label={eventKeyByValue[eventName]}
              description={widgetEventDescriptions[eventName]}
              checked={monitoredEvents[eventName]}
              onChange={() => handleEventChange(eventName)}
              ariaLabel={`Toggle listener for ${eventKeyByValue[eventName]}`}
            />
          ))}
          <Divider />
        </ToggleSection>
      </Content>
    </SlideViewPanel>
  )
}
