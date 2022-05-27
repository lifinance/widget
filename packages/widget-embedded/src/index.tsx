import { LiFiWidget, WidgetConfig } from '@lifinance/widget';
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { reportWebVitals } from './reportWebVitals';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find the root element.');
}
const root = createRoot(rootElement);

const widgetConfig: WidgetConfig = {
  enabledChains: JSON.parse(process.env.LIFI_ENABLED_CHAINS_JSON!),
  fromChain: 'pol',
  toChain: 'bsc',
  // fromToken: '0x0000000000000000000000000000000000000000',
  // toToken: '0xcc42724c6683b7e57334c4e856f4c9965ed682bd',
  useInternalWalletManagement: true,
  containerStyle: {
    width: 480,
    height: 640,
    border: `1px solid ${
      window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'rgb(66, 66, 66)'
        : 'rgb(234, 234, 234)'
    }`,
    borderRadius: '16px',
    display: 'flex',
    maxWidth: '480px',
    flex: 1,
  },
  baselineStyle: {
    borderRadius: '16px',
  },
};

const App = () => {
  const [config, setConfig] = useState(widgetConfig);
  useEffect(() => {
    const eventHadler = (event: MediaQueryListEvent) => {
      setConfig((config) => ({
        ...config,
        containerStyle: {
          ...config.containerStyle,
          border: `1px solid ${
            event.matches ? 'rgb(66, 66, 66)' : 'rgb(234, 234, 234)'
          }`,
        },
      }));
    };
    const matchMedia = window.matchMedia('(prefers-color-scheme: dark)');
    matchMedia.addEventListener('change', eventHadler);
    return () => {
      matchMedia.removeEventListener('change', eventHadler);
    };
  }, [config]);
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <LiFiWidget config={config} />
    </div>
  );
};

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
if (process.env.NODE_ENV === 'development') {
  reportWebVitals(console.log);
}
