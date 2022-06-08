import LIFI from '@lifinance/sdk';

export const LiFi = new LIFI({
  // apiUrl: env.LIFI_API_URL,
  defaultRouteOptions: {
    integrator: 'li.fi',
  },
});
