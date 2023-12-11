import { useTranslation } from 'react-i18next';
import { FormKey } from '../../providers';
import { useSplitSubvariantStore, useFormStore } from '../../stores';
import { HeaderAppBar, SplitTabs } from './Header.style';
import { Tab } from '../Tabs';

export const NavigationTabs = () => {
  const { t } = useTranslation();
  const [state, setState] = useSplitSubvariantStore((state) => [
    state.state,
    state.setState,
  ]);

  const { setFieldValue } = useFormStore();
  const handleChange = (_: React.SyntheticEvent, value: number) => {
    setFieldValue(FormKey.FromAmount, '');
    setFieldValue(FormKey.FromToken, '');
    setFieldValue(FormKey.ToToken, '');
    setState(value === 0 ? 'swap' : 'bridge');
  };

  return (
    <HeaderAppBar elevation={0} sx={{ py: 1 }}>
      <SplitTabs
        value={state === 'swap' ? 0 : 1}
        onChange={handleChange}
        aria-label="tabs"
        indicatorColor="primary"
      >
        <Tab label={t('header.swap')} disableRipple />
        <Tab label={t('header.bridge')} disableRipple />
      </SplitTabs>
    </HeaderAppBar>
  );
};
