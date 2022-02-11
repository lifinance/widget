import Lifi from '@lifinance/sdk';
import { env } from './env';
import { getRpcs } from './rpcs';

Lifi.setConfig({
  apiUrl: env.LIFI_API_URL,
  rpcs: getRpcs(),
  defaultRouteOptions: {
    integrator: 'li.finance',
  },
});
