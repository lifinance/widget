/* eslint-disable no-underscore-dangle */
import { Bridge, Exchange } from '@lifi/sdk';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { LiFi } from '../config/lifi';
import { useSettingsStore } from '../stores';

type FormattedTool<T, K extends keyof T> = Record<string, Pick<T, K>>;
interface FormattedTools {
  bridges: FormattedTool<Bridge, 'key' | 'name' | 'logoURI'>;
  exchanges: FormattedTool<Exchange, 'key' | 'name' | 'logoURI'>;
}

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
