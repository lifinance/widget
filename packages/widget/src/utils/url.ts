export const isHttpUrl = (url: string | undefined): url is string => {
  if (!url) {
    return false
  }
  try {
    const { protocol } = new URL(url)
    return protocol === 'https:' || protocol === 'http:'
  } catch {
    return false
  }
}

export const openInNewTab = (url: string | undefined): void => {
  if (isHttpUrl(url)) {
    window.open(url, '_blank', 'noopener,noreferrer')
  }
}
