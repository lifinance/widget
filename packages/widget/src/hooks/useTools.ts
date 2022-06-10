import { useQuery } from 'react-query';
import { LiFi } from '../lifi';
import { useSettingsStore } from '../stores';

export const useTools = () => {
  const setTools = useSettingsStore((state) => state.setTools);
  const { data } = useQuery(
    ['tools'],
    ({ signal }) => LiFi.getTools(undefined, { signal }),
    {
      onSuccess(data) {
        const state = useSettingsStore.getState();
        if (!state.enabledBridges?.length) {
          setTools(
            'Bridges',
            data.bridges.map((bridge) => bridge.key),
            data.bridges,
          );
        }
        if (!state.enabledExchanges?.length) {
          setTools(
            'Exchanges',
            data.exchanges.map((exchange) => exchange.key),
            data.exchanges,
          );
        }
      },
    },
  );

  return data;
};
