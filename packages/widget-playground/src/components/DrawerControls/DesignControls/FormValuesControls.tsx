import { ChainType } from '@lifi/sdk'
import { Button } from '@mui/material'
import { useState } from 'react'
import { useDevView } from '../../../hooks/useDevView'
import { useEditToolsActions } from '../../../store/editTools/useEditToolsActions'
import type { FormValues } from '../../../store/types'
import { useConfigActions } from '../../../store/widgetConfig/useConfigActions'
import { CardRowContainer } from '../../Card/Card.style'
import { ExpandableCard } from '../../Card/ExpandableCard'
import { Switch } from '../../Switch'
import {
  CapitalizeFirstLetter,
  ColorControlContainer,
} from './DesignControls.style'

interface FormValuesLookUp {
  [key: string]: FormValues
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
  RESET: {
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
}

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
}

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
}

const toAmountLookUp: FormValuesLookUp = {
  '1': {
    toAmount: '1',
  },
  '0.5': {
    toAmount: 0.5,
  },
  RESET: {
    toAmount: undefined,
  },
}

const forceConfigUpdate = (nextValue: FormValues): FormValues => ({
  ...nextValue,
  formUpdateKey: new Date().valueOf().toString(),
})

export const FormValuesControl = () => {
  const { setFormValues: setFormValuesViaConfig } = useConfigActions()
  const { setFormValues: setFormValuesViaFormApiRef } = useEditToolsActions()
  const { isDevView } = useDevView()
  const [formUpdateMethod, setFormUpdateMethod] = useState<
    'formApi' | 'config'
  >('config')

  const setFormValues =
    formUpdateMethod === 'formApi'
      ? setFormValuesViaFormApiRef
      : setFormValuesViaConfig

  const handleChainAndTokenChange = (value: string) => {
    const chainsAndTokens = ChainsAndTokensLookUp[value]

    if (chainsAndTokens) {
      setFormValues(forceConfigUpdate(chainsAndTokens))
    }
  }

  const handleToAddressChange = (value: string) => {
    const addressValue = AddressLookUp[value]

    if (addressValue) {
      setFormValues(forceConfigUpdate(addressValue))
    }
  }

  const handleFromAmountChange = (value: string) => {
    const amountValue = fromAmountLookUp[value]

    if (amountValue) {
      setFormValues(forceConfigUpdate(amountValue))
    }
  }

  const handleToAmountChange = (value: string) => {
    const amountValue = toAmountLookUp[value]

    if (amountValue) {
      setFormValues(forceConfigUpdate(amountValue))
    }
  }

  return isDevView ? (
    <ExpandableCard title={'Form values'} value=" ">
      <CardRowContainer sx={{ paddingBottom: 1, paddingLeft: 1 }}>
        <CapitalizeFirstLetter variant="caption">
          This tool allows you to set the values in the config for fromChain,
          fromToken, toChain, toToken, toAddress and fromAmount. You should see
          the values update in the Widget and when the buildUrl property is not
          set as false changes should be reflected in the query string
        </CapitalizeFirstLetter>
      </CardRowContainer>
      <ColorControlContainer sx={{ marginBottom: 1, paddingRight: 2 }}>
        Use config
        <Switch
          checked={formUpdateMethod === 'config'}
          onChange={() => setFormUpdateMethod('config')}
          aria-label="Set form values using reactive config"
        />
      </ColorControlContainer>
      <ColorControlContainer sx={{ marginBottom: 1, paddingRight: 2 }}>
        Use formRef
        <Switch
          checked={formUpdateMethod === 'formApi'}
          onChange={() => setFormUpdateMethod('formApi')}
          aria-label="Set form values using formRef"
        />
      </ColorControlContainer>
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
        From Amount
      </CardRowContainer>
      {Object.keys(fromAmountLookUp).map((key) => (
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
        To Amount
      </CardRowContainer>
      {Object.keys(toAmountLookUp).map((key) => (
        <Button
          key={key}
          variant="outlined"
          onClick={() => handleToAmountChange(key)}
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
  ) : null
}
