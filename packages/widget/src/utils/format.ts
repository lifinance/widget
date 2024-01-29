import { formatUnits } from 'viem';

/**
 * Format token amount to at least 4 decimals.
 * @param amount amount to format.
 * @returns formatted amount.
 */
export const formatTokenAmount = (
  amount: bigint = 0n,
  decimals: number,
  decimalPlaces: number = 3,
) => {
  const formattedAmount = amount ? formatUnits(amount, decimals) : '0';
  const parsedAmount = parseFloat(formattedAmount);
  if (parsedAmount === 0 || isNaN(Number(formattedAmount))) {
    return '0';
  }

  const absAmount = Math.abs(parsedAmount);
  while (absAmount < 1 / 10 ** decimalPlaces) {
    decimalPlaces++;
  }

  return parsedAmount.toFixed(decimalPlaces + 1);
};

export const formatSlippage = (
  slippage: string = '',
  defaultValue: string = '',
  returnInitial: boolean = false,
): string => {
  if (!slippage) {
    return slippage;
  }
  const parsedSlippage = parseFloat(slippage);
  if (isNaN(Number(slippage)) && !isNaN(parsedSlippage)) {
    return parsedSlippage.toString();
  }
  if (isNaN(parsedSlippage)) {
    return defaultValue;
  }
  if (parsedSlippage > 100) {
    return '100';
  }
  if (parsedSlippage < 0) {
    return Math.abs(parsedSlippage).toString();
  }
  if (returnInitial) {
    return slippage;
  }
  return parsedSlippage.toString();
};

export const formatInputAmount = (
  amount: string,
  decimals: number | null = null,
  returnInitial: boolean = false,
) => {
  if (!amount) {
    return amount;
  }
  let formattedAmount = amount.replaceAll(',', '.');
  if (formattedAmount.startsWith('.')) {
    formattedAmount = '0' + formattedAmount;
  }
  const parsedAmount = parseFloat(formattedAmount);
  if (isNaN(Number(formattedAmount)) && !isNaN(parsedAmount)) {
    return parsedAmount.toString();
  }
  if (isNaN(Math.abs(Number(formattedAmount)))) {
    return '';
  }
  if (returnInitial) {
    return formattedAmount;
  }
  let [integer, fraction = ''] = formattedAmount.split('.');
  if (decimals !== null && fraction.length > decimals) {
    fraction = fraction.slice(0, decimals);
  }
  integer = integer.replace(/^0+|-/, '');
  fraction = fraction.replace(/(0+)$/, '');
  return `${integer || (fraction ? '0' : '')}${fraction ? `.${fraction}` : ''}`;
};

export const formatTokenPrice = (amount?: string, price?: string) => {
  if (!amount || !price) {
    return 0;
  }
  if (isNaN(Number(amount)) || isNaN(Number(price))) {
    return 0;
  }
  return parseFloat(amount) * parseFloat(price);
};
