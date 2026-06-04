import { expect, test } from '../fixtures/base.fixture.js'

test.describe('Playground settings — Variant (Compact)', () => {
  // Switch to Compact before each test and return to the Exchange view.
  test.beforeEach(async ({ page, sidebar }) => {
    await page.goto('/')
    await sidebar.resetAll()
    await sidebar.nav.variant.click()
    await sidebar.variantEditor.cards.compact.click()
    await sidebar.goBack()
  })

  test('Compact variant nav button reflects the selection', async ({
    sidebar,
  }) => {
    await test.step('Variant nav button shows "Compact"', async () => {
      await expect(sidebar.nav.variant).toContainText('Compact')
    })
  })

  test('clicking From navigates inside the widget without opening the chain sidebar', async ({
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

  test('clicking To navigates inside the widget without opening the chain sidebar', async ({
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

test.describe('Playground settings — Variant (Drawer)', () => {
  // Switch to Drawer before each test. Selecting Drawer immediately opens the MUI Drawer
  // with a full-screen backdrop, which causes MUI to set aria-hidden on all background
  // content — making the playground sidebar's Back button unreachable via role locator.
  // Press Escape to close the drawer first, then navigate back in the sidebar.
  // After beforeEach the drawer is CLOSED; tests that need it open must call toggleDrawerButton.
  test.beforeEach(async ({ page, sidebar }) => {
    await page.goto('/')
    await sidebar.resetAll()
    await sidebar.nav.variant.click()
    await sidebar.variantEditor.cards.drawer.click()
    await page.keyboard.press('Escape')
    await sidebar.goBack()
  })

  test('Drawer variant nav button reflects the selection', async ({
    sidebar,
  }) => {
    await test.step('Variant nav button shows "Drawer"', async () => {
      await expect(sidebar.nav.variant).toContainText('Drawer')
    })
  })

  test('"Exchange on LI.FI" toggle button is visible in Drawer mode', async ({
    exchange,
  }) => {
    await test.step('toggle button is present on the page', async () => {
      await expect(exchange.toggleDrawerButton).toBeVisible()
    })
  })

  test('toggle button opens and closes the drawer', async ({ exchange }) => {
    await test.step('drawer is initially closed — From button is not visible', async () => {
      await expect(exchange.fromButton).not.toBeVisible()
    })

    await test.step('click the toggle button to open the drawer', async () => {
      await exchange.toggleDrawerButton.click()
      await expect(exchange.fromButton).toBeVisible()
    })

    await test.step('click the toggle button to close the drawer', async () => {
      await exchange.toggleDrawerButton.click()
      await expect(exchange.fromButton).not.toBeVisible()
    })
  })

  test('clicking From navigates inside the widget without opening the chain sidebar', async ({
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

  test('clicking To navigates inside the widget without opening the chain sidebar', async ({
    exchange,
    tokenSelector,
  }) => {
    await test.step('open the drawer via the toggle button', async () => {
      await exchange.toggleDrawerButton.click()
    })

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

test.describe('Playground settings — Variant (Wide)', () => {
  // Reset config before each test: some tests toggle the chain sidebar which
  // persists to localStorage and would pollute subsequent tests.
  test.beforeEach(async ({ page, sidebar }) => {
    await page.goto('/')
    await sidebar.resetAll()
  })

  test('Wide is the default variant', async ({ sidebar }) => {
    await test.step('Variant nav button shows "Wide"', async () => {
      await expect(sidebar.nav.variant).toContainText('Wide')
    })

    await test.step('Wide card is visible in the variant panel', async () => {
      await sidebar.nav.variant.click()
      await expect(sidebar.variantEditor.cards.wide).toBeVisible()
    })
  })

  test('clicking From opens the chain sidebar', async ({ exchange }) => {
    await test.step('click the From token button', async () => {
      await exchange.fromButton.click()
    })

    await test.step('chain sidebar search input appears to the right of the widget', async () => {
      await expect(exchange.chainSidebar).toBeVisible()
    })
  })

  test('clicking To opens the chain sidebar', async ({ exchange }) => {
    await test.step('click the To token button', async () => {
      await exchange.toButton.click()
    })

    await test.step('chain sidebar search input appears to the right of the widget', async () => {
      await expect(exchange.chainSidebar).toBeVisible()
    })
  })

  test('disabling the chain sidebar hides the expansion when From is clicked', async ({
    sidebar,
    exchange,
  }) => {
    await test.step('open the variant panel', async () => {
      await sidebar.nav.variant.click()
    })

    await test.step('enable the "Disable chain sidebar" toggle', async () => {
      await sidebar.variantEditor.disableChainSidebar.click()
      // MUI Switch adds Mui-checked to its root element when toggled on.
      await expect(sidebar.variantEditor.disableChainSidebar).toHaveClass(
        /Mui-checked/
      )
    })

    await test.step('go back to the main view', async () => {
      await sidebar.goBack()
    })

    await test.step('click From — chain sidebar expansion does not open', async () => {
      await exchange.fromButton.click()
      await expect(exchange.chainSidebar).not.toBeVisible()
    })
  })
})
