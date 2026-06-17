import type { JSX } from 'react'
import { useTranslation } from 'react-i18next'
import { useSplitModeStore } from '../../stores/settings/useSplitModeStore.js'
import { HeaderTabs } from './HeaderTabs.js'

export const SplitNavigationTabs = (): JSX.Element => {
  const { t } = useTranslation()
  const [state, setState] = useSplitModeStore((state) => [
    state.state,
    state.setState,
  ])

  return (
    <HeaderTabs
      tabs={[
        { key: 'swap', label: t('header.swap') },
        { key: 'bridge', label: t('header.bridge') },
      ]}
      value={state === 'bridge' ? 'bridge' : 'swap'}
      onChange={(key) => setState(key)}
    />
  )
}
