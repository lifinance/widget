export const isItemAllowed = <T>(
  itemId: T,
  items?: {
    allow?: T[];
    deny?: T[];
  },
) => {
  if (items?.allow?.length) {
    return items.allow.includes(itemId);
  }
  return !items?.deny?.includes(itemId);
};
