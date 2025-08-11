import { useTranslation } from 'react-i18next'
import { useFieldActions } from '../../stores/form/useFieldActions.js'
import { useSplitSubvariantStore } from '../../stores/settings/useSplitSubvariantStore.js'
import { NavigationTab, NavigationTabs } from '../Tabs/NavigationTabs.js'

export const SplitNavigationTabs = () => {
  const { t } = useTranslation()
  const [state, setState] = useSplitSubvariantStore((state) => [
    state.state,
    state.setState,
  ])

  const { setFieldValue } = useFieldActions()
  const handleChange = (_: React.SyntheticEvent, value: number) => {
    setFieldValue('fromAmount', '')
    setFieldValue('fromToken', '')
    setFieldValue('toToken', '')
    setState(value === 0 ? 'swap' : 'bridge')
  }

  return (
    <NavigationTabs
      value={state === 'swap' ? 0 : 1}
      onChange={handleChange}
      aria-label="tabs"
    >
      <NavigationTab label={t('header.swap')} disableRipple />
      <NavigationTab label={t('header.bridge')} disableRipple />
    </NavigationTabs>
  )
}
