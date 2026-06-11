import { expect, test, waitForTokens } from '../fixtures/base.fixture.js'

test.describe('Playground smoke', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('sidebar is visible with nav controls', async ({ sidebar }) => {
    await test.step('logo and header are rendered', async () => {
      await expect(sidebar.header.logo).toBeVisible()
      await expect(sidebar.header.playgroundText).toBeVisible()
    })

    await test.step('nav buttons are present', async () => {
      await expect(sidebar.nav.variant).toBeVisible()
      await expect(sidebar.nav.mode).toBeVisible()
    })
  })

  test('widget container is displayed with Exchange heading', async ({
    widget,
  }) => {
    await test.step('widget root is visible', async () => {
      await expect(widget.root).toBeVisible()
    })

    await test.step('Exchange heading is rendered', async () => {
      await expect(widget.heading).toBeVisible()
    })

    await test.step('From and To buttons are present', async () => {
      await expect(widget.fromButton).toBeVisible()
      await expect(widget.toButton).toBeVisible()
    })

    await test.step('Send amount input is present', async () => {
      await expect(widget.sendAmountInput).toBeVisible()
      await expect(widget.sendAmountInput).toHaveAttribute('placeholder', '0')
    })
  })

  test('clicking the Settings icon opens the Settings view', async ({
    widget,
    settings,
  }) => {
    await test.step('open Settings', async () => {
      await widget.openSettings()
      await expect(settings.heading).toBeVisible()
    })

    await test.step('all setting rows are rendered', async () => {
      await expect(settings.appearanceButton).toBeVisible()
      await expect(settings.languageButton).toBeVisible()
      await expect(settings.routePriorityButton).toBeVisible()
      await expect(settings.gasPriceButton).toBeVisible()
      await expect(settings.maxSlippageButton).toBeVisible()
      await expect(settings.bridgesButton).toBeVisible()
      await expect(settings.exchangesButton).toBeVisible()
    })

    await test.step('back button returns to Exchange', async () => {
      await settings.goBack()
      await expect(widget.heading).toBeVisible()
    })
  })

  // Depends on the live LI.FI /v1/tokens API. The token selector uses TanStack
  // Query with its own query key; tokens render after the SDK cache propagates
  // through a React render cycle. Use test.slow() to give the list enough time
  // to transition out of skeleton state on slow networks.
  test('token route setup — From and To tokens selected via UI', async ({
    page,
    widget,
    tokenSelector,
  }) => {
    test.slow() // doubles the default test timeout

    await test.step('wait for token list to load', async () => {
      await Promise.all([waitForTokens(page), page.goto('/')])
    })

    await test.step('From token selector opens — search filters by cached token data', async () => {
      await widget.openFromTokenSelector()
      await expect(tokenSelector.heading).toBeVisible()
      // The Wide-variant token list shows skeletons until a chain is selected.
      // Use search to filter by a known symbol — the search result renders
      // from the cached SDK response even while the main list is loading.
      await widget.root
        .getByRole('textbox', { name: 'Search by token or address' })
        .fill('ETH')
      await expect(tokenSelector.firstTokenItem).toBeVisible({
        timeout: 30_000,
      })
    })

    await test.step('select first token — Exchange view shows From token', async () => {
      await tokenSelector.selectFirstToken()
      await expect(widget.heading).toBeVisible()
      await expect(widget.fromButton).not.toHaveText(/Select chain and token/)
    })

    await test.step('To token selector opens — search for USDC', async () => {
      await widget.openToTokenSelector()
      await expect(tokenSelector.heading).toBeVisible()
      await widget.root
        .getByRole('textbox', { name: 'Search by token or address' })
        .fill('USDC')
      await expect(tokenSelector.firstTokenItem).toBeVisible({
        timeout: 30_000,
      })
    })

    await test.step('select first USDC token — Exchange view shows To token', async () => {
      await tokenSelector.selectFirstToken()
      await expect(widget.heading).toBeVisible()
      await expect(widget.toButton).not.toHaveText(/Select chain and token/)
    })
  })
})
