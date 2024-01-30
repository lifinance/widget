import type { Process, RouteExtended } from '@lifi/sdk';
import microdiff from 'microdiff';

export const isRouteDone = (route: RouteExtended) => {
  return route.steps.every((step) => step.execution?.status === 'DONE');
};

export const isRoutePartiallyDone = (route: RouteExtended) => {
  return route.steps.some((step) =>
    step.execution?.process.some((process) => process.substatus === 'PARTIAL'),
  );
};

export const isRouteRefunded = (route: RouteExtended) => {
  return route.steps.some((step) =>
    step.execution?.process.some((process) => process.substatus === 'REFUNDED'),
  );
};

export const isRouteFailed = (route: RouteExtended) => {
  return route.steps.some((step) => step.execution?.status === 'FAILED');
};

export const isRouteActive = (route?: RouteExtended) => {
  if (!route) {
    return false;
  }
  const isDone = isRouteDone(route);
  const isFailed = isRouteFailed(route);
  const alreadyStarted = route.steps.some((step) => step.execution);
  return !isDone && !isFailed && alreadyStarted;
};

export const getUpdatedProcess = (
  currentRoute: RouteExtended,
  updatedRoute: RouteExtended,
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

export const getSourceTxHash = (route?: RouteExtended) => {
  return route?.steps[0].execution?.process
    .filter((process) => process.type !== 'TOKEN_ALLOWANCE')
    .find((process) => process.txHash)?.txHash;
};
