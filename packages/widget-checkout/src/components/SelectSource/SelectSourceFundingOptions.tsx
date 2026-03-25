import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import SyncAltIcon from '@mui/icons-material/SyncAlt'
import {
  ChainAvatarGroup,
  ExchangeAvatarBinance,
  ExchangeAvatarCoinbase,
  ExchangeAvatarsWrap,
  GenericIconWrap,
  OptionCard,
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
  onConnectExchange: () => void
  onDepositCash: () => void
}

export function SelectSourceFundingOptions({
  onTransferCrypto,
  onConnectExchange,
  onDepositCash,
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

      <OptionCard onClick={onConnectExchange}>
        <OptionRow>
          <GenericIconWrap>
            <SyncAltIcon />
          </GenericIconWrap>
          <OptionTextCell>
            <OptionTitle>Connect Exchange</OptionTitle>
          </OptionTextCell>
          <ExchangeAvatarsWrap>
            <ExchangeAvatarCoinbase>C</ExchangeAvatarCoinbase>
            <ExchangeAvatarBinance>B</ExchangeAvatarBinance>
          </ExchangeAvatarsWrap>
        </OptionRow>
      </OptionCard>

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
    </OptionsRoot>
  )
}
