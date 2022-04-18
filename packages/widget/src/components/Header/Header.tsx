import { Box } from '@mui/material';
import { FC } from 'react';
import { ElementId } from '../../utils/elements';
import { NavigationHeader } from './NavigationHeader';
import { WalletHeader } from './WalletHeader';

export const Header: FC = () => (
  <Box id={ElementId.Header}>
    <WalletHeader />
    <NavigationHeader />
  </Box>
);
