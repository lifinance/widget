import type { Locator, Page } from '@playwright/test'

/**
 * PlaygroundSidebar — Component Object for the LI.FI Widget Playground left sidebar.
 *
 * Locators are grouped by the context in which they appear:
 *   header                            — always visible when the drawer is open
 *   nav                               — main nav panel (first slide panel)
 *   themeEditor                       — theme editor detail view (second slide panel)
 *   developerControlsEditor           — developer controls detail view
 *   developerControlsWidgetEventsEditor — widget events second-level slide view
 *   footer                            — always visible at the bottom of the drawer
 */
export class PlaygroundSidebar {
  readonly page: Page

  readonly header: {
    logo: Locator
    playgroundText: Locator
    resetConfig: Locator
    closeTools: Locator
    openTools: Locator
  }

  readonly nav: {
    mode: Locator
    variant: Locator
    height: Locator
    walletManagement: Locator
    developerControls: Locator
    theme: Locator
    themePresets: {
      selectDefault: Locator
      selectJumper: Locator
      selectAzure: Locator
      selectWatermelon: Locator
      selectWindows95: Locator
      editDefault: Locator
    }
  }

  readonly modeEditor: {
    reset: Locator
    docsLink: Locator
    cards: {
      exchange: Locator
      swapOrBridge: Locator
      swap: Locator
      bridge: Locator
      refuel: Locator
    }
  }

  readonly variantEditor: {
    reset: Locator
    docsLink: Locator
    disableChainSidebar: Locator
    cards: {
      wide: Locator
      compact: Locator
      drawer: Locator
    }
  }

  readonly heightEditor: {
    reset: Locator
    cards: {
      /** Matches "Default (fit content)" (Wide/Compact) and "Default (fill viewport)" (Drawer). */
      default: Locator
      restrictedHeight: Locator
      restrictedMaxHeight: Locator
      fullHeight: Locator
    }
    /** Number input that appears when Restricted height is selected (label: "Set height"). */
    setHeightInput: Locator
    /** Number input that appears when Restricted max height is selected (label: "Set max height"). */
    setMaxHeightInput: Locator
    /** Clears the height value when Restricted height is active. */
    clearHeight: Locator
    /** Clears the max height value when Restricted max height is active. */
    clearMaxHeight: Locator
  }

  readonly walletManagementEditor: {
    reset: Locator
    /** Only present when External mode is selected. MUI-checked class when toggled on. */
    forceInternalWallets: Locator
    cards: {
      internal: Locator
      external: Locator
      partial: Locator
    }
  }

  readonly themeEditor: {
    paletteModeTablist: Locator
    widgetBorder: Locator
    cardDropShadow: Locator
    buttonBorder: Locator
  }

  readonly developerControlsEditor: {
    /**
     * Toggle that prefills the widget with a default route (ETH→USDC, amount 1,
     * and a to-address). Updates the widget form and URL params.
     */
    formValues: Locator
    /** "config" tab in the Form values update method tab strip. */
    formMethodTabConfig: Locator
    /** "formRef" tab in the Form values update method tab strip. */
    formMethodTabFormRef: Locator
    /**
     * Toggle that seeds 50 dummy wallet addresses into localStorage for testing
     * the Bookmarked wallets screen. Causes a full page reload when toggled.
     */
    bookmarkStores: Locator
    /**
     * Toggle that replaces the widget with a skeleton loader preview.
     * Disabled (pointer-events:none) when the drawer variant is active.
     */
    loadingPreview: Locator
    /**
     * Toggle that shows a mock header element above the widget.
     * Disabled unless the current layout is full-height.
     */
    mockHeader: Locator
    /**
     * Toggle that shows a mock footer element below the widget.
     * Disabled unless the current layout is full-height.
     */
    mockFooter: Locator
    /**
     * Nested sub-toggle inside the mock footer section — only rendered when
     * mock footer is enabled. Makes the footer sticky (position:fixed at the
     * bottom of the viewport).
     */
    fixedFooter: Locator
    /** "Configure" link that navigates to the Widget events second-level slide. */
    configureWidgetEvents: Locator
  }

  readonly developerControlsWidgetEventsEditor: {
    /** Master toggle that turns on all event listeners for the current page load and sets a URL param. */
    allEventsOnPageLoad: Locator
    availableRoutes: Locator
    routeSelected: Locator
    routeExecutionStarted: Locator
    routeExecutionUpdated: Locator
    routeExecutionCompleted: Locator
    routeExecutionFailed: Locator
    routeHighValueLoss: Locator
    contactSupport: Locator
    sourceChainTokenSelected: Locator
    destinationChainTokenSelected: Locator
    sendToWalletToggled: Locator
    widgetExpanded: Locator
    pageEntered: Locator
    formFieldChanged: Locator
    settingUpdated: Locator
    tokenSearch: Locator
    lowAddressActivityConfirmed: Locator
    chainPinned: Locator
  }

  readonly footer: {
    readOurDocs: Locator
  }

  readonly backButton: Locator

  async goBack(): Promise<void> {
    await this.backButton.click()
    await this.header.playgroundText.waitFor({ state: 'visible' })
  }

  // Reset config lives in the main nav header, which is off-screen when a detail view
  // is open. Navigate back first if needed so the button is in the viewport.
  async resetAll(): Promise<void> {
    if (await this.backButton.isVisible()) {
      await this.goBack()
    }
    await this.header.resetConfig.click()
  }

  constructor(page: Page) {
    this.page = page

    this.header = {
      logo: page.getByRole('img', { name: 'LI.FI' }),
      playgroundText: page.getByText('PLAYGROUND', { exact: true }),
      resetConfig: page.getByLabel('Reset config'),
      closeTools: page.getByLabel('Close tools'),
      openTools: page.getByLabel('Open tools'),
    }

    this.nav = {
      mode: page.getByRole('button', { name: /Mode/i, exact: false }),
      variant: page.getByRole('button', { name: /Variant/i, exact: false }),
      height: page.getByRole('button', { name: /Height/i, exact: false }),
      walletManagement: page.getByRole('button', {
        name: /Wallet management/i,
        exact: false,
      }),
      developerControls: page.getByRole('button', {
        name: /Developer controls/i,
        exact: false,
      }),
      theme: page.getByRole('button', { name: /Theme/i, exact: false }),
      themePresets: {
        selectDefault: page.getByLabel('Select Default theme'),
        selectJumper: page.getByLabel('Select Jumper theme'),
        selectAzure: page.getByLabel('Select Azure theme'),
        selectWatermelon: page.getByLabel('Select Watermelon theme'),
        selectWindows95: page.getByLabel('Select Windows 95 theme'),
        editDefault: page.getByRole('button', {
          name: 'Edit Default theme',
          exact: true,
        }),
      },
    }

    // CardSelect components render as div[role="button"], distinguishing them from
    // nav panel <button> elements even when both panels are in the DOM.
    this.modeEditor = {
      reset: page.getByLabel('Reset mode'),
      docsLink: page.getByRole('link', { name: 'Read docs', exact: true }),
      cards: {
        exchange: page
          .locator('div[role="button"]')
          .filter({ has: page.getByText('Exchange', { exact: true }) }),
        swapOrBridge: page
          .locator('div[role="button"]')
          .filter({ has: page.getByText('Swap or Bridge', { exact: true }) }),
        swap: page
          .locator('div[role="button"]')
          .filter({ has: page.getByText('Swap', { exact: true }) }),
        bridge: page
          .locator('div[role="button"]')
          .filter({ has: page.getByText('Bridge', { exact: true }) }),
        refuel: page
          .locator('div[role="button"]')
          .filter({ has: page.getByText('Refuel', { exact: true }) }),
      },
    }

    this.variantEditor = {
      reset: page.getByLabel('Reset variant'),
      docsLink: page.getByRole('link', { name: 'Read docs', exact: true }),
      disableChainSidebar: page.getByLabel('Disable chain sidebar', {
        exact: true,
      }),
      cards: {
        wide: page
          .locator('div[role="button"]')
          .filter({ has: page.getByText('Wide', { exact: true }) }),
        compact: page
          .locator('div[role="button"]')
          .filter({ has: page.getByText('Compact', { exact: true }) }),
        drawer: page
          .locator('div[role="button"]')
          .filter({ has: page.getByText('Drawer', { exact: true }) }),
      },
    }

    this.walletManagementEditor = {
      reset: page.getByLabel('Reset wallet management'),
      forceInternalWallets: page.getByLabel('Force internal wallet management'),
      cards: {
        internal: page
          .locator('div[role="button"]')
          .filter({ has: page.getByText('Internal', { exact: true }) }),
        external: page
          .locator('div[role="button"]')
          .filter({ has: page.getByText('External', { exact: true }) }),
        partial: page
          .locator('div[role="button"]')
          .filter({ has: page.getByText('Partial', { exact: true }) }),
      },
    }

    this.heightEditor = {
      reset: page.getByLabel('Reset height'),
      cards: {
        // hasText regex matches both "Default (fit content)" and "Default (fill viewport)"
        default: page
          .locator('div[role="button"]')
          .filter({ hasText: /^Default/ }),
        restrictedHeight: page.locator('div[role="button"]').filter({
          has: page.getByText('Restricted height', { exact: true }),
        }),
        restrictedMaxHeight: page.locator('div[role="button"]').filter({
          has: page.getByText('Restricted max height', { exact: true }),
        }),
        fullHeight: page
          .locator('div[role="button"]')
          .filter({ has: page.getByText('Full height', { exact: true }) }),
      },
      setHeightInput: page.getByRole('spinbutton', {
        name: 'Set height',
        exact: false,
      }),
      setMaxHeightInput: page.getByRole('spinbutton', {
        name: 'Set max height',
        exact: false,
      }),
      clearHeight: page.getByLabel('Clear height'),
      clearMaxHeight: page.getByLabel('Clear max height'),
    }

    this.themeEditor = {
      paletteModeTablist: page.getByRole('tablist', { name: 'Palette mode' }),
      widgetBorder: page.getByLabel('Widget border', { exact: true }),
      cardDropShadow: page.getByLabel('Card drop shadow', { exact: true }),
      buttonBorder: page.getByLabel('Button border', { exact: true }),
    }

    this.developerControlsEditor = {
      formValues: page.getByLabel('Toggle form values'),
      formMethodTabConfig: page.getByRole('tab', {
        name: 'config',
        exact: true,
      }),
      formMethodTabFormRef: page.getByRole('tab', {
        name: 'formRef',
        exact: true,
      }),
      bookmarkStores: page.getByLabel('Toggle bookmark stores seed data'),
      loadingPreview: page.getByLabel('Toggle loading preview'),
      mockHeader: page.getByLabel('Toggle mock header'),
      mockFooter: page.getByLabel('Toggle mock footer'),
      fixedFooter: page.getByLabel('Toggle fixed footer'),
      configureWidgetEvents: page.getByRole('button', {
        name: 'Configure',
        exact: true,
      }),
    }

    this.developerControlsWidgetEventsEditor = {
      allEventsOnPageLoad: page.getByLabel(
        'Toggle all widget events on page load'
      ),
      availableRoutes: page.getByLabel('Toggle listener for AvailableRoutes'),
      routeSelected: page.getByLabel('Toggle listener for RouteSelected'),
      routeExecutionStarted: page.getByLabel(
        'Toggle listener for RouteExecutionStarted'
      ),
      routeExecutionUpdated: page.getByLabel(
        'Toggle listener for RouteExecutionUpdated'
      ),
      routeExecutionCompleted: page.getByLabel(
        'Toggle listener for RouteExecutionCompleted'
      ),
      routeExecutionFailed: page.getByLabel(
        'Toggle listener for RouteExecutionFailed'
      ),
      routeHighValueLoss: page.getByLabel(
        'Toggle listener for RouteHighValueLoss'
      ),
      contactSupport: page.getByLabel('Toggle listener for ContactSupport'),
      sourceChainTokenSelected: page.getByLabel(
        'Toggle listener for SourceChainTokenSelected'
      ),
      destinationChainTokenSelected: page.getByLabel(
        'Toggle listener for DestinationChainTokenSelected'
      ),
      sendToWalletToggled: page.getByLabel(
        'Toggle listener for SendToWalletToggled'
      ),
      widgetExpanded: page.getByLabel('Toggle listener for WidgetExpanded'),
      pageEntered: page.getByLabel('Toggle listener for PageEntered'),
      formFieldChanged: page.getByLabel('Toggle listener for FormFieldChanged'),
      settingUpdated: page.getByLabel('Toggle listener for SettingUpdated'),
      tokenSearch: page.getByLabel('Toggle listener for TokenSearch'),
      lowAddressActivityConfirmed: page.getByLabel(
        'Toggle listener for LowAddressActivityConfirmed'
      ),
      chainPinned: page.getByLabel('Toggle listener for ChainPinned'),
    }

    this.footer = {
      readOurDocs: page.getByRole('link', {
        name: 'Read our docs',
        exact: true,
      }),
    }

    this.backButton = page.getByRole('button', { name: 'Back', exact: true })
  }
}
