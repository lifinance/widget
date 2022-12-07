import { Search as SearchIcon } from '@mui/icons-material';
import { FormControl, InputAdornment } from '@mui/material';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Card } from '../../components/Card';
import { SwapFormKey } from '../../providers';
import { Input } from './SearchTokenInput.style';

export const SearchTokenInput = () => {
  const { t } = useTranslation();
  const { register, setValue } = useFormContext();

  useEffect(
    () => () => {
      setValue(SwapFormKey.TokenSearchFilter, '');
    },
    [setValue],
  );

  return (
    <Card>
      <FormControl fullWidth>
        <Input
          size="small"
          placeholder={t(`swap.tokenSearch`) as string}
          defaultValue=""
          endAdornment={
            <InputAdornment position="end">
              <SearchIcon />
            </InputAdornment>
          }
          inputProps={{
            inputMode: 'search',
            ...register(SwapFormKey.TokenSearchFilter),
          }}
          autoComplete="off"
        />
      </FormControl>
    </Card>
  );
};
