import type { WidgetWalletConfig } from '@lifi/widget'
import { Box, Typography } from '@mui/material'
import type { JSX } from 'react'
import { useCallback } from 'react'
import { useConfigActions } from '../store/widgetConfig/useConfigActions.js'
import { useConfigWalletManagement } from '../store/widgetConfig/useConfigValues.js'
import { useDefaultConfig } from '../store/widgetConfig/useDefaultConfig.js'
import { docsLinks } from '../utils/docsLinks.js'
import { CardSelect } from './CardSelect/CardSelect.js'
import {
  CardsContainer,
  Content,
  Description,
  Title,
  TitleSection,
} from './DetailView/DetailView.style.js'
import { DetailViewHeader } from './DetailView/DetailViewHeader.js'
import { DocsLink } from './DocsLink/DocsLink.js'
import { Switch } from './Switch.js'

type WalletManagementMode = 'internal' | 'external' | 'partial'

interface WalletManagementDetailViewProps {
  onBack: () => void
}

export const WalletManagementDetailView = ({
  onBack,
}: WalletManagementDetailViewProps): JSX.Element => {
  const {
    replacementWalletConfig,
    isExternalWalletManagement,
    isPartialWalletManagement,
    isForceInternalWalletManagement,
  } = useConfigWalletManagement()
  const { setWalletConfig } = useConfigActions()
  const { defaultConfig } = useDefaultConfig()

  const activeMode: WalletManagementMode = !isExternalWalletManagement
    ? 'internal'
    : isPartialWalletManagement
      ? 'partial'
      : 'external'

  const handleReset = useCallback((): void => {
    setWalletConfig(defaultConfig?.walletConfig)
  }, [defaultConfig, setWalletConfig])

  const handleSelect = useCallback(
    (mode: WalletManagementMode): void => {
      if (mode === 'internal') {
        setWalletConfig(undefined)
        return
      }
      setWalletConfig({
        ...(replacementWalletConfig as WidgetWalletConfig),
        usePartialWalletManagement: mode === 'partial',
        forceInternalWalletManagement: false,
      })
    },
    [replacementWalletConfig, setWalletConfig]
  )

  const handleForceInternal = useCallback(
    (_: React.ChangeEvent<HTMLInputElement>, checked: boolean): void => {
      setWalletConfig({
        ...(replacementWalletConfig as WidgetWalletConfig),
        forceInternalWalletManagement: checked,
      })
    },
    [replacementWalletConfig, setWalletConfig]
  )

  const forceInternalFooter =
    activeMode === 'external' ? (
      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        <Typography sx={{ flex: 1, fontSize: 14, fontWeight: 500 }}>
          Force internal wallets
        </Typography>
        <Switch
          checked={isForceInternalWalletManagement}
          onChange={handleForceInternal}
          aria-label="Force internal wallet management"
        />
      </Box>
    ) : null

  return (
    <>
      <DetailViewHeader onBack={onBack} onReset={handleReset} />
      <Content>
        <TitleSection>
          <Title>Wallet management</Title>
          <Description>
            Choose whether the widget, your app, or both handle wallet
            connections.
          </Description>
          <DocsLink href={docsLinks.walletManagement} />
        </TitleSection>
        <CardsContainer>
          <CardSelect
            title="Internal"
            description="Widget manages all wallets."
            selected={activeMode === 'internal'}
            onClick={() => handleSelect('internal')}
          />
          <CardSelect
            title="External"
            description="Your app's wallet handles connection."
            selected={activeMode === 'external'}
            onClick={() => handleSelect('external')}
            footer={forceInternalFooter}
          />
          <CardSelect
            title="Partial"
            description="Combination of both."
            selected={activeMode === 'partial'}
            onClick={() => handleSelect('partial')}
          />
        </CardsContainer>
      </Content>
    </>
  )
}
