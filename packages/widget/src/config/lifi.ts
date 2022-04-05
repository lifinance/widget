import LiFi from '@lifinance/sdk';
import { env } from './env';
import { getRpcs } from './rpcs';

export const configureLiFi = () => {
  LiFi.setConfig({
    apiUrl: env.LIFI_API_URL,
    rpcs: getRpcs(),
    defaultRouteOptions: {
      integrator: 'li.finance',
    },
  });
};
