import type { ExampleConfig } from '../../examples.config.js'
import { expect, test, waitForTokens } from '../fixtures/base.fixture.js'

/**
 * Widget smoke profile — covers standard (widget at /) and routed (widget at custom path).
 * mountPath is read from project metadata so the same spec handles both profiles.
 *
 * Standard  (13): vite, connectkit, privy, privy-ethers, rainbowkit, reown, svelte,
 *                 zustand-widget-config, vue, nextjs, nextjs15, remix, react-router-7
 * Routed     (1): tanstack-router (mountPath: /widget)
 */

test.describe('Widget smoke', () => {
  test.beforeEach(async ({ page }) => {
    const { mountPath } = test.info().project.metadata as ExampleConfig
    await page.goto(mountPath)
  })

  test('widget container is displayed with Exchange heading', async ({
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

  test('clicking Settings icon opens the Settings view', async ({
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

  test('token route setup — From and To tokens selectable', async ({
    page,
    exchange,
    tokenSelector,
  }) => {
    const { mountPath } = test.info().project.metadata as ExampleConfig

    await test.step('wait for token list to load', async () => {
      await Promise.all([waitForTokens(page), page.goto(mountPath)])
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
