// 14% is the right bottom offset of the MUI's badge (MuiBadge-badge class)
export const getAvatarMask = (
  badgeSize: number,
  badgeBorderWidthPx: number = 2.5
) => {
  return `radial-gradient(circle ${badgeSize / 2 + badgeBorderWidthPx}px at calc(100% - 14%) calc(100% - 14%), #fff0 96%, #fff) 100% 100% / 100% 100% no-repeat`
}
