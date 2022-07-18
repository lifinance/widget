import { FormControl, InputAdornment } from '@mui/material';
import { ChangeEventHandler, FocusEventHandler, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { CardContainer, CardTitle } from '../../components/Card';
import { Input } from '../../components/Input';
import { useSetSettings, useSettings } from '../../stores';
import { formatSlippage } from '../../utils';

export const SlippageInput = () => {
  const { t } = useTranslation();
  const [setValue] = useSetSettings();
  const { slippage } = useSettings(['slippage']);
  const defaultValue = useRef(slippage);

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const { value } = event.target;
    setValue('slippage', formatSlippage(value, defaultValue.current, true));
  };

  const handleBlur: FocusEventHandler<HTMLInputElement> = (event) => {
    const { value } = event.target;
    setValue('slippage', formatSlippage(value, defaultValue.current));
  };

  return (
    <CardContainer>
      <CardTitle>{t(`settings.slippage`)}</CardTitle>
      <FormControl fullWidth>
        <Input
          size="small"
          placeholder={t(`settings.slippage`)}
          endAdornment={<InputAdornment position="end">%</InputAdornment>}
          autoComplete="off"
          inputProps={{
            inputMode: 'decimal',
          }}
          onChange={handleChange}
          onBlur={handleBlur}
          value={slippage}
        />
      </FormControl>
    </CardContainer>
  );
};
