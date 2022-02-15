import {
  HelpOutline as HelpOutlineIcon,
  SwapVert as SwapVertIcon,
} from '@mui/icons-material';
import {
  Box,
  Container,
  FormControl,
  MenuItem,
  Typography,
} from '@mui/material';
import { styled } from '@mui/system';
import { useEffect, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Select } from '../components/Select';
import {
  SelectTokenDrawer,
  SelectTokenDrawerBase,
} from '../components/SelectTokenDrawer';
import { SendToRecipientForm } from '../components/SendToRecipientForm';
import { SwapButton } from '../components/SwapButton';
import { SwapChainButton } from '../components/SwapChainButton';
import { SwapInput } from '../components/SwapInput';
import {
  SwapFromInputAdornment,
  SwapToInputAdornment,
} from '../components/SwapInputAdornment';
import { SwapStepper } from '../components/SwapStepper';
import { Switch } from '../components/Switch';
import { SwapFormDirection, SwapFormKey } from '../providers/SwapFormProvider';

const FormContainer = styled(Container)({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  position: 'relative',
});

const FormBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
}));

export const SwapPage: React.FC = () => {
  const { t } = useTranslation();
  const {
    register,
    formState: { isSubmitting },
  } = useFormContext();
  const drawerRef = useRef<SelectTokenDrawerBase>(null);
  const containerRef = useRef<Element>(null);

  const handleChainButton = (type: SwapFormDirection) =>
    drawerRef.current?.openDrawer(type);

  useEffect(() => {
    register(SwapFormKey.FromToken);
    register(SwapFormKey.ToToken);
  }, [register]);

  return (
    <FormContainer maxWidth="sm" disableGutters>
      <FormBox ref={containerRef}>
        <Typography variant="subtitle1" color="text.secondary" mt={2} mb={0.5}>
          {t(`swap.from`)}
        </Typography>
        <Box>
          <SwapChainButton onClick={handleChainButton} type="from" />
          <FormControl variant="standard" disabled={isSubmitting} fullWidth>
            <SwapInput
              type="number"
              size="small"
              defaultValue={0}
              autoComplete="off"
              endAdornment={
                <SwapFromInputAdornment
                  maxAmount={98700.34021}
                  price={1300.0}
                />
              }
              aria-describedby=""
              inputProps={{
                min: 0,
                step: 1e-18,
                'aria-label': '',
                inputMode: 'numeric',
                ...register(SwapFormKey.FromAmount, { required: true }),
              }}
              required
            />
            {/* <FormHelperText id="swap-from-helper-text">Text</FormHelperText> */}
          </FormControl>
        </Box>
        <Box
          sx={{ display: 'flex', justifyContent: 'space-between', height: 40 }}
          my={0.5}
        >
          <Typography
            variant="subtitle1"
            color="text.secondary"
            sx={{ alignSelf: 'end' }}
          >
            {t(`swap.to`)}
          </Typography>
          <SwapVertIcon sx={{ alignSelf: 'center', padding: '0 16px' }} />
        </Box>
        <Box>
          <SwapChainButton onClick={handleChainButton} type="to" />
          <FormControl variant="standard" fullWidth disabled={isSubmitting}>
            <SwapInput
              type="number"
              size="small"
              defaultValue={0}
              autoComplete="off"
              endAdornment={<SwapToInputAdornment price={1300.0} />}
              aria-describedby=""
              inputProps={{
                min: 0,
                step: 1e-18,
                'aria-label': '',
                inputMode: 'numeric',
                ...register(SwapFormKey.ToAmount, { required: true }),
              }}
              required
            />
            {/* <FormHelperText id="swap-to-helper-text">Text</FormHelperText> */}
          </FormControl>
        </Box>
        <Box
          mt={3}
          mb={2}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <HelpOutlineIcon sx={{ color: 'grey.500' }} />
            <Typography
              ml={2}
              variant="subtitle1"
              color="text.primary"
              sx={{ alignSelf: 'end' }}
            >
              {t(`swap.sendToRecipient`)}
            </Typography>
          </Box>
          <Switch {...register(SwapFormKey.IsSendToRecipient)} />
        </Box>
        <SendToRecipientForm />
        <Box
          mb={2}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <HelpOutlineIcon sx={{ color: 'grey.500' }} />
            <Typography
              ml={2}
              variant="subtitle1"
              color="text.primary"
              sx={{ alignSelf: 'end' }}
            >
              {t(`swap.routePriority.title`)}
            </Typography>
          </Box>
          <FormControl sx={{ width: '50%' }}>
            <Select
              defaultValue={1}
              MenuProps={{ elevation: 2 }}
              inputProps={{ ...register(SwapFormKey.RoutePriority) }}
            >
              <MenuItem value={1}>
                {t(`swap.routePriority.recommended`)}
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            justifyContent: 'flex-end',
          }}
        >
          <SwapStepper
            steps={[
              { label: 'CAKE', sublabel: 'on BSC' },
              { label: 'Anyswap', sublabel: 'bridge' },
              { label: 'Solana', sublabel: 'bridge' },
              { label: 'AAVE', sublabel: 'on Polygon' },
            ]}
          />
          <Box
            mt={2}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{ alignSelf: 'end' }}
            >
              {t(`swap.gas`)}
            </Typography>
            <Typography
              ml={2}
              variant="subtitle1"
              color="text.primary"
              sx={{ alignSelf: 'end' }}
            >
              {t(`swap.price`, { value: 20 })}
            </Typography>
          </Box>
          <Box
            mb={2}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{ alignSelf: 'end' }}
            >
              {t(`swap.waitingTime`)}
            </Typography>
            <Typography
              ml={2}
              variant="subtitle1"
              color="text.primary"
              sx={{ alignSelf: 'end' }}
            >
              20 min
            </Typography>
          </Box>
        </Box>
      </FormBox>
      <SwapButton />
      <SelectTokenDrawer containerRef={containerRef} ref={drawerRef} />
    </FormContainer>
  );
};
