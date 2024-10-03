import { ChainType } from '@lifi/widget';
import { Button, Typography } from '@mui/material';
import type { FormValues } from '../store/types';
import { useWidgetConfigActions } from '../store/useWidgetConfigActions.ts';
import {
  FormControlsContainer,
  FormValueGroupContainer,
} from './FormControls.style.tsx';

interface FormValuesLookUp {
  [key: string]: FormValues;
}

const ChainsAndTokensLookUp: FormValuesLookUp = {
  'From: ETH-ETH | To: ARB-USDC': {
    fromChain: 1,
    fromToken: '0x0000000000000000000000000000000000000000',
    toChain: 42161,
    toToken: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
  },
  'From: ARB-USDC | To: OPT-USDT': {
    fromChain: 42161,
    fromToken: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
    toChain: 10,
    toToken: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
  },
  'From: OPT-USDT': {
    fromChain: 10,
    fromToken: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
  },
  'From: ARB-DAI': {
    fromChain: 42161,
    fromToken: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
  },
  'To: POL-WMATIC': {
    toChain: 137,
    toToken: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
  },
  'To: AVA-AVAX': {
    toChain: 43114,
    toToken: '0x0000000000000000000000000000000000000000',
  },
  'RESET From & To': {
    fromChain: undefined,
    fromToken: undefined,
    toChain: undefined,
    toToken: undefined,
  },
  'RESET From': {
    fromChain: undefined,
    fromToken: undefined,
  },
  'RESET To': {
    toChain: undefined,
    toToken: undefined,
  },
};

const AddressLookUp: FormValuesLookUp = {
  '0x29D...94eD7': {
    toAddress: {
      address: '0x29DaCdF7cCaDf4eE67c923b4C22255A4B2494eD7',
      chainType: ChainType.EVM,
    },
  },
  '0x457...22CE0': {
    toAddress: {
      address: '0x4577a46A3eCf44E0ed44410B7793977ffbe22CE0',
      chainType: ChainType.EVM,
    },
  },
  Lenny: {
    toAddress: {
      name: 'Lenny',
      address: '0x552008c0f6870c2f77e5cC1d2eb9bdff03e30Ea9',
      chainType: ChainType.EVM,
    },
  },
  RESET: {
    toAddress: undefined,
  },
};

const fromAmountLookUp: FormValuesLookUp = {
  '1': {
    fromAmount: '1',
  },
  '0.5': {
    fromAmount: 0.5,
  },
  RESET: {
    fromAmount: undefined,
  },
};

const forceConfigUpdate = (nextValue: FormValues): FormValues => ({
  ...nextValue,
  formUpdateKey: new Date().valueOf().toString(),
});

export function FormControls() {
  const { setFormValues } = useWidgetConfigActions();

  const handleChainAndTokenChange = (value: string) => {
    const chainsAndTokens = ChainsAndTokensLookUp[value];

    if (chainsAndTokens) {
      setFormValues(forceConfigUpdate(chainsAndTokens));
    }
  };

  const handleToAddressChange = (value: string) => {
    const addressValue = AddressLookUp[value];

    if (addressValue) {
      setFormValues(forceConfigUpdate(addressValue));
    }
  };

  const handleFromAmountChange = (value: string) => {
    const amountValue = fromAmountLookUp[value];

    if (amountValue) {
      setFormValues(forceConfigUpdate(amountValue));
    }
  };

  return (
    <FormControlsContainer>
      <FormValueGroupContainer>
        <Typography variant="h6">Chains & Tokens</Typography>
        {Object.keys(ChainsAndTokensLookUp).map((key) => (
          <Button
            key={key}
            variant="outlined"
            onClick={() => handleChainAndTokenChange(key)}
            fullWidth
          >
            {key}
          </Button>
        ))}
      </FormValueGroupContainer>
      <FormValueGroupContainer>
        <Typography variant="h6">To Address</Typography>
        {Object.keys(AddressLookUp).map((key) => (
          <Button
            key={key}
            variant="outlined"
            onClick={() => handleToAddressChange(key)}
            fullWidth
          >
            {key}
          </Button>
        ))}
      </FormValueGroupContainer>
      <FormValueGroupContainer>
        <Typography variant="h6">From Amount</Typography>
        {Object.keys(fromAmountLookUp).map((key) => (
          <Button
            key={key}
            variant="outlined"
            onClick={() => handleFromAmountChange(key)}
            fullWidth
          >
            {key}
          </Button>
        ))}
      </FormValueGroupContainer>
    </FormControlsContainer>
  );
}
