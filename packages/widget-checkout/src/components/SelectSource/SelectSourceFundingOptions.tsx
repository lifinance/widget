import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import SyncAltIcon from '@mui/icons-material/SyncAlt'
import { Chip, Stack } from '@mui/material'
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
}

export function SelectSourceFundingOptions({
  onTransferCrypto,
  onDepositCash,
  showDepositCash = true,
}: SelectSourceFundingOptionsProps) {
  return (
    <OptionsRoot>
      <OptionCard onClick={onTransferCrypto}>
        <OptionRow>
          <GenericIconWrap>
            <SwapHorizIcon />
          </GenericIconWrap>
          <OptionTextCell>
            <OptionTitle>Transfer Crypto</OptionTitle>
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
              <OptionTitle>Deposit with Cash</OptionTitle>
            </OptionTextCell>
            <PaymentMarksWrap>
              <PaymentMarkMastercard />
              <PaymentMarkVisa />
            </PaymentMarksWrap>
          </OptionRow>
        </OptionCard>
      ) : null}

      <OptionCardComingSoon
        elevation={0}
        aria-disabled="true"
        aria-label="Connect exchange with Mesh (coming soon)"
      >
        <OptionRow>
          <GenericIconWrap>
            <SyncAltIcon />
          </GenericIconWrap>
          <OptionTextCell>
            <Stack spacing={0.5} alignItems="flex-start">
              <OptionTitle>Connect Exchange</OptionTitle>
              <Chip label="Coming soon" size="small" variant="outlined" />
            </Stack>
          </OptionTextCell>
          <ExchangeAvatarsWrap>
            <ExchangeAvatarCoinbase>C</ExchangeAvatarCoinbase>
            <ExchangeAvatarBinance>B</ExchangeAvatarBinance>
          </ExchangeAvatarsWrap>
        </OptionRow>
      </OptionCardComingSoon>
    </OptionsRoot>
  )
}
