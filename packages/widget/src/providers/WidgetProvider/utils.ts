export const isItemAllowed = <T>(
  itemId: T,
  items?: {
    allow?: T[];
    deny?: T[];
  },
  /** @deprecated Remove in the next major release */
  disabledChains?: T[],
) => {
  if (items?.allow?.length) {
    return items.allow.includes(itemId);
  }
  return !(disabledChains?.includes(itemId) || items?.deny?.includes(itemId));
};
