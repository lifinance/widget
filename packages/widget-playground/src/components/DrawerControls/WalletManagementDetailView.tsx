import type { WidgetWalletConfig } from '@lifi/widget'
import type { JSX } from 'react'
import { useCallback, useMemo } from 'react'
import { useConfigActions } from '../../store/widgetConfig/useConfigActions.js'
import { useConfigWalletManagement } from '../../store/widgetConfig/useConfigValues.js'
import { CardSelect } from './CardSelect.js'
import { DetailViewHeader } from './DetailViewHeader.js'
import {
  CardsContainer,
  Content,
  Description,
  Title,
  TitleSection,
} from './WalletManagementDetailView.style.js'

type WalletManagementMode = 'internal' | 'external' | 'partial'

interface WalletManagementDetailViewProps {
  onBack: () => void
  onReset: () => void
}

export const WalletManagementDetailView = ({
  onBack,
  onReset,
}: WalletManagementDetailViewProps): JSX.Element => {
  const {
    replacementWalletConfig,
    isExternalWalletManagement,
    isPartialWalletManagement,
  } = useConfigWalletManagement()
  const { setWalletConfig } = useConfigActions()

  const activeMode = useMemo((): WalletManagementMode => {
    if (!isExternalWalletManagement) {
      return 'internal'
    }
    if (isPartialWalletManagement) {
      return 'partial'
    }
    return 'external'
  }, [isExternalWalletManagement, isPartialWalletManagement])

  const handleSelectInternal = useCallback((): void => {
    setWalletConfig(undefined)
  }, [setWalletConfig])

  const handleSelectExternal = useCallback((): void => {
    setWalletConfig({
      ...(replacementWalletConfig as WidgetWalletConfig),
      usePartialWalletManagement: false,
      forceInternalWalletManagement: false,
    })
  }, [replacementWalletConfig, setWalletConfig])

  const handleSelectPartial = useCallback((): void => {
    setWalletConfig({
      ...(replacementWalletConfig as WidgetWalletConfig),
      usePartialWalletManagement: true,
      forceInternalWalletManagement: false,
    })
  }, [replacementWalletConfig, setWalletConfig])

  return (
    <>
      <DetailViewHeader onBack={onBack} onReset={onReset} />
      <Content>
        <TitleSection>
          <Title>Wallet management</Title>
          <Description>
            Choose who handles the wallet connection, the widget, your app, or a
            mix of both.
          </Description>
        </TitleSection>
        <CardsContainer>
          <CardSelect
            title="Internal"
            description="Widget manages all wallets."
            selected={activeMode === 'internal'}
            onClick={handleSelectInternal}
          />
          <CardSelect
            title="External"
            description="Your app's wallet handles connection."
            selected={activeMode === 'external'}
            onClick={handleSelectExternal}
          />
          <CardSelect
            title="Partial"
            description="Combination of both."
            selected={activeMode === 'partial'}
            onClick={handleSelectPartial}
          />
        </CardsContainer>
      </Content>
    </>
  )
}
