/* eslint-disable radix */
import type { Token } from '@lifi/sdk';
import {
  getChainById,
  MetaMaskProviderErrorCode,
  prefixChainId,
} from '@lifi/sdk';

export const switchChain = async (chainId: number): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const { ethereum } = window as any;
    if (!ethereum) resolve(false);

    try {
      ethereum
        .request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: getChainById(chainId).metamask?.chainId }],
        })
        .catch((error: any) => {
          if (error.code !== MetaMaskProviderErrorCode.userRejectedRequest) {
            addChain(chainId).then((result) => resolve(result));
          } else {
            reject(error);
          }
        });
      ethereum.once('chainChanged', (id: string) => {
        if (parseInt(id) === chainId) {
          resolve(true);
        }
      });
    } catch (error: any) {
      // const ERROR_CODE_UNKNOWN_CHAIN = 4902
      if (error.code !== MetaMaskProviderErrorCode.userRejectedRequest) {
        addChain(chainId).then((result) => resolve(result));
      } else {
        resolve(false);
      }
    }
  });
};

export const addChain = async (chainId: number) => {
  const { ethereum } = window as any;
  if (typeof ethereum === 'undefined') return false;

  const params = getChainById(chainId).metamask;
  try {
    await ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [params],
    });
    return true;
  } catch (error: any) {
    console.error(`Error adding chain ${chainId}: ${error.message}`);
  }
  return false;
};

export const addToken = async (token: Token) => {
  try {
    // wasAdded is a boolean. Like any RPC method, an error may be thrown.
    const wasAdded = await (window as any).ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20', // Initially only supports ERC20, but eventually more!
        options: {
          address: token.address, // The address that the token is at.
          symbol: token.symbol, // A ticker symbol or shorthand, up to 5 chars.
          decimals: token.decimals, // The number of decimals in the token
          image: token.logoURI, // A string url of the token logo
        },
      },
    });
    return wasAdded;
  } catch (error) {
    console.error(error);
  }
  return false;
};

export const switchChainAndAddToken = async (chainId: number, token: Token) => {
  const { ethereum } = window as any;
  const chainIdPrefixed = prefixChainId(chainId);

  if (chainIdPrefixed !== ethereum.chainId) {
    await switchChain(chainId);
    ethereum.once('chainChanged', async (id: string) => {
      if (parseInt(id, 10) === chainId) {
        await addToken(token);
      }
    });
  } else {
    await addToken(token);
  }
};
