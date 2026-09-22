import { expect, test, waitForTokens } from '../fixtures/base.fixture.js'

test.describe('Token select — Recent searches', () => {
  // Compact keeps the selector inside the widget, so the search input is a
  // reliable open-indicator. Each test starts with an empty recent list.
  test.beforeEach(async ({ page, sidebar, tokenSelector }) => {
    await Promise.all([waitForTokens(page), page.goto('/')])
    await tokenSelector.clearStoredRecentTokens()
    await sidebar.resetAll()
    await sidebar.nav.variant.click()
    await sidebar.variantEditor.cards.compact.click()
    await sidebar.goBack()
  })

  test('a selection without a search is not recorded', async ({
    widget,
    tokenSelector,
  }) => {
    await test.step('open the From selector and pick the first token', async () => {
      await widget.fromButton.click()
      await expect(tokenSelector.searchInput).toBeVisible()
      await tokenSelector.selectFirstToken()
    })

    await test.step('nothing is stored', async () => {
      expect(await tokenSelector.getRecentTokens()).toHaveLength(0)
    })

    await test.step('the band does not appear', async () => {
      await widget.fromButton.click()
      await expect(tokenSelector.searchInput).toBeVisible()
      await expect(tokenSelector.recentSearchesHeader).toBeHidden()
    })
  })

  test('a searched-and-selected token is recorded, persists, and clears', async ({
    page,
    widget,
    tokenSelector,
  }) => {
    await test.step('search for a token and select it', async () => {
      await widget.fromButton.click()
      await expect(tokenSelector.searchInput).toBeVisible()
      await tokenSelector.searchInput.fill('USDC')
      // The search filter is debounced by 320ms. Wait for the list to actually
      // reflect the query, or the click lands on the unfiltered first row.
      await expect(tokenSelector.firstTokenItem).toContainText('USDC')
      await tokenSelector.selectFirstToken()
    })

    await test.step('the token is stored', async () => {
      expect(await tokenSelector.getRecentTokens()).toHaveLength(1)
    })

    await test.step('the band appears on the next open', async () => {
      await widget.fromButton.click()
      await expect(tokenSelector.recentSearchesHeader).toBeVisible()
    })

    await test.step('a query hides the band', async () => {
      await tokenSelector.searchInput.fill('USDC')
      await expect(tokenSelector.recentSearchesHeader).toBeHidden()
      await tokenSelector.searchInput.fill('')
      await expect(tokenSelector.recentSearchesHeader).toBeVisible()
    })

    await test.step('the band survives a reload', async () => {
      await Promise.all([waitForTokens(page), page.reload()])
      await widget.fromButton.click()
      await expect(tokenSelector.recentSearchesHeader).toBeVisible()
      expect(await tokenSelector.getRecentTokens()).toHaveLength(1)
    })

    await test.step('Clear empties the list and hides the band', async () => {
      await tokenSelector.clearRecentsButton.click()
      await expect(tokenSelector.recentSearchesHeader).toBeHidden()
      expect(await tokenSelector.getRecentTokens()).toHaveLength(0)
    })
  })
})
