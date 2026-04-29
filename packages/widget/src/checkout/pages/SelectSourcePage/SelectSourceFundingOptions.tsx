import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import SyncAltIcon from '@mui/icons-material/SyncAlt'
import { Alert, Chip, CircularProgress, Stack } from '@mui/material'
import { useTranslation } from 'react-i18next'
import {
  ChainAvatarGroup,
  ExchangeAvatarBinance,
  ExchangeAvatarCoinbase,
  ExchangeAvatarsWrap,
  GenericIconWrap,
  OptionCard,
  OptionCardComingSoon,
  OptionRow,
  OptionsRoot,
  OptionTextCell,
  OptionTitle,
  PaymentMarkMastercard,
  PaymentMarksWrap,
  PaymentMarkVisa,
  TransferAvatarBase,
  TransferAvatarEth,
  TransferAvatarOp,
  TransferAvatarPoly,
} from './SelectSourceFundingOptions.style.js'

export type SelectSourceFundingOptionsProps = {
  onTransferCrypto: () => void
  onDepositCash: () => void
  /** When false, the cash on-ramp row is hidden (optional peer not installed). */
  showDepositCash?: boolean
  onConnectExchange: () => void
  /** When true, removes "Coming Soon" chip and enables the card click. */
  showConnectExchange?: boolean
  /** When true, shows a loading spinner in place of exchange avatars. */
  meshLoading?: boolean
  /** When set, shows an inline error below the exchange card. */
  meshError?: string | null
}

export function SelectSourceFundingOptions({
  onTransferCrypto,
  onDepositCash,
  showDepositCash = true,
  onConnectExchange,
  showConnectExchange = false,
  meshLoading = false,
  meshError = null,
}: SelectSourceFundingOptionsProps) {
  const { t } = useTranslation()
  return (
    <OptionsRoot>
      <OptionCard onClick={onTransferCrypto}>
        <OptionRow>
          <GenericIconWrap>
            <SwapHorizIcon />
          </GenericIconWrap>
          <OptionTextCell>
            <OptionTitle>{t('checkout.transferCrypto')}</OptionTitle>
          </OptionTextCell>
          <ChainAvatarGroup max={4}>
            <TransferAvatarEth>Ξ</TransferAvatarEth>
            <TransferAvatarBase>C</TransferAvatarBase>
            <TransferAvatarPoly>P</TransferAvatarPoly>
            <TransferAvatarOp>O</TransferAvatarOp>
          </ChainAvatarGroup>
        </OptionRow>
      </OptionCard>

      {showDepositCash ? (
        <OptionCard onClick={onDepositCash}>
          <OptionRow>
            <GenericIconWrap>
              <AttachMoneyIcon />
            </GenericIconWrap>
            <OptionTextCell>
              <OptionTitle>{t('checkout.depositWithCash')}</OptionTitle>
            </OptionTextCell>
            <PaymentMarksWrap>
              <PaymentMarkMastercard />
              <PaymentMarkVisa />
            </PaymentMarksWrap>
          </OptionRow>
        </OptionCard>
      ) : null}

      {showConnectExchange ? (
        <>
          <OptionCard
            onClick={meshLoading ? undefined : onConnectExchange}
            aria-disabled={meshLoading}
            sx={
              meshLoading ? { pointerEvents: 'none', opacity: 0.7 } : undefined
            }
          >
            <OptionRow>
              <GenericIconWrap>
                <SyncAltIcon />
              </GenericIconWrap>
              <OptionTextCell>
                <OptionTitle>{t('checkout.connectExchange')}</OptionTitle>
              </OptionTextCell>
              {meshLoading ? (
                <CircularProgress size={24} sx={{ flexShrink: 0, mr: 1 }} />
              ) : (
                <ExchangeAvatarsWrap>
                  <ExchangeAvatarCoinbase>C</ExchangeAvatarCoinbase>
                  <ExchangeAvatarBinance>B</ExchangeAvatarBinance>
                </ExchangeAvatarsWrap>
              )}
            </OptionRow>
          </OptionCard>
          {meshError ? (
            <Alert severity="error" sx={{ mt: -0.5 }}>
              {meshError}
            </Alert>
          ) : null}
        </>
      ) : (
        <OptionCardComingSoon
          elevation={0}
          aria-disabled="true"
          aria-label={t('checkout.meshAriaLabel')}
        >
          <OptionRow>
            <GenericIconWrap>
              <SyncAltIcon />
            </GenericIconWrap>
            <OptionTextCell>
              <Stack spacing={0.5} sx={{ alignItems: 'flex-start' }}>
                <OptionTitle>{t('checkout.connectExchange')}</OptionTitle>
                <Chip
                  label={t('checkout.comingSoon')}
                  size="small"
                  variant="outlined"
                />
              </Stack>
            </OptionTextCell>
            <ExchangeAvatarsWrap>
              <ExchangeAvatarCoinbase>C</ExchangeAvatarCoinbase>
              <ExchangeAvatarBinance>B</ExchangeAvatarBinance>
            </ExchangeAvatarsWrap>
          </OptionRow>
        </OptionCardComingSoon>
      )}
    </OptionsRoot>
  )
}
