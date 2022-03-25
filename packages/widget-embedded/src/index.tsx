import { LiFiWidget, WidgetConfig } from '@lifinance/widget';
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { reportWebVitals } from './reportWebVitals';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find the root element.');
}
const root = createRoot(rootElement);

const config: WidgetConfig = {
  enabledChains: process.env.LIFI_ENABLED_CHAINS_JSON!,
  fromChain: 'pol',
  // toChain: 'okt',
  useInternalWalletManagement: true,
};

root.render(
  <React.StrictMode>
    <LiFiWidget config={config} />
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
if (process.env.NODE_ENV === 'development') {
  reportWebVitals(console.log);
}
