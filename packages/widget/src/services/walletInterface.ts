import { Signer } from 'ethers';
import { useEffect, useState } from 'react';
import { useWidgetConfig } from '../providers/WidgetProvider';
import { Token } from '../types';
import { useLifiWalletManagement } from './LiFiWalletManagement/LiFiWalletManagement';
import {
  addChain as walletAddChain,
  switchChain as walletSwitchChain,
  switchChainAndAddToken,
} from './LiFiWalletManagement/browserWallets';
import { Wallet } from './LiFiWalletManagement/wallets';

export interface AccountInformation {
  account?: string;
  isActive?: boolean;
  signer?: Signer;
  chainId?: number;
}

export const useWalletInterface = () => {
  const config = useWidgetConfig();
  const LiFiWalletManagement = useLifiWalletManagement();
  const [accountInformation, setAccountInformation] =
    useState<AccountInformation>({});

  const connect = async (wallet?: Wallet) => {
    if (!config.useLiFiWalletManagement) {
      // TODO
      return;
    }

    await LiFiWalletManagement.connect(wallet);
  };

  const disconnect = async () => {
    if (!config.useLiFiWalletManagement) {
      setAccountInformation({});
    }
    await LiFiWalletManagement.disconnect();
  };

  // only for injected Wallets
  const switchChain = async (chainId: number) => {
    if (!config.useLiFiWalletManagement) {
      await walletSwitchChain(chainId);
    }
  };

  const addChain = async (chainId: number) => {
    if (!config.useLiFiWalletManagement) {
      await walletAddChain(chainId);
    }
  };

  const addToken = async (chainId: number, token: Token) => {
    if (!config.useLiFiWalletManagement) {
      await switchChainAndAddToken(chainId, token);
    }
  };
  // keep account Information up to date
  useEffect(() => {
    const updateAccountInfo = async () => {
      if (config.useLiFiWalletManagement) {
        const info = await extractAccountInformationFromSigner(
          LiFiWalletManagement.signer,
        );

        setAccountInformation(info);
      }
    };
    updateAccountInfo();
  }, [LiFiWalletManagement.signer, config.useLiFiWalletManagement]);
  return {
    connect,
    disconnect,
    switchChain,
    addChain,
    addToken,
    accountInformation,
  };
};

const extractAccountInformationFromSigner = async (signer?: Signer) => ({
  account: (await signer?.getAddress()) || undefined,
  isActive: (signer && !!(await signer.getAddress()) === null) || !!signer,
  signer,
  chainId: (await signer?.getChainId()) || undefined,
});
