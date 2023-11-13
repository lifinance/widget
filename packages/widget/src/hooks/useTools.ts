import { getTools, type ToolsResponse } from '@lifi/sdk';
import { useQuery } from '@tanstack/react-query';
import { isItemAllowed, useWidgetConfig } from '../providers';
import { useSettingsStore } from '../stores';

export const useTools = () => {
  const { bridges, exchanges } = useWidgetConfig();
  const { data } = useQuery({
    queryKey: ['tools'],
    queryFn: async (): Promise<ToolsResponse> => {
      const tools = await getTools();
      const result = {
        bridges: tools.bridges.filter((bridge) =>
          isItemAllowed(bridge.key, bridges),
        ),
        exchanges: tools.exchanges.filter((exchange) =>
          isItemAllowed(exchange.key, exchanges),
        ),
      };
      const { initializeTools } = useSettingsStore.getState();
      initializeTools(
        'Bridges',
        result.bridges.map((bridge) => bridge.key),
      );
      initializeTools(
        'Exchanges',
        result.exchanges.map((exchange) => exchange.key),
      );
      return result;
    },
    refetchInterval: 180000,
    staleTime: 180000,
  });

  return { tools: data };
};
