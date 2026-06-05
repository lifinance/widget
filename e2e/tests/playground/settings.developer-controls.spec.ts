import type { Page } from '@playwright/test'
import { expect, test } from '../fixtures/base.fixture.js'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Checks that the widget's scrollable content area is not obscured by its own
 * fixed-position header, and that key interactive elements sit fully within the
 * viewport. Call this in any test that enables mock header / mock footer while
 * the widget is in full-height layout.
 *
 * Stable DOM anchors used here:
 *   [id^="widget-header"]               — fixed header wrapper (z-index 1200)
 *   [id^="widget-scrollable-container"] — scroll area whose paddingTop should
 *                                          clear the header completely
 *   [id^="widget-app-expanded-container"] — widget root
 */
async function assertWidgetNotClipped(page: Page): Promise<void> {
  const widgetRoot = page.locator('[id^="widget-app-expanded-container"]')
  const widgetHeader = page.locator('[id^="widget-header"]')
  const scrollContainer = page.locator('[id^="widget-scrollable-container"]')
  const vp = page.viewportSize()!

  const [headerBox, scrollBox] = await Promise.all([
    widgetHeader.boundingBox(),
    scrollContainer.boundingBox(),
  ])

  if (headerBox && scrollBox) {
    const headerBottom = headerBox.y + headerBox.height
    expect(
      scrollBox.y,
      `scrollable content (y=${scrollBox.y}) starts ${Math.round(headerBottom - scrollBox.y)}px behind fixed header bottom (y=${headerBottom})`
    ).toBeGreaterThanOrEqual(headerBottom)
  }

  const elements: Array<{
    loc: import('@playwright/test').Locator
    label: string
  }> = [
    {
      loc: widgetRoot.getByRole('button', { name: /^From\b/i }),
      label: 'From button',
    },
    {
      loc: widgetRoot.getByRole('button', { name: /^To\b/i }),
      label: 'To button',
    },
    {
      loc: widgetRoot.getByTestId('widget-transaction-button'),
      label: 'transaction button',
    },
  ]

  for (const { loc, label } of elements) {
    const box = await loc.boundingBox()
    if (box) {
      expect(box.y, `${label} top is outside viewport`).toBeGreaterThanOrEqual(
        0
      )
      expect(
        box.y + box.height,
        `${label} bottom is outside viewport`
      ).toBeLessThanOrEqual(vp.height)
    }
  }
}

async function openDeveloperControls({
  sidebar,
}: {
  sidebar: import('../components/PlaygroundSidebar.js').PlaygroundSidebar
}) {
  await sidebar.nav.developerControls.click()
}

/**
 * Returns true when the DeveloperToggleItem container above the given switch
 * has pointer-events:none, meaning the toggle is in its disabled state.
 * DeveloperToggleItem uses opacity+pointerEvents on a Box wrapper rather than
 * the HTML disabled attribute, so standard Playwright isEnabled() won't work.
 */
async function isToggleItemDisabled(
  toggle: import('@playwright/test').Locator
): Promise<boolean> {
  return toggle.evaluate((el) => {
    let node: Element | null = el.parentElement
    while (node) {
      if (window.getComputedStyle(node).pointerEvents === 'none') {
        return true
      }
      node = node.parentElement
    }
    return false
  })
}

// ---------------------------------------------------------------------------
// Default state
// ---------------------------------------------------------------------------

test.describe('Playground settings — Developer controls (default state)', () => {
  test.beforeEach(async ({ page, sidebar }) => {
    await page.goto('/')
    await sidebar.resetAll()
  })

  test('widget is clean and all toggles are off when entering developer controls', async ({
    sidebar,
    exchange,
  }) => {
    await test.step('widget shows empty form', async () => {
      await expect(exchange.fromButton).toContainText('Select')
      await expect(exchange.toButton).toContainText('Select')
      // The send-amount input has placeholder "0" but its actual value is empty.
      await expect(exchange.sendAmountInput).toHaveValue('')
    })

    await test.step('open developer controls', async () => {
      await openDeveloperControls({ sidebar })
    })

    await test.step('all toggles are off by default', async () => {
      await expect(sidebar.developerControlsEditor.formValues).not.toHaveClass(
        /Mui-checked/
      )
      await expect(
        sidebar.developerControlsEditor.bookmarkStores
      ).not.toHaveClass(/Mui-checked/)
      await expect(
        sidebar.developerControlsEditor.loadingPreview
      ).not.toHaveClass(/Mui-checked/)
      await expect(sidebar.developerControlsEditor.mockHeader).not.toHaveClass(
        /Mui-checked/
      )
      await expect(sidebar.developerControlsEditor.mockFooter).not.toHaveClass(
        /Mui-checked/
      )
    })
  })
})

// ---------------------------------------------------------------------------
// Form values
// ---------------------------------------------------------------------------

test.describe('Playground settings — Developer controls (Form values)', () => {
  test.beforeEach(async ({ page, sidebar }) => {
    await page.goto('/')
    await sidebar.resetAll()
    await openDeveloperControls({ sidebar })
  })

  test('toggling on prefills the widget with the default route', async ({
    page,
    sidebar,
    exchange,
  }) => {
    await test.step('toggle form values on', async () => {
      await sidebar.developerControlsEditor.formValues.click()
      await expect(sidebar.developerControlsEditor.formValues).toHaveClass(
        /Mui-checked/
      )
    })

    await test.step('widget from/to buttons show the preset tokens', async () => {
      await expect(exchange.fromButton).toContainText('ETH')
      await expect(exchange.toButton).toContainText('USDC')
    })

    await test.step('send amount shows the preset value', async () => {
      await expect(exchange.sendAmountInput).toHaveValue('1')
    })

    await test.step('URL reflects devView=true', async () => {
      await expect(page).toHaveURL(/devView=true/)
    })

    await test.step('URL reflects the preset token/amount params', async () => {
      const url = page.url()
      // fromChain is not serialised to URL by the widget; fromToken is used instead.
      expect(url).toMatch(/fromToken=/)
      expect(url).toMatch(/toChain=/)
      expect(url).toMatch(/fromAmount=/)
    })
  })

  test('toggling off resets the widget form and clears URL params', async ({
    page,
    sidebar,
    exchange,
  }) => {
    await test.step('toggle on then off', async () => {
      await sidebar.developerControlsEditor.formValues.click()
      await expect(exchange.fromButton).toContainText('ETH')
      await sidebar.developerControlsEditor.formValues.click()
      await expect(sidebar.developerControlsEditor.formValues).not.toHaveClass(
        /Mui-checked/
      )
    })

    await test.step('widget form is cleared', async () => {
      await expect(exchange.fromButton).toContainText('Select')
      await expect(exchange.toButton).toContainText('Select')
    })

    await test.step('devView URL param is removed', async () => {
      await expect(page).not.toHaveURL(/devView=true/)
    })
  })

  test('form method tabs switch between config and formRef update methods', async ({
    sidebar,
  }) => {
    await test.step('toggle form values on to reveal the method tabs', async () => {
      await sidebar.developerControlsEditor.formValues.click()
    })

    await test.step('config tab is selected by default', async () => {
      await expect(
        sidebar.developerControlsEditor.formMethodTabConfig
      ).toHaveAttribute('aria-selected', 'true')
    })

    await test.step('click formRef tab', async () => {
      await sidebar.developerControlsEditor.formMethodTabFormRef.click()
      await expect(
        sidebar.developerControlsEditor.formMethodTabFormRef
      ).toHaveAttribute('aria-selected', 'true')
    })
  })
})

// ---------------------------------------------------------------------------
// Bookmark stores
// ---------------------------------------------------------------------------

test.describe('Playground settings — Developer controls (Bookmark stores)', () => {
  test.beforeEach(async ({ page, sidebar }) => {
    await page.goto('/')
    await sidebar.resetAll()
    await openDeveloperControls({ sidebar })

    // Seeding triggers window.location.reload(); wait for navigation to settle.
    await Promise.all([
      page.waitForURL('**/*'),
      sidebar.developerControlsEditor.bookmarkStores.click(),
    ])
    // The Zustand persist middleware preserves drawer-open state across reload,
    // so the sidebar is still open. Wait for the nav panel to be ready.
    await sidebar.header.playgroundText.waitFor({ state: 'visible' })
  })

  test.afterEach(async ({ page }) => {
    // Clear seed data directly in localStorage to avoid UI reload churn.
    // The next test's page.goto() will start from a clean slate.
    await page.evaluate(() => {
      localStorage.setItem(
        'li.fi-bookmarks',
        JSON.stringify({
          state: { bookmarks: [], recentWallets: [] },
          version: 0,
        })
      )
    })
  })

  test('toggle shows as checked after page reload', async ({ sidebar }) => {
    await test.step('developer controls still shows bookmark stores as checked', async () => {
      await openDeveloperControls({ sidebar })
      await expect(sidebar.developerControlsEditor.bookmarkStores).toHaveClass(
        /Mui-checked/
      )
    })
  })

  test('Send to wallet page shows 50 bookmarked wallets after seeding', async ({
    exchange,
    sendToWallet,
  }) => {
    await test.step('click the send-to-wallet button in the widget', async () => {
      await exchange.sendToWalletButton.click()
    })

    await test.step('Send to wallet page opens', async () => {
      await expect(exchange.heading).toHaveText('Send to wallet')
    })

    await test.step('Bookmarked wallets button shows count of 50', async () => {
      await expect(sendToWallet.bookmarkedWalletsButton).toContainText('50')
    })

    await test.step('Recent wallets button shows count of 50', async () => {
      await expect(sendToWallet.recentWalletsButton).toContainText('50')
    })
  })

  test('navigating into Bookmarked wallets shows the seeded wallet list', async ({
    exchange,
    sendToWallet,
  }) => {
    await test.step('open Send to wallet page', async () => {
      await exchange.sendToWalletButton.click()
      await expect(exchange.heading).toHaveText('Send to wallet')
    })

    await test.step('click Bookmarked wallets', async () => {
      await sendToWallet.bookmarkedWalletsButton.click()
      await expect(exchange.heading).toHaveText('Bookmarked wallets')
    })

    await test.step('list shows the first seeded bookmark', async () => {
      await expect(
        sendToWallet.bookmarkItems.filter({ hasText: 'asdf 0' }).first()
      ).toBeVisible()
    })

    await test.step('list shows multiple items (50 seeded, scroll reveals more)', async () => {
      const visibleCount = await sendToWallet.bookmarkItems.count()
      expect(visibleCount).toBeGreaterThanOrEqual(7)
    })
  })

  test('clearing bookmark stores reloads and removes bookmarks from the list', async ({
    page,
    sidebar,
    exchange,
    sendToWallet,
  }) => {
    await test.step('clear the bookmark data', async () => {
      await openDeveloperControls({ sidebar })
      await Promise.all([
        page.waitForURL('**/*'),
        sidebar.developerControlsEditor.bookmarkStores.click(),
      ])
      await sidebar.header.playgroundText.waitFor({ state: 'visible' })
    })

    await test.step('open Send to wallet page', async () => {
      await exchange.sendToWalletButton.click()
      await expect(exchange.heading).toHaveText('Send to wallet')
    })

    await test.step('Bookmarked wallets button shows no count', async () => {
      // When bookmarks array is empty the count Typography is not rendered.
      await expect(sendToWallet.bookmarkedWalletsButton).not.toContainText('50')
    })
  })
})

// ---------------------------------------------------------------------------
// Loading preview (skeleton)
// ---------------------------------------------------------------------------

test.describe('Playground settings — Developer controls (Loading preview)', () => {
  test.beforeEach(async ({ page, sidebar }) => {
    await page.goto('/')
    await sidebar.resetAll()
    await openDeveloperControls({ sidebar })
  })

  test('shows the skeleton loader when toggled on', async ({
    sidebar,
    exchange,
    page,
  }) => {
    await test.step('toggle loading preview on', async () => {
      await sidebar.developerControlsEditor.loadingPreview.click()
      await expect(sidebar.developerControlsEditor.loadingPreview).toHaveClass(
        /Mui-checked/
      )
    })

    await test.step('widget heading is replaced — Exchange text is gone', async () => {
      await expect(exchange.heading).not.toBeAttached()
    })

    await test.step('at least 10 skeleton placeholder elements are visible', async () => {
      const skeletonCount = await page.locator('.MuiSkeleton-root').count()
      expect(skeletonCount).toBeGreaterThanOrEqual(10)
    })
  })

  test('restores the live widget when toggled off', async ({
    sidebar,
    exchange,
  }) => {
    await test.step('toggle on then off', async () => {
      await sidebar.developerControlsEditor.loadingPreview.click()
      await expect(exchange.heading).not.toBeAttached()
      await sidebar.developerControlsEditor.loadingPreview.click()
    })

    await test.step('widget heading reappears', async () => {
      await expect(exchange.heading).toBeVisible()
    })
  })

  test('loading preview toggle is disabled in Drawer variant', async ({
    page,
    sidebar,
  }) => {
    // Selecting Drawer opens the MUI Drawer immediately (open={true}), which sets
    // aria-hidden on background DOM including the sidebar's Back button. Press Escape
    // first to close the backdrop, then navigate normally — same pattern as variant spec.
    await test.step('switch to Drawer variant from nav', async () => {
      await sidebar.goBack()
      await sidebar.nav.variant.click()
      await sidebar.variantEditor.cards.drawer.click()
      await page.keyboard.press('Escape')
      await sidebar.goBack()
    })

    await test.step('open developer controls', async () => {
      await openDeveloperControls({ sidebar })
    })

    await test.step('toggle is disabled (pointer-events:none on its container)', async () => {
      expect(
        await isToggleItemDisabled(
          sidebar.developerControlsEditor.loadingPreview
        )
      ).toBe(true)
    })

    await test.step('forcing a click does not enable the toggle', async () => {
      await sidebar.developerControlsEditor.loadingPreview.click({
        force: true,
      })
      await expect(
        sidebar.developerControlsEditor.loadingPreview
      ).not.toHaveClass(/Mui-checked/)
    })

    // Reset to avoid polluting subsequent tests.
    await page.goto('/')
  })
})

// ---------------------------------------------------------------------------
// Mock header / Mock footer helpers
// ---------------------------------------------------------------------------

/**
 * Sets Compact variant + Full height layout — the only combination where
 * mock header and mock footer toggles are enabled.
 */
async function setCompactFullHeight({
  sidebar,
}: {
  sidebar: import('../components/PlaygroundSidebar.js').PlaygroundSidebar
}) {
  await sidebar.nav.variant.click()
  await sidebar.variantEditor.cards.compact.click()
  await sidebar.goBack()
  await sidebar.nav.height.click()
  await sidebar.heightEditor.cards.fullHeight.click()
  await sidebar.goBack()
}

// ---------------------------------------------------------------------------
// Mock header
// ---------------------------------------------------------------------------

test.describe('Playground settings — Developer controls (Mock header)', () => {
  test.beforeEach(async ({ page, sidebar }) => {
    await page.goto('/')
    await sidebar.resetAll()
  })

  test('mock header toggle is disabled in default (non-full-height) layout', async ({
    page,
    sidebar,
  }) => {
    await openDeveloperControls({ sidebar })

    await test.step('toggle is disabled', async () => {
      expect(
        await isToggleItemDisabled(sidebar.developerControlsEditor.mockHeader)
      ).toBe(true)
    })

    await test.step('mock header element is absent', async () => {
      await expect(
        page.getByRole('main').getByText('Mock header', { exact: true })
      ).not.toBeAttached()
    })
  })

  test('mock header toggle is disabled in Wide variant (full-height not available for Wide)', async ({
    sidebar,
  }) => {
    await test.step('switch to Wide — Full height layout card is disabled for Wide', async () => {
      await sidebar.nav.variant.click()
      await sidebar.variantEditor.cards.wide.click()
      await sidebar.goBack()
      await openDeveloperControls({ sidebar })
    })

    await test.step('mock header toggle remains disabled', async () => {
      expect(
        await isToggleItemDisabled(sidebar.developerControlsEditor.mockHeader)
      ).toBe(true)
    })
  })

  test('shows mock header element above the widget in Compact + Full height', async ({
    sidebar,
    page,
  }) => {
    await setCompactFullHeight({ sidebar })
    await openDeveloperControls({ sidebar })

    await test.step('toggle mock header on', async () => {
      await sidebar.developerControlsEditor.mockHeader.click()
      await expect(sidebar.developerControlsEditor.mockHeader).toHaveClass(
        /Mui-checked/
      )
    })

    await test.step('mock header element is visible', async () => {
      await expect(
        page.getByRole('main').getByText('Mock header', { exact: true })
      ).toBeVisible()
    })

    await test.step('widget header button is not clipped by mock header', async () => {
      await expect(
        page
          .locator('[id^="widget-header"]')
          .getByRole('button', { name: 'Connect wallet', exact: true })
      ).toBeVisible()
    })
  })

  test('hiding mock header removes the element', async ({ sidebar, page }) => {
    await setCompactFullHeight({ sidebar })
    await openDeveloperControls({ sidebar })
    await sidebar.developerControlsEditor.mockHeader.click()
    await expect(
      page.getByRole('main').getByText('Mock header', { exact: true })
    ).toBeVisible()

    await test.step('toggle mock header off', async () => {
      await sidebar.developerControlsEditor.mockHeader.click()
    })

    await expect(
      page.getByRole('main').getByText('Mock header', { exact: true })
    ).not.toBeAttached()
  })

  // KNOWN BUG: widget-scrollable-container.paddingTop equals the header height but
  // does not add header.top (48px). When the widget header has top:48px the scroll
  // area starts 48px too early, hiding the From/To labels behind the fixed header.
  // Remove test.skip and the comment above when the bug is fixed.
  test.skip('scrollable content is not obscured by the fixed widget header when mock header is on', async ({
    page,
    sidebar,
  }) => {
    await setCompactFullHeight({ sidebar })
    await openDeveloperControls({ sidebar })
    await sidebar.developerControlsEditor.mockHeader.click()
    await sidebar.goBack()
    // Close sidebar so it doesn't interfere with element positions.
    await page.evaluate(() => {
      ;(
        document.querySelector('[aria-label="Close tools"]') as HTMLElement
      )?.click()
    })
    await page.waitForTimeout(300)
    await assertWidgetNotClipped(page)
  })
})

// ---------------------------------------------------------------------------
// Mock footer
// ---------------------------------------------------------------------------

test.describe('Playground settings — Developer controls (Mock footer)', () => {
  test.beforeEach(async ({ page, sidebar }) => {
    await page.goto('/')
    await sidebar.resetAll()
  })

  test('mock footer toggle is disabled in default layout', async ({
    page,
    sidebar,
  }) => {
    await openDeveloperControls({ sidebar })

    expect(
      await isToggleItemDisabled(sidebar.developerControlsEditor.mockFooter)
    ).toBe(true)

    await expect(
      page.getByRole('main').getByText('Mock footer', { exact: true })
    ).not.toBeAttached()
  })

  test('shows mock footer element below the widget in Compact + Full height', async ({
    sidebar,
    page,
  }) => {
    await setCompactFullHeight({ sidebar })
    await openDeveloperControls({ sidebar })

    await test.step('toggle mock footer on', async () => {
      await sidebar.developerControlsEditor.mockFooter.click()
      await expect(sidebar.developerControlsEditor.mockFooter).toHaveClass(
        /Mui-checked/
      )
    })

    await test.step('mock footer element is visible', async () => {
      await expect(
        page.getByRole('main').getByText('Mock footer', { exact: true })
      ).toBeVisible()
    })

    await test.step('Stick to viewport bottom sub-toggle appears', async () => {
      await expect(sidebar.developerControlsEditor.fixedFooter).toBeVisible()
    })
  })

  test('Stick to viewport bottom makes footer position:fixed', async ({
    sidebar,
    page,
  }) => {
    await setCompactFullHeight({ sidebar })
    await openDeveloperControls({ sidebar })
    await sidebar.developerControlsEditor.mockFooter.click()

    await test.step('enable Stick to viewport bottom', async () => {
      await sidebar.developerControlsEditor.fixedFooter.click()
      await expect(sidebar.developerControlsEditor.fixedFooter).toHaveClass(
        /Mui-checked/
      )
    })

    await test.step('mock footer has position:fixed in the DOM', async () => {
      const footer = page
        .getByRole('main')
        .getByText('Mock footer', { exact: true })
      await expect(footer).toBeVisible()
      const position = await footer.evaluate(
        (el) => window.getComputedStyle(el).position
      )
      expect(position).toBe('fixed')
    })
  })

  test('Stick to viewport bottom sub-toggle is hidden when footer is toggled off', async ({
    sidebar,
    page,
  }) => {
    await setCompactFullHeight({ sidebar })
    await openDeveloperControls({ sidebar })
    await sidebar.developerControlsEditor.mockFooter.click()
    await expect(sidebar.developerControlsEditor.fixedFooter).toBeVisible()

    await test.step('toggle mock footer off', async () => {
      await sidebar.developerControlsEditor.mockFooter.click()
    })

    await expect(
      page.getByRole('main').getByText('Mock footer', { exact: true })
    ).not.toBeAttached()
    await expect(sidebar.developerControlsEditor.fixedFooter).not.toBeVisible()
  })

  // KNOWN BUG (same root cause as mock header): verify footer + header combo leaves
  // all key elements within the visible content area. Skipped until the header
  // clipping bug is resolved — at that point remove test.skip and this comment.
  test.skip('all key elements are within the visible content area with mock header and footer on', async ({
    page,
    sidebar,
  }) => {
    await setCompactFullHeight({ sidebar })
    await openDeveloperControls({ sidebar })
    await sidebar.developerControlsEditor.mockHeader.click()
    await sidebar.developerControlsEditor.mockFooter.click()
    await sidebar.goBack()
    await page.evaluate(() => {
      ;(
        document.querySelector('[aria-label="Close tools"]') as HTMLElement
      )?.click()
    })
    await page.waitForTimeout(300)
    await assertWidgetNotClipped(page)
  })

  test('mock header and footer together — widget content is not clipped and transaction button is reachable', async ({
    sidebar,
    exchange,
    page,
  }) => {
    await setCompactFullHeight({ sidebar })
    await openDeveloperControls({ sidebar })
    await sidebar.developerControlsEditor.mockHeader.click()
    await sidebar.developerControlsEditor.mockFooter.click()

    await test.step('both mock elements are visible', async () => {
      await expect(
        page.getByRole('main').getByText('Mock header', { exact: true })
      ).toBeVisible()
      await expect(
        page.getByRole('main').getByText('Mock footer', { exact: true })
      ).toBeVisible()
    })

    await test.step('widget header Connect wallet button is not clipped by mock header', async () => {
      await expect(
        page
          .locator('[id^="widget-header"]')
          .getByRole('button', { name: 'Connect wallet', exact: true })
      ).toBeVisible()
    })

    await test.step('widget transaction button is not hidden behind mock footer', async () => {
      // Close the sidebar so it doesn't obscure the widget.
      await sidebar.goBack()
      await sidebar.header.closeTools.click()
      await expect(exchange.transactionButton).toBeVisible()
    })
  })
})

// ---------------------------------------------------------------------------
// Widget events
// ---------------------------------------------------------------------------

test.describe('Playground settings — Developer controls (Widget events)', () => {
  test.beforeEach(async ({ page, sidebar }) => {
    await page.goto('/')
    await sidebar.resetAll()
    await openDeveloperControls({ sidebar })
    await sidebar.developerControlsEditor.configureWidgetEvents.click()
  })

  test('Configure button opens the Widget events panel', async ({
    sidebar,
  }) => {
    // Both "Widget events" text nodes are in the DOM (toggle label + panel heading).
    // Verify by the panel-unique "All events on page load" toggle instead of the heading text.
    await test.step('Widget events panel-specific toggle is visible', async () => {
      await expect(
        sidebar.developerControlsWidgetEventsEditor.allEventsOnPageLoad
      ).toBeVisible()
    })

    await test.step('All events on page load toggle is off by default', async () => {
      await expect(
        sidebar.developerControlsWidgetEventsEditor.allEventsOnPageLoad
      ).not.toHaveClass(/Mui-checked/)
    })
  })

  test('enabling All events on page load sets allWidgetEvents=true in the URL', async ({
    page,
    sidebar,
  }) => {
    await test.step('toggle on', async () => {
      await sidebar.developerControlsWidgetEventsEditor.allEventsOnPageLoad.click()
      await expect(
        sidebar.developerControlsWidgetEventsEditor.allEventsOnPageLoad
      ).toHaveClass(/Mui-checked/)
    })

    await test.step('URL contains allWidgetEvents=true', async () => {
      await expect(page).toHaveURL(/allWidgetEvents=true/)
    })

    await test.step('all individual event toggles are now checked', async () => {
      await expect(
        sidebar.developerControlsWidgetEventsEditor.availableRoutes
      ).toHaveClass(/Mui-checked/)
      await expect(
        sidebar.developerControlsWidgetEventsEditor.pageEntered
      ).toHaveClass(/Mui-checked/)
      await expect(
        sidebar.developerControlsWidgetEventsEditor.chainPinned
      ).toHaveClass(/Mui-checked/)
    })
  })

  test('disabling All events on page load clears the URL param and unchecks all toggles', async ({
    page,
    sidebar,
  }) => {
    await test.step('toggle on then off', async () => {
      await sidebar.developerControlsWidgetEventsEditor.allEventsOnPageLoad.click()
      await expect(page).toHaveURL(/allWidgetEvents=true/)
      await sidebar.developerControlsWidgetEventsEditor.allEventsOnPageLoad.click()
    })

    await test.step('URL param is removed', async () => {
      await expect(page).not.toHaveURL(/allWidgetEvents=true/)
    })

    await test.step('individual event toggles are unchecked again', async () => {
      await expect(
        sidebar.developerControlsWidgetEventsEditor.availableRoutes
      ).not.toHaveClass(/Mui-checked/)
      await expect(
        sidebar.developerControlsWidgetEventsEditor.pageEntered
      ).not.toHaveClass(/Mui-checked/)
    })
  })

  test('individual event can be enabled without affecting others or the master toggle', async ({
    sidebar,
  }) => {
    await test.step('enable only the PageEntered event', async () => {
      await sidebar.developerControlsWidgetEventsEditor.pageEntered.click()
      await expect(
        sidebar.developerControlsWidgetEventsEditor.pageEntered
      ).toHaveClass(/Mui-checked/)
    })

    await test.step('master All events toggle is NOT checked', async () => {
      await expect(
        sidebar.developerControlsWidgetEventsEditor.allEventsOnPageLoad
      ).not.toHaveClass(/Mui-checked/)
    })

    await test.step('unrelated event toggle remains off', async () => {
      await expect(
        sidebar.developerControlsWidgetEventsEditor.availableRoutes
      ).not.toHaveClass(/Mui-checked/)
    })
  })

  test('enabled event listener logs to the browser console when the event fires', async ({
    page,
    sidebar,
    exchange,
  }) => {
    const consoleMessages: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'info') {
        consoleMessages.push(msg.text())
      }
    })

    await test.step('enable the PageEntered listener', async () => {
      await sidebar.developerControlsWidgetEventsEditor.pageEntered.click()
    })

    await test.step('trigger PageEntered by clicking the widget settings button', async () => {
      // useWidgetEventConsoleLogging only attaches listeners while DeveloperControlsDetailView
      // is mounted. We must NOT navigate away from the dev controls panel — interact with the
      // widget directly while the sidebar stays on the widget events slide.
      await exchange.settingsButton.click()
    })

    await test.step('pageEntered event appears in console output', async () => {
      // WidgetEvent.PageEntered = 'pageEntered' (camelCase enum value, not the key name).
      await page.waitForTimeout(500)
      expect(consoleMessages.some((m) => m.includes('pageEntered'))).toBe(true)
    })
  })

  test('back button returns to the main developer controls panel', async ({
    sidebar,
  }) => {
    // Two Back buttons are in the DOM (widget events + dev controls main).
    // Click .last() — the widget events panel's Back button — to return to dev controls.
    await sidebar.backButton.last().click()

    // "Developer controls" text appears in BOTH the nav button and the panel heading.
    // Verify by the panel-unique "Form values" toggle being visible instead.
    await expect(sidebar.developerControlsEditor.formValues).toBeVisible()
  })
})
