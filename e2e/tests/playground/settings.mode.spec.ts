import { expect, test } from '../fixtures/base.fixture.js'

test.describe('Playground settings — Mode', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('Exchange mode is selected by default', async ({
    sidebar,
    exchange,
  }) => {
    await test.step('widget heading shows "Exchange"', async () => {
      await expect(exchange.heading).toHaveText('Exchange')
    })

    await test.step('Mode nav button value shows "Exchange"', async () => {
      await expect(sidebar.nav.mode).toContainText('Exchange')
    })

    await test.step('Exchange card is the active selection in the mode panel', async () => {
      await sidebar.nav.mode.click()
      await expect(sidebar.modeEditor.cards.exchange).toHaveAttribute(
        'data-selected',
        'true'
      )
    })

    await test.step('reverse tokens button is visible and interactive', async () => {
      await sidebar.goBack()
      await expect(exchange.reverseTokensButton).toBeVisible()
    })
  })

  test('selects Swap or Bridge mode', async ({ sidebar, exchange }) => {
    await test.step('open the mode panel', async () => {
      await sidebar.nav.mode.click()
    })

    await test.step('click the Swap or Bridge card', async () => {
      await sidebar.modeEditor.cards.swapOrBridge.click()
    })

    await test.step('go back and verify Mode nav button value', async () => {
      await sidebar.goBack()
      await expect(sidebar.nav.mode).toContainText('Swap or Bridge')
    })

    await test.step('widget shows Swap / Bridge tab strip instead of a heading', async () => {
      await expect(exchange.splitTabs).toBeVisible()
      await expect(exchange.heading).not.toBeVisible()
    })

    await test.step('tab strip contains Swap and Bridge tabs with Swap active', async () => {
      await expect(
        exchange.splitTabs.getByRole('tab', { name: 'Swap', exact: true })
      ).toHaveAttribute('aria-selected', 'true')
      await expect(
        exchange.splitTabs.getByRole('tab', { name: 'Bridge', exact: true })
      ).toBeVisible()
    })
  })

  test('selects Swap mode', async ({ sidebar, exchange }) => {
    await test.step('open the mode panel', async () => {
      await sidebar.nav.mode.click()
    })

    await test.step('click the Swap card', async () => {
      await sidebar.modeEditor.cards.swap.click()
    })

    await test.step('go back and verify Mode nav button value', async () => {
      await sidebar.goBack()
      await expect(sidebar.nav.mode).toContainText('Swap')
    })

    await test.step('widget heading shows "Swap"', async () => {
      await expect(exchange.heading).toHaveText('Swap')
    })

    await test.step('reverse tokens button is visible', async () => {
      await expect(exchange.reverseTokensButton).toBeVisible()
    })
  })

  test('selects Bridge mode', async ({ sidebar, exchange }) => {
    await test.step('open the mode panel', async () => {
      await sidebar.nav.mode.click()
    })

    await test.step('click the Bridge card', async () => {
      await sidebar.modeEditor.cards.bridge.click()
    })

    await test.step('go back and verify Mode nav button value', async () => {
      await sidebar.goBack()
      await expect(sidebar.nav.mode).toContainText('Bridge')
    })

    await test.step('widget heading shows "Bridge"', async () => {
      await expect(exchange.heading).toHaveText('Bridge')
    })

    await test.step('reverse tokens button is visible', async () => {
      await expect(exchange.reverseTokensButton).toBeVisible()
    })
  })

  test('selects Refuel mode', async ({ sidebar, exchange }) => {
    await test.step('open the mode panel', async () => {
      await sidebar.nav.mode.click()
    })

    await test.step('click the Refuel card', async () => {
      await sidebar.modeEditor.cards.refuel.click()
    })

    await test.step('go back and verify Mode nav button value', async () => {
      await sidebar.goBack()
      await expect(sidebar.nav.mode).toContainText('Refuel')
    })

    await test.step('widget heading shows "Gas"', async () => {
      await expect(exchange.heading).toHaveText('Gas')
    })

    // In Refuel mode SelectChainAndToken replaces the interactive ReverseTokensButton
    // with an inert ReverseTokensButtonEmpty spacer, so the labelled button disappears.
    await test.step('reverse tokens button is hidden', async () => {
      await expect(exchange.reverseTokensButton).not.toBeVisible()
    })
  })

  // The correct Mode docs URL is fixed in PR #767 / EMB-423 (select-widget-layout#mode).
  // On the current branch the app still links to the old select-widget-variants#subvariants
  // 404, so this assertion fails — test.fail() keeps it green until #767 lands, at which
  // point it turns RED (unexpected pass): the signal to remove test.fail().
  test('"Read docs" link opens the Mode docs in a new tab', async ({
    context,
    sidebar,
  }) => {
    test.fail()
    await test.step('open the mode panel', async () => {
      await sidebar.nav.mode.click()
    })

    await test.step('"Read docs" link is visible', async () => {
      await expect(sidebar.modeEditor.docsLink).toBeVisible()
    })

    await test.step('clicking the link opens a new tab with the correct URL', async () => {
      // Start listening for the new page before clicking so the event isn't missed.
      const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        sidebar.modeEditor.docsLink.click(),
      ])
      await newPage.waitForLoadState('domcontentloaded')
      expect(newPage.url()).toBe(
        'https://docs.li.fi/widget/select-widget-layout#mode'
      )
    })
  })

  test('Swap mode shows the Swap tab and no Bridge tab', async ({
    sidebar,
    exchange,
  }) => {
    await test.step('open the mode panel and click Swap', async () => {
      await sidebar.nav.mode.click()
      await sidebar.modeEditor.cards.swap.click()
      await sidebar.goBack()
    })

    // Swap mode (mode='split', splitOption='swap') hides the tab strip entirely
    // and shows a plain heading instead — the widget is locked to swap-only.
    await test.step('heading shows "Swap" (tab strip is not rendered)', async () => {
      await expect(exchange.heading).toHaveText('Swap')
      await expect(exchange.splitTabs).not.toBeAttached()
    })

    await test.step('Bridge tab is absent from the DOM', async () => {
      await expect(
        exchange.widgetRoot.getByRole('tab', { name: 'Bridge', exact: true })
      ).not.toBeAttached()
    })
  })

  test('Bridge mode shows the Bridge tab and no Swap tab', async ({
    sidebar,
    exchange,
  }) => {
    await test.step('open the mode panel and click Bridge', async () => {
      await sidebar.nav.mode.click()
      await sidebar.modeEditor.cards.bridge.click()
      await sidebar.goBack()
    })

    // Bridge mode (mode='split', splitOption='bridge') hides the tab strip entirely
    // and shows a plain heading instead — the widget is locked to bridge-only.
    await test.step('heading shows "Bridge" (tab strip is not rendered)', async () => {
      await expect(exchange.heading).toHaveText('Bridge')
      await expect(exchange.splitTabs).not.toBeAttached()
    })

    await test.step('Swap tab is absent from the DOM', async () => {
      await expect(
        exchange.widgetRoot.getByRole('tab', { name: 'Swap', exact: true })
      ).not.toBeAttached()
    })
  })

  test('resets mode to default', async ({ sidebar, exchange }) => {
    await test.step('select Bridge mode', async () => {
      await sidebar.nav.mode.click()
      await sidebar.modeEditor.cards.bridge.click()
    })

    await test.step('click Reset mode', async () => {
      await sidebar.modeEditor.reset.click()
    })

    await test.step('go back and verify Mode nav button reverted', async () => {
      await sidebar.goBack()
      await expect(sidebar.nav.mode).toContainText('Exchange')
    })

    await test.step('widget heading reverts to "Exchange"', async () => {
      await expect(exchange.heading).toHaveText('Exchange')
    })
  })
})
