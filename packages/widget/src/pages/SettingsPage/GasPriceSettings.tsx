import { default as EvStationIcon } from '@mui/icons-material/EvStation';
import { useTranslation } from 'react-i18next';
import { Tab, Tabs } from '../../components/Tabs';
import { useSettingMonitor } from '../../hooks';
import { useSettings, useSettingsStore } from '../../stores';
import { BadgedValue, SettingCardExpandable } from './SettingsCard';

export const GasPriceSettings: React.FC = () => {
  const { t } = useTranslation();
  const setValue = useSettingsStore((state) => state.setValue);
  const { isGasPriceChanged } = useSettingMonitor();
  const { gasPrice } = useSettings(['gasPrice']);

  const handleGasPriceChange = (_: React.SyntheticEvent, gasPrice: string) => {
    setValue('gasPrice', gasPrice);
  };

  return (
    <SettingCardExpandable
      value={
        <BadgedValue badgeColor="info" showBadge={isGasPriceChanged}>
          {t(`settings.gasPrice.${gasPrice}` as any)}
        </BadgedValue>
      }
      icon={<EvStationIcon />}
      title={t(`settings.gasPrice.title`)}
    >
      <Tabs
        value={gasPrice}
        aria-label="tabs"
        indicatorColor="primary"
        onChange={handleGasPriceChange}
        sx={{ mt: 1.5 }}
      >
        <Tab label={t(`settings.gasPrice.slow`)} value="slow" disableRipple />
        <Tab
          label={t(`settings.gasPrice.normal`)}
          value="normal"
          disableRipple
        />
        <Tab label={t(`settings.gasPrice.fast`)} value="fast" disableRipple />
      </Tabs>
    </SettingCardExpandable>
  );
};
