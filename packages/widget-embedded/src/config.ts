import type { WidgetConfig } from '@lifi/widget';
import './index.css';

export const widgetBaseConfig: WidgetConfig = {
  subvariant: 'nft',
  integrator: 'li.fi-playground',
  hiddenUI: ['history'],
  // buildUrl: true,
  sdkConfig: {
    apiUrl: 'https://staging.li.quest/v1',
    defaultRouteOptions: {
      // maxPriceImpact: 0.4,
    },
  },
};

export const widgetConfig: WidgetConfig = {
  ...widgetBaseConfig,
  containerStyle: {
    boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.08)',
    borderRadius: '16px',
  },
};
