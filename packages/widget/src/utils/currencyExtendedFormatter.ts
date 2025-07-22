export const currencyExtendedFormatter = (
  lng: string | undefined,
  options: any
) => {
  const formatter = new Intl.NumberFormat(lng, {
    ...options,
    style: 'currency',
  })
  return (value: any) => {
    if (value > 0 && value < 0.01) {
      return `<${formatter.format(0.01)}`
    }
    return formatter.format(value)
  }
}

export const currencyShortExtendedFormatter = (
  lng: string | undefined,
  options: any
) => {
  return currencyExtendedFormatter(lng, {
    ...options,
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 2,
  })
}
