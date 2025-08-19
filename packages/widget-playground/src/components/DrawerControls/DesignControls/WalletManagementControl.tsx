import { Collapse } from '@mui/material'
import type * as React from 'react'
import { useConfigActions } from '../../../store/widgetConfig/useConfigActions.js'
import { useConfigWalletManagement } from '../../../store/widgetConfig/useConfigValues.js'
import {
  Card,
  CardRowContainer,
  CardTitleContainer,
  CardValue,
} from '../../Card/Card.style.js'
import { Switch } from '../../Switch.js'

export const WalletManagementControl = () => {
  const {
    isExternalWalletManagement,
    isPartialWalletManagement,
    replacementWalletConfig,
    isForceInternalWalletMangement,
  } = useConfigWalletManagement()
  const { setWalletConfig } = useConfigActions()

  const handleExternalWalletManagement = (
    _: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    const walletConfig = checked ? replacementWalletConfig : undefined

    setWalletConfig(walletConfig)
  }

  const handlePartialWalletManagement = (
    _: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    const walletConfig = checked
      ? { ...replacementWalletConfig, usePartialWalletManagement: true }
      : replacementWalletConfig

    setWalletConfig(walletConfig)
  }

  const handleForceInternalWalletManagement = (
    _: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    const walletConfig = checked
      ? { ...replacementWalletConfig, forceInternalWalletManagement: true }
      : replacementWalletConfig

    setWalletConfig(walletConfig)
  }

  return (
    <Card>
      <CardRowContainer>
        <CardTitleContainer>
          <CardValue>Manage wallet externally</CardValue>
        </CardTitleContainer>
        <Switch
          checked={isExternalWalletManagement}
          onChange={handleExternalWalletManagement}
          aria-label="Enable external wallet management"
        />
      </CardRowContainer>
      <Collapse in={isExternalWalletManagement}>
        <CardRowContainer>
          <CardTitleContainer>
            <CardValue>Use partial wallet management</CardValue>
          </CardTitleContainer>
          <Switch
            checked={isPartialWalletManagement}
            onChange={handlePartialWalletManagement}
            aria-label="Use partial wallet management"
          />
        </CardRowContainer>
        <CardRowContainer>
          <CardTitleContainer>
            <CardValue>Force Internal Wallet Management</CardValue>
          </CardTitleContainer>
          <Switch
            checked={isForceInternalWalletMangement}
            onChange={handleForceInternalWalletManagement}
            aria-label="Force internal wallet management"
          />
        </CardRowContainer>
      </Collapse>
    </Card>
  )
}
