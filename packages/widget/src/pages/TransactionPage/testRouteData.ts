import { CoinKey, RoutesResponse } from '@lifinance/sdk';

export const testRoutes: RoutesResponse = {
  routes: [
    {
      id: '0x6ca88627d568df36d1d0d0e42964851e2fbc11e617a1db7651f5369d1dc7ff55',
      fromChainId: 250,
      fromAmountUSD: '1.08',
      fromAmount: '1000000000000000000',
      fromToken: {
        address: '0x0000000000000000000000000000000000000000',
        symbol: 'FTM',
        decimals: 18,
        chainId: 250,
        name: 'FTM',
        coinKey: CoinKey.FTM,
        priceUSD: '1.0829',
        logoURI:
          'https://static.debank.com/image/ftm_token/logo_url/ftm/33fdb9c5067e94f3a1b9e78f6fa86984.png',
      },
      fromAddress: '0x552008c0f6870c2f77e5cC1d2eb9bdff03e30Ea0',
      toChainId: 100,
      toAmountUSD: '1.03',
      toAmount: '1029578874934906550',
      toAmountMin: '1029578874934906550',
      toToken: {
        address: '0x0000000000000000000000000000000000000000',
        symbol: 'xDai',
        decimals: 18,
        chainId: 100,
        name: 'xDai',
        coinKey: CoinKey.DAI,
        priceUSD: '1',
        logoURI:
          'https://static.debank.com/image/xdai_token/logo_url/xdai/1207e67652b691ef3bfe04f89f4b5362.png',
      },
      gasCostUSD: '0.09',
      steps: [
        {
          id: '0x1fe63a154d1e1e8c23395d79485d3faa84e7f8697cb36fe06d3d376dab04bc97',
          type: 'lifi',
          tool: 'connext',
          action: {
            fromChainId: 250,
            fromAmount: '1000000000000000000',
            fromToken: {
              address: '0x0000000000000000000000000000000000000000',
              symbol: 'FTM',
              decimals: 18,
              chainId: 250,
              name: 'FTM',
              coinKey: CoinKey.FTM,
              priceUSD: '1.0829',
              logoURI:
                'https://static.debank.com/image/ftm_token/logo_url/ftm/33fdb9c5067e94f3a1b9e78f6fa86984.png',
            },
            fromAddress: '0x552008c0f6870c2f77e5cC1d2eb9bdff03e30Ea0',
            toChainId: 100,
            toToken: {
              address: '0x0000000000000000000000000000000000000000',
              symbol: 'xDai',
              decimals: 18,
              chainId: 100,
              name: 'xDai',
              coinKey: CoinKey.DAI,
              priceUSD: '1',
              logoURI:
                'https://static.debank.com/image/xdai_token/logo_url/xdai/1207e67652b691ef3bfe04f89f4b5362.png',
            },
            slippage: 0.03,
          },
          estimate: {
            fromAmount: '1000000000000000000',
            toAmount: '1029578874934906550',
            toAmountMin: '1029578874934906550',
            approvalAddress: '0x5A9Fd7c39a6C488E715437D7b1f3C823d5596eD1',
            gasCosts: [
              {
                type: 'SEND',
                price: '195.1924',
                estimate: '417000',
                limit: '521250',
                amount: '81395231',
                amountUSD: '0.09',
                token: {
                  address: '0x0000000000000000000000000000000000000000',
                  symbol: 'FTM',
                  decimals: 18,
                  chainId: 250,
                  name: 'FTM',
                  coinKey: CoinKey.FTM,
                  priceUSD: '1.0829',
                  logoURI:
                    'https://static.debank.com/image/ftm_token/logo_url/ftm/33fdb9c5067e94f3a1b9e78f6fa86984.png',
                },
              },
            ],
            executionDuration: 673.77246,
          },
          includedSteps: [
            {
              id: 'b3533c0a-c520-411c-996c-81e5979087e7',
              type: 'swap',
              tool: '0x',
              action: {
                fromChainId: 250,
                toChainId: 250,
                fromToken: {
                  address: '0x0000000000000000000000000000000000000000',
                  symbol: 'FTM',
                  decimals: 18,
                  chainId: 250,
                  name: 'FTM',
                  coinKey: CoinKey.FTM,
                  priceUSD: '1.0829',
                  logoURI:
                    'https://static.debank.com/image/ftm_token/logo_url/ftm/33fdb9c5067e94f3a1b9e78f6fa86984.png',
                },
                toToken: {
                  address: '0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e',
                  decimals: 18,
                  symbol: 'DAI',
                  chainId: 250,
                  coinKey: CoinKey.DAI,
                  name: 'DAI',
                  logoURI:
                    'https://static.debank.com/image/ftm_token/logo_url/0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e/549c4205dbb199f1b8b03af783f35e71.png',
                  priceUSD: '1',
                },
                fromAmount: '1000000000000000000',
                slippage: 0.03,
                fromAddress: '0x5A9Fd7c39a6C488E715437D7b1f3C823d5596eD1',
                toAddress: '0x5A9Fd7c39a6C488E715437D7b1f3C823d5596eD1',
              },
              estimate: {
                fromAmount: '1000000000000000000',
                toAmount: '1078489833234765941',
                toAmountMin: '1078489833234765941',
                approvalAddress: '0xdef189deaef76e379df891899eb5a00a94cbc250',
                executionDuration: 30,
                feeCosts: [],
                gasCosts: [
                  {
                    type: 'SEND',
                    price: '195.1924',
                    estimate: '277000',
                    limit: '346250',
                    amount: '54068295',
                    amountUSD: '0.06',
                    token: {
                      address: '0x0000000000000000000000000000000000000000',
                      symbol: 'FTM',
                      decimals: 18,
                      chainId: 250,
                      name: 'FTM',
                      coinKey: CoinKey.FTM,
                      priceUSD: '1.0829',
                      logoURI:
                        'https://static.debank.com/image/ftm_token/logo_url/ftm/33fdb9c5067e94f3a1b9e78f6fa86984.png',
                    },
                  },
                ],
                data: {
                  chainId: 250,
                  price: '1.078489833234765941',
                  guaranteedPrice: '1.067704934902418281',
                  estimatedPriceImpact: '0',
                  to: '0xdef189deaef76e379df891899eb5a00a94cbc250',
                  data: '0x415565b0000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee0000000000000000000000008d11ec38a3eb5e956b052f67da8bdc9bef8abf3e0000000000000000000000000000000000000000000000000de0b6b3a76400000000000000000000000000000000000000000000000000000ed13ffb39ca4b6900000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000460000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000040000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee0000000000000000000000000000000000000000000000000de0b6b3a76400000000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000021be370d5312f44cb42ce377bc9b8a0cef1a4c830000000000000000000000008d11ec38a3eb5e956b052f67da8bdc9bef8abf3e000000000000000000000000000000000000000000000000000000000000012000000000000000000000000000000000000000000000000000000000000002c000000000000000000000000000000000000000000000000000000000000002c000000000000000000000000000000000000000000000000000000000000002a00000000000000000000000000000000000000000000000000de0b6b3a76400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000253706f6f6b79537761700000000000000000000000000000000000000000000000000000000000000de0b6b3a76400000000000000000000000000000000000000000000000000000ed13ffb39ca4b69000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000f491e7b69e4244ad4002bc14e878a34207e38c290000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000200000000000000000000000021be370d5312f44cb42ce377bc9b8a0cef1a4c830000000000000000000000008d11ec38a3eb5e956b052f67da8bdc9bef8abf3e000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000000200000000000000000000000021be370d5312f44cb42ce377bc9b8a0cef1a4c83000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee0000000000000000000000000000000000000000000000000000000000000000869584cd0000000000000000000000001000000000000000000000000000000000000011000000000000000000000000000000000000000000000069c45436f16230ac5e',
                  value: '1000000000000000000',
                  gas: '277000',
                  estimatedGas: '277000',
                  from: '0x552008c0f6870c2f77e5cc1d2eb9bdff03e30ea0',
                  gasPrice: '196000000000',
                  protocolFee: '0',
                  minimumProtocolFee: '0',
                  buyTokenAddress: '0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e',
                  sellTokenAddress:
                    '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
                  buyAmount: '1078489833234765941',
                  sellAmount: '1000000000000000000',
                  sources: [
                    {
                      name: 'MultiHop',
                      proportion: '0',
                    },
                    {
                      name: 'Beethovenx',
                      proportion: '0',
                    },
                    {
                      name: 'Curve',
                      proportion: '0',
                    },
                    {
                      name: 'Curve_V2',
                      proportion: '0',
                    },
                    {
                      name: 'Geist',
                      proportion: '0',
                    },
                    {
                      name: 'JetSwap',
                      proportion: '0',
                    },
                    {
                      name: 'MorpheusSwap',
                      proportion: '0',
                    },
                    {
                      name: 'SpiritSwap',
                      proportion: '0',
                    },
                    {
                      name: 'SpookySwap',
                      proportion: '1',
                    },
                    {
                      name: 'SushiSwap',
                      proportion: '0',
                    },
                    {
                      name: 'Synapse',
                      proportion: '0',
                    },
                  ],
                  orders: [
                    {
                      makerToken: '0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e',
                      takerToken: '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83',
                      makerAmount: '1078489833234765941',
                      takerAmount: '1000000000000000000',
                      fillData: {
                        tokenAddressPath: [
                          '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83',
                          '0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e',
                        ],
                        router: '0xf491e7b69e4244ad4002bc14e878a34207e38c29',
                      },
                      source: 'SpookySwap',
                      sourcePathId:
                        '0xf253d45f0a4ce92e24547b1f08580fd905361dcf561bec1ab399ce466be98ebe',
                      type: 0,
                    },
                  ],
                  allowanceTarget: '0x0000000000000000000000000000000000000000',
                  sellTokenToEthRate: '1',
                  buyTokenToEthRate: '1.077193214043137423',
                },
              },
            },
            {
              id: '0x1fe63a154d1e1e8c23395d79485d3faa84e7f8697cb36fe06d3d376dab04bc97',
              type: 'cross',
              tool: 'connext',
              action: {
                fromChainId: 250,
                toChainId: 100,
                fromToken: {
                  address: '0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e',
                  decimals: 18,
                  symbol: 'DAI',
                  chainId: 250,
                  coinKey: CoinKey.DAI,
                  name: 'DAI',
                  logoURI:
                    'https://static.debank.com/image/ftm_token/logo_url/0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e/549c4205dbb199f1b8b03af783f35e71.png',
                  priceUSD: '1',
                },
                toToken: {
                  address: '0x0000000000000000000000000000000000000000',
                  symbol: 'xDai',
                  decimals: 18,
                  chainId: 100,
                  name: 'xDai',
                  coinKey: CoinKey.DAI,
                  priceUSD: '1',
                  logoURI:
                    'https://static.debank.com/image/xdai_token/logo_url/xdai/1207e67652b691ef3bfe04f89f4b5362.png',
                },
                fromAmount: '1078489833234765941',
                fromAddress: '0x5A9Fd7c39a6C488E715437D7b1f3C823d5596eD1',
                slippage: 0.03,
                toAddress: '0x5A9Fd7c39a6C488E715437D7b1f3C823d5596eD1',
              },
              estimate: {
                fromAmount: '1078489833234765941',
                toAmount: '1029578874934906550',
                toAmountMin: '1029578874934906550',
                approvalAddress: '0x0D29d9Fa94a23e0D2F06EfC79c25144A8F51Fc4b',
                executionDuration: 643.77246,
                feeCosts: [
                  {
                    name: 'Gas Fee',
                    description:
                      'Covers gas expense for sending funds to user on receiving chain.',
                    percentage: '0.04451659339198891462',
                    token: {
                      address: '0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e',
                      decimals: 18,
                      symbol: 'DAI',
                      chainId: 250,
                      coinKey: CoinKey.DAI,
                      name: 'DAI',
                      logoURI:
                        'https://static.debank.com/image/ftm_token/logo_url/0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e/549c4205dbb199f1b8b03af783f35e71.png',
                      priceUSD: '1',
                    },
                    amount: '48010693383506008',
                    amountUSD: '48010693383506008.00',
                  },
                  {
                    name: 'Relay Fee',
                    description:
                      'Covers gas expense for claiming user funds on receiving chain.',
                    percentage: '0.00033474585351739062',
                    token: {
                      address: '0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e',
                      decimals: 18,
                      symbol: 'DAI',
                      chainId: 250,
                      coinKey: CoinKey.DAI,
                      name: 'DAI',
                      logoURI:
                        'https://static.debank.com/image/ftm_token/logo_url/0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e/549c4205dbb199f1b8b03af783f35e71.png',
                      priceUSD: '1',
                    },
                    amount: '361019999736000',
                    amountUSD: '361019999736000.00',
                  },
                  {
                    name: 'Router Fee',
                    description: 'Router service fee.',
                    percentage: '0.00050000000000000003',
                    token: {
                      address: '0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e',
                      decimals: 18,
                      symbol: 'DAI',
                      chainId: 250,
                      coinKey: CoinKey.DAI,
                      name: 'DAI',
                      logoURI:
                        'https://static.debank.com/image/ftm_token/logo_url/0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e/549c4205dbb199f1b8b03af783f35e71.png',
                      priceUSD: '1',
                    },
                    amount: '539244916617383',
                    amountUSD: '539244916617383.00',
                  },
                ],
                gasCosts: [
                  {
                    type: 'SEND',
                    price: '195.1924',
                    estimate: '140000',
                    limit: '175000',
                    amount: '27326936',
                    amountUSD: '0.03',
                    token: {
                      address: '0x0000000000000000000000000000000000000000',
                      symbol: 'FTM',
                      decimals: 18,
                      chainId: 250,
                      name: 'FTM',
                      coinKey: CoinKey.FTM,
                      priceUSD: '1.0829',
                      logoURI:
                        'https://static.debank.com/image/ftm_token/logo_url/ftm/33fdb9c5067e94f3a1b9e78f6fa86984.png',
                    },
                  },
                ],
                data: {
                  bid: {
                    user: '0x552008c0f6870c2f77e5cC1d2eb9bdff03e30Ea0',
                    router: '0x826Ccd5eD8ca665555Fe45A4f045b61516b241C0',
                    initiator: '0x552008c0f6870c2f77e5cC1d2eb9bdff03e30Ea0',
                    sendingChainId: 250,
                    sendingAssetId:
                      '0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e',
                    amount: '1078489833234765941',
                    receivingChainId: 100,
                    receivingAssetId:
                      '0x0000000000000000000000000000000000000000',
                    amountReceived: '1029939894934642550',
                    receivingAddress:
                      '0x997f29174a766A1DA04cf77d135d59Dd12FB54d1',
                    transactionId:
                      '0x1fe63a154d1e1e8c23395d79485d3faa84e7f8697cb36fe06d3d376dab04bc97',
                    expiry: 1647616226,
                    callDataHash:
                      '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
                    callTo: '0x0000000000000000000000000000000000000000',
                    encryptedCallData: '0x',
                    sendingChainTxManagerAddress:
                      '0x0D29d9Fa94a23e0D2F06EfC79c25144A8F51Fc4b',
                    receivingChainTxManagerAddress:
                      '0x115909BDcbaB21954bEb4ab65FC2aBEE9866fa93',
                    bidExpiry: 1647357329,
                  },
                  bidSignature:
                    '0x877535545418be167ada99877ff6ef3bba0d4b28cbe6b05dddd6063744ef6f117edd31b28036a4ea69c810392a81b4d467f4f4f2e03388ea7df4329542d49ad91c',
                  gasFeeInReceivingToken: '48010693383506008',
                  totalFee: '48910958299859391',
                  metaTxRelayerFee: '361019999736000',
                  routerFee: '539244916617383',
                  serverSign: true,
                },
              },
            },
          ],
        },
      ],
    },
  ],
};
