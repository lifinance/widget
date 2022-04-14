import LIFI from '@lifinance/sdk';
import { env } from './config/env';
import { getRpcs } from './config/rpcs';

export const LiFi = new LIFI({
  apiUrl: env.LIFI_API_URL,
  rpcs: getRpcs(),
  defaultRouteOptions: {
    integrator: 'li.fi',
  },
});
