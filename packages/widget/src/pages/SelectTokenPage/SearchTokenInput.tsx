import { Search } from '@mui/icons-material';
import { FormControl, InputAdornment } from '@mui/material';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { InputCard } from '../../components/Card/InputCard.js';
import { useFieldActions } from '../../stores/form/useFieldActions.js';
import { useFieldController } from '../../stores/form/useFieldController.js';
import { Input } from './SearchTokenInput.style.js';

export const SearchTokenInput = () => {
  const { t } = useTranslation();
  const { setFieldValue } = useFieldActions();
  const { onChange, onBlur, name, value } = useFieldController({
    name: 'tokenSearchFilter',
  });

  useEffect(
    () => () => {
      setFieldValue('tokenSearchFilter', '');
    },
    [setFieldValue],
  );

  return (
    <InputCard>
      <FormControl fullWidth>
        <Input
          size="small"
          placeholder={t(`main.tokenSearch`) as string}
          endAdornment={
            <InputAdornment position="end">
              <Search />
            </InputAdornment>
          }
          inputProps={{
            inputMode: 'search',
            onChange: (e) => onChange((e.target as HTMLInputElement).value),
            onBlur,
            name,
            value,
            maxLength: 128,
          }}
          autoComplete="off"
        />
      </FormControl>
    </InputCard>
  );
};
