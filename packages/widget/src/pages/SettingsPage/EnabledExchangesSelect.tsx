import { KeyboardArrowDown as KeyboardArrowDownIcon } from '@mui/icons-material';
import { Box, Chip, FormControl, MenuItem, Skeleton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import shallow from 'zustand/shallow';
import { CardContainer, CardTitle } from '../../components/Card';
import { Select } from '../../components/Select';
import { useTools } from '../../hooks';
import { useSettingsStore } from '../../stores';

export const EnabledExchangesSelect: React.FC = () => {
  const { t } = useTranslation();
  const { tools, formattedTools } = useTools();
  const [enabledExchanges, setTools] = useSettingsStore(
    (state) => [state.enabledExchanges, state.setTools],
    shallow,
  );

  return tools?.exchanges.length ? (
    <CardContainer>
      <CardTitle>{t(`settings.enabledExchanges`)}</CardTitle>
      <FormControl fullWidth>
        <Select
          multiple
          placeholder={t(`settings.selectEnabledExchanges`)}
          value={enabledExchanges ?? []}
          onChange={(event) => {
            if (tools?.exchanges) {
              setTools(
                'Exchanges',
                event.target.value as string[],
                tools.exchanges,
              );
            }
          }}
          MenuProps={{ elevation: 2 }}
          IconComponent={KeyboardArrowDownIcon}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {(selected as string[]).map((value) => (
                <Chip
                  key={value}
                  label={formattedTools?.exchanges[value]?.name ?? value}
                />
              ))}
            </Box>
          )}
        >
          {tools?.exchanges.map((exchange) => (
            <MenuItem key={exchange.key} value={exchange.key}>
              {exchange.key}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </CardContainer>
  ) : (
    <Skeleton
      variant="rectangular"
      width="100%"
      height={206}
      sx={{ borderRadius: 1 }}
    />
  );
};
