import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { WalletProvider } from './providers/WalletProvider';
import { reportWebVitals } from './reportWebVitals';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find the root element.');
}

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
      // suspense: true,
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

const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        <App />
      </WalletProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
if (import.meta.env.DEV) {
  reportWebVitals(console.log);
}
