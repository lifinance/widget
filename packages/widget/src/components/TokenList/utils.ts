import { TokenAmount } from '@lifi/sdk';

export const tokenAmountMock: TokenAmount = {
  address: '-1x0',
  amount: '',
  chainId: -1,
  decimals: 0,
  name: '',
  symbol: '',
};

export const skeletonKey = 'skeleton';

export const createTokenAmountSkeletons = () =>
  Array.from({ length: 3 }).map((_, index) => ({
    ...tokenAmountMock,
    address: `${tokenAmountMock.address}-${index}`,
    name: `${skeletonKey}-${index}`,
  }));
