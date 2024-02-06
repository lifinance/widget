import { type FC, type PropsWithChildren } from 'react';
import { EVMProvider } from './EVMProvider';
import { SVMProvider } from './SVMProvider';

interface ExternalWalletProviderProps extends PropsWithChildren {
  isExternalProvider?: boolean;
}
export const ExternalWalletProvider: FC<ExternalWalletProviderProps> = ({
  children,
  isExternalProvider,
}) => {
  return isExternalProvider ? (
    <EVMProvider>
      <SVMProvider>{children}</SVMProvider>
    </EVMProvider>
  ) : (
    <>{children}</>
  );
};
