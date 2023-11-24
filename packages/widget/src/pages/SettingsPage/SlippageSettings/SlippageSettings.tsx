import type { ChangeEventHandler } from 'react';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PercentIcon from '@mui/icons-material/Percent';
import { useSettings, useSettingsStore } from '../../../stores';
import { useSettingMonitor } from '../../../hooks';
import { formatSlippage } from '../../../utils';
import {
  SettingsFieldSet,
  SlippageCustomInput,
  SlippageDefaultButton,
} from './SlippageSettings.style';
import { SlippageLimitsWarning } from './SlippageLimitsWarning';
import { Box } from '@mui/material';
import {
  SettingCardExpandable,
  BadgedAdditionalInformation,
} from '../SettingsCard';

const slippageDefault = '0.5';
export const SlippageSettings: React.FC = () => {
  const { t } = useTranslation();
  const { isSlippageOutsideRecommendedLimits, isSlippageChanged } =
    useSettingMonitor();
  const { slippage } = useSettings(['slippage']);
  const setValue = useSettingsStore((state) => state.setValue);
  const defaultValue = useRef(slippage);
  const [focused, setFocused] = useState('');

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
            selected={slippageDefault === slippage && focused !== 'input'}
            onFocus={() => {
              setFocused('button');
            }}
            onBlur={() => {
              setFocused('');
            }}
            onClick={handleDefaultClick}
            focusRipple
          >
            0.5
          </SlippageDefaultButton>
          <SlippageCustomInput
            selected={slippageDefault !== slippage && focused !== 'button'}
            placeholder={focused === 'input' ? '' : t('settings.custom')}
            inputProps={{
              inputMode: 'decimal',
            }}
            onChange={handleInputUpdate}
            onFocus={() => {
              setFocused('input');
            }}
            onBlur={() => {
              setFocused('');
            }}
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
