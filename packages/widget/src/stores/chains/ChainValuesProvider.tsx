import { createContext, PropsWithChildren, useContext, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import type { ExtendedChain } from '@lifi/sdk';
import { useChainOrderStore } from '../../stores';
import {
  FormKey,
  isItemAllowed,
  useLiFi,
  useWidgetConfig,
} from '../../providers';

interface ChainValuesContextAPI {
  chains: ExtendedChain[] | undefined;
  availableChains: ExtendedChain[] | undefined;
  isLoading: boolean;
}

const ChainValuesContextInitValues = {
  chains: undefined,
  availableChains: undefined,
  isLoading: false,
};
export const ChainValuesContext = createContext<ChainValuesContextAPI>(
  ChainValuesContextInitValues,
);

export const ChainValuesProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const { chains, keyPrefix } = useWidgetConfig();
  const lifi = useLiFi();
  const { getValues, setValue } = useFormContext();

  // the following couldn't be used in ChainOrderStoreProvider (results in an error) so have had to creat this Provider
  const initializeChains = useChainOrderStore(
    (state) => state.initializeChains,
  );

  const { data: availableChains, isLoading: isLoadingAvailableChains } =
    useQuery(['chains'], async () => lifi.getChains(), {
      refetchInterval: 300000,
      staleTime: 300000,
    });

  const { data: filteredChains, isLoading: isLoadingFilteredChains } = useQuery(
    ['filtered-chains', { keyPrefix, availableChains, chains }],
    async () => {
      if (!availableChains) {
        return;
      }
      const filteredChains = availableChains.filter((chain) =>
        isItemAllowed(chain.id, chains),
      );

      return filteredChains;
    },
    {
      enabled: Boolean(availableChains),
    },
  );

  useEffect(() => {
    if (filteredChains) {
      const chainOrder = initializeChains(
        filteredChains.map((chain) => chain.id),
      );
      const [fromChainValue, toChainValue] = getValues([
        FormKey.FromChain,
        FormKey.ToChain,
      ]);
      if (!fromChainValue) {
        setValue(FormKey.FromChain, chainOrder[0]);
      }
      if (!toChainValue) {
        setValue(FormKey.ToChain, chainOrder[0]);
      }
    }
  }, [filteredChains]);

  return (
    <ChainValuesContext.Provider
      value={{
        chains: filteredChains,
        availableChains,
        isLoading: isLoadingFilteredChains || isLoadingAvailableChains,
      }}
    >
      {children}
    </ChainValuesContext.Provider>
  );
};

export const useChainValues = () => useContext(ChainValuesContext);
