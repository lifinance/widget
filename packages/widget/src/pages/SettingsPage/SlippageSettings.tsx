import {
  ChangeEvent,
  ChangeEventHandler,
  EventHandler,
  FocusEvent,
  FocusEventHandler,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import Percent from '@mui/icons-material/Percent';
import {
  SettingCardExpandable,
  SettingSummaryText,
} from './SettingsPage.style';
import { useSettings, useSettingsStore } from '../../stores';
import {
  SettingsFieldSet,
  SlippageCustomInput,
  SlippageDefaultButton,
} from './SlippageSettings.style';
import { formatSlippage } from '../../utils';

const slippageDefault = '0.5';
export const SlippageSettings: React.FC = () => {
  const { t } = useTranslation();
  const { slippage } = useSettings(['slippage']);
  const setValue = useSettingsStore((state) => state.setValue);
  const defaultValue = useRef(slippage);

  const [customFocused, setCustomFocused] = useState(false);
  const [defaultFocused, setDefaultFocused] = useState(false);

  const handleDefaultClick = () => {
    setValue('slippage', formatSlippage(slippageDefault, defaultValue.current));
  };

  const handleInputUpdate: ChangeEventHandler<HTMLInputElement> = (event) => {
    const { value } = event.target;
    setValue('slippage', formatSlippage(value, defaultValue.current, true));
  };

  const customInputValue =
    !slippage || slippage === slippageDefault ? '' : slippage;

  return (
    <SettingCardExpandable
      additionalInfo={<SettingSummaryText>{`${slippage}%`}</SettingSummaryText>}
      icon={<Percent />}
      title={t(`settings.slippage`)}
    >
      <SettingsFieldSet mt={1.5}>
        <SlippageDefaultButton
          selected={slippageDefault === slippage && !customFocused}
          onFocus={() => setDefaultFocused(true)}
          onBlur={() => setDefaultFocused(false)}
          onClick={handleDefaultClick}
          focusRipple
        >
          0.5
        </SlippageDefaultButton>
        <SlippageCustomInput
          selected={slippageDefault !== slippage && !defaultFocused}
          placeholder={customFocused ? '' : t('settings.custom')}
          inputProps={{
            inputMode: 'decimal',
          }}
          onChange={handleInputUpdate}
          onFocus={() => setCustomFocused(true)}
          onBlur={() => setCustomFocused(false)}
          value={customInputValue}
          autoComplete="off"
        />
      </SettingsFieldSet>
    </SettingCardExpandable>
  );
};
