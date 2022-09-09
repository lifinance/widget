export const isItemAllowed = <T>(
  chainId: T,
  chains?: {
    allow?: T[];
    deny?: T[];
  },
  /** @deprecated Remove in the next major release */
  disabledChains?: T[],
) => {
  if (chains?.allow?.length) {
    return chains.allow.includes(chainId);
  }
  return !(
    disabledChains?.includes(chainId) || chains?.deny?.includes(chainId)
  );
};
