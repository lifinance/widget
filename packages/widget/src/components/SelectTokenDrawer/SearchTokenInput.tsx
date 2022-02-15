import { Search as SearchIcon } from '@mui/icons-material';
import { FormControl, InputAdornment } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { SwapFormKey } from '../../providers/SwapFormProvider';
import { Input } from '../Input';
import { FormTypeProps } from './types';

export const SearchTokenInput = ({ formType }: FormTypeProps) => {
  const { t } = useTranslation();
  const { register } = useFormContext();

  return (
    <>
      <FormControl
        fullWidth
        sx={{ display: formType === 'from' ? 'inline-flex' : 'none' }}
      >
        <Input
          size="small"
          placeholder={t(`swap.tokenSearch`)}
          endAdornment={
            <InputAdornment position="end">
              <SearchIcon />
            </InputAdornment>
          }
          inputProps={{
            ...register(SwapFormKey.FromSearchTokensFilter),
          }}
          autoComplete="off"
        />
      </FormControl>
      <FormControl
        fullWidth
        sx={{ display: formType === 'to' ? 'inline-flex' : 'none' }}
      >
        <Input
          size="small"
          placeholder={t(`swap.tokenSearch`)}
          endAdornment={
            <InputAdornment position="end">
              <SearchIcon />
            </InputAdornment>
          }
          inputProps={{
            ...register(SwapFormKey.ToSearchTokensFilter),
          }}
          autoComplete="off"
        />
      </FormControl>
    </>
  );
};
