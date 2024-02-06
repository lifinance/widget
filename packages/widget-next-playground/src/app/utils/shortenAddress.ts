export const shortenAddress = (address?: string) =>
  address
    ? `${address.substring(0, 5)}...${address.substring(address.length - 4)}`
    : null;
