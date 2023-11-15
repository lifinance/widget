import { useState } from 'react';
import { Collapse } from '@mui/material';
import EvStationIcon from '@mui/icons-material/EvStation';
import { useTranslation } from 'react-i18next';
import { useSettings, useSettingsStore } from '../../stores';
import { Tab, Tabs } from '../../components/Tabs';
import {
  SettingCard,
  SettingTitle,
  SettingSummaryButton,
  SettingSummaryText,
} from './SettingsPage.style';

export const GasPriceSettings: React.FC = () => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const setValue = useSettingsStore((state) => state.setValue);
  const { gasPrice } = useSettings(['gasPrice']);

  const toggleExpanded = () => {
    setExpanded((currentExpanded) => !currentExpanded);
  };

  const handleGasPriceChange = (_: React.SyntheticEvent, gasPrice: string) => {
    setValue('gasPrice', gasPrice);
  };

  return (
    <SettingCard>
      <SettingSummaryButton onClick={toggleExpanded} focusRipple>
        <SettingTitle>
          <EvStationIcon />
          <SettingSummaryText>
            {t(`settings.gasPrice.title`)}
          </SettingSummaryText>
        </SettingTitle>
        {!expanded && (
          <SettingSummaryText>
            {t(`settings.gasPrice.${gasPrice}` as any)}
          </SettingSummaryText>
        )}
      </SettingSummaryButton>
      <Collapse in={expanded}>
        <Tabs
          value={gasPrice}
          aria-label="tabs"
          indicatorColor="primary"
          onChange={handleGasPriceChange}
          sx={{ mt: 1.5 }}
        >
          <Tab label={t(`settings.gasPrice.slow`)} value="slow" />
          <Tab label={t(`settings.gasPrice.normal`)} value="normal" />
          <Tab label={t(`settings.gasPrice.fast`)} value="fast" />
        </Tabs>
      </Collapse>
    </SettingCard>
  );
};
