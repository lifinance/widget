import { KeyboardArrowDown as KeyboardArrowDownIcon } from '@mui/icons-material';
import type { SelectChangeEvent } from '@mui/material';
import {
  Avatar,
  FormControl,
  ListItemAvatar,
  MenuItem,
  Skeleton,
} from '@mui/material';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Card, CardTitle } from '../../components/Card';
import { Select } from '../../components/Select';
import { useChains } from '../../hooks';
import type { SwapFormTypeProps } from '../../providers/SwapFormProvider';
import {
  SwapFormKey,
  SwapFormKeyHelper,
} from '../../providers/SwapFormProvider';
import { useWidgetConfig } from '../../providers/WidgetProvider';

export const ChainSelect = ({ formType }: SwapFormTypeProps) => {
  const { t } = useTranslation();
  const { setValue, register } = useFormContext();
  const { fromChain, toChain } = useWidgetConfig();
  const { chains, isLoading } = useChains();
  const chainKey = SwapFormKeyHelper.getChainKey(formType);
  const [chainId] = useWatch({
    name: [chainKey],
  });

  const { onChange, onBlur, name, ref } = register(chainKey);

  const handleChain = (event: SelectChangeEvent<unknown>) => {
    onChange(event);
    setValue(SwapFormKeyHelper.getTokenKey(formType), '');
    setValue(SwapFormKeyHelper.getAmountKey(formType), '');
    setValue(SwapFormKey.TokenSearchFilter, '');
  };

  return !isLoading ? (
    <Card>
      <CardTitle>{t(`swap.selectChain`)}</CardTitle>
      <FormControl fullWidth>
        <Select
          ref={ref}
          labelId={chainKey}
          name={name}
          MenuProps={{ elevation: 2 }}
          defaultValue={formType === 'from' ? fromChain : toChain}
          value={chainId}
          onChange={handleChain}
          onBlur={onBlur}
          IconComponent={KeyboardArrowDownIcon}
        >
          {chains?.map((chain) => (
            <MenuItem key={chain.key} value={chain.id}>
              <ListItemAvatar>
                <Avatar src={chain.logoURI} alt={chain.key}>
                  {chain.name[0]}
                </Avatar>
              </ListItemAvatar>
              {chain.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Card>
  ) : (
    <Skeleton
      variant="rectangular"
      width="100%"
      height={98}
      sx={{ borderRadius: 1 }}
    />
  );
};
