import type * as React from 'react'
import { useConfigActions, useConfigWalletManagement } from '../../../store'
import {
  Card,
  CardRowContainer,
  CardTitleContainer,
  CardValue,
} from '../../Card'
import { Switch } from '../../Switch'

export const WalletManagementControl = () => {
  const { isExternalWalletManagement, replacementWalletConfig } =
    useConfigWalletManagement()
  const { setWalletConfig } = useConfigActions()
  const handleSwitchChange: (
    _: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => void = (_, checked) => {
    const walletConfig = checked ? replacementWalletConfig : undefined

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
          onChange={handleSwitchChange}
          aria-label="Enable external wallet management"
        />
      </CardRowContainer>
    </Card>
  )
}
