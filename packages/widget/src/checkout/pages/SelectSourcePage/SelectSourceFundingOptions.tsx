import type { Account } from '@lifi/widget-provider'
import AccountBalance from '@mui/icons-material/AccountBalance'
import AccountBalanceWallet from '@mui/icons-material/AccountBalanceWallet'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import QrCode2Icon from '@mui/icons-material/QrCode2'
import {
  Alert,
  Avatar,
  Box,
  Chip,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material'
import type { JSX } from 'react'
import { useTranslation } from 'react-i18next'
import { shortenAddress } from '../../../utils/wallet.js'
import { CheckoutDisconnectIconButton } from '../../components/CheckoutDisconnectIconButton.js'
import { fundingSourceImages } from './fundingSourceAssets.js'
import {
  FundingDividerLine,
  FundingDividerRow,
  FundingOptionCard,
  FundingOptionCardDisabled,
  FundingOptionRow,
  FundingOptionSubtitle,
  FundingOptionTitle,
  FundingOrLabel,
  FundingSectionLabel,
  FundingSectionStack,
  GenericIconWrap,
  OptionsRoot,
  OptionTextCell,
  OverflowPreviewAvatar,
  OverlapRow,
  PaymentBrandImg,
  PaymentMarksWrap,
  PreviewWalletAvatar,
} from './SelectSourceFundingOptions.style.js'

export type PayFromWalletConnectedSummary = {
  address: string
  icon?: string
  walletName?: string
}

export type PayFromWalletPreviewIcon = {
  key: string
  src: string
}

export type SelectSourceFundingOptionsProps = {
  onPayFromWallet: () => void
  onTransferCrypto: () => void
  onDepositCash: () => void
  /** When false, cash card is visible but not interactive (e.g. Transak not configured). */
  depositCashEnabled: boolean
  /** When true, cash card shows a non-interactive loading state. */
  depositCashResolutionLoading?: boolean
  onConnectExchange: () => void
  /** When true, removes "Coming Soon" chip and enables the card click. */
  showConnectExchange?: boolean
  /** When true, shows a loading spinner in place of exchange avatars. */
  meshLoading?: boolean
  /** When set, shows an inline error below the exchange card. */
  meshError?: string | null
  payFromWalletIcons: PayFromWalletPreviewIcon[]
  payFromWalletOverflow: number
  /** When set, replaces the disconnected “browser wallets” teaser with wallet + address (connected state). */
  payFromWalletConnected?: PayFromWalletConnectedSummary | null
  /** Same account as `payFromWalletConnected`; used for disconnect. */
  payFromWalletAccount?: Account | null
}

export function SelectSourceFundingOptions({
  onPayFromWallet,
  onTransferCrypto,
  onDepositCash,
  depositCashEnabled,
  depositCashResolutionLoading = false,
  onConnectExchange,
  showConnectExchange = false,
  meshLoading = false,
  meshError = null,
  payFromWalletIcons,
  payFromWalletOverflow,
  payFromWalletConnected = null,
  payFromWalletAccount = null,
}: SelectSourceFundingOptionsProps): JSX.Element {
  const { t } = useTranslation()

  const cashInteractive = depositCashEnabled && !depositCashResolutionLoading

  return (
    <OptionsRoot>
      <FundingSectionStack>
        <FundingSectionLabel>{t('checkout.useYourTokens')}</FundingSectionLabel>

        <Stack spacing={1.5} sx={{ width: '100%' }}>
          <FundingOptionCard onClick={onPayFromWallet} elevation={0}>
            <FundingOptionRow
              sx={payFromWalletConnected ? { alignItems: 'center' } : undefined}
            >
              {payFromWalletConnected ? (
                <>
                  <Avatar
                    src={payFromWalletConnected.icon}
                    alt=""
                    sx={(theme) => ({
                      width: 40,
                      height: 40,
                      flexShrink: 0,
                      bgcolor: theme.vars.palette.action.hover,
                      fontSize: 16,
                      fontWeight: 700,
                    })}
                  >
                    {!payFromWalletConnected.icon ? (
                      <AccountBalanceWallet sx={{ fontSize: 22 }} aria-hidden />
                    ) : null}
                  </Avatar>
                  <OptionTextCell>
                    <FundingOptionTitle>
                      {t('checkout.payFromWallet')}
                    </FundingOptionTitle>
                    <FundingOptionSubtitle noWrap>
                      {shortenAddress(payFromWalletConnected.address) ??
                        payFromWalletConnected.address}
                    </FundingOptionSubtitle>
                  </OptionTextCell>
                  <Box
                    sx={{
                      display: 'flex',
                      flexShrink: 0,
                      alignItems: 'center',
                      gap: 0.75,
                    }}
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontWeight: 400,
                        lineHeight: '20px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {t('tags.connected')}
                    </Typography>
                    {payFromWalletAccount ? (
                      <CheckoutDisconnectIconButton
                        account={payFromWalletAccount}
                      />
                    ) : null}
                  </Box>
                </>
              ) : (
                <>
                  <GenericIconWrap>
                    <AccountBalanceWallet />
                  </GenericIconWrap>
                  <OptionTextCell>
                    <FundingOptionTitle>
                      {t('checkout.payFromWallet')}
                    </FundingOptionTitle>
                    <FundingOptionSubtitle>
                      {t('checkout.payFromWalletSubtitle')}
                    </FundingOptionSubtitle>
                  </OptionTextCell>
                  <OverlapRow aria-hidden>
                    {payFromWalletIcons.map((item) => (
                      <PreviewWalletAvatar
                        key={item.key}
                        src={item.src}
                        alt=""
                      />
                    ))}
                    {payFromWalletOverflow > 0 ? (
                      <OverflowPreviewAvatar>
                        {`${Math.min(payFromWalletOverflow, 99)}+`}
                      </OverflowPreviewAvatar>
                    ) : null}
                  </OverlapRow>
                </>
              )}
            </FundingOptionRow>
          </FundingOptionCard>

          <FundingOptionCard onClick={onTransferCrypto} elevation={0}>
            <FundingOptionRow>
              <GenericIconWrap>
                <QrCode2Icon />
              </GenericIconWrap>
              <OptionTextCell>
                <FundingOptionTitle>
                  {t('checkout.transferCrypto')}
                </FundingOptionTitle>
                <FundingOptionSubtitle>
                  {t('checkout.transferCryptoSubtitle')}
                </FundingOptionSubtitle>
              </OptionTextCell>
              <OverlapRow aria-hidden>
                <PreviewWalletAvatar
                  src={fundingSourceImages.tokenEth}
                  alt="ETH"
                />
                <PreviewWalletAvatar
                  src={fundingSourceImages.tokenUsdc}
                  alt="USDC"
                />
                <PreviewWalletAvatar
                  src={fundingSourceImages.tokenMatic}
                  alt="MATIC"
                />
                <OverflowPreviewAvatar>99+</OverflowPreviewAvatar>
              </OverlapRow>
            </FundingOptionRow>
          </FundingOptionCard>

          {showConnectExchange ? (
            <>
              <FundingOptionCard
                onClick={meshLoading ? undefined : onConnectExchange}
                elevation={0}
                aria-disabled={meshLoading}
                sx={
                  meshLoading
                    ? { pointerEvents: 'none', opacity: 0.7 }
                    : undefined
                }
              >
                <FundingOptionRow>
                  <GenericIconWrap>
                    <AccountBalance />
                  </GenericIconWrap>
                  <OptionTextCell>
                    <FundingOptionTitle>
                      {t('checkout.connectExchange')}
                    </FundingOptionTitle>
                    <FundingOptionSubtitle>
                      {t('checkout.connectExchangeSubtitle')}
                    </FundingOptionSubtitle>
                  </OptionTextCell>
                  {meshLoading ? (
                    <CircularProgress size={24} sx={{ flexShrink: 0, mr: 1 }} />
                  ) : (
                    <OverlapRow aria-hidden>
                      <Avatar
                        src={fundingSourceImages.exchangeCoinbase}
                        alt="Coinbase"
                        sx={(theme) => ({
                          width: 24,
                          height: 24,
                          border: `2px solid ${theme.vars.palette.background.paper}`,
                        })}
                      />
                      <Avatar
                        src={fundingSourceImages.exchangeBinance}
                        alt="Binance"
                        sx={(theme) => ({
                          width: 24,
                          height: 24,
                          border: `2px solid ${theme.vars.palette.background.paper}`,
                        })}
                      />
                      <OverflowPreviewAvatar>10+</OverflowPreviewAvatar>
                    </OverlapRow>
                  )}
                </FundingOptionRow>
              </FundingOptionCard>
              {meshError ? (
                <Alert severity="error" sx={{ mt: -0.5 }}>
                  {meshError}
                </Alert>
              ) : null}
            </>
          ) : (
            <FundingOptionCardDisabled elevation={0} aria-disabled="true">
              <FundingOptionRow>
                <GenericIconWrap>
                  <AccountBalance />
                </GenericIconWrap>
                <OptionTextCell>
                  <Stack spacing={0.5} sx={{ alignItems: 'flex-start' }}>
                    <FundingOptionTitle>
                      {t('checkout.connectExchange')}
                    </FundingOptionTitle>
                    <FundingOptionSubtitle>
                      {t('checkout.connectExchangeSubtitle')}
                    </FundingOptionSubtitle>
                    <Chip
                      label={t('checkout.comingSoon')}
                      size="small"
                      variant="outlined"
                      sx={{ mt: 0.25 }}
                    />
                  </Stack>
                </OptionTextCell>
                <OverlapRow aria-hidden>
                  <Avatar
                    src={fundingSourceImages.exchangeCoinbase}
                    alt="Coinbase"
                    sx={(theme) => ({
                      width: 24,
                      height: 24,
                      border: `2px solid ${theme.vars.palette.background.paper}`,
                    })}
                  />
                  <Avatar
                    src={fundingSourceImages.exchangeBinance}
                    alt="Binance"
                    sx={(theme) => ({
                      width: 24,
                      height: 24,
                      border: `2px solid ${theme.vars.palette.background.paper}`,
                    })}
                  />
                  <OverflowPreviewAvatar>10+</OverflowPreviewAvatar>
                </OverlapRow>
              </FundingOptionRow>
            </FundingOptionCardDisabled>
          )}
        </Stack>
      </FundingSectionStack>

      <FundingDividerRow>
        <FundingDividerLine />
        <FundingOrLabel>{t('checkout.or')}</FundingOrLabel>
        <FundingDividerLine />
      </FundingDividerRow>

      <FundingSectionStack>
        <FundingSectionLabel>{t('checkout.buyTokens')}</FundingSectionLabel>
        <FundingOptionCard
          onClick={cashInteractive ? onDepositCash : undefined}
          elevation={0}
          aria-disabled={!cashInteractive}
          sx={
            !cashInteractive
              ? {
                  opacity: depositCashResolutionLoading ? 0.65 : 0.5,
                  cursor: 'default',
                  pointerEvents: 'none',
                }
              : undefined
          }
        >
          <FundingOptionRow>
            <GenericIconWrap>
              {depositCashResolutionLoading ? (
                <CircularProgress size={22} />
              ) : (
                <CreditCardIcon />
              )}
            </GenericIconWrap>
            <OptionTextCell>
              <FundingOptionTitle>
                {t('checkout.depositWithCash')}
              </FundingOptionTitle>
              <FundingOptionSubtitle>
                {t('checkout.depositWithCashSubtitle')}
              </FundingOptionSubtitle>
            </OptionTextCell>
            <PaymentMarksWrap>
              <PaymentBrandImg
                src={fundingSourceImages.mastercard}
                alt="Mastercard"
              />
              <PaymentBrandImg src={fundingSourceImages.visa} alt="Visa" />
            </PaymentMarksWrap>
          </FundingOptionRow>
        </FundingOptionCard>
      </FundingSectionStack>
    </OptionsRoot>
  )
}
