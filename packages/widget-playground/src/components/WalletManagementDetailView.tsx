import type { WidgetWalletConfig } from '@lifi/widget'
import type { JSX } from 'react'
import { useCallback } from 'react'
import { useConfigActions } from '../store/widgetConfig/useConfigActions.js'
import { useConfigWalletManagement } from '../store/widgetConfig/useConfigValues.js'
import { useDefaultConfig } from '../store/widgetConfig/useDefaultConfig.js'
import { docsLinks } from '../utils/docsLinks.js'
import {
  getActiveWalletManagementMode,
  WALLET_MANAGEMENT_OPTIONS,
  type WalletManagementMode,
} from '../utils/walletManagement.js'
import { CardSelect } from './CardSelect/CardSelect.js'
import { DetailViewLayout } from './DetailView/DetailViewLayout.js'
import { ToggleRow, ToggleRowLabel } from './Row.style.js'
import { Switch } from './Switch.style.js'

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

  const activeMode = getActiveWalletManagementMode(
    isExternalWalletManagement,
    isPartialWalletManagement
  )

  const handleReset = useCallback((): void => {
    setWalletConfig(defaultConfig?.walletConfig)
  }, [defaultConfig, setWalletConfig])

  const handleSelect = useCallback(
    (mode: WalletManagementMode): void => {
      if (mode === 'internal') {
        setWalletConfig(undefined)
        return
      }
      if (!replacementWalletConfig) {
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
      if (!replacementWalletConfig) {
        return
      }
      setWalletConfig({
        ...(replacementWalletConfig as WidgetWalletConfig),
        forceInternalWalletManagement: checked,
      })
    },
    [replacementWalletConfig, setWalletConfig]
  )

  const forceInternalFooter =
    activeMode === 'external' ? (
      <ToggleRow sx={{ mt: 0 }}>
        <ToggleRowLabel sx={{ fontSize: 14, lineHeight: '18px' }}>
          Force internal wallets
        </ToggleRowLabel>
        <Switch
          checked={isForceInternalWalletManagement}
          onChange={handleForceInternal}
          aria-label="Force internal wallet management"
        />
      </ToggleRow>
    ) : null

  return (
    <DetailViewLayout
      onBack={onBack}
      onReset={handleReset}
      resetLabel="Reset wallet management"
      title="Wallet management"
      description="Choose whether the widget, your app, or both handle wallet connections."
      docsHref={docsLinks.walletManagement}
    >
      {WALLET_MANAGEMENT_OPTIONS.map(({ id, title, description }) => (
        <CardSelect
          key={id}
          title={title}
          description={description}
          selected={activeMode === id}
          onClick={() => handleSelect(id)}
          footer={id === 'external' ? forceInternalFooter : undefined}
        />
      ))}
    </DetailViewLayout>
  )
}
