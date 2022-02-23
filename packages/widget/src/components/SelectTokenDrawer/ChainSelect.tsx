import {
  Avatar,
  FormControl,
  ListItemIcon,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import { useFormContext, useWatch } from 'react-hook-form';
import {
  SwapFormKey,
  SwapFormKeyHelper,
  SwapFormTypeProps,
} from '../../providers/SwapFormProvider';
import { useWidgetConfig } from '../../providers/WidgetProvider';
import { Select } from '../Select';

export const ChainSelect = ({ formType }: SwapFormTypeProps) => {
  const { setValue } = useFormContext();
  const { supportedChains, fromChain, toChain } = useWidgetConfig();
  const [fromChainKey, toChainKey] = useWatch({
    name: [SwapFormKey.FromChain, SwapFormKey.ToChain],
  });

  const handleChain = (event: SelectChangeEvent<unknown>) => {
    setValue(SwapFormKeyHelper.getChainKey(formType), event.target.value);
    setValue(SwapFormKeyHelper.getTokenKey(formType), '');
    setValue(SwapFormKeyHelper.getAmountKey(formType), '');
  };

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
          value={fromChainKey}
          onChange={handleChain}
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
          value={toChainKey}
          onChange={handleChain}
        >
          {menuItems}
        </Select>
      </FormControl>
    </>
  );
};
