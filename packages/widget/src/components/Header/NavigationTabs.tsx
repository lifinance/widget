import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FormKey } from '../../providers';
import { useSplitSubvariantStore } from '../../stores';
import { HeaderAppBar } from './Header.style';
import { NavbarTab, NavbarTabs } from './NavigationTabs.style';

export const NavigationTabs = () => {
  const { t } = useTranslation();
  const [state, setState] = useSplitSubvariantStore((state) => [
    state.state,
    state.setState,
  ]);
  const { setValue } = useFormContext();
  const handleChange = (_: React.SyntheticEvent, value: number) => {
    setValue(FormKey.FromAmount, '');
    setValue(FormKey.FromToken, '');
    setValue(FormKey.ToToken, '');
    setState(value === 0 ? 'swap' : 'bridge');
  };

  return (
    <HeaderAppBar elevation={0} sx={{ py: 1 }}>
      <NavbarTabs
        value={state === 'swap' ? 0 : 1}
        onChange={handleChange}
        aria-label="tabs"
        indicatorColor="primary"
      >
        <NavbarTab label={t('header.swap')} disableRipple />
        <NavbarTab label={t('header.bridge')} disableRipple />
      </NavbarTabs>
    </HeaderAppBar>
  );
};
