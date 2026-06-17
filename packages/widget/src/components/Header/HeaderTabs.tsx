import type { JSX } from 'react'
import { useFieldActions } from '../../stores/form/useFieldActions.js'
import { NavigationTab, NavigationTabs } from '../Tabs/NavigationTabs.js'

interface HeaderTab<K extends string> {
  key: K
  label: string
}

interface HeaderTabsProps<K extends string> {
  tabs: HeaderTab<K>[]
  value: K
  onChange: (key: K) => void
}

/**
 * Presentational header tabs bar shared by split mode and the jumper variant.
 * Clears the form fields on switch; the caller supplies the labelled tabs, the
 * active key, and what selecting a key means for its store.
 */
export const HeaderTabs = <K extends string>({
  tabs,
  value,
  onChange,
}: HeaderTabsProps<K>): JSX.Element => {
  const { setFieldValue } = useFieldActions()

  const handleChange = (_: React.SyntheticEvent, key: K) => {
    setFieldValue('fromAmount', '')
    setFieldValue('fromToken', '')
    setFieldValue('toToken', '')
    onChange(key)
  }

  return (
    <NavigationTabs value={value} onChange={handleChange} aria-label="tabs">
      {tabs.map((tab) => (
        <NavigationTab
          key={tab.key}
          value={tab.key}
          label={tab.label}
          disableRipple
        />
      ))}
    </NavigationTabs>
  )
}
