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

  return Big(parsedAmount).toFixed(decimalPlaces + 1, 0);
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
  try {
    const absFormattedAmount = Big(formattedAmount).abs();
    if (returnInitial) {
      return formattedAmount;
    }
    return absFormattedAmount.toString();
  } catch {
    return '';
  }
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
