import { Route } from '@lifi/sdk';
import { useMutation } from '@tanstack/react-query';
import { useCallback, useEffect, useRef } from 'react';
import shallow from 'zustand/shallow';
import { LiFi } from '../config/lifi';
import { useWallet } from '../providers/WalletProvider';
import { useRouteStore } from '../stores';
import { deepClone } from '../utils';

export const useRouteExecution = (routeId: string) => {
  const { account, switchChain } = useWallet();
  const resumedAfterMount = useRef(false);
  const routeExecution = useRouteStore((state) => state.routes[routeId]);
  const [updateRoute, restartRoute, deleteRoute] = useRouteStore(
    (state) => [state.updateRoute, state.restartRoute, state.deleteRoute],
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
      if (!routeExecution?.route) {
        throw Error('Execution route not found.');
      }
      return LiFi.executeRoute(account.signer, routeExecution.route, {
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
      if (!routeExecution?.route) {
        throw Error('Execution route not found.');
      }
      return LiFi.resumeRoute(
        account.signer,
        resumedRoute ?? routeExecution.route,
        {
          updateCallback,
          switchChainHook,
          infiniteApproval: false,
        },
      );
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
    resumeRoute(routeExecution?.route);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeRoute, routeExecution?.route, routeId]);

  const deleteRouteMutation = useCallback(() => {
    deleteRoute(routeId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeId]);

  useEffect(() => {
    // check if route is eligible for automatic resuming
    const isDone = routeExecution?.route.steps.every(
      (step) => step.execution?.status === 'DONE',
    );
    const isFailed = routeExecution?.route.steps.some(
      (step) => step.execution?.status === 'FAILED',
    );
    const alreadyStarted = routeExecution?.route.steps.some(
      (step) => step.execution,
    );
    if (
      !isDone &&
      !isFailed &&
      alreadyStarted &&
      account.signer &&
      !resumedAfterMount.current
    ) {
      resumedAfterMount.current = true;
      resumeRoute();
    }
    return () => {
      if (routeExecution?.route) {
        LiFi.moveExecutionToBackground(routeExecution.route);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account.signer]);

  return {
    executeRoute,
    restartRoute: restartRouteMutation,
    deleteRoute: deleteRouteMutation,
    route: routeExecution?.route,
    status: routeExecution?.status,
  };
};
