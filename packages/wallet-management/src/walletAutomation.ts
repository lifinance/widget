/* eslint-disable radix */
import { Web3Provider } from '@ethersproject/providers';
import type { StaticToken } from '@lifi/sdk';
import {
  MetaMaskProviderErrorCode,
  getChainById,
  prefixChainId,
} from '@lifi/sdk';

export const switchChain = async (
  provider: Web3Provider,
  chainId: number,
): Promise<boolean> => {
  try {
    await provider.send('wallet_switchEthereumChain', [
      { chainId: getChainById(chainId).metamask?.chainId },
    ]);
    return true;
  } catch (error: any) {
    // const ERROR_CODE_UNKNOWN_CHAIN = 4902
    if (error.code !== MetaMaskProviderErrorCode.userRejectedRequest) {
      // addChain(provider, chainId).then((result) => resolve(result));
    } else {
      console.error(error);
      return false;
    }
  }
  return false;
};

export const addChain = async (provider: Web3Provider, chainId: number) => {
  const params = getChainById(chainId).metamask;
  provider
    .send('wallet_switchEthereumChain', [params])
    .then(() => {
      console.log('in new');
      return true;
    })
    .catch((error: any) => {
      console.error(`Error adding chain ${chainId}: ${error.message}`);
    });
  return false;
};

export const addToken = async (provider: Web3Provider, token: StaticToken) => {
  try {
    // wasAdded is a boolean. Like any RPC method, an error may be thrown.
    const wasAdded = await provider.send('wallet_watchAsset', [
      {
        type: 'ERC20', // Initially only supports ERC20, but eventually more!
        options: {
          address: token.address, // The address that the token is at.
          symbol: token.symbol, // A ticker symbol or shorthand, up to 5 chars.
          decimals: token.decimals, // The number of decimals in the token
          image: token.logoURI, // A string url of the token logo
        },
      },
    ]);
    return wasAdded;
  } catch (error) {
    console.error(error);
  }
  return false;
};

export const switchChainAndAddToken = async (
  provider: Web3Provider,
  chainId: number,
  token: StaticToken,
) => {
  const chainIdPrefixed = prefixChainId(chainId);
  try {
    if (
      chainIdPrefixed !== prefixChainId((await provider.getNetwork()).chainId)
    ) {
      await switchChain(provider, chainId);
      provider.once('chainChanged', async (id: string) => {
        if (parseInt(id, 10) === chainId) {
          await addToken(provider, token);
        }
      });
    } else {
      await addToken(provider, token);
    }
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};
