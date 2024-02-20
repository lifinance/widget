import { useState } from 'react';
import {
  Card,
  CardRowContainer,
  CardTitleContainer,
  CardValue,
} from '../../Card';
import { Switch } from '../../Switch';
import { useConfigActions, useConfigWalletManagement } from '../../../store';
import * as React from 'react';
import { WidgetWalletConfig } from '@lifi/widget';

export const WalletManagementControl = () => {
  const { isExternalWalletManagement } = useConfigWalletManagement();
  const { setWalletConfig } = useConfigActions();
  const handleSwitchChange: (
    _: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => void = (_, checked) => {
    const walletConfig = checked ? { async onConnect() {} } : undefined;

    setWalletConfig(walletConfig as WidgetWalletConfig);
  };

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
  );
};
