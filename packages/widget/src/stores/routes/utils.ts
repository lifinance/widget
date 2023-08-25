import type { Process, Route } from '@lifi/sdk';
import microdiff from 'microdiff';

export const isRouteDone = (route: Route) => {
  return route.steps.every((step) => step.execution?.status === 'DONE');
};

export const isRoutePartiallyDone = (route: Route) => {
  return route.steps.some(
    (step) =>
      step.execution?.process.some(
        (process) => process.substatus === 'PARTIAL',
      ),
  );
};

export const isRouteRefunded = (route: Route) => {
  return route.steps.some(
    (step) =>
      step.execution?.process.some(
        (process) => process.substatus === 'REFUNDED',
      ),
  );
};

export const isRouteFailed = (route: Route) => {
  return route.steps.some((step) => step.execution?.status === 'FAILED');
};

export const isRouteActive = (route?: Route) => {
  if (!route) {
    return false;
  }
  const isDone = isRouteDone(route);
  const isFailed = isRouteFailed(route);
  const alreadyStarted = route.steps.some((step) => step.execution);
  return !isDone && !isFailed && alreadyStarted;
};

export const doesRouteHaveCustomTool = (route: Route) => {
  return route.steps.some(
    (step) => step.tool === 'custom' || step.toolDetails.key === 'custom',
  );
};

export const getUpdatedProcess = (
  currentRoute: Route,
  updatedRoute: Route,
): Process | undefined => {
  const processDiff = microdiff(currentRoute, updatedRoute).find((diff) =>
    diff.path.includes('process'),
  );
  if (!processDiff) {
    return undefined;
  }
  // e.g. ['steps', 0, 'execution', 'process', 0]
  const process = processDiff.path
    .slice(0, processDiff.path.findIndex((path) => path === 'process') + 2)
    .reduce((obj, path) => obj[path], updatedRoute as any) as Process;
  return process;
};
