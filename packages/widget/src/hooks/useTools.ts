/* eslint-disable no-underscore-dangle */
import type { Bridge, Exchange } from '@lifi/sdk';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useLiFi } from '../providers';
import { useSettingsStore } from '../stores';

type FormattedTool<T, K extends keyof T> = Record<string, Pick<T, K>>;

export const useTools = () => {
  const lifi = useLiFi();
  const initializeTools = useSettingsStore((state) => state.initializeTools);
  const { data } = useQuery(
    ['tools'],
    ({ signal }) => lifi.getTools(undefined, { signal }),
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

  const formattedTools = useMemo(
    () => ({
      bridges: data?.bridges.reduce((bridges, bridge) => {
        bridges[bridge.key] = bridge;
        return bridges;
      }, {} as FormattedTool<Bridge, 'key' | 'name' | 'logoURI'>),
      exchanges: data?.exchanges.reduce((exchanges, exchange) => {
        exchanges[exchange.key] = exchange;
        return exchanges;
      }, {} as FormattedTool<Exchange, 'key' | 'name' | 'logoURI'>),
    }),
    [data?.bridges, data?.exchanges],
  );

  return { tools: data, formattedTools };
};
