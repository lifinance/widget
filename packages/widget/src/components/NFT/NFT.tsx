import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormKey } from '../../providers';
import { NFTBase } from './NFTBase';
import type { NFTProps } from './types';

export const NFT: React.FC<NFTProps> = ({
  imageUrl,
  isLoading,
  collectionName,
  assetName,
  owner,
  token,
  contract,
}) => {
  const { setValue } = useFormContext();
  useEffect(() => {
    if (token) {
      setValue(FormKey.ToChain, token.chainId, { shouldTouch: true });
      setValue(FormKey.ToToken, token.address, { shouldTouch: true });
      setValue(FormKey.ToAmount, token.amount, { shouldTouch: true });
    }
    if (contract) {
      setValue(FormKey.ToContractAddress, contract.address, {
        shouldTouch: true,
      });
      setValue(FormKey.ToContractCallData, contract.callData, {
        shouldTouch: true,
      });
      setValue(FormKey.ToContractGasLimit, contract.gasLimit, {
        shouldTouch: true,
      });
    }
  }, [contract, setValue, token]);
  return (
    <NFTBase
      isLoading={isLoading}
      imageUrl={imageUrl}
      collectionName={collectionName}
      assetName={assetName}
      owner={owner}
      token={token}
    />
  );
};
