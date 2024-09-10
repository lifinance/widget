import { type FC, type PropsWithChildren } from 'react';
import { EVMProvider } from './EVMProvider.js';
import { SDKProviders } from './SDKProviders.js';
import { SVMProvider } from './SVMProvider.js';

export const WalletProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <EVMProvider>
      <SVMProvider>
        <SDKProviders />
        {children}
      </SVMProvider>
    </EVMProvider>
  );
};
