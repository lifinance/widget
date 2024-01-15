import { type FC, type PropsWithChildren } from 'react';
import { EVMProvider } from './EVMProvider';
import { SDKProviders } from './SDKProviders';
import { SVMProvider } from './SVMProvider';

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
