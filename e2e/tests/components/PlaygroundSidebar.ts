import type { Locator, Page } from '@playwright/test'

/**
 * PlaygroundSidebar — Component Object for the LI.FI Widget Playground left sidebar.
 *
 * The sidebar contains the "Design" and "Code" tabs along with all widget
 * configuration controls (variant, subvariant, appearance, colors, etc.).
 *
 */
export class PlaygroundSidebar {
  readonly page: Page

  readonly heading: Locator
  readonly designTab: Locator
  readonly codeTab: Locator
  readonly variantButton: Locator
  readonly subvariantButton: Locator

  constructor(page: Page) {
    this.page = page

    this.heading = page.getByRole('heading', { name: 'LI.FI Widget', level: 1 })

    const tabList = page.getByRole('tablist', { name: 'tabs' })
    this.designTab = tabList.getByRole('tab', { name: 'Design' })
    this.codeTab = tabList.getByRole('tab', { name: 'Code' })

    this.variantButton = page.getByRole('button', { name: /^Variant/i })
    this.subvariantButton = page.getByRole('button', { name: /^Subvariant/i })
  }
}
