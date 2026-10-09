# Japanese (`ja`)

Read [TRANSLATING.md](../../TRANSLATING.md) first.

- Variant: Japanese (Japan), ja-JP. Use 暗号資産, the legal term in Japan, for crypto assets.
- Register: です/ます form for messages, errors, and tooltips. Short noun forms on buttons and labels, with no です/ます.
- Buttons: use a noun or a noun phrase, for example 「スワップ」, 「承認」, 「ウォレットを接続」. Do not use ください on buttons.
- Use full-width Japanese punctuation (。、！？：（）) in Japanese text. Do not put 。 at the end of buttons, labels, or titles.
- Put a half-width space between Japanese text and Latin words or {{variables}}, for example 「{{chainName}} のガス」. The current widget and Uniswap ja do this.
- Keep the final long vowel mark in katakana loanwords: アグリゲーター, プロバイダー, リーダーボード. Do not write アグリゲータ.
- Keep token symbols, chain names, and protocol names in Latin letters, for example ETH, Arbitrum, Stargate.
- Write 暗号資産 for crypto assets, not 仮想通貨. 暗号資産 is the legal term in Japan.

## Glossary

| # | English | Use | Do not use |
| --- | --- | --- | --- |
| 1 | bridge (noun) | ブリッジ (Use ブリッジ for the bridge protocol and for the transfer.) | 橋 |
| 2 | bridge (verb) | ブリッジする (On buttons, write ブリッジ. In sentences, write ブリッジする, for example 「{{chain}} にブリッジ」.) | 橋渡しする |
| 3 | swap (noun) | スワップ (Use スワップ for a token-to-token trade. Use 交換 only for the Exchange tab (term 5).) | 取り替え |
| 4 | swap (verb) | スワップする (On buttons, write スワップ. For progress, write スワップ中. Rainbow ja uses 交換する, but keep 交換 for the Exchange tab only.) | 取り替える |
| 5 | exchange | 交換 (This is the tab name that covers swap and bridge. 取引所 means a centralized exchange, so do not use it.) | 取引所 |
| 6 | cross-chain | クロスチェーン (Write one katakana word with no space or hyphen, for example 「クロスチェーンスワップ」.) | チェーン間 |
| 7 | gas | ガス (Use ガス for the gas unit and the gas token, for example 「ガス不足」 and 「ガス価格」.) | 燃料 |
| 8 | gas fee / network fee | ガス代 / ネットワーク手数料 (Use ガス代 where the text says gas fee. Use ネットワーク手数料 for the Network cost label in the fee breakdown.) | 燃料費 |
| 9 | slippage | スリッページ (Max slippage is 最大スリッページ. Slippage tolerance is スリッページ許容値. The current widget has the typo スリップページ.) | スリップページ |
| 10 | price impact | プライスインパクト (Some sources write 価格インパクト. Use プライスインパクト in all strings.) | 価格衝撃 |
| 11 | route | ルート (Use ルート for one path of a transfer, for example 「最適なルート」.) | 経路 |
| 12 | quote | 見積もり (引用 means a citation. Use 見積もり for a price quote, for example 「新しい見積もりを取得」.) | 引用 |
| 13 | chain / blockchain | チェーン / ブロックチェーン (Use チェーン in labels. Use ブロックチェーン only in explanations.) | 鎖 |
| 14 | network (synonym of chain in wallet UIs) | ネットワーク (Use ネットワーク where the English says network, for example 「ネットワークを切り替える」.) | 網 |
| 15 | from chain / to chain (source / destination) | 送金元チェーン / 送金先チェーン (In short headers, write 送金元 and 送金先. Do not use the katakana loanwords.) | ソースチェーン / デスティネーションチェーン |
| 16 | token | トークン (Keep token symbols such as ETH and USDC in Latin letters.) | 代用貨幣 |
| 17 | native token (ETH on Ethereum, SOL on Solana) | ネイティブトークン (Write one word, for example 「{{tokenSymbol}} は {{chainName}} のネイティブトークンです。」) | 固有トークン |
| 18 | stablecoin | ステーブルコイン (Write one katakana word with no space.) | 安定通貨 |
| 19 | wallet | ウォレット (Use ウォレット for all crypto wallets.) | 財布 |
| 20 | connect wallet / connect (button) | ウォレットを接続 (For the Wallet connected status, write ウォレット接続済み. The current widget uses ウォレットに接続, which is wrong.) | ウォレットに接続 |
| 21 | disconnect | 切断 (Use 切断 on the button. MetaMask uses 接続解除, but most sources use 切断.) | ログアウト |
| 22 | approve / token approval (ERC-20 allowance) | 承認 / トークンの承認 (For the allowance amount, write 使用上限. Example: 「{{tokenSymbol}} の使用を承認」.) | 許可 |
| 23 | sign / signature (wallet signature request) | 署名 (Write 署名リクエスト for the wallet request screen.) | サイン |
| 24 | transaction | トランザクション (取引 means a trade. Use トランザクション for an onchain transaction.) | 取引 |
| 25 | transaction hash | トランザクションハッシュ (Write one word with no space.) | 取引ID |
| 26 | pending / completed / failed / refunded (transaction status words) | 保留中 / 完了 / 失敗 / 返金済み (Use these short forms on status badges. In full sentences, use the しました form.) | ペンディング / 完成 / 払い戻しを受けました |
| 27 | DEX | DEX (Keep DEX in Latin letters. Write 分散型取引所 (DEX) only in explanations.) | デックス |
| 28 | aggregator | アグリゲーター (Keep the final long vowel mark. The current Jumper text uses アグリゲータ.) | 集約器 |
| 29 | liquidity | 流動性 (Use the kanji term in all strings.) | リクイディティ |
| 30 | yield | 利回り (Use 利回り for the return on a vault or a position.) | 収穫 |
| 31 | APY | APY (年利 hides the difference between APY and APR. Keep APY, for example 「最大 10% APY」.) | 年利 |
| 32 | vault | ボールト (Use ボールト for a DeFi vault.) | 金庫 |
| 33 | staking | ステーキング (Use ステーキング for the product and the action.) | 賭け |
| 34 | deposit | 入金 (預金 means a bank deposit. Use 入金 for funds that go into a vault or a position.) | 預金 |
| 35 | withdraw | 引き出し (Use 引き出し for funds that leave a vault or a position.) | 撤退 |
| 36 | limit order | 指値注文 (Use 指値 for the Limit tab and 指値価格 for the limit price.) | リミットオーダー |
| 37 | TWAP order / scheduled order | TWAP 注文 (Keep TWAP in Latin letters.) | 時間加重平均価格注文 |
| 38 | market cap | 時価総額 (Use the kanji term in all strings.) | マーケットキャップ |
| 39 | refuel / get gas | ガスを補充 (Use ガス補充 as the feature name. The current Jumper text uses リフューエル.) | リフューエル |
| 40 | airdrop | エアドロップ (Use エアドロップ in all strings.) | 空中投下 |
| 41 | points / XP | ポイント / XP (Keep XP in Latin letters, for example 「+50 XP」.) | 点数 / 経験値 |
| 42 | quest / mission | ミッション (Jumper says Missions in English. Use ミッション for quest and for mission.) | 任務 |
| 43 | rewards / claim (rewards) | 報酬 / 請求 (クレーム means a complaint in Japanese. MetaMask, Uniswap, and PancakeSwap use 請求 on the claim button. Rabby uses 受け取る.) | クレーム |
| 44 | portfolio | ポートフォリオ (Use ポートフォリオ for the page name.) | 資産一覧 |
| 45 | balance | 残高 (Use 残高 for all token balances.) | バランス |
| 46 | max (button that fills the full balance) | 最大 (Use 最大 on the button that fills the full balance.) | マックス |
| 47 | send / receive | 送金 / 受取 (Use 送金 and 受取 for token transfers. Uniswap and Rabby also use 送信 on some buttons.) | 発送 |
| 48 | recipient / receiving address | 受取人 / 受取アドレス (Use 受取アドレス when the field holds an address.) | 受信者 |
| 49 | minimum received | 最低受取額 (Use this exact label in the route details.) | 最小受け取り |
| 50 | fee (integrator fee, "Jumper fee") | 手数料 (Write Jumper 手数料 for the Jumper fee and インテグレーター手数料 for the integrator fee.) | フィー |
| 51 | estimated time | 推定所要時間 (Use this label for the time that a route needs.) | 見積もり時間 |
| 52 | high value loss (warning when a route loses a lot of value) | 大幅な価値の損失 (高価値損失 reads as the loss of an expensive item. Say that the value drops a lot.) | 高価値損失 |
| 53 | on-ramp / buy with card | カードで購入 (For a general buy action, write 暗号資産を購入.) | オンランプ |
| 54 | leaderboard | リーダーボード (Keep the final long vowel mark.) | 指導者掲示板 |
| 55 | perks | 特典 (Use 特典 for Jumper perks.) | パークス |
| 56 | earn (the product page where users earn yield) | Earn (Sources split three ways: Earn, 収益化, 稼ぐ. Keep Earn as the page name. In sentences, use 獲得, for example 「最大 10% APY を獲得」.) | 儲ける |
| 57 | trigger price (limit orders) | トリガー価格 (Use this label for the price that starts a limit order.) | 引き金価格 |
| 58 | expiry / expires (orders) | 有効期限 / 期限切れ (Use 有効期限 for the label and 期限切れ for the expired status. For expires in, write {{duration}} 後に期限切れ.) | 満期 |

## More terms

These terms are in use in the current texts. Use them for the same concepts.

| English | Use |
| --- | --- |
| Asset (filter, label, column) | 資産 (Asset in / Asset out = 受取資産 / 送金資産.) |
| Cancelled / Paused (order status) | キャンセル済み / 一時停止中 (Short status badges.) |
| capacity (vault) | 入金上限 / 残り入金可能額 (Max capacity = 入金上限. Remaining capacity = 残り入金可能額.) |
| centralized exchange (CEX), exchange wallet | 取引所 (Use only for a CEX, for example 取引所のウォレット or 取引所の支払不能リスク. The Exchange tab stays 交換.) |
| claim (perk, reward), claimed | 請求 / 請求済み (Follows glossary term 43. Insurance claim in risk texts is 保険金請求.) |
| dust / dust tokens | 少額トークン (Convert dust = 少額トークンを変換. Do not use ダスト.) |
| exploit (smart contract) | エクスプロイト (Used in risk descriptions, for example スマートコントラクトのエクスプロイト.) |
| fill / filled / partially filled (orders) | 約定 / 約定済み / 部分約定 (Standard Japanese trading terms. 部分約定 matches the widget run A (limitOrder.partiallyFillable).) |
| idle (assets, tokens) | 眠っている (For example 眠っている {{symbol}}. Natural Japanese marketing word for unused assets.) |
| Incognito (private swap) | シークレットモード (Same word as the browser private mode in Japanese.) |
| level / rank | レベル / 順位 (Short form in the navbar: Lv.) |
| lockup period | ロックアップ期間 (Short label: ロックアップ.) |
| market (Earn) | マーケット (For example すべてのマーケット, 関連マーケット. Use 市場価格 for market price (label and table column) and 予測市場 for prediction markets.) |
| opportunity (Earn) | 運用先 (For example この運用先, Earn の新しい運用先. Do not use 機会.) |
| Perps | 無期限先物 (Keep the product name Jumper Perps in English.) |
| position | ポジション (Your positions = 保有ポジション. Manage your position = ポジションを管理.) |
| Review / Confirm (buttons) | 確認 / 確定 (Review opens a check step (変換内容を確認). Confirm commits the action (確定). Same split as the widget run A.) |
| Simple / Advanced (exchange modes) | シンプル / アドバンスド (Tab labels.) |
| Something went wrong (title) | 何らかのエラーが発生しました (Matches the widget run A (error.title.unknown).) |
| Sort by / Sort | 並べ替え順 / 並べ替え (Two different labels so that they do not collide.) |
| Start Earning (CTA) | Earn を開始 (Matches スワップを開始 and ブリッジを開始 in the widget.) |
| trade (one execution of an order) | 取引 (取引 means a trade, not a transaction. The Trade tab label is トレード.) |
| Try again / Retry (button) | 再試行 (In sentences, write もう一度お試しください。) |
| unlock (perks), unlocked | 解放 / 解放済み (Use for perks and Pass rewards. For achievements, use 実績を解除.) |
| Value / Total value (portfolio) | 評価額 / 合計評価額 (Value loss in routes stays 価値の損失.) |
| verify (mission task, wallet ownership), verified | 確認 / 確認済み (User-side check. Field validation is 検証. Route and token verification (Hypernative) stays 検証済み.) |
