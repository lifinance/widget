import { expect, test } from '../fixtures/base.fixture.js'

/**
 * Mixed mode × variant tests.
 *
 * The mode and variant specs each test one dimension in isolation (with the other
 * at its default). These tests verify that the two settings compose correctly:
 * the mode UI (heading, tabs, reverse button) renders correctly AND the variant
 * navigation behaviour (chain sidebar vs inline) still works when both are
 * set to non-default values.
 */

test.describe('Playground settings — Mode × Variant: Swap or Bridge + Compact', () => {
  // Swap or Bridge replaces the heading with a Swap/Bridge tab strip.
  // Compact replaces chain-sidebar expansion with inline widget navigation.
  test.beforeEach(async ({ page, sidebar }) => {
    await page.goto('/')
    await sidebar.resetAll()
    await sidebar.nav.mode.click()
    await sidebar.modeEditor.cards.swapOrBridge.click()
    await sidebar.goBack()
    await sidebar.nav.variant.click()
    await sidebar.variantEditor.cards.compact.click()
    await sidebar.goBack()
  })

  test('Swap or Bridge tab strip renders correctly in Compact layout', async ({
    exchange,
  }) => {
    await test.step('split tabs replace the heading', async () => {
      await expect(exchange.splitTabs).toBeVisible()
      await expect(exchange.heading).not.toBeVisible()
    })

    await test.step('Swap tab is active by default', async () => {
      await expect(
        exchange.splitTabs.getByRole('tab', { name: 'Swap', exact: true })
      ).toHaveAttribute('aria-selected', 'true')
    })

    await test.step('Bridge tab is present', async () => {
      await expect(
        exchange.splitTabs.getByRole('tab', { name: 'Bridge', exact: true })
      ).toBeVisible()
    })
  })

  test('clicking From navigates inline — chain sidebar does not open', async ({
    exchange,
    tokenSelector,
  }) => {
    await test.step('click the From token button', async () => {
      await exchange.fromButton.click()
    })

    await test.step('chain sidebar expansion does not appear', async () => {
      await expect(exchange.chainSidebar).not.toBeVisible()
    })

    await test.step('token selector opens inside the widget', async () => {
      await expect(tokenSelector.searchInput).toBeVisible()
    })
  })

  test('clicking To navigates inline — chain sidebar does not open', async ({
    exchange,
    tokenSelector,
  }) => {
    await test.step('click the To token button', async () => {
      await exchange.toButton.click()
    })

    await test.step('chain sidebar expansion does not appear', async () => {
      await expect(exchange.chainSidebar).not.toBeVisible()
    })

    await test.step('token selector opens inside the widget', async () => {
      await expect(tokenSelector.searchInput).toBeVisible()
    })
  })
})

test.describe('Playground settings — Mode × Variant: Refuel + Compact', () => {
  // Refuel removes the reverse tokens button and changes the heading to "Gas".
  // Compact replaces chain-sidebar expansion with inline widget navigation.
  test.beforeEach(async ({ page, sidebar }) => {
    await page.goto('/')
    await sidebar.resetAll()
    await sidebar.nav.mode.click()
    await sidebar.modeEditor.cards.refuel.click()
    await sidebar.goBack()
    await sidebar.nav.variant.click()
    await sidebar.variantEditor.cards.compact.click()
    await sidebar.goBack()
  })

  test('Refuel mode UI is correct in Compact layout', async ({ exchange }) => {
    await test.step('widget heading shows "Gas"', async () => {
      await expect(exchange.heading).toHaveText('Gas')
    })

    // In Refuel mode SelectChainAndToken replaces ReverseTokensButton with an
    // inert spacer — so the labelled button disappears.
    await test.step('reverse tokens button is hidden', async () => {
      await expect(exchange.reverseTokensButton).not.toBeVisible()
    })
  })

  test('clicking From navigates inline — chain sidebar does not open', async ({
    exchange,
    tokenSelector,
  }) => {
    await test.step('click the From token button', async () => {
      await exchange.fromButton.click()
    })

    await test.step('chain sidebar expansion does not appear', async () => {
      await expect(exchange.chainSidebar).not.toBeVisible()
    })

    await test.step('token selector opens inside the widget', async () => {
      await expect(tokenSelector.searchInput).toBeVisible()
    })
  })
})

test.describe('Playground settings — Mode × Variant: Bridge + Drawer', () => {
  // Bridge sets a single-purpose heading ("Bridge") and keeps the reverse button.
  // Selecting Drawer immediately opens the MUI Drawer — press Escape to close it
  // so the playground sidebar Back button is reachable (see settings.variant.spec.ts).
  // After beforeEach the drawer is CLOSED; tests that need the widget must open it first.
  test.beforeEach(async ({ page, sidebar }) => {
    await page.goto('/')
    await sidebar.resetAll()
    await sidebar.nav.mode.click()
    await sidebar.modeEditor.cards.bridge.click()
    await sidebar.goBack()
    await sidebar.nav.variant.click()
    await sidebar.variantEditor.cards.drawer.click()
    await page.keyboard.press('Escape')
    await sidebar.goBack()
  })

  test('Bridge mode UI is correct inside the Drawer', async ({ exchange }) => {
    await test.step('open the drawer via the toggle button', async () => {
      await exchange.toggleDrawerButton.click()
    })

    await test.step('widget heading shows "Bridge"', async () => {
      await expect(exchange.heading).toHaveText('Bridge')
    })

    await test.step('reverse tokens button is visible', async () => {
      await expect(exchange.reverseTokensButton).toBeVisible()
    })
  })

  test('clicking From navigates inline — chain sidebar does not open', async ({
    exchange,
    tokenSelector,
  }) => {
    await test.step('open the drawer via the toggle button', async () => {
      await exchange.toggleDrawerButton.click()
    })

    await test.step('click the From token button', async () => {
      await exchange.fromButton.click()
    })

    await test.step('chain sidebar expansion does not appear', async () => {
      await expect(exchange.chainSidebar).not.toBeVisible()
    })

    await test.step('token selector opens inside the widget', async () => {
      await expect(tokenSelector.searchInput).toBeVisible()
    })
  })
})
