import { ChainType } from '@lifi/types';
import { Button } from '@mui/material';
import { useConfigActions } from '../../../store';
import type { FormValues } from '../../../store/widgetConfig/types';
import { CardRowContainer, ExpandableCard } from '../../Card';
import { CapitalizeFirstLetter } from './DesignControls.style';

interface FormValuesLookUp {
  [key: string]: FormValues;
}

const ChainsAndTokensLookUp: FormValuesLookUp = {
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

const AddressLookUp: FormValuesLookUp = {
  '0x29D...94eD7': {
    toAddress: {
      address: '0x29DaCdF7cCaDf4eE67c923b4C22255A4B2494eD7',
      chainType: ChainType.EVM,
    },
  },
  '0x457...2CE07': {
    toAddress: {
      address: '0x4577a46A3eCf44E0ed44410B7793977ffbe22CE0',
      chainType: ChainType.EVM,
    },
  },
};

const AmountLookUp: FormValuesLookUp = {
  '1': {
    fromAmount: '1',
  },
  '0.5': {
    fromAmount: '0.5',
  },
};

export const FormValuesControl = () => {
  const { setFormValues } = useConfigActions();

  const handleChainAndTokenChange = (value: string) => {
    const chainsAndTokens = ChainsAndTokensLookUp[value];

    if (chainsAndTokens) {
      setFormValues(chainsAndTokens);
    }
  };

  const handleToAddressChange = (value: string) => {
    const addressValue = AddressLookUp[value];

    if (addressValue) {
      setFormValues(addressValue);
    }
  };

  const handleFromAmountChange = (value: string) => {
    const amountValue = AmountLookUp[value];

    if (amountValue) {
      setFormValues(amountValue);
    }
  };

  return (
    <ExpandableCard title={'Form values'} value=" ">
      <CardRowContainer sx={{ paddingBottom: 1, paddingLeft: 1 }}>
        <CapitalizeFirstLetter variant="caption">
          This tool allows you to set the values in the config for fromChain,
          fromToken, toChain, toToken, toAddress and fromAmount. You should see
          the values update in the Widget and when the buildUrl property is not
          set as false in the query string
        </CapitalizeFirstLetter>
      </CardRowContainer>
      <CardRowContainer sx={{ paddingBottom: 1, paddingLeft: 1 }}>
        Chains And Tokens
      </CardRowContainer>
      {Object.keys(ChainsAndTokensLookUp).map((key) => (
        <Button
          key={key}
          variant="outlined"
          onClick={() => handleChainAndTokenChange(key)}
          sx={{ marginBottom: 1 }}
          fullWidth
        >
          {key}
        </Button>
      ))}
      <CardRowContainer sx={{ paddingBottom: 1, paddingLeft: 1 }}>
        Amount
      </CardRowContainer>
      {Object.keys(AmountLookUp).map((key) => (
        <Button
          key={key}
          variant="outlined"
          onClick={() => handleFromAmountChange(key)}
          sx={{ marginBottom: 1 }}
          fullWidth
        >
          {key}
        </Button>
      ))}

      <CardRowContainer sx={{ paddingBottom: 1, paddingLeft: 1 }}>
        To Address
      </CardRowContainer>
      {Object.keys(AddressLookUp).map((key) => (
        <Button
          key={key}
          variant="outlined"
          onClick={() => handleToAddressChange(key)}
          sx={{ marginBottom: 1 }}
          fullWidth
        >
          {key}
        </Button>
      ))}
    </ExpandableCard>
  );
};
