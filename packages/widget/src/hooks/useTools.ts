/* eslint-disable no-underscore-dangle */
import { useQuery } from 'react-query';
import { LiFi } from '../config/lifi';
import { useSettingsStore } from '../stores';

export const useTools = () => {
  const initializeTools = useSettingsStore((state) => state.initializeTools);
  const { data } = useQuery(
    ['tools'],
    ({ signal }) => LiFi.getTools(undefined, { signal }),
    {
      onSuccess(data) {
        initializeTools(
          'Bridges',
          data.bridges.map((bridge) => bridge.key),
        );
        initializeTools(
          'Exchanges',
          data.exchanges.map((exchange) => exchange.key),
        );
      },
    },
  );

  return data;
};
