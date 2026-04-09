const borderWidthPx = 2.5

// 14% is the right bottom offset of the MUI's badge (MuiBadge-badge class)
export const getAvatarMask = (badgeSize: number) => {
  return `radial-gradient(circle ${badgeSize / 2 + borderWidthPx}px at calc(100% - 14%) calc(100% - 14%), #fff0 96%, #fff) 100% 100% / 100% 100% no-repeat`
}
