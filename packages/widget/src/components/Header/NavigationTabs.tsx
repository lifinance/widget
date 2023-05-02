import EvStationOutlinedIcon from '@mui/icons-material/EvStationOutlined';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { SwapFormKey } from '../../providers';
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
    setValue(SwapFormKey.FromAmount, '');
    setValue(SwapFormKey.FromToken, '');
    setValue(SwapFormKey.ToToken, '');
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
        <NavbarTab
          icon={<SwapHorizIcon />}
          label={t('header.swap')}
          disableRipple
        />
        <NavbarTab
          label={t('header.bridge')}
          icon={<EvStationOutlinedIcon />}
          disableRipple
        />
      </NavbarTabs>
    </HeaderAppBar>
  );
};
