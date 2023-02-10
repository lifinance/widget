import Big from 'big.js';

// JavaScript numbers use exponential notation for positive exponents of 21 and above. We need more.
Big.PE = 42;
// JavaScript numbers use exponential notation for negative exponents of -7 and below. We need more.
Big.NE = -42;

/**
 * Format token amount to at least 4 decimals.
 * @param amount amount to format.
 * @returns formatted amount.
 */
export const formatTokenAmount = (
  amount: string = '0',
  decimals: number = 0,
  decimalPlaces: number = 3,
) => {
  let shiftedAmount = amount;
  if (decimals) {
    shiftedAmount = (Number(amount) / 10 ** decimals).toString();
  }
  const parsedAmount = parseFloat(shiftedAmount);
  if (parsedAmount === 0 || isNaN(Number(shiftedAmount))) {
    return '0';
  }

  const absAmount = Math.abs(parsedAmount);
  while (absAmount < 1 / 10 ** decimalPlaces) {
    decimalPlaces++;
  }

  return Big(
    parseFloat(Big(parsedAmount).toFixed(decimalPlaces + 1, 0)),
  ).toString();
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

export const formatAmount = (
  amount: string = '',
  returnInitial: boolean = false,
) => {
  if (!amount) {
    return amount;
  }
  const formattedAmount = amount.replaceAll(',', '.');
  const parsedAmount = parseFloat(formattedAmount);
  if (isNaN(Number(formattedAmount)) && !isNaN(parsedAmount)) {
    return parsedAmount.toString();
  }
  if (isNaN(parsedAmount)) {
    return '';
  }
  if (parsedAmount < 0) {
    return Math.abs(parsedAmount).toString();
  }
  try {
    if (returnInitial && Big(formattedAmount)) {
      return formattedAmount;
    }
  } catch {
    return '';
  }
  return Big(parsedAmount).toString();
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
