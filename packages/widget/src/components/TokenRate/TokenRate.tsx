import type { RouteExtended } from '@lifi/sdk';
import type { TypographyProps } from '@mui/material';
import type { MouseEventHandler } from 'react';
import { formatUnits } from 'viem';
import { create } from 'zustand';
import {
  convertToSubscriptFormat,
  precisionFormatter,
} from '../../utils/format.js';
import { TokenRateTypography } from './TokenRate.style.js';

interface TokenRateProps extends TypographyProps {
  route: RouteExtended;
}

interface TokenRateState {
  isForward: boolean;
  toggleIsForward(): void;
}

const useTokenRateStore = create<TokenRateState>((set) => ({
  isForward: true,
  toggleIsForward: () => set((state) => ({ isForward: !state.isForward })),
}));

export const TokenRate: React.FC<TokenRateProps> = ({ route }) => {
  const { isForward, toggleIsForward } = useTokenRateStore();

  const toggleRate: MouseEventHandler<HTMLSpanElement> = (e) => {
    e.stopPropagation();
    toggleIsForward();
  };

  const lastStep = route.steps.at(-1);

  const fromToken = {
    ...route.fromToken,
    amount: BigInt(route.fromAmount),
  };
  const toToken = {
    ...(lastStep?.execution?.toToken ??
      lastStep?.action.toToken ??
      route.toToken),
    amount: lastStep?.execution?.toAmount
      ? BigInt(lastStep.execution.toAmount)
      : BigInt(route.toAmount),
  };

  const fromToRate =
    parseFloat(formatUnits(toToken.amount!, toToken.decimals)) /
    parseFloat(formatUnits(fromToken.amount!, fromToken.decimals));
  const toFromRate =
    parseFloat(formatUnits(fromToken.amount!, fromToken.decimals)) /
    parseFloat(formatUnits(toToken.amount!, toToken.decimals));

  const rateText = isForward
    ? `1 ${fromToken.symbol} ≈ ${convertToSubscriptFormat(fromToRate)} ${toToken.symbol}`
    : `1 ${toToken.symbol} ≈ ${convertToSubscriptFormat(toFromRate)} ${fromToken.symbol}`;

  const rateTitle = isForward
    ? `1 ${fromToken.symbol} ≈ ${precisionFormatter.format(fromToRate)} ${toToken.symbol}`
    : `1 ${toToken.symbol} ≈ ${precisionFormatter.format(toFromRate)} ${fromToken.symbol}`;

  return (
    <TokenRateTypography onClick={toggleRate} role="button" title={rateTitle}>
      {rateText}
    </TokenRateTypography>
  );
};
