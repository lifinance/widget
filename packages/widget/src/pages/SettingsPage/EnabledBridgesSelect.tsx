import { KeyboardArrowDown as KeyboardArrowDownIcon } from '@mui/icons-material';
import { Box, Chip, FormControl, MenuItem, Skeleton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import shallow from 'zustand/shallow';
import { CardContainer, CardTitle } from '../../components/Card';
import { Select } from '../../components/Select';
import { useTools } from '../../hooks';
import { useSettingsStore } from '../../stores';

export const EnabledBridgesSelect: React.FC = () => {
  const { t } = useTranslation();
  const tools = useTools();
  const [enabledBridges, setTools] = useSettingsStore(
    (state) => [state.enabledBridges, state.setTools],
    shallow,
  );

  return tools?.bridges.length ? (
    <CardContainer>
      <CardTitle>{t(`settings.enabledBridges`)}</CardTitle>
      <FormControl fullWidth>
        <Select
          multiple
          placeholder={t(`settings.selectEnabledBridges`)}
          MenuProps={{ elevation: 2 }}
          IconComponent={KeyboardArrowDownIcon}
          value={enabledBridges ?? []}
          onChange={(event) => {
            if (tools?.bridges) {
              setTools(
                'Bridges',
                event.target.value as string[],
                tools.bridges,
              );
            }
          }}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {(selected as string[]).map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
        >
          {tools?.bridges?.map((bridge) => (
            <MenuItem key={bridge.key} value={bridge.key}>
              {bridge.key}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </CardContainer>
  ) : (
    <Skeleton
      variant="rectangular"
      width="100%"
      height={134}
      sx={{ borderRadius: 1 }}
    />
  );
};
