import { useWalletMenu } from '@lifi/wallet-management'
import { useCallback } from 'react'
import { CheckoutStack } from '../../components/CheckoutStack.js'
import { SelectSourceFundingOptions } from '../../components/SelectSource/SelectSourceFundingOptions.js'
import {
  SelectSourceHeaderRow,
  SelectSourceHeaderTitle,
  SelectSourceMainColumn,
} from '../../components/SelectSource/SelectSourceLayout.js'
import { TopWalletRows } from '../../components/SelectSource/TopWalletRows.js'
import { useCheckoutNavigate } from '../../hooks/useCheckoutNavigate.js'
import { useSelectSourceTopWallets } from '../../hooks/useSelectSourceTopWallets.js'
import { useTransak } from '../../providers/TransakProvider.js'
import { checkoutNavigationRoutes } from '../../utils/navigationRoutes.js'

export const SelectSourcePage: React.FC = () => {
  const navigate = useCheckoutNavigate()
  const { openWalletMenu } = useWalletMenu()
  const { openDepositFlow } = useTransak()
  const { topWallets } = useSelectSourceTopWallets()

  const goToToken = useCallback(() => {
    navigate({ to: checkoutNavigationRoutes.fromToken })
  }, [navigate])

  const handleFundingMethodSelect = useCallback(() => {
    navigate({ to: checkoutNavigationRoutes.fundingMethods })
  }, [navigate])

  return (
    <CheckoutStack>
      <SelectSourceHeaderRow>
        <SelectSourceHeaderTitle>Connect wallet</SelectSourceHeaderTitle>
      </SelectSourceHeaderRow>

      <SelectSourceMainColumn>
        <TopWalletRows
          topWallets={topWallets}
          onOpenWalletMenu={openWalletMenu}
        />
        <SelectSourceFundingOptions
          onTransferCrypto={goToToken}
          onConnectExchange={handleFundingMethodSelect}
          onDepositCash={openDepositFlow}
        />
      </SelectSourceMainColumn>
    </CheckoutStack>
  )
}
