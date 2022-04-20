import { Search as SearchIcon } from '@mui/icons-material';
import { FormControl, InputAdornment } from '@mui/material';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Input } from '../../components/Input';
import { SwapFormKey } from '../../providers/SwapFormProvider';

export const SearchTokenInput = () => {
  const { t } = useTranslation();
  const { register, setValue } = useFormContext();

  useEffect(
    () => () => {
      setValue(SwapFormKey.SearchTokensFilter, '');
    },
    [setValue],
  );

  return (
    <FormControl fullWidth>
      <Input
        size="small"
        placeholder={t(`swap.tokenSearch`)}
        defaultValue=""
        endAdornment={
          <InputAdornment position="end">
            <SearchIcon />
          </InputAdornment>
        }
        inputProps={{
          inputMode: 'search',
          ...register(SwapFormKey.SearchTokensFilter),
        }}
        autoComplete="off"
      />
    </FormControl>
  );
};
