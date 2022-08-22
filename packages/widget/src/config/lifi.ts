import type { ConfigUpdate } from '@lifi/sdk';
import LIFI from '@lifi/sdk';

export const LiFi = new LIFI({
  disableVersionCheck: true,
});

export const updateLiFiConfig = (configUpdate: ConfigUpdate) => {
  LiFi.setConfig(configUpdate);
};
