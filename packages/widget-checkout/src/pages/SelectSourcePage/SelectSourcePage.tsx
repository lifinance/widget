import { useWalletMenu } from '@lifi/wallet-management'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { CheckoutStack } from '../../components/CheckoutStack.js'
import { useCheckoutNavigate } from '../../hooks/useCheckoutNavigate.js'
import { useOnRamp } from '../../hooks/useOnRamp.js'
import { useSelectSourceTopWallets } from '../../hooks/useSelectSourceTopWallets.js'
import { checkoutNavigationRoutes } from '../../utils/navigationRoutes.js'
import { SelectSourceFundingOptions } from './SelectSourceFundingOptions.js'
import {
  SelectSourceHeaderRow,
  SelectSourceHeaderTitle,
  SelectSourceMainColumn,
} from './SelectSourceLayout.js'
import { TopWalletRows } from './TopWalletRows.js'

export const SelectSourcePage: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useCheckoutNavigate()
  const { openWalletMenu } = useWalletMenu()
  const { transak, resolutionLoading } = useOnRamp()
  const { topWallets } = useSelectSourceTopWallets()

  const goToToken = useCallback(() => {
    navigate({ to: checkoutNavigationRoutes.fromToken })
  }, [navigate])

  return (
    <CheckoutStack>
      <SelectSourceHeaderRow>
        <SelectSourceHeaderTitle>
          {t('checkout.connectWallet')}
        </SelectSourceHeaderTitle>
      </SelectSourceHeaderRow>

      <SelectSourceMainColumn>
        <TopWalletRows
          topWallets={topWallets}
          onOpenWalletMenu={openWalletMenu}
          onConnected={goToToken}
        />
        <SelectSourceFundingOptions
          onTransferCrypto={goToToken}
          onDepositCash={() => transak?.openDepositFlow()}
          showDepositCash={!resolutionLoading && Boolean(transak)}
        />
      </SelectSourceMainColumn>
    </CheckoutStack>
  )
}
