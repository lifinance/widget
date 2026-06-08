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

  test('Reset variant button reverts the nav label and re-enables the chain sidebar', async ({
    sidebar,
    exchange,
  }) => {
    await test.step('open variant panel and enable Disable chain sidebar', async () => {
      await sidebar.nav.variant.click()
      await sidebar.variantEditor.disableChainSidebar.click()
      // MUI Switch adds Mui-checked to its root element when toggled on.
      await expect(sidebar.variantEditor.disableChainSidebar).toHaveClass(
        /Mui-checked/
      )
    })

    await test.step('click Reset variant', async () => {
      await sidebar.variantEditor.reset.click()
    })

    await test.step('go back — nav shows "Wide"', async () => {
      await sidebar.goBack()
      await expect(sidebar.nav.variant).toContainText('Wide')
    })

    await test.step('re-open variant panel — Disable chain sidebar is no longer checked', async () => {
      await sidebar.nav.variant.click()
      // Reset calls setChainSidebarDisabled(false), clearing the Mui-checked class.
      await expect(sidebar.variantEditor.disableChainSidebar).not.toHaveClass(
        /Mui-checked/
      )
    })

    await test.step('click From — chain sidebar is visible again', async () => {
      await sidebar.goBack()
      await exchange.fromButton.click()
      await expect(exchange.chainSidebar).toBeVisible()
    })
  })

  test('Disable chain sidebar suppresses the sidebar expansion for the To button', async ({
    sidebar,
    exchange,
  }) => {
    await test.step('open variant panel and enable Disable chain sidebar', async () => {
      await sidebar.nav.variant.click()
      await sidebar.variantEditor.disableChainSidebar.click()
      // MUI Switch adds Mui-checked to its root element when toggled on.
      await expect(sidebar.variantEditor.disableChainSidebar).toHaveClass(
        /Mui-checked/
      )
    })

    await test.step('go back and click To — chain sidebar does not appear', async () => {
      await sidebar.goBack()
      await exchange.toButton.click()
      await expect(exchange.chainSidebar).not.toBeVisible()
    })
  })

  test('Disable chain sidebar toggle disappears when Compact variant is selected', async ({
    sidebar,
  }) => {
    await test.step('open the variant panel', async () => {
      await sidebar.nav.variant.click()
    })

    await test.step('Disable chain sidebar toggle is visible in Wide', async () => {
      await expect(sidebar.variantEditor.disableChainSidebar).toBeVisible()
    })

    // The Wide card footer (containing the toggle) is only rendered when
    // id === 'wide' && variant === 'wide'. Selecting Compact removes it from the DOM.
    await test.step('select Compact — Disable chain sidebar toggle is removed from DOM', async () => {
      await sidebar.variantEditor.cards.compact.click()
      await expect(sidebar.variantEditor.disableChainSidebar).not.toBeAttached()
    })
  })

  // The correct Variant docs URL is fixed in PR #767 / EMB-423 (select-widget-layout#variant).
  // On the current branch the app still links to the old select-widget-variants#variants
  // 404, so this assertion fails — test.fail() keeps it green until #767 lands, at which
  // point it turns RED (unexpected pass): the signal to remove test.fail().
  test('"Read docs" link opens the Variant docs in a new tab', async ({
    context,
    sidebar,
  }) => {
    test.fail()
    await test.step('open the variant panel', async () => {
      await sidebar.nav.variant.click()
    })

    await test.step('"Read docs" link is visible', async () => {
      await expect(sidebar.variantEditor.docsLink).toBeVisible()
    })

    await test.step('clicking the link opens a new tab with the correct URL', async () => {
      // Start listening for the new page before clicking so the event isn't missed.
      const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        sidebar.variantEditor.docsLink.click(),
      ])
      await newPage.waitForLoadState('domcontentloaded')
      expect(newPage.url()).toBe(
        'https://docs.li.fi/widget/select-widget-layout#variant'
      )
    })
  })
})
