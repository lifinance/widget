import { defineChain } from 'viem';

export const bitcoin = /*#__PURE__*/ defineChain({
  id: 20000000000001,
  name: 'Bitcoin',
  nativeCurrency: { name: 'Bitcoin', symbol: 'BTC', decimals: 8 },
  rpcUrls: {
    default: {
      http: ['https://node-router.thorswap.net/bitcoin'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Blockchair',
      url: 'https://blockchair.com/bitcoin/',
    },
  },
});
