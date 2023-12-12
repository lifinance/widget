import SearchIcon from '@mui/icons-material/Search';
import { FormControl, InputAdornment } from '@mui/material';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '../../components/Card';
import { Input } from './SearchTokenInput.style';
import {
  useFieldActions,
  useFieldController,
  useFormStore,
} from '../../stores';

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
          defaultValue=""
          endAdornment={
            <InputAdornment position="end">
              <SearchIcon />
            </InputAdornment>
          }
          inputProps={{
            inputMode: 'search',
            onChange: (e) => onChange((e.target as HTMLInputElement).value),
            onBlur,
            name,
            value,
          }}
          autoComplete="off"
        />
      </FormControl>
    </Card>
  );
};
