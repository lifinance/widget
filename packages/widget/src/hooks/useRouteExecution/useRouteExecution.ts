import { Route } from '@lifinance/sdk';
import { useCallback, useEffect } from 'react';
import { useMutation } from 'react-query';
import shallow from 'zustand/shallow';
import { LiFi } from '../../lifi';
import { useWallet } from '../../providers/WalletProvider';
import { deepClone } from '../../utils/deepClone';
import { useRouteStore } from './useRouteStore';

export const useRouteExecution = (routeId: string) => {
  const { account, switchChain } = useWallet();
  const { route, status } = useRouteStore((state) => state.routes[routeId]);
  const [updateRoute, restartRoute, removeRoute] = useRouteStore(
    (state) => [state.updateRoute, state.restartRoute, state.removeRoute],
    shallow,
  );

  const updateCallback = (updatedRoute: Route) => {
    console.log('Route updated.', updatedRoute);
    updateRoute(deepClone(updatedRoute));
  };

  const switchChainHook = useCallback(
    async (requiredChainId: number) => {
      if (!account.isActive || !account.signer) {
        return account.signer;
      }
      if ((await account.signer.getChainId()) !== requiredChainId) {
        const switched = await switchChain(requiredChainId);
        if (!switched) {
          throw new Error('Chain was not switched.');
        }
      }
      return account.signer;
    },
    [account.isActive, account.signer, switchChain],
  );

  const executeRouteMutation = useMutation(
    () => {
      if (!account.signer) {
        throw Error('Account signer not found.');
      }
      if (!route) {
        throw Error('Execution route not found.');
      }
      return LiFi.executeRoute(account.signer, route, {
        updateCallback,
        switchChainHook,
        infiniteApproval: false,
      });
    },
    {
      onMutate: () => {
        console.log('Execution started.', routeId);
      },
      onError: () => {
        console.warn('Execution failed.', routeId);
      },
      onSuccess: (route: Route) => {
        console.log('Executed successfully.', routeId);
      },
    },
  );

  const resumeRouteMutation = useMutation(
    (resumedRoute?: Route) => {
      if (!account.signer) {
        throw Error('Account signer not found.');
      }
      if (!route) {
        throw Error('Execution route not found.');
      }
      return LiFi.resumeRoute(account.signer, resumedRoute ?? route, {
        updateCallback,
        switchChainHook,
        infiniteApproval: false,
      });
    },
    {
      onMutate: () => {
        console.log('Resumed to execution.', routeId);
      },
      onError: () => {
        console.warn('Resumed execution failed.', routeId);
      },
      onSuccess: (route: Route) => {
        console.log('Resumed execution successful.', route);
      },
    },
  );

  const executeRoute = useCallback(() => {
    executeRouteMutation.mutateAsync(undefined, {
      onError: () => {
        console.warn('Real execution failed!', routeId);
        // Notification.showNotification(NotificationType.SwapExecution_ERROR);
      },
      onSuccess: (route: Route) => {
        console.log('Real execution successfully!', route);
        // Notification.showNotification(NotificationType.TRANSACTION_SUCCESSFULL);
      },
    });
  }, [executeRouteMutation, routeId]);

  const resumeRoute = useCallback(
    (route?: Route) => {
      resumeRouteMutation.mutateAsync(route, {
        onError: () => {
          console.warn('Real resumed execution failed.', routeId);
        },
        onSuccess: (route: Route) => {
          console.log('Real resumed execution successful.', route);
        },
      });
    },
    [resumeRouteMutation, routeId],
  );

  const restartRouteMutation = useCallback(() => {
    restartRoute(routeId);
    resumeRoute(route);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeRoute, route, routeId]);

  const removeRouteMutation = useCallback(() => {
    removeRoute(routeId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeId]);

  useEffect(() => {
    // check if route is eligible for automatic resuming
    const isDone = route.steps.every(
      (step) => step.execution?.status === 'DONE',
    );
    const isFailed = route.steps.some(
      (step) => step.execution?.status === 'FAILED',
    );
    const alreadyStarted = route.steps.some((step) => step.execution);
    if (!isDone && !isFailed && alreadyStarted) {
      resumeRoute();
    }
    return () => LiFi.moveExecutionToBackground(route);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    executeRoute,
    restartRoute: restartRouteMutation,
    removeRoute: removeRouteMutation,
    route,
    status,
  };
};
