/** Sets or removes a boolean query string parameter and pushes the updated URL to browser history. */
export const setQueryStringParam = (
  queryStringKey: string,
  value: boolean
): void => {
  const url = new URL(window.location.href)
  if (value) {
    url.searchParams.set(queryStringKey, value.toString())
  } else {
    url.searchParams.delete(queryStringKey)
  }
  window.history.pushState(null, '', url.toString())
}
