import { expect, test } from '../fixtures/base.fixture.js'

// Helper: open the wallet management panel from the nav.
async function openWalletManagement({
  sidebar,
}: {
  sidebar: import('../components/PlaygroundSidebar.js').PlaygroundSidebar
}) {
  await sidebar.nav.walletManagement.click()
}

test.describe('Playground settings — Wallet management (Internal)', () => {
  test.beforeEach(async ({ page, sidebar }) => {
    await page.goto('/')
    await sidebar.resetAll()
  })

  test('Internal is the default mode', async ({ sidebar }) => {
    await test.step('nav button shows "Internal"', async () => {
      await expect(sidebar.nav.walletManagement).toContainText('Internal')
    })

    await test.step('Internal card is selected in the panel', async () => {
      await openWalletManagement({ sidebar })
      await expect(sidebar.walletManagementEditor.cards.internal).toBeVisible()
    })
  })

  test('header Connect wallet button is visible', async ({ exchange }) => {
    await expect(exchange.walletHeaderButton).toBeVisible()
  })

  test('appkit-button is not present in Internal mode', async ({
    exchange,
  }) => {
    await expect(exchange.appkitButton).not.toBeAttached()
  })

  test('clicking the header Connect wallet button opens the internal wallet menu', async ({
    exchange,
  }) => {
    await test.step('click the header Connect wallet button', async () => {
      await exchange.walletHeaderButton.click()
    })

    await test.step('internal wallet modal opens', async () => {
      await expect(exchange.walletModalContent).toBeVisible()
    })

    await test.step('modal shows "Select a wallet" heading', async () => {
      await expect(exchange.walletModalHeading).toBeVisible()
    })
  })

  test('clicking the transaction Connect wallet button opens the internal wallet menu', async ({
    exchange,
  }) => {
    await test.step('click the transaction Connect wallet button', async () => {
      await exchange.transactionButton.click()
    })

    await test.step('internal wallet modal opens', async () => {
      await expect(exchange.walletModalContent).toBeVisible()
    })

    await test.step('modal shows "Select a wallet" heading', async () => {
      await expect(exchange.walletModalHeading).toBeVisible()
    })
  })

  test('"Read docs" link points to the wallet management docs', async ({
    context,
    sidebar,
  }) => {
    await test.step('open the wallet management panel', async () => {
      await openWalletManagement({ sidebar })
    })

    await test.step('docs link is visible', async () => {
      await expect(sidebar.walletManagementEditor.docsLink).toBeVisible()
    })

    await test.step('clicking it opens a new tab with the wallet management docs URL', async () => {
      // Start listening for the new page before clicking so the event isn't missed.
      const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        sidebar.walletManagementEditor.docsLink.click(),
      ])
      await newPage.waitForLoadState('domcontentloaded')
      expect(newPage.url()).toBe('https://docs.li.fi/widget/wallet-management')
    })
  })
})

test.describe('Playground settings — Wallet management (External)', () => {
  test.beforeEach(async ({ page, sidebar }) => {
    await page.goto('/')
    await sidebar.resetAll()
    await openWalletManagement({ sidebar })
    await sidebar.walletManagementEditor.cards.external.click()
    await sidebar.goBack()
  })

  test('nav button shows "External"', async ({ sidebar }) => {
    await expect(sidebar.nav.walletManagement).toContainText('External')
  })

  test('header Connect wallet button is not visible', async ({ exchange }) => {
    await expect(exchange.walletHeaderButton).not.toBeVisible()
  })

  test('appkit-button is present in the playground toolbar', async ({
    exchange,
  }) => {
    await expect(exchange.appkitButton).toBeAttached()
  })

  test('Force internal wallets toggle is shown inside the External card', async ({
    sidebar,
  }) => {
    await test.step('open wallet management panel', async () => {
      await openWalletManagement({ sidebar })
    })

    await test.step('Force internal wallets toggle is visible', async () => {
      await expect(
        sidebar.walletManagementEditor.forceInternalWallets
      ).toBeVisible()
    })
  })

  test('clicking the transaction button opens the AppKit modal, not the internal wallet menu', async ({
    exchange,
  }) => {
    await test.step('click the transaction Connect wallet button', async () => {
      await exchange.transactionButton.click()
    })

    // In External mode the click invokes walletConfig.onConnect (AppKit), not openWalletMenu.
    await test.step('AppKit modal opens', async () => {
      await expect(exchange.appkitModal).toBeVisible()
    })

    await test.step('internal wallet modal does not open', async () => {
      await expect(exchange.walletModalContent).not.toBeVisible()
    })
  })

  test('navigation header shows a Close button in External mode (Drawer variant, no Force internal)', async ({
    sidebar,
    exchange,
  }) => {
    // CloseDrawerButton is only rendered in variant=drawer AND External mode without Force internal.
    // Switch to Drawer variant first so the button is actually mounted.
    await test.step('switch to Drawer variant', async () => {
      await sidebar.nav.variant.click()
      await sidebar.variantEditor.cards.drawer.click()
      // Switching to Drawer opens the MUI Drawer automatically, putting the sidebar behind the
      // backdrop. Close the drawer via the widget Close button first, then navigate back in the
      // sidebar so the nav panel is restored for subsequent steps.
      await exchange.closeDrawerButton.click()
      await sidebar.goBack()
    })

    await test.step('open the drawer to see the widget header', async () => {
      await exchange.toggleDrawerButton.click()
    })

    // CloseDrawerButton is located by data-testid="widget-close-drawer-button" (icon-only, no text).
    await test.step('Close button is visible in the widget header', async () => {
      await expect(exchange.closeDrawerButton).toBeVisible()
    })

    // Sanity: the internal wallet header button is absent in pure External mode.
    await test.step('Connect wallet header button is not visible', async () => {
      await expect(exchange.walletHeaderButton).not.toBeVisible()
    })
  })

  test('switching from External with Force internal to Partial clears the force-internal flag', async ({
    sidebar,
    exchange,
  }) => {
    await test.step('enable Force internal wallets while in External mode', async () => {
      await openWalletManagement({ sidebar })
      // Toggle is only rendered when External is the active mode.
      await sidebar.walletManagementEditor.forceInternalWallets.click()
      // MUI Switch adds Mui-checked to its root element when toggled on.
      await expect(
        sidebar.walletManagementEditor.forceInternalWallets
      ).toHaveClass(/Mui-checked/)
    })

    await test.step('switch to Partial mode', async () => {
      await sidebar.walletManagementEditor.cards.partial.click()
    })

    // forceInternalWallets toggle lives inside a Collapse with unmountOnExit — it is removed
    // from the DOM when the mode is not External. Use not.toBeAttached() rather than not.toBeVisible().
    await test.step('Force internal wallets toggle is removed from the DOM', async () => {
      await expect(
        sidebar.walletManagementEditor.forceInternalWallets
      ).not.toBeAttached()
    })

    await test.step('Partial mode still shows the header wallet button', async () => {
      await expect(exchange.walletHeaderButton).toBeVisible()
    })

    await test.step('Partial mode still has the AppKit button attached', async () => {
      await expect(exchange.appkitButton).toBeAttached()
    })
  })
})

test.describe('Playground settings — Wallet management (External + Force internal wallets)', () => {
  test.beforeEach(async ({ page, sidebar }) => {
    await page.goto('/')
    await sidebar.resetAll()
    await openWalletManagement({ sidebar })
    await sidebar.walletManagementEditor.cards.external.click()
    // Toggle is only rendered when External is selected; click it while the panel is open.
    await sidebar.walletManagementEditor.forceInternalWallets.click()
    await sidebar.goBack()
  })

  test('Force internal wallets toggle is on', async ({ sidebar }) => {
    await test.step('open wallet management panel', async () => {
      await openWalletManagement({ sidebar })
    })

    // MUI Switch adds Mui-checked to its root element when toggled on.
    await test.step('toggle shows as checked', async () => {
      await expect(
        sidebar.walletManagementEditor.forceInternalWallets
      ).toHaveClass(/Mui-checked/)
    })
  })

  test('header Connect wallet button reappears', async ({ exchange }) => {
    // forceInternalWalletManagement=true → useExternalWalletProvidersOnly=false → WalletHeader renders.
    await expect(exchange.walletHeaderButton).toBeVisible()
  })

  test('appkit-button remains present', async ({ exchange }) => {
    await expect(exchange.appkitButton).toBeAttached()
  })

  test('clicking the transaction button opens the internal wallet menu', async ({
    exchange,
  }) => {
    await test.step('click the transaction Connect wallet button', async () => {
      await exchange.transactionButton.click()
    })

    // forceInternalWalletManagement=true → BaseTransactionButton falls through to openWalletMenu().
    await test.step('internal wallet modal opens', async () => {
      await expect(exchange.walletModalContent).toBeVisible()
    })

    await test.step('modal shows "Select a wallet" heading', async () => {
      await expect(exchange.walletModalHeading).toBeVisible()
    })
  })
})

test.describe('Playground settings — Wallet management (Partial)', () => {
  test.beforeEach(async ({ page, sidebar }) => {
    await page.goto('/')
    await sidebar.resetAll()
    await openWalletManagement({ sidebar })
    await sidebar.walletManagementEditor.cards.partial.click()
    await sidebar.goBack()
  })

  test('nav button shows "Partial"', async ({ sidebar }) => {
    await expect(sidebar.nav.walletManagement).toContainText('Partial')
  })

  test('header Connect wallet button is visible', async ({ exchange }) => {
    // usePartialWalletManagement=true → useExternalWalletProvidersOnly=false → WalletHeader renders.
    await expect(exchange.walletHeaderButton).toBeVisible()
  })

  test('appkit-button is present in the playground toolbar', async ({
    exchange,
  }) => {
    await expect(exchange.appkitButton).toBeAttached()
  })

  test('Force internal wallets toggle is not shown in Partial mode', async ({
    sidebar,
  }) => {
    await test.step('open wallet management panel', async () => {
      await openWalletManagement({ sidebar })
    })

    // forceInternalFooter is only rendered when activeMode === 'external'.
    await test.step('Force internal wallets toggle is absent', async () => {
      await expect(
        sidebar.walletManagementEditor.forceInternalWallets
      ).not.toBeVisible()
    })
  })

  test('clicking the header button opens the internal wallet menu', async ({
    exchange,
  }) => {
    await test.step('click the header Connect wallet button', async () => {
      await exchange.walletHeaderButton.click()
    })

    // usePartialWalletManagement=true → ConnectButton falls through to openWalletMenu().
    await test.step('internal wallet modal opens', async () => {
      await expect(exchange.walletModalContent).toBeVisible()
    })

    await test.step('modal shows "Select a wallet" heading', async () => {
      await expect(exchange.walletModalHeading).toBeVisible()
    })
  })

  test('clicking the transaction button opens the AppKit modal, not the internal wallet menu', async ({
    exchange,
  }) => {
    await test.step('click the transaction Connect wallet button', async () => {
      await exchange.transactionButton.click()
    })

    // BaseTransactionButton has no usePartialWalletManagement guard — it calls onConnect() (external).
    await test.step('AppKit modal opens', async () => {
      await expect(exchange.appkitModal).toBeVisible()
    })

    await test.step('internal wallet modal does not open', async () => {
      await expect(exchange.walletModalContent).not.toBeVisible()
    })
  })
})

test.describe('Playground settings — Wallet management (Reset)', () => {
  test('Reset returns wallet management to Internal', async ({
    page,
    sidebar,
  }) => {
    await page.goto('/')
    await sidebar.resetAll()

    await test.step('switch to External', async () => {
      await openWalletManagement({ sidebar })
      await sidebar.walletManagementEditor.cards.external.click()
    })

    await test.step('click Reset wallet management', async () => {
      await sidebar.walletManagementEditor.reset.click()
    })

    await test.step('nav button shows Internal again', async () => {
      await sidebar.goBack()
      await expect(sidebar.nav.walletManagement).toContainText('Internal')
    })
  })

  test('Reset wallet management from Partial returns to Internal', async ({
    page,
    sidebar,
    exchange,
  }) => {
    await page.goto('/')
    await sidebar.resetAll()

    await test.step('switch to Partial and confirm nav label', async () => {
      await openWalletManagement({ sidebar })
      await sidebar.walletManagementEditor.cards.partial.click()
      await sidebar.goBack()
      await expect(sidebar.nav.walletManagement).toContainText('Partial')
    })

    await test.step('click Reset wallet management', async () => {
      await openWalletManagement({ sidebar })
      await sidebar.walletManagementEditor.reset.click()
      await sidebar.goBack()
    })

    await test.step('nav button shows Internal', async () => {
      await expect(sidebar.nav.walletManagement).toContainText('Internal')
    })

    // Back to Internal: AppKit button should be gone and the header wallet button should reappear.
    await test.step('AppKit button is no longer attached', async () => {
      await expect(exchange.appkitButton).not.toBeAttached()
    })

    await test.step('header wallet button is visible', async () => {
      await expect(exchange.walletHeaderButton).toBeVisible()
    })
  })

  test('Reset wallet management with Force internal active reverts cleanly to Internal', async ({
    page,
    sidebar,
    exchange,
  }) => {
    await page.goto('/')
    await sidebar.resetAll()

    await test.step('switch to External and enable Force internal wallets', async () => {
      await openWalletManagement({ sidebar })
      await sidebar.walletManagementEditor.cards.external.click()
      // Toggle is only rendered when External is the active mode.
      await sidebar.walletManagementEditor.forceInternalWallets.click()
      // MUI Switch adds Mui-checked to its root element when toggled on.
      await expect(
        sidebar.walletManagementEditor.forceInternalWallets
      ).toHaveClass(/Mui-checked/)
    })

    await test.step('click Reset wallet management', async () => {
      await sidebar.walletManagementEditor.reset.click()
      await sidebar.goBack()
    })

    await test.step('nav button shows Internal', async () => {
      await expect(sidebar.nav.walletManagement).toContainText('Internal')
    })

    // forceInternalWallets toggle lives inside a Collapse with unmountOnExit — it is removed
    // from the DOM when the mode is not External.
    await test.step('Force internal wallets toggle is not present in the DOM', async () => {
      await openWalletManagement({ sidebar })
      await expect(
        sidebar.walletManagementEditor.forceInternalWallets
      ).not.toBeAttached()
    })

    // Back to pure Internal: AppKit button gone, header wallet button visible.
    await test.step('AppKit button is not attached', async () => {
      await expect(exchange.appkitButton).not.toBeAttached()
    })

    await test.step('header wallet button is visible', async () => {
      await expect(exchange.walletHeaderButton).toBeVisible()
    })
  })
})
