# Korean (`ko`)

Read [TRANSLATING.md](../../TRANSLATING.md) first.

- Variant: Korean (South Korea), ko-KR.
- Register: 합쇼체 (~습니다) for statements and errors. ~하세요 or ~해 주세요 for requests. Noun forms on buttons.
- Buttons: use a noun form, for example “지갑 연결”, “스왑”, “승인”. Use ~하기 only where a noun alone is unclear, for example “브릿지 시작하기”.
- Use standard Korean word spacing. Put a space between Korean text and Latin words or {{variables}}.
- After a {{variable}}, write both particle forms, for example (으)로, 을(를), 이(가). Uniswap ko does this.
- End full sentences with a period. Do not put a period on buttons, labels, or titles.
- Write these loanwords as one word with no space: 스테이블코인, 크로스체인, 시가총액.
- Keep token symbols, chain names, and protocol names in Latin letters, for example ETH, Arbitrum, Stargate.

## Glossary

| # | English | Use | Do not use |
| --- | --- | --- | --- |
| 1 | bridge (noun) | 브릿지 (Use 브릿지 for the protocol and the transfer. Uniswap writes 브리지, but most wallets and news use 브릿지.) | 다리 |
| 2 | bridge (verb) | 브릿지 (Use 브릿지 with 하다 or a noun, for example “브릿지 시작하기” and “브릿지 중”. MetaMask also uses 브리징, but keep one form.) | 다리 놓기 |
| 3 | swap (noun) | 스왑 (Use 스왑 for a token-to-token trade. Use 교환 only for the Exchange tab (term 5).) | 맞교환 |
| 4 | swap (verb) | 스왑 (On buttons, write 스왑. For progress, write 스왑 중. Rainbow ko uses 교환, but keep 교환 for the Exchange tab only.) | 맞바꾸기 |
| 5 | exchange | 교환 (This is the tab name that covers swap and bridge. 거래소 means a centralized exchange, so do not use it.) | 거래소 |
| 6 | cross-chain | 크로스체인 (Write one word with no space, for example “크로스체인 스왑”.) | 교차 체인 |
| 7 | gas | 가스 (Use 가스 for the gas unit and the gas token, for example “가스 부족”.) | 연료 |
| 8 | gas fee / network fee | 가스비 / 네트워크 수수료 (Use 가스비 where the text says gas fee. Use 네트워크 수수료 for the Network cost label.) | 연료비 |
| 9 | slippage | 슬리피지 (Max slippage is 최대 슬리피지. Slippage tolerance is 슬리피지 허용치.) | 미끄러짐 |
| 10 | price impact | 가격 영향 (Use 가격 영향 in all strings.) | 가격 충격 |
| 11 | route | 경로 (Use 경로 for one path of a transfer, for example “최적 경로”. PancakeSwap ko uses 라우트.) | 노선 |
| 12 | quote | 견적 (인용 means a citation. Use 견적 for a price quote, for example “새 견적 받기”.) | 인용 |
| 13 | chain / blockchain | 체인 / 블록체인 (Use 체인 in labels. Use 블록체인 only in explanations.) | 사슬 |
| 14 | network (synonym of chain in wallet UIs) | 네트워크 (Use 네트워크 where the English says network, for example “네트워크 변경”.) | 망 |
| 15 | from chain / to chain (source / destination) | 출발 체인 / 도착 체인 (MetaMask uses 소스 체인 and 대상 체인. 출발 and 도착 read more naturally and match the current widget.) | 출처 체인 |
| 16 | token | 토큰 (Do not add the plural marker 들 to token.) | 토큰들 |
| 17 | native token (ETH on Ethereum, SOL on Solana) | 네이티브 토큰 (Example: “{{tokenSymbol}}은(는) {{chainName}}의 네이티브 토큰입니다.”) | 고유 토큰 |
| 18 | stablecoin | 스테이블코인 (Write one word with no space.) | 안정 코인 |
| 19 | wallet | 지갑 (Use 지갑 for all crypto wallets. Keep 월렛 only in brand names.) | 월렛 |
| 20 | connect wallet / connect (button) | 지갑 연결 (For the Wallet connected status, write 지갑 연결됨.) | 지갑 접속 |
| 21 | disconnect | 연결 해제 (Use 연결 해제 on the button.) | 로그아웃 |
| 22 | approve / token approval (ERC-20 allowance) | 승인 / 토큰 승인 (For the allowance amount, write 지출 한도.) | 허가 |
| 23 | sign / signature (wallet signature request) | 서명 (Write 서명 요청 for the wallet request screen.) | 사인 |
| 24 | transaction | 트랜잭션 (거래 means a trade. Use 트랜잭션 for an onchain transaction.) | 거래 |
| 25 | transaction hash | 트랜잭션 해시 (Use the same word as term 24.) | 거래 해시 |
| 26 | pending / completed / failed / refunded (transaction status words) | 대기 중 / 완료 / 실패 / 환불됨 (Use these short forms on status badges. MetaMask uses 보류 중, but most sources use 대기 중.) | 미결 |
| 27 | DEX | DEX (Keep DEX in Latin letters. Write 탈중앙화 거래소(DEX) only in explanations.) | 덱스 |
| 28 | aggregator | 애그리게이터 (Use 애그리게이터 for the product type.) | 집계기 |
| 29 | liquidity | 유동성 (Use the Sino-Korean term in all strings.) | 리퀴디티 |
| 30 | yield | 수익률 (Use 수익률 for the return on a vault or a position.) | 산출량 |
| 31 | APY | APY (Keep APY in Latin letters, for example “최대 10% APY”.) | 연이율 |
| 32 | vault | 볼트 (Use 볼트 for a DeFi vault.) | 금고 |
| 33 | staking | 스테이킹 (Use 스테이킹 for the product and the action.) | 지분 걸기 |
| 34 | deposit | 예치 (예금 means a bank deposit. Use 예치 for funds that go into a vault or a position.) | 예금 |
| 35 | withdraw | 출금 (Use 출금 for funds that leave a vault or a position.) | 철수 |
| 36 | limit order | 지정가 주문 (Use 지정가 for the Limit tab and the limit price.) | 한도 주문 |
| 37 | TWAP order / scheduled order | TWAP 주문 (Keep TWAP in Latin letters.) | 시간 가중 평균 가격 주문 |
| 38 | market cap | 시가총액 (Write one word with no space.) | 시장 한도 |
| 39 | refuel / get gas | 가스 충전 (Use 가스 충전 for the button and the feature name.) | 리퓨얼 |
| 40 | airdrop | 에어드롭 (에어드랍 is a casual spelling. Use 에어드롭 in the UI.) | 공중 투하 |
| 41 | points / XP | 포인트 / XP (Keep XP in Latin letters, for example “+50 XP”.) | 점수 / 경험치 |
| 42 | quest / mission | 미션 (Jumper says Missions in English. Use 미션 for quest and for mission.) | 임무 |
| 43 | rewards / claim (rewards) | 보상 / 클레임 (주장 means an assertion. Use 클레임 on the claim button. MetaMask uses 청구, and Rabby uses 수령.) | 주장 |
| 44 | portfolio | 포트폴리오 (Use 포트폴리오 for the page name.) | 자산 목록 |
| 45 | balance | 잔액 (균형 means equilibrium. Use 잔액 for token balances.) | 균형 |
| 46 | max (button that fills the full balance) | 최대 (Use 최대 on the button that fills the full balance.) | 맥스 |
| 47 | send / receive | 보내기 / 받기 (Use these forms on buttons and headers.) | 송신 / 수신 |
| 48 | recipient / receiving address | 받는 주소 (Use 받는 사람 only where the text means a person.) | 수취인 |
| 49 | minimum received | 최소 수령액 (Use this exact label in the route details.) | 최소 수신 |
| 50 | fee (integrator fee, "Jumper fee") | 수수료 (Write Jumper 수수료 for the Jumper fee and 통합사 수수료 for the integrator fee.) | 요금 |
| 51 | estimated time | 예상 시간 (Use this label for the time that a route needs.) | 추정 시간 |
| 52 | high value loss (warning when a route loses a lot of value) | 큰 가치 손실 (높은 가치 손실 is a word-for-word translation. Say that the loss is large.) | 높은 가치 손실 |
| 53 | on-ramp / buy with card | 카드로 구매 (Use 매수 only for a buy order in trading.) | 온램프 |
| 54 | leaderboard | 리더보드 (Use 리더보드 for the page name.) | 순위 게시판 |
| 55 | perks | 혜택 (Use 혜택 for Jumper perks.) | 특전 |
| 56 | earn (the product page where users earn yield) | 수익 (Use 수익 for the page name, as PancakeSwap does. In sentences, write 수익 얻기, for example “최대 10% APY 수익 얻기”.) | 벌기 |
| 57 | trigger price (limit orders) | 트리거 가격 (Use this label for the price that starts a limit order.) | 방아쇠 가격 |
| 58 | expiry / expires (orders) | 만료 / 만료됨 (For expires in, write {{duration}} 후 만료.) | 만기 |

## More terms

These terms are in use in the current texts. Use them for the same concepts.

| English | Use |
| --- | --- |
| Activity / Activities (transaction history) | 활동 내역 (Widget history page and checkout activity list.) |
| amount | 금액 (Current amount = 현재 금액, Quoted amount = 견적 금액. Not 수량.) |
| Asset (filter, label, column) | 자산 (Asset in / Asset out = 받은 자산 / 보낸 자산.) |
| Best Return / Fastest (route priority, tags) | 최고 수익 / 가장 빠름 (Short tag labels.) |
| bookmark (wallet) | 북마크 (Bookmarked wallets = 북마크한 지갑.) |
| Cancelled / Paused (order status) | 취소됨 / 일시 중지됨 (Short status badges.) |
| capacity (vault) | 예치 한도 (Max capacity = 최대 예치 한도. Remaining capacity = 남은 예치 한도.) |
| centralized exchange (CEX), exchange account | 거래소 (Same as ko-B. Connect exchange = 거래소 연결, Link your exchange account = 거래소 계정 연동. The Exchange tab stays 교환 (term 5). The DEX list in settings (enabledExchanges, searchExchanges) uses DEX (term 27).) |
| centralized exchange (CEX), exchange wallet | 거래소 (Use only for a CEX, for example 거래소 지갑 or 거래소 지급불능 리스크. The Exchange tab stays 교환.) |
| checkout / purchase / pay | 결제 / 구매 / 결제하기 (Checkout header = 결제, Checkout details = 결제 상세 정보. Purchase successful = 구매 성공. Pay button = 결제하기 so that it differs from the 결제 header. Pay with (token) = 결제 수단, Pay with (fiat currency chip) = 결제 통화. Funding source = 결제 방법.) |
| claimed (perk, reward) | 클레임 완료 (Follows glossary term 43. Claiming = 클레임 중.) |
| Clear filters / Clear all / Clear | 필터 초기화 / 모두 지우기 / 지우기 (Filter bar actions.) |
| Contact support (button), contact support (sentence) | 고객 지원 문의 / 고객 지원팀에 문의하세요 (Sentence form matches ko-B.) |
| convert / conversion | 전환 (PancakeSwap ko uses 전환 for BNB to WBNB. Review conversion = 전환 검토. Rabby ko uses 변환, but keep one word.) |
| Copied | 복사 완료 (Wallet address copy toast keeps 지갑 주소 복사 완료.) |
| Custom (setting, expiry) | 사용자 지정 (Same as ko-B slippageCustom.) |
| Dark / Light / System (appearance) | 다크 / 라이트 / 시스템 (Same as ko-B theme labels. Appearance = 테마.) |
| deposit (checkout transfer to a deposit address) | 입금 / 입금 주소 (Checkout funding only: Deposit address = 입금 주소, deposit window = 입금 가능 시간, Deposit incomplete = 입금 미완료. The widget deposit mode into a vault or protocol keeps 예치 (term 34).) |
| Destination (route detail), Where to send it | 받는 주소 (Follows term 48.) |
| details / See details | 상세 정보 / 상세 보기 (Same as ko-B. Transaction details = 트랜잭션 상세 정보.) |
| Done / See details | 완료 / 상세 보기 (Success screen buttons.) |
| dust / dust tokens | 소액 토큰 (Convert dust = 소액 토큰 전환. MetaMask ko and Uniswap ko use 소액 잔액 for small balances. Rabby ko uses 더스트, but do not use it.) |
| Exact-output (tab) | 수령액 지정 (The tab where the user sets the exact amount to receive.) |
| exchange rate / rate | 환율 (Rate changed = 환율 변경됨, Rate change = 환율 변동, Aggregate rate = 합산 환율.) |
| exploit (smart contract) | 익스플로잇 (For example 스마트 컨트랙트 익스플로잇.) |
| explorer | 익스플로러 (View on explorer = 익스플로러에서 보기, block explorer = 블록 익스플로러. Not 탐색기.) |
| fill / filled / partially filled (orders) | 체결 / 체결됨 / 부분 체결됨 (Matches Uniswap ko (주문 체결됨) and MetaMask ko (체결됨). Filled column (percent) = 체결률.) |
| From / To (token card labels), source / destination token | 출발 / 도착, 출발 토큰 / 도착 토큰 (Exchange from / Exchange to page titles = 출발 토큰 / 도착 토큰. Follows term 15.) |
| gasless | 가스리스 (Route tag and Gasless service = 가스리스 서비스.) |
| idle (assets, tokens) | 잠자는 (For example 잠자는 {{symbol}}. Natural Korean marketing word for unused assets.) |
| Incognito (private swap) | 시크릿 모드 (Same word as the browser private mode in Korean.) |
| level / rank | 레벨 / 순위 (Short form on the navbar Pass chip: Lv. Blog article level = 난이도.) |
| lockup period | 락업 기간 (Short label: 락업.) |
| market (Earn) | 마켓 (For example 전체 마켓, 관련 마켓. Market price = 시장 가격. Order table column Market = 시장가.) |
| Multi-step (route tag) | 여러 단계 (Do not use 다단계 (it suggests a pyramid scheme).) |
| Multi-swap | 멀티스왑 (One word, like 멀티체인.) |
| opportunity (Earn) | 상품 (For example 이 상품, 새 수익 상품. Do not use 기회.) |
| permit (signed message) | Permit (Keep the standard name in Latin letters, for example Permit 메시지 서명.) |
| Perps | 무기한 선물 (Keep the product name Jumper Perps in English.) |
| Place order / order placed | 주문하기 / 주문 접수 (Order placed successfully = 주문 접수 완료, Order Placed header = 주문 접수됨.) |
| position | 포지션 (Your positions = 내 포지션. Manage your position = 포지션 관리.) |
| provider (quote or payment provider) | 제공업체 (Same as ko-B. Provider fee = 제공업체 수수료.) |
| Received / Refunded (amount titles) | 수령 금액 / 환불 금액 (Matches ko-B form label Received = 수령 금액.) |
| refund / refunded | 환불 / 환불 금액 (Request refund = 환불 요청, Refund in progress = 환불 진행 중, Refund complete = 환불 완료.) |
| request approved / accepted (withdraw request) | 수락 / 수락된 요청 (Keeps 승인 for token approval only (term 22).) |
| Review / Confirm (buttons) | 검토 / 확인 (Same as ko-B. Review swap = 스왑 검토, Review order = 주문 검토, Review purchase = 구매 검토.) |
| revoke (token approval), revocation | 승인 취소 (Revoke {{tokenSymbol}} spending = {{tokenSymbol}} 지출 승인 취소.) |
| risk / risk disclaimer | 리스크 / 리스크 고지 (Use 리스크 in all Earn risk texts.) |
| Sell / Buy (order columns), Pair | 매도 / 매수, 페어 (Trading context only. Card purchase stays 카드로 구매.) |
| Sending / Receiving (amount labels), You pay | 보내는 금액 / 받는 금액, 지불 금액 (Detail labels, not progress states.) |
| Simple / Advanced (exchange modes) | 간편 / 고급 (Tab labels.) |
| small balances | 소액 잔액 (Hide small balances = 소액 잔액 숨기기.) |
| Sort by / Sort | 정렬 기준 / 정렬 (Two different labels so that they do not collide.) |
| Start Earning (CTA) | 지금 수익 얻기 (Start swapping = 스왑 시작하기. Jumper Earn in sentences = Jumper 수익 페이지.) |
| switch (network, wallet) / switch (mode, view, token) | 변경 / 전환 (Failed to switch network = 네트워크 변경 실패. Switch to dark mode = 다크 모드로 전환.) |
| task (mission task) | 태스크 (Optional task = 선택 태스크.) |
| Top up (send more to a deposit address) | 추가 입금 (Checkout button. Gas refuel keeps 가스 충전 (term 39).) |
| trade (one execution of an order), Trade tab | 거래 (거래 means a trade, not a transaction. Repeat order = 재주문.) |
| transfer (noun) | 전송 (Transfer ID = 전송 ID, Transfer crypto = 암호화폐 전송, View transfer details = 전송 상세 보기.) |
| Try again / Retry (button) | 다시 시도 (In sentences, write 다시 시도해 주세요.) |
| unlock (perks), unlocked | 잠금 해제 / 잠금 해제됨 (Use for perks, levels and achievements.) |
| Value / Total value (portfolio) | 평가액 / 총 평가액 (Column and filter labels.) |
| verified / unverified (token, route, quote) | 검증됨 / 검증되지 않은 (Security or simulation check by a provider (Hypernative, route simulation). Mission and wallet ownership verification stays 인증 (ko-B).) |
| verify (mission task, wallet ownership), verified | 인증 / 인증 완료 (User-side check. Form validation is 검증 (검증 실패).) |
