import { type FC, type PropsWithChildren } from 'react';
import { EVMProvider } from './EVMProvider';
import { SDKProviders } from './SDKProviders';
import { SolanaProvider } from './SolanaProvider';

export const WalletProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <SolanaProvider>
      <EVMProvider>
        <SDKProviders />
        {children}
      </EVMProvider>
    </SolanaProvider>
  );
};
