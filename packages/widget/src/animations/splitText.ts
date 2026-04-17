interface SplitTextOptions {
  wordClass?: string
}

interface SplitTextResult {
  words: HTMLSpanElement[]
}

/**
 * Splits the text content of an element into word-level `<span>` elements.
 *
 * Replaces the element's children with one `<span>` per word, separated by
 * whitespace text nodes so inline layout is preserved.
 */
export function splitText(
  element: Element,
  options: SplitTextOptions = {}
): SplitTextResult {
  const { wordClass } = options
  const text = element.textContent ?? ''
  element.textContent = ''

  const tokens = text.split(/(\s+)/)
  const words: HTMLSpanElement[] = []

  for (const token of tokens) {
    if (/^\s+$/.test(token)) {
      element.appendChild(document.createTextNode(token))
      continue
    }
    if (token === '') {
      continue
    }
    const span = document.createElement('span')
    if (wordClass) {
      span.className = wordClass
    }
    span.style.display = 'inline-block'
    span.textContent = token
    element.appendChild(span)
    words.push(span)
  }

  return { words }
}
