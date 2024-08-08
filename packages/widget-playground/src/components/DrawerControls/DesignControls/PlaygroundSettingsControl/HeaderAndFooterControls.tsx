import { useDevView } from '../../../../hooks';
import {
  useConfig,
  useConfigActions,
  useEditToolsActions,
  useHeaderAndFooterToolValues,
} from '../../../../store';
import { Switch } from '../../../Switch';
import { ColorSelectorContainer } from '../DesignControls.style';

export const HeaderAndFooterControls = () => {
  const { showMockHeader, showMockFooter } = useHeaderAndFooterToolValues();
  const { setHeaderShow, setFooterShow } = useEditToolsActions();
  const { setHeader } = useConfigActions();

  const { config } = useConfig();
  const { isDevView } = useDevView();

  const handleShowHideHeaderChange: (
    _: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => void = (_, checked) => {
    setHeaderShow(checked);

    if (config?.theme?.header?.position === 'fixed') {
      setHeader({ position: 'fixed', top: checked ? 48 : 0 });
    }
  };

  const handleShowHideFooterChange: (
    _: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => void = (_, checked) => {
    setFooterShow(checked);
  };

  const showControls =
    config?.theme?.container?.display === 'flex' &&
    config?.theme?.container?.height === '100%';

  return isDevView && showControls ? (
    <>
      <ColorSelectorContainer sx={{ marginTop: 1 }}>
        Show mock header
        <Switch
          checked={showMockHeader}
          onChange={handleShowHideHeaderChange}
          aria-label="Show the mock header"
        />
      </ColorSelectorContainer>
      <ColorSelectorContainer sx={{ marginTop: 1 }}>
        Show mock footer
        <Switch
          checked={showMockFooter}
          onChange={handleShowHideFooterChange}
          aria-label="Show the mock footer"
        />
      </ColorSelectorContainer>
    </>
  ) : null;
};
