import { formatUnits } from 'viem';

const subscriptMap = ['₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉'];

export const precisionFormatter = new Intl.NumberFormat('en', {
  notation: 'standard',
  roundingPriority: 'morePrecision',
  maximumSignificantDigits: 4,
  maximumFractionDigits: 4,
  useGrouping: false,
});

/**
 * Format token amount to at least 4 decimals.
 * @param amount amount to format.
 * @returns formatted amount.
 */
export function formatTokenAmount(amount: bigint = 0n, decimals: number) {
  const formattedAmount = amount ? formatUnits(amount, decimals) : '0';
  const parsedAmount = parseFloat(formattedAmount);
  if (parsedAmount === 0 || isNaN(Number(formattedAmount))) {
    return '0';
  }

  return precisionFormatter.format(parsedAmount);
}

export function formatSlippage(
  slippage: string = '',
  defaultValue: string = '',
  returnInitial: boolean = false,
): string {
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
}

export function formatInputAmount(
  amount: string,
  decimals: number | null = null,
  returnInitial: boolean = false,
) {
  if (!amount) {
    return amount;
  }
  let formattedAmount = amount.trim().replaceAll(',', '.');
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
}

export function formatTokenPrice(amount?: string, price?: string) {
  if (!amount || !price) {
    return 0;
  }
  if (isNaN(Number(amount)) || isNaN(Number(price))) {
    return 0;
  }
  return parseFloat(amount) * parseFloat(price);
}

/**
 * Converts a number to a subscript format if it contains leading zeros in the fractional part.
 *
 * @param {number} value - The number to be converted.
 * @param {Intl.NumberFormatOptions} options An object that contains one or more properties that specify comparison options.
 * @returns {string} - The number formatted as a string, with subscripts for leading zeros if applicable.
 */
export function convertToSubscriptFormat(
  value: number,
  options?: Intl.NumberFormatOptions,
): string {
  let formattedValue;
  if (options) {
    formattedValue = value.toLocaleString('en', options);
  } else {
    formattedValue = precisionFormatter.format(value);
  }

  // Calculate the number of zeros after the decimal point
  const d = Math.ceil(Math.log10(Math.abs(value)));

  // If the value does not have significant leading zeros in the fractional part, return the formatted value as is
  if (d > -3 || !value) {
    return formattedValue;
  }

  // Calculate the number of leading zeros in the fractional part
  const leadingZeros = Math.abs(d);

  const fractionalPartExtractor = value > 0 ? 2 : 3;

  // Extract the fractional part of the formatted value, excluding the leading zeros and "0." or "-0."
  const fractionalPart = formattedValue.slice(
    leadingZeros + fractionalPartExtractor,
  );

  // Convert the number of leading zeros to their corresponding Unicode subscript characters
  const subscript = leadingZeros
    .toString()
    .split('')
    .map((digit) => subscriptMap[digit as any])
    .join('');

  return `${value > 0 ? '' : '-'}0.0${subscript}${fractionalPart}`;
}
