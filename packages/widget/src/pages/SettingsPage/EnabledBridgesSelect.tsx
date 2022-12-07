import { KeyboardArrowDown as KeyboardArrowDownIcon } from '@mui/icons-material';
import {
  Box,
  Checkbox,
  Chip,
  FormControl,
  MenuItem,
  Skeleton,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import shallow from 'zustand/shallow';
import { Card, CardTitle } from '../../components/Card';
import { Select } from '../../components/Select';
import { useTools } from '../../hooks';
import { useSettingsStore } from '../../stores';

export const EnabledBridgesSelect: React.FC = () => {
  const { t } = useTranslation();
  const { tools, formattedTools } = useTools();
  const [enabledBridges, setTools] = useSettingsStore(
    (state) => [state.enabledBridges, state.setTools],
    shallow,
  );

  return tools?.bridges.length ? (
    <Card>
      <CardTitle>{t(`settings.enabledBridges`)}</CardTitle>
      <FormControl fullWidth>
        <Select
          multiple
          placeholder={t(`settings.selectEnabledBridges`) as string}
          MenuProps={{ elevation: 2, PaperProps: { sx: { maxHeight: 320 } } }}
          IconComponent={KeyboardArrowDownIcon}
          value={enabledBridges ?? []}
          onChange={(event) => {
            setTools('Bridges', event.target.value as string[], tools.bridges);
          }}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {(selected as string[]).map((value) => (
                <Chip
                  key={value}
                  label={formattedTools.bridges?.[value]?.name ?? value}
                />
              ))}
            </Box>
          )}
        >
          {tools.bridges.map((bridge) => (
            <MenuItem
              key={bridge.key}
              value={bridge.key}
              sx={{ paddingTop: 0, paddingBottom: 0 }}
            >
              <Checkbox checked={enabledBridges?.includes(bridge.key)} />
              {bridge.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Card>
  ) : (
    <Skeleton
      variant="rectangular"
      width="100%"
      height={134}
      sx={{ borderRadius: 1 }}
    />
  );
};
