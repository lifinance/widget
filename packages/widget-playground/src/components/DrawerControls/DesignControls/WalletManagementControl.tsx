import { Collapse } from '@mui/material'
import type * as React from 'react'
import { useConfigActions } from '../../../store/widgetConfig/useConfigActions'
import { useConfigWalletManagement } from '../../../store/widgetConfig/useConfigValues'
import {
  Card,
  CardRowContainer,
  CardTitleContainer,
  CardValue,
} from '../../Card/Card.style'
import { Switch } from '../../Switch'

export const WalletManagementControl = () => {
  const {
    isExternalWalletManagement,
    isPartialWalletManagement,
    replacementWalletConfig,
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
      </Collapse>
    </Card>
  )
}
