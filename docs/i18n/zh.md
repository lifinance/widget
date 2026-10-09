# Chinese (`zh`)

Read [TRANSLATING.md](../../TRANSLATING.md) first.

- Variant: Chinese (Simplified, mainland), zh-CN. Confirmed: the current zh files are Simplified, and MetaMask, Uniswap, PancakeSwap, and Rabby ship Simplified as zh-CN. If zh-TW is added, translate it separately. Do not convert by script.
- Register: Neutral written Chinese. Use 您 where a pronoun is necessary, and drop the pronoun where possible. Use 请 for requests.
- Buttons: use a short verb or verb-object form, for example “连接钱包”, “兑换”, “跨链”. Do not use 请 on buttons.
- Use full-width Chinese punctuation (，。：；？！（）) in Chinese text. Do not put 。 at the end of buttons, labels, or titles.
- Put a half-width space between Chinese text and Latin words, numbers, or {{variables}}, for example “Gas 费” and “在 {{chainName}} 上”.
- Keep Gas, DEX, APY, TWAP, XP, token symbols, and chain names in Latin letters.
- Do not create zh-TW by script conversion. zh-TW uses different terms, for example 路徑, 網路, 收款人 in Uniswap zh-TW.

## Glossary

| # | English | Use | Do not use |
| --- | --- | --- | --- |
| 1 | bridge (noun) | 跨链桥 (Use 跨链桥 for the bridge protocol, for example “已启用的跨链桥”. For the action, use term 2.) | 桥梁 |
| 2 | bridge (verb) | 跨链 (Use 跨链 on buttons and for the action, for example “跨链至 {{chainName}}”. MetaMask uses 桥接, but most sources use 跨链.) | 架桥 |
| 3 | swap (noun) | 兑换 (Use 兑换 for a token-to-token trade.) | 交换 |
| 4 | swap (verb) | 兑换 (On buttons, write 兑换. For progress, write 正在兑换.) | 交换 / 互换 |
| 5 | exchange | 兑换 (This is the tab name that covers swap and bridge. 交易所 means a centralized exchange, so do not use it.) | 交易所 |
| 6 | cross-chain | 跨链 (Example: “跨链兑换”.) | 交叉链 |
| 7 | gas | Gas (Keep Gas in Latin letters. The current widget uses 燃气费, and MetaMask uses 燃料. Chinese crypto users say Gas.) | 燃气 |
| 8 | gas fee / network fee | Gas 费 / 网络费用 (Use Gas 费 where the text says gas fee. Use 网络费用 for the Network cost label.) | 燃气费 |
| 9 | slippage | 滑点 (Max slippage is 最大滑点. Binance Academy uses 滑动价差, but wallet UIs use 滑点. The current widget has a machine translation error.) | 低幻灯片宽度 |
| 10 | price impact | 价格影响 (Use 价格影响 in all strings. The current widget uses 价格冲击.) | 价格冲击 |
| 11 | route | 路由 (Use 路由 for one path of a transfer, for example “最佳路由”.) | 路线 |
| 12 | quote | 报价 (引用 means a citation. Use 报价 for a price quote, for example “获取新报价”.) | 引用 |
| 13 | chain / blockchain | 链 / 区块链 (Use 链 in labels. Use 区块链 only in explanations.) | 链条 |
| 14 | network (synonym of chain in wallet UIs) | 网络 (网路 is a Taiwan form. Use 网络 in zh-CN.) | 网路 |
| 15 | from chain / to chain (source / destination) | 源链 / 目标链 (In short headers, write 从 and 至.) | 来源链 / 接收链 |
| 16 | token | 代币 (令牌 means an access token. Use 代币 for crypto tokens.) | 令牌 |
| 17 | native token (ETH on Ethereum, SOL on Solana) | 原生代币 (Users also say 主币 in chat. Use 原生代币 in the UI.) | 本地代币 |
| 18 | stablecoin | 稳定币 (Use 稳定币 in all strings.) | 稳定货币 |
| 19 | wallet | 钱包 (Use 钱包 for all crypto wallets.) | 皮夹 |
| 20 | connect wallet / connect (button) | 连接钱包 (The current widget uses 关联钱包 on the button. Use 连接钱包. For the status, write 钱包已连接.) | 关联钱包 |
| 21 | disconnect | 断开连接 (Use 断开连接 on the button.) | 取消连接 |
| 22 | approve / token approval (ERC-20 allowance) | 授权 / 代币授权 (MetaMask and Uniswap use 批准. Rabby, PancakeSwap, and revoke tools use 授权, the word that Chinese crypto users say.) | 同意 |
| 23 | sign / signature (wallet signature request) | 签名 (Write 签名请求 for the wallet request screen.) | 签字 |
| 24 | transaction | 交易 (Use 交易 for an onchain transaction.) | 事务 |
| 25 | transaction hash | 交易哈希 (Use 交易哈希 in all strings.) | 交易散列 |
| 26 | pending / completed / failed / refunded (transaction status words) | 待处理 / 已完成 / 失败 / 已退款 (Use these short forms on status badges. MetaMask and PancakeSwap use 待定 for pending.) | 未决 |
| 27 | DEX | DEX (Keep DEX in Latin letters. Write 去中心化交易所 (DEX) only in explanations.) | 链上交易所 |
| 28 | aggregator | 聚合器 (Use 聚合器 for the product type, for example “流动性聚合器”.) | 汇总器 |
| 29 | liquidity | 流动性 (Use 流动性 in all strings.) | 流通性 |
| 30 | yield | 收益 (Use 收益 for the return on a vault or a position. Use 收益率 for a rate.) | 产量 |
| 31 | APY | APY (Keep APY in Latin letters, for example “最高 10% APY”.) | 年化百分率收益 |
| 32 | vault | 金库 (Use 金库 for a DeFi vault.) | 保险库 |
| 33 | staking | 质押 (押注 means a bet. Use 质押 for staking.) | 押注 |
| 34 | deposit | 存入 (存款 means a bank deposit. Use 存入 for funds that go into a vault or a position.) | 存款 |
| 35 | withdraw | 提取 (Use 提取 for funds that leave a vault or a position.) | 撤回 |
| 36 | limit order | 限价单 (Use 限价 for the Limit tab and the limit price.) | 限制订单 |
| 37 | TWAP order / scheduled order | TWAP 订单 (Keep TWAP in Latin letters.) | 时间加权平均价格订单 |
| 38 | market cap | 市值 (Use 市值 in all strings.) | 市场上限 |
| 39 | refuel / get gas | 获取 Gas (The current Jumper text uses 兑换燃气费. Use Gas as in term 7.) | 兑换燃气费 |
| 40 | airdrop | 空投 (Use 空投 in all strings.) | 空中投放 |
| 41 | points / XP | 积分 / XP (Keep XP in Latin letters, for example “+50 XP”.) | 点数 / 经验值 |
| 42 | quest / mission | 任务 (Jumper says Missions in English. Use 任务 for quest and for mission.) | 使命 |
| 43 | rewards / claim (rewards) | 奖励 / 领取 (Use 领取 on the claim button.) | 索取 |
| 44 | portfolio | 投资组合 (Use 投资组合 for the page name.) | 文件夹 |
| 45 | balance | 余额 (平衡 means equilibrium. Use 余额 for token balances.) | 平衡 |
| 46 | max (button that fills the full balance) | 最大 (Use 最大 on the button that fills the full balance. Rabby uses 全部 on its send screen.) | — |
| 47 | send / receive | 发送 / 接收 (Use these forms on buttons and headers.) | 寄送 / 收取 |
| 48 | recipient / receiving address | 接收地址 (收件人 means a mail recipient. Use 接收地址 for the field.) | 收件人 |
| 49 | minimum received | 最少收到 (Use this exact label in the route details. MetaMask uses 最低收款金额, and PancakeSwap uses 最小获得量.) | — |
| 50 | fee (integrator fee, "Jumper fee") | 手续费 (Write Jumper 手续费 for the Jumper fee and 集成商手续费 for the integrator fee. Uniswap uses 费用.) | — |
| 51 | estimated time | 预计时间 (Use this label for the time that a route needs.) | 估计时间 |
| 52 | high value loss (warning when a route loses a lot of value) | 价值损失过高 (Say that the value loss is too high.) | 高价值损失 |
| 53 | on-ramp / buy with card | 用银行卡购买 (For a general buy action, write 购买加密货币.) | 入口匝道 |
| 54 | leaderboard | 排行榜 (Use 排行榜 for the page name.) | 领导板 |
| 55 | perks | 福利 (Use 福利 for Jumper perks, for example “领取福利”.) | 额外津贴 |
| 56 | earn (the product page where users earn yield) | 赚取 (Use 赚取 for the page name and in sentences, for example “赚取最高 10% APY”.) | 赚钱 |
| 57 | trigger price (limit orders) | 触发价格 (Use this label for the price that starts a limit order.) | 扳机价格 |
| 58 | expiry / expires (orders) | 到期时间 / 已过期 (For expires in, write {{duration}} 后到期.) | 期满 |

## More terms

These terms are in use in the current texts. Use them for the same concepts.

| English | Use |
| --- | --- |
| Activities / Activity (widget history list) | 交易记录 (Same word as zh-B Transactions tab. Bare 活动 means campaign in Jumper.) |
| allowance / revoke (token approval) | 授权额度 / 撤销授权 (Insufficient allowance = 授权额度不足; Revoke X spending = 撤销 X 授权.) |
| Best Return / Fastest (route tags and route priority) | 最佳报价 / 最快 (Uses term 12 报价. Not 收益, which means yield.) |
| bookmark (a wallet address) | 收藏 (Bookmarked wallets = 已收藏的钱包; Add bookmark = 添加收藏.) |
| campaign / campaign boost | 活动 / 活动加成 (Boosted APR = 加成 APR. The user Activity tab is 链上活动 to keep it different.) |
| centralized exchange (CEX) | 交易所 (Only for a CEX, for example exchange wallet = 交易所钱包, exchange solvency risk = 交易所偿付能力风险. The Exchange tab stays 兑换 (term 5).) |
| centralized exchange (CEX) / exchange account | 交易所 / 交易所账户 (Checkout keys only: Connect exchange = 连接交易所. The Exchange tab stays 兑换 (term 5). The DEX list in settings uses DEX (term 27): 按 DEX 名称搜索. Same as zh-B.) |
| checkout (payment widget title) | 结账 (Leave checkout? = 退出结账？; the Pay button = 支付.) |
| Confirm / Okay (buttons) | 确认 / 确定 (Confirm = 确认; Okay = 确定. Do not use 确认 for Okay.) |
| deposit (checkout: send crypto to a deposit address) | 充值 (Deposit address = 充值地址; Deposit incomplete = 充值未完成; deposit window = 充值时限. The widget Deposit action into a vault or position stays 存入 (term 34).) |
| deposit with cash / card payment | 用银行卡充值 / 银行卡支付 (Cash means a debit or credit card. Matches term 53 用银行卡购买.) |
| do your own research | 请务必自行研究 (Token warnings and Hypernative status text.) |
| dust / dust tokens | 小额资产 (Convert dust = 转换小额资产. Rabby uses 小额资产归集 and Binance uses 小额资产转换. Do not use 粉尘 (used for dust attacks).) |
| ecosystem (chain ecosystem in wallet selection) | 生态 (Select an ecosystem = 选择生态.) |
| estimated / est. | 预计 (Est. received = 预计收到; Estimated yield = 预计收益. Same as term 51 (预计时间).) |
| exchange rate / rate | 汇率 (Rate changed = 汇率已变动; Aggregate rate = 综合汇率. Rate limit is different: 请求频率超限.) |
| explorer (block explorer) | 区块浏览器 (View on explorer = 在区块浏览器中查看. Uniswap uses 区块浏览器.) |
| exposure (earn filter) | 敞口 (Uniswap uses 敞口.) |
| filled / partially filled (orders) | 已成交 / 部分成交 (Uniswap, Rabby, and MetaMask use 已成交.) |
| gasless | 免 Gas (Route tag = 免 Gas; fee label Gasless service = 免 Gas 服务.) |
| Jumper Earn / Jumper Portfolio (page names in sentences) | Jumper 赚取页面 / Jumper 投资组合 (Matches the nav labels 赚取 and 投资组合 (terms 44 and 56). Jumper Pass, Jumper Perps, Jumper Scan, and Jumper RWA stay in English.) |
| Level / Level {{n}} (Jumper Pass) | 等级 / {{n}} 级 (Label = 等级; with a number = {{n}} 级, so progressTo + levelWithValue reads 正在升级至 5 级.) |
| link (an exchange account) | 绑定 (Link your exchange account = 绑定您的交易所账户. Matches zh-B link wallet = 绑定钱包.) |
| link wallet (SEI EVM) | 绑定钱包 (Link is not Connect. Do not use 关联钱包 (avoid form of term 20).) |
| lockup / lock-up period | 锁仓期 (Uniswap and MetaMask use 锁仓. Lockup Period label = 锁仓期.) |
| Multi-swap / Exact-output / Private (widget tabs) | 多币兑换 / 精确输出 / 隐私兑换 (Private matches zh-B private swap = 隐私兑换.) |
| newsletter | 新闻通讯 (Subscribe to the Jumper Newsletter = 订阅 Jumper 新闻通讯.) |
| opportunity (Earn opportunity) | 收益机会 (New Earn Opportunity = 新收益机会. Do not use bare 机会 or 理财产品.) |
| Perks Hub / Mission Hub | 福利中心 / 任务中心 (Open Perks Hub = 打开福利中心; Open Mission Hub = 打开任务中心.) |
| Perps / perpetuals | 永续合约 (Product name Jumper Perps stays in English.) |
| pinned / featured | 置顶 / 精选 (Pinned tokens = 置顶代币; Pinned tabs = 置顶标签页; Featured tokens = 精选代币.) |
| Place order | 下单 (Order placed = 订单已提交; Order placed successfully = 订单提交成功.) |
| pool (liquidity / earn pool) | 资金池 (Uniswap uses 资金池. Do not use 池子 in the UI.) |
| position (DeFi / earn position) | 仓位 (Your positions = 我的仓位; Manage your position = 管理仓位. Rabby and MetaMask use 仓位. Do not use 头寸.) |
| provider (route or payment provider) | 服务商 (Provider fee = 服务商手续费 (same as zh-B); payment provider = 支付服务商.) |
| rebalancing | 调仓 (Used in the risk descriptions.) |
| redemption / withdraw request | 赎回 / 提取请求 (Request withdraw (button) = 申请提取. Withdraw stays 提取 (term 35).) |
| refund / Request refund | 退款 / 申请退款 (Refund in progress = 退款处理中; Refund complete = 退款已完成; status Refunded = 已退款 (term 26).) |
| Review (button before confirm) | 预览 (Review swap = 预览兑换; Review bridge = 预览跨链; Review order = 预览订单; Review TWAP = 预览 TWAP. Confirm = 确认; Done = 完成. Same as zh-B.) |
| Show less / Show all | 收起 / 显示全部 (Show {{count}} more = 再显示 {{count}} 个.) |
| Simple / Advanced (trade mode tabs) | 简易 / 高级 (Uniswap uses 高级.) |
| smart account / smart contract account | 智能账户 / 智能合约账户 (Warnings about the account on the destination chain.) |
| supplied / borrowed (lending position columns) | 已存入 / 已借入 (Rabby uses 已存入 for Supplied.) |
| support (contact support) | 技术支持 (Menu item and sentences such as 请联系技术支持.) |
| tier (monthly activity tier) | 档位 (Keeps it different from Level = 等级.) |
| top up (send the remaining amount) | 补足金额 (Button Top up = 补足金额; table Remaining = 待补足. Keeps it different from 充值.) |
| trade (one execution of a TWAP / scheduled order) | 子单 (Trade {{trade}} = 子单 {{trade}}; the Trades column = 子单. Rabby uses TWAP 子单. Scheduled orders = TWAP 订单 (term 37).) |
| Trade (transaction type in portfolio history) | 兑换 (Prevents a clash with 交易 (transaction) in the 交易记录 tab. The Trade nav link stays 交易.) |
| Transactions (portfolio tab) | 交易记录 (Use for the history tab and refresh tooltips.) |
| transfer crypto (checkout funding source) / transfer (noun, checkout) | 转入加密货币 / 转账 (Cancel transfer = 取消转账. A widget transfer (swap or bridge) stays 交易, for example Transfer ID = 交易 ID.) |
| user activity (on-chain activity rewards) | 链上活动 (Activity tabs, 链上活动记录, 链上活动目标. Bare 活动 means campaign.) |
| verified / unverified / malicious (tokens, routes) | 已验证 / 未经验证 / 恶意 (Malicious token detected = 检测到恶意代币; Only verified = 仅显示已验证.) |
| withdrawal (from a CEX or payment provider) | 提币 (Exchange withdrawal failed = 交易所提币失败. Withdraw from a vault or position stays 提取 (term 35).) |
