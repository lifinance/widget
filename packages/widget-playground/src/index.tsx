import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { App } from './App';
import { WalletProvider } from './providers/WalletProvider';
import { reportWebVitals } from './reportWebVitals';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find the root element.');
}

const root = createRoot(rootElement);

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      enabled: true,
      staleTime: 3_600_000,
      refetchInterval: false,
      refetchIntervalInBackground: false,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchOnMount: true,
      retryOnMount: true,
      // suspense: true,
    },
    mutations: {
      onError: (error) => {
        //
      },
    },
  },
});

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/*" element={<App />} />
          </Routes>
        </BrowserRouter>
      </WalletProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
if (import.meta.env.DEV) {
  // eslint-disable-next-line no-console
  reportWebVitals(console.log);
}
