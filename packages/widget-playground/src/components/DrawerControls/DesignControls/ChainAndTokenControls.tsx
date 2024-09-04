import type { SyntheticEvent } from 'react';
import { useState } from 'react';
import { useConfigActions } from '../../../store';
import type { ChainsAndTokens } from '../../../store/widgetConfig/types';
import { ExpandableCard } from '../../Card';
import { Tab, Tabs } from '../../Tabs';

interface ChainsAndTokensLookUpValues {
  [key: string]: ChainsAndTokens;
}

const ChainsAndTokensLookUp: ChainsAndTokensLookUpValues = {
  'ETH-ETH | ARB-USDC': {
    fromChain: 1,
    fromToken: '0x0000000000000000000000000000000000000000',
    toChain: 42161,
    toToken: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
  },
  'ARB-USDC | OPT-USDT': {
    fromChain: 42161,
    fromToken: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
    toChain: 10,
    toToken: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
  },
  'From: OPT-USDT': {
    fromChain: 10,
    fromToken: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
  },
  'From: Aurora-EMPTY': {
    fromChain: 1313161554,
    fromToken: '0x368EBb46ACa6b8D0787C96B2b20bD3CC3F2c45F7',
  },
  'To: POL-WMATIC': {
    toChain: 137,
    toToken: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
  },
  'To: AVA-AVAX': {
    toChain: 43114,
    toToken: '0x0000000000000000000000000000000000000000',
  },
};

export const ChainAndTokenControl = () => {
  const [selectedChainsAndTokens, setSelectedChainsAndTokens] = useState<
    string | undefined
  >();
  const { setChainsAndTokens, removeChainsAndTokens } = useConfigActions();

  const handleChange = (_: SyntheticEvent, value: string) => {
    setSelectedChainsAndTokens(value);
    const chainsAndTokens = ChainsAndTokensLookUp[value];

    if (chainsAndTokens) {
      setChainsAndTokens(ChainsAndTokensLookUp[value]);
    } else {
      removeChainsAndTokens();
    }
  };

  return (
    <ExpandableCard title={'Chains And Tokens'} value=" ">
      <Tabs
        value={selectedChainsAndTokens}
        aria-label="tabs"
        indicatorColor="primary"
        onChange={handleChange}
        sx={{ mt: 0.5 }}
        orientation="vertical"
      >
        {Object.keys(ChainsAndTokensLookUp).map((key) => (
          <Tab key={key} label={key} value={key} disableRipple />
        ))}
      </Tabs>
    </ExpandableCard>
  );
};
