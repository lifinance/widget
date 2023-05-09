/* eslint-disable radix */
import type { StaticToken } from '@lifi/sdk';
import {
  MetaMaskProviderErrorCode,
  getChainById,
  prefixChainId,
} from '@lifi/sdk';

export const switchChain = async (
  provider: any,
  chainId: number,
): Promise<boolean> => {
  const params = { chainId: getChainById(chainId).metamask?.chainId };
  try {
    if (provider.send) {
      await provider.send('wallet_switchEthereumChain', [params]);
    } else {
      const chainSwitchPromise = new Promise<boolean>((resolve, reject) => {
        provider
          .request({
            method: 'wallet_switchEthereumChain',
            params: [params],
          })
          .catch((error: any) => {
            console.error(error);
            reject(error);
          });
        provider.once('chainChanged', (id: string) => {
          if (parseInt(id) === chainId) {
            resolve(true);
          } else {
            resolve(false);
          }
        });
      });
      const result = await chainSwitchPromise;
      return result;
    }

    return true;
  } catch (error: any) {
    // const ERROR_CODE_UNKNOWN_CHAIN = 4902
    if (error.code !== MetaMaskProviderErrorCode.userRejectedRequest) {
      await addChain(provider, chainId);
    } else {
      console.error(error);
      return false;
    }
  }
  return false;
};

export const addChain = async (provider: any, chainId: number) => {
  const params = getChainById(chainId).metamask;
  if (provider.send) {
    provider
      .send('wallet_addEthereumChain', [params])
      .then(() => {
        return true;
      })
      .catch((error: any) => {
        console.error(`Error adding chain ${chainId}: ${error.message}`);
      });
  } else {
    provider
      .request({ method: 'wallet_addEthereumChain', params: [params] })
      .then(() => {
        return true;
      })
      .catch((error: any) => {
        console.error(`Error adding chain ${chainId}: ${error.message}`);
      });
  }
  return false;
};

export const addToken = async (provider: any, token: StaticToken) => {
  const params = {
    type: 'ERC20', // Initially only supports ERC20, but eventually more!
    options: {
      address: token.address, // The address that the token is at.
      symbol: token.symbol, // A ticker symbol or shorthand, up to 5 chars.
      decimals: token.decimals, // The number of decimals in the token
      image: token.logoURI, // A string url of the token logo
    },
  };
  try {
    let wasAdded;
    // wasAdded is a boolean. Like any RPC method, an error may be thrown.
    if (provider.send) {
      wasAdded = await provider.send('wallet_watchAsset', [params]);
    } else {
      wasAdded = await provider.request({
        method: 'wallet_watchAsset',
        params: [params],
      });
    }

    return wasAdded;
  } catch (error) {
    console.error(error);
  }
  return false;
};

export const switchChainAndAddToken = async (
  provider: any,
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
