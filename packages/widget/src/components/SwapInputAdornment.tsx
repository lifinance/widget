import { InputAdornment, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

const SwapInputAdornment = styled(Typography)(({ theme }) => ({
  borderLeft: '1px solid',
  borderColor: theme.palette.grey[300],
  paddingLeft: 8,
  marginLeft: 8,
}));

const SwapMaxInputAdornment = styled(Typography)({
  textDecoration: 'underline',
  marginRight: 8,
  '&:hover': {
    cursor: 'pointer',
  },
});

export const SwapFromInputAdornment: React.FC<{
  maxAmount: number;
  price: number;
}> = ({ maxAmount, price }) => {
  const { t } = useTranslation();
  return (
    <InputAdornment position="end">
      <SwapMaxInputAdornment variant="body2" color="text.primary">
        {t(`swap.form.max`)}
      </SwapMaxInputAdornment>
      <Typography variant="body2" color="text.secondary">
        {t(`swap.form.maxAmount`, { value: maxAmount })}
      </Typography>
      <SwapInputAdornment variant="body2" color="text.secondary">
        {t(`swap.form.price`, { value: price })}
      </SwapInputAdornment>
    </InputAdornment>
  );
};

export const SwapToInputAdornment: React.FC<{ price: number }> = ({
  price,
}) => {
  const { t } = useTranslation();
  return (
    <InputAdornment position="end">
      <SwapInputAdornment variant="body2" color="text.secondary">
        {t(`swap.form.price`, { value: price })}
      </SwapInputAdornment>
    </InputAdornment>
  );
};
