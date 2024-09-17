export const shortenAddress = (address?: string) =>
  address
    ? `${address.substring(0, 7)}...${address.substring(address.length - 5)}`
    : null;
