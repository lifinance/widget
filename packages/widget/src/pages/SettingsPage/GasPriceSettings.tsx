import EvStationIcon from '@mui/icons-material/EvStation';
import { useTranslation } from 'react-i18next';
import { useSettings, useSettingsStore } from '../../stores';
import { Tab, Tabs } from '../../components/Tabs';
import {
  BadgedAdditionalInformation,
  SettingCardExpandable,
} from './SettingsPage.style';
import { useSettingMonitor } from '../../hooks';

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
      additionalInfo={
        <BadgedAdditionalInformation
          badgeColor="info"
          showBadge={isGasPriceChanged}
        >
          {t(`settings.gasPrice.${gasPrice}` as any)}
        </BadgedAdditionalInformation>
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
        <Tab label={t(`settings.gasPrice.slow`)} value="slow" />
        <Tab label={t(`settings.gasPrice.normal`)} value="normal" />
        <Tab label={t(`settings.gasPrice.fast`)} value="fast" />
      </Tabs>
    </SettingCardExpandable>
  );
};
