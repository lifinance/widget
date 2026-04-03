export const hasEnumFlag = <T extends number | bigint>(
  flags: T,
  flag: T
): boolean => (flags & flag) === flag
