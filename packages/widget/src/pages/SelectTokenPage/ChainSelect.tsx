import { KeyboardArrowDown as KeyboardArrowDownIcon } from '@mui/icons-material';
import {
  Avatar,
  FormControl,
  ListItemAvatar,
  MenuItem,
  SelectChangeEvent,
  Skeleton,
  Typography,
} from '@mui/material';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { CardContainer } from '../../components/Card';
import { useChains } from '../../hooks/useChains';
import {
  SwapFormKeyHelper,
  SwapFormTypeProps,
} from '../../providers/SwapFormProvider';
import { useWidgetConfig } from '../../providers/WidgetProvider';
import { Select } from './ChainSelect.style';

export const ChainSelect = ({ formType }: SwapFormTypeProps) => {
  const { t } = useTranslation();
  const { setValue } = useFormContext();
  const { fromChain, toChain } = useWidgetConfig();
  const { chains, isLoading } = useChains();
  const [chainId] = useWatch({
    name: [SwapFormKeyHelper.getChainKey(formType)],
  });

  const handleChain = (event: SelectChangeEvent<unknown>) => {
    setValue(SwapFormKeyHelper.getChainKey(formType), event.target.value);
    setValue(SwapFormKeyHelper.getTokenKey(formType), '');
    setValue(SwapFormKeyHelper.getAmountKey(formType), '');
  };

  return !isLoading ? (
    <CardContainer>
      <Typography
        variant="body2"
        fontWeight="bold"
        lineHeight={1}
        px={2}
        pt={2}
      >
        {t(`swap.selectChain`)}
      </Typography>
      <FormControl fullWidth>
        <Select
          labelId="label"
          MenuProps={{ elevation: 2 }}
          defaultValue={formType === 'from' ? fromChain : toChain}
          value={chainId}
          onChange={handleChain}
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
    </CardContainer>
  ) : (
    <Skeleton
      variant="rectangular"
      width="100%"
      height={89}
      sx={{ borderRadius: 1.5 }}
    />
  );
};
