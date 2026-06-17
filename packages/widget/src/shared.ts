// ─────────────────────────────────────────────────────────────────────────────
// @lifi/widget/shared
//
// Internal surface shared with sibling packages (currently @lifi/widget-checkout).
// These exports are NOT part of the public widget API. They may change in any
// release without notice. Application code must not depend on this subpath.
// ─────────────────────────────────────────────────────────────────────────────

// Propagate widget's MUI theme augmentations (theme.vars, custom palette keys,
// component variants) to any consumer that imports through this subpath.
import type {} from '@mui/material/themeCssVarsAugmentation'
import type {} from './themes/types.js'

// ── components ───────────────────────────────────────────────────────────────
export { ActionRow } from './components/ActionRow/ActionRow.js'
export {
  FormControl,
  Input,
} from './components/AmountInput/AmountInput.style.js'
export { AmountInputEndAdornment } from './components/AmountInput/AmountInputEndAdornment.js'
export { InputPriceButton } from './components/AmountInput/PriceFormHelperText.style.js'
export { AvatarBadgedDefault } from './components/Avatar/Avatar.js'
export { TokenAvatar } from './components/Avatar/TokenAvatar.js'
export { BaseTransactionButton } from './components/BaseTransactionButton/BaseTransactionButton.js'
export type { BottomSheetBase } from './components/BottomSheet/types.js'
export { ButtonTertiary } from './components/ButtonTertiary.js'
export { Card } from './components/Card/Card.js'
export { CardIconButton } from './components/Card/CardIconButton.js'
export { CardTitle } from './components/Card/CardTitle.js'
export { InputCard } from './components/Card/InputCard.js'
export { ChainSelect } from './components/ChainSelect/ChainSelect.js'
export { ChainAvatar } from './components/ChainSelect/ChainSelect.style.js'
export { ContractComponent } from './components/ContractComponent/ContractComponent.js'
export { modalProps } from './components/Dialog/Dialog.js'
export { ExecutionStatusCard } from './components/ExecutionStatusCard/ExecutionStatusCard.js'
export { StatusIcon } from './components/ExecutionStatusCard/StatusIcon.js'
export { FeeBreakdownTooltip } from './components/FeeBreakdownTooltip.js'
export { IconCircle } from './components/IconCircle/IconCircle.js'
export { IconTypography } from './components/IconTypography.js'
export { ListItemButton } from './components/ListItem/ListItemButton.js'
export { WarningMessages } from './components/Messages/WarningMessages.js'
export { PageContainer } from './components/PageContainer.js'
export { PoweredBy } from './components/PoweredBy/PoweredBy.js'
export { ProgressToNextUpdate } from './components/ProgressToNextUpdate.js'
export { RouteCard } from './components/RouteCard/RouteCard.js'
export { RouteCardSkeleton } from './components/RouteCard/RouteCardSkeleton.js'
export { RouteDetails } from './components/RouteCard/RouteDetails.js'
export {
  DetailInfoIcon,
  DetailLabel,
  DetailLabelContainer,
  DetailRow,
  DetailValue,
} from './components/RouteCard/RouteDetails.style.js'
export { RouteNotFoundCard } from './components/RouteCard/RouteNotFoundCard.js'
export { RouteTokens } from './components/RouteCard/RouteTokens.js'
export { SearchInput } from './components/Search/SearchInput.js'
export {
  type ExecutionRow,
  useExecutionRows,
} from './components/StepActions/executionRows.js'
export { SentToWalletRow } from './components/StepActions/SentToWalletRow.js'
export { StepActionsList } from './components/StepActions/StepActionsList.js'
export { Token } from './components/Token/Token.js'
export { TokenNotFound } from './components/TokenList/TokenNotFound.js'
export { useTokenSelect } from './components/TokenList/useTokenSelect.js'
export { VirtualizedTokenList } from './components/TokenList/VirtualizedTokenList.js'
export { TokenRate } from './components/TokenRate/TokenRate.js'
export {
  DateLabelContainer,
  DateLabelText,
} from './components/TransactionCard/TransactionCard.style.js'
// ── hooks ────────────────────────────────────────────────────────────────────
export { useAddressActivity } from './hooks/useAddressActivity.js'
export { useAvailableChains } from './hooks/useAvailableChains.js'
export { useChain } from './hooks/useChain.js'
export { useContactSupport } from './hooks/useContactSupport.js'
export { useDebouncedWatch } from './hooks/useDebouncedWatch.js'
export { useExplorer } from './hooks/useExplorer.js'
export { useHeader } from './hooks/useHeader.js'
export { useListHeight } from './hooks/useListHeight.js'
export { useNavigateBack } from './hooks/useNavigateBack.js'
export { useRouteExecution } from './hooks/useRouteExecution.js'
export { useRouteExecutionMessage } from './hooks/useRouteExecutionMessage.js'
export { useRoutes } from './hooks/useRoutes.js'
export { useGetScrollableContainer } from './hooks/useScrollableContainer.js'
export { useToAddressRequirements } from './hooks/useToAddressRequirements.js'
export { useToken } from './hooks/useToken.js'
export { useTokenAddressBalance } from './hooks/useTokenAddressBalance.js'
export { useTokenBalances } from './hooks/useTokenBalances.js'
export { useTokenList } from './hooks/useTokenList.js'
export { useTools } from './hooks/useTools.js'
export { useWidgetEvents } from './hooks/useWidgetEvents.js'
// ── pages ────────────────────────────────────────────────────────────────────
export { MainWarningMessages } from './pages/MainPage/MainWarningMessages.js'
export { Stack } from './pages/RoutesPage/RoutesPage.style.js'
export { SelectChainPage } from './pages/SelectChainPage/SelectChainPage.js'
export { SearchTokenInput } from './pages/SelectTokenPage/SearchTokenInput.js'
export { ContactSupportButton } from './pages/TransactionDetailsPage/ContactSupportButton.js'
export { ConfirmToAddressSheet } from './pages/TransactionPage/ConfirmToAddressSheet.js'
export {
  ExchangeRateBottomSheet,
  type ExchangeRateBottomSheetBase,
} from './pages/TransactionPage/ExchangeRateBottomSheet.js'
export { ExecutionDoneCard } from './pages/TransactionPage/ExecutionDoneCard.js'
export { RouteTracker } from './pages/TransactionPage/RouteTracker.js'
export { StartTransactionButton } from './pages/TransactionPage/StartTransactionButton.js'
export { TokenValueBottomSheet } from './pages/TransactionPage/TokenValueBottomSheet.js'
export { TransactionDoneButtons } from './pages/TransactionPage/TransactionDoneButtons.js'
export {
  calculateValueLossPercentage,
  getTokenValueLossThreshold,
} from './pages/TransactionPage/utils.js'

// ── providers ────────────────────────────────────────────────────────────────
export { I18nProvider } from './providers/I18nProvider/I18nProvider.js'
export { QueryClientProvider } from './providers/QueryClientProvider.js'
export {
  SDKClientProvider,
  useSDKClient,
} from './providers/SDKClientProvider.js'
export { WalletProvider } from './providers/WalletProvider/WalletProvider.js'
export {
  useWidgetConfig,
  WidgetProvider,
} from './providers/WidgetProvider/WidgetProvider.js'

// ── stores ───────────────────────────────────────────────────────────────────
export { useChainOrderStore } from './stores/chains/ChainOrderStore.js'
export {
  FormKeyHelper,
  type FormType,
  type FormTypeProps,
} from './stores/form/types.js'
export { useFieldActions } from './stores/form/useFieldActions.js'
export { useFieldValues } from './stores/form/useFieldValues.js'
export {
  useHeaderStore,
  useSetHeaderHeight,
} from './stores/header/useHeaderStore.js'
export { useInputModeStore } from './stores/inputMode/useInputModeStore.js'
export { RouteExecutionStatus } from './stores/routes/types.js'
export { getSourceTxHash } from './stores/routes/utils.js'
export { StoreProvider } from './stores/StoreProvider.js'
export {
  SettingsStoreProvider,
  useSettingsStoreContext,
} from './stores/settings/SettingsStore.js'

// ── themes ───────────────────────────────────────────────────────────────────
export { createTheme } from './themes/createTheme.js'

// ── types ────────────────────────────────────────────────────────────────────
export { WidgetEvent } from './types/events.js'
export type {
  FormRef,
  WidgetConfig,
  WidgetTheme,
} from './types/widget.js'

// ── utils ────────────────────────────────────────────────────────────────────
export { buildRouteFromTxHistory } from './utils/converters.js'
export { createElementId, ElementId } from './utils/elements.js'
export { hasEnumFlag } from './utils/enum.js'
export { getAccumulatedFeeCostsBreakdown } from './utils/fees.js'
export {
  formatDuration,
  formatInputAmount,
  formatTokenAmount,
  formatTokenPrice,
  priceToTokenAmount,
  usdDecimals,
} from './utils/format.js'
export { getPriceImpact } from './utils/getPriceImpact.js'
export { fitInputText } from './utils/input.js'
export { navigationRoutes } from './utils/navigationRoutes.js'
export { shortenAddress } from './utils/wallet.js'
