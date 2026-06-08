import type { Locator } from '@playwright/test'

/**
 * Returns true when the DeveloperToggleItem container above the switch has
 * pointer-events:none — the disabled state used by DeveloperToggleItem (Box
 * wrapper styled with opacity + pointerEvents rather than the HTML `disabled`
 * attribute, so Playwright's `.isDisabled()` will not detect it).
 */
export async function isToggleItemDisabled(toggle: Locator): Promise<boolean> {
  return toggle.evaluate((el) => {
    let node: Element | null = el.parentElement
    while (node) {
      if (window.getComputedStyle(node).pointerEvents === 'none') {
        return true
      }
      node = node.parentElement
    }
    return false
  })
}
