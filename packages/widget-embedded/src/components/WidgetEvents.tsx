import type { Route } from '@lifi/sdk';
import type { RouteExecutionUpdate } from '@lifi/widget';
import { useWidgetEvents, WidgetEvent } from '@lifi/widget';
import { useEffect } from 'react';

export const WidgetEvents = () => {
  // const location = useLocation();
  // const [urlSearchParams, setURLSearchParams] = useState<URLSearchParams>();
  const widgetEvents = useWidgetEvents();

  useEffect(() => {
    const onRouteExecutionStarted = (route: Route) => {
      // console.log('onRouteExecutionStarted fired.');
    };
    const onRouteExecutionUpdated = (update: RouteExecutionUpdate) => {
      // console.log('onRouteExecutionUpdated fired.');
    };
    const onRouteExecutionCompleted = (route: Route) => {
      // console.log('onRouteExecutionCompleted fired.');
    };
    const onRouteExecutionFailed = (update: RouteExecutionUpdate) => {
      // console.log('onRouteExecutionFailed fired.');
    };
    // const onInputValuesUpdated = (values: InputValuesUpdated) => {
    //   console.log('InputValuesUpdated', values);

    //   const urlSearchParams = new URLSearchParams();
    //   for (const key in values) {
    //     if (Object.prototype.hasOwnProperty.call(values, key)) {
    //       urlSearchParams.set(key, (values as any)[key] || '');
    //     }
    //   }
    //   setURLSearchParams(urlSearchParams);
    // };
    widgetEvents.on(WidgetEvent.RouteExecutionStarted, onRouteExecutionStarted);
    widgetEvents.on(WidgetEvent.RouteExecutionUpdated, onRouteExecutionUpdated);
    widgetEvents.on(
      WidgetEvent.RouteExecutionCompleted,
      onRouteExecutionCompleted,
    );
    widgetEvents.on(WidgetEvent.RouteExecutionFailed, onRouteExecutionFailed);
    // widgetEvents.on(WidgetEvent.InputValuesUpdated, onInputValuesUpdated);
    return () => widgetEvents.all.clear();
  }, [widgetEvents]);

  // useLayoutEffect(() => {
  //   const url = new URL(window.location as any);
  //   urlSearchParams?.forEach((value, key) => {
  //     if (value) {
  //       url.searchParams.set(key, value);
  //     } else {
  //       url.searchParams.delete(key);
  //     }
  //   });
  //   window.history.replaceState({}, '', url);
  // }, [urlSearchParams, location]);

  return null;
};
