# Ukrainian (`uk`)

Read [TRANSLATING.md](../../TRANSLATING.md) first.

- Variant: Ukrainian (Ukraine), 2019 orthography. 'Своп', 'газ' and 'бридж' are the anglicisms that Ukrainian crypto users use. Wallet UIs use 'кросчейн' for the action. Do not use Russian words, Russian spellings or Russian-style calques.
- Register: ви. Crypto wallets and exchanges in Ukrainian address the user as 'ви'. Do not use 'ти'.
- Address the user as 'ви'. Write 'ви' and 'ваш' in lowercase inside a sentence. Use the infinitive on a button ('Підключити гаманець', 'Обміняти') and the plural imperative in an instruction ('Підпишіть транзакцію').
- Inflect loanwords like native nouns: своп, свопу, свопом; газ, газу; токен, токена; бридж, бриджу. Write 'транзакція свопу', not 'своп транзакція'.
- Use the apostrophe U+02BC (ʼ) in all words: імʼя, обовʼязковий. Do not mix it with U+0027 (') or U+2019 (’). The widget uk.json mixes them.
- Check every term for Russian words and calques: проскальзування → прослизання, очки → бали, кошелек → гаманець, кроссчейн → кросчейн, аирдроп → ейрдроп.
- Keep Latin script for brand names, tickers and acronyms: Jumper, LI.FI, ETH, DEX, APY, XP, TWAP.
- Write 'кросчейн' as one word. Join it to a noun with a hyphen: 'кросчейн-переказ', 'кросчейн-своп'.

## Glossary

| # | English | Use | Do not use |
| --- | --- | --- | --- |
| 1 | bridge (noun) | бридж (бриджу, бриджі, бриджів) for the protocol, for example 'бридж Stargate'; кросчейн-переказ for the action (compact tab label: 'Кросчейн') (Ukrainian crypto users say 'бридж'. No wallet UI uses 'міст' (Rabby uk uses 'Кросчейн'); only media articles do. The ticket asks to avoid the literal real-life word. Prefer 'кросчейн-переказ' when the text means the action.) | міст (reads as a river bridge in the UI); брідж |
| 2 | bridge (verb) | переказати між мережами (button: 'Переказати') (Use 'Переказ з {{from}} до {{to}} через {{tool}}' for the step details.) | бриджити; забриджити |
| 3 | swap (noun) | своп (свопу, свопом, свопи) (Rabby uk writes 'Свап' once; use 'своп'. Write 'транзакція свопу', not 'своп транзакція'.) | свап; обмінка |
| 4 | swap (verb) | обміняти (button: 'Обміняти') (Trust Wallet uses the noun 'своп' and the verb 'обміняти'.) | свопнути; поміняти |
| 5 | exchange | Обмін (Exchange tab and header title) ('Обмінник' means a currency exchange office. Use 'курс обміну' for exchange rate. Use 'біржа' for a centralized exchange ('Підключити біржу'). The DEX list follows term 27.) | Обмінник; Біржа (for the tab) |
| 6 | cross-chain | кросчейн (кросчейн-переказ, кросчейн-своп) ('Кроссчейн' with double 'с' is the Russian spelling. 'Міжланцюговий' is a literal calque.) | кроссчейн; міжланцюговий |
| 7 | gas | газ (газу) (MetaMask uk (legacy) has 'Пального використано'. Do not use 'пальне'.) | пальне |
| 8 | gas fee / network fee | комісія за газ (gas fee); комісія мережі (network fee) (Follow the English source. The widget uk.json uses 'Витрати мережі' for 'Network cost', which is also correct.) | плата за пальне; збір мережі |
| 9 | slippage | прослизання (label: 'Макс. прослизання') ('Проскальзування' is a calque of the Russian 'проскальзывание'. Rabby uk uses it once.) | проскальзування; ковзання |
| 10 | price impact | вплив на ціну (Rabby uk also writes 'Ціновий вплив'. Use 'вплив на ціну' only.) | ціновий удар |
| 11 | route | маршрут (Use 'Пріоритет маршруту' for 'Route priority'. The widget uk.json drops the noun ('Пріоритет').) | шлях |
| 12 | quote | котирування ('Квота' means a quota. The widget uk.json has 'запросіть нову квоту'.) | квота; цитата |
| 13 | chain / blockchain | мережа; блокчейн (Wallets use 'мережа' for chain. The widget uk.json uses the slang 'чейн'.) | чейн; ланцюг; ланцюжок |
| 14 | network (synonym of chain in wallet UIs) | мережа (Ukrainian UIs use one word for chain and network.) | сітка |
| 15 | from chain / to chain (source / destination) | мережа відправлення / мережа призначення; field labels 'З' / 'До' (The widget uk.json has 'В очікуванні чейна що приймає'. Use 'Очікування мережі призначення'.) | чейн що приймає |
| 16 | token | токен (gen. токена) (MetaMask and Rabby use the genitive 'токена'. The widget uk.json mixes 'токена' and 'токену'.) | токену (gen.); жетон |
| 17 | native token (ETH on Ethereum, SOL on Solana) | нативний токен (Use 'нативний токен мережі' when the sentence needs more context.) | рідний токен; власний токен |
| 18 | stablecoin | стейблкоїн (Rabby uk writes both 'стейблкоїни' and 'стейблкойнів'. Use 'коїн', as in 'біткоїн'.) | стабільна монета; стейблкойн |
| 19 | wallet | гаманець (gen. гаманця) ('Кошелек' is Russian.) | кошелек; кошельок |
| 20 | connect wallet / connect (button) | Підключити гаманець / Підключити ('Підʼєднати' is also correct, and the widget uk.json mixes both. Use the pair 'Підключити / Відключити'.) | Законектити; Приєднати |
| 21 | disconnect | Відключити (Pair it with 'Підключити'.) | Розʼєднати |
| 22 | approve / token approval (ERC-20 allowance) | Схвалити / схвалення токена ('Затвердити' sounds like approving a budget. MetaMask uk (legacy) and the widget uk.json use it.) | Затвердити; Апрувнути |
| 23 | sign / signature (wallet signature request) | Підписати / підпис (Use 'Підпишіть транзакцію свопу' for 'Sign swap transaction'.) | Розписатися |
| 24 | transaction | транзакція ('Угода' means a trade deal. The widget uk.json also uses 'операція'; use 'транзакція' only.) | угода; операція |
| 25 | transaction hash | хеш транзакції (Rabby uk uses 'Tx-хеш' in a compact label.) | геш |
| 26 | pending / completed / failed / refunded (transaction status words) | Очікує / Завершено / Не вдалося / Повернено (Use the same words in the activity list and in notifications.) | Ожидание; Провалено |
| 27 | DEX | DEX (long form: 'децентралізована біржа (DEX)') (Keep the acronym in Latin script.) | ДЕКС |
| 28 | aggregator | агрегатор (Use 'агрегатор ліквідності' for liquidity aggregator.) | збирач |
| 29 | liquidity | ліквідність (Use 'низька ліквідність' for low liquidity.) | плинність |
| 30 | yield | прибутковість (Rabby uk uses 'Дохідність'. Binance and Bankless UA use 'прибутковість'.) | врожайність; вихід |
| 31 | APY | APY (Keep the acronym in Latin script.) | річна процентна дохідність (in labels) |
| 32 | vault | сховище (Keep the protocol name in Latin script: 'сховище Morpho'.) | склеп; сейф |
| 33 | staking | стейкінг / внести в стейкінг ('Стейкинг' is the Russian spelling. 'Ставка' means a bet or a rate.) | ставка; стейкинг |
| 34 | deposit | Внести / депозит ('Депонувати' is bureaucratic. Binance uses it in one step.) | Депонувати |
| 35 | withdraw | Вивести / виведення ('Зняти' is for cash at an ATM.) | Зняти |
| 36 | limit order | лімітний ордер ('Замовлення' means a purchase order in a shop.) | лімітне замовлення |
| 37 | TWAP order / scheduled order | TWAP-ордер / запланований ордер (Keep 'TWAP' in Latin script.) | TWAP-замовлення |
| 38 | market cap | ринкова капіталізація (compact: 'Капіталізація') (Here 'cap' means capitalization, not a limit.) | ринковий ліміт |
| 39 | refuel / get gas | Отримати газ, e.g. 'Отримати газ у {{chain}}' (Keep the current form.) | Заправка; Заправити |
| 40 | airdrop | ейрдроп ('Аирдроп' follows the Russian spelling.) | аірдроп; аирдроп |
| 41 | points / XP | бали / XP ('Очки' is Russian. Keep 'XP' in Latin script.) | очки; поінти |
| 42 | quest / mission | місія (one task inside a mission: 'завдання') (Jumper calls them missions.) | квест |
| 43 | rewards / claim (rewards) | винагороди / Отримати (claim) (The current Jumper uk translation mixes 'Нагороди' and 'винагороди'. Use 'винагороди' only.) | Заявити; Претендувати |
| 44 | portfolio | портфель ('Портфоліо' means a design portfolio.) | портфоліо |
| 45 | balance | баланс (MetaMask uk (legacy) uses 'залишок' once in a sentence. Use 'баланс' in labels.) | залишок (as a label) |
| 46 | max (button that fills the full balance) | Макс. (Use the short form with a full stop.) | МАКС; Максимум (on the button) |
| 47 | send / receive | Надіслати / Отримати (The widget uk.json mixes 'Надіслати' and 'Відправити'. Use 'Надіслати' only.) | Відправити |
| 48 | recipient / receiving address | отримувач / адреса отримувача (Rabby uk uses both 'отримувача' and 'одержувача'. Use 'отримувач' only.) | одержувач; бенефіціар |
| 49 | minimum received | Мінімум до отримання ('Отримано' reads as a finished event. The label shows a guaranteed amount.) | Мінімальне отримання; Мін. отримано |
| 50 | fee (integrator fee, "Jumper fee") | комісія, e.g. 'Комісія Jumper', 'Комісія інтегратора' (Keep the product name in Latin script.) | збір; плата |
| 51 | estimated time | Орієнтовний час ('Розрахунковий час' is a calque of the Russian 'расчётное время'.) | Розрахунковий час |
| 52 | high value loss (warning when a route loses a lot of value) | Значна втрата вартості (Ukrainian says 'значна втрата', not 'висока втрата'.) | Висока втрата вартості |
| 53 | on-ramp / buy with card | Купити карткою / Купити криптовалюту (Do not show the term 'on-ramp' to users.) | Онрамп |
| 54 | leaderboard | Таблиця лідерів (Keep the current form.) | Лідерборд |
| 55 | perks | привілеї ('Пільги' means social benefits, for example for pensioners.) | перки; пільги |
| 56 | earn (the product page where users earn yield) | Заробіток (page name); заробляйте (verb), e.g. 'Заробляйте до {{apy}} APY' (Use 'Заробляйте XP' for 'Earn XP'.) | Прибуток |
| 57 | trigger price (limit orders) | ціна спрацьовування (Rabby uk uses 'Спрацьовування' for the Trigger tab.) | тригерна ціна; ціна тригера |
| 58 | expiry / expires (orders) | термін дії / 'Спливає через {{time}}' (Use 'Термін дії минув' for 'Expired'.) | експірація |

## More terms

These terms are in use in the current texts. Use them for the same concepts.

| English | Use |
| --- | --- |
| Activity / Activities | Активність (Same as B ('Активність').) |
| allowance (ERC-20) | ліміт схвалення ('Недостатній ліміт схвалення'. Ties to glossary term 22 ('Схваліть витрату {{tokenSymbol}}').) |
| Always do your own research (DYOR) | Завжди перевіряйте інформацію самостійно (Title form: 'Завжди перевіряйте інформацію'.) |
| Best Return (route tag and route priority) | Найвигідніший (Pairs with 'Найшвидший'. Both agree with 'маршрут'.) |
| bookmark / bookmark name | закладка / назва закладки (Button: 'Додати в закладки'; title: 'Гаманці в закладках'.) |
| boost / boosted APR | буст / 'APR з бустом' ('Бусти кампаній', 'активний буст кампанії'.) |
| bps (basis points) | б.п. ('{{value}} б.п.'. Fee tiers: 'блакитні фішки' / 'волатильні'.) |
| checkout (page) / order (checkout purchase) | оплата / замовлення ('Деталі оплати', 'Закрити оплату'. 'Замовлення' only for a checkout purchase; a trading order is 'ордер' (term 36).) |
| claim vs receive (transaction types in one list) | Отримання винагород / Отримання (Both map to 'Отримати' in terms 43 and 47; the list needs two different labels.) |
| Clear all / Clear filters | Скинути все / Скинути фільтри ('Clear' alone in a select is 'Очистити'.) |
| Clear transaction / Clear all failed | Видалити транзакцію / Видалити всі невдалі (The items are removed from local storage. 'Clear' in the recent-search list is 'Очистити'.) |
| depeg | депег (Use 'нестабільність привʼязки' for 'peg instability'.) |
| deposit address / deposit window | адреса депозиту / час на депозит ('Адреса депозиту діє ще {{minutes}}:{{seconds}}', 'Час на депозит минув'.) |
| deposit with cash (card on-ramp) | Внести карткою ('Cash' means fiat by card here. 'Готівка' means physical cash. Card errors: 'Оплата карткою недоступна'.) |
| dust (small token balances) | дрібні залишки (button: 'Конвертувати залишки') (Clear for all users. Do not use the slang 'пил'.) |
| exact output (tab) | Точне отримання ('Точний вихід' reads as 'exact exit'.) |
| Exchange (default CTA) vs Swap (split-mode CTA and switch-arrow label) | Обмін / Обміняти (Both labels can be on the same screen, so they must differ. 'Обмін' follows glossary term 5.) |
| exchange account (CEX, checkout) | акаунт на біржі ('Підключити біржу', 'Привʼяжіть акаунт на біржі', 'Виведення з біржі не вдалося'. Follows the glossary term 5 note.) |
| Exchange from / Exchange to (token page titles) | Обміняти з / Обміняти на (Field labels stay 'З' / 'До'.) |
| Exchanges (DEX list in settings) | DEX (Settings title 'DEX'; 'Пошук за назвою DEX'; 'не знайдено жодної DEX' (feminine, as 'біржа'). Follows glossary term 27.) |
| explorer (block explorer) | експлорер ('Переглянути в експлорері'.) |
| Gasless (route tag) | Без газу (Fee line 'Gasless service' is 'Сервіс без газу'.) |
| light / dark / system mode | світла / темна / системна тема; partner theme: оформлення ('Увімкнути світлу тему', 'Світла тема недоступна для цього оформлення'.) |
| lock-up / lockup period | блокування / період блокування ('Після внесення ваша позиція буде заблокована на ...'.) |
| malicious token / flagged | шкідливий токен / позначив як шкідливий ('Виявлено шкідливий токен', 'Hypernative позначив {{tokenSymbol}} як шкідливий токен'.) |
| multi-chain | мультичейн (мультичейн-агрегатор) (Formed like 'кросчейн'; written with a hyphen before a noun.) |
| multi-swap | мультисвоп (Formed like 'мультичейн'.) |
| multisig | мультисиг (мультисиг-гаманець) (Formed like 'кросчейн'.) |
| on {{chain}} (token or step on a chain) | у мережі {{chain}} ('{{tokenSymbol}} у мережі {{chainName}}', 'Своп у мережі {{chain}}'. Bridge steps use 'з {{from}} до {{to}}' (term 2).) |
| on-chain / off-chain | ончейн / офчейн ('Ончейн-страхування', 'ончейн- і офчейн-ринки'.) |
| opportunity (earn market) | пропозиція ('Нова пропозиція для заробітку', 'для цієї пропозиції'. 'Можливість' reads as a literal calque.) |
| Pay with | Чим оплатити (token page title); Валюта оплати (fiat currency selector) (The checkout funding options use 'Оплатити з гаманця', 'Оплатити через {{exchange}}'.) |
| perks / Perks hub | привілеї / центр привілеїв (Follows glossary term 55. 'Mission Hub' is 'центр місій'.) |
| permit message (signature) | дозвіл на витрату ('Підпишіть дозвіл на витрату', 'Дозвіл на витрату підписано'. Do not show the word 'permit'.) |
| perps | перпи ('Перпи та ринки прогнозів', 'позиції в перпах'.) |
| Private (widget tab) | Приватний (B uses 'Приватні маршрути свопу'.) |
| recent (wallets, searches, transactions) | нещодавні ('Нещодавні гаманці', 'Нещодавні пошуки', 'Немає нещодавніх транзакцій'.) |
| refund | повернення коштів (button: 'Запросити повернення') (Status: 'Триває повернення коштів'; done: 'Кошти повернено'; list status: 'Повернено' (term 26).) |
| Review (button) vs Confirm vs Place order | Переглянути / Підтвердити / Розмістити ордер ('Review order' is 'Переглянути ордер'; 'Review swap' is 'Переглянути своп'; 'Review bridge' is 'Переглянути переказ' (also a page title, so it stays short).) |
| Review conversion vs Confirm | Переглянути конвертацію / Підтвердити (Keep the two buttons different.) |
| revoke (approval) | відкликати схвалення / відкликання схвалення ('Відкличте схвалення {{tokenSymbol}}'. B uses 'Відкликання' for the transaction type.) |
| Send / Receive / Sell / Buy (amount card titles) | Надсилаєте / Отримуєте / Продаєте / Купуєте ('You pay' is 'Ви платите'. Table columns and transaction types keep B's nouns (Продаж, Купівля, Надсилання, Отримання).) |
| smart account / smart contract account | смарт-акаунт / акаунт смарт-контракту (Hyphenated, as B writes 'смарт-контракт'.) |
| Start swapping / Start bridging | Почати обмін / Почати переказ ('Почати обмін' matches B. Buttons and short titles use 'переказ'; status texts use 'кросчейн-переказ'.) |
| tier (activity reward tier) | поріг (Keeps 'рівень' for the Pass level.) |
| trade (one fill of a scheduled/TWAP order) | угода (угоди) (Use only for a trade. Term 24 forbids 'угода' for 'transaction'. Binance uk uses 'Історія угод'.) |
| Try again (button) / try again (sentence) | Спробувати знову / Спробуйте ще раз. (Button uses the infinitive; the message uses the imperative.) |
| vault capacity | місткість (Вільна місткість, Макс. місткість) (Avoid 'залишок' because term 45 reserves it.) |
| Verified (route tag) / verified by Hypernative | Перевірений / пройшов перевірку Hypernative ('Лише перевірені', 'Не пройшов перевірку Hypernative'. B uses 'Перевірено' for a task status.) |
