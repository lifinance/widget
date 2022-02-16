import { Box, DrawerProps } from '@mui/material';
import { forwardRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ContainerDrawer } from '../ContainerDrawer';
import { SettingsDrawerBase } from './types';

export const SettingsDrawer = forwardRef<SettingsDrawerBase, DrawerProps>(
  (_, ref) => {
    const { t } = useTranslation();
    const { register } = useFormContext();

    return (
      <ContainerDrawer ref={ref} route="settings">
        <Box role="presentation">Settings</Box>
      </ContainerDrawer>
    );
  },
);
