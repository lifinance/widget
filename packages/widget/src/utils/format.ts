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
