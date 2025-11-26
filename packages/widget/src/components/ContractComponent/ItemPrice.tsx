import { type ContractCall, formatUnits } from '@lifi/sdk'
import { useEffect } from 'react'
import { useFieldActions } from '../../stores/form/useFieldActions.js'
import type { TokenAmount } from '../../types/token.js'
import { Token } from '../Token/Token.js'

export interface ItemPriceProps {
  token: TokenAmount
  contractCalls?: ContractCall[]
}

export const ItemPrice: React.FC<ItemPriceProps> = ({
  token,
  contractCalls,
}) => {
  const { setFieldValue } = useFieldActions()

  useEffect(() => {
    if (token) {
      setFieldValue('toChain', token.chainId, { isTouched: true })
      setFieldValue('toToken', token.address, { isTouched: true })
      setFieldValue(
        'toAmount',
        token.amount ? formatUnits(token.amount, token.decimals) : '',
        {
          isTouched: true,
        }
      )
    }
    if (contractCalls) {
      setFieldValue('contractCalls', contractCalls, {
        isTouched: true,
      })
    }
  }, [contractCalls, setFieldValue, token])
  return <Token token={token} p={2} />
}
