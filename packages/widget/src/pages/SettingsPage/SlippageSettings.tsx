import type { ChangeEventHandler } from 'react';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PercentIcon from '@mui/icons-material/Percent';
import {
  BadgedAdditionalInformation,
  SettingCardExpandable,
} from './SettingsPage.style';
import { useSettings, useSettingsStore } from '../../stores';
import {
  SettingsFieldSet,
  SlippageCustomInput,
  SlippageDefaultButton,
  SlippageLimitsWarning,
} from './SlippageSettings.style';
import { formatSlippage } from '../../utils';
import { useSettingMonitor } from '../../hooks';
import { Box } from '@mui/material';

const slippageDefault = '0.5';
export const SlippageSettings: React.FC = () => {
  const { t } = useTranslation();
  const { isSlippageOutsideRecommendedLimits, isSlippageChanged } =
    useSettingMonitor();
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

  const badgeColor = isSlippageOutsideRecommendedLimits
    ? 'warning'
    : isSlippageChanged
      ? 'info'
      : undefined;

  return (
    <SettingCardExpandable
      additionalInfo={
        <BadgedAdditionalInformation
          badgeColor={badgeColor}
          showBadge={!!badgeColor}
        >{`${slippage}%`}</BadgedAdditionalInformation>
      }
      icon={<PercentIcon />}
      title={t(`settings.slippage`)}
    >
      <Box mt={1.5}>
        <SettingsFieldSet>
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
        {isSlippageOutsideRecommendedLimits && (
          <SlippageLimitsWarning>
            {t('warning.message.slippageOutsideRecommendedLimits')}
          </SlippageLimitsWarning>
        )}
      </Box>
    </SettingCardExpandable>
  );
};
