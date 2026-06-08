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
      /** Edit buttons are only present in the DOM when the corresponding theme is selected. */
      editDefault: Locator
      editJumper: Locator
      editAzure: Locator
      editWatermelon: Locator
      editWindows95: Locator
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
    docsLink: Locator
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
    docsLink: Locator
    /** Only present when External mode is selected. MUI-checked class when toggled on. */
    forceInternalWallets: Locator
    cards: {
      internal: Locator
      external: Locator
      partial: Locator
    }
  }

  readonly themeEditor: {
    reset: Locator
    /** "Read docs" link inside the Edit theme detail view. */
    docsLink: Locator
    paletteModeTablist: Locator
    /** Sun tab — switches the palette editor to Light mode colors. */
    paletteModeTabLight: Locator
    /** Moon tab — switches the palette editor to Dark mode colors. Only present for Default and Jumper. */
    paletteModeTabDark: Locator
    /**
     * Hex text input (value without '#') for the Primary color row.
     * aria-label="Primary color" is on the inner <input> via inputProps.
     */
    primaryColorInput: Locator
    /**
     * Hex text input (value without '#') for the Viewport background color.
     * aria-label="Viewport background" is on the inner <input> via inputProps.
     */
    viewportBackgroundInput: Locator
    /** Font family Autocomplete — MUI sets role="combobox" on the actual input. */
    fontInput: Locator
    widgetCornerRadius: Locator
    widgetDropShadow: Locator
    /**
     * Drop shadow Offset Y slider for the Widget surface. Only visible when Widget drop shadow is ON.
     * aria-label generated as `Widget drop shadow offset y` (title + ariaSuffix from surface.ts).
     */
    widgetDropShadowOffsetY: Locator
    widgetBorder: Locator
    /**
     * Border color hex input for the Widget surface. Only visible when Widget border is ON.
     * aria-label="Widget border color" from SurfaceBlock ariaLabel prop.
     */
    widgetBorderColor: Locator
    /**
     * Border weight text input for the Widget surface. Only visible when Widget border is ON.
     * BorderWeightRow renders a ValueInput (text input), not a MUI Slider.
     * aria-label="Widget border weight" from BorderWeightRow.
     */
    widgetBorderWeight: Locator
    cardCornerRadius: Locator
    cardDropShadow: Locator
    cardBorder: Locator
    buttonCornerRadius: Locator
    buttonDropShadow: Locator
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
    /**
     * "Read docs" link on the main developer controls panel (configure docs).
     * Resolved as .first() because the widget-events sub-slide adds a second
     * "Read docs" link to the DOM once it has been opened.
     */
    docsLink: Locator
  }

  readonly developerControlsWidgetEventsEditor: {
    /** Master toggle that turns on all event listeners for the current page load and sets a URL param. */
    allEventsOnPageLoad: Locator
    /**
     * "Read docs" link inside the widget-events sub-slide (events docs).
     * Resolved as .last() since the main developer controls panel keeps its own
     * "Read docs" link mounted while this sub-slide is showing.
     */
    docsLink: Locator
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
      // The nav Theme button's accessible name starts with "Theme " (e.g. "Theme Default (Light)").
      // Select/Edit preset buttons have names like "Select Jumper theme" / "Edit Jumper theme"
      // — they do not start with "Theme " — so this anchored regex stays strict even when the
      // theme presets panel is expanded and those buttons are in the DOM.
      theme: page.getByRole('button', { name: /^Theme\s/i }),
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
        editJumper: page.getByRole('button', {
          name: 'Edit Jumper theme',
          exact: true,
        }),
        editAzure: page.getByRole('button', {
          name: 'Edit Azure theme',
          exact: true,
        }),
        editWatermelon: page.getByRole('button', {
          name: 'Edit Watermelon theme',
          exact: true,
        }),
        editWindows95: page.getByRole('button', {
          name: 'Edit Windows 95 theme',
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
      docsLink: page.getByRole('link', { name: 'Read docs', exact: true }),
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
      docsLink: page.getByRole('link', { name: 'Read docs', exact: true }),
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
      reset: page.getByLabel('Reset theme'),
      docsLink: page.getByRole('link', { name: 'Read docs', exact: true }),
      paletteModeTablist: page.getByRole('tablist', { name: 'Palette mode' }),
      // Tabs are icon-only (sun / moon SVGs) with no accessible text or aria-label.
      // Select by position within the Palette mode tablist: index 0 = Light, index 1 = Dark.
      paletteModeTabLight: page
        .getByRole('tablist', { name: 'Palette mode' })
        .getByRole('tab')
        .nth(0),
      paletteModeTabDark: page
        .getByRole('tablist', { name: 'Palette mode' })
        .getByRole('tab')
        .nth(1),
      primaryColorInput: page.getByLabel('Primary color', { exact: true }),
      viewportBackgroundInput: page.getByLabel('Viewport background', {
        exact: true,
      }),
      // The font Autocomplete renders its input with role="combobox" (set by MUI).
      fontInput: page.getByRole('combobox'),
      widgetCornerRadius: page.getByRole('slider', {
        name: 'Widget corner radius',
      }),
      widgetDropShadow: page.getByLabel('Widget drop shadow', { exact: true }),
      // Sub-controls exposed when Widget drop shadow is ON (SHADOW_SLIDER_FIELDS ariaSuffix).
      widgetDropShadowOffsetY: page.getByRole('slider', {
        name: 'Widget drop shadow offset y',
      }),
      widgetBorder: page.getByLabel('Widget border', { exact: true }),
      // Sub-controls exposed when Widget border is ON.
      widgetBorderColor: page.getByLabel('Widget border color', {
        exact: true,
      }),
      // BorderWeightRow renders a ValueInput (text input), not a MUI Slider.
      widgetBorderWeight: page.getByLabel('Widget border weight', {
        exact: true,
      }),
      cardCornerRadius: page.getByRole('slider', {
        name: 'Card corner radius',
      }),
      cardDropShadow: page.getByLabel('Card drop shadow', { exact: true }),
      cardBorder: page.getByLabel('Card border', { exact: true }),
      buttonCornerRadius: page.getByRole('slider', {
        name: 'Button corner radius',
      }),
      buttonDropShadow: page.getByLabel('Button drop shadow', { exact: true }),
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
      // .first(): the main panel's "Read docs" precedes the widget-events one in DOM order.
      docsLink: page
        .getByRole('link', { name: 'Read docs', exact: true })
        .first(),
    }

    this.developerControlsWidgetEventsEditor = {
      allEventsOnPageLoad: page.getByLabel(
        'Toggle all widget events on page load'
      ),
      // .last(): the widget-events "Read docs" is rendered after the main panel's one.
      docsLink: page
        .getByRole('link', { name: 'Read docs', exact: true })
        .last(),
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
