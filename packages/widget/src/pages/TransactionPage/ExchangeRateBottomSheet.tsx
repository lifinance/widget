import type { ExchangeRateUpdateParams } from '@lifi/sdk';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import { Box, Button, Typography } from '@mui/material';
import Big from 'big.js';
import type { MutableRefObject } from 'react';
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import type { BottomSheetBase } from '../../components/BottomSheet';
import { BottomSheet } from '../../components/BottomSheet';
import { useSetContentHeight } from '../../hooks';
import { formatTokenAmount } from '../../utils';
import { CenterContainer, IconCircle } from './StatusBottomSheet.style';

export interface ExchangeRateBottomSheetBase {
  isOpen(): void;
  open(
    resolver: (value: boolean) => void,
    data: ExchangeRateUpdateParams,
  ): void;
  close(value?: boolean, bottomSheetClose?: boolean): void;
}

interface ExchangeRateBottomSheetProps {
  data?: ExchangeRateUpdateParams;
  onContinue?(): void;
  onCancel?(): void;
}

export const ExchangeRateBottomSheet = forwardRef<
  ExchangeRateBottomSheetBase,
  ExchangeRateBottomSheetProps
>(({ onContinue, onCancel }, ref) => {
  const [data, setData] = useState<ExchangeRateUpdateParams>();
  const bottomSheetRef = useRef<BottomSheetBase>(null);
  const resolverRef = useRef<(value: boolean) => void>();

  const handleContinue = () => {
    (ref as MutableRefObject<ExchangeRateBottomSheetBase>).current?.close(true);
    onContinue?.();
  };

  const handleCancel = useCallback(() => {
    (ref as MutableRefObject<ExchangeRateBottomSheetBase>).current?.close(
      false,
    );
    onCancel?.();
  }, [onCancel, ref]);

  const handleClose = useCallback(() => {
    (ref as MutableRefObject<ExchangeRateBottomSheetBase>).current?.close(
      false,
      false,
    );
    onCancel?.();
  }, [onCancel, ref]);

  useImperativeHandle(
    ref,
    () => ({
      isOpen: () => bottomSheetRef.current?.isOpen(),
      open: (resolver, data) => {
        setData(data);
        resolverRef.current = resolver;
        bottomSheetRef.current?.open();
      },
      close: (value = false, bottomSheetClose = true) => {
        resolverRef.current?.(value);
        if (bottomSheetClose) {
          bottomSheetRef.current?.close();
        }
      },
    }),
    [],
  );

  return (
    <BottomSheet ref={bottomSheetRef} onClose={handleClose}>
      <ExchangeRateBottomSheetContent
        data={data}
        onContinue={handleContinue}
        onCancel={handleCancel}
      />
    </BottomSheet>
  );
});

const ExchangeRateBottomSheetContent: React.FC<
  ExchangeRateBottomSheetProps
> = ({ data, onCancel, onContinue }) => {
  const { t } = useTranslation();
  const ref = useRef<HTMLElement>();
  useSetContentHeight(ref);

  const oldAmount = Big(data?.oldToAmount || 1);
  return (
    <Box p={3} ref={ref}>
      <CenterContainer>
        <IconCircle status="warning" mb={1}>
          <WarningRoundedIcon color="warning" />
        </IconCircle>
        <Typography py={1} fontSize={18} fontWeight={700}>
          {t('warning.title.rateChanged')}
        </Typography>
      </CenterContainer>
      <Typography py={1}>{t('warning.message.rateChanged')}</Typography>
      <Box display="flex" justifyContent="space-between" mt={1}>
        <Typography>{t('main.quotedAmount')}</Typography>
        <Typography fontWeight={600}>
          {t('format.number', {
            value: formatTokenAmount(
              data?.oldToAmount,
              data?.toToken.decimals,
              5,
            ),
          })}{' '}
          {data?.toToken.symbol}
        </Typography>
      </Box>
      <Box display="flex" justifyContent="space-between" mt={0.25}>
        <Typography>{t('main.currentAmount')}</Typography>
        <Typography fontWeight={600}>
          {t('format.number', {
            value: formatTokenAmount(
              data?.newToAmount,
              data?.toToken.decimals,
              5,
            ),
          })}{' '}
          {data?.toToken.symbol}
        </Typography>
      </Box>
      <Box display="flex" justifyContent="space-between" mt={0.25}>
        <Typography>{t('main.rateChange')}</Typography>
        <Typography fontWeight={600}>
          {Big(data?.newToAmount || 0)
            .div(oldAmount.eq(0) ? Big(1) : oldAmount)
            .minus(1)
            .mul(100)
            .round(2, Big.roundUp)
            .toString()}
          %
        </Typography>
      </Box>
      <Box display="flex" mt={3}>
        <Button variant="text" onClick={onCancel} fullWidth>
          {t('button.cancel')}
        </Button>
        <Box display="flex" p={1} />
        <Button variant="contained" onClick={onContinue} fullWidth>
          {t('button.continue')}
        </Button>
      </Box>
    </Box>
  );
};
