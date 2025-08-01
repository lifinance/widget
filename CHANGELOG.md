# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [3.25.0](https://github.com/lifinance/widget/compare/v3.25.0-beta.2...v3.25.0) (2025-07-28)


### Features

* add market cap and volume to token details ([#475](https://github.com/lifinance/widget/issues/475)) ([3f4f0f3](https://github.com/lifinance/widget/commit/3f4f0f37783e60fbc5bf1eff3ddd369b5aeacc46))
* add minFromAmountUSD configuration option ([#480](https://github.com/lifinance/widget/issues/480)) ([b3b7648](https://github.com/lifinance/widget/commit/b3b7648e2cab2fd39f2258f132686008a2a0e26d))
* add pinned chains ([#474](https://github.com/lifinance/widget/issues/474)) ([2ccde57](https://github.com/lifinance/widget/commit/2ccde572babacc4c1e22b7f519fb935d10134118))
* add pointer events for token details ([#477](https://github.com/lifinance/widget/issues/477)) ([84332ec](https://github.com/lifinance/widget/commit/84332eccc3b118f81cd4811d77e786b641bd8989))
* add wallet ecosystems ordering ([#464](https://github.com/lifinance/widget/issues/464)) ([ca0b42a](https://github.com/lifinance/widget/commit/ca0b42a2c512a3808b6384db309d87b880cd4fc6))
* separate config for chain sidebar and routes ([#469](https://github.com/lifinance/widget/issues/469)) ([ed1d817](https://github.com/lifinance/widget/commit/ed1d81751d80c6ead9a18c368a8943c66e4b725e))


### Bug Fixes

* filter out duplicate EVM connectors ([#468](https://github.com/lifinance/widget/issues/468)) ([bed5130](https://github.com/lifinance/widget/commit/bed51303bd1afc6078010e412483b194f48fc1f9))
* **format:** wrap hashes in messages for better display ([#465](https://github.com/lifinance/widget/issues/465)) ([83da273](https://github.com/lifinance/widget/commit/83da273ca8aef413d9314cd981dd11e9ad5d5f11))
* improve tx link handling for relayed txs ([#473](https://github.com/lifinance/widget/issues/473)) ([41c19c7](https://github.com/lifinance/widget/commit/41c19c78f119371a65cab99c2181357067fc4def))
* remove outer routes container causing unnecessary scrolling ([#476](https://github.com/lifinance/widget/issues/476)) ([21fa74d](https://github.com/lifinance/widget/commit/21fa74dbfcadf40a37589f63c8e162b538bee8f6))
* reorg token filters ([#485](https://github.com/lifinance/widget/issues/485)) ([d97e709](https://github.com/lifinance/widget/commit/d97e709e96675b125d3cdd52fb78a52f115d4cdc))
* token details should not have empty state on transition ([#488](https://github.com/lifinance/widget/issues/488)) ([b299eca](https://github.com/lifinance/widget/commit/b299ecaf19ac3c5430ca21e8bd6a91aec4c6f6af))
* update color mixing for Card and ListItemButton components ([#471](https://github.com/lifinance/widget/issues/471)) ([af33afd](https://github.com/lifinance/widget/commit/af33afdffae644267176346e80588b92d231d73b))

### [3.24.3](https://github.com/lifinance/widget/compare/v3.24.2...v3.24.3) (2025-07-04)


### Bug Fixes

* add wallet menu args to external on connect ([#450](https://github.com/lifinance/widget/issues/450)) ([8a00045](https://github.com/lifinance/widget/commit/8a000450dd5a73bcdd1e385cf308488f82822bd0))

### [3.24.2](https://github.com/lifinance/widget/compare/v3.24.1...v3.24.2) (2025-07-03)


### Bug Fixes

* allow-deny - do not filter out tokens from unspecified chains ([#449](https://github.com/lifinance/widget/issues/449)) ([ced6cf6](https://github.com/lifinance/widget/commit/ced6cf68f329e31af0338b31fe18c5feed8417fb))

### [3.24.1](https://github.com/lifinance/widget/compare/v3.24.0...v3.24.1) (2025-07-02)


### Bug Fixes

* export createTheme function ([121372b](https://github.com/lifinance/widget/commit/121372b3a8efc2ef27e0155de80bb819204ad4e6))

## [3.24.0](https://github.com/lifinance/widget/compare/v3.23.0...v3.24.0) (2025-07-02)


### Features

* add fit-content option for widget container ([#404](https://github.com/lifinance/widget/issues/404)) ([bc90dd4](https://github.com/lifinance/widget/commit/bc90dd430f30c3eac9027fd6b3d416e7e8331aed))
* add optional filter for wallets in modal ([#414](https://github.com/lifinance/widget/issues/414)) ([348167f](https://github.com/lifinance/widget/commit/348167fa346b69db4975536d1d5dff36ea1da7c3))
* add token details drawer ([#423](https://github.com/lifinance/widget/issues/423)) ([a7f3b8b](https://github.com/lifinance/widget/commit/a7f3b8b772d668e5adb6778079d9155f4d6d473a))
* implement separate token filtering for from/to lists  ([#444](https://github.com/lifinance/widget/issues/444)) ([41732ff](https://github.com/lifinance/widget/commit/41732ff29b24fa37d49cea937ec5195d804be948))
* restyled connect wallet view ([#418](https://github.com/lifinance/widget/issues/418)) ([8149607](https://github.com/lifinance/widget/commit/8149607a65d760a61437865f32b603b199575847))


### Bug Fixes

* adjust show all transactions button styles ([#411](https://github.com/lifinance/widget/issues/411)) ([9932617](https://github.com/lifinance/widget/commit/9932617d50905f8b14db4c77e0e84afb86ad159f))
* adjust themed status color for processes and bottom sheet ([#448](https://github.com/lifinance/widget/issues/448)) ([f227803](https://github.com/lifinance/widget/commit/f2278037a31373c8b047e13ab0157f854350c802))
* cutoff corners on full height ([#445](https://github.com/lifinance/widget/issues/445)) ([c9a40b5](https://github.com/lifinance/widget/commit/c9a40b527ff3a2321b24cdc294150a119957c9b6))
* format long bridging times ([#431](https://github.com/lifinance/widget/issues/431)) ([b12e93b](https://github.com/lifinance/widget/commit/b12e93b78bdf4776ae21bb56fe00c62c85bc025e))
* missing highlight on Azure theme ([#426](https://github.com/lifinance/widget/issues/426)) ([6539e91](https://github.com/lifinance/widget/commit/6539e91a27ddf4c2f48e1ab5069d7939e4a91013))
* send to wallet adjustments ([#415](https://github.com/lifinance/widget/issues/415)) ([1cab928](https://github.com/lifinance/widget/commit/1cab928a3a941aa71c428a75c87bc17ce5b9df0a))
* update height setting for restricted heights ([#436](https://github.com/lifinance/widget/issues/436)) ([1395bc6](https://github.com/lifinance/widget/commit/1395bc613532d2435df82efa7decdfff9b689834))
* wallet toggle, add cache cleaning command ([#437](https://github.com/lifinance/widget/issues/437)) ([8b71caa](https://github.com/lifinance/widget/commit/8b71caa94ce9ace7548127857c7add636e223c03))

### [3.23.3](https://github.com/lifinance/widget/compare/v3.23.1-alpha.0...v3.23.3) (2025-06-06)


### Bug Fixes

* update main version ([40ba37d](https://github.com/lifinance/widget/commit/40ba37d502bbce7feb7cc630163bcf0b71366151))

## [3.23.0](https://github.com/lifinance/widget/compare/v3.22.0...v3.23.0) (2025-05-30)


### Features

* **wallet-management:** add support for okx, oyl, and binance Bitcoin wallets ([#403](https://github.com/lifinance/widget/issues/403)) ([9df94ed](https://github.com/lifinance/widget/commit/9df94ed9d1d0359589aa29a560836a10416796b4))


### Bug Fixes

* adjust wallets priority ([785a56b](https://github.com/lifinance/widget/commit/785a56b8a690009680f3e4756b74e95c2f91b6a6))
* broken height when switching from drawer variant ([#409](https://github.com/lifinance/widget/issues/409)) ([bc99b70](https://github.com/lifinance/widget/commit/bc99b704ae7929f60d64b15ab712b5e64f21cd9c))
* do not pass non-evm chains to wagmi ([#410](https://github.com/lifinance/widget/issues/410)) ([27810ee](https://github.com/lifinance/widget/commit/27810ee173fa37e3a61a8cbf75410a4eb5233282))

## [3.22.0](https://github.com/lifinance/widget/compare/v3.21.3...v3.22.0) (2025-05-29)


### Features

* add cross-vm 2-steps tx flow ([#402](https://github.com/lifinance/widget/issues/402)) ([f06cbad](https://github.com/lifinance/widget/commit/f06cbadf2acedf8139f1b52d6dcafcff8ec46dca))
* make custom explorer urls tx and address paths configurable ([#400](https://github.com/lifinance/widget/issues/400)) ([bf8f47b](https://github.com/lifinance/widget/commit/bf8f47b5b1261d5560f2bf166c5ca1d9fae9d41b))
* update transaction execution success screen in the widget ([#396](https://github.com/lifinance/widget/issues/396)) ([8c3dd2b](https://github.com/lifinance/widget/commit/8c3dd2b963f8374093ce42e49ba2c5be1fb0fbe7))


### Bug Fixes

* account for hidden UI elements in required address logic ([#399](https://github.com/lifinance/widget/issues/399)) ([25b63ff](https://github.com/lifinance/widget/commit/25b63ff8ec1f7007ad779b42a2f385ea5962e6ca))
* allow hiding toAddress when necessary ([#405](https://github.com/lifinance/widget/issues/405)) ([e70e88d](https://github.com/lifinance/widget/commit/e70e88d60afe8735f8b4fdd91d9efd9bd04b0574))
* height of virtualized list in drawer ([#398](https://github.com/lifinance/widget/issues/398)) ([c8ae76d](https://github.com/lifinance/widget/commit/c8ae76ddecb994decc0493d11b56f6520d7227f0))
* improve logic to distribute chains in its grid ([#397](https://github.com/lifinance/widget/issues/397)) ([ffafc2b](https://github.com/lifinance/widget/commit/ffafc2ba898c16c7f737e8c6c0f55d227f346012))
* no widget render when using chain filters ([#406](https://github.com/lifinance/widget/issues/406)) ([676f0bb](https://github.com/lifinance/widget/commit/676f0bbf4f5790856cdb0ec1daa2ccf4ef744ba8))
* wallet connect modal search input ([#407](https://github.com/lifinance/widget/issues/407)) ([52a9056](https://github.com/lifinance/widget/commit/52a90565dc0c6cf4f6049c5d2fe7db31ff0451cd))
* **widget:** hour display bug on safari ([#408](https://github.com/lifinance/widget/issues/408)) ([88ff370](https://github.com/lifinance/widget/commit/88ff370ee90a384cd4a2c7f0dbce456da7c16203))

### [3.21.3](https://github.com/lifinance/widget/compare/v3.21.2...v3.21.3) (2025-05-21)


### Bug Fixes

* update collapse logic in SendToWalletButton component ([ccbb69b](https://github.com/lifinance/widget/commit/ccbb69b03fe307866bd96a566ba1bb1ffb36e155))

### [3.21.2](https://github.com/lifinance/widget/compare/v3.21.1...v3.21.2) (2025-05-21)

### [3.21.1](https://github.com/lifinance/widget/compare/v3.21.0...v3.21.1) (2025-05-20)


### Bug Fixes

* allow to create txs without enough gas ([#395](https://github.com/lifinance/widget/issues/395)) ([61ea1d0](https://github.com/lifinance/widget/commit/61ea1d029d991ef740d5b0b7a05d5b844084bc91))

## [3.21.0](https://github.com/lifinance/widget/compare/v3.20.5...v3.21.0) (2025-05-15)


### Features

* add Sui support ([#394](https://github.com/lifinance/widget/issues/394)) ([669b7a9](https://github.com/lifinance/widget/commit/669b7a9cf727b37b4b954d944076b04a1dac56b3))
* replace viem dependencies with bigmi imports ([#388](https://github.com/lifinance/widget/issues/388)) ([624be1a](https://github.com/lifinance/widget/commit/624be1a4437abc30679cb78f10d6d65d118b1a23))

### [3.20.5](https://github.com/lifinance/widget/compare/v3.20.4...v3.20.5) (2025-05-12)


### Bug Fixes

* add timeout for getCapabilities call ([#392](https://github.com/lifinance/widget/issues/392)) ([2b73bf6](https://github.com/lifinance/widget/commit/2b73bf67499f2443ff2da268b4dec8f8ca59c131))
* **avatar-icon:** add skeleton for token image ([#390](https://github.com/lifinance/widget/issues/390)) ([d9054ce](https://github.com/lifinance/widget/commit/d9054cecbdf10bf79741f706fbee33a4a53af4e7))
* should not require destination address for 7702 accounts ([#393](https://github.com/lifinance/widget/issues/393)) ([00faad2](https://github.com/lifinance/widget/commit/00faad276adbbbdc9c14d444d5e598cce553d52f))

### [3.20.4](https://github.com/lifinance/widget/compare/v3.20.3...v3.20.4) (2025-05-06)


### Bug Fixes

* add new error messages for rate limits and third-party tools ([#391](https://github.com/lifinance/widget/issues/391)) ([da820be](https://github.com/lifinance/widget/commit/da820be7bcb25b58fb9c21c3baa42c6d4ea45bba))
* prevent unnecessary capabilities requests ([d0dca6b](https://github.com/lifinance/widget/commit/d0dca6b2ecf0292f4518bea8794e7d6042876b30))

### [3.20.3](https://github.com/lifinance/widget/compare/v3.20.2...v3.20.3) (2025-05-06)


### Bug Fixes

* button color for text variant should respect vars ([5efc9fd](https://github.com/lifinance/widget/commit/5efc9fd6d660369149e20989d12ae5c7334ff35f))

### [3.20.2](https://github.com/lifinance/widget/compare/v3.20.1...v3.20.2) (2025-05-05)


### Bug Fixes

* should only hide bridge settings when hidden UI is applied ([8898a67](https://github.com/lifinance/widget/commit/8898a67e096fbbb719f07b724cd60cc18a9526ff))

### [3.20.1](https://github.com/lifinance/widget/compare/v3.20.0...v3.20.1) (2025-05-05)


### Bug Fixes

* add new default UI and hidden UI options ([#389](https://github.com/lifinance/widget/issues/389)) ([b9579ad](https://github.com/lifinance/widget/commit/b9579adf09e4dfc84832ecf5bdf1b22b8468caef))

## [3.20.0](https://github.com/lifinance/widget/compare/v3.19.2...v3.20.0) (2025-05-05)


### Features

* upgrade to MUI v7 ([#377](https://github.com/lifinance/widget/issues/377)) ([dc97603](https://github.com/lifinance/widget/commit/dc97603dab13047525c206e2536d9b4fcac29465))

### [3.19.2](https://github.com/lifinance/widget/compare/v3.19.1...v3.19.2) (2025-04-29)


### Bug Fixes

* improve used tool retrieval in transaction history ([cba3ed6](https://github.com/lifinance/widget/commit/cba3ed69822afd0fb88bac647c41478153375e11))

### [3.19.1](https://github.com/lifinance/widget/compare/v3.19.0...v3.19.1) (2025-04-29)


### Bug Fixes

* add options to show fee percentage ([#387](https://github.com/lifinance/widget/issues/387)) ([3dbd751](https://github.com/lifinance/widget/commit/3dbd7516c598ef896362df784c1ad5fe810a3dbb))

## [3.19.0](https://github.com/lifinance/widget/compare/v3.18.9...v3.19.0) (2025-04-28)


### Features

* add option to hide chain selection ([#386](https://github.com/lifinance/widget/issues/386)) ([0bc15bf](https://github.com/lifinance/widget/commit/0bc15bff6f0127d21b8f976d82ce32e860004da1))

### [3.18.9](https://github.com/lifinance/widget/compare/v3.18.8...v3.18.9) (2025-04-28)


### Bug Fixes

* adjust fee types ([#385](https://github.com/lifinance/widget/issues/385)) ([04dffc7](https://github.com/lifinance/widget/commit/04dffc7200ff8feadd6b88e235a63fbf1bd2538f))

### [3.18.8](https://github.com/lifinance/widget/compare/v3.18.7...v3.18.8) (2025-04-28)

### [3.18.7](https://github.com/lifinance/widget/compare/v3.18.6...v3.18.7) (2025-04-17)


### Bug Fixes

* add support for displaying positive price impacts with a plus sign ([#378](https://github.com/lifinance/widget/issues/378)) ([be3a23d](https://github.com/lifinance/widget/commit/be3a23ddd4540c48f8a4da9e9ffcf501065af9e8))
* enable _vcComponent ([#382](https://github.com/lifinance/widget/issues/382)) ([fd37fa4](https://github.com/lifinance/widget/commit/fd37fa448707f6a57102d76817b0b34f4cbe9e88))

### [3.18.6](https://github.com/lifinance/widget/compare/v3.18.5...v3.18.6) (2025-04-17)


### Bug Fixes

* missing availableRoute event ([#381](https://github.com/lifinance/widget/issues/381)) ([a884b81](https://github.com/lifinance/widget/commit/a884b81ec10a129831be744078678248aa8a9316))

### [3.18.5](https://github.com/lifinance/widget/compare/v3.18.4...v3.18.5) (2025-04-15)


### Bug Fixes

* make transaction execution timer count down ([#376](https://github.com/lifinance/widget/issues/376)) ([0595587](https://github.com/lifinance/widget/commit/05955873b1d901efd7c6b0bd2f3143bdb44d5ab3))

### [3.18.4](https://github.com/lifinance/widget/compare/v3.18.3...v3.18.4) (2025-04-08)


### Bug Fixes

* we should correctly track routes when there is a relayer one ([#370](https://github.com/lifinance/widget/issues/370)) ([a64390c](https://github.com/lifinance/widget/commit/a64390c20211798e19a91b1a61b71a1fb2175310))

### [3.18.3](https://github.com/lifinance/widget/compare/v3.18.2...v3.18.3) (2025-04-07)


### Bug Fixes

* update routes incrementally as they're ready ([#367](https://github.com/lifinance/widget/issues/367)) ([fafe735](https://github.com/lifinance/widget/commit/fafe73510498b88676e97120452ba640823acdef))

### [3.18.2](https://github.com/lifinance/widget/compare/v3.18.1...v3.18.2) (2025-04-01)


### Bug Fixes

* use auto slippage in transaction details ([32551e2](https://github.com/lifinance/widget/commit/32551e2534be5222e02d06bfada7eded116e593b))

### [3.18.1](https://github.com/lifinance/widget/compare/v3.18.0...v3.18.1) (2025-03-13)


### Bug Fixes

* update permit handling with standardized EIP-712 typed data ([#365](https://github.com/lifinance/widget/issues/365)) ([77cf606](https://github.com/lifinance/widget/commit/77cf606d7e03e48f919fe4073f51ae5e4997a7a0))

## [3.18.0](https://github.com/lifinance/widget/compare/v3.17.1...v3.18.0) (2025-03-10)


### Features

* add Permit (ERC-2612), Permit2 and Wallet Call API (EIP-5792) support ([#331](https://github.com/lifinance/widget/issues/331)) ([1ec9786](https://github.com/lifinance/widget/commit/1ec97864f12e6e15074f6efeb1dbe45d715d2261))
* add RouteTokenDescription hidden option ([#361](https://github.com/lifinance/widget/issues/361)) ([bb3e047](https://github.com/lifinance/widget/commit/bb3e047adc05dc934b7981de1438cd51cb760678))


### Bug Fixes

* enable undeployed sca transfers ([#362](https://github.com/lifinance/widget/issues/362)) ([4038d7f](https://github.com/lifinance/widget/commit/4038d7fdc412f5918e31a5a8dfce8f58b608987c))
* **timers:** display hours and days section of timers, and update copy ([#358](https://github.com/lifinance/widget/issues/358)) ([0654c20](https://github.com/lifinance/widget/commit/0654c2000b3dfd87ca02be6e4aff5b51dd153681))

### [3.17.1](https://github.com/lifinance/widget/compare/v3.17.0...v3.17.1) (2025-02-16)

## [3.17.0](https://github.com/lifinance/widget/compare/v3.16.1...v3.17.0) (2025-02-16)


### Features

* add option to hide reverse tokens button ([#352](https://github.com/lifinance/widget/issues/352)) ([bd4b882](https://github.com/lifinance/widget/commit/bd4b8824d0a4d02e506fcca51ba55a74df44f1eb))
* **timer:**  counts up instead of countdown ([#348](https://github.com/lifinance/widget/issues/348)) ([6c9d22e](https://github.com/lifinance/widget/commit/6c9d22e8b1bf4cc3228d1534aae6b81120000da4))
* widget auto slippage mode ([#349](https://github.com/lifinance/widget/issues/349)) ([580ce06](https://github.com/lifinance/widget/commit/580ce067f26fe0122a2ef14f6b0783b232148775))


### Bug Fixes

* transaction history page virtualization ([#351](https://github.com/lifinance/widget/issues/351)) ([257a581](https://github.com/lifinance/widget/commit/257a581f6794e309d9d05f8156e359ec9d59d0fa))

### [3.16.1](https://github.com/lifinance/widget/compare/v3.16.0...v3.16.1) (2025-02-11)


### Bug Fixes

* improve SCA as destination flow ([#350](https://github.com/lifinance/widget/issues/350)) ([c58e5dd](https://github.com/lifinance/widget/commit/c58e5dd5835f8b25411f9b33070c914702f659ab))
* replace lifuel protocol with gasZip ([#347](https://github.com/lifinance/widget/issues/347)) ([8b4bdf2](https://github.com/lifinance/widget/commit/8b4bdf24936c01f4efd24f8a370262992cd545a0))
* restrict 2-step routes if account is not deployed on destination… ([#346](https://github.com/lifinance/widget/issues/346)) ([bf48c3c](https://github.com/lifinance/widget/commit/bf48c3c0ed5501bc720dfa8003f1b0ffd3ec571d))

## [3.16.0](https://github.com/lifinance/widget/compare/v3.15.2...v3.16.0) (2025-02-01)


### Features

* add low activity wallet warning ([fb69217](https://github.com/lifinance/widget/commit/fb692176b87666dd37e18a72b11ad7b43901a6bf))

### [3.15.2](https://github.com/lifinance/widget/compare/v3.15.1...v3.15.2) (2025-01-31)


### Bug Fixes

* hide required wallet info message when wallet is present ([#345](https://github.com/lifinance/widget/issues/345)) ([88b5e18](https://github.com/lifinance/widget/commit/88b5e189961afaed8e6902f114758886512fd980))

### [3.15.1](https://github.com/lifinance/widget/compare/v3.15.0...v3.15.1) (2025-01-31)


### Bug Fixes

* improve funds loss warning message ([317f8b1](https://github.com/lifinance/widget/commit/317f8b131cfc0c685ebb5e4f4fe1a9828afa4a51))
* include gas sufficiency message props ([2b29bd8](https://github.com/lifinance/widget/commit/2b29bd857a81733dfe61894fc446814be3b6c7b0))

## [3.15.0](https://github.com/lifinance/widget/compare/v3.14.2...v3.15.0) (2025-01-30)


### Features

* improve warning messages ([#344](https://github.com/lifinance/widget/issues/344)) ([17e5a2b](https://github.com/lifinance/widget/commit/17e5a2b236e54590c83e1e6c279d04c45f9dcbef))

### [3.14.2](https://github.com/lifinance/widget/compare/v3.14.1...v3.14.2) (2025-01-28)


### Bug Fixes

* validate address from URL params and bookmark it ([#343](https://github.com/lifinance/widget/issues/343)) ([688236e](https://github.com/lifinance/widget/commit/688236e6e374482155bcbab6d3a454a0cab9fa7f))

### [3.14.1](https://github.com/lifinance/widget/compare/v3.14.0...v3.14.1) (2025-01-23)


### Bug Fixes

* address confirmation bottom sheet height ([59d034b](https://github.com/lifinance/widget/commit/59d034b89b25d58345105de731fe3af2746e3119))

## [3.14.0](https://github.com/lifinance/widget/compare/v3.13.2...v3.14.0) (2025-01-22)


### Features

* add configurable route labels/badges ([#338](https://github.com/lifinance/widget/issues/338)) ([f6fe53e](https://github.com/lifinance/widget/commit/f6fe53e5b1b90003c87651bb82f637b85ce0da37))
* add more UTXO wallets ([d787698](https://github.com/lifinance/widget/commit/d7876980c839a9f591078a613d28de956e9c0805))
* add smart contract account info message for destination wallets ([#340](https://github.com/lifinance/widget/issues/340)) ([ba57082](https://github.com/lifinance/widget/commit/ba57082582a9ddfae9ccec7847ade5e1041491ee))


### Bug Fixes

* improve step titles in custom steps ([825856c](https://github.com/lifinance/widget/commit/825856c74d2ba8f32eeb6d4fcde771613776e534))
* improve token amount formatting ([#339](https://github.com/lifinance/widget/issues/339)) ([a6a3d10](https://github.com/lifinance/widget/commit/a6a3d1094d3403fac5b14797ba652d00a415f5a8))

### [3.13.2](https://github.com/lifinance/widget/compare/v3.13.1...v3.13.2) (2024-12-27)


### Bug Fixes

* support loadable wallets ([783ed97](https://github.com/lifinance/widget/commit/783ed9750cc59767bc02708935e207667b1a73fe))

### [3.13.1](https://github.com/lifinance/widget/compare/v3.13.0...v3.13.1) (2024-12-20)


### Bug Fixes

* remix compatibility ([#336](https://github.com/lifinance/widget/issues/336)) ([3b6fcb3](https://github.com/lifinance/widget/commit/3b6fcb3905c1751ac125e3e4ac9f9ac588eac4c0))

## [3.13.0](https://github.com/lifinance/widget/compare/v3.12.5...v3.13.0) (2024-12-20)


### Features

* improve peer dependencies ([#335](https://github.com/lifinance/widget/issues/335)) ([cb159cf](https://github.com/lifinance/widget/commit/cb159cfe892eef466a4370774c9bb6c25835a967))
* migrate to MUI v6 ([#334](https://github.com/lifinance/widget/issues/334)) ([12c632d](https://github.com/lifinance/widget/commit/12c632d7a89f2b75b4946eec315489b85601f452))


### Bug Fixes

* improve deposit flow card titles ([#328](https://github.com/lifinance/widget/issues/328)) ([9eb9a20](https://github.com/lifinance/widget/commit/9eb9a200308c9889d403595984eaef33bb93a31e))
* prepare for react router v7 ([43d27a1](https://github.com/lifinance/widget/commit/43d27a19d878079b50858165fc4d287f6cbc581d))
* should show wallet menu in split mode ([7ca782c](https://github.com/lifinance/widget/commit/7ca782c31146ee5ea312eb24b489c70e356277de))

### [3.12.5](https://github.com/lifinance/widget/compare/v3.12.4...v3.12.5) (2024-12-13)

### [3.12.4](https://github.com/lifinance/widget/compare/v3.12.3...v3.12.4) (2024-12-12)


### Bug Fixes

* improve powered by with dynamic configuration ([#332](https://github.com/lifinance/widget/issues/332)) ([6ae3abb](https://github.com/lifinance/widget/commit/6ae3abbca2140fcda5c9a3ce1f014b27651141aa))
* keep previous data only when wallet is connected ([1b4df34](https://github.com/lifinance/widget/commit/1b4df3448f69c1639a1edc23d5b70ad66b0538e9))

### [3.12.3](https://github.com/lifinance/widget/compare/v3.12.2...v3.12.3) (2024-12-05)

### [3.12.2](https://github.com/lifinance/widget/compare/v3.12.1...v3.12.2) (2024-11-19)

### [3.12.1](https://github.com/lifinance/widget/compare/v3.12.0...v3.12.1) (2024-11-08)

## [3.12.0](https://github.com/lifinance/widget/compare/v3.11.0...v3.12.0) (2024-11-06)


### Features

* add TokenSearch and RouteSelected events ([#324](https://github.com/lifinance/widget/issues/324)) ([9165dd0](https://github.com/lifinance/widget/commit/9165dd03987fb8494671c1a46c9c16dd61e18d1f))


### Bug Fixes

* improve token balance and transaction history invalidation ([#325](https://github.com/lifinance/widget/issues/325)) ([5bcf6dc](https://github.com/lifinance/widget/commit/5bcf6dca1b1e2068925db3f6039a2d5fcc6f5ccc))

## [3.11.0](https://github.com/lifinance/widget/compare/v3.10.0...v3.11.0) (2024-11-01)


### Features

* improve Safe support ([#323](https://github.com/lifinance/widget/issues/323)) ([6f1e5d1](https://github.com/lifinance/widget/commit/6f1e5d1cbb4e00c4219b0256ef29a4636df4d4e4))

## [3.10.0](https://github.com/lifinance/widget/compare/v3.9.0...v3.10.0) (2024-10-30)


### Features

* add support for partial wallet management ([#320](https://github.com/lifinance/widget/issues/320)) ([e3b919b](https://github.com/lifinance/widget/commit/e3b919bc2d04b4205472e521df3f134076e43d98))


### Bug Fixes

* correct jumping title for in progress transfers ([3d0a607](https://github.com/lifinance/widget/commit/3d0a6076cbb1fa46dde60673637bc0fe9ff5df3c))

## [3.9.0](https://github.com/lifinance/widget/compare/v3.8.2...v3.9.0) (2024-10-28)


### Features

* add active account tracking to the internal wallet management ([0872fe2](https://github.com/lifinance/widget/commit/0872fe2da2d2b3bd450d4cad181f5b50dd064c41))
* add support for okx bitcoin wallet ([175c5fb](https://github.com/lifinance/widget/commit/175c5fb6b251dd591d14530303aeb8f41788f071))
* try to auto-populate destination address for cross-ecosystem transfers ([323d3a1](https://github.com/lifinance/widget/commit/323d3a16255763e44caa0b3126641bb92a320da2))


### Bug Fixes

* always update the destination chain to match the source one ([4d428ea](https://github.com/lifinance/widget/commit/4d428ea566763e77fdbde73c0bd78f6adea41e67))
* make destination address required if source address is a smart contract wallet ([34d8528](https://github.com/lifinance/widget/commit/34d8528a770198132b67d4af373961dce5d0ebe5))

### [3.8.2](https://github.com/lifinance/widget/compare/v3.8.1...v3.8.2) (2024-10-24)


### Bug Fixes

* avoid gas check for smart contract wallets ([1bd956d](https://github.com/lifinance/widget/commit/1bd956d93d1bceb5c27b64e7ca2c8777d5b9ee7a))
* improve safe wallet connectivity ([df5ded3](https://github.com/lifinance/widget/commit/df5ded3e4f195ac96090509e3e54933a45232c97))
* replace first-child with first-of-type to avoid warning ([d098a7c](https://github.com/lifinance/widget/commit/d098a7cc78e3e9aacf1bf10c5652b0ef60e638ee))
* solana providers doesn't update accounts sometimes ([e911bea](https://github.com/lifinance/widget/commit/e911beaa43ceaf39a8d88e22f166db876174da10))

### [3.8.1](https://github.com/lifinance/widget/compare/v3.8.0...v3.8.1) (2024-10-21)


### Bug Fixes

* add auto focus for search input field ([#314](https://github.com/lifinance/widget/issues/314)) ([01c1b49](https://github.com/lifinance/widget/commit/01c1b494886247f3f57f0a072041622998c38a53))
* increase fractional and significant digits ([#313](https://github.com/lifinance/widget/issues/313)) ([06e4df6](https://github.com/lifinance/widget/commit/06e4df69a8cf2221eda87348e685880f02f5473b))

## [3.8.0](https://github.com/lifinance/widget/compare/v3.7.0...v3.8.0) (2024-10-18)


### Features

* add Bitcoin/UTXO support ([#297](https://github.com/lifinance/widget/issues/297)) ([f83341f](https://github.com/lifinance/widget/commit/f83341f9b0d559dfda6c0cd37629b5f36642ae86))
* emit events for settings changes ([#312](https://github.com/lifinance/widget/issues/312)) ([cf48cf2](https://github.com/lifinance/widget/commit/cf48cf22bec198099284cf3ce6ed6609b76a5f39))
* widget events for send to wallet ([#309](https://github.com/lifinance/widget/issues/309)) ([b247afb](https://github.com/lifinance/widget/commit/b247afbb41b1ffd04be8f4b09862f72fc40d4a37))


### Bug Fixes

* crowdin config ([f9bf9ba](https://github.com/lifinance/widget/commit/f9bf9bab7fa2891d849f70c72ff16b096701fbb0))
* nextjs example link ([a482ff3](https://github.com/lifinance/widget/commit/a482ff3510a72a6d619ac5e86af70b2dc28e11cc))
* refactor, use and export calcPriceImpact function ([#307](https://github.com/lifinance/widget/issues/307)) ([234844f](https://github.com/lifinance/widget/commit/234844f79afd7b65dbfb6f46c3725ace247f5c0a))

## [3.7.0](https://github.com/lifinance/widget/compare/v3.6.2...v3.7.0) (2024-10-02)


### Features

* add emitter event on location change ([#304](https://github.com/lifinance/widget/issues/304)) ([d6146f8](https://github.com/lifinance/widget/commit/d6146f83dcc27381d52b95f51e7fdcd05552dc58))
* add search input to chain, bridges and exchanges pages ([#305](https://github.com/lifinance/widget/issues/305)) ([5504d95](https://github.com/lifinance/widget/commit/5504d95621d11a70ee3fb39108dbd8c0a2417978))

### [3.6.2](https://github.com/lifinance/widget/compare/v3.6.1...v3.6.2) (2024-09-24)


### Bug Fixes

* status sheet buttons and height adjustment ([#303](https://github.com/lifinance/widget/issues/303)) ([56db5e4](https://github.com/lifinance/widget/commit/56db5e4033a05a295cf022843c9a359008c70ce5))

### [3.6.1](https://github.com/lifinance/widget/compare/v3.6.0...v3.6.1) (2024-09-18)


### Bug Fixes

* trim amount input ([66eed73](https://github.com/lifinance/widget/commit/66eed7386826e7cf0c249ebd2fdc1930ab550f6c))

## [3.6.0](https://github.com/lifinance/widget/compare/v3.5.3...v3.6.0) (2024-09-18)


### Features

* add voluntary contribution component ([#301](https://github.com/lifinance/widget/issues/301)) ([d0453a7](https://github.com/lifinance/widget/commit/d0453a76b1a429580adafed5e6289bda10c49f8d))


### Bug Fixes

* factor external wallet management into header height calculations ([#300](https://github.com/lifinance/widget/issues/300)) ([b31aaa7](https://github.com/lifinance/widget/commit/b31aaa717fe2a49747b159c2d07b78f6099003df))
* reactive chain and token properties from config ([#294](https://github.com/lifinance/widget/issues/294)) ([1ff7cfc](https://github.com/lifinance/widget/commit/1ff7cfcc99569c52f05d29a9929f1be06ff53170))
* use process tx link if no tx hash is available ([#299](https://github.com/lifinance/widget/issues/299)) ([8c59d31](https://github.com/lifinance/widget/commit/8c59d313defdeea4a59df6f06ef40edd5e36c329))

### [3.5.3](https://github.com/lifinance/widget/compare/v3.5.2...v3.5.3) (2024-09-12)

### [3.5.2](https://github.com/lifinance/widget/compare/v3.5.1...v3.5.2) (2024-09-11)


### Bug Fixes

* widget header with subvariant split ([#298](https://github.com/lifinance/widget/issues/298)) ([c33d42a](https://github.com/lifinance/widget/commit/c33d42abcabaa80c533caae915384dd6d2bc36ab))

### [3.5.1](https://github.com/lifinance/widget/compare/v3.5.0...v3.5.1) (2024-09-10)


### Bug Fixes

* make internal explorer optional ([a0f51c6](https://github.com/lifinance/widget/commit/a0f51c6d7664824543ad3f2a6ab672d01ca0a91b))

## [3.5.0](https://github.com/lifinance/widget/compare/v3.4.4...v3.5.0) (2024-09-10)


### Features

* add explorer link to the support card ([#292](https://github.com/lifinance/widget/issues/292)) ([0792c15](https://github.com/lifinance/widget/commit/0792c158aa39b9c1b05139a494e5ec9483473733))
* allow configuration of explorer links ([#293](https://github.com/lifinance/widget/issues/293)) ([c173546](https://github.com/lifinance/widget/commit/c1735465580e9199e448167dc1445b58246f569e))


### Bug Fixes

* add percent formatter to improve display of price impact ([#287](https://github.com/lifinance/widget/issues/287)) ([2061012](https://github.com/lifinance/widget/commit/20610129dedb4fefd23a145b173eeee2bb4f7066))
* allow the token list to fill the full height available and default max height to 686px ([#289](https://github.com/lifinance/widget/issues/289)) ([4882755](https://github.com/lifinance/widget/commit/48827559ac5db87140669247c1728083ace7a94e))
* container should not forward prop ([6e326cd](https://github.com/lifinance/widget/commit/6e326cd27efb965058923830c4831395365b802a))
* prevent sending a request for the same chain token combinations ([282bdf0](https://github.com/lifinance/widget/commit/282bdf046c01025b61057887613129647ad3d50d))

### [3.4.4](https://github.com/lifinance/widget/compare/v3.4.3...v3.4.4) (2024-08-15)


### Bug Fixes

* improve deposit flow text ([ee5f178](https://github.com/lifinance/widget/commit/ee5f17871a89befa03e920e63ab307b820c6479d))

### [3.4.3](https://github.com/lifinance/widget/compare/v3.4.2...v3.4.3) (2024-08-15)


### Bug Fixes

* add check for coinbase browser ([1899e6d](https://github.com/lifinance/widget/commit/1899e6df451e3e8cf90f58a4011262f0bfc3a26f))
* rename coinbase wallet ([070ce5b](https://github.com/lifinance/widget/commit/070ce5b59a26a426d9064cf352d0ae71d3808a6e))
* window typo ([bbbf91e](https://github.com/lifinance/widget/commit/bbbf91eabd2422c4675df5cdef589a76ae312d3f))

### [3.4.2](https://github.com/lifinance/widget/compare/v3.4.1...v3.4.2) (2024-08-14)


### Bug Fixes

* check for window in next.js ([f9a134f](https://github.com/lifinance/widget/commit/f9a134fa7238aa3ef020c9fededf1d97332ecdbb))

### [3.4.1](https://github.com/lifinance/widget/compare/v3.4.0...v3.4.1) (2024-08-14)


### Bug Fixes

* check for window in next.js ([d873c49](https://github.com/lifinance/widget/commit/d873c49110c2be58cf06d83cbabc2e9817528a4c))

## [3.4.0](https://github.com/lifinance/widget/compare/v3.4.0-beta.3...v3.4.0) (2024-08-14)


### Features

* changing height and present widget better for mobile ([#276](https://github.com/lifinance/widget/issues/276)) ([d2f3ec8](https://github.com/lifinance/widget/commit/d2f3ec880c492e3f3671ca2f6b268de12fdbe174))
* improved fee configuration ([#284](https://github.com/lifinance/widget/issues/284)) ([e7ba200](https://github.com/lifinance/widget/commit/e7ba2002b920905b65a5dcc9a420ffbc247ccb9a))
* optimize wallet sdks handling ([#283](https://github.com/lifinance/widget/issues/283)) ([eee87aa](https://github.com/lifinance/widget/commit/eee87aa1b5e029ff104f38a9598178094c7cd0cd))


### Bug Fixes

* add subvariant deposit key ([abe9ba0](https://github.com/lifinance/widget/commit/abe9ba0b8ae317ddee2e8195dcfb65d4f5c44df4))
* avoid from amount/token reset if they are disabled ([#285](https://github.com/lifinance/widget/issues/285)) ([86820c9](https://github.com/lifinance/widget/commit/86820c96b08064c3ee7224c7f47f1a386a68f78b))

## [3.3.0](https://github.com/lifinance/widget/compare/v3.2.2...v3.3.0) (2024-07-30)


### Features

* improve the display of estimated duration and fees ([#278](https://github.com/lifinance/widget/issues/278)) ([5180526](https://github.com/lifinance/widget/commit/5180526154371c5378c38224592894933d1cc313))


### Bug Fixes

* change assert to with ([#279](https://github.com/lifinance/widget/issues/279)) ([5d6ac56](https://github.com/lifinance/widget/commit/5d6ac569e239317edb288a42918ead107369d1ae))

### [3.2.2](https://github.com/lifinance/widget/compare/v3.2.1...v3.2.2) (2024-07-24)


### Bug Fixes

* allow syncing with mixed chains ([#277](https://github.com/lifinance/widget/issues/277)) ([b32287f](https://github.com/lifinance/widget/commit/b32287fab518e89c90ec5bfd95e0c2781fdc48b0))

### [3.2.1](https://github.com/lifinance/widget/compare/v3.2.0...v3.2.1) (2024-07-22)


### Bug Fixes

* add slippage tooltip ([9624fd1](https://github.com/lifinance/widget/commit/9624fd165fb76f698371afd7569854c4a687cece))
* change send and receive wording ([6585723](https://github.com/lifinance/widget/commit/6585723b8fd9cc88e5e8bad68b1216960d6518f0))
* refuel variant should show get gas review button ([587bbda](https://github.com/lifinance/widget/commit/587bbda834aed5a5599481d40864797707261c0a))
* show correct number of available tools ([da893cc](https://github.com/lifinance/widget/commit/da893cc50cdc266850358628524d6ed7c04185c3))

## [3.2.0](https://github.com/lifinance/widget/compare/v3.1.1...v3.2.0) (2024-07-19)


### Features

* bump sdk ([b85059f](https://github.com/lifinance/widget/commit/b85059f4bb265b305c887601442dcc6f368bc193))

### [3.1.1](https://github.com/lifinance/widget/compare/v3.1.0...v3.1.1) (2024-07-19)


### Bug Fixes

* add new error messages for Solana ([3370507](https://github.com/lifinance/widget/commit/3370507fb0f8132fd1c298fe1439916cebc99f67))
* adjust fees amount USD calculation ([d479ecd](https://github.com/lifinance/widget/commit/d479ecda93e61c45a6ba6ffe7b28eaa55fadebc8))
* adjust get gas title ([ccc11e1](https://github.com/lifinance/widget/commit/ccc11e1cd036f99df6b9f28472455080babd560a))
* adjust step connector color ([f8694cc](https://github.com/lifinance/widget/commit/f8694cc3e60c5be3815b57f0cc742631c90c5e1f))

## [3.1.0](https://github.com/lifinance/widget/compare/v3.0.2...v3.1.0) (2024-07-15)


### Features

* add price impact to transaction details ([#273](https://github.com/lifinance/widget/issues/273)) ([d983b91](https://github.com/lifinance/widget/commit/d983b91d697b45803e67d06dc92fbcf3f5b82d0f))
* improve review page with route tracker, added new fee card and improved route card ([#268](https://github.com/lifinance/widget/issues/268)) ([258c5d3](https://github.com/lifinance/widget/commit/258c5d32cad0e7f306e49288f03921264bdcef73))


### Bug Fixes

* adjust partial transfer message ([#274](https://github.com/lifinance/widget/issues/274)) ([0354930](https://github.com/lifinance/widget/commit/0354930c2036a18c50687c86372b43674b0b24ce))
* import for common js lib react-timer-hook ([#269](https://github.com/lifinance/widget/issues/269)) ([f8075fd](https://github.com/lifinance/widget/commit/f8075fd2678e53e3e1db5d2b9e8f2708919a0ae0))
* json assertions ([#267](https://github.com/lifinance/widget/issues/267)) ([1c0c157](https://github.com/lifinance/widget/commit/1c0c15781ca04ddd059d53324f09ac2b27832d5a))
* remove wagmi warnings ([#271](https://github.com/lifinance/widget/issues/271)) ([6048ef0](https://github.com/lifinance/widget/commit/6048ef022d50ec4ffa35b47aa602bfe851e52a20))

### [3.0.2](https://github.com/lifinance/widget/compare/v3.0.0...v3.0.2) (2024-07-08)


### Bug Fixes

* allowed bridges option doesn't applied correctly ([1e00fb4](https://github.com/lifinance/widget/commit/1e00fb4da805c6001369d8b1806949c52632b0ce))

## [3.0.0](https://github.com/lifinance/widget/compare/v3.0.0-beta.4...v3.0.0) (2024-06-26)

## [2.8.0](https://github.com/lifinance/widget/compare/v2.7.1...v2.8.0) (2023-10-30)


### Features

* add walletConnected event ([f916940](https://github.com/lifinance/widget/commit/f916940f90dea1d71e402a38e875947793fb3b95))

### [2.7.1](https://github.com/lifinance/widget/compare/v2.7.0...v2.7.1) (2023-10-19)


### Bug Fixes

* remove xmlns:xodm attribute ([b64757e](https://github.com/lifinance/widget/commit/b64757eb6eeee4145dc13954dd5ce1758bfcd41e))

## [2.7.0](https://github.com/lifinance/widget/compare/v2.6.3...v2.7.0) (2023-10-19)


### Features

* SafePal wallet added ([#145](https://github.com/lifinance/widget/issues/145)) ([38199fc](https://github.com/lifinance/widget/commit/38199fc60477f49cc1ffdba21e07d731f18d6b8f))


### Bug Fixes

* allow lower mobile view min-width ([6d05d54](https://github.com/lifinance/widget/commit/6d05d546687854000a3e3f3a0d892e5e3b7930bb))

### [2.6.3](https://github.com/lifinance/widget/compare/v2.6.2...v2.6.3) (2023-10-18)


### Bug Fixes

* remove quotes from inside string template ([9fa27a9](https://github.com/lifinance/widget/commit/9fa27a9e2110b4f31baee00effc38c1e577d0513))

### [2.6.2](https://github.com/lifinance/widget/compare/v2.6.1...v2.6.2) (2023-10-16)


### Bug Fixes

* enable gas sufficiency check for SAFE ([#142](https://github.com/lifinance/widget/issues/142)) ([a2030cf](https://github.com/lifinance/widget/commit/a2030cf58dd25b9028e751c9ccebadb67adcb60c))

### [2.6.1](https://github.com/lifinance/widget/compare/v2.6.0...v2.6.1) (2023-10-13)


### Bug Fixes

* use keyframes in string templates ([6799aaf](https://github.com/lifinance/widget/commit/6799aaf6fc3f384aed1cea3ef9bc4cc0676dd9e2))

## [2.6.0](https://github.com/lifinance/widget/compare/v2.5.1...v2.6.0) (2023-10-11)


### Features

* add ReviewTransactionPageEntered event ([b09cfee](https://github.com/lifinance/widget/commit/b09cfee90fbccf2938d10416e64ac7064e73167a))


### Bug Fixes

* use object syntax for keyframes ([8c2032f](https://github.com/lifinance/widget/commit/8c2032f73a6975b8c51c6576909652275719d828))

### [2.5.1](https://github.com/lifinance/widget/compare/v2.5.0...v2.5.1) (2023-10-03)


### Bug Fixes

* events import ([cd97fd1](https://github.com/lifinance/widget/commit/cd97fd1de2c79007fd573b958508bca50304c28e))

## [2.5.0](https://github.com/lifinance/widget/compare/v2.4.6...v2.5.0) (2023-10-03)


### Features

* add apiKey configuration option ([6948dd6](https://github.com/lifinance/widget/commit/6948dd6c06163e0b5ebe87f10b2adec567b6a76a))


### Bug Fixes

* improve fee costs handling ([d5e8c53](https://github.com/lifinance/widget/commit/d5e8c539a43885d661b6b1e2e71059e317654d6b))

### [2.4.6](https://github.com/lifinance/widget/compare/v2.4.5...v2.4.6) (2023-10-02)


### Bug Fixes

* add options for split subvariant ([a63b303](https://github.com/lifinance/widget/commit/a63b303f641f67e9f02c037a81baf1a4362cf6ff))
* adjust actions ([#136](https://github.com/lifinance/widget/issues/136)) ([77da36b](https://github.com/lifinance/widget/commit/77da36bd52b377af1eac4434e435ce63dcc5b7a2))
* custom bridge and exchange select indicator ([#130](https://github.com/lifinance/widget/issues/130)) ([05fb020](https://github.com/lifinance/widget/commit/05fb020ce395971f94a95528581c76bf348306ce))

### [2.4.5](https://github.com/lifinance/widget/compare/v2.4.4...v2.4.5) (2023-09-20)


### Bug Fixes

* hide browser wallets for mobile and tablets ([#131](https://github.com/lifinance/widget/issues/131)) ([bd07ca6](https://github.com/lifinance/widget/commit/bd07ca691d2767c7a01b8baa0cc493ea7604ebbb))
* remove empty spaces from ens- or walletAddress input (LF-3268) ([#121](https://github.com/lifinance/widget/issues/121)) ([d28cbc5](https://github.com/lifinance/widget/commit/d28cbc5eeac5c6bce0ed5fb01291df7787d6d627))

### [2.4.4](https://github.com/lifinance/widget/compare/v2.4.3...v2.4.4) (2023-09-14)


### Bug Fixes

* add close button on mobile ([#119](https://github.com/lifinance/widget/issues/119)) ([8c2ab60](https://github.com/lifinance/widget/commit/8c2ab605b52f8fc30a6ffa01b5d552a6e1f8da9e))

### [2.4.3](https://github.com/lifinance/widget/compare/v2.4.2...v2.4.3) (2023-09-13)

### [2.4.2](https://github.com/lifinance/widget/compare/v2.4.0...v2.4.2) (2023-09-12)


### Bug Fixes

* gate wallet name ([ce423a3](https://github.com/lifinance/widget/commit/ce423a3d902e96bd13baf3e5fddfaba606c7c82a))
* remove unnecessary svg tags ([7f46bdd](https://github.com/lifinance/widget/commit/7f46bdd6c409a64f8c8f573e40af829a1cab5fa1))

### [2.4.1](https://github.com/lifinance/widget/compare/v2.4.0...v2.4.1) (2023-09-11)


### Bug Fixes

* remove unnecessary svg tags ([a33c294](https://github.com/lifinance/widget/commit/a33c29473cc8d1e65e652a28a4c303792063d667))

## [2.4.0](https://github.com/lifinance/widget/compare/v2.3.0...v2.4.0) (2023-09-11)


### Features

* add bitkeep wallet ([#122](https://github.com/lifinance/widget/issues/122)) ([ae83ae6](https://github.com/lifinance/widget/commit/ae83ae63678c8c0471870e5ba19dbc8acf6194c0))
* add gate wallet ([#123](https://github.com/lifinance/widget/issues/123)) ([cd19867](https://github.com/lifinance/widget/commit/cd19867e56fdc2b3d198560e7e7b1dd1d68244d7))
* added okx wallet ([#124](https://github.com/lifinance/widget/issues/124)) ([d977981](https://github.com/lifinance/widget/commit/d977981edd0234b07ce4c44e4fa0b2ed028f5464))

## [2.3.0](https://github.com/lifinance/widget/compare/v2.2.8...v2.3.0) (2023-08-25)


### Features

* add SendToWalletToggled event ([e6bffcf](https://github.com/lifinance/widget/commit/e6bffcf013b34aca999d6a2763a4866c4164b52b))

### [2.2.8](https://github.com/lifinance/widget/compare/v2.2.7...v2.2.8) (2023-08-18)


### Bug Fixes

* remove Huobi, MeetOne, AToken and MyKey wallets (LF-4489) ([#120](https://github.com/lifinance/widget/issues/120)) ([3f52729](https://github.com/lifinance/widget/commit/3f52729a02b6824777707ddc13c65403cc179c09))

### [2.2.7](https://github.com/lifinance/widget/compare/v2.2.6...v2.2.7) (2023-08-14)


### Bug Fixes

* chain order for multiple widget instances ([4255ea3](https://github.com/lifinance/widget/commit/4255ea3ef4c027b2c1a3fedd0004eca6b1db2a2b))

### [2.2.6](https://github.com/lifinance/widget/compare/v2.2.5...v2.2.6) (2023-08-02)


### Bug Fixes

* partially bridged tokens are not displayed correctly ([2a94b8d](https://github.com/lifinance/widget/commit/2a94b8d663f2e860e87e3ea9b0ccbf7e4e2254e7))

### [2.2.5](https://github.com/lifinance/widget/compare/v2.2.4...v2.2.5) (2023-07-25)


### Bug Fixes

* add element ids to containers ([6ba591c](https://github.com/lifinance/widget/commit/6ba591cb4b617033118afd3e9d19ebcf6baba3fc))

### [2.2.4](https://github.com/lifinance/widget/compare/v2.2.3...v2.2.4) (2023-07-25)


### Bug Fixes

* allow header transparent background ([b40d773](https://github.com/lifinance/widget/commit/b40d7736b53c399b2279502a81b4f876c1c8c28c))

### [2.2.3](https://github.com/lifinance/widget/compare/v2.2.1...v2.2.3) (2023-07-24)

### [2.2.2](https://github.com/lifinance/widget/compare/v2.2.1...v2.2.2) (2023-07-24)

### [2.2.1](https://github.com/lifinance/widget/compare/v2.2.0...v2.2.1) (2023-07-12)


### Bug Fixes

* safe env check logic ([#113](https://github.com/lifinance/widget/issues/113)) ([d873e43](https://github.com/lifinance/widget/commit/d873e43f78ca3f47b485ecf10523373a922852a9))

## [2.2.0](https://github.com/lifinance/widget/compare/v2.1.4...v2.2.0) (2023-07-11)


### Features

* add Safe Wallet to wallet management ([#100](https://github.com/lifinance/widget/issues/100)) ([ba1b483](https://github.com/lifinance/widget/commit/ba1b483830253515e58cc2fb785f89493fe8d917))

### [2.1.4](https://github.com/lifinance/widget/compare/v2.1.3...v2.1.4) (2023-07-05)


### Bug Fixes

* make chain filtering available for multiple instances ([b2c9083](https://github.com/lifinance/widget/commit/b2c9083ed230719e1f36f886dc73f3885d22c4ef))
* unknown account [#0](https://github.com/lifinance/widget/issues/0) (LF-3621) ([6f67d4f](https://github.com/lifinance/widget/commit/6f67d4fc95afb9fba05433a9243f8cd4151144ba))

### [2.1.3](https://github.com/lifinance/widget/compare/v2.1.2...v2.1.3) (2023-07-03)

### [2.1.2](https://github.com/lifinance/widget/compare/v2.1.0...v2.1.2) (2023-06-28)


### Bug Fixes

* WalletConnect multiple instances + increase z-index ([e69a3a1](https://github.com/lifinance/widget/commit/e69a3a1455117031f105f56f11763a3291d28f58))

## [2.1.0](https://github.com/lifinance/widget/compare/v2.0.1...v2.1.0) (2023-06-27)


### Features

* add emitter-event for contact support button ([192140a](https://github.com/lifinance/widget/commit/192140a624bc6a55b6f7288632891c1e5cb6576b))
* support WalletConnect v2 ([#89](https://github.com/lifinance/widget/issues/89)) ([5c8cd6d](https://github.com/lifinance/widget/commit/5c8cd6ddabd898ec27411f4b19a5f354d9d365aa))


### Bug Fixes

* add header store context ([5274705](https://github.com/lifinance/widget/commit/5274705c5dfa8412cc25a54792d58ddccb5b501b))

### [2.0.1](https://github.com/lifinance/widget/compare/v2.0.0...v2.0.1) (2023-06-16)


### Bug Fixes

* don't modify estimations for contract calls ([23f8997](https://github.com/lifinance/widget/commit/23f89971b77bf1e72d3b99f471fe49a99259ca8d))
* warning color in dark theme ([bf3aeac](https://github.com/lifinance/widget/commit/bf3aeac92dc0dcc7fad4ed0eb6f7c64618946e01))

## [2.0.0](https://github.com/lifinance/widget/compare/v2.0.0-beta.16...v2.0.0) (2023-06-15)

## [2.0.0-beta.16](https://github.com/lifinance/widget/compare/v2.0.0-beta.15...v2.0.0-beta.16) (2023-06-14)


### Bug Fixes

* drawer button icon color in dark theme ([dcbe962](https://github.com/lifinance/widget/commit/dcbe962dd0a229eeb6d063f33110d62e52a877f8))

## [2.0.0-beta.15](https://github.com/lifinance/widget/compare/v2.0.0-beta.14...v2.0.0-beta.15) (2023-06-14)


### Features

* update nft subvariant to support drawer and send to another wallet ([87d8927](https://github.com/lifinance/widget/commit/87d892778fdc87078509885ea98f0c700c6802d1))


### Bug Fixes

* adjust swap/bridge terminology across the widget ([ca69314](https://github.com/lifinance/widget/commit/ca693143892a25d5468f315c665d49cce972e422))
* don't disable button when refreshing routes ([398e70b](https://github.com/lifinance/widget/commit/398e70b67bbef8add9c9e0a56db4afbfd4658400))
* don't gray out button on loading state ([af2220e](https://github.com/lifinance/widget/commit/af2220ed90ece2bc051b8fa290dc38d2726f749c))
* don't throw if autoConnect fails ([7dc4578](https://github.com/lifinance/widget/commit/7dc4578442aed5728231550157c4b02493a0067b))
* make button gray in loading state ([d64220e](https://github.com/lifinance/widget/commit/d64220e7c62cf05c023c190241cced978cff7bc4))
* request additional route for insurance only when bridging ([84a9bae](https://github.com/lifinance/widget/commit/84a9bae87b9273f1b03cb55f2534f75109859f3e))
* translation tags should work inside tooltip ([afbf669](https://github.com/lifinance/widget/commit/afbf669743d99835fed96bb3b04c506a25dedfb6))
* update progress text ([5d7030d](https://github.com/lifinance/widget/commit/5d7030d26a9dabfd8ec8bf49017e61c226ecc2c7))
* use subvariant split state for button text ([1cb952c](https://github.com/lifinance/widget/commit/1cb952cc8c3051bfd94d10f9a6f47bb1d1d4d29f))

## [2.0.0-beta.14](https://github.com/lifinance/widget/compare/v2.0.0-beta.13...v2.0.0-beta.14) (2023-06-02)


### Bug Fixes

* make icon as a link to address explorer ([e173400](https://github.com/lifinance/widget/commit/e17340004344574eac3426a0c930bb1b7d06590b))
* tabs background color within split subvariant ([beb78c6](https://github.com/lifinance/widget/commit/beb78c6cf4447936e12c739e5ae533064eacac9b))

## [2.0.0-beta.13](https://github.com/lifinance/widget/compare/v2.0.0-beta.12...v2.0.0-beta.13) (2023-05-25)


### Bug Fixes

* prevent decimals removal if no tokens are selected ([b78066e](https://github.com/lifinance/widget/commit/b78066e98ec783ba4662bc562d38ba95a70b64d1))

## [2.0.0-beta.12](https://github.com/lifinance/widget/compare/v2.0.0-beta.11...v2.0.0-beta.12) (2023-05-25)


### Features

* add option to include additional tokens ([e2040bb](https://github.com/lifinance/widget/commit/e2040bb8c56c0ebad6db460b3eb3ad1487fafd33))


### Bug Fixes

* limit decimals for swap input amount ([93973d8](https://github.com/lifinance/widget/commit/93973d82d0c5fa14eac62c7a09f4de84afa9d68d))
* trigger gas suggestion only for supported chains ([d5f5750](https://github.com/lifinance/widget/commit/d5f5750eb5123b946f6c816047683c3eee6bb6a4))

## [2.0.0-beta.11](https://github.com/lifinance/widget/compare/v2.0.0-beta.10...v2.0.0-beta.11) (2023-05-23)


### Bug Fixes

* fix tab radius in split mode ([24fa80b](https://github.com/lifinance/widget/commit/24fa80bff99e5bf5aa33f6d8bd62580699aa1ee1))

## [2.0.0-beta.10](https://github.com/lifinance/widget/compare/v2.0.0-beta.9...v2.0.0-beta.10) (2023-05-23)


### Features

* add HighValueLoss emitter event ([#86](https://github.com/lifinance/widget/issues/86)) ([69d3918](https://github.com/lifinance/widget/commit/69d391852644a09a4ac8b37ec8d4b5ffd61bbe98))
* show insured amount ([b928d08](https://github.com/lifinance/widget/commit/b928d0805360a33b1ec27601c7ade64a6a6fc680))


### Bug Fixes

* max button should return full amount ([64e0592](https://github.com/lifinance/widget/commit/64e05924e5481c96c5d797e90fe11a751356888d))
* remove direct @mui/system import ([39080e4](https://github.com/lifinance/widget/commit/39080e467425be18257cd47377564596e3eff9b3))
* wagmi can't switch chain ([2a708c2](https://github.com/lifinance/widget/commit/2a708c2683abe268936a79bdc071becaeedcf6f4))

## [2.0.0-beta.9](https://github.com/lifinance/widget/compare/v2.0.0-beta.8...v2.0.0-beta.9) (2023-05-15)


### Bug Fixes

* add insufficient funds error handling ([6991ee4](https://github.com/lifinance/widget/commit/6991ee457771540e6da5a723d2bb7201842956b4))
* include auto refuel into gas sufficiency check ([d31f7e4](https://github.com/lifinance/widget/commit/d31f7e4eb393b64204dd364b0e9a85ea4299f421))
* insurance card isn't shown in some cases ([a8eb1ef](https://github.com/lifinance/widget/commit/a8eb1ef6e7fd0a83f1e61c1b9974f18e72796e1a))

## [2.0.0-beta.8](https://github.com/lifinance/widget/compare/v2.0.0-beta.7...v2.0.0-beta.8) (2023-05-11)


### Features

* add hiddenUI toToken option ([4e5376b](https://github.com/lifinance/widget/commit/4e5376b5a9db1fa4b35012b6db3f6fb996555b6e))
* show token address in token list items ([e5d6411](https://github.com/lifinance/widget/commit/e5d64115452a6798fd8d5464ed15d38e1dc49ab4))


### Bug Fixes

* adjust token search field text ([4aa5cef](https://github.com/lifinance/widget/commit/4aa5cefaea78341af0872400fb527cea9140dae0))
* apply auto refuel when swapping to native tokens ([14d5a1a](https://github.com/lifinance/widget/commit/14d5a1ae800779a5ee5547a379777c18284272e3))
* handle duplicates in token list ([ee804da](https://github.com/lifinance/widget/commit/ee804daa522bd695e450792c3613332bb22583ae))
* handle undefined current wallet ([#87](https://github.com/lifinance/widget/issues/87)) ([5b37b6f](https://github.com/lifinance/widget/commit/5b37b6f93e041148d47b6661d0e59b5b3c16c847))
* replace support link ([55a04df](https://github.com/lifinance/widget/commit/55a04dfe35b06d0a3f2804738d9f2278689d16c7))

## [2.0.0-beta.7](https://github.com/lifinance/widget/compare/v2.0.0-beta.6...v2.0.0-beta.7) (2023-05-04)


### Bug Fixes

* widget drawer types for refs ([0168ff7](https://github.com/lifinance/widget/commit/0168ff79154fe9925b199a8e3c36328c7f33babd))

## [2.0.0-beta.6](https://github.com/lifinance/widget/compare/v2.0.0-beta.5...v2.0.0-beta.6) (2023-05-04)


### Features

* add split subvariant ([#81](https://github.com/lifinance/widget/issues/81)) ([7c65124](https://github.com/lifinance/widget/commit/7c65124fb14cdd765c4703625a26865803ddacf1))


### Bug Fixes

* move exodus up the list ([#85](https://github.com/lifinance/widget/issues/85)) ([5fc59bc](https://github.com/lifinance/widget/commit/5fc59bc97b899d5ced2a7fd2dc545470c8c0a976))

## [2.0.0-beta.5](https://github.com/lifinance/widget/compare/v2.0.0-beta.4...v2.0.0-beta.5) (2023-04-28)


### Features

* add exodus wallet ([#80](https://github.com/lifinance/widget/issues/80)) ([2d13333](https://github.com/lifinance/widget/commit/2d1333360b7de203966165390cd04ea30f853b7d))
* add recommended tag tooltip ([6021bb3](https://github.com/lifinance/widget/commit/6021bb38aa17f9bc31a4631221eddd038c132cb8))


### Bug Fixes

* exchange rate hook is undefined on first render ([6fd0c06](https://github.com/lifinance/widget/commit/6fd0c065642c83d39163b5e8b948ae11d75e746b))

## [2.0.0-beta.4](https://github.com/lifinance/widget/compare/v2.0.0-beta.3...v2.0.0-beta.4) (2023-04-27)


### Features

* add tooltip for insurance badge ([9ac2a76](https://github.com/lifinance/widget/commit/9ac2a76cd797fd58307ac55289f89a2ab65fa879))


### Bug Fixes

* correctly return balances on first call ([0b9b30e](https://github.com/lifinance/widget/commit/0b9b30e46e0a7b38afb56cabf454d5ec0f46d149))
* hide history icon when HiddenUI.History is provided ([748c6cd](https://github.com/lifinance/widget/commit/748c6cd3e1ced30e159bcfe2caeba895de3dec1c))
* insurance card should expand when enabled ([d6f47e7](https://github.com/lifinance/widget/commit/d6f47e7ad3e421f41e2c5d3a0be702e1b83c6d20))
* show fallback token step when present ([8a19cb8](https://github.com/lifinance/widget/commit/8a19cb8bd1b8dcc1f79c05dd13782f5461399330))
* update powered by look ([cccd168](https://github.com/lifinance/widget/commit/cccd1689e388910bfe957904c3bcd190f032aaaa))

## [2.0.0-beta.3](https://github.com/lifinance/widget/compare/v2.0.0-beta.2...v2.0.0-beta.3) (2023-04-21)


### Features

* update insurance card and text ([c623d11](https://github.com/lifinance/widget/commit/c623d11cf82e88e987d56932591da4c2fe3b2cf8))


### Bug Fixes

* remove svg icons unnecessary attributes ([#75](https://github.com/lifinance/widget/issues/75)) ([ee12534](https://github.com/lifinance/widget/commit/ee125349c8e3131fb0d9a3a5f6b2c166d10e3431))

## [2.0.0-beta.2](https://github.com/lifinance/widget/compare/v2.0.0-beta.1...v2.0.0-beta.2) (2023-04-20)


### Features

* rename disableI18n -> disableLanguageDetector ([186d28c](https://github.com/lifinance/widget/commit/186d28c1928601afe64c6e0694a2e5cabc3df447))


### Bug Fixes

* set correct width ([72f3a6a](https://github.com/lifinance/widget/commit/72f3a6afe2abe2c6507c9cc2c8461fbbac11f661))

## [2.0.0-beta.1](https://github.com/lifinance/widget/compare/v2.0.0-beta.0...v2.0.0-beta.1) (2023-04-19)


### Features

* new wallet management ([#69](https://github.com/lifinance/widget/issues/69)) ([626bc68](https://github.com/lifinance/widget/commit/626bc68b9f6c8dcdcf34d08e7e7ba13ef01efd19))

## [2.0.0-beta.0](https://github.com/lifinance/widget/compare/v2.0.0-alpha.4...v2.0.0-beta.0) (2023-04-18)


### Features

* add link to insurance coverage ([f8a9df6](https://github.com/lifinance/widget/commit/f8a9df62f3412094ef53a8ce6a285f236917ee05))


### Bug Fixes

* transaction support id should be swap or bridge source one ([d9c7e14](https://github.com/lifinance/widget/commit/d9c7e14eb0c42ea112ebe807a2dffe3b76cc678e))

## [2.0.0-alpha.4](https://github.com/lifinance/widget/compare/v2.0.0-alpha.3...v2.0.0-alpha.4) (2023-04-13)

## [2.0.0-alpha.3](https://github.com/lifinance/widget/compare/v2.0.0-alpha.2...v2.0.0-alpha.3) (2023-04-13)

## [2.0.0-alpha.2](https://github.com/lifinance/widget/compare/v2.0.0-alpha.1...v2.0.0-alpha.2) (2023-04-13)


### Bug Fixes

* make config integrator optional ([7b983de](https://github.com/lifinance/widget/commit/7b983de3ed0fe30c77f8b00f9be36d9c9d87c307))

## [2.0.0-alpha.1](https://github.com/lifinance/widget/compare/v2.0.0-alpha.0...v2.0.0-alpha.1) (2023-04-12)


### Bug Fixes

* long text overflow ([fdf8153](https://github.com/lifinance/widget/commit/fdf8153a312dc4309eaef4a79f882700298a6321))
* route not found using MemoryRouter ([e4a2c47](https://github.com/lifinance/widget/commit/e4a2c47f37df8d69333d487b75e955f2ef21fbfa))
* update step types ([6f547d7](https://github.com/lifinance/widget/commit/6f547d71d0870b5d14778244a185ec2b436bc129))

## [2.0.0-alpha.0](https://github.com/lifinance/widget/compare/v1.32.8...v2.0.0-alpha.0) (2023-03-28)


### ⚠ BREAKING CHANGES

* remove deprecations
* make integrator property required

### Features

* add auto refuel ([41de404](https://github.com/lifinance/widget/commit/41de404b12e989031364c5c3c92c66618dd253f6))
* add insurance ([08162a6](https://github.com/lifinance/widget/commit/08162a666e8416e598b0585f68962953d80f33bb))
* add insurance config option ([9a3f0be](https://github.com/lifinance/widget/commit/9a3f0bee717f44959c798b8edf0feca1aaaeb5a3))
* add maxPriceImpact config options ([458e6a4](https://github.com/lifinance/widget/commit/458e6a4f1b98795d7c300420d22cb7f78e96b828))
* make integrator property required ([d9b2a01](https://github.com/lifinance/widget/commit/d9b2a01cb2a72a2c5987d84e611b3136c0c4a1dc))
* remove deprecations ([a966186](https://github.com/lifinance/widget/commit/a9661868dea3af96b6ac52a63545ba6128468c90))


### Bug Fixes

* add insurable route id ([79e838e](https://github.com/lifinance/widget/commit/79e838e025b0ba887a0a4c98182bb7435d2e73d7))
* adjust card title to protocol steps ([670f67f](https://github.com/lifinance/widget/commit/670f67f47a9497a33a819c32619ccee8f85f6e7e))
* check for ENS name while looking for balances ([ace7070](https://github.com/lifinance/widget/commit/ace7070ff12b8c03393c5a43cf5983affc8d9a06))
* check for funds sufficiency as soon as it becomes possible ([cd1ef6e](https://github.com/lifinance/widget/commit/cd1ef6eb17987a75e620755dbc71506757b4b770))
* don't apply auto refuel when swapping to native tokens ([fe85b38](https://github.com/lifinance/widget/commit/fe85b38174b436e20cecfd7fa95bafd8fecd669c))
* possible duplicate keys ([6d294ed](https://github.com/lifinance/widget/commit/6d294edc9447c54e70943004a5719e8790904354))
* reduce max price impact to 40% ([4b2a718](https://github.com/lifinance/widget/commit/4b2a71879971497bfdba14de82028ad07b0b70d0))
* route priority tags now lowercased ([c93ca15](https://github.com/lifinance/widget/commit/c93ca15b3b5b222cdfcf5ec455aafa02fb16b5b8))
* support input when it starts with a dot ([80857dd](https://github.com/lifinance/widget/commit/80857dd779c4d56caf4242ecdb16d36cdccf0d50))

### [1.32.8](https://github.com/lifinance/widget/compare/v1.32.7...v1.32.8) (2023-03-06)


### Bug Fixes

* add actions permissions ([a8dcf18](https://github.com/lifinance/widget/commit/a8dcf18581057aa1fad95735c81d785d695dc4eb))
* only reset appearance if not set via config ([bc5f164](https://github.com/lifinance/widget/commit/bc5f16471235ffb6afe9bf39839375a1090323a6))
* TextFitter visibility when using display: none ([05eb5aa](https://github.com/lifinance/widget/commit/05eb5aa1eaf34d704e514130daab1255674b08bf))
* use iam role in github actions ([d663c7e](https://github.com/lifinance/widget/commit/d663c7e7c1b7e93775b7d11c8b8546ca7a3b3316))

### [1.32.7](https://github.com/lifinance/widget/compare/v1.32.6...v1.32.7) (2023-03-03)

### [1.32.6](https://github.com/lifinance/widget/compare/v1.32.5...v1.32.6) (2023-03-01)

### [1.32.5](https://github.com/lifinance/widget/compare/v1.32.4...v1.32.5) (2023-03-01)


### Bug Fixes

* provider destructuring doesn't work for WalletConnect ([76647ed](https://github.com/lifinance/widget/commit/76647ede568d2fe8fee2a07b03fc0cb8747ed8c6))
* update local tokens cache to keep priceUSD in sync ([#61](https://github.com/lifinance/widget/issues/61)) ([d3f4d87](https://github.com/lifinance/widget/commit/d3f4d87133f89c5ff4e3276e09492c2d9c279ec2))

### [1.32.4](https://github.com/lifinance/widget/compare/v1.32.3...v1.32.4) (2023-02-24)

### [1.32.3](https://github.com/lifinance/widget/compare/v1.32.2...v1.32.3) (2023-02-22)


### Bug Fixes

* drawer variant isn't wrapped in i18n provider ([c33f0ce](https://github.com/lifinance/widget/commit/c33f0ce36b0c3e49c9dde230fce09804c4bf788a))
* fetch balance more often ([7a7d574](https://github.com/lifinance/widget/commit/7a7d57462a801154ed9c3747189922f94129d608))

### [1.32.2](https://github.com/lifinance/widget/compare/v1.32.1...v1.32.2) (2023-02-20)


### Bug Fixes

* refine ripple effect usage and colors ([#57](https://github.com/lifinance/widget/issues/57)) ([c9eaa91](https://github.com/lifinance/widget/commit/c9eaa91752fedbd4b818c70c3316d6f1ffe1685d))

### [1.32.1](https://github.com/lifinance/widget/compare/v1.32.0...v1.32.1) (2023-02-15)


### Bug Fixes

* add provider for recommended route store ([e31da8f](https://github.com/lifinance/widget/commit/e31da8f7498b4c4174fc79b548e0cd68e3fba40b))

## [1.32.0](https://github.com/lifinance/widget/compare/v1.31.1...v1.32.0) (2023-02-15)


### Features

* revamped settings page ([1b87761](https://github.com/lifinance/widget/commit/1b87761cac44cbca3dc69ee6f3a6fb8f887cf7e0))

### [1.31.1](https://github.com/lifinance/widget/compare/v1.31.0...v1.31.1) (2023-02-10)


### Bug Fixes

* remove sentry ([c1b2d7e](https://github.com/lifinance/widget/commit/c1b2d7e43f3b9d716597929a525639be65c2bf12))

## [1.31.0](https://github.com/lifinance/widget/compare/v1.29.6...v1.31.0) (2023-02-06)


### Features

* add requiredUI config option ([61a7960](https://github.com/lifinance/widget/commit/61a7960b0524d0d96210d4e450028b80f0c58a5d))
* update wallet menu UI and add view on explorer link ([3eb822f](https://github.com/lifinance/widget/commit/3eb822f76ab5880bdc47f195106064739c02d906))


### Bug Fixes

* accept comma as valid decimal delimiter ([9af2686](https://github.com/lifinance/widget/commit/9af26864db130c0999b965a34e18b4c1b5fcaeb5))
* show more decimal places for exchange rate bottom sheet ([88b7f6a](https://github.com/lifinance/widget/commit/88b7f6afac6e6421d134de2b87911be03f96dc24))

## [1.30.0](https://github.com/lifinance/widget/compare/v1.29.6...v1.30.0) (2023-02-02)


### Features

* add requiredUI config option ([61a7960](https://github.com/lifinance/widget/commit/61a7960b0524d0d96210d4e450028b80f0c58a5d))


### Bug Fixes

* show more decimal places for exchange rate bottom sheet ([88b7f6a](https://github.com/lifinance/widget/commit/88b7f6afac6e6421d134de2b87911be03f96dc24))

### [1.29.6](https://github.com/lifinance/widget/compare/v1.29.5...v1.29.6) (2023-01-30)


### Bug Fixes

* preserve old routes while the new ones are loading ([13998ad](https://github.com/lifinance/widget/commit/13998ad9efbdf855f9738a1ef97734df6ff114e5))
* WalletConnect does not connect a second time ([#44](https://github.com/lifinance/widget/issues/44)) ([72b5373](https://github.com/lifinance/widget/commit/72b53739e9255bda82380a567781d35173261463))

### [1.29.5](https://github.com/lifinance/widget/compare/v1.29.4...v1.29.5) (2023-01-25)


### Bug Fixes

* adjust token avatar skeleton badge to match with background ([333b3c3](https://github.com/lifinance/widget/commit/333b3c35a77acc2f3d3cef028b76d871d7543ba2))

### [1.29.4](https://github.com/lifinance/widget/compare/v1.29.3...v1.29.4) (2023-01-24)


### Bug Fixes

* rename gas start and review buttons ([3285151](https://github.com/lifinance/widget/commit/3285151476300cf81579f9838dba142bccc24bf5))

### [1.29.3](https://github.com/lifinance/widget/compare/v1.29.2...v1.29.3) (2023-01-24)


### Bug Fixes

* add id prefix to all ids in case of multiple instances of the widget in a page ([684f6d8](https://github.com/lifinance/widget/commit/684f6d878e99a8e53f27b8c625f614f68c2ee2cc))

### [1.29.2](https://github.com/lifinance/widget/compare/v1.29.1...v1.29.2) (2023-01-23)


### Bug Fixes

* remove namePrefix for chain order ([6e42e76](https://github.com/lifinance/widget/commit/6e42e766565c8f332391d8a5563cb554118a82f0))

### [1.29.1](https://github.com/lifinance/widget/compare/v1.29.0...v1.29.1) (2023-01-23)


### Bug Fixes

* use main border radius in list items ([09a4a4a](https://github.com/lifinance/widget/commit/09a4a4a7fbfacc0247403b22b69150ede44669e9))

## [1.29.0](https://github.com/lifinance/widget/compare/v1.28.4...v1.29.0) (2023-01-23)


### Features

* add StoreProvider and localStorageKeyPrefix config option ([709aa0a](https://github.com/lifinance/widget/commit/709aa0afc7366dee63d82ea6c54d721f72447d62))


### Bug Fixes

* improve dark theme colors ([7dff268](https://github.com/lifinance/widget/commit/7dff2688625eee0e359dc624a698f33687572a8e))
* remove settings provider namePrefix ([0503922](https://github.com/lifinance/widget/commit/0503922581f11565dbcf62174e9576639608d8f9))

### [1.28.4](https://github.com/lifinance/widget/compare/v1.28.3...v1.28.4) (2023-01-10)


### Bug Fixes

* bump zustand + fix imports ([4914880](https://github.com/lifinance/widget/commit/491488013319121200eab269314e37ba4d6fc836))

### [1.28.3](https://github.com/lifinance/widget/compare/v1.28.2...v1.28.3) (2023-01-06)


### Bug Fixes

* bignumber conversion ([a0e6221](https://github.com/lifinance/widget/commit/a0e622195df09cd6056c715f6d23cb3ac7098616))
* make square icon button possible ([9ce176d](https://github.com/lifinance/widget/commit/9ce176d59aa4073cbded7e06c72538a5fb3582eb))

### [1.28.2](https://github.com/lifinance/widget/compare/v1.28.1...v1.28.2) (2023-01-06)


### Bug Fixes

*  expanded view background has no z-index ([f5a955f](https://github.com/lifinance/widget/commit/f5a955fe2980bfc8cbaaeace98ce25fdd45010fc))

### [1.28.1](https://github.com/lifinance/widget/compare/v1.28.0...v1.28.1) (2023-01-05)


### Bug Fixes

* postbuild script ([f06a87a](https://github.com/lifinance/widget/commit/f06a87ab7b7ebb31cb57708e7607a63008c07184))
* postbuild script ([f002233](https://github.com/lifinance/widget/commit/f0022330f0e92bd9941bc5a4e9d556df53266db3))

## [1.28.0](https://github.com/lifinance/widget/compare/v1.27.2...v1.28.0) (2023-01-05)


### Features

* add interactive tools ([acc3aa9](https://github.com/lifinance/widget/commit/acc3aa96e48850d50e179e2b3a7c577b8781af3f))
* new variant draft ([#40](https://github.com/lifinance/widget/issues/40)) ([5d0f36a](https://github.com/lifinance/widget/commit/5d0f36a479101badccfe581f7b0d9fe232072345))
* use yarn v3 and fix dependencies ([b09bc34](https://github.com/lifinance/widget/commit/b09bc3499f1d03a63a7547f2933de884ed0e316d))


### Bug Fixes

* long token names ([596b212](https://github.com/lifinance/widget/commit/596b21203541dde4909d271d02ab333df94fbe03))
* remove sdks ([b0f7018](https://github.com/lifinance/widget/commit/b0f701802a8a418082164c0cab24ce23f3f65aff))

### [1.27.2](https://github.com/lifinance/widget/compare/v1.27.1...v1.27.2) (2022-12-15)


### Bug Fixes

* allow adding crossOrigin tag to avatar props ([d7aff7e](https://github.com/lifinance/widget/commit/d7aff7ea2cd45174a3537e8752171815775f8f01))

### [1.27.1](https://github.com/lifinance/widget/compare/v1.27.0...v1.27.1) (2022-12-13)

## [1.27.0](https://github.com/lifinance/widget/compare/v1.26.5...v1.27.0) (2022-12-13)


### Features

* add hiddenUI and extend disabledUI options ([6aea124](https://github.com/lifinance/widget/commit/6aea124d967cd47fd671b0d475454cd8443928b0))
* add more palette customization options ([2794190](https://github.com/lifinance/widget/commit/27941909d6bc8c10375683258168f157862516a4))
* move failed swaps to hisory after one day ([63bf2d2](https://github.com/lifinance/widget/commit/63bf2d2ba657aa5c7383ead609827f6f1fbfe1cb))


### Bug Fixes

* menu should use main border radius ([2a78952](https://github.com/lifinance/widget/commit/2a78952417e54c573f51be848ed6abe05274806e))
* remove box shadow from swap input ([a93b64b](https://github.com/lifinance/widget/commit/a93b64be090b6268585dfce5c153baa9bb8417e1))
* unblock Review swap button if other routes are possible for execution ([85bb861](https://github.com/lifinance/widget/commit/85bb861c14fa56a8db4e8066aab8443b418f704c))

### [1.26.5](https://github.com/lifinance/widget/compare/v1.26.4...v1.26.5) (2022-12-06)


### Bug Fixes

* chain selection resize ([beae60c](https://github.com/lifinance/widget/commit/beae60cf9a9efa4bd8310d8059dd7d7114ded350))

### [1.26.4](https://github.com/lifinance/widget/compare/v1.26.3...v1.26.4) (2022-12-01)


### Bug Fixes

* add referrer as top level option ([3a5ac47](https://github.com/lifinance/widget/commit/3a5ac47b620304a07fa1b8aa61a386b259b20ff4))
* remove blankwallet ([d62c35d](https://github.com/lifinance/widget/commit/d62c35d70af9869b84c66d25ab2728deb5bf57ca))

### [1.26.3](https://github.com/lifinance/widget/compare/v1.26.2...v1.26.3) (2022-11-29)

### [1.26.2](https://github.com/lifinance/widget/compare/v1.26.1...v1.26.2) (2022-11-28)


### Bug Fixes

* bottom sheet closing ([f34b0b8](https://github.com/lifinance/widget/commit/f34b0b8058fc4e6771b70027560745946dddd2cd))
* clean the cache of available routes after starting the execution ([f60a0dd](https://github.com/lifinance/widget/commit/f60a0dd7359679d894682179808207035c5d9f6a))

### [1.26.1](https://github.com/lifinance/widget/compare/v1.26.0...v1.26.1) (2022-11-24)


### Bug Fixes

* cancelation on backdrop click ([7d648ad](https://github.com/lifinance/widget/commit/7d648ad58e7689428bf52e3e3a85565bb4ea1939))

## [1.26.0](https://github.com/lifinance/widget/compare/v1.25.1...v1.26.0) (2022-11-24)


### Features

* add acceptExchangeRateUpdateHook and improve substatus handling ([2a70a88](https://github.com/lifinance/widget/commit/2a70a88a7b3e159563a628e722ef33ea4d7fc7a6))
* add destination wallet address to swap details ([4214577](https://github.com/lifinance/widget/commit/42145772b46f3cf9e02faa6bf4a67b55bd97f9e0))
* add estimated and paid gas fees to swap details page ([be4f613](https://github.com/lifinance/widget/commit/be4f6133b87cdcda31cbddee7c12e08d5bcaef3a))


### Bug Fixes

* add refresh time for tools and chains ([0a2e4c0](https://github.com/lifinance/widget/commit/0a2e4c0a31ec922e99c91113f6bea7166ae4e154))
* add retry exception for not found routes ([afe2415](https://github.com/lifinance/widget/commit/afe2415b0d888e388e5c45d06de84b593a44fd92))
* adjust connect button color ([68b45a9](https://github.com/lifinance/widget/commit/68b45a9440e05522c24c43e9db06b610d1d8f471))
* change sentry sample rate ([f960704](https://github.com/lifinance/widget/commit/f9607043fac28e171e8543e4e393ebf3e86b20dd))
* correct step title ([5024614](https://github.com/lifinance/widget/commit/5024614f5a063609bb77bb8e2e995f6dbe93c187))
* make main page sticky ([7466c8f](https://github.com/lifinance/widget/commit/7466c8f678a3f9195f32a9303b18eceddccc0d36))
* make support id a source tx hash ([d837b47](https://github.com/lifinance/widget/commit/d837b47df988c00ace068103c3755fc1a560e244))
* not found routes padding ([57d54b2](https://github.com/lifinance/widget/commit/57d54b2664cb3976ab8ab7664dc7d11e6f8b467e))
* reduce refresh time for token balance ([e5bd5af](https://github.com/lifinance/widget/commit/e5bd5afb98a4308f674ced9e7e35be1663a94f71))

### [1.25.1](https://github.com/lifinance/widget/compare/v1.25.0...v1.25.1) (2022-11-17)


### Bug Fixes

* add fee option to top level config ([4ce4d7d](https://github.com/lifinance/widget/commit/4ce4d7d30dc851e52fc3a7001d9b53e4d874affb))

## [1.25.0](https://github.com/lifinance/widget/compare/v1.24.0...v1.25.0) (2022-11-16)


### Features

* add swap partially successful message ([9c3be1e](https://github.com/lifinance/widget/commit/9c3be1e9e2dba70bbeb9f530e3a520eb48ee11a7))


### Bug Fixes

* ability to set default slippage and route priority ([594c427](https://github.com/lifinance/widget/commit/594c427c756c8a3004be25be629450ea352a00e4))
* eagerConnect ([#36](https://github.com/lifinance/widget/issues/36)) ([b2b7dde](https://github.com/lifinance/widget/commit/b2b7dde1c971f67971d9eb0afdc4c65ea3e80a76))
* network error when switching chains ([#37](https://github.com/lifinance/widget/issues/37)) ([cb2b691](https://github.com/lifinance/widget/commit/cb2b691ef13b23d59efef6c3b43ec685e192b6e5))
* update chain value if config did not provide it ([8394cd9](https://github.com/lifinance/widget/commit/8394cd9bf23ec48943db9f9e697a24ba794dbd97))
* updating widget config options in runtime ([75eb492](https://github.com/lifinance/widget/commit/75eb4928a62076d495c8686708269fae562cae42))

## [1.24.0](https://github.com/lifinance/widget/compare/v1.23.1...v1.24.0) (2022-11-11)


### Features

* allow for alternative wallet injections ([#34](https://github.com/lifinance/widget/issues/34)) ([f7790b4](https://github.com/lifinance/widget/commit/f7790b4ca6eb32775aa0446284fa3da07197004f))


### Bug Fixes

* bridges types ([ac21920](https://github.com/lifinance/widget/commit/ac219205d4823f286aa28988b096939ab8ff9bca))
* use toToken from execution if present ([3afa3e5](https://github.com/lifinance/widget/commit/3afa3e5db68ca66f52259c1945ebae00f62763be))

### [1.23.1](https://github.com/lifinance/widget/compare/v1.23.0...v1.23.1) (2022-11-09)


### Bug Fixes

* adjust button text for refuel mode ([e4ce0ef](https://github.com/lifinance/widget/commit/e4ce0ef88b8c5926a2f875ac9e8686e2344484f9))
* adjust margin in refuel mode ([7a47bfc](https://github.com/lifinance/widget/commit/7a47bfc041abe30ad8150c0d8951f5b22f0ff555))
* re-export wallet icons with names ([1bedc9e](https://github.com/lifinance/widget/commit/1bedc9ee6cfd2ed2673f18a2cd16f280a3eca2b5))
* reduce initialization requests in strict mode ([1892674](https://github.com/lifinance/widget/commit/189267431a24dbe375b52d8a2f8aec9523a245de))
* wallets import ([6b20491](https://github.com/lifinance/widget/commit/6b20491131222de27df45bed5d7898fd7ba71b0f))

## [1.23.0](https://github.com/lifinance/widget/compare/v1.22.1...v1.23.0) (2022-11-08)


### Features

* add token avatar skeletons ([c118e8e](https://github.com/lifinance/widget/commit/c118e8ef22b581abdef6b08664bbdbb5bbcc4250))
* show token price in route cards ([e1380f8](https://github.com/lifinance/widget/commit/e1380f8842600c88d5f3181ecc631d7d568ff8fe))


### Bug Fixes

* disable background refetch ([b96ec48](https://github.com/lifinance/widget/commit/b96ec482fa46f029f6a593711958383ba76d7e9c))
* use execution token if present ([4e71609](https://github.com/lifinance/widget/commit/4e71609f8e353b19e2e918313e57aec897c6654e))

### [1.22.1](https://github.com/lifinance/widget/compare/v1.22.0...v1.22.1) (2022-11-07)


### Bug Fixes

* correctly fit swap input text ([9288b58](https://github.com/lifinance/widget/commit/9288b58128bd442f6f42da88264c389cff9c9884))
* fix circular component reference issue ([e3f3209](https://github.com/lifinance/widget/commit/e3f3209b9c7a23c60980edee48a86602cfeb987f))

## [1.22.0](https://github.com/lifinance/widget/compare/v1.21.0...v1.22.0) (2022-10-27)


### Features

* add disabledUI config option ([7d6f95b](https://github.com/lifinance/widget/commit/7d6f95bde908046f267c226eb40d5d5ed7aef8cc))
* add i18n management ([6ec80af](https://github.com/lifinance/widget/commit/6ec80af087c8220d7c32090873c6f872e5e5fe58))
* add useRecommendedRoute config option ([8c5ed74](https://github.com/lifinance/widget/commit/8c5ed744280cec4e95e7c6a20053c11f72c5b3b0))
* new wallet header menu ([0caf75f](https://github.com/lifinance/widget/commit/0caf75f0b39f7164756eb6b49dd56f27af7854f3))
* walletconnect ([#24](https://github.com/lifinance/widget/issues/24)) ([b3e7bcf](https://github.com/lifinance/widget/commit/b3e7bcf845f58049820651f76d4d0f53aa1d88a2))


### Bug Fixes

* allow using symbols in url builder ([f84b340](https://github.com/lifinance/widget/commit/f84b3408e5dd159a0c382debd683ebe3c6e1ca64))
* correct execution time ceiling ([c6cecbd](https://github.com/lifinance/widget/commit/c6cecbde0d17f1721d77cfeda955bb09b8c75f71))
* format numbers ([fe63cdd](https://github.com/lifinance/widget/commit/fe63cdd8181ff680a82b0d8bec8a26d26b885347))

## [1.21.0](https://github.com/lifinance/widget/compare/v1.20.3...v1.21.0) (2022-10-13)


### Features

* add drawer variant to main config ([5407a34](https://github.com/lifinance/widget/commit/5407a34fd6109734ed0a6a27f2cc5445df83d6d7))


### Bug Fixes

* isolate i18next instance ([#14](https://github.com/lifinance/widget/issues/14)) ([e2ff741](https://github.com/lifinance/widget/commit/e2ff741d5e008629bf0443e639b97d611b11ad6e))

### [1.20.3](https://github.com/lifinance/widget/compare/v1.20.2...v1.20.3) (2022-10-12)


### Bug Fixes

* allow integrator option override ([170d604](https://github.com/lifinance/widget/commit/170d6047f9c229cef40f85826079162be92cc2af))

### [1.20.2](https://github.com/lifinance/widget/compare/v1.20.1...v1.20.2) (2022-10-12)


### Bug Fixes

* load only supported chains tokens ([882beb7](https://github.com/lifinance/widget/commit/882beb7e86ffcbfcf61252c51461a81c909c98d9))

### [1.20.1](https://github.com/lifinance/widget/compare/v1.20.0...v1.20.1) (2022-10-10)


### Bug Fixes

* value loss calculation ([02ee277](https://github.com/lifinance/widget/commit/02ee27762fd30f7c6254d90883ef13b3e1365295))

## [1.20.0](https://github.com/lifinance/widget/compare/v1.19.0...v1.20.0) (2022-10-10)


### Features

* add high value loss consent bottom sheet ([f588b43](https://github.com/lifinance/widget/commit/f588b4397083322f012d4b38a94b4a04c33f544c))


### Bug Fixes

* bottom sheet scroll ([0c2aac3](https://github.com/lifinance/widget/commit/0c2aac3816710682e9085d30a7891eab9cfc3508))

## [1.19.0](https://github.com/lifinance/widget/compare/v1.18.9...v1.19.0) (2022-10-10)


### Features

* add delete active swaps button ([3365ed8](https://github.com/lifinance/widget/commit/3365ed89f9253bb35a047ba9a09d47fb4096b0f1))
* add tooltips to cards and header ([5b88a93](https://github.com/lifinance/widget/commit/5b88a93dd5e17b7f0bc58e945267b2f9107866cf))
* add URL search params builder ([9e9c396](https://github.com/lifinance/widget/commit/9e9c396207cb24a969744ab4e95d9b586b7fdb71))


### Bug Fixes

* dark theme card and button adjustments ([06905c4](https://github.com/lifinance/widget/commit/06905c4e75d4f0e2dbb93997e7112d06cb89cb5b))
* disable expandable variant on small devices ([d03c4c8](https://github.com/lifinance/widget/commit/d03c4c8dc46fb2c233ef833b7a8bc962f0cedd0b))
* don't keep bottom sheet mounted ([861bec5](https://github.com/lifinance/widget/commit/861bec598b37a5f00303860a1c270ce908c6352d))
* make action buttons variant contained ([74eb1c6](https://github.com/lifinance/widget/commit/74eb1c62fa79c54c57ef78ef31c22d8fbcb99f46))
* preserve history state ([8662e37](https://github.com/lifinance/widget/commit/8662e371e01bb608feb6febe38e5309021fd1a9c))
* prevent using fromToken/toToken params if chain is not selected ([2e21b9e](https://github.com/lifinance/widget/commit/2e21b9ed315cb50d0789d2f9959332e449d8272d))
* set only right border width ([6f09075](https://github.com/lifinance/widget/commit/6f090752917f5db9093079f774e41f9ccb96349d))
* show time and gas cost default values ([7d9c220](https://github.com/lifinance/widget/commit/7d9c22015aa53411616e6f97e9d61d1a4b5cd5a6))

### [1.18.9](https://github.com/lifinance/widget/compare/v1.18.8...v1.18.9) (2022-09-30)


### Bug Fixes

* add ScopedCssBaseline to expandable view ([a81c216](https://github.com/lifinance/widget/commit/a81c21672813c61f63cb5917c209369fe680d142))
* enable color scheme for container ([d2c2416](https://github.com/lifinance/widget/commit/d2c241675506e1dec57e64855e997d8daaefa15a))
* improve token layout for longer bridge names ([36c341c](https://github.com/lifinance/widget/commit/36c341c2e10700017d6ce6b3dea785c4b32a82c4))
* provide default values if execution time or gas cost are too small ([6bb908b](https://github.com/lifinance/widget/commit/6bb908b35d7a245dfd31879222bbd49654ea5dd6))
* query for tokens if not present in local cache ([d809d8e](https://github.com/lifinance/widget/commit/d809d8e8fdf154ab8b74c5bba30099c019a6d907))
* reduce default slippage ([292c2db](https://github.com/lifinance/widget/commit/292c2dbfabf71a5e1cb492c56f0cd2e8ce83746a))
* remove old routes history object after merge ([487c990](https://github.com/lifinance/widget/commit/487c9909ff9d6fe7ed4d3754779de62217c0ee1f))
* use i18n for execution time ([7c9a188](https://github.com/lifinance/widget/commit/7c9a18806b1fbea6cb5f94447af184c6914b5d0a))

### [1.18.8](https://github.com/lifinance/widget/compare/v1.18.7...v1.18.8) (2022-09-28)


### Bug Fixes

* debouncing should work from the first value ([e288dcf](https://github.com/lifinance/widget/commit/e288dcfc556689941e3e92b8aaf9531037530d4f))
* query tokens only if no local ones are found ([25225fd](https://github.com/lifinance/widget/commit/25225fd5425ed3aff5bd70232e488348935bcc48))

### [1.18.7](https://github.com/lifinance/widget/compare/v1.18.6...v1.18.7) (2022-09-28)


### Bug Fixes

* process type may not exists ([eb44846](https://github.com/lifinance/widget/commit/eb4484602ebda614315f1610bdf64964386a0316))

### [1.18.6](https://github.com/lifinance/widget/compare/v1.18.5...v1.18.6) (2022-09-28)


### Bug Fixes

* drawer layout height ([fe53895](https://github.com/lifinance/widget/commit/fe5389588eadb48c882c01ae08b7287babaa9553))

### [1.18.5](https://github.com/lifinance/widget/compare/v1.18.4...v1.18.5) (2022-09-28)


### Bug Fixes

* set box-sizing to content-box ([2e1319d](https://github.com/lifinance/widget/commit/2e1319ddbe7b9aa8a7b12b8184e2fb950cdb6812))

### [1.18.4](https://github.com/lifinance/widget/compare/v1.18.3...v1.18.4) (2022-09-28)


### Bug Fixes

* remove box-sizing for container ([c56ba98](https://github.com/lifinance/widget/commit/c56ba987ad67ae03f3e8c6a5a1802391ccb8ac2d))

### [1.18.3](https://github.com/lifinance/widget/compare/v1.18.2...v1.18.3) (2022-09-27)


### Bug Fixes

* add retry to token balance checking ([50e2915](https://github.com/lifinance/widget/commit/50e29157648b063277285c6c74aff250ac8fb408))
* add tooltip to chain buttons ([0fd9626](https://github.com/lifinance/widget/commit/0fd9626b58303943e67b98fbc8fc70f74c91a16b))
* adjust wallet address shortening ([d12d4a7](https://github.com/lifinance/widget/commit/d12d4a713829814033e5c3728ae1ee573789f2fb))
* auto focus and clean send wallet field ([a983ca4](https://github.com/lifinance/widget/commit/a983ca4c7dcc7849690f1c0b39b63323bb945157))
* improve funds received message to include wallet address ([5829e64](https://github.com/lifinance/widget/commit/5829e64a67a2b2f663173d96636e5973633f7b9c))

### [1.18.2](https://github.com/lifinance/widget/compare/v1.18.1...v1.18.2) (2022-09-23)


### Bug Fixes

* always expand cards if there are one or two ([5c0b3a3](https://github.com/lifinance/widget/commit/5c0b3a3bfd355572a8c26dbb698e2a82605185da))
* disable route cards if form is not valid ([7165164](https://github.com/lifinance/widget/commit/716516427548148c89e10ba625f63fa2f66efdda))

### [1.18.1](https://github.com/lifinance/widget/compare/v1.18.0...v1.18.1) (2022-09-23)


### Bug Fixes

* remove show all button background ([9990fcc](https://github.com/lifinance/widget/commit/9990fcc12a1ec75ee1149e83bcef4009d377dfa0))

## [1.18.0](https://github.com/lifinance/widget/compare/v1.17.2...v1.18.0) (2022-09-23)


### Features

* add new route selection UI ([beb780c](https://github.com/lifinance/widget/commit/beb780c5e6113a0d079d348e6f9b8e566c15f153))


### Bug Fixes

* hide powered by section on token page ([41cd261](https://github.com/lifinance/widget/commit/41cd2619b3f756828834668248b07973af3103c0))
* improve path parsing ([c9e1a28](https://github.com/lifinance/widget/commit/c9e1a28fa6936a87c870347c08bade43ce509ae2))
* show delete only if history exist ([dd34a1d](https://github.com/lifinance/widget/commit/dd34a1d9f8ee947bfcc509974d448fa46d5cffb8))
* temp fix for MemoryRouter ([555a7d2](https://github.com/lifinance/widget/commit/555a7d24fd4e8345dc091ea631a0f8461f37f393))

### [1.17.2](https://github.com/lifinance/widget/compare/v1.17.1...v1.17.2) (2022-09-14)


### Bug Fixes

* navigate to home page if no routes are found on a page ([4f22c8c](https://github.com/lifinance/widget/commit/4f22c8c65c695c15f61dcce8d1c727c606f551bb))
* only check route data for gas sufficiency ([d2b08be](https://github.com/lifinance/widget/commit/d2b08be94b99841fde302cc2908d57ef4fda8895))

### [1.17.1](https://github.com/lifinance/widget/compare/v1.17.0...v1.17.1) (2022-09-13)


### Bug Fixes

* add chain check to find correct token balance ([cff5de2](https://github.com/lifinance/widget/commit/cff5de2aa931e366a6ea29a8f5f37cfa773f6106))
* reset insufficient gas check ([4afe42a](https://github.com/lifinance/widget/commit/4afe42ac63780611379894b7588129b1bbcc3609))

## [1.17.0](https://github.com/lifinance/widget/compare/v1.16.1...v1.17.0) (2022-09-12)


### Features

* add bridges, exchanges, tokens and chains config options ([457ffb7](https://github.com/lifinance/widget/commit/457ffb7a77c06e0cf22c3e57321529963507e111))

### [1.16.1](https://github.com/lifinance/widget/compare/v1.16.0...v1.16.1) (2022-09-06)


### Bug Fixes

* move sdk initialization to provider ([882e02a](https://github.com/lifinance/widget/commit/882e02ab72e924e6620f4fefe3fbb3a6b7ce3e1c))

## [1.16.0](https://github.com/lifinance/widget/compare/v1.15.1...v1.16.0) (2022-09-06)


### Features

* add active swaps page and live updates ([4d470b5](https://github.com/lifinance/widget/commit/4d470b52be482c0b75c9c2e88bc1104dba865890))
* add checkboxes to bridges and exchanges selection ([88a4e5d](https://github.com/lifinance/widget/commit/88a4e5d2707d6f9f24262c52f37134d1459bb0ac))
* add new chain selection view ([3c4d3fe](https://github.com/lifinance/widget/commit/3c4d3fe0030cbc5ba5bb7d644adbfe6c8c26b0c2))
* add sdk configuration option ([74aaead](https://github.com/lifinance/widget/commit/74aaead1f6648c79d48e0e300b842867751e6543))
* add swap completed and failed events ([69ff4bc](https://github.com/lifinance/widget/commit/69ff4bc4994b8de7777403e444e3938c2fa85b0e))
* add widget events ([7c0857e](https://github.com/lifinance/widget/commit/7c0857e3ee3505f89cdc575706c0b7ef5f9ac2fe))
* sort executing routes ([f9fecac](https://github.com/lifinance/widget/commit/f9fecac7cb3551a1f60d77446cebb264269a340d))


### Bug Fixes

* better handle chain switch rejection ([48d34ce](https://github.com/lifinance/widget/commit/48d34ce786abf8e324de1b6ce8981303cd55bd5b))
* correctly disable button if form is not valid ([2a536d9](https://github.com/lifinance/widget/commit/2a536d9b6cfada26c7ac1d95b9f103bef53b84ab))
* filter tools we no longer have ([edc5fb8](https://github.com/lifinance/widget/commit/edc5fb890875ce63a5f72d5c1eadeb7f226ad283))
* set fromAmount to 0 after starting the swap ([9493fed](https://github.com/lifinance/widget/commit/9493fed8a05523e722e5c6cee009e45a0c8211d3))

### [1.15.1](https://github.com/lifinance/widget/compare/v1.15.0...v1.15.1) (2022-08-25)

## [1.15.0](https://github.com/lifinance/widget/compare/v1.14.1...v1.15.0) (2022-08-24)


### Features

* add send to wallet field ([9f23752](https://github.com/lifinance/widget/commit/9f23752a2879b24ad188e814a31ba7d9c338c4cc))


### Bug Fixes

* better handle go back navigation ([c0840a4](https://github.com/lifinance/widget/commit/c0840a47a77e6f403b1e753663824ccacad6cb26))
* check if value compatible with Big.js ([4617954](https://github.com/lifinance/widget/commit/46179545b71d6c471156dc4b1574a80e36a9a299))

### [1.14.1](https://github.com/lifinance/widget/compare/v1.14.0...v1.14.1) (2022-08-22)


### Bug Fixes

* increase token list overscan ([440aabd](https://github.com/lifinance/widget/commit/440aabd929a8c1117502b4c9b7565a2714f657fd))

## [1.14.0](https://github.com/lifinance/widget/compare/v1.13.7...v1.14.0) (2022-08-22)


### Features

* check for new package versions ([573f639](https://github.com/lifinance/widget/commit/573f63995013a6400ac8d356b931e4c4bbdd210e))

### [1.13.7](https://github.com/lifinance/widget/compare/v1.13.6...v1.13.7) (2022-08-22)


### Bug Fixes

* contrast text color ([4d090e9](https://github.com/lifinance/widget/commit/4d090e98fcac4f3cdfb148df932e5b2e122671c5))

### [1.13.6](https://github.com/lifinance/widget/compare/v1.13.5...v1.13.6) (2022-08-19)

### [1.13.5](https://github.com/lifinance/widget/compare/v1.13.4...v1.13.5) (2022-08-19)

### [1.13.4](https://github.com/lifinance/widget/compare/v1.13.3...v1.13.4) (2022-08-19)

### [1.13.3](https://github.com/lifinance/widget/compare/v1.13.2...v1.13.3) (2022-08-19)

### [1.13.2](https://github.com/lifinance/widget/compare/v1.13.1...v1.13.2) (2022-08-17)


### Bug Fixes

* ignore getAddress error ([df64eba](https://github.com/lifinance/widget/commit/df64ebad065c94cee52350f87030604858181446))
* nextjs icon import ([0b023ce](https://github.com/lifinance/widget/commit/0b023ced48a592c30f53f98379dce7db56ddb5fb))

### [1.13.1](https://github.com/lifinance/widget/compare/v1.13.0...v1.13.1) (2022-08-11)


### Bug Fixes

* icons import ([43ff424](https://github.com/lifinance/widget/commit/43ff4245cfab208e3ddfcc9b0597a91d0fa795f9))

## [1.13.0](https://github.com/lifinance/widget/compare/v1.12.1...v1.13.0) (2022-08-11)


### Features

* add advanced token search ([4e4068a](https://github.com/lifinance/widget/commit/4e4068a6455dd6a0a770724567df7dd9d06e57ee))
* add featured tokens ([a941359](https://github.com/lifinance/widget/commit/a941359055d733e48863e11c27ca38579dedc483))
* parse config from search params ([f01f333](https://github.com/lifinance/widget/commit/f01f3338445b9964fb1b2f57605a94156ee1b63d))
* set wallet chain as default if config option is not provided ([d04285d](https://github.com/lifinance/widget/commit/d04285dbf87eed3f9d72d0b6e6a34144b7dd323e))

### [1.12.1](https://github.com/lifinance/widget/compare/v1.12.0...v1.12.1) (2022-08-06)


### Bug Fixes

* fromTokenAmount prevents showing routes on initial load ([ffcd4fd](https://github.com/lifinance/widget/commit/ffcd4fd83c6399ca605d1e89703d827e56349858))
* gas sufficiency message appears after reloading while executing the route ([e281787](https://github.com/lifinance/widget/commit/e2817875f48efb3e1d896dc2e92c81c15603a7c6))
* remove resuming route after switching chain ([7e3be5c](https://github.com/lifinance/widget/commit/7e3be5c02d7a4b55660e0ae7d9f00659dbbf7fc6))
* switch chain only if route exists ([cf3c7d6](https://github.com/lifinance/widget/commit/cf3c7d6c763ab8f9de89339e6c330bb458e5f4bc))
* sync drawer animation with button ([858c3b5](https://github.com/lifinance/widget/commit/858c3b58979d92d34016d6f5fb3425d40e4205f0))
* underlying network changed error ([fa1ebee](https://github.com/lifinance/widget/commit/fa1ebeed7617bd6025f3a6213192aad1e559c25b))
* wait for balances to load before showing warning ([58ae002](https://github.com/lifinance/widget/commit/58ae00274be9d1879cf479e038ab3c5c9d99c813))

## [1.12.0](https://github.com/lifinance/widget/compare/v1.11.4...v1.12.0) (2022-07-28)


### Features

* add delete swap history button ([91f6642](https://github.com/lifinance/widget/commit/91f6642d43c5174b693e5c58b8a11a1404ddf7ab))

### [1.11.4](https://github.com/lifinance/widget/compare/v1.11.3...v1.11.4) (2022-07-27)


### Bug Fixes

* add missing translations ([8fc5cbe](https://github.com/lifinance/widget/commit/8fc5cbe3748450e250ddd23ffe34e881f8f1f9d6))
* show skeletons while loading after not found routes state ([3960544](https://github.com/lifinance/widget/commit/3960544bb7a9daeda038388bf37f94361c2c302f))

### [1.11.3](https://github.com/lifinance/widget/compare/v1.11.2...v1.11.3) (2022-07-27)


### Bug Fixes

* add hover state for disabled button ([917560c](https://github.com/lifinance/widget/commit/917560c64b17856a83fc811401821b933425986c))
* add missing currentRoute ([ac9df1e](https://github.com/lifinance/widget/commit/ac9df1e08d70e64da0055068856ee2dc6643dd6c))

### [1.11.2](https://github.com/lifinance/widget/compare/v1.11.1...v1.11.2) (2022-07-27)


### Bug Fixes

* shape and color theme inconsistency ([2701476](https://github.com/lifinance/widget/commit/2701476eb1e6610366d1e748f3f16c170f465c0b))

### [1.11.1](https://github.com/lifinance/widget/compare/v1.11.0...v1.11.1) (2022-07-27)


### Bug Fixes

* gas message is not shown in some cases ([52fcfaf](https://github.com/lifinance/widget/commit/52fcfaf541b619b7af51b7593347e8a83577f99c))
* header action is not shown in some cases ([d5840e8](https://github.com/lifinance/widget/commit/d5840e8259a1fb0cf936e62b22c86cf8343fb797))
* missing routes ([c8ee71d](https://github.com/lifinance/widget/commit/c8ee71d6c6d6768028a0c69bc23704827fb3f90d))

## [1.11.0](https://github.com/lifinance/widget/compare/v1.10.4...v1.11.0) (2022-07-26)


### Features

* add chain icons to token avatars ([5cb5343](https://github.com/lifinance/widget/commit/5cb534348e6c3679c96e0a61487d189ca874fa0b))
* add swap history ([00f6fd7](https://github.com/lifinance/widget/commit/00f6fd78303a686eb8afa5e148333f7f3d094984))
* add tools icons to swap details ([5b652d7](https://github.com/lifinance/widget/commit/5b652d719348a47df0dfe2279cb4ede688f8f3b4))
* connect executing routes to wallet address ([37a736b](https://github.com/lifinance/widget/commit/37a736b39a665f50ea83a980f5edae388568360c))


### Bug Fixes

* add keys ([e381f06](https://github.com/lifinance/widget/commit/e381f06d0ecbb1e30e9b1bb8fc52eca6ff904f48))
* disable when no routes found ([9ee7c3a](https://github.com/lifinance/widget/commit/9ee7c3a471d7dba003a4bf40f1ddb18746076fe1))
* improve gas sufficiency handling ([164501c](https://github.com/lifinance/widget/commit/164501c600454f4bdd499dc02fb6655475ef9127))
* lower font in headers ([66fc7d9](https://github.com/lifinance/widget/commit/66fc7d9bd7ca1b9a7d118c138b239843e974bb3f))
* make formattedTools persistent ([8fde026](https://github.com/lifinance/widget/commit/8fde026f07bddf7cecf9941592258a3f1a726884))
* make icons outlined ([91495a9](https://github.com/lifinance/widget/commit/91495a93102ffc748d3829a894ba8f617d3168c1))
* minor layout issues ([adad66a](https://github.com/lifinance/widget/commit/adad66aa601734a9e46969bacfbe0ba736900254))
* remove attemptEagerConnect ([61506cf](https://github.com/lifinance/widget/commit/61506cf1ae93d93e50f6f0a765cf105e34078d84))
* remove border if no routes found ([99d3355](https://github.com/lifinance/widget/commit/99d33551dde50fd307dac527f4f15b6f8555ece9))
* reverse chain and token if only one selected ([43462cd](https://github.com/lifinance/widget/commit/43462cda58a5ff51c38cd502d59107f7413157bf))
* show more than one route on the main page ([bd7c8dd](https://github.com/lifinance/widget/commit/bd7c8dd1fd97cc71824e665f4ef26b1c1e48d5f7))
* show swap routes progress during initial loading ([911a5c5](https://github.com/lifinance/widget/commit/911a5c5432dd6cd3336b2d36fd41c00d310403dd))
* show tool names in settings ([297fa96](https://github.com/lifinance/widget/commit/297fa9691d44334603ec8e9f18b37a6665c191b1))
* swap button wording ([66879a6](https://github.com/lifinance/widget/commit/66879a6ca3e06da7dd92bdc33ec97fc8e1989014))
* title ([fc21139](https://github.com/lifinance/widget/commit/fc2113962b9a8830d925698e0c7fc2289feb7534))

### [1.10.4](https://github.com/lifinance/widget/compare/v1.10.3...v1.10.4) (2022-07-18)


### Bug Fixes

* networkChanged is deprecated ([d901074](https://github.com/lifinance/widget/commit/d9010748196d74669c67b151f679951a7db9de2d))
* show correct final toAmount ([4a64558](https://github.com/lifinance/widget/commit/4a645580f42fc9841676aa2a68c2d7f2a49f6116))
* show warning only in production build ([4e34b3b](https://github.com/lifinance/widget/commit/4e34b3b715ae6e2470c2f2d9c2a2fbc977f26566))

### [1.10.3](https://github.com/lifinance/widget/compare/v1.10.2...v1.10.3) (2022-07-18)


### Bug Fixes

* disable sentry if widget is not mounted ([cccb78d](https://github.com/lifinance/widget/commit/cccb78dce42d95cdc2c58bf249418d4087cdbcee))

### [1.10.2](https://github.com/lifinance/widget/compare/v1.10.1...v1.10.2) (2022-07-18)


### Bug Fixes

* don't show routes with 0 fromAmount ([e2a4473](https://github.com/lifinance/widget/commit/e2a44731d454ee4be1475583b47478808c61f00e))
* insufficient gas message ([0b24868](https://github.com/lifinance/widget/commit/0b24868a8110f313b5e2d09014ada80846c6aafd))
* NaN when no gas cost is provided ([2adea9a](https://github.com/lifinance/widget/commit/2adea9a80833a220e0227119c8a41b988cf88ae4))
* too many re-renders ([c68c558](https://github.com/lifinance/widget/commit/c68c558d579a3d6e58ba5d88209c67da39f64c4e))

### [1.10.1](https://github.com/lifinance/widget/compare/v1.10.0...v1.10.1) (2022-07-15)


### Bug Fixes

* propagate width props to drawer mode ([8d36f1c](https://github.com/lifinance/widget/commit/8d36f1c5db9186f507d996c4bea7a40b85dd1567))
* show correct step details label ([931a67d](https://github.com/lifinance/widget/commit/931a67dcfdefadaf9c41a98b8e42bde12c7cedc8))

## [1.10.0](https://github.com/lifinance/widget/compare/v1.9.0...v1.10.0) (2022-07-15)


### Features

* add and always include integrator option ([9e57ee3](https://github.com/lifinance/widget/commit/9e57ee32e27e23c44519a815608a25a46b257b1b))


### Bug Fixes

* better handle gas check with disconnected wallet ([432ebf4](https://github.com/lifinance/widget/commit/432ebf431d6c8c3357eec931d3bef244c611404b))
* handle disconnected wallet and switch chain on the swap page ([08ceb08](https://github.com/lifinance/widget/commit/08ceb08ae920d28f5894ac4aaf25ac47127a68b1))
* show routes with disconnected wallet ([f875f4e](https://github.com/lifinance/widget/commit/f875f4e07416d114156d98a69bd6960ee70f65b6))
* use default readme across packages ([db69a26](https://github.com/lifinance/widget/commit/db69a261816cd4b7e28ce2dcd2b8f7f6d499bbdf))

## [1.9.0](https://github.com/lifinance/widget/compare/v1.8.1...v1.9.0) (2022-07-14)


### Features

* add no routes available message ([797db9c](https://github.com/lifinance/widget/commit/797db9c05d0870e837eb70ee2b6861e80cfd94cc))


### Bug Fixes

* shifting of big amount ([065ee86](https://github.com/lifinance/widget/commit/065ee861b5cac542a193bebdb6f29a862239c99b))

### [1.8.1](https://github.com/lifinance/widget/compare/v1.8.0...v1.8.1) (2022-07-12)


### Bug Fixes

* imports ([39ddeb0](https://github.com/lifinance/widget/commit/39ddeb04142bbbe18526a999cd652abfe625ebab))

## [1.8.0](https://github.com/lifinance/widget/compare/v1.7.0...v1.8.0) (2022-07-12)


### Features

* add page not found message ([2c1b381](https://github.com/lifinance/widget/commit/2c1b38157dd45930b64f4da992568182137af992))
* show insufficient gas error messages on swap page ([0152fd1](https://github.com/lifinance/widget/commit/0152fd1ea9dd663f859d1b35526842bfe79b8161))


### Bug Fixes

* check gas sufficiency for chain native tokens ([9deea31](https://github.com/lifinance/widget/commit/9deea31758d81d5b34018326d41a7cc337f18a45))
* current route is not always updated ([ebd11cc](https://github.com/lifinance/widget/commit/ebd11cce12dc3e551e4d40880f3ff2df2e7ebde5))
* current route is not always updated ([d291348](https://github.com/lifinance/widget/commit/d2913482f6876b8ec36e8b195fcbfa3144d4e50f))
* insert empty box to center the header ([674bf90](https://github.com/lifinance/widget/commit/674bf903f7b41162df4de6bb3d87a344354befd4))
* make cursor pointer ([54f32ff](https://github.com/lifinance/widget/commit/54f32ff85959c291f1995f1782f4451c6998d53d))
* update insufficient gas error messages look ([3172f9a](https://github.com/lifinance/widget/commit/3172f9aa20c680e0b54ea777651cebacd43d18e1))
* warning message colors ([19652bf](https://github.com/lifinance/widget/commit/19652bffd31e5ca2b18b888aac34214258a1bd1d))
* wording for token allowance ([a81a9c7](https://github.com/lifinance/widget/commit/a81a9c7df768bb70285d300e12091be96c7ebe01))

## [1.7.0](https://github.com/lifinance/widget/compare/v1.6.1...v1.7.0) (2022-07-06)


### Features

* deactivate metamask provider check ([#8](https://github.com/lifinance/widget/issues/8)) ([d34eba3](https://github.com/lifinance/widget/commit/d34eba3869a34f1c92a2019eafac4a87b57e4c84))


### Bug Fixes

* **Safari:** overlapping issue ([f2590e2](https://github.com/lifinance/widget/commit/f2590e24f0b19865f3315c47bee1a949f332f2e0))

### [1.6.1](https://github.com/lifinance/widget/compare/v1.6.0...v1.6.1) (2022-07-06)


### Bug Fixes

* fix styles for mobile ([c3930ca](https://github.com/lifinance/widget/commit/c3930cabfcbad2624a8b933c535869d9694da035))
* **Safari:** top border radius and right scrollbar are hidden by overlapping element ([ff4f2a6](https://github.com/lifinance/widget/commit/ff4f2a62ef9da00eed067fe28899e83e0ed22eec))
* show only if amount is present ([fa5c590](https://github.com/lifinance/widget/commit/fa5c5907024d3af2cef0d3bcc9b4e51db632c441))

## [1.6.0](https://github.com/lifinance/widget/compare/v1.5.0...v1.6.0) (2022-07-05)


### Features

* add insufficient gas and funds messages ([c016e15](https://github.com/lifinance/widget/commit/c016e15979246db85b81101ada11e3a88326990a))
* add slippage too large error ([17b0780](https://github.com/lifinance/widget/commit/17b0780a6399771728eb6e7ca8a360364428d781))


### Bug Fixes

* handle replaced transaction ([2a0674d](https://github.com/lifinance/widget/commit/2a0674dec5230a00bea97d27e5c0d8686ceb866f))
* sometimes account signer is not found after page refresh ([054648e](https://github.com/lifinance/widget/commit/054648e2c86aeafcb6f1a77e3708f865b82c869b))

## [1.5.0](https://github.com/lifinance/widget/compare/v1.4.0...v1.5.0) (2022-07-01)


### Features

* add crash reports and diagnostic data collection ([276f624](https://github.com/lifinance/widget/commit/276f62450441999dd5fb789ac7b256cf181df84b))


### Bug Fixes

* can't select tokens with the same address ([60e6b44](https://github.com/lifinance/widget/commit/60e6b446ce6142c5b6e742f973d4206abf963d34))
* PoweredBy hover color ([e6b75d1](https://github.com/lifinance/widget/commit/e6b75d14ca97173858f70cf1b85e2bc03c25d56f))

## [1.4.0](https://github.com/lifinance/lifi-widget/compare/v1.3.2...v1.4.0) (2022-06-27)


### Features

* hide internal wallet UI if walletManagement is provided ([68dd45f](https://github.com/lifinance/lifi-widget/commit/68dd45fbd5712cf5348c3a1bd53bc4d7c1684c50))

### [1.3.2](https://github.com/lifinance/lifi-widget/compare/v1.3.1...v1.3.2) (2022-06-27)


### Bug Fixes

* handleSwapButtonClick for external wallet menagement ([9d680a8](https://github.com/lifinance/lifi-widget/commit/9d680a8b975cdecb152b242f3c0bdaeaa9c795c7))

### [1.3.1](https://github.com/lifinance/lifi-widget/compare/v1.3.0...v1.3.1) (2022-06-22)

## [1.3.0](https://github.com/lifinance/lifi-widget/compare/v1.2.0...v1.3.0) (2022-06-22)


### Features

* add external wallet management functionality ([#9](https://github.com/lifinance/lifi-widget/issues/9)) ([459589b](https://github.com/lifinance/lifi-widget/commit/459589b161ad5e440f3f7c0cfa6a2685af7ef5d1))


### Bug Fixes

* build errors ([161f503](https://github.com/lifinance/lifi-widget/commit/161f5032af804e6f3a098a2bc4dd9ce2dbbe1ca5))

## [1.2.0](https://github.com/lifinance/lifi-widget/compare/v1.1.3...v1.2.0) (2022-06-13)


### Features

* save settings to localStorage ([ee4a9d1](https://github.com/lifinance/lifi-widget/commit/ee4a9d1ca96cfa26388641b137123a2a2c8d2b2d))


### Bug Fixes

* always initialize tools ([2d2be1a](https://github.com/lifinance/lifi-widget/commit/2d2be1a0842f5dae1784424efed53a578898cc6a))
* font size in some circumstances ([35ac8c8](https://github.com/lifinance/lifi-widget/commit/35ac8c8f7edf348651d947433e577e1cdeabe021))
* make tools optional on first load ([4b8ab69](https://github.com/lifinance/lifi-widget/commit/4b8ab6971fdebed6995b209544cede7bfc4d967d))
* remove home route ([2085bc6](https://github.com/lifinance/lifi-widget/commit/2085bc67decaa60cd94047ec035c9947a872a3c1))
* restrict variations of config usage ([5ec0fcc](https://github.com/lifinance/lifi-widget/commit/5ec0fcc4576eefa6f38175287f1ff00bd86ad551))

### [1.1.3](https://github.com/lifinance/lifi-widget/compare/v1.1.2...v1.1.3) (2022-06-08)


### Bug Fixes

* usage inside nested routers ([0cc9835](https://github.com/lifinance/lifi-widget/commit/0cc98354825b2b579cf82ed4a7dd5b466adc307d))

### [1.1.2](https://github.com/lifinance/lifi-widget/compare/v1.1.1...v1.1.2) (2022-06-08)


### Bug Fixes

* build with fonts and icons ([9d2f598](https://github.com/lifinance/lifi-widget/commit/9d2f598a6682982d99c64f60e11a665d27060dc5))
* make config optional ([ea14369](https://github.com/lifinance/lifi-widget/commit/ea14369e3462c04517d3fc05f93af86b908499f0))

### [1.1.1](https://github.com/lifinance/lifi-widget/compare/v1.1.0...v1.1.1) (2022-06-08)


### Bug Fixes

* enable all default chains ([0215034](https://github.com/lifinance/lifi-widget/commit/02150348eccf563853d03c4f07968c7a0faa97be))

## [1.1.0](https://github.com/lifinance/lifi-widget/compare/v1.0.1...v1.1.0) (2022-06-08)


### Features

* add route priority badges (tags) to route cards ([31e18ea](https://github.com/lifinance/lifi-widget/commit/31e18ea092e7fe48cac290623d3bfaec81b23174))


### Bug Fixes

* auto calculate header hight ([80b317e](https://github.com/lifinance/lifi-widget/commit/80b317ec842c4e1816a1c048530b6f062cc23ea9))
* disable selection of the same tokens ([9fb33e9](https://github.com/lifinance/lifi-widget/commit/9fb33e98c1525e5e22a9b969bca45f4c6261067d))
* remove delay when pressing the max button ([70a1691](https://github.com/lifinance/lifi-widget/commit/70a16916f93083c0e4667089851bc0d800fcdf88))
* routes are not always refreshed correctly after time was elapsed ([67058c6](https://github.com/lifinance/lifi-widget/commit/67058c68217d8df413c7a7f8a85ef42afe32bff0))

### [1.0.1](https://github.com/lifinance/lifi-widget/compare/v1.0.0...v1.0.1) (2022-06-06)

## 1.0.0 (2022-06-06)


### ⚠ BREAKING CHANGES

* prepare to publish

### Features

* ability to remove active route ([f4e5c32](https://github.com/lifinance/lifi-widget/commit/f4e5c320b84ed4a2a91819860abb41fa67d67321))
* add appearance settings ([7d36597](https://github.com/lifinance/lifi-widget/commit/7d365976e78c5fbd83c21a99fb5fa0e9212fa4cf))
* add arrow to swap routes ([11f154e](https://github.com/lifinance/lifi-widget/commit/11f154e56b413087878a714e317618586bc9b262))
* add auto color scheme checkbox ([75eddcc](https://github.com/lifinance/lifi-widget/commit/75eddcc775bba26e33b89073a4600b11872fe0e6))
* add border radius customization ([779b935](https://github.com/lifinance/lifi-widget/commit/779b935f8114704002c3f7aa82dc4da30552a9c3))
* add CardTitle ([260339a](https://github.com/lifinance/lifi-widget/commit/260339adf5338307004dc8afbff21ddba770d958))
* add connect wallet button ([4e93bcc](https://github.com/lifinance/lifi-widget/commit/4e93bcc22e5e5948d10e520716c88351f6edd6f8))
* add ContainerDrawer ([ba19dac](https://github.com/lifinance/lifi-widget/commit/ba19dac21796e4ea2bd47387867de0cd6c69d9eb))
* add dark color scheme support ([b70526a](https://github.com/lifinance/lifi-widget/commit/b70526a20b326bf815258f8617f6937e44cf9db7))
* add dark mode switch ([b66eabc](https://github.com/lifinance/lifi-widget/commit/b66eabcd3a8fa9689c696b337b7a0a61b2024f84))
* add details to route cards ([bbd5926](https://github.com/lifinance/lifi-widget/commit/bbd5926f7189d716c23b06cbed49d215227e60a9))
* add different layout presentations ([e7c495e](https://github.com/lifinance/lifi-widget/commit/e7c495e25d14a18da812549ee9bf440248648b83))
* add different layout presentations ([05cbcb6](https://github.com/lifinance/lifi-widget/commit/05cbcb6ddfc26032edbe60b288ec0ed062b47d4d))
* add error appearance ([095a39f](https://github.com/lifinance/lifi-widget/commit/095a39fb3625320a8fbc9a0f243ee2516296fb5b))
* add error messages for process ([20542bc](https://github.com/lifinance/lifi-widget/commit/20542bc2f792383eb74cccf91aaac6a93bfb3866))
* add font family customization ([ea46d79](https://github.com/lifinance/lifi-widget/commit/ea46d79c3d3d1c265d7ae2d52a80a6310ddfa6c6))
* add header, add form draft ([4ee2615](https://github.com/lifinance/lifi-widget/commit/4ee261599ed9cea6a23012ab9507bc857ae8e0cc))
* add i18n support, upgrade to React 18 ([54ef854](https://github.com/lifinance/lifi-widget/commit/54ef854dcbaa571dd14c7503031688b815239b93))
* add Inter font ([f814b3a](https://github.com/lifinance/lifi-widget/commit/f814b3a32c6c086619f20dd0e36ef2a88744f6e3))
* add LI.FI as a tool ([a637ca0](https://github.com/lifinance/lifi-widget/commit/a637ca0ff65516dd8b680bc38286205232b1f4a2))
* add link ([acd71c0](https://github.com/lifinance/lifi-widget/commit/acd71c00c4272f165e63b9780a989cdd994677e7))
* add link to block explorer ([69c2ee1](https://github.com/lifinance/lifi-widget/commit/69c2ee118687f044870193d99adaaa38dc031f22))
* add powered by section ([0226495](https://github.com/lifinance/lifi-widget/commit/02264957143fa8f2c4f47431933795b343e2990d))
* add react-scripts with support of monorepo ([fae05f5](https://github.com/lifinance/lifi-widget/commit/fae05f59a976409997cf9ae0b525d1b295be3ce1))
* add reverse tokens button ([b0f826d](https://github.com/lifinance/lifi-widget/commit/b0f826db7844c62ca16ed0e8380271c4f0260a1f))
* add secondary color customization ([471cd93](https://github.com/lifinance/lifi-widget/commit/471cd93c28fdfa981db76fbd8577332ff82719ea))
* add select chain and token compact layout ([66d0beb](https://github.com/lifinance/lifi-widget/commit/66d0bebac4721d30cf34b991b22bf8eb4ae77c16))
* add select token drawer, header improvements ([00c28a9](https://github.com/lifinance/lifi-widget/commit/00c28a9bf137808e87d7a279ef0f2a4fae925bbb))
* add send to recipient switch, refine colors ([d674546](https://github.com/lifinance/lifi-widget/commit/d674546774d4a89892d2a4dae5b75e38035b9574))
* add settings components ([a9d4175](https://github.com/lifinance/lifi-widget/commit/a9d417505b5f5193985c73db50dae9740999bfe5))
* add settings page draft ([2370a30](https://github.com/lifinance/lifi-widget/commit/2370a30c2e9960a1fb70c1f8a4c67b5e9ae02873))
* add skeleton to chain select ([af62515](https://github.com/lifinance/lifi-widget/commit/af625153fcb9bcd782d1027dab78f7d63984ae42))
* add skeleton while loading balances with all tokens filter set ([5e486cd](https://github.com/lifinance/lifi-widget/commit/5e486cd66703e10cef7d0344c2817a5c6d9e12f5))
* add step and execution items ([b715bed](https://github.com/lifinance/lifi-widget/commit/b715bedb051a7d57f41a8cc83d763d5401267cac))
* add step divider ([05e76d6](https://github.com/lifinance/lifi-widget/commit/05e76d6e1e3590d6f88ee1d78a2e68a2db205085))
* add stepper draft ([91677e7](https://github.com/lifinance/lifi-widget/commit/91677e78ae822b0d7a318a4daa92cea372bdae4a))
* add sticky header ([ffade59](https://github.com/lifinance/lifi-widget/commit/ffade5996989eff2f5eb667ca02247217e1bb6e8))
* add sufficient balance check ([f96b472](https://github.com/lifinance/lifi-widget/commit/f96b4723a9a5d45db9c65e206431f012cf2c519f))
* add supported chains to drawer ([913db7f](https://github.com/lifinance/lifi-widget/commit/913db7fc59fd92765b33853f113e9035b83e37c5))
* add swap execution logic draft + minor improvements ([9fb867f](https://github.com/lifinance/lifi-widget/commit/9fb867ffb23f9cb8990c88cffef0916230c5908d))
* add swap in progress draft ([ffbd288](https://github.com/lifinance/lifi-widget/commit/ffbd28894457d3ad4afa9ec2619adf00d01b6ad7))
* add swap route card draft ([14df8c3](https://github.com/lifinance/lifi-widget/commit/14df8c320d60e7f8151a359ec088787c6d1d9b6a))
* add swap routes page ([72415c3](https://github.com/lifinance/lifi-widget/commit/72415c342a861495fad3b619415c385b191d9cac))
* add swap routes update progress circle ([25acb5e](https://github.com/lifinance/lifi-widget/commit/25acb5ea4a8b520f0ade32932d98da584b81bf6d))
* add swap status bottom sheet ([83575c9](https://github.com/lifinance/lifi-widget/commit/83575c938663c245258d553fc3b669b243237fe6))
* add swap step timer ([24b52f9](https://github.com/lifinance/lifi-widget/commit/24b52f9b89720ccf9298a1a663cb0236948eba98))
* add SwapButton, small fixes ([dad26dc](https://github.com/lifinance/lifi-widget/commit/dad26dca842c8162be9ab3e06247ccfbfd478bfc))
* add swapping page draft ([1c387ab](https://github.com/lifinance/lifi-widget/commit/1c387abbe41affe90793c1b10ea31ba96097ec39))
* add text fitter ([ad1e272](https://github.com/lifinance/lifi-widget/commit/ad1e272794f7caca2268240e3238afee0a43fa8d))
* add token list draft ([a318735](https://github.com/lifinance/lifi-widget/commit/a318735fd18a9656455af537ebc129e12bdbee77))
* add token price to token list ([7171135](https://github.com/lifinance/lifi-widget/commit/717113537d06e585a40690b6279356d061617ca3))
* add ToolItem draft ([167dd4b](https://github.com/lifinance/lifi-widget/commit/167dd4ba38300b1934457f4b3e4237f3d2ba5e8c))
* add tooltip and refetch ([89b91c3](https://github.com/lifinance/lifi-widget/commit/89b91c3dc5c7b29d8a35131e5a3cbe1b888394ed))
* add translations and more status handling ([2b0af0b](https://github.com/lifinance/lifi-widget/commit/2b0af0bff3eef9293b0229118ac8c02c6fec65d6))
* add useChain(s) hooks ([d74140b](https://github.com/lifinance/lifi-widget/commit/d74140bb1db43877b98412b64bbaa90721e8c5e5))
* add useSwapRoutes hook draft ([239c2f7](https://github.com/lifinance/lifi-widget/commit/239c2f74958dba54eb5bbb94b121991204b8a791))
* add useToken and useTokenBalance hooks, update SwapInput ([be17b6d](https://github.com/lifinance/lifi-widget/commit/be17b6d544b133bfa35264af24b86a5de972830b))
* add validation to slippage input ([fa14a49](https://github.com/lifinance/lifi-widget/commit/fa14a49080b4fceded60a21906f8f6b966ecacae))
* add you pay token price ([5a6fddf](https://github.com/lifinance/lifi-widget/commit/5a6fddff824a78130eeed1c6fa5b5457bc7e83d8))
* beautiful wallet extension not found dialog ([ecdc8e2](https://github.com/lifinance/lifi-widget/commit/ecdc8e264b9c6654c7bb37edb199aa3ddf07e1cc))
* blockwallet support ([#7](https://github.com/lifinance/lifi-widget/issues/7)) ([1f5a508](https://github.com/lifinance/lifi-widget/commit/1f5a508cb9bd92cc4063e41fb82297440e7b4055))
* don't show circle when loading ([fa832a4](https://github.com/lifinance/lifi-widget/commit/fa832a4bc27fcd70946458ed5e060cfb427548d9))
* enable gas and funds check ([c105766](https://github.com/lifinance/lifi-widget/commit/c105766d6101adc2211096ef548bab38949b4ee1))
* get and display routes ([#3](https://github.com/lifinance/lifi-widget/issues/3)) ([91565b4](https://github.com/lifinance/lifi-widget/commit/91565b4baeccd992b4d2e519775e179192f43262))
* handle long amounts ([a1c9454](https://github.com/lifinance/lifi-widget/commit/a1c9454f94ea121994028c23015e9908e63e7588))
* improve send to recipient form, add route priority select ([52d91ca](https://github.com/lifinance/lifi-widget/commit/52d91ca7ad1b4db807d17d93192f7004fd17d4d2))
* improve token selection ([5a87346](https://github.com/lifinance/lifi-widget/commit/5a8734680ca833e9ef8cfb6f9de622a5feff2813))
* move customization to sidebar ([f4664e7](https://github.com/lifinance/lifi-widget/commit/f4664e759dc4fbab1347f630857b208e4138a151))
* move settings to drawer ([9c6adcc](https://github.com/lifinance/lifi-widget/commit/9c6adcc37d07d9d4e515a747082bea7ede65042d))
* move to monorepo ([fe7e24b](https://github.com/lifinance/lifi-widget/commit/fe7e24b6a915af4f3f3338946e25ba165384d03d))
* move token amount formatting to hook ([ec55aa1](https://github.com/lifinance/lifi-widget/commit/ec55aa1522b4be066ed3ad95e02033189d63f699))
* restructure swap execution logic ([74ebf3d](https://github.com/lifinance/lifi-widget/commit/74ebf3d4dff14e7f53471612d956985367c1941a))
* show amount to receive ([5c76104](https://github.com/lifinance/lifi-widget/commit/5c761041faee6ac3198cdcd0636871d25ebed63b))
* stepper improvements ([4589d4d](https://github.com/lifinance/lifi-widget/commit/4589d4d6056903f4ea42cae504500cf4b68873c9))
* stop timer when action is required ([482bddb](https://github.com/lifinance/lifi-widget/commit/482bddb4b1ab540a6af1853b0f9d53fc16e905e5))
* transaction stepper with all states ([34a2278](https://github.com/lifinance/lifi-widget/commit/34a227895d8a6081677a51e2a1b69e7b5ca1671d))
* update chain selection ([a9261f0](https://github.com/lifinance/lifi-widget/commit/a9261f0670ab9469cb14147ac30c64c9898c01c4))
* update icons and colors ([52eb4b8](https://github.com/lifinance/lifi-widget/commit/52eb4b82e774d7e15f8e2e05658634a6a6129d95))
* update swap form layout ([7f9b3b6](https://github.com/lifinance/lifi-widget/commit/7f9b3b69df5770e99224dbd59dd628ac87f8f6d5))
* update to new SDK status handling ([cb87f62](https://github.com/lifinance/lifi-widget/commit/cb87f62241a340b2c378f265871d55e4b124427e))
* update token drawer ([52a17ec](https://github.com/lifinance/lifi-widget/commit/52a17ecc210778bc4ccc7354f4d4e838e1e418aa))
* use getTokens endpoint ([5e4f86a](https://github.com/lifinance/lifi-widget/commit/5e4f86ad0a4e419c7f5b2c63d45743c59b5d62a4))
* use route from location state ([5050cd6](https://github.com/lifinance/lifi-widget/commit/5050cd6d1840bd6f11fb34a40caa1eb9e630bdf7))


### Bug Fixes

*  fix useTokens typo ([e71ad88](https://github.com/lifinance/lifi-widget/commit/e71ad88a95de68ad67525268f5687a346c0c018f))
* add inputMode search ([17c22bd](https://github.com/lifinance/lifi-widget/commit/17c22bda1d757b333901c218babc4bc5097099b7))
* add keys and loading states ([c576101](https://github.com/lifinance/lifi-widget/commit/c576101bb5cc737a3906dd5e8868ec8be2cb1103))
* add possibility topic ([d564803](https://github.com/lifinance/lifi-widget/commit/d564803f6b311947eb51b8bf8350dc2393825aa4))
* adjust padding ([626acf0](https://github.com/lifinance/lifi-widget/commit/626acf0141371437bc76adf0064c97c5fa838f6f))
* adjust typography ([8edfecf](https://github.com/lifinance/lifi-widget/commit/8edfecfdd880faf061952aefcee3d924dc8428d9))
* change wording ([f3b9498](https://github.com/lifinance/lifi-widget/commit/f3b9498d1f96b58157c196f6e838389cdde9d320))
* clear from amount on close ([e3fda8c](https://github.com/lifinance/lifi-widget/commit/e3fda8c3e09ae17449e0583f4b223e30b4369b94))
* debounce only when has value ([0a18dc2](https://github.com/lifinance/lifi-widget/commit/0a18dc21dc6f7d2fe05e47a8d5a7f9f4f024fdaf))
* disable bridge prioritization ([aea18ea](https://github.com/lifinance/lifi-widget/commit/aea18ea4cab8bed9973a5c8ccf4f5494e1ec8e95))
* disable default tokens ([0e95966](https://github.com/lifinance/lifi-widget/commit/0e9596659168626eca5e6fb595c665af513cb232))
* disable swap chains when they are not selected ([8531863](https://github.com/lifinance/lifi-widget/commit/8531863752a7936817be4f0520d03da70bae2ab9))
* disable token loading while wallet disconnected ([be23def](https://github.com/lifinance/lifi-widget/commit/be23defbc6fb12dce395c02de9e619a28baa16a3))
* EIP1193 provider not found ([68d3829](https://github.com/lifinance/lifi-widget/commit/68d38290376057d4eceaba4c8cf32fe90a562461))
* execution route mutability hotfix ([375e575](https://github.com/lifinance/lifi-widget/commit/375e575119f3404a14bf3e61b46237d4295e4f2c))
* fix dark theme logo ([effa1d4](https://github.com/lifinance/lifi-widget/commit/effa1d4274adc12fe9d00f0b1fb68a7b9bad7f1a))
* fix eslint, bump packages ([1bc3a61](https://github.com/lifinance/lifi-widget/commit/1bc3a61d18c4624f604be0de63d2b867b830e307))
* fix external theme control ([8ae3848](https://github.com/lifinance/lifi-widget/commit/8ae38482ebfd49c94100243b7328ef4ac1b28eed))
* fix input field not resetting after changing chain ([cf4b715](https://github.com/lifinance/lifi-widget/commit/cf4b715cd5b04c1c47a8bc89ba97e3bb2f15feb4))
* fix layout margins ([4bbe4a1](https://github.com/lifinance/lifi-widget/commit/4bbe4a12f0bd2d030bea0994b25de7f71bcabb69))
* fix navigation to swapping page ([3316bff](https://github.com/lifinance/lifi-widget/commit/3316bffdd9b5b7f894042dd6824120a0aa3aec83))
* fix skeleton width ([56dfbae](https://github.com/lifinance/lifi-widget/commit/56dfbaed018bfd19f29de1aba9dc525ef6bfb44a))
* header not sticky sometimes ([f045008](https://github.com/lifinance/lifi-widget/commit/f04500827a4bba885291dfaed078650457c1581e))
* heavy re-renders on every amount change ([62f725a](https://github.com/lifinance/lifi-widget/commit/62f725ad4e0c2c76a042419c1594a9cb8f036304))
* hide empty scrollbar ([cc2a2fe](https://github.com/lifinance/lifi-widget/commit/cc2a2fef6e1cd35dcf93286e6f03eb0d6716ecc6))
* improve dark theme support ([fea0977](https://github.com/lifinance/lifi-widget/commit/fea09772ca1ee261264e28edacd704a07066b514))
* improve formatting, add max handler ([45b12f8](https://github.com/lifinance/lifi-widget/commit/45b12f884cc2656cefcc95a5936a28fd502bc29d))
* improve outlined button dark mode support ([eaa65bc](https://github.com/lifinance/lifi-widget/commit/eaa65bc85ce78a75b774082f5681167214d94774))
* improve token filtering perfomance ([383a8a5](https://github.com/lifinance/lifi-widget/commit/383a8a5da7fb0927d96ce4a9708ad5f37094e89b))
* increase refetchTime ([91fb903](https://github.com/lifinance/lifi-widget/commit/91fb903ad0cdb73373dc349aa34c6b409fd6f794))
* input shrinks ([e390016](https://github.com/lifinance/lifi-widget/commit/e39001612c44b2e181fa86a6a0b57c218ce03500))
* lower font weight when not selected ([7223873](https://github.com/lifinance/lifi-widget/commit/72238733e7d203789e20764f769c4aec335c6f3f))
* lower item height ([cb67308](https://github.com/lifinance/lifi-widget/commit/cb67308af766130772719ed3f6a79dad0a5e2fc6))
* make title match others ([085d20b](https://github.com/lifinance/lifi-widget/commit/085d20b35184e90c1762fb39b3139e983d0728d5))
* make token selection smoother ([51ef8ed](https://github.com/lifinance/lifi-widget/commit/51ef8edc288e2db31805a006e835987b141015e2))
* make webpack 5 work with crypto libs ([6106b95](https://github.com/lifinance/lifi-widget/commit/6106b9566b3e03412e6aac30f6f95f303d166298))
* migrate old appearance settings ([dfd92fe](https://github.com/lifinance/lifi-widget/commit/dfd92fe163005212e6d0eb5f1696cc968c731644))
* missed loading state ([36b3535](https://github.com/lifinance/lifi-widget/commit/36b35350779b92d5179cdf734a519fbacbc6f2bd))
* missing packages and types ([49260fb](https://github.com/lifinance/lifi-widget/commit/49260fb0261b3e52ef231868fa885070e881082d))
* not found dom route ([e3c961f](https://github.com/lifinance/lifi-widget/commit/e3c961fbcf1f0bdfe74f4eacb20b2ff7a31bf159))
* optimize wallet interface usage ([b8716e6](https://github.com/lifinance/lifi-widget/commit/b8716e6491ea51157f0bc247ca7407376a1d9547))
* p nesting ([ee519d2](https://github.com/lifinance/lifi-widget/commit/ee519d27df0375e542d8c5d45071a8c38fcb4ff8))
* postcss-normalize module not found ([fd0afa3](https://github.com/lifinance/lifi-widget/commit/fd0afa308399db0ca7099cbb73605abb8b89dadc))
* prevent running on mount ([acd8389](https://github.com/lifinance/lifi-widget/commit/acd838908a41e12050061f2a10f1712f77801976))
* proper avatar colors for dark mode ([88df9ff](https://github.com/lifinance/lifi-widget/commit/88df9ff825a190e0bf0c1223f4cb56ed36b90fc9))
* props forwarding error ([5a1f110](https://github.com/lifinance/lifi-widget/commit/5a1f1105ff0d9fd8691108efef27a7d0bc8111c8))
* reduce max width ([4d3432d](https://github.com/lifinance/lifi-widget/commit/4d3432dfa013631efdca9b3c0013e3cb9af19c2d))
* reduce max width ([233a1f3](https://github.com/lifinance/lifi-widget/commit/233a1f35de8cea24c4182065e8d370522726f428))
* remove backgroundImage ([a395b48](https://github.com/lifinance/lifi-widget/commit/a395b4888b3c901d43c42ec07ddb49398695cf10))
* remove default tokens ([1428e75](https://github.com/lifinance/lifi-widget/commit/1428e750160913fb1705589648a7e2c3b7924171))
* remove notched prop ([272dae6](https://github.com/lifinance/lifi-widget/commit/272dae6e88a281e627e7ace779c88fcbc1e0555d))
* remove scripts ([a133696](https://github.com/lifinance/lifi-widget/commit/a133696160131e1d01e61128c752ed510d61c0c7))
* remove testing steps ([a7f16ac](https://github.com/lifinance/lifi-widget/commit/a7f16ac632c8940cd4f6f2c9b6bc2f41bb88a60e))
* rename route priority ([833cfa9](https://github.com/lifinance/lifi-widget/commit/833cfa907daf24d68179964db357c2aa0ecf01d0))
* return debounced value immediately on mount ([247fd9e](https://github.com/lifinance/lifi-widget/commit/247fd9e01358049cc00ca8977076c5c4b02f1613))
* scroll to top after changing chain ([bc772ab](https://github.com/lifinance/lifi-widget/commit/bc772abc2de319a7d59c3a8ce670f5a8007c1e2e))
* set correct header name for token selection ([68d20e9](https://github.com/lifinance/lifi-widget/commit/68d20e9bd160739470febc0e130977c927be895f))
* set gas price default value ([ff777d4](https://github.com/lifinance/lifi-widget/commit/ff777d444ae6e33cfba2b19ec9e957311fa42a7c))
* show meesage only if no gas ([ddb0702](https://github.com/lifinance/lifi-widget/commit/ddb0702ac666d0c3d3af52bc5003b87d3959a39f))
* style adjustments ([ccbeb51](https://github.com/lifinance/lifi-widget/commit/ccbeb5180a7c1fede7b1a4db635f558dc7214348))
* switch to using chain ids ([d6dceea](https://github.com/lifinance/lifi-widget/commit/d6dceea0009d5a212924c878e50aa5e536afaacf))
* theme adjustments ([526de7f](https://github.com/lifinance/lifi-widget/commit/526de7f98c99708b55f37e368804b3c6e911c622))
* title jump when progress is empty ([8d8fdc9](https://github.com/lifinance/lifi-widget/commit/8d8fdc9f09c02360ea1133c5b8e7d40bb86cf3a5))
* walleticon import ([ec58843](https://github.com/lifinance/lifi-widget/commit/ec588433be85cc615194ec41cf0261d46df0f1c4))


* prepare to publish ([6ae9bc7](https://github.com/lifinance/lifi-widget/commit/6ae9bc777e38848d19245b5b1ddf632fc1725ebd))
