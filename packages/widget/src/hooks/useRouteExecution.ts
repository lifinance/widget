import type { Route } from '@lifi/sdk';
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
    const clonedUpdatedRoute = deepClone(updatedRoute);
    console.log('Route updated.', clonedUpdatedRoute);
    updateRoute(clonedUpdatedRoute);
  };

  const switchChainHook = async (requiredChainId: number) => {
    if (!account.isActive || !account.signer) {
      return account.signer;
    }
    const currentChainId = await account.signer.getChainId();
    if (currentChainId !== requiredChainId) {
      const switched = await switchChain(requiredChainId);
      if (!switched) {
        throw new Error('Chain was not switched.');
      }
    }
    return account.signer;
  };

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

  // Resume route execution after page reload
  useEffect(() => {
    // Check if route is eligible for automatic resuming
    if (
      isActiveRoute(routeExecution?.route) &&
      account.isActive &&
      !resumedAfterMount.current
    ) {
      resumedAfterMount.current = true;
      resumeRoute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account.isActive]);

  useEffect(() => {
    return () => {
      const route = useRouteStore.getState().routes[routeId]?.route;
      if (!route || !isActiveRoute(route)) {
        return;
      }
      LiFi.moveExecutionToBackground(route);
      console.log('Move route execution to background.', routeId);
      resumedAfterMount.current = false;
    };
  }, [routeId]);

  return {
    executeRoute,
    restartRoute: restartRouteMutation,
    deleteRoute: deleteRouteMutation,
    route: routeExecution?.route,
    status: routeExecution?.status,
  };
};

const isActiveRoute = (route?: Route) => {
  if (!route) {
    return false;
  }
  const allDone = route.steps.every(
    (step) => step.execution?.status === 'DONE',
  );
  const isFailed = route.steps.some(
    (step) => step.execution?.status === 'FAILED',
  );
  const alreadyStarted = route.steps.some((step) => step.execution);
  return !allDone && !isFailed && alreadyStarted;
};
