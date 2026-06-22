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
  /** Locks the bar while a route is executing, so the active tab can't switch
   * the SDK config (e.g. apiUrl) out from under an in-flight execution. */
  disabled?: boolean
}

/**
 * Presentational header tabs bar shared by split mode and configured
 * navigation tabs.
 * Clears the form fields on switch; the caller supplies the labelled tabs, the
 * active key, and what selecting a key means for its store.
 */
export const HeaderTabs = <K extends string>({
  tabs,
  value,
  onChange,
  disabled,
}: HeaderTabsProps<K>): JSX.Element => {
  const { setFieldValue } = useFieldActions()

  const handleChange = (_: React.SyntheticEvent, key: K) => {
    if (disabled) {
      return
    }
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
          disabled={disabled}
          disableRipple
        />
      ))}
    </NavigationTabs>
  )
}
