import { useDevView } from '../../../../hooks';
import {
  useConfig,
  useConfigActions,
  useEditToolsActions,
  useHeaderAndFooterToolValues,
} from '../../../../store';
import { CardRowColumn } from '../../../Card';
import { Switch } from '../../../Switch';
import { ControlContainer, ControlRowContainer } from '../DesignControls.style';

export const HeaderAndFooterControls = () => {
  const { showMockHeader, showMockFooter, isFooterFixed } =
    useHeaderAndFooterToolValues();
  const { setHeaderShow, setFooterShow, setFooterFixed } =
    useEditToolsActions();
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
    if (!checked) {
      setFooterFixed(false);
    }
  };

  const handleFooterFixedChange: (
    _: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => void = (_, checked) => {
    setFooterFixed(checked);
    if (checked) {
      setFooterShow(true);
    }
  };

  const showControls =
    config?.theme?.container?.display === 'flex' &&
    config?.theme?.container?.height === '100%';

  return isDevView && showControls ? (
    <>
      <ControlContainer>
        Show mock header
        <Switch
          checked={showMockHeader}
          onChange={handleShowHideHeaderChange}
          aria-label="Show the mock header"
        />
      </ControlContainer>
      <ControlContainer>
        <CardRowColumn>
          <ControlRowContainer>
            Show mock footer
            <Switch
              checked={showMockFooter}
              onChange={handleShowHideFooterChange}
              aria-label="Show the mock footer"
            />
          </ControlRowContainer>
          <ControlRowContainer sx={{ paddingTop: 0 }}>
            Make footer fixed
            <Switch
              checked={isFooterFixed}
              onChange={handleFooterFixedChange}
              aria-label="Show the mock footer"
            />
          </ControlRowContainer>
        </CardRowColumn>
      </ControlContainer>
    </>
  ) : null;
};
