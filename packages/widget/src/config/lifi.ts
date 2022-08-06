import LIFI, { ConfigUpdate } from '@lifi/sdk';

export const LiFi = new LIFI();

export const updateLiFiConfig = (configUpdate: ConfigUpdate) => {
  LiFi.setConfig(configUpdate);
};
