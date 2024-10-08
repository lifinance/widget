import { useWidgetEvents, WidgetEvent } from '@lifi/widget';
import { useEffect, useState } from 'react';
import { useDevView } from '../../../hooks';
import { setQueryStringParam } from '../../../utils/setQueryStringParam';
import { CardRowContainer, ExpandableCard } from '../../Card';
import { Switch } from '../../Switch';
import {
  CapitalizeFirstLetter,
  ControlContainer,
  ControlRowContainer,
} from './DesignControls.style';

const initialiseStateFromWidgetEvents = (
  widgetEventsMap: Record<string, string>,
  allEventsOn: boolean = false,
) =>
  Object.values(widgetEventsMap).reduce((accum, eventName) => {
    return {
      ...accum,
      [eventName]: allEventsOn,
    };
  }, {});

export const WidgetEventControls = () => {
  const { isDevView } = useDevView();
  const widgetEvents = useWidgetEvents();

  const { allWidgetEventsOn, setAllWidgetEventsOnForPageLoad } =
    useWidgetEventsSearchParam();
  const [monitoredEvents, setMonitoredEvents] = useState<
    Record<string, boolean>
  >(initialiseStateFromWidgetEvents(WidgetEvent, allWidgetEventsOn));

  useEffect(() => {
    const logFunction = (eventName: string) => (value: any) =>
      // eslint-disable-next-line no-console
      console.info(eventName, value);

    const logFunctionLookUp: Record<string, (value: any) => void> = {};

    Object.keys(monitoredEvents).forEach((eventName) => {
      const eventListeningOn = monitoredEvents[eventName];
      if (eventListeningOn) {
        logFunctionLookUp[eventName] = logFunction(eventName);
        widgetEvents.on(eventName, logFunctionLookUp[eventName]);
      }
    });

    return () => {
      Object.keys(monitoredEvents).forEach((eventName) => {
        const eventListeningOn = monitoredEvents[eventName];
        if (eventListeningOn) {
          widgetEvents.off(eventName, logFunctionLookUp[eventName]);
          delete logFunctionLookUp[eventName];
        }
      });
    };
  }, [widgetEvents, monitoredEvents]);

  const handleAllEventsChange = () => {
    const areAllEventsOn = !allWidgetEventsOn;

    setAllWidgetEventsOnForPageLoad(areAllEventsOn);

    setMonitoredEvents(
      initialiseStateFromWidgetEvents(WidgetEvent, areAllEventsOn),
    );
  };

  const handleEventChange = (eventName: string) => {
    const newEventsMap = {
      ...monitoredEvents,
      [eventName]: !monitoredEvents[eventName],
    };

    setMonitoredEvents(newEventsMap);

    const areAllEventsOn = Object.values(newEventsMap).every(
      (eventOn) => eventOn,
    );
    setAllWidgetEventsOnForPageLoad(areAllEventsOn);
  };

  return isDevView ? (
    <ExpandableCard title={'Widget Events'} value={''}>
      <CardRowContainer
        sx={{ paddingBottom: 1, paddingLeft: 1, paddingTop: 0 }}
      >
        <CapitalizeFirstLetter variant="caption">
          Output for events can be viewed in the console when event listeners
          are turned on
        </CapitalizeFirstLetter>
      </CardRowContainer>
      <ControlContainer
        sx={{
          marginLeft: 1,
          marginRight: 1,
          paddingLeft: 1,
          paddingRight: 1,
          minHeight: 48,
        }}
      >
        <ControlRowContainer sx={{ padding: 0 }}>
          All events on page load
          <Switch
            checked={allWidgetEventsOn}
            onChange={handleAllEventsChange}
            aria-label="Toggle All Widget Events"
          />
        </ControlRowContainer>
      </ControlContainer>
      {Object.values(WidgetEvent).map((eventName, i, arr) => (
        <CardRowContainer
          sx={{ paddingBottom: i < arr.length - 1 ? 0 : 2 }}
          key={eventName}
        >
          {eventName}
          <Switch
            checked={monitoredEvents[eventName]}
            onChange={() => handleEventChange(eventName)}
            aria-label={`Enable logging of ${eventName}`}
          />
        </CardRowContainer>
      ))}
    </ExpandableCard>
  ) : null;
};

const getAllWidgetEventsOnFromQueryString = () => {
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    return !!urlParams.get('allWidgetEvents') || false;
  }
  return false;
};

const useWidgetEventsSearchParam = () => {
  const [allWidgetEventsOn, setAllWidgetEventsOn] = useState(
    getAllWidgetEventsOnFromQueryString(),
  );

  const setAllWidgetEventsOnForPageLoad = (on: boolean) => {
    setQueryStringParam('allWidgetEvents', on);

    setAllWidgetEventsOn(on);
  };

  return {
    allWidgetEventsOn,
    setAllWidgetEventsOnForPageLoad,
  };
};
