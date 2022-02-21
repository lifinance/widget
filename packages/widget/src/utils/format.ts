export const formatTokenAmount = (amount: string = '0') => {
  const parsedAmount = parseFloat(amount);
  if (parsedAmount === 0 || isNaN(Number(amount))) {
    return '0';
  }

  let decimalPlaces = 3;
  const absAmount = Math.abs(parsedAmount);
  while (
    absAmount < 0.1 ** decimalPlaces ||
    // to avoid showing greater than actual amount after round up
    parseFloat(parsedAmount.toFixed(decimalPlaces + 1)) > parsedAmount
  ) {
    decimalPlaces++;
  }

  return parsedAmount.toFixed(decimalPlaces + 1);
};

export const formatSlippage = (
  slippage: string = '',
  defaultValue: string = '',
  returnInitial: boolean = false,
) => {
  if (!slippage) {
    return slippage;
  }
  const parsedSlippage = parseFloat(slippage);
  if (isNaN(Number(slippage)) && !isNaN(parsedSlippage)) {
    return parsedSlippage;
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

// TODO: improve exp handling
export const formatAmount = (
  amount: string = '',
  returnInitial: boolean = false,
) => {
  if (!amount) {
    return amount;
  }
  const parsedAmount = parseFloat(amount);
  if (isNaN(Number(amount)) && !isNaN(parsedAmount)) {
    return parsedAmount.toString();
  }
  if (isNaN(parsedAmount)) {
    return '';
  }
  if (parsedAmount < 0) {
    return Math.abs(parsedAmount).toString();
  }
  if (returnInitial) {
    return amount;
  }
  return parsedAmount.toString();
};
