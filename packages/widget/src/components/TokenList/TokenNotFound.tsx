import SearchOffIcon from '@mui/icons-material/SearchOff';
import { Box, Typography } from '@mui/material';
import { useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useChains } from '../../hooks';
import type { FormTypeProps } from '../../providers';
import { FormKeyHelper } from '../../providers';

export const TokenNotFound: React.FC<FormTypeProps> = ({ formType }) => {
  const { t } = useTranslation();
  const [selectedChainId] = useWatch({
    name: [FormKeyHelper.getChainKey(formType)],
  });
  const { getChainById } = useChains();
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
        <SearchOffIcon fontSize="inherit" />
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
