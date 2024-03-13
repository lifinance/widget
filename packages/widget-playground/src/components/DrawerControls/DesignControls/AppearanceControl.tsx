import type {
  FC,
  PropsWithChildren,
  ReactElement,
  SyntheticEvent,
} from 'react';
import type { TabProps } from '@mui/material';
import { BadgeProps, Box, Tooltip } from '@mui/material';
import BrightnessAutoIcon from '@mui/icons-material/BrightnessAuto';
import LightModeIcon from '@mui/icons-material/LightMode';
import NightlightIcon from '@mui/icons-material/Nightlight';
import type { Appearance } from '@lifi/widget';
import {
  useConfigActions,
  useConfigAppearance,
  useEditToolsActions,
} from '../../../store';
import { ExpandableCard, CardValue } from '../../Card';
import { Tab, Tabs } from '../../Tabs';
import { useThemeToolValues } from '../../../store/editTools/useThemeToolValues';
import { useEffect } from 'react';
import { Badge, CapitalizeFirstLetter } from './DesignControls.style';

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
  ...props
}) => (
  <Tooltip title={title} arrow>
    <Tab icon={Icon} value={value} {...props} disableRipple />
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
  const { setAppearance } = useConfigActions();
  const { setViewportBackgroundColor } = useEditToolsActions();
  const { selectedTheme } = useThemeToolValues();

  const restricted = !!selectedTheme?.options?.restrictAppearance;

  useEffect(() => {
    if (selectedTheme?.options?.restrictAppearance) {
      setAppearance(selectedTheme?.options?.restrictAppearance);
    }
  }, [selectedTheme]);
  const handleAppearanceChange = (_: SyntheticEvent, value: Appearance) => {
    setAppearance(value);
    setViewportBackgroundColor(undefined);
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
          <CapitalizeFirstLetter variant="caption">
            {appearance} appearance is recommended for this theme
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
