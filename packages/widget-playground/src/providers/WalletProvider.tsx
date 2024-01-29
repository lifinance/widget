import { type FC, type PropsWithChildren } from 'react';
import { EVMProvider } from './EVMProvider';
import { SVMProvider } from './SVMProvider';

export const WalletProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <EVMProvider>
      <SVMProvider>{children}</SVMProvider>
    </EVMProvider>
  );
};
