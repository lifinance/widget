import type { ToolsResponse } from '@lifi/sdk';
import { useQuery } from '@tanstack/react-query';
import { isItemAllowed, useLiFi, useWidgetConfig } from '../providers';
import { useSettingsStore } from '../stores';

export const useTools = () => {
  const lifi = useLiFi();
  const { bridges, exchanges } = useWidgetConfig();
  const { data } = useQuery(
    ['tools'],
    async (): Promise<ToolsResponse> => {
      const tools = await lifi.getTools();
      return {
        bridges: tools.bridges.filter((bridge) =>
          isItemAllowed(bridge.key, bridges),
        ),
        exchanges: tools.exchanges.filter((exchange) =>
          isItemAllowed(exchange.key, exchanges),
        ),
      };
    },
    {
      onSuccess(data) {
        const { initializeTools } = useSettingsStore.getState();
        initializeTools(
          'Bridges',
          data.bridges.map((bridge) => bridge.key),
        );
        initializeTools(
          'Exchanges',
          data.exchanges.map((exchange) => exchange.key),
        );
      },
      refetchInterval: 180000,
      staleTime: 180000,
    },
  );

  return { tools: data };
};
