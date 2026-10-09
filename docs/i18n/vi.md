# Vietnamese (`vi`)

Read [TRANSLATING.md](../../TRANSLATING.md) first.

- Variant: Vietnamese (Vietnam). MetaMask, Uniswap and Rabby translate swap and bridge ('Hoán đổi', 'Cầu nối'), and OKX translates bridge. This glossary follows these wallet UIs. They keep token, gas, stablecoin, airdrop, staking, vault and acronyms in Latin script.
- Register: bạn
- Write a button as a short verb phrase with no subject: 'Kết nối ví', 'Hoán đổi', 'Phê duyệt'. Do not put 'Hãy' or 'Vui lòng' on a button.
- Keep these terms in Latin script and lowercase inside a sentence: token, gas, stablecoin, airdrop, staking, vault. Keep acronyms as is: DEX, APY, XP, TWAP.
- Use sentence case. Capitalize only the first word and proper names: 'Kết nối ví', not 'Kết Nối Ví'.
- Use 'Đang …' for a state in progress and 'Đã …' for a finished state: 'Đang chờ xử lý', 'Đã hoàn tất'.
- Write 'trên {{chain}}' for 'on {{chain}}' and 'sang' for the target: 'Hoán đổi ETH sang USDC trên Base'.
- Never write 'cầu' alone for bridge. Always write 'cầu nối'. 'Đi cầu' means 'go to the toilet'.

## Glossary

| # | English | Use | Do not use |
| --- | --- | --- | --- |
| 1 | bridge (noun) | cầu nối (tab and title: 'Cầu nối') (Use 'Cầu nối' for the protocol and the tab. Never write 'Cầu' alone: the current string 'Bắt đầu đi cầu' reads as 'go to the toilet'.) | cầu; cây cầu |
| 2 | bridge (verb) | chuyển qua cầu nối (button: 'Cầu nối'), e.g. 'Chuyển USDC qua cầu nối sang Base' (Use the verb phrase in sentences. Use the noun 'Cầu nối' on a button, as MetaMask does.) | đi cầu; bắc cầu |
| 3 | swap (noun) | hoán đổi (tab and title: 'Hoán đổi') (Most wallet UIs use 'Hoán đổi'. The current Latin 'Swap' does not match MetaMask, Uniswap or Rabby. Only OKX keeps 'Swap' as a tab.) | trao đổi; đổi chác |
| 4 | swap (verb) | hoán đổi, e.g. 'Hoán đổi ETH sang USDC' (Use 'sang' before the target token.) | đổi chác |
| 5 | exchange | Giao dịch (Exchange tab and header title only) (Uniswap uses 'Giao dịch' for its Trade tab. Outside the tab, 'giao dịch' means transaction. Use 'Tỷ giá' for exchange rate and 'sàn giao dịch' for a centralized exchange ('Kết nối sàn giao dịch'). The DEX list follows term 27.) | Hoán đổi; Sàn giao dịch (for the tab) |
| 6 | cross-chain | xuyên chuỗi, e.g. 'hoán đổi xuyên chuỗi' (Put 'xuyên chuỗi' after the noun.) | chuỗi chéo |
| 7 | gas | gas (Keep 'gas' in Latin script and lowercase inside a sentence: 'phí gas', 'không đủ gas'.) | xăng; khí đốt |
| 8 | gas fee / network fee | phí gas (gas fee); phí mạng (network fee or network cost) (Follow the English source: 'gas fee' gives 'phí gas', 'network fee' gives 'phí mạng'.) | phí xăng |
| 9 | slippage | trượt giá (label 'Trượt giá tối đa' for Max. slippage) (Use 'mức trượt giá' only when a sentence needs a noun for the setting value.) | độ trượt; sự trượt |
| 10 | price impact | tác động giá (warning 'Tác động giá cao') (Use the same term in the route details and in the warning.) | va chạm giá |
| 11 | route | lộ trình (The widget vi.json has 'Không có đường đi' and the typo 'Tuyền đường'. Use 'Không có lộ trình' and 'Ưu tiên lộ trình'.) | đường đi; tuyến đường |
| 12 | quote | báo giá ('Trích dẫn' means a citation. The widget vi.json has 'Số tiền trích dẫn'; use 'Số tiền báo giá'.) | trích dẫn |
| 13 | chain / blockchain | chuỗi; blockchain (Use 'chuỗi' in labels: 'Chọn chuỗi'. Keep 'blockchain' in Latin script. The widget vi.json mixes 'chain' and 'chuỗi'.) | chain; dây chuyền; xích |
| 14 | network (synonym of chain in wallet UIs) | mạng (Use 'mạng' where the English says network. Use 'chuỗi' where it says chain.) | mạng lưới (in short labels) |
| 15 | from chain / to chain (source / destination) | chuỗi nguồn / chuỗi đích; field labels 'Từ' / 'Đến' (The widget vi.json has 'Đạng chain đến' (typo and Latin word). Use 'Đang chờ chuỗi đích'.) | chain đến; chuỗi đến |
| 16 | token | token ('Mã thông báo' is a machine translation, and the widget vi.json uses it. Keep 'token' in Latin script.) | mã thông báo |
| 17 | native token (ETH on Ethereum, SOL on Solana) | token gốc (Write 'token gốc của mạng' when the sentence needs more context.) | token bản địa; mã thông báo gốc |
| 18 | stablecoin | stablecoin (MetaMask vi uses 'đồng ổn định', but Uniswap and Rabby keep 'stablecoin'. Crypto users say 'stablecoin'.) | đồng ổn định |
| 19 | wallet | ví (The current 'Wallet connected' string stays in English. Use 'Đã kết nối ví'.) | ví tiền; wallet |
| 20 | connect wallet / connect (button) | Kết nối ví / Kết nối (Use 'Kết nối ví {{chain}}' for a wallet of one chain.) | Liên kết ví |
| 21 | disconnect | Ngắt kết nối (Use the same verb for a wallet and for a site.) | Hủy kết nối |
| 22 | approve / token approval (ERC-20 allowance) | Phê duyệt / phê duyệt token; 'Phê duyệt chi tiêu {{token}}' (The widget vi.json has 'Sự cho phép không đủ' for Insufficient allowance. Use 'Hạn mức phê duyệt không đủ'.) | Chấp thuận; Đồng ý; Sự cho phép |
| 23 | sign / signature (wallet signature request) | Ký / chữ ký; 'Yêu cầu chữ ký' ('Đăng ký' means sign up. Use 'Ký giao dịch' on the action step.) | Đăng ký; Ký tên |
| 24 | transaction | giao dịch (Use 'lệnh' only for orders (term 36).) | lệnh (for a transaction) |
| 25 | transaction hash | mã băm giao dịch (compact: 'Tx hash') (Use 'Tx hash' only where the space is short.) | băm |
| 26 | pending / completed / failed / refunded (transaction status words) | Đang chờ xử lý / Đã hoàn tất / Thất bại / Đã hoàn tiền (The widget vi.json has 'Đã Refund'. Use 'Đã hoàn tiền'.) | Đã Refund; Treo |
| 27 | DEX | DEX (long form: 'sàn giao dịch phi tập trung') (Use the long form once in help text. Then use 'DEX'.) | sàn phi tập trung (in short labels) |
| 28 | aggregator | trình tổng hợp, e.g. 'trình tổng hợp thanh khoản', 'trình tổng hợp cầu nối' (OKX uses 'bộ tổng hợp', but MetaMask, Rabby and Uniswap use 'trình tổng hợp'.) | bộ gom |
| 29 | liquidity | thanh khoản (Use 'thanh khoản thấp' for low liquidity.) | tính lỏng |
| 30 | yield | lợi suất (Use 'Lợi suất ước tính' for Estimated yield.) | sản lượng; năng suất |
| 31 | APY | APY (Keep the acronym. Spell it out only in help text.) | lãi suất phần trăm hằng năm (in labels) |
| 32 | vault | vault (Keep 'vault' in Latin script and lowercase inside a sentence.) | kho tiền; két sắt |
| 33 | staking | staking (verb: stake) ('Đặt cược' means betting. MetaMask vi uses 'ký gửi', but Rabby and Binance keep 'staking'.) | đặt cược; ký gửi |
| 34 | deposit | Nạp ('Đặt cọc' means a security deposit.) | Đặt cọc; Gửi tiền |
| 35 | withdraw | Rút (Write 'Rút về {{chain}}' when the sentence names a target.) | Thu hồi |
| 36 | limit order | lệnh giới hạn ('Đơn hàng' means a shop order.) | đơn hàng giới hạn |
| 37 | TWAP order / scheduled order | lệnh TWAP / lệnh định kỳ (Keep 'TWAP' in Latin script. Use 'lệnh định kỳ' for a scheduled order.) | đơn hàng TWAP |
| 38 | market cap | vốn hóa thị trường (compact: 'Vốn hóa') (Here 'cap' means capitalization, not a limit.) | giới hạn thị trường |
| 39 | refuel / get gas | Nhận gas, e.g. 'Nhận gas trên {{chain}}' (The widget vi.json has 'Thiết lập gas', which means 'set up gas'.) | Thiết lập gas; Tiếp nhiên liệu |
| 40 | airdrop | airdrop (Users say 'săn airdrop'. MetaMask vi uses 'tặng thưởng', which hides the term.) | tặng thưởng; thả dù |
| 41 | points / XP | điểm / XP (Keep 'XP' in Latin script: '{{xp}} XP'.) | điểm số |
| 42 | quest / mission | nhiệm vụ (Use 'nhiệm vụ' for a mission. Use 'yêu cầu' for one task inside a mission.) | sứ mệnh; cuộc phiêu lưu |
| 43 | rewards / claim (rewards) | phần thưởng / Nhận (claim button: 'Nhận thưởng') ('Yêu cầu' means request, not claim.) | Yêu cầu; Đòi |
| 44 | portfolio | danh mục (long form: 'danh mục đầu tư') (Use the short form in navigation.) | cặp hồ sơ |
| 45 | balance | số dư ('Cân bằng' means equilibrium.) | cân bằng |
| 46 | max (button that fills the full balance) | Tối đa (Use 'TỐI ĐA' only when the design needs capitals.) | Lớn nhất |
| 47 | send / receive | Gửi / Nhận (Use 'Bạn trả' and 'Bạn nhận' for 'You pay' and 'You get'.) | Chuyển phát |
| 48 | recipient / receiving address | người nhận / địa chỉ người nhận ('Người thụ hưởng' is banking language.) | người thụ hưởng |
| 49 | minimum received | Tối thiểu nhận được (Keep this word order in route details.) | Nhận được tối thiểu |
| 50 | fee (integrator fee, "Jumper fee") | phí, e.g. 'Phí Jumper', 'Phí tích hợp' (Keep the product name in Latin script.) | hoa hồng; lệ phí |
| 51 | estimated time | Thời gian ước tính (Use '~{{time}}' in a compact route card.) | — |
| 52 | high value loss (warning when a route loses a lot of value) | Tổn thất giá trị lớn (Use it as the warning title. Give the amount of the loss in the message.) | Mất giá trị cao |
| 53 | on-ramp / buy with card | Mua bằng thẻ / Mua tiền mã hóa (Use 'tiền mã hóa' for crypto in purchase flows.) | Đường dốc lên; on-ramp |
| 54 | leaderboard | Bảng xếp hạng (Use the same term on the profile page and on campaign pages.) | Bảng dẫn đầu |
| 55 | perks | Ưu đãi (Use 'Ưu đãi' for partner perks. MetaMask vi uses 'Quyền lợi' for 'Benefits', which is a different concept.) | Lợi ích phụ |
| 56 | earn (the product page where users earn yield) | Sinh lời (page name); kiếm (verb in a sentence), e.g. 'Kiếm tới {{apy}} APY' (Use 'Sinh lời' as the page name. Use 'Nhận {{xp}} XP' for 'Earn XP'.) | Kiếm tiền |
| 57 | trigger price (limit orders) | Giá kích hoạt (Use the same term in the order form and in the order list.) | Giá trigger |
| 58 | expiry / expires (orders) | Hết hạn / 'Hết hạn sau {{time}}' ('Đáo hạn' means the maturity of a bond.) | Đáo hạn |

## More terms

These terms are in use in the current texts. Use them for the same concepts.

| English | Use |
| --- | --- |
| 7d / 30d (APY window) | 7 ngày / 30 ngày ('APY 7 ngày', 'APY (7 ngày)'.) |
| Abstract Wallet | ví Abstract ('Ví Abstract chỉ tồn tại trên Abstract'. Not Latin 'wallet' (term 19).) |
| amount | số lượng (token amount); số tiền (USD or fiat value) ('Số lượng' as vi-B. 'Số tiền tối thiểu là {{amount, currencyExt(...)}}'. 'Số tiền báo giá' / 'Số tiền hiện tại' follow the term 12 note.) |
| asset | tài sản (Filters and labels: 'Tài sản', 'Theo tài sản'. Generic crypto assets: 'tài sản mã hóa'.) |
| Best Return (route tag and route priority) | Giá tốt nhất ('Lợi nhuận' reads as profit or yield. Fastest = 'Nhanh nhất'.) |
| bookmark / bookmarked wallets | Lưu / Ví đã lưu ('Lưu ví', 'Lưu ví mới' (Add bookmark), 'Chưa có ví đã lưu'. Not 'dấu trang' (browser bookmark).) |
| boost / boosted (APR) | tăng cường ('APR tăng cường', 'phần tăng cường từ chiến dịch'.) |
| cancel (order) / cancel (dialog button) | Hủy lệnh / Hủy (Keep order = 'Giữ lệnh'.) |
| cash / deposit with cash (card payment via Transak) | thẻ / 'Nạp bằng thẻ' ('Tiền mặt' means physical cash. 'Thanh toán bằng thẻ không khả dụng'. Matches term 53 'Mua bằng thẻ'.) |
| category (Earn label, notification filter) | Phân loại / loại (Not 'danh mục', because 'Danh mục' is Portfolio (term 44). 'Tất cả loại' for All Categories. Earn filter 'Type' = 'Loại'.) |
| checkout | thanh toán / trang thanh toán ('Chi tiết thanh toán', 'Rời trang thanh toán?'. Developer error texts keep 'checkout'.) |
| Clear (recent tokens, transaction) / Delete | Xóa ('Xóa giao dịch', 'Xóa tất cả giao dịch thất bại'. Spelling 'Xóa', 'Hủy', 'Tùy' as vi-B.) |
| Clear filters / Clear all | Xóa bộ lọc / Xóa tất cả (Filter bars on blog, Earn and Portfolio.) |
| contract (smart contract) | hợp đồng / hợp đồng thông minh ('Xem hợp đồng', 'khai thác lỗ hổng hợp đồng thông minh'.) |
| convert / conversion | chuyển đổi ('Chuyển đổi thành công', 'Xem lại chuyển đổi'.) |
| depeg | mất neo giá (Risk descriptions.) |
| deposit address / deposit window | địa chỉ nạp / thời hạn nạp ('Địa chỉ nạp hết hạn sau {{minutes}}:{{seconds}}', 'trước khi hết thời hạn nạp'.) |
| disclaimer | tuyên bố miễn trừ trách nhiệm ('Xem tuyên bố miễn trừ trách nhiệm ({{type}})'. The {{type}} value goes in parentheses, because the code inserts a lowercased label.) |
| do your own research | tự nghiên cứu kỹ ('Hãy luôn tự nghiên cứu kỹ trước khi tiếp tục'.) |
| Done | Xong (Success dialogs.) |
| dust / dust tokens | số dư nhỏ (Follows Binance vi ('Chuyển đổi số dư nhỏ'). 'Chuyển đổi số dư nhỏ', 'Số dư nhỏ có thể chuyển đổi'. Not 'bụi'.) |
| est. received | Ước tính nhận được (Pairs with 'Tối thiểu nhận được' (term 49).) |
| Exact-output (tab) / Multi-swap (tab) | Nhận chính xác / Hoán đổi gộp (Tab and page titles in jumper-widget. Multi-swap swaps many source tokens into one, so 'gộp' (merge) fits and keeps the tab short. Body text says 'Hoán đổi nhiều token cùng lúc'.) |
| exchange (centralized exchange, CEX) | sàn giao dịch ('không phải ví sàn giao dịch', 'sàn giao dịch mất khả năng thanh toán'. The Exchange tab stays 'Giao dịch' (term 5).) |
| exchange (centralized exchange, CEX, in checkout) | sàn giao dịch (Same as vi-B. 'Kết nối sàn giao dịch', 'Liên kết tài khoản sàn giao dịch của bạn', 'Rút từ sàn giao dịch thất bại'.) |
| Exchange from / Exchange to (token selector title) | Giao dịch từ / Giao dịch sang (Term 5 for the Exchange flow; 'sang' for the target (style rule).) |
| exchange rate / rate | Tỷ giá (Spelling 'Tỷ', not 'Tỉ'. 'Tỷ giá đã thay đổi', 'Thay đổi tỷ giá', 'Tỷ giá tổng hợp'.) |
| Exchanges (settings DEX list) / Search by exchange name | DEX / 'Tìm theo tên DEX' (Term 27. Also 'cầu nối và DEX đã bật' in the reset-settings warning.) |
| explorer (block explorer) | explorer ('Xem trên explorer', 'Explorer & phân tích'.) |
| exposure (Earn filter group) | Nhóm tài sản (The groups are asset groups (ETH, BTC, USD). 'Other' group = 'Khác'.) |
| filled / partially filled (order status) | Đã khớp / Khớp một phần (Standard Vietnamese trading words ('khớp lệnh'). Cancelled = 'Đã hủy', Expired = 'Đã hết hạn', Paused = 'Tạm dừng'.) |
| funds | tiền ('mất tiền', 'rút tiền', 'quản lý tiền của mình'. Use 'số dư' only for balance (term 45).) |
| gasless | Không cần gas (Route tag and fee label 'Dịch vụ không cần gas'. Not 'miễn phí gas', because network costs are included in the transfer.) |
| idle (tokens, assets) | nhàn rỗi ('token nhàn rỗi', '{{symbol}} đang nhàn rỗi'.) |
| impermanent loss | tổn thất tạm thời (Risk descriptions.) |
| insufficient funds (title) | Không đủ tiền (Funds = 'tiền' (vi-B). Insufficient balance stays 'Không đủ số dư'.) |
| Jumper Earn (product name in notifications) | mục Sinh lời của Jumper (Term 56 page name; not kept in English.) |
| level (Jumper Pass) | cấp ('Cấp {{level, number}}', 'Pass - cấp {{level, number}}', 'Bạn đã đạt cấp {{newLevel}}!'. Blog difficulty level uses 'Trình độ'.) |
| Limit (tab) / Market (limit price preset) | Giới hạn / Thị trường (Short tab and chip labels, as in Uniswap and Binance. The order table columns keep vi-B 'Giá giới hạn' / 'Giá thị trường'.) |
| link (wallet address to an ecosystem, SEI) | liên kết địa chỉ ví (Different from connect wallet ('Kết nối ví', term 20).) |
| lockup / lock-up period | Thời gian khóa (Label, tooltip and position card ('Còn {{count}} ngày').) |
| malicious / flagged (token) | độc hại / gắn cờ ('Phát hiện token độc hại', 'đã bị Hypernative gắn cờ độc hại'.) |
| market (Earn) | thị trường ('Tất cả thị trường', 'Thị trường liên quan'.) |
| mint (transaction type) | Mint (Crypto users say 'mint'; not 'Đúc'.) |
| multi-step (route tag) | Nhiều bước |
| network cost | Phí mạng (Same label as network fee (term 8).) |
| on-chain / off-chain | trên chuỗi / ngoài chuỗi (Task types ('Trên chuỗi', 'Ngoài chuỗi') and risk texts. Not Latin 'chain' (term 13).) |
| Only verified (route filter switch) | Chỉ đã xác minh (Short on purpose: a noWrap 14px switch label in the routes header.) |
| opportunity (Earn) | cơ hội / cơ hội sinh lời ('cho cơ hội này', 'Cơ hội sinh lời mới'. Disclaimer text uses 'cơ hội đầu tư' for investment opportunities.) |
| order (checkout purchase) | lệnh mua ('Lệnh mua đã hết hạn', 'Lệnh mua của bạn chưa được đặt'. Follows term 36 'lệnh' (not 'đơn hàng'). Limit and TWAP orders stay 'lệnh' (vi-B).) |
| order (limit or scheduled) | lệnh ('Hủy lệnh', 'Giữ lệnh', 'Đặt lại lệnh' (Repeat order), 'Sửa lệnh giới hạn'. Follows terms 36 and 37.) |
| perk hub / mission hub | trung tâm Ưu đãi / trung tâm Nhiệm vụ ('Mở trung tâm Ưu đãi', 'Mở trung tâm Nhiệm vụ'.) |
| permit (EIP-2612 signature message) | tin nhắn cấp quyền ('Ký tin nhắn cấp quyền', 'Đã ký tin nhắn cấp quyền'.) |
| pinned / featured (tokens, tabs) | đã ghim / nổi bật ('Token đã ghim', 'Tab đã ghim', 'Token nổi bật'.) |
| place order | Đặt lệnh ('Đã đặt lệnh', 'Đặt lệnh thành công', 'Đặt lệnh TWAP thành công'.) |
| position | vị thế ('Quản lý vị thế', 'Vị thế của bạn'.) |
| purchase | giao dịch mua / mua ('Xem lại giao dịch mua', 'Mua thành công', 'Đang xử lý giao dịch mua', 'Mua qua {{tool}}'.) |
| recent wallets | Ví gần đây ('Chưa có ví gần đây'.) |
| refund / refunded | hoàn tiền / Đã hoàn tiền ('Yêu cầu hoàn tiền', 'Đang hoàn tiền', 'Hoàn tiền thành công' (Refund complete). Term 26 status 'Đã hoàn tiền'.) |
| revoke (approval, delegation) | Thu hồi (Only for revoke. Term 35 keeps 'Rút' for withdraw.) |
| Sending / Receiving (USD value labels in the value-loss sheet) | Gửi đi / Nhận về (Not 'Đang gửi' / 'Đang nhận', because these are not states in progress.) |
| Signature required (title) | Cần chữ ký (Same as vi-B.) |
| smart account / smart contract account | tài khoản thông minh / tài khoản hợp đồng thông minh (MetaMask vi uses 'tài khoản thông minh'. Contract follows vi-B 'hợp đồng thông minh'.) |
| Start swapping / Start bridging (execute button after review) | Bắt đầu hoán đổi / Bắt đầu chuyển qua cầu nối (Refuel mode also uses 'Start bridging'. Never 'đi cầu' (glossary term 1).) |
| subscribe (newsletter) | Đăng ký (Correct sense here. Term 23 avoids 'Đăng ký' only for a wallet signature.) |
| supplied / borrowed (lending position) | Đã cung cấp / Đã vay (Position card headers.) |
| task (step inside a mission) | yêu cầu (Follows term 42: 'Yêu cầu tùy chọn', 'Đã hoàn tất yêu cầu', 'Yêu cầu {{type}}'.) |
| theme (light/dark) | Giao diện ('Chế độ sáng không khả dụng với giao diện này'.) |
| token spending approval / revoke | 'Phê duyệt chi tiêu {{tokenSymbol}}' / 'Thu hồi quyền chi tiêu {{tokenSymbol}}' (Term 22; revoke = 'Thu hồi' (vi-B).) |
| top up | Nạp thêm (Button and 'Nạp thêm để hoàn tất lệnh mua'.) |
| Trade (navigation tab) | Giao dịch (Same tab as Exchange (a feature flag shows one or the other), so it uses term 5.) |
| trade (one fill of a scheduled order) | lượt giao dịch / lượt (Column 'Lượt giao dịch'; 'Lượt {{trade}}: đã khớp {{progress}}%'; 'Dừng các lượt giao dịch còn lại'.) |
| trade (transaction type in portfolio history) | Hoán đổi (Not 'Giao dịch', because the list sits in the 'Giao dịch' (Transactions) view.) |
| trade interval (TWAP) | Tần suất giao dịch (Value is 'Mỗi {{duration}}'. Trade = 'lượt giao dịch' (vi-B): 'Số lượt giao dịch', 'Số lượng mỗi lượt'.) |
| transfer crypto / transfer (checkout deposit flow) | Chuyển tiền mã hóa / chuyển tiền ('Hủy chuyển tiền', 'Tiếp tục chuyển tiền' (Keep transfer), 'Xem chi tiết chuyển tiền'. Term 53 'tiền mã hóa'.) |
| Try again / Retry | Thử lại (Same word for both.) |
| vault capacity (remaining / max) | Hạn mức còn lại / Hạn mức tối đa (Tooltip: 'Hạn mức nạp còn lại của vault này'.) |
| verified / unverified | đã xác minh / chưa được xác minh (Same verb as vi-B. 'Báo giá đã xác minh', 'Chỉ đã xác minh', 'Chưa được Hypernative xác minh'.) |
| verify / ownership | xác minh / quyền sở hữu ('Xác minh quyền sở hữu', 'Xác minh ví'.) |
| via {{tool}} | qua {{tool}} (Same as vi-B ('Composer qua LI.FI'). Bridge step: 'Chuyển từ {{from}} sang {{to}} qua cầu nối {{tool}}'.) |
