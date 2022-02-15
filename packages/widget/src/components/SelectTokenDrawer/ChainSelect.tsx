import { Avatar, FormControl, ListItemIcon, MenuItem } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { SwapFormKey } from '../../providers/SwapFormProvider';
import { useWidgetConfig } from '../../providers/WidgetProvider';
import { Select } from '../Select';
import { FormTypeProps } from './types';

export const ChainSelect = ({ formType }: FormTypeProps) => {
  const { register } = useFormContext();
  const { supportedChains, fromChain, toChain } = useWidgetConfig();

  const menuItems = supportedChains.map((chain) => (
    <MenuItem key={chain.key} value={chain.key}>
      <ListItemIcon>
        <Avatar
          src={chain.logoURI}
          alt={chain.key}
          sx={{ width: 24, height: 24 }}
        >
          {chain.name[0]}
        </Avatar>
      </ListItemIcon>
      {chain.name}
    </MenuItem>
  ));

  return (
    <>
      <FormControl
        fullWidth
        sx={{ display: formType === 'from' ? 'inline-flex' : 'none' }}
      >
        <Select
          MenuProps={{ elevation: 2 }}
          defaultValue={fromChain}
          inputProps={{
            ...register(SwapFormKey.FromChain),
          }}
        >
          {menuItems}
        </Select>
      </FormControl>
      <FormControl
        fullWidth
        sx={{ display: formType === 'to' ? 'inline-flex' : 'none' }}
      >
        <Select
          MenuProps={{ elevation: 2 }}
          defaultValue={toChain}
          inputProps={{
            ...register(SwapFormKey.ToChain),
          }}
          hidden={formType === 'to'}
        >
          {menuItems}
        </Select>
      </FormControl>
    </>
  );
};
