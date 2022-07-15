import LIFI, { ConfigUpdate } from '@lifi/sdk';

const defaultConfig = {
  // apiUrl: env.LIFI_API_URL,
  // defaultRouteOptions: {
  //   integrator: 'li.fi',
  // },
};

export const LiFi = new LIFI(defaultConfig);

export const updateLiFiConfig = (configUpdate?: ConfigUpdate) => {
  LiFi.setConfig({ ...defaultConfig, ...configUpdate });
};
