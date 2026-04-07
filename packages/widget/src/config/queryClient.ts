import { QueryClient } from '@tanstack/react-query'

export const queryClient: QueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      enabled: true,
      refetchInterval: false,
      refetchIntervalInBackground: false,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchOnMount: true,
      retryOnMount: true,
      // suspense: true,
    },
    mutations: {
      onError: (_error) => {
        //
      },
    },
  },
})
