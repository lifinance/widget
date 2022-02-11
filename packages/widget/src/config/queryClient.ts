import { QueryClient } from 'react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      enabled: true,
      staleTime: 3_600_000,
      cacheTime: Infinity,
      refetchInterval: false,
      refetchIntervalInBackground: false,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchOnMount: true,
      retryOnMount: true,
      onError: (error) => {
        //
      },
    },
    mutations: {
      onError: (error) => {
        //
      },
    },
  },
});
