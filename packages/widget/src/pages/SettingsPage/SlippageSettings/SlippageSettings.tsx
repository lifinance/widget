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
  SlippageLimitsWarningContainer,
} from './SlippageSettings.style';
import { Box, Typography } from '@mui/material';
import { SettingCardExpandable, BadgedValue } from '../SettingsCard';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';

const slippageDefault = '0.5';

export const SlippageSettings: React.FC = () => {
  const { t } = useTranslation();
  const { isSlippageOutsideRecommendedLimits, isSlippageChanged } =
    useSettingMonitor();
  const { slippage } = useSettings(['slippage']);
  const setValue = useSettingsStore((state) => state.setValue);
  const defaultValue = useRef(slippage);
  const [focused, setFocused] = useState<'input' | 'button' | undefined>();

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
      value={
        <BadgedValue
          badgeColor={badgeColor}
          showBadge={!!badgeColor}
        >{`${slippage}%`}</BadgedValue>
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
              setFocused(undefined);
            }}
            onClick={handleDefaultClick}
            disableRipple
          >
            {slippageDefault}
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
              setFocused(undefined);
            }}
            value={customInputValue}
            autoComplete="off"
          />
        </SettingsFieldSet>
        {isSlippageOutsideRecommendedLimits && (
          <SlippageLimitsWarningContainer>
            <WarningRoundedIcon color="warning" />
            <Typography fontSize={13} fontWeight={400}>
              {t('warning.message.slippageOutsideRecommendedLimits')}
            </Typography>
          </SlippageLimitsWarningContainer>
        )}
      </Box>
    </SettingCardExpandable>
  );
};
