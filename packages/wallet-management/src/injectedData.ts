import type { Wallet } from '.';
import { wallets } from './wallets';

export const getInjectedAddress = (wallet?: Wallet) => {
  switch (wallet?.name) {
    case wallets.metamask.name:
      return getMetamaskInjectedAddress();
    case wallets.tallyho.name:
      return getTallyInjectedAddress();
    default:
      return getMetamaskInjectedAddress() ?? getTallyInjectedAddress();
  }
};

const getMetamaskInjectedAddress = () => {
  return (window as any).ethereum?.selectedAddress;
};

const getTallyInjectedAddress = () => {
  return (window as any).ethereum?.selectedAddress;
};
