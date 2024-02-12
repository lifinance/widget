import { SearchOff } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAvailableChains } from '../../hooks/useAvailableChains.js';
import type { FormTypeProps } from '../../stores/form/types.js';
import { FormKeyHelper } from '../../stores/form/types.js';
import { useFieldValues } from '../../stores/form/useFieldValues.js';

export const TokenNotFound: React.FC<FormTypeProps> = ({ formType }) => {
  const { t } = useTranslation();
  const [selectedChainId] = useFieldValues(FormKeyHelper.getChainKey(formType));
  const { getChainById } = useAvailableChains();
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        flex: 1,
        padding: 3,
      }}
    >
      <Typography fontSize={48} lineHeight={1}>
        <SearchOff fontSize="inherit" />
      </Typography>
      <Typography
        fontSize={14}
        color="text.secondary"
        textAlign="center"
        mt={2}
        px={2}
      >
        {t('info.message.emptyTokenList', {
          chainName: getChainById(selectedChainId)?.name,
        })}
      </Typography>
    </Box>
  );
};
