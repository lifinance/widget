import { Search } from '@mui/icons-material';
import { FormControl, InputAdornment } from '@mui/material';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '../../components/Card/Card.js';
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
    <Card>
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
    </Card>
  );
};
