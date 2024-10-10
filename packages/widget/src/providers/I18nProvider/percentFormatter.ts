/**
 * We use <0.01% for both small positive and negative changes to keep it simple and clear, focusing on minimal impact rather than direction.
 * Examples:
 * +0.007% -> <0.01%
 * -0.003% -> <0.01%
 */
export const percentFormatter = (lng: string | undefined, options: any) => {
  const formatter = new Intl.NumberFormat(lng, {
    ...options,
    style: 'percent',
  })
  return (value: any) => {
    if ((value > 0 && value < 0.0001) || (value < 0 && value > -0.0001)) {
      return `<${formatter.format(0.0001)}`
    }
    return formatter.format(value)
  }
}
