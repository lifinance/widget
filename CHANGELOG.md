# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
