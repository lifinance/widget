import EvStation from '@mui/icons-material/EvStation'
import { useTranslation } from 'react-i18next'
import { CardTabs, Tab } from '../../components/Tabs/Tabs.style'
import { useSettingMonitor } from '../../hooks/useSettingMonitor'
import { useSettings } from '../../stores/settings/useSettings'
import { useSettingsActions } from '../../stores/settings/useSettingsActions'
import { BadgedValue } from './SettingsCard/BadgedValue'
import { SettingCardExpandable } from './SettingsCard/SettingCardExpandable'

export const GasPriceSettings: React.FC = () => {
  const { t } = useTranslation()
  const { setValue } = useSettingsActions()
  const { isGasPriceChanged } = useSettingMonitor()
  const { gasPrice } = useSettings(['gasPrice'])

  const handleGasPriceChange = (_: React.SyntheticEvent, gasPrice: string) => {
    setValue('gasPrice', gasPrice)
  }

  return (
    <SettingCardExpandable
      value={
        <BadgedValue badgeColor="info" showBadge={isGasPriceChanged}>
          {t(`settings.gasPrice.${gasPrice}` as any)}
        </BadgedValue>
      }
      icon={<EvStation />}
      title={t('settings.gasPrice.title')}
    >
      <CardTabs
        value={gasPrice}
        aria-label="tabs"
        indicatorColor="primary"
        onChange={handleGasPriceChange}
        sx={{ mt: 1.5 }}
      >
        <Tab label={t('settings.gasPrice.slow')} value="slow" disableRipple />
        <Tab
          label={t('settings.gasPrice.normal')}
          value="normal"
          disableRipple
        />
        <Tab label={t('settings.gasPrice.fast')} value="fast" disableRipple />
      </CardTabs>
    </SettingCardExpandable>
  )
}
