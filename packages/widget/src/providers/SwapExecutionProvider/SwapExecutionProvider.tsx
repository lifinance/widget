import { Route } from '@lifinance/sdk';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { useMutation } from 'react-query';
import { LiFi } from '../../lifi';
import { useWallet } from '../WalletProvider';
import type {
  SwapExecutionContextProps,
  SwapExecutionProviderProps,
} from './types';

const stub = (): never => {
  throw new Error(
    'You forgot to wrap your component in <SwapExecutionProvider>.',
  );
};

const SwapExecutionContext = createContext<SwapExecutionContextProps>({
  executeRoute: stub,
});

export const useSwapExecutionContext = (): SwapExecutionContextProps =>
  useContext(SwapExecutionContext);

export const SwapExecutionProvider: React.FC<
  React.PropsWithChildren<SwapExecutionProviderProps>
> = ({ children }) => {
  const [executionRoute, setExecutionRoute] = useState<Route>();
  const { account, switchChain } = useWallet();
  const { mutateAsync: executeRoute } = useMutation<Route, unknown, Route>(
    (route) => {
      if (!account.signer) {
        throw Error('Account signer was not found.');
      }
      return LiFi.executeRoute(account.signer!, route, {
        updateCallback,
        switchChainHook,
        infiniteApproval: false,
      });
    },
    {
      onMutate: (route) => {
        setExecutionRoute(JSON.parse(JSON.stringify(route)));
      },
      onError: (error, route, context) => {
        console.warn('Execution failed!', JSON.parse(JSON.stringify(route)));
        // setExecutionRoute(JSON.parse(JSON.stringify(route)));
        // Notification.showNotification(NotificationType.SwapExecution_ERROR);
      },
      onSuccess: (route, initialRoute, context) => {
        console.log(
          'Executed successfully!',
          JSON.parse(JSON.stringify(route)),
        );
        setExecutionRoute(JSON.parse(JSON.stringify(route)));
        // setFinalTokenAmount(await getFinalBalance(web3.account!, route));
        // setSwapDoneAt(Date.now());
        // Notification.showNotification(NotificationType.TRANSACTION_SUCCESSFULL);
      },
      onSettled: (route, error, initialRoute, context) => {
        //
      },
    },
  );

  const updateCallback = useCallback(async (updatedRoute: Route) => {
    console.log('updatedRoute', JSON.parse(JSON.stringify(updatedRoute)));
    setExecutionRoute(JSON.parse(JSON.stringify(updatedRoute)));
  }, []);

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

  const value = useMemo(
    () => ({
      executeRoute,
      route: executionRoute,
    }),
    [executeRoute, executionRoute],
  );

  return (
    <SwapExecutionContext.Provider value={value}>
      {children}
    </SwapExecutionContext.Provider>
  );
};
