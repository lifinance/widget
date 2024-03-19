import type {
  FC,
  PropsWithChildren,
  ReactElement,
  SyntheticEvent,
} from 'react';
import { useEffect } from 'react';
import type { TabProps } from '@mui/material';
import { Box, Tooltip } from '@mui/material';
import BrightnessAutoIcon from '@mui/icons-material/BrightnessAuto';
import LightModeIcon from '@mui/icons-material/LightMode';
import NightlightIcon from '@mui/icons-material/Nightlight';
import type { Appearance } from '@lifi/widget';
import {
  useConfigActions,
  useConfigAppearance,
  useEditToolsActions,
  useThemeValues,
} from '../../../store';
import { ExpandableCard, CardValue } from '../../Card';
import { Tab, Tabs } from '../../Tabs';
import { Badge, CapitalizeFirstLetter } from './DesignControls.style';
import { useThemeMode } from '../../../hooks';

const appearanceIcons = {
  light: LightModeIcon,
  dark: NightlightIcon,
  auto: BrightnessAutoIcon,
};

interface AppearanceTabProps extends TabProps {
  title: string;
  value: Appearance;
  Icon: ReactElement;
}

const AppearanceTab: FC<AppearanceTabProps> = ({
  title,
  value,
  Icon,
  disabled,
  ...props
}) =>
  disabled ? (
    <Tab icon={Icon} value={value} {...props} />
  ) : (
    <Tooltip title={title} arrow>
      <Tab icon={Icon} value={value} {...props} />
    </Tooltip>
  );

interface BadgableCardValueProps extends PropsWithChildren {
  showBadge: boolean;
}

const BadgableCardValue = ({ children, showBadge }: BadgableCardValueProps) => {
  return showBadge ? (
    <Badge variant="dot" color="primary">
      <CardValue sx={{ textTransform: 'capitalize' }}>{children}</CardValue>
    </Badge>
  ) : (
    <CardValue sx={{ textTransform: 'capitalize' }}>{children}</CardValue>
  );
};

export const AppearanceControl = () => {
  const { appearance } = useConfigAppearance();
  const themeMode = useThemeMode();
  const { setAppearance, setConfigTheme } = useConfigActions();
  const { setViewportBackgroundColor } = useEditToolsActions();
  const { selectedTheme } = useThemeValues();

  const restricted = !!(
    selectedTheme && Object.keys(selectedTheme.theme).length < 2
  );

  useEffect(() => {
    if (restricted) {
      setAppearance(Object.keys(selectedTheme.theme)[0] as Appearance);
    }
  }, [selectedTheme, setAppearance, restricted]);
  const handleAppearanceChange = (_: SyntheticEvent, value: Appearance) => {
    setAppearance(value);

    if (selectedTheme) {
      const themeForAppearance = value === 'auto' ? themeMode : value;
      setConfigTheme(selectedTheme.theme[themeForAppearance], selectedTheme.id);
      setViewportBackgroundColor(
        selectedTheme.theme[themeForAppearance]?.playground?.background as
          | string
          | undefined,
      );
    }
  };

  return (
    <ExpandableCard
      title={'Mode'}
      value={
        <BadgableCardValue showBadge={restricted}>
          {appearance}
        </BadgableCardValue>
      }
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {restricted ? (
          <CapitalizeFirstLetter variant="caption" sx={{ paddingLeft: 1 }}>
            {appearance} mode is recommended for this theme
          </CapitalizeFirstLetter>
        ) : null}

        <Tabs
          value={appearance}
          aria-label="tabs"
          indicatorColor="primary"
          onChange={handleAppearanceChange}
        >
          {Object.entries(appearanceIcons).map(([appearance, Icon]) => {
            const supportedAppearance = appearance as Appearance;

            return (
              <AppearanceTab
                key={supportedAppearance}
                title={supportedAppearance}
                value={supportedAppearance}
                Icon={<Icon />}
                disabled={restricted}
              />
            );
          })}
        </Tabs>
      </Box>
    </ExpandableCard>
  );
};
