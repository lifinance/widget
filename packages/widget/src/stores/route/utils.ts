import type { Route } from '@lifi/sdk';

export const isRouteCompleted = (route: Route) => {
  return route.steps.every((step) => step.execution?.status === 'DONE');
};

export const isRouteFailed = (route: Route) => {
  return route.steps.some((step) => step.execution?.status === 'FAILED');
};

export const isRouteActive = (route?: Route) => {
  if (!route) {
    return false;
  }
  const isDone = isRouteCompleted(route);
  const isFailed = isRouteFailed(route);
  const alreadyStarted = route.steps.some((step) => step.execution);
  return !isDone && !isFailed && alreadyStarted;
};
