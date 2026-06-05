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
})
