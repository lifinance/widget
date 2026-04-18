import { expect, test, waitForTokens } from '../fixtures/base.fixture.js'

test.describe('Widget Playground Smoke Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('playground sidebar is visible with Design controls', async ({
    sidebar,
  }) => {
    await test.step('sidebar heading is rendered', async () => {
      await expect(sidebar.heading).toBeVisible()
    })

    await test.step('Design and Code tabs are present', async () => {
      await expect(sidebar.designTab).toBeVisible()
      await expect(sidebar.codeTab).toBeVisible()
      await expect(sidebar.designTab).toHaveAttribute('aria-selected', 'true')
    })

    await test.step('Variant controls are visible', async () => {
      await expect(sidebar.variantButton).toBeVisible()
      await expect(sidebar.subvariantButton).toBeVisible()
    })
  })

  test('@example widget container is displayed with Exchange heading', async ({
    exchange,
  }) => {
    await test.step('widget root is visible', async () => {
      await expect(exchange.widgetRoot).toBeVisible()
    })

    await test.step('Exchange heading is rendered', async () => {
      await expect(exchange.heading).toBeVisible()
    })

    await test.step('From and To buttons are present', async () => {
      await expect(exchange.fromButton).toBeVisible()
      await expect(exchange.toButton).toBeVisible()
    })

    await test.step('Send amount input is present', async () => {
      await expect(exchange.sendAmountInput).toBeVisible()
      await expect(exchange.sendAmountInput).toHaveAttribute('placeholder', '0')
    })
  })

  test('@example clicking the Settings icon opens the Settings view', async ({
    exchange,
    settings,
  }) => {
    await test.step('open Settings', async () => {
      await exchange.openSettings()
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
      await expect(exchange.heading).toBeVisible()
    })
  })

  test('@example token route setup — From and To tokens selected via UI', async ({
    page,
    exchange,
    tokenSelector,
  }) => {
    await test.step('navigate to plain / and wait for token list to load', async () => {
      // waitForTokens must be set up before goto so we don't miss the response
      await Promise.all([waitForTokens(page), page.goto('/')])
    })

    await test.step('From token selector opens with a populated token list', async () => {
      await exchange.openFromTokenSelector()
      await expect(tokenSelector.heading).toBeVisible()
      await expect(tokenSelector.tokenList).toBeVisible()
      await expect(tokenSelector.firstTokenItem).toBeVisible()
    })

    await test.step('select first token — Exchange view shows From token', async () => {
      await tokenSelector.selectFirstToken()
      await expect(exchange.heading).toBeVisible()
      await expect(exchange.fromButton).not.toHaveText(/Select chain and token/)
    })

    await test.step('To token selector opens with a populated token list', async () => {
      await exchange.openToTokenSelector()
      await expect(tokenSelector.heading).toBeVisible()
      await expect(tokenSelector.tokenList).toBeVisible()
      await expect(tokenSelector.firstTokenItem).toBeVisible()
    })

    await test.step('select second token — Exchange view shows To token', async () => {
      await tokenSelector.selectTokenByIndex(1)
      await expect(exchange.heading).toBeVisible()
      await expect(exchange.toButton).not.toHaveText(/Select chain and token/)
    })
  })
})
