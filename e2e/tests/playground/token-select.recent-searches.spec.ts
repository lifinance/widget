import { expect, test, waitForTokens } from '../fixtures/base.fixture.js'

const ethereumUsdc = {
  chainId: 1,
  address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  symbol: 'USDC',
  name: 'USD Coin',
  decimals: 6,
}

test.describe('Token select — Recent searches', () => {
  // Chain pinned: an unpinned search can move the form to another chain.
  test.beforeEach(async ({ page, sidebar }) => {
    await Promise.all([waitForTokens(page), page.goto('/?fromChain=1')])
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
      // The filter is debounced; wait, or the click hits the unfiltered row.
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
  test('Clear removes only the chain on screen', async ({
    page,
    widget,
    tokenSelector,
  }) => {
    await test.step('seed a recent on Ethereum and one on Base', async () => {
      await tokenSelector.seedRecentTokens([
        ethereumUsdc,
        {
          chainId: 8453,
          address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
          symbol: 'USDC',
          name: 'USD Coin',
          decimals: 6,
        },
      ])
      await Promise.all([waitForTokens(page), page.reload()])
    })

    await test.step('clear while only Ethereum is on screen', async () => {
      await widget.fromButton.click()
      await expect(tokenSelector.recentSearchesHeader).toBeVisible()
      await tokenSelector.clearRecentsButton.click()
      await expect(tokenSelector.recentSearchesHeader).toBeHidden()
    })

    await test.step('the Base entry survives', async () => {
      const remaining = await tokenSelector.getRecentTokens()
      expect(remaining.map((t) => t.chainId)).toEqual([8453])
    })
  })
  test('a band row can be selected while the band is showing', async ({
    page,
    widget,
    tokenSelector,
  }) => {
    await test.step('seed a band whose first row carries the Clear action', async () => {
      await tokenSelector.seedRecentTokens([ethereumUsdc])
      await Promise.all([waitForTokens(page), page.reload()])
    })

    // This row holds both "Clear" and the token button: a strict-mode trap.
    await test.step('select the band row', async () => {
      await expect(widget.fromButton).not.toContainText('USDC')
      await widget.fromButton.click()
      await expect(tokenSelector.recentSearchesHeader).toBeVisible()
      await tokenSelector.selectFirstRecentToken()
      await expect(tokenSelector.searchInput).toBeHidden()
      await expect(widget.fromButton).toContainText('USDC')
    })

    await test.step('the entry stays recorded', async () => {
      expect(await tokenSelector.getRecentTokens()).toHaveLength(1)
    })
  })

  test('the delete action removes one entry', async ({
    page,
    widget,
    tokenSelector,
  }) => {
    await test.step('seed two recents on Ethereum', async () => {
      await tokenSelector.seedRecentTokens([
        ethereumUsdc,
        {
          chainId: 1,
          address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
          symbol: 'USDT',
          name: 'Tether USD',
          decimals: 6,
        },
      ])
      await Promise.all([waitForTokens(page), page.reload()])
    })

    await test.step('delete the first band row', async () => {
      await widget.fromButton.click()
      await expect(tokenSelector.recentSearchesHeader).toBeVisible()
      await tokenSelector.removeFirstRecentToken()
    })

    await test.step('only that entry is gone', async () => {
      await expect
        .poll(async () =>
          (await tokenSelector.getRecentTokens()).map((t) => t.address)
        )
        .toEqual(['0xdAC17F958D2ee523a2206206994597C13D831ec7'])
      await expect(tokenSelector.recentSearchesHeader).toBeVisible()
    })
  })

  test('Show more expands the band, and a scope change collapses it', async ({
    page,
    widget,
    tokenSelector,
  }) => {
    await test.step('seed six recents on Ethereum', async () => {
      await tokenSelector.seedRecentTokens([
        ethereumUsdc,
        ...[
          ['0xdAC17F958D2ee523a2206206994597C13D831ec7', 'USDT', 6],
          ['0x6B175474E89094C44Da98b954EedeAC495271d0F', 'DAI', 18],
          ['0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', 'WBTC', 8],
          ['0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', 'WETH', 18],
          ['0x514910771AF9Ca656af840dff83E8264EcF986CA', 'LINK', 18],
        ].map(([address, symbol, decimals]) => ({
          chainId: 1,
          address: address as string,
          symbol: symbol as string,
          name: symbol as string,
          decimals: decimals as number,
        })),
      ])
      await Promise.all([waitForTokens(page), page.reload()])
    })

    await test.step('expand the band', async () => {
      await widget.fromButton.click()
      await expect(tokenSelector.recentTokensToggle).toHaveText('Show 2 more')
      await tokenSelector.recentTokensToggle.click()
      await expect(tokenSelector.recentTokensToggle).toHaveText('Show less')
    })

    await test.step('All networks opens the band collapsed', async () => {
      await tokenSelector.selectAllNetworks()
      await expect(tokenSelector.recentTokensToggle).toHaveText('Show 2 more')
    })
  })
})
