import type { FC, ReactElement, SyntheticEvent } from 'react';
import { Tooltip } from '@mui/material';
import BrightnessAutoIcon from '@mui/icons-material/BrightnessAuto';
import LightModeIcon from '@mui/icons-material/LightMode';
import NightlightIcon from '@mui/icons-material/Nightlight';
import type { Appearance } from '@lifi/widget';
import { useConfigActions, useConfigAppearance } from '../../../store';
import { ExpandableCard, CardValue } from '../../Card';
import { Tab, Tabs } from '../../Tabs';

const appearanceIcons = {
  light: LightModeIcon,
  dark: NightlightIcon,
  auto: BrightnessAutoIcon,
};

interface AppearanceTabProps {
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

export const AppearanceControl = () => {
  const { appearance } = useConfigAppearance();
  const { setAppearance } = useConfigActions();
  const handleAppearanceChange = (_: SyntheticEvent, value: Appearance) => {
    setAppearance(value);
  };

  return (
    <ExpandableCard
      title={'Mode'}
      value={
        <CardValue sx={{ textTransform: 'capitalize' }}>{appearance}</CardValue>
      }
    >
      <Tabs
        value={appearance}
        aria-label="tabs"
        indicatorColor="primary"
        onChange={handleAppearanceChange}
        sx={{ mt: 1 }}
      >
        {Object.entries(appearanceIcons).map(([appearance, Icon]) => {
          const supportedAppearance = appearance as Appearance;

          return (
            <AppearanceTab
              key={supportedAppearance}
              title={supportedAppearance}
              value={supportedAppearance}
              Icon={<Icon />}
            />
          );
        })}
      </Tabs>
    </ExpandableCard>
  );
};
