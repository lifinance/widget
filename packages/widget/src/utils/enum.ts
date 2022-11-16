export const hasEnumFlag = <T extends number | bigint>(flags: T, flag: T) =>
  (flags & flag) === flag;
