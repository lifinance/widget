import { type FC, type PropsWithChildren } from 'react';
import { EVMProvider } from './EVMProvider.js';
import { SDKProviders } from './SDKProviders.js';
import { SVMProvider } from './SVMProvider.js';
import { UTXOProvider } from './UTXOProvider.js';

export const WalletProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <EVMProvider>
      <SVMProvider>
        <UTXOProvider>
          <SDKProviders />
          {children}
        </UTXOProvider>
      </SVMProvider>
    </EVMProvider>
  );
};
