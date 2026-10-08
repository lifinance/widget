# Translating

We do not use Crowdin. The person or the AI agent that changes an English text also translates it, in the same PR.

## Rules

1. When you add a key to the English file, add the key to every other locale file in the same PR.
2. When you change the English text of a key, translate the key again in every locale file.
3. When you remove a key from the English file, remove the key from every locale file.
4. Put each key at the same position as in the English file.
5. Do not leave a value empty (`""`). An empty value shows English to the user.
6. Keep `{{placeholders}}`, `$t(...)` and tags such as `<0>` and `</0>` exactly as in English. Translate only the text around and between them.
7. Keep brand, product, chain, token, wallet and protocol names in English. Examples: Jumper, LI.FI, Ethereum, USDC, MetaMask.
8. Use the plural forms of the locale. See [Plural forms](#plural-forms).
9. Keep each text near the length of the English text. Buttons and labels have little space.
10. Use the register, the style rules and the glossary of the locale. See [Locales](#locales).

## How to translate well

- Write as a native speaker who uses crypto apps every day. Do not translate word by word.
- Use the key path as context. `button.*` is a button label, `tooltip.*` is a tooltip and `error.*` is an error message.
- If crypto users of a language use the English word, keep the English word. The glossary tells you which words to keep.
- Use the same word for the same concept in all texts of a locale.
- After you translate, read each new text again as a user of that locale. Fix text that sounds literal.

## Plural forms

i18next selects the plural form with `Intl.PluralRules`. A plural key in English has the forms `_one` and `_other`. Each locale needs exactly the forms in this table.

| Locale | Forms | Example numbers |
| --- | --- | --- |
| `bn` | `_one`, `_other` | `one`: 0, 1; `other`: 2, 3, 4, 5, 6, 7, … |
| `de` | `_one`, `_other` | `one`: 1; `other`: 0, 2, 3, 4, 5, 6, … |
| `es` | `_one`, `_many`, `_other` | `one`: 1; `many`: 1 000 000, 2 000 000; `other`: 0, 2, 3, 4, 5, 6, … |
| `fr` | `_one`, `_many`, `_other` | `one`: 0, 1, 1.5; `many`: 1 000 000, 2 000 000; `other`: 2, 3, 4, 5, 6, 7, … |
| `hi` | `_one`, `_other` | `one`: 0, 1; `other`: 2, 3, 4, 5, 6, 7, … |
| `id` | `_other` | `other`: 0, 1, 2, 3, 4, 5, … |
| `it` | `_one`, `_many`, `_other` | `one`: 1; `many`: 1 000 000, 2 000 000; `other`: 0, 2, 3, 4, 5, 6, … |
| `ja` | `_other` | `other`: 0, 1, 2, 3, 4, 5, … |
| `ko` | `_other` | `other`: 0, 1, 2, 3, 4, 5, … |
| `pl` | `_one`, `_few`, `_many`, `_other` | `one`: 1; `few`: 2, 3, 4, 22, 23, 24, …; `many`: 0, 5, 6, 7, 8, 9, …; `other`: 1.5 |
| `pt` | `_one`, `_many`, `_other` | `one`: 0, 1, 1.5; `many`: 1 000 000, 2 000 000; `other`: 2, 3, 4, 5, 6, 7, … |
| `th` | `_other` | `other`: 0, 1, 2, 3, 4, 5, … |
| `tr` | `_one`, `_other` | `one`: 1; `other`: 0, 2, 3, 4, 5, 6, … |
| `uk` | `_one`, `_few`, `_many`, `_other` | `one`: 1, 21, 31, 41, 51, 61, …; `few`: 2, 3, 4, 22, 23, 24, …; `many`: 0, 5, 6, 7, 8, 9, …; `other`: 1.5 |
| `vi` | `_other` | `other`: 0, 1, 2, 3, 4, 5, … |
| `zh` | `_other` | `other`: 0, 1, 2, 3, 4, 5, … |

- If the English `_other` text has `{{count}}`, every form must have `{{count}}`.
- Two forms do not need `{{count}}`: `_zero`, and `_one` when the locale uses `one` only for the number 1.
- A locale has `_zero` only when the English file has it.

## Files in this repo

- English files: `packages/widget/src/i18n/en.json` and `packages/wallet-management/src/i18n/en.json`.
- Locale files: `<locale>.json` in the same folders.

## Locales

Each locale has a register, style rules and a glossary. The glossary gives the word to use and a literal translation to avoid.

### `bn` — Bengali

- Variant: Bengali (Bangla) in standard Bengali script, for readers in Bangladesh and West Bengal. Few wallets ship Bengali; MetaMask bn is a small legacy file. The evidence comes from ethereum.org bn, Bitcoin.com bn, Bitget Wallet bn and KuCoin bn. Crypto terms are transliterated. Everyday actions use Bengali words (লেনদেন, অনুমোদন, স্বাক্ষর).
- Register: আপনি
- Transliterate crypto terms into Bengali script: সোয়াপ, ব্রিজ, গ্যাস, স্লিপেজ, টোকেন, ওয়ালেট. Do not use সেতু or উদ্ধৃতি. Use 'বিনিময়' only in 'বিনিময় হার' (exchange rate).
- Use the Bengali word where wallets already translate an everyday action: লেনদেন, অনুমোদন, স্বাক্ষর, পাঠান.
- Keep Latin script for brand names, tickers and acronyms: Jumper, LI.FI, ETH, DEX, APY, XP. Do not transliterate brand names; the widget bn.json has 'লি.ফাই'.
- Write a crypto action as the loanword + 'করুন': 'সোয়াপ করুন', 'ব্রিজ করুন', 'কানেক্ট করুন'.
- Use one spelling per loanword: 'সোয়াপ', not 'সোওয়াপ'.
- End a full sentence with '।'. Do not put an end mark on a button or a label.

| English | Use | Do not use |
| --- | --- | --- |
| bridge (noun) | ব্রিজ (ethereum.org bn uses 'সেতু', but crypto media and wallets use 'ব্রিজ'.) | সেতু |
| bridge (verb) | ব্রিজ করুন (Use 'আবার ব্রিজ করুন' for 'Bridge again'.) | সেতু পার করুন |
| swap (noun) | সোয়াপ (The widget bn.json mixes 'সোওয়াপ' and 'সোয়াপ'. Use 'সোয়াপ' only.) | সোওয়াপ; বিনিময় |
| swap (verb) | সোয়াপ করুন, e.g. 'ETH থেকে USDC-তে সোয়াপ করুন' (Put the token names before the verb.) | বিনিময় করুন |
| exchange | এক্সচেঞ্জ (Exchange tab and header title) (Keep the tab different from 'সোয়াপ'. Use 'বিনিময় হার' for exchange rate, as the widget bn.json does. Use 'এক্সচেঞ্জ কানেক্ট করুন' for 'Connect exchange' (a centralized exchange). The DEX list follows term 27.) | সোয়াপ (for the tab) |
| cross-chain | ক্রস-চেইন (Keep the hyphen.) | আন্তঃশৃঙ্খল |
| gas | গ্যাস (Use 'অপর্যাপ্ত গ্যাস' for 'Insufficient gas'.) | জ্বালানি |
| gas fee / network fee | গ্যাস ফি (gas fee); নেটওয়ার্ক ফি (network fee) ('গ্যাসের দাম' is the gas price, which is a different setting.) | গ্যাসের দাম (for a fee) |
| slippage | স্লিপেজ (label: 'সর্বোচ্চ স্লিপেজ') (Use the same term in settings and in error messages.) | পিছলে যাওয়া |
| price impact | প্রাইস ইমপ্যাক্ট (Use the same term in the route details and in the warning.) | মূল্য প্রভাব |
| route | রুট (label: 'রুট অগ্রাধিকার') (Use 'কোনো রুট পাওয়া যায়নি' for 'No routes available'. The widget bn.json drops the negative.) | পথ |
| quote | কোটেশন ('উদ্ধৃতি' means a literary quotation, and the widget bn.json uses it. 'কোট' also means a coat.) | উদ্ধৃতি; কোট |
| chain / blockchain | চেইন; ব্লকচেইন ('শৃঙ্খল' means a metal chain.) | শৃঙ্খল |
| network (synonym of chain in wallet UIs) | নেটওয়ার্ক (Use 'নেটওয়ার্ক' where the English says network.) | জাল |
| from chain / to chain (source / destination) | উৎস চেইন / গন্তব্য চেইন; field labels 'থেকে' / 'গন্তব্য' (The widget bn.json uses 'প্রতি' for 'To'. 'প্রতি' means 'per'.) | প্রতি (for the 'To' label) |
| token | টোকেন (Use 'টোকেনগুলো' only when the plural is necessary.) | প্রতীক |
| native token (ETH on Ethereum, SOL on Solana) | নেটিভ টোকেন ('স্থানীয়' means local.) | স্থানীয় টোকেন |
| stablecoin | স্টেবলকয়েন (Spell 'কয়েন' as in 'বিটকয়েন'.) | স্থিতিশীল মুদ্রা |
| wallet | ওয়ালেট ('মানিব্যাগ' means a leather purse.) | মানিব্যাগ |
| connect wallet / connect (button) | ওয়ালেট কানেক্ট করুন / কানেক্ট করুন (MetaMask bn (legacy) and the widget bn.json use 'সংযুক্ত করুন', which is also correct. Use 'কানেক্ট' only, so it pairs with 'ডিসকানেক্ট'.) | সংযোগ স্থাপন করুন |
| disconnect | ডিসকানেক্ট করুন (Pair it with 'কানেক্ট করুন'.) | সংযোগ বিচ্ছিন্ন করুন |
| approve / token approval (ERC-20 allowance) | অনুমোদন করুন / টোকেন অনুমোদন (Users say 'অ্যাপ্রুভ' in chat, but the Bengali wallet UI uses 'অনুমোদন'.) | মঞ্জুর করুন |
| sign / signature (wallet signature request) | স্বাক্ষর করুন / স্বাক্ষর ('সাইন ইন' means log in.) | সাইন ইন করুন |
| transaction | লেনদেন (ethereum.org bn uses 'ট্রানজ্যাকশন', but most sources use 'লেনদেন'. Use 'লেনদেন' only.) | কারবার |
| transaction hash | লেনদেনের হ্যাশ (Use 'হ্যাশ', because the block explorer shows this word.) | লেনদেনের আইডি |
| pending / completed / failed / refunded (transaction status words) | পেন্ডিং / সম্পন্ন হয়েছে / ব্যর্থ হয়েছে / রিফান্ড হয়েছে (MetaMask bn uses 'বাকি', which means 'remaining' or 'due'. The widget bn.json has 'ফেরত করা হয়েছে', which is not correct Bengali.) | বাকি; ফেরত করা হয়েছে |
| DEX | DEX (long form: 'বিকেন্দ্রীকৃত এক্সচেঞ্জ (DEX)') (Keep the acronym in Latin script.) | ডেক্স |
| aggregator | অ্যাগ্রিগেটর (Use 'লিকুইডিটি অ্যাগ্রিগেটর' for liquidity aggregator.) | সমষ্টিকারী |
| liquidity | লিকুইডিটি ('তরলতা' means physical fluidity.) | তরলতা |
| yield | ইল্ড ('ফলন' means a crop yield. KuCoin bn uses it ('ফলন পণ্য').) | ফলন |
| APY | APY (Keep the acronym in Latin script.) | বার্ষিক শতাংশ ফলন |
| vault | ভল্ট (Keep the protocol name in Latin script: 'Morpho ভল্ট'.) | সিন্দুক |
| staking | স্টেকিং / স্টেক করুন ('বাজি' means a bet.) | বাজি ধরা |
| deposit | ডিপোজিট করুন / ডিপোজিট ('আমানত' is a bank deposit. 'জমা করুন' is also understood; do not mix the two.) | আমানত |
| withdraw | উইথড্র করুন ('প্রত্যাহার' means to revoke or recall.) | প্রত্যাহার করুন |
| limit order | লিমিট অর্ডার ('আদেশ' means a command.) | সীমা আদেশ |
| TWAP order / scheduled order | TWAP অর্ডার / শিডিউলড অর্ডার (Keep 'TWAP' in Latin script.) | নির্ধারিত আদেশ |
| market cap | মার্কেট ক্যাপ (Use the same term in token details and in sort options.) | বাজার মূলধন |
| refuel / get gas | গ্যাস পান, e.g. '{{chain}}-এ গ্যাস পান' (Keep the current form.) | জ্বালানি নিন |
| airdrop | এয়ারড্রপ (Keep the loanword.) | বিনামূল্যে বিতরণ |
| points / XP | পয়েন্ট / XP ('নম্বর' means exam marks. Keep 'XP' in Latin script.) | নম্বর |
| quest / mission | মিশন ('অভিযান' means an expedition.) | অভিযান |
| rewards / claim (rewards) | রিওয়ার্ড / ক্লেম করুন ('দাবি' is a legal claim. KuCoin bn uses both 'রিওয়ার্ড' and 'পুরস্কার'; use 'রিওয়ার্ড' only.) | দাবি করুন |
| portfolio | পোর্টফোলিও (Keep the loanword.) | সম্পদ তালিকা |
| balance | ব্যালেন্স ('ভারসাম্য' means equilibrium.) | ভারসাম্য |
| max (button that fills the full balance) | সর্বোচ্চ (MetaMask bn (legacy) uses 'সর্বাধিক'. Use 'সর্বোচ্চ' only.) | — |
| send / receive | পাঠান / গ্রহণ করুন (The widget bn.json uses 'রিসিভিং'. Use 'গ্রহণ করা হচ্ছে'.) | প্রেরণ করুন |
| recipient / receiving address | প্রাপক / প্রাপকের ঠিকানা ('গ্রাহক' means a customer.) | গ্রাহক |
| minimum received | ন্যূনতম প্রাপ্ত পরিমাণ (The label shows a guaranteed amount, so name the amount.) | ন্যূনতম প্রাপ্তি |
| fee (integrator fee, "Jumper fee") | ফি, e.g. 'Jumper ফি', 'ইন্টিগ্রেটর ফি' (Keep the product name in Latin script.) | মাশুল |
| estimated time | আনুমানিক সময় (Use '~{{time}}' in a compact route card.) | — |
| high value loss (warning when a route loses a lot of value) | মূল্যের বড় ক্ষতি (The widget bn.json uses the literal form, which reads as 'high-price loss'.) | উচ্চ মূল্য ক্ষতি |
| on-ramp / buy with card | কার্ড দিয়ে কিনুন / ক্রিপ্টো কিনুন (Do not show the term 'on-ramp' to users.) | অন-র‍্যাম্প |
| leaderboard | লিডারবোর্ড (Keep the loanword.) | নেতৃত্ব তালিকা |
| perks | সুবিধা ('সুবিধা' is the everyday Bengali word for benefits. Bengali users do not say 'perks'.) | পার্কস |
| earn (the product page where users earn yield) | Earn (page name, Latin script); আয় করুন (verb), e.g. '{{apy}} পর্যন্ত APY আয় করুন' (KuCoin bn uses the formal 'উপার্জন'. Bitget Wallet bn keeps 'Earn' in Latin script as a product name.) | উপার্জন |
| trigger price (limit orders) | ট্রিগার প্রাইস (Keep the loanword.) | উদ্দীপক মূল্য |
| expiry / expires (orders) | মেয়াদ / '{{time}} পরে মেয়াদ শেষ হবে' (Use 'মেয়াদ শেষ' for 'Expired'.) | সমাপ্তি |

### `de` — German

- Variant: German (Germany), de-DE. Use ß, not Swiss ss. The same text also serves users in Austria and Switzerland.
- Register: du (informal). Buttons use the infinitive, so the register shows only in sentences.
- Buttons use the infinitive with the object first: 'Wallet verbinden', 'Token auswählen', 'Swappen', 'Bridgen'. Do not use the imperative ('Starte', 'Tausche') on buttons.
- Use sentence case. Only nouns start with a capital letter: 'Transaktion fehlgeschlagen'. Do not put a period after a title or a status label.
- Join an English loanword and a German noun with a hyphen: 'Bridge-Gebühr', 'Swap-Details', 'Wallet-Adresse', 'Slippage-Toleranz'. Write 'Gas' compounds closed: 'Gaspreis', 'Gaslimit'.
- Use these genders: die Bridge, der Swap, das Gas, die Wallet, der Token (plural 'die Token'), die Slippage, die Chain, die DEX, der Stablecoin, der Airdrop, das Staking.
- Give loanword verbs German endings: 'bridgen', 'swappen', 'staken'; participles 'gebridgt', 'geswappt', 'gestakt'.
- Use German quotation marks „…“, a decimal comma, and a non-breaking space before % and units: '0,5 %'.

| English | Use | Do not use |
| --- | --- | --- |
| bridge (noun) | Bridge (die; Plural: die Bridges) (Use 'Bridge' for the protocol and for the transfer, for example 'Bridge erfolgreich' and 'Bridge-Gebühr'.) | Brücke |
| bridge (verb) | bridgen (Button: 'Bridgen'; Partizip: 'gebridgt') ('Überbrücken' means to fill a gap and reads like a machine translation. The current widget uses 'Tauschen und überbrücken'.) | überbrücken |
| swap (noun) | Swap (der; Plural: die Swaps) (Use 'Swap' in labels and status text, for example 'Swap erfolgreich' and 'Swap-Details'.) | Tausch, Tauschgeschäft |
| swap (verb) | swappen (Button: 'Swappen'; Partizip: 'geswappt') (Use 'Swappen' on the swap button. Keep 'Tauschen' only for the Exchange tab (id 5).) | tauschen, wechseln, umtauschen |
| exchange | Tauschen (Tab und Titel) (German crypto users read 'Exchange' and 'Börse' as a centralized exchange, so the tab for swaps and bridges uses 'Tauschen'.) | Exchange, Börse |
| cross-chain | Cross-Chain (in Komposita: 'Cross-Chain-Swap', 'Cross-Chain-Bridge') (Write it with hyphens inside compounds.) | kettenübergreifend, Kreuzkette |
| gas | Gas (das) (Keep 'Gas' as the fee unit and as the tab name.) | Benzin, Treibstoff, Kraftstoff |
| gas fee / network fee | Netzwerkgebühr (Plural: Netzwerkgebühren) (Use one label for the fee that the chain charges, and do not mix it with 'Gasgebühr' in the same flow.) | Netzgebühr, Transaktionssteuer |
| slippage | Slippage (die): 'Max. Slippage', 'Slippage-Toleranz' (Use the feminine article: 'die Slippage', 'hohe Slippage'.) | Schlupf, Preisabweichung, Ausführungskursabweichung |
| price impact | Preisauswirkung ('Hohe Preisauswirkung') (Use the singular in labels and warnings.) | Preiseinfluss, Preisbelastung |
| route | Route (die; Plural: Routen) (Use 'Route' when the UI compares paths: 'Keine Route gefunden', 'Routen vergleichen'.) | Weg, Pfad |
| quote | Angebot (Plural: Angebote): 'Neues Angebot anfordern' (Use 'Angebot' for the price of one route. Use 'Kurs' only for the exchange rate.) | Zitat, Notierung, Kostenvoranschlag |
| chain / blockchain | Chain (die; Plural: Chains); 'Blockchain' für die Technologie (Use 'Chain' in selectors and labels: 'Chain auswählen', 'Chain wechseln'.) | Kette |
| network (synonym of chain in wallet UIs) | Netzwerk (das; Plural: Netzwerke) (Use 'Netzwerk' only where a wallet asks the user to switch: 'Netzwerk wechseln'.) | Netz |
| from chain / to chain (source / destination) | Quell-Chain / Ziel-Chain; Feldlabels: 'Von' / 'Nach' (The current widget uses 'Zu' for 'To'. Use 'Nach'.) | Quellkette / Zielkette; 'Zu' als Feldlabel |
| token | Token (der; Plural: die Token; Genitiv: des Tokens) (Use the plural without -s, as Ledger Live DE and MetaMask Mobile DE do.) | Münze, Wertmarke |
| native token (ETH on Ethereum, SOL on Solana) | nativer Token ('der native Token der Chain') (Use it for the coin that pays gas, for example ETH or SOL.) | einheimischer Token, ursprünglicher Token |
| stablecoin | Stablecoin (der; Plural: Stablecoins) (Keep the English word.) | stabile Münze |
| wallet | Wallet (die; Plural: Wallets) (Use the feminine article: 'deine Wallet'.) | Brieftasche, Geldbörse |
| connect wallet / connect (button) | Wallet verbinden; kurz: 'Verbinden' (Use the same verb for the header button and for prompts.) | Wallet anschließen, koppeln |
| disconnect | Trennen ('Wallet trennen') (Use 'Trennen' for the wallet. 'Abmelden' means to log out of an account.) | Abmelden, Verbindung abbrechen |
| approve / token approval (ERC-20 allowance) | genehmigen (Button: '{{token}} genehmigen'); Nomen: 'Genehmigung'; Allowance: 'genehmigter Betrag' (The current widget uses 'Zulassung' and 'Erlaubnis'. Use 'Genehmigung' for every approval string.) | zulassen, Zulassung, Erlaubnis |
| sign / signature (wallet signature request) | signieren (Button: 'Signieren'); Nomen: 'Signatur'; 'Signaturanfrage' (Use 'signieren' for wallet prompts. 'unterschreiben' belongs to paper contracts.) | unterzeichnen, unterschreiben, Unterschrift |
| transaction | Transaktion (Plural: Transaktionen) ('Überweisung' means a bank transfer. The current widget uses 'Überweisungsbetrag'.) | Überweisung, Vorgang |
| transaction hash | Transaktions-Hash (der); kurz: 'Tx-Hash' (Keep 'Hash' in English.) | Transaktionsprüfsumme, Streuwert |
| pending / completed / failed / refunded (transaction status words) | Ausstehend / Abgeschlossen / Fehlgeschlagen / Zurückerstattet (Use these four words as status labels, with no period.) | Anhängig / Vollendet / Gescheitert / Rückvergütet |
| DEX | DEX (die; Plural: DEXs) (Use the feminine article, from 'die Börse'.) | dezentralisierter Austausch |
| aggregator | Aggregator (der; Plural: Aggregatoren) (Keep the loanword.) | Sammler, Bündler |
| liquidity | Liquidität (Use it for pool and route liquidity.) | Flüssigkeit |
| yield | Rendite (Use 'Rendite' for what a vault or staking position pays.) | Ertrag, Ausbeute, Ernte |
| APY | APY (Keep 'APY' in labels. MetaMask DE mixes three forms, which confuses users.) | effektiver Jahreszins, Effektivertrag |
| vault | Vault (der; Plural: Vaults) (Keep the DeFi term for Earn vaults.) | Tresor, Gewölbe |
| staking | Staking (das); Verb: 'staken' (Use 'staken' as the verb: 'ETH staken'.) | Einsetzen, Einsatz |
| deposit | Einzahlen (Button); Nomen: 'Einzahlung' (Pair it with 'Auszahlen' (id 35).) | Deponieren, Anzahlung |
| withdraw | Auszahlen (Button); Nomen: 'Auszahlung' (Use 'Auszahlen' so that it pairs with 'Einzahlen'.) | Zurückziehen, Widerrufen |
| limit order | Limit-Order (die; Plural: Limit-Orders); 'Limitpreis' (Use 'Limit-Order' for the order and 'Limitpreis' for its price.) | Begrenzungsauftrag, Grenzauftrag |
| TWAP order / scheduled order | TWAP-Order; scheduled: 'geplant' (Keep 'TWAP' as an acronym.) | Zeitgewichteter-Durchschnittspreis-Auftrag |
| market cap | Marktkapitalisierung (Use the full German word. All checked UIs do.) | Marktobergrenze, Market Cap |
| refuel / get gas | Gas erhalten (Button); Tabname: 'Gas' (Use 'Gas erhalten' for the action and keep 'Gas' as the tab name.) | Tanken, Auftanken |
| airdrop | Airdrop (der; Plural: Airdrops) (Keep the English word.) | Abwurf, Luftabwurf |
| points / XP | XP (unverändert); allgemein: 'Punkte' (Keep 'XP' for Jumper XP and use 'Punkte' for other points.) | Erfahrungspunkte |
| quest / mission | Mission (Plural: Missionen) (Jumper uses 'Missions', so use 'Mission' for every quest or mission.) | Quest, Aufgabe, Suche |
| rewards / claim (rewards) | Belohnungen; Button: 'Einfordern' (Use 'Einfordern' on the claim button.) | Ansprüche, Behaupten |
| portfolio | Portfolio (Keep the loanword.) | Mappe, Depot |
| balance | Guthaben (Use 'Guthaben' for the token balance in the wallet.) | Bilanz, Gleichgewicht |
| max (button that fills the full balance) | Max (Keep the button short and do not add a period.) | Maximum, Höchstbetrag |
| send / receive | Senden / Empfangen (Use these words for wallet transfers.) | Schicken / Bekommen |
| recipient / receiving address | Empfänger; 'Empfängeradresse' (Use 'Empfängeradresse' for the field that holds the address.) | Begünstigter, Adressat |
| minimum received | Mindestens erhalten (Use this label for the amount that the slippage limit protects.) | Empfangenes Minimum |
| fee (integrator fee, "Jumper fee") | Gebühr: 'Jumper-Gebühr', 'Integrator-Gebühr', 'Anbietergebühr' (Join the brand name and 'Gebühr' with a hyphen.) | Provision, Honorar, Entgelt |
| estimated time | Geschätzte Zeit (Use it as the label next to the time value.) | Voraussichtliche Ankunft, ETA |
| high value loss (warning when a route loses a lot of value) | Hoher Wertverlust (Keep the current title. It is clear German.) | Großer Wertschwund |
| on-ramp / buy with card | Mit Karte kaufen; Bereich: 'Krypto kaufen' (The current widget shows the English 'Buy'. Translate it.) | On-Ramp, Auffahrt, 'Buy' |
| leaderboard | Rangliste (Use 'Rangliste' because Jumper also shows a 'Rang' (rank).) | Anführertafel, Leaderboard |
| perks | Vorteile (Translate the feature as a common noun. Keep 'Perks' only in a fixed brand name.) | Perks, Vergünstigungen |
| earn (the product page where users earn yield) | Verdienen (Tab); Verb: 'verdienen' (Most German wallets translate the Earn tab, so use 'Verdienen'.) | Erwerben, Earn |
| trigger price (limit orders) | Auslösepreis (Use it for the price that starts a limit order.) | Triggerpreis, Abzugspreis |
| expiry / expires (orders) | Ablauf; 'Läuft ab in {{time}}'; 'Abgelaufen' (Use 'Läuft ab in' for a countdown and 'Abgelaufen' for the final status.) | Verfall, Erlöschen |

### `es` — Spanish

- Variant: Neutral Spanish for Latin America and Spain. Use words that both regions use: 'billetera', 'comisión', 'cantidad', 'retiro'. MetaMask ships only es-419 and Uniswap ships only es-ES, so this file takes the words that both share.
- Register: tú: imperatives such as 'Conecta' and 'Selecciona', and the possessive 'tu'. Never 'usted' or 'vosotros'.
- Write buttons as infinitives: 'Conectar billetera', 'Intercambiar', 'Aprobar'. Write instructions with the 'tú' imperative: 'Conecta tu billetera'.
- Use sentence case for labels and titles: 'Detalles de la transacción', not 'Detalles De La Transacción'.
- Start questions and exclamations with '¿' and '¡': '¿Quieres continuar?'.
- Give loanwords a fixed gender: 'el swap', 'el DEX', 'el gas', 'el staking', 'la stablecoin', 'la blockchain'. Do not add a plural ending to 'cross-chain'.
- Do not use words of one region only. Use 'cantidad', not 'monto' or 'importe'. Use 'comisión', not 'coste' or 'costo'.

| English | Use | Do not use |
| --- | --- | --- |
| bridge (noun) | puente (pl. puentes); tab and title: 'Puente'; status: 'Puente completado' (Use 'puente' for the protocol and the action, and keep 'Bridge' only inside protocol names such as 'Stargate Bridge'.) | Cruzar; Bridge (as a plain label) |
| bridge (verb) | puentear: 'Puentear', 'Puenteando 1 ETH', '1 ETH puenteado' (Do not write 'hacer un puente', because in Spain it also means a long holiday weekend.) | cruzar; hacer un puente |
| swap (noun) | swap (el swap, los swaps); tab and title: 'Swap'; status: 'Swap completado' (Keep 'Swap' as the tab name, as Binance and OKX do, because the Exchange page already uses 'Intercambio'.) | canje; permuta; Intercambio (as the Swap tab name) |
| swap (verb) | intercambiar: button 'Intercambiar'; sentence 'Intercambia ETH por USDC' (Do not use 'canjear', which means 'redeem' in Spain, or 'cambiar', which also means 'change a setting'.) | canjear; cambiar; swapear |
| exchange | title: 'Intercambio'; button: 'Intercambiar'; token pages: 'Intercambiar desde' / 'Intercambiar a' (Do not use 'exchange', because Spanish crypto users use it for a trading platform such as Binance.) | Exchange; Plataforma de intercambio; Cambiar |
| cross-chain | cross-chain (invariable adjective): 'swap cross-chain', 'transferencias cross-chain' (Put 'cross-chain' after the noun and do not add a plural ending.) | de cadena cruzada; intercadena; cross-chains |
| gas | gas (el gas) (Keep 'gas' in every string, as all Spanish sources do.) | gasolina; combustible |
| gas fee / network fee | comisión de gas; comisión de red (Use 'comisión' for every fee, because 'coste' is Spain-only and 'costo' is Latin American.) | coste de red; costo de red; honorarios |
| slippage | deslizamiento; 'Deslizamiento máx.'; 'tolerancia al deslizamiento' (Do not use 'descenso', a poor variant that appears in some Binance help pages.) | slippage; descenso |
| price impact | impacto en el precio (Use 'en el precio' in every string, although MetaMask writes 'sobre el precio'.) | efecto en el precio |
| route | ruta (pl. rutas); 'Mejor ruta' (Use 'ruta' for one path through bridges and DEXs.) | camino; trayecto |
| quote | cotización; 'Cantidad cotizada'; 'Mejor cotización' (Replace the current 'Monto citado' with 'Cantidad cotizada', because 'citar' means 'to cite'.) | cita; Monto citado |
| chain / blockchain | cadena (la cadena) for one chain: 'Seleccionar cadena'; blockchain (la blockchain) for the technology (Use 'cadena' when the English says 'chain' and 'red' when the English says 'network'.) | cadena de bloques |
| network (synonym of chain in wallet UIs) | red (pl. redes); 'Todas las redes'; 'Comisión de red' (Use 'red' for the network selector and for network fees.) | — |
| from chain / to chain (source / destination) | cadena de origen / cadena de destino; short labels: 'De' / 'A' (Replace the current 'cadena de recepción' with 'cadena de destino'.) | cadena de recepción; cadena receptora |
| token | token (pl. tokens) (Keep 'token' for a token and use 'cripto' only for crypto in general.) | ficha; moneda |
| native token (ETH on Ethereum, SOL on Solana) | token nativo; 'token nativo de la red' (Use 'token nativo' for the gas token of a chain, for example ETH on Ethereum.) | moneda propia; token original |
| stablecoin | stablecoin (la stablecoin, pl. stablecoins) (Use 'stablecoin', because crypto users rarely say the MetaMask form 'moneda estable'.) | moneda estable |
| wallet | billetera (pl. billeteras) (Do not use 'cartera', because it is Spain-only and also means 'portfolio'.) | cartera; monedero; wallet |
| connect wallet / connect (button) | 'Conectar billetera'; short button: 'Conectar' (Use 'billetera' in every string, because the current widget mixes 'billetera' and 'cartera'.) | Conectar cartera; Vincular |
| disconnect | 'Desconectar' (Use 'Desconectar', because disconnecting a wallet is not a log-out.) | Cerrar sesión |
| approve / token approval (ERC-20 allowance) | aprobar / aprobación; 'Aprobar gasto de {{token}}'; 'límite de gasto' (Use 'aprobar' for the allowance step and 'límite de gasto' for the approved amount.) | autorizar; permitir |
| sign / signature (wallet signature request) | firmar / firma; 'Solicitud de firma'; 'Firmar transacción' (Use 'firmar' for every wallet signature request.) | rubricar |
| transaction | transacción (pl. transacciones) (Do not use 'operación' for an on-chain transaction, because it means a trade.) | operación (for an on-chain transaction) |
| transaction hash | hash de la transacción (Keep 'hash', because users see this word in block explorers.) | resumen de la transacción; ID de transacción |
| pending / completed / failed / refunded (transaction status words) | Pendiente / Completado / Fallido / Reembolsado (Make the adjective agree with the noun: 'Transacción fallida', 'Swap completado'.) | Ha fallado; Fondos recibidos (for 'completed') |
| DEX | DEX (el DEX, pl. los DEX) (Keep the acronym and explain it as 'exchange descentralizado (DEX)' only in help text.) | intercambio descentralizado |
| aggregator | agregador; 'agregador de liquidez' (Use 'agregador' for a service that compares routes from many protocols.) | acumulador; recopilador |
| liquidity | liquidez (Use 'liquidez', as all sources do.) | — |
| yield | rendimiento (pl. rendimientos) (Use 'rendimiento' for the noun and 'ganar' for the verb.) | cosecha; rinde |
| APY | APY (Keep 'APY', because 'TAE' is a Spanish bank term that Latin American users do not know.) | TAE; RPA |
| vault | bóveda (la bóveda) (Use 'bóveda' as Uniswap does, but keep the protocol name when the vault has one.) | caja fuerte; cofre |
| staking | staking (el staking); 'Hacer staking'; 'Con staking' (Do not use 'apuesta', because 'apostar' means 'to bet'.) | apuesta; participación |
| deposit | depositar / depósito (Use 'depositar' on the button and 'depósito' for the noun.) | ingresar; abonar |
| withdraw | retirar / retiro (Use 'retirar' on the button and 'retiro' for the noun.) | reintegro; sacar |
| limit order | orden límite (pl. órdenes límite); 'Precio límite' (Use 'orden', because 'pedido' means a purchase order in a shop.) | pedido límite; orden limitada |
| TWAP order / scheduled order | orden TWAP; orden programada (Keep the acronym 'TWAP' and use 'orden' as for limit orders.) | pedido programado |
| market cap | capitalización de mercado (Do not use 'bursátil', because it refers to the stock market.) | capitalización bursátil |
| refuel / get gas | 'Obtener gas'; 'Obtener gas en {{chain}}' (Keep 'gas' from term 7 and do not use car words such as 'repostar'.) | Repostar; Recargar combustible |
| airdrop | airdrop (el airdrop, pl. airdrops) (Keep 'airdrop', as all sources do.) | lanzamiento aéreo; regalo de tokens |
| points / XP | puntos; XP (Use 'puntos' for points and keep 'XP' as it is.) | — |
| quest / mission | misión (pl. misiones) (Use 'misión' for every quest, because 'búsqueda' means 'search'.) | búsqueda; quest |
| rewards / claim (rewards) | recompensas; button: 'Reclamar'; 'Reclamar recompensas' (Use 'Reclamar' on the claim button, as MetaMask and Uniswap do.) | premios; Cobrar; Reivindicar |
| portfolio | Portfolio (page name); 'tu portfolio' in sentences (Keep 'Portfolio', because 'cartera' is Spain-only and also means 'wallet'.) | Cartera; Portafolio |
| balance | saldo; 'Saldo total' (Use 'saldo', because 'balance' means an accounting statement in Spanish.) | balance |
| max (button that fills the full balance) | Máx. (Use the short form with a period, as wallets do.) | MÁXIMO; Todo |
| send / receive | Enviar / Recibir (Use 'Enviar' and 'Recibir' on buttons and in amount fields.) | Mandar / Obtener |
| recipient / receiving address | destinatario; 'dirección del destinatario' (Use 'destinatario' for the person and 'dirección del destinatario' for the address field.) | receptor; beneficiario |
| minimum received | Mínimo recibido (Write 'Mínimo' in full, with the accent.) | Min. recibido; Cantidad mínima obtenida |
| fee (integrator fee, "Jumper fee") | comisión; 'Comisión de Jumper'; 'Comisión del integrador'; 'Comisión del proveedor' (Use 'comisión' for every fee and replace the current 'Honorarios del proveedor'.) | honorarios; tarifa; cargo |
| estimated time | Tiempo estimado (Use 'Tiempo estimado', because 'Hora estimada' means a clock time, not a duration.) | Hora estimada |
| high value loss (warning when a route loses a lot of value) | Pérdida de valor alta (Put the adjective after 'valor', because 'Pérdida de alto valor' reads as 'loss of a valuable item'.) | Pérdida de alto valor |
| on-ramp / buy with card | 'Comprar con tarjeta'; 'Comprar cripto' (Name the action, because users do not know the word 'on-ramp'.) | rampa de entrada; on-ramp |
| leaderboard | Clasificación (Use 'Clasificación', as MetaMask does for its leaderboard tab.) | Tablero de líderes; Leaderboard |
| perks | beneficios (Use 'beneficios' for partner perks and 'Reclamar beneficio' for the claim action.) | privilegios; gajes |
| earn (the product page where users earn yield) | Earn (page and product name); verb in sentences: 'ganar' (Keep 'Earn' as the page name and use 'ganar' only inside sentences.) | Ganar (as the page title); Ganancias |
| trigger price (limit orders) | precio de activación (Use 'precio de activación', as MetaMask does for orders.) | precio de disparo; precio gatillo |
| expiry / expires (orders) | vencimiento; 'Vence en {{duration}}'; 'Orden vencida' (Use 'vencimiento' for the label and 'Vence en' for the countdown, as Uniswap does.) | expiración; caducidad |

### `fr` — French

- Variant: French (France), fr-FR. Use French typography with spaces before high punctuation. The same text serves Belgium and Switzerland; do not adapt it for fr-CA.
- Register: vous. Buttons use the infinitive, so the register shows only in sentences.
- Buttons use the infinitive: 'Connecter un wallet', 'Échanger', 'Transférer', 'Approuver'. Sentences use vous with the imperative: 'Connectez un wallet pour continuer.'
- Use sentence case. Do not copy English title case: 'Missions disponibles', not 'Missions Disponibles' (current site).
- Put a narrow no-break space (U+202F) before : ; ! ? and %: '0,5 %', 'Solde : 12'. Use « » with no-break spaces inside.
- Loanwords are masculine and take a plural -s: le bridge / les bridges, le swap / les swaps, le token / les tokens, le wallet / les wallets, le slippage, l’airdrop, le staking, le vault.
- Do not use the anglicized verbs 'swapper' and 'bridger' on buttons. Use 'Échanger' (swap) and 'Transférer' (bridge).
- Use a decimal comma and a no-break space as the thousands separator: '1 234,56'.

| English | Use | Do not use |
| --- | --- | --- |
| bridge (noun) | bridge (m.) ; pl. bridges (Use 'bridge' for the protocol and the transfer: 'Bridge réussi', 'Frais du bridge'.) | pont, passerelle |
| bridge (verb) | transférer (bouton : 'Transférer') ; 'Lancer le bridge' pour 'Start bridging' (French has no standard verb for 'to bridge'. 'bridger' is fine in marketing text only.) | ponter, établir une passerelle, bridger (sur un bouton) |
| swap (noun) | swap (m.) ; pl. swaps (Use 'swap' in labels and status text: 'Swap réussi', 'Échec du swap'.) | permutation, échange (pour le nom) |
| swap (verb) | échanger (bouton : 'Échanger') (Use 'Échanger' on the swap button, as Uniswap and MetaMask do.) | swapper (sur un bouton), permuter |
| exchange | Échanger (onglet et titre) (French users read 'plateforme d’échange' and 'exchange' as a centralized exchange, so the tab uses the verb 'Échanger'.) | Exchange, Bourse, Plateforme d’échange |
| cross-chain | cross-chain (invariable) : 'swap cross-chain', 'bridge cross-chain' (Write it with a hyphen and no plural mark.) | inter-chaînes, chaîne croisée |
| gas | gaz (m.) (Use 'gaz' as the unit and the tab name. Uniswap FR and Rabby FR write 'gas', so keep one spelling everywhere.) | carburant, essence |
| gas fee / network fee | frais de réseau (m. pl.) (Use 'Frais de réseau' as the fee label. 'frais' is always plural.) | frais de gaz (comme libellé), redevance réseau |
| slippage | slippage (m.) : 'Slippage max.', 'tolérance de slippage' (The current widget uses 'effet de glissement'. Replace it with 'slippage'.) | effet de glissement, glissement |
| price impact | impact sur le prix (Use the singular 'le prix'.) | impact des prix, incidence sur le prix |
| route | route (f.) ; pl. routes (The current widget mixes 'itinéraire' and 'routes'. Use 'route' only.) | itinéraire, voie, chemin |
| quote | cotation (f.) : 'Obtenir une nouvelle cotation' ('Devis' is the price of a service. The current widget uses it, so replace it.) | devis, citation, offre |
| chain / blockchain | chaîne (f.) ; 'blockchain' (f.) pour la technologie (Use 'chaîne' in selectors: 'Sélectionner la chaîne', 'Changer de chaîne'.) | chaîne de blocs, maillon |
| network (synonym of chain in wallet UIs) | réseau (m.) (Use 'réseau' where a wallet asks the user to switch: 'Changer de réseau'.) | filet, toile |
| from chain / to chain (source / destination) | chaîne source / chaîne de destination ; libellés : 'De' / 'Vers' (The current widget uses 'À' for 'To'. 'Vers' reads better as a field label.) | chaîne d’origine, chaîne cible ; 'À' comme libellé |
| token | token (m.) ; pl. tokens (The current widget mixes 'jetons' and 'tokens'. Use 'token' only.) | jeton |
| native token (ETH on Ethereum, SOL on Solana) | token natif (Use it for the coin that pays gas, for example ETH or SOL.) | jeton natif, token indigène |
| stablecoin | stablecoin (m.) ; pl. stablecoins (Keep the English word.) | pièce stable, cryptomonnaie stable |
| wallet | wallet (m.) ; pl. wallets (Uniswap FR and Ledger Live FR use 'wallet' and keep 'portefeuille' for the portfolio.) | portefeuille (réservé à 'portfolio', id 44) |
| connect wallet / connect (button) | Connecter un wallet ; court : 'Connecter' ('Se connecter' means to log in, so do not use it on the wallet button.) | Se connecter, Brancher |
| disconnect | Déconnecter (Use the non-reflexive verb for the wallet.) | Débrancher, Se déconnecter |
| approve / token approval (ERC-20 allowance) | Approuver (bouton) ; 'approbation' (nom) ; allowance : 'plafond de dépenses' (The current widget uses 'allocation' for allowance. Use 'plafond de dépenses'.) | valider, allocation, provision |
| sign / signature (wallet signature request) | Signer ; 'signature' ; 'demande de signature' (Use 'Signer' on the wallet prompt button.) | parapher, soussigner |
| transaction | transaction (f.) ('Virement' means a bank transfer.) | virement, opération |
| transaction hash | hash de transaction (m.) ('Hachage' is the formal word and reads foreign to crypto users.) | hachage de transaction |
| pending / completed / failed / refunded (transaction status words) | En attente / Terminé / Échec / Remboursé ('Complété' is an anglicism in the current widget. Use 'Terminé'.) | Pendant / Complété / Raté |
| DEX | DEX (m.) : 'un DEX', pl. 'les DEX' (Keep the acronym. Use 'plateforme d’échange décentralisée' only in long explanations.) | échange décentralisé |
| aggregator | agrégateur (m.) (Spell it with one 'g' before 'r'.) | aggrégateur |
| liquidity | liquidité (f.) (Use the singular in labels: 'Liquidité faible'.) | liquide |
| yield | rendement (m.) (Use 'rendement' for what a vault or staking position pays.) | récolte, yield |
| APY | APY (Keep 'APY'. MetaMask FR mixes 'TRA', 'RMP' and 'TAEG', which confuses users.) | TRA, RMP, TAEG |
| vault | vault (m.) ; pl. vaults (Keep the DeFi term for Earn vaults.) | coffre-fort, chambre forte |
| staking | staking (m.) ; verbe : 'staker' (Use 'staker' as the verb: 'Staker des ETH'.) | jalonnement, mise en jeu |
| deposit | Déposer (bouton) ; 'dépôt' (nom) (Pair it with 'Retirer' (id 35).) | verser, consigner |
| withdraw | Retirer (bouton) ; 'retrait' (nom) (Pair it with 'Déposer'.) | prélever, se retirer |
| limit order | ordre limite (m.) ; 'prix limite' (Uniswap FR writes 'ordre à cours limité', which is correct but too long for buttons.) | commande limite, ordre à limite |
| TWAP order / scheduled order | ordre TWAP ; scheduled : 'programmé' (Keep 'TWAP' as an acronym.) | ordre à prix moyen pondéré dans le temps |
| market cap | capitalisation boursière (Use the full term. Abbreviate to 'cap. boursière' only when space is short.) | plafond de marché, market cap |
| refuel / get gas | Obtenir du gaz (bouton) ; onglet : 'Gaz' (Use the same spelling as id 7.) | Ravitailler, Faire le plein |
| airdrop | airdrop (m.) (Keep the English word.) | largage, distribution gratuite |
| points / XP | XP (m.) ; ailleurs : 'points' (Keep 'XP' for Jumper XP: 'l’XP', '{{xp}} XP gagnés'.) | points d’expérience |
| quest / mission | mission (f.) (Jumper uses 'Missions', so use 'mission' for every quest or mission.) | quête, tâche |
| rewards / claim (rewards) | récompenses ; bouton : 'Réclamer' (Use 'Réclamer' on the claim button.) | Revendiquer, Demander |
| portfolio | portefeuille (m.) (Use 'portefeuille' for the portfolio. This is why the crypto wallet stays 'wallet' (id 19).) | portfolio |
| balance | solde (m.) (Use 'Solde' for the token balance.) | balance, bilan |
| max (button that fills the full balance) | Max (Keep the button short.) | Maximum |
| send / receive | Envoyer / Recevoir (Use these verbs for wallet transfers.) | Expédier / Obtenir |
| recipient / receiving address | destinataire (m.) ; 'adresse du destinataire' ('Bénéficiaire' sounds like a bank transfer.) | bénéficiaire |
| minimum received | Minimum reçu (Use this label for the amount that the slippage limit protects.) | Reçu minimum |
| fee (integrator fee, "Jumper fee") | frais (m. pl.) : 'Frais Jumper', 'Frais d’intégrateur', 'Frais du fournisseur' ('Frais' is always plural.) | commission, honoraires, tarif |
| estimated time | Temps estimé (Use it as the label next to the time value.) | Heure estimée, ETA |
| high value loss (warning when a route loses a lot of value) | Perte de valeur élevée (Keep the current title. It is clear French.) | Haute perte de valeur |
| on-ramp / buy with card | Acheter par carte ; section : 'Acheter des cryptos' (Use 'Acheter' on the button and keep 'onramp' out of labels.) | rampe d’accès, onramp (dans un libellé) |
| leaderboard | Classement (Use 'Classement' for the XP leaderboard.) | Tableau des leaders |
| perks | avantages (m. pl.) (Translate the feature as a common noun. Keep 'Perks' only in a fixed brand name.) | perks, bonus |
| earn (the product page where users earn yield) | Gagner (onglet) ; verbe : 'gagner' (Most French wallets translate the Earn tab. Uniswap FR is the exception and keeps 'Earn'.) | Earn, Mériter |
| trigger price (limit orders) | prix de déclenchement (Use it for the price that starts a limit order.) | prix gâchette, prix déclencheur |
| expiry / expires (orders) | expiration (f.) ; 'Expire dans {{time}}' ; 'Expiré' (Use 'Expire dans' for a countdown and 'Expiré' for the final status.) | échéance, péremption |

### `hi` — Hindi

- Variant: Hindi (India), Devanagari script. Crypto Hindi is Hinglish written in Devanagari: crypto terms are transliterated, not translated. Indian exchanges (CoinDCX, WazirX) ship English UIs, so MetaMask hi is the main Hindi wallet UI.
- Register: आप
- Transliterate crypto terms into Devanagari: ब्रिज, स्वैप, गैस, स्लिपेज, टोकन, वॉलेट. Do not use formal Sanskrit-based words such as सेतु or उद्धरण. Use 'विनिमय' only in 'विनिमय दर' (exchange rate).
- Keep Latin script for brand names, tickers and acronyms: Jumper, LI.FI, ETH, USDC, DEX, APY, XP, TWAP.
- Write a crypto action as the loanword + 'करें': 'स्वैप करें', 'ब्रिज करें', 'कनेक्ट करें'. Use a native polite verb for common actions: 'भेजें', 'खरीदें', 'निकालें'.
- Write loanwords with the nukta and use one spelling only: फ़ीस, डिपॉज़िट, ट्रांज़ैक्शन, रिफ़ंड.
- End a full sentence with '।'. Do not put an end mark on a button or a label.
- Remove the machine-translation artifacts in the widget hi.json, for example 'कुंजी: बटन.' and translated placeholders such as '{{मूल्य, संख्या(...)}}'.

| English | Use | Do not use |
| --- | --- | --- |
| bridge (noun) | ब्रिज (ethereum.org hi uses 'सेतु', but wallet UIs and crypto media use 'ब्रिज'.) | सेतु; पुल |
| bridge (verb) | ब्रिज करें (infinitive: ब्रिज करना) (Use 'ब्रिज करें' on the button and 'फिर से ब्रिज करें' for 'Bridge again'.) | पुल बनाएं |
| swap (noun) | स्वैप (The widget hi.json uses 'विनिमय'. This is a dictionary word that crypto users do not use.) | विनिमय; अदला-बदली |
| swap (verb) | स्वैप करें (infinitive: स्वैप करना) (Use 'X को Y में स्वैप करें' for 'Swap X to Y'.) | विनिमय करें |
| exchange | एक्सचेंज (Exchange tab and header title) (Keep the tab different from 'स्वैप'. Use 'विनिमय दर' for exchange rate. Use 'एक्सचेंज कनेक्ट करें' for 'Connect exchange' (a centralized exchange). The DEX list follows term 27.) | स्वैप (for the tab) |
| cross-chain | क्रॉस-चेन (ethereum.org hi uses the literal 'चेन के पार'. Crypto media use 'क्रॉस-चेन'.) | चेन के पार; अंतर-श्रृंखला |
| gas | गैस (The widget hi.json misspells it as 'गेस'.) | गेस; ईंधन |
| gas fee / network fee | गैस फ़ीस (gas fee); नेटवर्क फ़ीस (network fee) (Follow the English source. MetaMask writes 'फीस' and 'फ़ीस'; use 'फ़ीस' only.) | ईंधन शुल्क |
| slippage | स्लिपेज (label: 'अधिकतम स्लिपेज') (MetaMask adds '(slippage)' after the word. Jumper does not need the Latin form.) | फिसलन |
| price impact | प्राइस इम्पैक्ट (warning: 'हाई प्राइस इम्पैक्ट') (MetaMask titles use 'कीमत का प्रभाव', which reads as 'effect of the price'. Its warnings use 'प्राइस इम्पैक्ट'.) | कीमत का प्रभाव; मूल्य प्रभाव |
| route | रूट (label: 'रूट प्राथमिकता') (The widget hi.json uses 'मार्ग', which means a road. Use the loanword.) | मार्ग |
| quote | कोटेशन ('उद्धरण' means a literary quotation. MetaMask uses 'कोटेशन' most often; do not mix it with 'कोट' or 'क्वोट'.) | उद्धरण; क्वोट |
| chain / blockchain | चेन; ब्लॉकचेन (The widget hi.json has 'चैन चुने'. 'चैन' means peace or calm.) | चैन; श्रृंखला |
| network (synonym of chain in wallet UIs) | नेटवर्क (Use 'नेटवर्क' where the English says network.) | जाल |
| from chain / to chain (source / destination) | सोर्स चेन / डेस्टिनेशन चेन (MetaMask hi mixes 'डेस्टिनेशन' and 'गंतव्य'. Use 'डेस्टिनेशन' only.) | गंतव्य श्रृंखला |
| token | टोकन (Use 'टोकन' for both one token and many tokens.) | प्रतीक |
| native token (ETH on Ethereum, SOL on Solana) | मूल टोकन (MetaMask hi uses 'मूल टोकन'. 'नेटिव टोकन' is also understood, but do not mix the two.) | देशी टोकन |
| stablecoin | स्टेबलकॉइन (Use 'स्टेबलकॉइन्स' for the plural.) | स्थिर सिक्का |
| wallet | वॉलेट ('बटुआ' means a leather purse.) | बटुआ |
| connect wallet / connect (button) | वॉलेट कनेक्ट करें / कनेक्ट करें (The widget hi.json has 'वॉलेट से जुड़ें?' with a question mark. A button is an instruction, not a question.) | वॉलेट से जुड़ें?; संपर्क करें |
| disconnect | डिसकनेक्ट करें (The widget hi.json has 'संपर्क तोड़ें', which means to cut off contact with a person.) | संपर्क तोड़ें |
| approve / token approval (ERC-20 allowance) | एप्रूव करें / टोकन एप्रूवल (MetaMask mobile uses 'स्वीकृति दें', but the extension uses 'एप्रूव करें' in most strings.) | अनुमोदित करें; स्वीकृति दें |
| sign / signature (wallet signature request) | हस्ताक्षर करें / हस्ताक्षर ('साइन इन' means log in. MetaMask hi also writes 'सिग्नेचर' in risk labels; use 'हस्ताक्षर' only.) | साइन इन करें |
| transaction | ट्रांज़ैक्शन (MetaMask spells it 'ट्रांसेक्शन' and Hindi media spell it 'ट्रांजैक्शन'. Use one spelling with the nukta.) | संव्यवहार |
| transaction hash | ट्रांज़ैक्शन हैश (Keep 'हैश' as a loanword.) | लेन-देन संख्या |
| pending / completed / failed / refunded (transaction status words) | पेंडिंग / पूरा हुआ / विफल / रिफ़ंड हुआ ('विचाराधीन' means 'under legal consideration'. Use short status words on status pills.) | विचाराधीन; बाकी |
| DEX | DEX (long form: 'विकेंद्रीकृत एक्सचेंज (DEX)') (Keep the acronym in Latin script.) | डेक्स |
| aggregator | एग्रीगेटर (Use 'लिक्विडिटी एग्रीगेटर' for liquidity aggregator.) | समूहक |
| liquidity | लिक्विडिटी (MetaMask hi uses 'चलनिधि' once, but 'लिक्विडिटी' in most strings.) | चलनिधि; तरलता |
| yield | यील्ड ('उपज' means a crop yield.) | उपज |
| APY | APY (Keep the acronym in Latin script.) | वार्षिक प्रतिशत उपज |
| vault | वॉल्ट (Keep the protocol name in Latin script: 'Morpho वॉल्ट'.) | तिजोरी |
| staking | स्टेकिंग / स्टेक करें ('दांव' means a bet.) | दांव लगाना |
| deposit | डिपॉज़िट करें / डिपॉज़िट ('निक्षेप' is formal banking Hindi.) | निक्षेप |
| withdraw | निकालें ('आहरण' is formal banking Hindi.) | आहरण करें |
| limit order | लिमिट ऑर्डर ('आदेश' means a command.) | सीमा आदेश |
| TWAP order / scheduled order | TWAP ऑर्डर / शेड्यूल्ड ऑर्डर (Keep 'TWAP' in Latin script.) | समयबद्ध आदेश |
| market cap | मार्केट कैप (Use the same term in token details and in sort options.) | बाज़ार पूंजीकरण |
| refuel / get gas | गैस पाएं, e.g. '{{chain}} पर गैस पाएं' (The widget hi.json has 'गेस शुल्क ले', which has a spelling error and the wrong verb form.) | गेस शुल्क ले |
| airdrop | एयरड्रॉप (Keep the loanword.) | हवाई वितरण |
| points / XP | पॉइंट्स / XP ('अंक' means school marks. Keep 'XP' in Latin script.) | अंक |
| quest / mission | मिशन ('खोज' means search.) | खोज; अभियान |
| rewards / claim (rewards) | रिवॉर्ड्स / क्लेम करें ('दावा' is a legal claim. MetaMask mobile uses 'पुरस्कार' for its Rewards tab, but 'रिवॉर्ड' elsewhere.) | दावा करें; पुरस्कार |
| portfolio | पोर्टफ़ोलियो (MetaMask mobile keeps its product name 'Portfolio' in Latin. Jumper Portfolio is a page, so transliterate it.) | संविभाग |
| balance | बैलेंस ('संतुलन' means equilibrium.) | संतुलन |
| max (button that fills the full balance) | मैक्स (Use 'अधिकतम' only inside labels such as 'अधिकतम स्लिपेज'.) | अधिकतम (on the button) |
| send / receive | भेजें / प्राप्त करें (Use 'आपको मिलेगा' for 'You get' in the swap form.) | प्रेषित करें |
| recipient / receiving address | प्राप्तकर्ता / प्राप्तकर्ता का एड्रेस (MetaMask uses 'एड्रेस' for a wallet address. 'पता' means a postal address.) | प्राप्तकर्ता का पता |
| minimum received | न्यूनतम प्राप्त राशि (MetaMask uses the past tense, which reads like a finished event. The label shows a guaranteed amount.) | न्यूनतम प्राप्त किया गया |
| fee (integrator fee, "Jumper fee") | फ़ीस, e.g. 'Jumper फ़ीस', 'इंटीग्रेटर फ़ीस' (Keep the product name in Latin script.) | प्रभार |
| estimated time | अनुमानित समय (Use '~{{time}}' in a compact route card.) | — |
| high value loss (warning when a route loses a lot of value) | वैल्यू का भारी नुकसान (The literal form reads as 'high price loss'.) | उच्च मूल्य हानि |
| on-ramp / buy with card | कार्ड से खरीदें / क्रिप्टो खरीदें (Do not show the term 'on-ramp' to users.) | ऑन-रैंप |
| leaderboard | लीडरबोर्ड (Keep the loanword.) | अग्रणी तालिका |
| perks | पर्क्स ('भत्ते' means salary allowances. MetaMask uses 'फ़ायदे' for 'Benefits', which is a different concept.) | भत्ते |
| earn (the product page where users earn yield) | कमाएं (page name and verb), e.g. '{{apy}} APY तक कमाएं' (Use 'XP कमाएं' for 'Earn XP'.) | उपार्जन |
| trigger price (limit orders) | ट्रिगर प्राइस (Keep the loanword.) | उत्प्रेरक मूल्य |
| expiry / expires (orders) | एक्सपायरी / '{{time}} में एक्सपायर होगा' (MetaMask mobile also uses 'समाप्त होता है'. Use 'एक्सपायर' only.) | मियाद |

### `id` — Indonesian

- Variant: Indonesian (Indonesia), Bahasa Indonesia. Global wallets and local exchanges keep most crypto terms in English: swap, bridge, slippage, gas, chain, staking. Use standard spelling from KBBI for Indonesian words, for example 'kedaluwarsa'.
- Register: Anda. Write pronoun-free UI text where the sentence works without a pronoun. Never 'kamu' or '-mu'.
- Write buttons as the base verb without 'me-': 'Hubungkan', 'Setujui', 'Kirim', 'Tanda tangani'.
- Do not add an English plural '-s' to loanwords: 'Semua token', not 'Semua tokens'.
- Join Indonesian affixes to English verbs with a hyphen: 'di-bridge', 'di-stake', 'di-swap'. In longer text, use 'melakukan' + noun: 'melakukan swap'.
- Use sentence case for labels and titles: 'Rincian transaksi', not 'Rincian Transaksi'.
- Put the modifier after the head noun: 'biaya jaringan', 'chain tujuan', 'harga limit'. Do not copy the English word order.

| English | Use | Do not use |
| --- | --- | --- |
| bridge (noun) | bridge; tab and title: 'Bridge'; status: 'Bridge selesai' (Keep 'bridge', because 'jembatan' is the dictionary word for a road bridge.) | jembatan |
| bridge (verb) | bridge: button 'Bridge'; 'melakukan bridge'; passive 'di-bridge'; 'Bridge ke {{chain}}' (Use 'melakukan bridge' in sentences and 'di-bridge' for the passive, because 'menjembatani' means 'to mediate'.) | menjembatani; mem-bridge |
| swap (noun) | swap; tab and title: 'Swap'; status: 'Swap berhasil' (Keep 'Swap' as the tab name, because the Exchange page uses 'Tukar'.) | pertukaran; penukaran |
| swap (verb) | swap: button 'Swap'; 'melakukan swap'; passive 'di-swap' (Use 'melakukan swap' in sentences and keep 'tukar' for the Exchange page.) | bertukar; menukarkan (for the Swap action) |
| exchange | title and button: 'Tukar'; token pages: 'Tukar dari' / 'Tukar ke' (Do not use 'Bursa', because it means a trading platform such as Indodax.) | Bursa; Pertukaran; Exchange |
| cross-chain | cross-chain: 'swap cross-chain', 'transfer cross-chain' (Put 'cross-chain' after the noun, as OKX, Pintu and Binance do.) | rantai silang; lintas rantai |
| gas | gas (Keep 'gas' in every string, as all Indonesian sources do.) | bensin; bahan bakar |
| gas fee / network fee | biaya gas; biaya jaringan (Put 'biaya' first: 'biaya gas', 'biaya jaringan'.) | ongkos jaringan; gas fee |
| slippage | slippage; 'Slippage maks.'; 'toleransi slippage' (Keep 'slippage' and replace the MetaMask form 'Selip' and the current 'Slip'.) | selip; slip; Slip maksimum |
| price impact | dampak harga (Use the short form 'Dampak harga', as MetaMask and Uniswap do.) | dampak terhadap harga; efek harga |
| route | rute; 'Rute terbaik' (Use 'rute' for one path through bridges and DEXs.) | jalur; rute perjalanan |
| quote | kuotasi; 'Jumlah kuotasi'; 'Kuotasi terbaik' (Use 'kuotasi', because 'kutipan' means a citation.) | kutipan; Jumlah yang dikutip |
| chain / blockchain | chain: 'Pilih chain'; blockchain for the technology (Use 'chain' when the English says 'chain' and 'jaringan' when the English says 'network'.) | rantai |
| network (synonym of chain in wallet UIs) | jaringan; 'Semua jaringan' (Use 'jaringan' for the network selector and network fees.) | network; net |
| from chain / to chain (source / destination) | chain sumber / chain tujuan; short labels: 'Dari' / 'Ke' (Use 'chain sumber' and 'chain tujuan', as MetaMask, OKX and Binance do.) | chain asal; jaringan penerima |
| token | token (no plural '-s') (Do not add a plural ending: write 'Semua token' and 'Token saya'.) | tokens; koin (for a token) |
| native token (ETH on Ethereum, SOL on Solana) | token native; 'token native {{chain}}' (Use 'token native', because the MetaMask form 'token asli' can read as 'genuine token'.) | token asli |
| stablecoin | stablecoin (Keep 'stablecoin', as MetaMask and Uniswap do.) | koin stabil; mata uang stabil |
| wallet | dompet (Keep 'Wallet' only inside product names such as 'OKX Wallet'.) | wallet (as a plain label); tas uang |
| connect wallet / connect (button) | 'Hubungkan dompet'; short button: 'Hubungkan' (Use 'Hubungkan', as MetaMask and Uniswap do.) | Sambungkan dompet; Koneksikan |
| disconnect | 'Putuskan koneksi' (Use 'Putuskan koneksi', because disconnecting a wallet is not a log-out.) | Keluar; Lepas |
| approve / token approval (ERC-20 allowance) | setujui / persetujuan; 'Setujui penggunaan {{token}}'; 'batas penggunaan' (Do not use 'pengeluaran', because it means household spending.) | Menyetujui pengeluaran; izinkan |
| sign / signature (wallet signature request) | tanda tangani / tanda tangan; 'Permintaan tanda tangan'; 'Tanda tangani transaksi' (Replace the current 'Mempersiapkan' ('preparing') with 'Tanda tangani' in the sign step.) | Mempersiapkan; teken |
| transaction | transaksi (Use 'transaksi', as every Indonesian source does.) | operasi; transaction |
| transaction hash | hash transaksi (Keep 'hash', because users see this word in block explorers.) | ringkasan transaksi; ID transaksi |
| pending / completed / failed / refunded (transaction status words) | Menunggu / Selesai / Gagal / Dana dikembalikan (Use 'Menunggu' for pending, because 'Tertunda' also means 'delayed'.) | Tertunda; Berakhir (for failed) |
| DEX | DEX (Keep the acronym and explain it as 'bursa terdesentralisasi (DEX)' only in help text.) | bursa terdesentralisasi (as a label) |
| aggregator | agregator; 'agregator likuiditas' (Use 'agregator', as MetaMask and Uniswap do.) | pengumpul; penghimpun |
| liquidity | likuiditas (Use 'likuiditas', as all sources do.) | — |
| yield | imbal hasil (Use 'imbal hasil', the standard Indonesian finance term that Uniswap uses.) | hasil panen; yield |
| APY | APY (Keep the acronym 'APY', as Uniswap does.) | bunga tahunan; persentase hasil tahunan |
| vault | vault (Keep 'vault' as Uniswap does, and keep the protocol name when the vault has one.) | brankas; lemari besi |
| staking | staking; 'melakukan staking'; passive 'di-stake' (Do not use 'taruhan', because it means 'a bet'.) | taruhan; pertaruhan |
| deposit | deposit; 'Deposit selesai' (Use 'deposit' in every string, because 'deposito' means a bank time deposit.) | deposito; setoran (mixed with deposit) |
| withdraw | tarik / penarikan (Use 'tarik' on the button and 'penarikan' for the noun.) | ambil; cairkan |
| limit order | limit order; 'Harga limit' (Keep 'limit order', as Binance and Uniswap do.) | pesanan batas; order terbatas |
| TWAP order / scheduled order | TWAP order; order terjadwal (Use 'order' as in 'limit order', because 'pesanan' means a shop order.) | pesanan terjadwal |
| market cap | kapitalisasi pasar (Use the full form 'kapitalisasi pasar', as Uniswap does.) | kap pasar; modal pasar |
| refuel / get gas | 'Dapatkan gas'; 'Dapatkan gas di {{chain}}' (Keep 'gas' from term 7.) | Isi bensin; Isi ulang bahan bakar |
| airdrop | airdrop (Keep 'airdrop', as all sources do.) | pembagian gratis; hadiah udara |
| points / XP | poin; XP (Use 'poin', because 'titik' means a dot.) | titik; nilai |
| quest / mission | misi (Use 'misi' for every quest and mission.) | pencarian; quest |
| rewards / claim (rewards) | reward; button: 'Klaim'; 'Klaim reward' (Use 'reward', because 'hadiah' reads as 'gift' or 'prize'.) | hadiah; ambil |
| portfolio | portofolio (Use the KBBI spelling 'portofolio', as Uniswap does.) | portfolio; portopolio |
| balance | saldo; 'Total saldo' (Use 'saldo', because 'keseimbangan' means physical balance.) | keseimbangan; neraca |
| max (button that fills the full balance) | Maks (Use the short form on the button.) | MAKSIMUM; Semua |
| send / receive | Kirim / Terima (Use the base verb on buttons and 'Mengirim' or 'Menerima' only in progress text.) | Mengirim / Menerima (on buttons) |
| recipient / receiving address | penerima; 'alamat penerima' (Use 'penerima' for the person and 'alamat penerima' for the address field.) | resipien; tujuan (for a person) |
| minimum received | Minimum diterima (Use 'Minimum diterima' and remove the typo in the current 'Minimal. diterima'.) | Minimal. diterima; Jumlah minimal yang didapat |
| fee (integrator fee, "Jumper fee") | biaya; 'Biaya Jumper'; 'Biaya integrator'; 'Biaya penyedia' (Use 'biaya' for every fee, as for network fees.) | komisi; ongkos; fee |
| estimated time | Estimasi waktu (Use 'Estimasi waktu' in every string, although OKX uses 'Perkiraan waktu'.) | Waktu perkiraan; Jam estimasi |
| high value loss (warning when a route loses a lot of value) | Kerugian nilai besar (Use 'Kerugian nilai besar', because the current text reads as 'losing a high value'.) | Kehilangan nilai tinggi |
| on-ramp / buy with card | 'Beli dengan kartu'; 'Beli kripto' (Name the action, because users do not know the word 'on-ramp'.) | on-ramp; jalur masuk |
| leaderboard | Papan peringkat (Use 'Papan peringkat', as MetaMask does.) | Leaderboard; Papan pemimpin |
| perks | benefit (Use 'benefit', because 'keuntungan' also means 'profit' in a trading app.) | keuntungan; tunjangan |
| earn (the product page where users earn yield) | Earn (page and product name); verb in sentences: 'dapatkan' (Keep 'Earn' as the page name and use 'dapatkan' only inside sentences.) | Dapatkan (as the page title); Penghasilan |
| trigger price (limit orders) | harga pemicu (Use 'harga pemicu', as MetaMask does for orders.) | harga picu; harga trigger |
| expiry / expires (orders) | kedaluwarsa; 'Kedaluwarsa dalam {{duration}}'; 'Order kedaluwarsa' (Use the KBBI spelling 'kedaluwarsa', not the common misspelling 'kadaluarsa'.) | kadaluarsa; berakhir |

### `it` — Italian

- Variant: Italian (Italy), it-IT. The same text serves Italian-speaking users in Switzerland.
- Register: tu. Buttons use the tu imperative ('Connetti', 'Scambia', 'Riprova').
- Buttons use the tu imperative: 'Connetti wallet', 'Scambia', 'Trasferisci', 'Approva', 'Riprova'. Do not use the infinitive or the formal 'Connetta'.
- Use sentence case. Do not copy English title case: 'Ordine limite', not 'Ordine Limite'.
- Loanwords are masculine and take no plural -s: il bridge / i bridge, il token / i token, il wallet / i wallet, il gas. Use 'lo' / 'gli' before s + consonant: lo swap, gli swap, lo slippage, lo staking.
- 'Stablecoin' and 'chain' are feminine: la stablecoin / le stablecoin, la chain.
- Make adjectives and participles agree with the Italian noun: 'transazione completata', 'perdita di valore elevata'.
- Use a decimal comma and a dot as the thousands separator: '1.234,56'. Write percentages with no space: '0,5%'.

| English | Use | Do not use |
| --- | --- | --- |
| bridge (noun) | bridge (m.) ; pl. i bridge (Use 'bridge' for the protocol and the transfer: 'Bridge completato', 'Commissione del bridge'.) | ponte |
| bridge (verb) | trasferire (pulsante: 'Trasferisci'); nel testo: 'effettuare il bridge' (Italian has no natural verb from 'bridge', so buttons use 'Trasferisci'.) | pontare, collegare |
| swap (noun) | swap (m.) ; 'lo swap', pl. 'gli swap' (Use 'swap' in labels and status text: 'Swap completato'. The current widget uses 'Scambio'.) | scambio (come sostantivo) |
| swap (verb) | scambiare (pulsante: 'Scambia') (Use 'Scambia' on the swap button.) | swappare (su un pulsante), permutare |
| exchange | Scambia (scheda e titolo) (Italian users read 'exchange' as a centralized exchange, so the tab uses the verb 'Scambia'.) | Exchange, Borsa, Cambio |
| cross-chain | cross-chain (invariabile) (Write it with a hyphen after the noun: 'swap cross-chain'.) | cross-catena, inter-catena |
| gas | gas (m.) (Keep 'gas' as the unit and the tab name.) | benzina, carburante |
| gas fee / network fee | commissione di rete (pl. commissioni di rete) (Use 'Commissione di rete' as the fee label.) | tassa di rete, canone gas, tariffa |
| slippage | slippage (m.) ; 'lo slippage', 'Slippage max', 'tolleranza dello slippage' (The current widget uses 'slittamento di prezzo'. Replace it with 'slippage'.) | slittamento (di prezzo), scivolo |
| price impact | impatto sul prezzo (Use the singular 'sul prezzo'.) | impatto sui prezzi, impatto ad alto prezzo |
| route | percorso (m.) ; pl. percorsi (The current widget mixes 'route' and 'rotta'. Use 'percorso' only.) | rotta, route, itinerario |
| quote | quotazione (f.) : 'Richiedi una nuova quotazione' (The current widget uses 'quota'. Use 'quotazione'.) | preventivo, citazione, quota |
| chain / blockchain | chain (f.) ; 'blockchain' (f.) per la tecnologia (Use 'la chain' in selectors: 'Seleziona la chain', 'Cambia chain'.) | catena |
| network (synonym of chain in wallet UIs) | rete (f.) (Use 'rete' where a wallet asks the user to switch: 'Cambia rete'.) | network |
| from chain / to chain (source / destination) | chain di origine / chain di destinazione ; etichette: 'Da' / 'A' (Keep 'chain' as in id 13.) | catena di destinazione |
| token | token (m., invariabile) (Do not add -s in the plural: 'i token'.) | gettone |
| native token (ETH on Ethereum, SOL on Solana) | token nativo (Use it for the coin that pays gas, for example ETH or SOL.) | token indigeno |
| stablecoin | stablecoin (f., invariabile) : 'la stablecoin', 'le stablecoin' (Use the feminine article.) | moneta stabile |
| wallet | wallet (m., invariabile) (Use 'wallet' so that 'portafoglio' stays free for the portfolio, as PancakeSwap IT does.) | portafoglio (riservato a 'portfolio', id 44) |
| connect wallet / connect (button) | Connetti wallet ; breve: 'Connetti' (The current widget uses 'Collega il portafoglio'. Replace it.) | Collega il portafoglio |
| disconnect | Disconnetti (Use the same root as 'Connetti'.) | Scollega |
| approve / token approval (ERC-20 allowance) | Approva (pulsante) ; 'approvazione' (sostantivo) ; allowance: 'importo approvato' (The current widget uses 'quota massima' for allowance. Use 'importo approvato'.) | Autorizza, quota massima |
| sign / signature (wallet signature request) | Firma (pulsante) ; 'firma' (sostantivo) ; 'richiesta di firma' (Use 'Firma' on the wallet prompt button.) | Sottoscrivi, Segna |
| transaction | transazione (f.) (The current widget uses 'operazione' once. Use 'transazione' everywhere.) | operazione, trasmissione |
| transaction hash | hash della transazione (m.) ; breve: 'Tx hash' (Keep 'hash' in English.) | impronta, codice hash |
| pending / completed / failed / refunded (transaction status words) | In attesa / Completata / Non riuscita / Rimborsata (Make the status agree with 'transazione' (feminine).) | Pendente / Fallita / Cancellata |
| DEX | DEX (m., invariabile) (Keep the acronym: 'un DEX', 'i DEX'.) | exchange decentralizzato |
| aggregator | aggregatore (m.) (Use the Italian form.) | aggregator |
| liquidity | liquidità (f.) (Use it for pool and route liquidity.) | liquido |
| yield | rendimento (m.) (Use 'rendimento' for what a vault or staking position pays.) | resa, rendita |
| APY | APY (Keep 'APY' in labels.) | rendimento percentuale annuo (in un’etichetta) |
| vault | vault (m., invariabile) (Keep the DeFi term for Earn vaults. No checked Italian UI translates it well.) | caveau, cassaforte |
| staking | staking (m.) ; 'fare staking' (Use 'fare staking' as the verb phrase: 'Fai staking di ETH'.) | puntare, scommettere |
| deposit | Deposita (pulsante) ; 'deposito' (sostantivo) (Pair it with 'Preleva' (id 35).) | Versa, Consegna |
| withdraw | Preleva (pulsante) ; 'prelievo' (sostantivo) (Pair it with 'Deposita'.) | Ritira, Recedi |
| limit order | ordine limite (m.) ; 'prezzo limite' (Use 'ordine limite' for the order and 'prezzo limite' for its price.) | Limita ordine |
| TWAP order / scheduled order | ordine TWAP ; scheduled: 'programmato' (Keep 'TWAP' as an acronym.) | ordine a prezzo medio ponderato nel tempo |
| market cap | capitalizzazione di mercato (Use the full term. Abbreviate to 'cap. di mercato' only when space is short.) | tetto di mercato, market cap |
| refuel / get gas | Ottieni gas (pulsante) ; scheda: 'Gas' (Use 'Ottieni gas' for the action and keep 'Gas' as the tab name.) | Fai rifornimento, Fai il pieno |
| airdrop | airdrop (m., invariabile) (Keep the English word.) | lancio aereo |
| points / XP | XP ; altrove: 'punti' (Keep 'XP' for Jumper XP and use 'punti' for other points.) | punti esperienza |
| quest / mission | missione (f.) (Jumper uses 'Missions', so use 'missione' for every quest or mission.) | quest, compito |
| rewards / claim (rewards) | ricompense ; pulsante: 'Riscuoti' ('Richiedi' means to request, so use 'Riscuoti' on the claim button.) | Reclama, Richiedi |
| portfolio | portafoglio (m.) (Use 'portafoglio' for the portfolio. This is why the crypto wallet stays 'wallet' (id 19).) | portfolio |
| balance | saldo (m.) ('Bilancio' means a financial statement.) | bilancio |
| max (button that fills the full balance) | Max (Keep the button short.) | Massimo |
| send / receive | Invia / Ricevi (Use these verbs for wallet transfers.) | Spedisci / Ottieni |
| recipient / receiving address | destinatario (m.) ; 'indirizzo del destinatario' (Use 'indirizzo del destinatario' for the address field.) | beneficiario |
| minimum received | Minimo ricevuto (Use this label for the amount that the slippage limit protects.) | Ricevuto minimo |
| fee (integrator fee, "Jumper fee") | commissione (f.) : 'Commissione Jumper', 'Commissione dell’integratore', 'Commissione del provider' ('Tassa' means a tax.) | tassa, tariffa |
| estimated time | Tempo stimato (Use it as the label next to the time value.) | Ora stimata, ETA |
| high value loss (warning when a route loses a lot of value) | Perdita di valore elevata (The current widget has 'elevato', which does not agree with 'perdita'.) | Perdita di valore elevato |
| on-ramp / buy with card | Acquista con carta ; sezione: 'Acquista crypto' (Use 'Acquista' on the button.) | rampa, on-ramp (in un'etichetta) |
| leaderboard | Classifica (Use 'Classifica' for the XP leaderboard.) | Tabella dei leader, Leaderboard |
| perks | vantaggi (m. pl.) (Translate the feature as a common noun. Keep 'Perks' only in a fixed brand name.) | perks, benefit |
| earn (the product page where users earn yield) | Earn (nome della pagina) ; verbo: 'guadagnare' (Keep 'Earn' as the page name, as OKX Wallet IT does, and translate the verb in sentences.) | Guadagna (come nome della pagina) |
| trigger price (limit orders) | prezzo di attivazione (Use it for the price that starts a limit order.) | prezzo trigger, prezzo grilletto |
| expiry / expires (orders) | scadenza (f.) ; 'Scade tra {{time}}' ; 'Scaduto' (Use 'Scade tra' for a countdown and 'Scaduto' for the final status.) | spirazione, termine |

### `ja` — Japanese

- Variant: Japanese (Japan), ja-JP. Use 暗号資産, the legal term in Japan, for crypto assets.
- Register: です/ます form for messages, errors, and tooltips. Short noun forms on buttons and labels, with no です/ます.
- Buttons: use a noun or a noun phrase, for example 「スワップ」, 「承認」, 「ウォレットを接続」. Do not use ください on buttons.
- Use full-width Japanese punctuation (。、！？：（）) in Japanese text. Do not put 。 at the end of buttons, labels, or titles.
- Put a half-width space between Japanese text and Latin words or {{variables}}, for example 「{{chainName}} のガス」. The current widget and Uniswap ja do this.
- Keep the final long vowel mark in katakana loanwords: アグリゲーター, プロバイダー, リーダーボード. Do not write アグリゲータ.
- Keep token symbols, chain names, and protocol names in Latin letters, for example ETH, Arbitrum, Stargate.
- Write 暗号資産 for crypto assets, not 仮想通貨. 暗号資産 is the legal term in Japan.

| English | Use | Do not use |
| --- | --- | --- |
| bridge (noun) | ブリッジ (Use ブリッジ for the bridge protocol and for the transfer.) | 橋 |
| bridge (verb) | ブリッジする (On buttons, write ブリッジ. In sentences, write ブリッジする, for example 「{{chain}} にブリッジ」.) | 橋渡しする |
| swap (noun) | スワップ (Use スワップ for a token-to-token trade. Use 交換 only for the Exchange tab (term 5).) | 取り替え |
| swap (verb) | スワップする (On buttons, write スワップ. For progress, write スワップ中. Rainbow ja uses 交換する, but keep 交換 for the Exchange tab only.) | 取り替える |
| exchange | 交換 (This is the tab name that covers swap and bridge. 取引所 means a centralized exchange, so do not use it.) | 取引所 |
| cross-chain | クロスチェーン (Write one katakana word with no space or hyphen, for example 「クロスチェーンスワップ」.) | チェーン間 |
| gas | ガス (Use ガス for the gas unit and the gas token, for example 「ガス不足」 and 「ガス価格」.) | 燃料 |
| gas fee / network fee | ガス代 / ネットワーク手数料 (Use ガス代 where the text says gas fee. Use ネットワーク手数料 for the Network cost label in the fee breakdown.) | 燃料費 |
| slippage | スリッページ (Max slippage is 最大スリッページ. Slippage tolerance is スリッページ許容値. The current widget has the typo スリップページ.) | スリップページ |
| price impact | プライスインパクト (Some sources write 価格インパクト. Use プライスインパクト in all strings.) | 価格衝撃 |
| route | ルート (Use ルート for one path of a transfer, for example 「最適なルート」.) | 経路 |
| quote | 見積もり (引用 means a citation. Use 見積もり for a price quote, for example 「新しい見積もりを取得」.) | 引用 |
| chain / blockchain | チェーン / ブロックチェーン (Use チェーン in labels. Use ブロックチェーン only in explanations.) | 鎖 |
| network (synonym of chain in wallet UIs) | ネットワーク (Use ネットワーク where the English says network, for example 「ネットワークを切り替える」.) | 網 |
| from chain / to chain (source / destination) | 送金元チェーン / 送金先チェーン (In short headers, write 送金元 and 送金先. Do not use the katakana loanwords.) | ソースチェーン / デスティネーションチェーン |
| token | トークン (Keep token symbols such as ETH and USDC in Latin letters.) | 代用貨幣 |
| native token (ETH on Ethereum, SOL on Solana) | ネイティブトークン (Write one word, for example 「{{tokenSymbol}} は {{chainName}} のネイティブトークンです。」) | 固有トークン |
| stablecoin | ステーブルコイン (Write one katakana word with no space.) | 安定通貨 |
| wallet | ウォレット (Use ウォレット for all crypto wallets.) | 財布 |
| connect wallet / connect (button) | ウォレットを接続 (For the Wallet connected status, write ウォレット接続済み. The current widget uses ウォレットに接続, which is wrong.) | ウォレットに接続 |
| disconnect | 切断 (Use 切断 on the button. MetaMask uses 接続解除, but most sources use 切断.) | ログアウト |
| approve / token approval (ERC-20 allowance) | 承認 / トークンの承認 (For the allowance amount, write 使用上限. Example: 「{{tokenSymbol}} の使用を承認」.) | 許可 |
| sign / signature (wallet signature request) | 署名 (Write 署名リクエスト for the wallet request screen.) | サイン |
| transaction | トランザクション (取引 means a trade. Use トランザクション for an onchain transaction.) | 取引 |
| transaction hash | トランザクションハッシュ (Write one word with no space.) | 取引ID |
| pending / completed / failed / refunded (transaction status words) | 保留中 / 完了 / 失敗 / 返金済み (Use these short forms on status badges. In full sentences, use the しました form.) | ペンディング / 完成 / 払い戻しを受けました |
| DEX | DEX (Keep DEX in Latin letters. Write 分散型取引所 (DEX) only in explanations.) | デックス |
| aggregator | アグリゲーター (Keep the final long vowel mark. The current Jumper text uses アグリゲータ.) | 集約器 |
| liquidity | 流動性 (Use the kanji term in all strings.) | リクイディティ |
| yield | 利回り (Use 利回り for the return on a vault or a position.) | 収穫 |
| APY | APY (年利 hides the difference between APY and APR. Keep APY, for example 「最大 10% APY」.) | 年利 |
| vault | ボールト (Use ボールト for a DeFi vault.) | 金庫 |
| staking | ステーキング (Use ステーキング for the product and the action.) | 賭け |
| deposit | 入金 (預金 means a bank deposit. Use 入金 for funds that go into a vault or a position.) | 預金 |
| withdraw | 引き出し (Use 引き出し for funds that leave a vault or a position.) | 撤退 |
| limit order | 指値注文 (Use 指値 for the Limit tab and 指値価格 for the limit price.) | リミットオーダー |
| TWAP order / scheduled order | TWAP 注文 (Keep TWAP in Latin letters.) | 時間加重平均価格注文 |
| market cap | 時価総額 (Use the kanji term in all strings.) | マーケットキャップ |
| refuel / get gas | ガスを補充 (Use ガス補充 as the feature name. The current Jumper text uses リフューエル.) | リフューエル |
| airdrop | エアドロップ (Use エアドロップ in all strings.) | 空中投下 |
| points / XP | ポイント / XP (Keep XP in Latin letters, for example 「+50 XP」.) | 点数 / 経験値 |
| quest / mission | ミッション (Jumper says Missions in English. Use ミッション for quest and for mission.) | 任務 |
| rewards / claim (rewards) | 報酬 / 請求 (クレーム means a complaint in Japanese. MetaMask, Uniswap, and PancakeSwap use 請求 on the claim button. Rabby uses 受け取る.) | クレーム |
| portfolio | ポートフォリオ (Use ポートフォリオ for the page name.) | 資産一覧 |
| balance | 残高 (Use 残高 for all token balances.) | バランス |
| max (button that fills the full balance) | 最大 (Use 最大 on the button that fills the full balance.) | マックス |
| send / receive | 送金 / 受取 (Use 送金 and 受取 for token transfers. Uniswap and Rabby also use 送信 on some buttons.) | 発送 |
| recipient / receiving address | 受取人 / 受取アドレス (Use 受取アドレス when the field holds an address.) | 受信者 |
| minimum received | 最低受取額 (Use this exact label in the route details.) | 最小受け取り |
| fee (integrator fee, "Jumper fee") | 手数料 (Write Jumper 手数料 for the Jumper fee and インテグレーター手数料 for the integrator fee.) | フィー |
| estimated time | 推定所要時間 (Use this label for the time that a route needs.) | 見積もり時間 |
| high value loss (warning when a route loses a lot of value) | 大幅な価値の損失 (高価値損失 reads as the loss of an expensive item. Say that the value drops a lot.) | 高価値損失 |
| on-ramp / buy with card | カードで購入 (For a general buy action, write 暗号資産を購入.) | オンランプ |
| leaderboard | リーダーボード (Keep the final long vowel mark.) | 指導者掲示板 |
| perks | 特典 (Use 特典 for Jumper perks.) | パークス |
| earn (the product page where users earn yield) | Earn (Sources split three ways: Earn, 収益化, 稼ぐ. Keep Earn as the page name. In sentences, use 獲得, for example 「最大 10% APY を獲得」.) | 儲ける |
| trigger price (limit orders) | トリガー価格 (Use this label for the price that starts a limit order.) | 引き金価格 |
| expiry / expires (orders) | 有効期限 / 期限切れ (Use 有効期限 for the label and 期限切れ for the expired status. For expires in, write {{duration}} 後に期限切れ.) | 満期 |

### `ko` — Korean

- Variant: Korean (South Korea), ko-KR.
- Register: 합쇼체 (~습니다) for statements and errors. ~하세요 or ~해 주세요 for requests. Noun forms on buttons.
- Buttons: use a noun form, for example “지갑 연결”, “스왑”, “승인”. Use ~하기 only where a noun alone is unclear, for example “브릿지 시작하기”.
- Use standard Korean word spacing. Put a space between Korean text and Latin words or {{variables}}.
- After a {{variable}}, write both particle forms, for example (으)로, 을(를), 이(가). Uniswap ko does this.
- End full sentences with a period. Do not put a period on buttons, labels, or titles.
- Write these loanwords as one word with no space: 스테이블코인, 크로스체인, 시가총액.
- Keep token symbols, chain names, and protocol names in Latin letters, for example ETH, Arbitrum, Stargate.

| English | Use | Do not use |
| --- | --- | --- |
| bridge (noun) | 브릿지 (Use 브릿지 for the protocol and the transfer. Uniswap writes 브리지, but most wallets and news use 브릿지.) | 다리 |
| bridge (verb) | 브릿지 (Use 브릿지 with 하다 or a noun, for example “브릿지 시작하기” and “브릿지 중”. MetaMask also uses 브리징, but keep one form.) | 다리 놓기 |
| swap (noun) | 스왑 (Use 스왑 for a token-to-token trade. Use 교환 only for the Exchange tab (term 5).) | 맞교환 |
| swap (verb) | 스왑 (On buttons, write 스왑. For progress, write 스왑 중. Rainbow ko uses 교환, but keep 교환 for the Exchange tab only.) | 맞바꾸기 |
| exchange | 교환 (This is the tab name that covers swap and bridge. 거래소 means a centralized exchange, so do not use it.) | 거래소 |
| cross-chain | 크로스체인 (Write one word with no space, for example “크로스체인 스왑”.) | 교차 체인 |
| gas | 가스 (Use 가스 for the gas unit and the gas token, for example “가스 부족”.) | 연료 |
| gas fee / network fee | 가스비 / 네트워크 수수료 (Use 가스비 where the text says gas fee. Use 네트워크 수수료 for the Network cost label.) | 연료비 |
| slippage | 슬리피지 (Max slippage is 최대 슬리피지. Slippage tolerance is 슬리피지 허용치.) | 미끄러짐 |
| price impact | 가격 영향 (Use 가격 영향 in all strings.) | 가격 충격 |
| route | 경로 (Use 경로 for one path of a transfer, for example “최적 경로”. PancakeSwap ko uses 라우트.) | 노선 |
| quote | 견적 (인용 means a citation. Use 견적 for a price quote, for example “새 견적 받기”.) | 인용 |
| chain / blockchain | 체인 / 블록체인 (Use 체인 in labels. Use 블록체인 only in explanations.) | 사슬 |
| network (synonym of chain in wallet UIs) | 네트워크 (Use 네트워크 where the English says network, for example “네트워크 변경”.) | 망 |
| from chain / to chain (source / destination) | 출발 체인 / 도착 체인 (MetaMask uses 소스 체인 and 대상 체인. 출발 and 도착 read more naturally and match the current widget.) | 출처 체인 |
| token | 토큰 (Do not add the plural marker 들 to token.) | 토큰들 |
| native token (ETH on Ethereum, SOL on Solana) | 네이티브 토큰 (Example: “{{tokenSymbol}}은(는) {{chainName}}의 네이티브 토큰입니다.”) | 고유 토큰 |
| stablecoin | 스테이블코인 (Write one word with no space.) | 안정 코인 |
| wallet | 지갑 (Use 지갑 for all crypto wallets. Keep 월렛 only in brand names.) | 월렛 |
| connect wallet / connect (button) | 지갑 연결 (For the Wallet connected status, write 지갑 연결됨.) | 지갑 접속 |
| disconnect | 연결 해제 (Use 연결 해제 on the button.) | 로그아웃 |
| approve / token approval (ERC-20 allowance) | 승인 / 토큰 승인 (For the allowance amount, write 지출 한도.) | 허가 |
| sign / signature (wallet signature request) | 서명 (Write 서명 요청 for the wallet request screen.) | 사인 |
| transaction | 트랜잭션 (거래 means a trade. Use 트랜잭션 for an onchain transaction.) | 거래 |
| transaction hash | 트랜잭션 해시 (Use the same word as term 24.) | 거래 해시 |
| pending / completed / failed / refunded (transaction status words) | 대기 중 / 완료 / 실패 / 환불됨 (Use these short forms on status badges. MetaMask uses 보류 중, but most sources use 대기 중.) | 미결 |
| DEX | DEX (Keep DEX in Latin letters. Write 탈중앙화 거래소(DEX) only in explanations.) | 덱스 |
| aggregator | 애그리게이터 (Use 애그리게이터 for the product type.) | 집계기 |
| liquidity | 유동성 (Use the Sino-Korean term in all strings.) | 리퀴디티 |
| yield | 수익률 (Use 수익률 for the return on a vault or a position.) | 산출량 |
| APY | APY (Keep APY in Latin letters, for example “최대 10% APY”.) | 연이율 |
| vault | 볼트 (Use 볼트 for a DeFi vault.) | 금고 |
| staking | 스테이킹 (Use 스테이킹 for the product and the action.) | 지분 걸기 |
| deposit | 예치 (예금 means a bank deposit. Use 예치 for funds that go into a vault or a position.) | 예금 |
| withdraw | 출금 (Use 출금 for funds that leave a vault or a position.) | 철수 |
| limit order | 지정가 주문 (Use 지정가 for the Limit tab and the limit price.) | 한도 주문 |
| TWAP order / scheduled order | TWAP 주문 (Keep TWAP in Latin letters.) | 시간 가중 평균 가격 주문 |
| market cap | 시가총액 (Write one word with no space.) | 시장 한도 |
| refuel / get gas | 가스 충전 (Use 가스 충전 for the button and the feature name.) | 리퓨얼 |
| airdrop | 에어드롭 (에어드랍 is a casual spelling. Use 에어드롭 in the UI.) | 공중 투하 |
| points / XP | 포인트 / XP (Keep XP in Latin letters, for example “+50 XP”.) | 점수 / 경험치 |
| quest / mission | 미션 (Jumper says Missions in English. Use 미션 for quest and for mission.) | 임무 |
| rewards / claim (rewards) | 보상 / 클레임 (주장 means an assertion. Use 클레임 on the claim button. MetaMask uses 청구, and Rabby uses 수령.) | 주장 |
| portfolio | 포트폴리오 (Use 포트폴리오 for the page name.) | 자산 목록 |
| balance | 잔액 (균형 means equilibrium. Use 잔액 for token balances.) | 균형 |
| max (button that fills the full balance) | 최대 (Use 최대 on the button that fills the full balance.) | 맥스 |
| send / receive | 보내기 / 받기 (Use these forms on buttons and headers.) | 송신 / 수신 |
| recipient / receiving address | 받는 주소 (Use 받는 사람 only where the text means a person.) | 수취인 |
| minimum received | 최소 수령액 (Use this exact label in the route details.) | 최소 수신 |
| fee (integrator fee, "Jumper fee") | 수수료 (Write Jumper 수수료 for the Jumper fee and 통합사 수수료 for the integrator fee.) | 요금 |
| estimated time | 예상 시간 (Use this label for the time that a route needs.) | 추정 시간 |
| high value loss (warning when a route loses a lot of value) | 큰 가치 손실 (높은 가치 손실 is a word-for-word translation. Say that the loss is large.) | 높은 가치 손실 |
| on-ramp / buy with card | 카드로 구매 (Use 매수 only for a buy order in trading.) | 온램프 |
| leaderboard | 리더보드 (Use 리더보드 for the page name.) | 순위 게시판 |
| perks | 혜택 (Use 혜택 for Jumper perks.) | 특전 |
| earn (the product page where users earn yield) | 수익 (Use 수익 for the page name, as PancakeSwap does. In sentences, write 수익 얻기, for example “최대 10% APY 수익 얻기”.) | 벌기 |
| trigger price (limit orders) | 트리거 가격 (Use this label for the price that starts a limit order.) | 방아쇠 가격 |
| expiry / expires (orders) | 만료 / 만료됨 (For expires in, write {{duration}} 후 만료.) | 만기 |

### `pl` — Polish

- Variant: Polish (Poland), pl-PL. Both repositories have no Polish strings today (the widget pl.json has only the language name), so this glossary is the first baseline.
- Register: ty (informal), with capitalized 'Twój' / 'Twoje'. Buttons use the 2nd person imperative ('Połącz portfel', 'Wymień').
- Buttons use the 2nd person singular imperative: 'Połącz portfel', 'Wymień', 'Przenieś', 'Zatwierdź', 'Podpisz'. Do not use the infinitive ('Połączyć').
- Write 'Twój', 'Twoje' and 'Ciebie' with a capital letter when you address the user. Use sentence case for labels: 'Zlecenie z limitem'.
- Decline loanwords like Polish nouns: token – tokena – tokeny – tokenów; swap – swapu – swapem – swapy; stablecoin – stablecoina – stablecoiny; airdrop – airdropu – airdropy.
- Do not use gendered past forms for the user ('Ograniczyłeś'). Use impersonal forms instead ('Ograniczono', 'Nie znaleziono trasy').
- Make status words agree with 'transakcja' (feminine): 'Zakończona', 'Nieudana'.
- Use „…” quotation marks, a decimal comma and a space as the thousands separator: '1 234,56'.

| English | Use | Do not use |
| --- | --- | --- |
| bridge (noun) | most (m.) : most – mostu – mosty – mostów ; 'most międzyłańcuchowy' (Polish UIs and media say 'most'. Keep the protocol name as it is: 'most Stargate'.) | bridge, mostek, pomost |
| bridge (verb) | przenieść (przycisk: 'Przenieś') ; w zdaniu: 'przenieś przez most' (Use 'Przenieś' on buttons. The neologism 'pomostuj' reads like a machine translation.) | pomostować, zmostkować, bridgować |
| swap (noun) | swap (m.) : swap – swapu – swapem – swapy (Use 'swap' in labels and status text: 'Swap zakończony', 'Szczegóły swapu'.) | zamiana, wymiana (jako rzeczownik w statusie) |
| swap (verb) | wymienić (przycisk: 'Wymień') (Use 'Wymień' on the swap button.) | Zamień, Swapuj |
| exchange | Wymiana (zakładka i tytuł) ('Giełda' means a centralized exchange, so the tab for swaps and bridges uses 'Wymiana'.) | Giełda, Kantor, Exchange |
| cross-chain | międzyłańcuchowy (przymiotnik) : 'swap międzyłańcuchowy', 'most międzyłańcuchowy' (Polish UIs use 'sieć' for one chain (id 13) but 'międzyłańcuchowy' for cross-chain. Keep both forms.) | krzyżowo-łańcuchowy, cross-chain (w zdaniu) |
| gas | gaz (m.) : gaz – gazu – gazem (Decline 'gaz' like a Polish noun. Use 'Gaz' as the tab name too.) | benzyna, paliwo |
| gas fee / network fee | opłata sieciowa (pl. opłaty sieciowe) (Use 'Opłata sieciowa' as the fee label. Keep 'prowizja' for the service fee (id 50).) | prowizja sieci, opłata za gaz (jako etykieta) |
| slippage | poślizg (cenowy) (m.) : 'Maks. poślizg', 'tolerancja poślizgu' (All checked Polish UIs translate slippage as 'poślizg'.) | slippage, ześlizg, przesunięcie |
| price impact | wpływ na cenę (Use 'Duży wpływ na cenę' for the warning.) | wpływ cen, wpływ wysokiej ceny |
| route | trasa (f.) : trasa – trasy – tras (Use 'trasa' when the UI compares paths: 'Nie znaleziono trasy'.) | droga, ścieżka, routing |
| quote | wycena (f.) : 'Pobierz nową wycenę' (Use 'wycena' for the price of one route.) | cytat, notowanie, kwotowanie |
| chain / blockchain | sieć (f.) ; 'blockchain' (m.) dla technologii (Use 'sieć' in selectors: 'Wybierz sieć', 'Przełącz sieć'.) | łańcuch (w etykietach) |
| network (synonym of chain in wallet UIs) | sieć (f.) (Chain and network mean the same thing in this UI, so both use 'sieć'.) | network, łańcuch |
| from chain / to chain (source / destination) | sieć źródłowa / sieć docelowa ; etykiety: 'Z' / 'Do' (Keep 'sieć' as in id 13.) | łańcuch źródłowy / łańcuch docelowy |
| token | token (m.) : token – tokena – tokeny – tokenów (Decline it like a Polish noun.) | żeton |
| native token (ETH on Ethereum, SOL on Solana) | natywny token (Use it for the coin that pays gas, for example ETH or SOL.) | rodzimy token, tubylczy token |
| stablecoin | stablecoin (m.) : stablecoina – stablecoiny – stablecoinów (Keep the English word and decline it.) | stabilna moneta |
| wallet | portfel (m.) : portfela – portfele (All checked Polish UIs translate wallet as 'portfel'.) | wallet, sakiewka |
| connect wallet / connect (button) | Połącz portfel ; krótko: 'Połącz' (Use the same verb on the header button and in prompts.) | Podepnij portfel, Podłącz portfel |
| disconnect | Odłącz ('Odłącz portfel') ('Wyloguj' means to log out of an account.) | Wyloguj, Rozłącz |
| approve / token approval (ERC-20 allowance) | Zatwierdź (przycisk) ; 'zatwierdzenie' (rzeczownik) ; allowance: 'zatwierdzona kwota' (Use one verb for the approval step.) | Zaakceptuj, Zezwól |
| sign / signature (wallet signature request) | Podpisz (przycisk) ; 'podpis' (rzeczownik) ; 'prośba o podpis' ('Zaloguj się' means log in, which PancakeSwap PL wrongly uses for 'Sign in your wallet'.) | Zaloguj się, Sygnuj |
| transaction | transakcja (f.) ('Przelew' means a bank transfer.) | przelew, operacja |
| transaction hash | hash transakcji (m.) (Keep 'hash' in English.) | skrót transakcji |
| pending / completed / failed / refunded (transaction status words) | Oczekująca / Zakończona / Nieudana / Zwrócona (Make the status agree with 'transakcja'. 'Zwrócona' means the funds came back.) | W toku / Kompletna / Porażka / Zwrot |
| DEX | DEX (m., nieodmienny) ; w zdaniu: 'giełda DEX' (Keep the acronym. Add 'giełda' when the sentence needs a case ending.) | zdecentralizowana wymiana |
| aggregator | agregator (m.) (Keep the loanword.) | zbieracz |
| liquidity | płynność (f.) (Use it for pool and route liquidity.) | likwidność |
| yield | zysk (m.) (Use 'zysk' for what a vault or staking position pays, and 'APY' for the rate.) | plon, żniwo, przychód |
| APY | APY (Keep 'APY' in labels.) | roczna stopa zwrotu (w etykiecie) |
| vault | vault (m.) : vaulta – vaulty (Keep the DeFi term for Earn vaults.) | skarbiec, sejf |
| staking | staking (m.) ; czasownik: 'stakować' (przycisk: 'Stakuj') (Use 'Stakuj' on buttons.) | stawianie, obstawianie |
| deposit | Wpłać (przycisk) ; 'wpłata' (rzeczownik) (Pair it with 'Wypłać' (id 35).) | Depozyt (jako przycisk), Zdeponuj |
| withdraw | Wypłać (przycisk) ; 'wypłata' (rzeczownik) (Pair it with 'Wpłać'.) | Wycofaj, Podejmij |
| limit order | zlecenie z limitem ; 'cena limitu' ('Zamówienie' means a shop order.) | zamówienie limitowe, limit order |
| TWAP order / scheduled order | zlecenie TWAP ; scheduled: 'zaplanowane' (Keep 'TWAP' as an acronym.) | zlecenie średniej ceny ważonej czasem |
| market cap | kapitalizacja rynkowa (Use the Polish term. PancakeSwap PL leaves it in English.) | market cap, czapka rynkowa |
| refuel / get gas | Uzyskaj gaz (przycisk) ; zakładka: 'Gaz' (Use 'Uzyskaj gaz' for the action.) | Zatankuj, Zatankować |
| airdrop | airdrop (m.) : airdropu – airdropy (Keep the English word and decline it.) | zrzut |
| points / XP | XP ; gdzie indziej: 'punkty' (Keep 'XP' for Jumper XP and use 'punkty' for other points.) | punkty doświadczenia |
| quest / mission | misja (f.) (Jumper uses 'Missions', so use 'misja' for every quest or mission.) | quest, zadanie |
| rewards / claim (rewards) | nagrody ; przycisk: 'Odbierz' (Use 'Odbierz' on the claim button.) | Zażądaj, Roszczenie |
| portfolio | portfolio (n., nieodmienne) (Keep 'portfolio' so that 'portfel' means only the wallet.) | portfel (zarezerwowany dla 'wallet') |
| balance | saldo (n.) (Use 'saldo' for the token balance.) | bilans, równowaga |
| max (button that fills the full balance) | Maks. (Keep the Polish abbreviation with a period.) | Maksimum, Max |
| send / receive | Wyślij / Otrzymaj ; w zdaniu: 'Otrzymasz' (Use 'Otrzymaj', not 'Odbierz', so that 'Odbierz' stays free for claims (id 43).) | Prześlij / Dostań |
| recipient / receiving address | odbiorca (m.) ; 'adres odbiorcy' (Use 'adres odbiorcy' for the address field.) | beneficjent, adres odbierający |
| minimum received | Otrzymasz co najmniej ('Otrzymano minimum' reads as if the user already got the money.) | Otrzymano minimum |
| fee (integrator fee, "Jumper fee") | prowizja (f.) : 'Prowizja Jumper', 'Prowizja integratora', 'Prowizja dostawcy' (Use 'prowizja' for service fees and 'opłata sieciowa' for chain fees.) | opłata (zarezerwowana dla id 8), honorarium |
| estimated time | Szacowany czas (Use 'Szac. czas' only when space is short.) | Przewidywany czas przybycia, ETA |
| high value loss (warning when a route loses a lot of value) | Duża utrata wartości (Use it as the warning title.) | Wysoka strata wartości |
| on-ramp / buy with card | Kup kartą ; sekcja: 'Kup kryptowaluty' (Use 'Kup' on the button.) | rampa, on-ramp (w etykiecie) |
| leaderboard | Ranking ; 'pozycja w rankingu' (Use 'Ranking' because Jumper shows the user's rank in it.) | Tabela liderów, Leaderboard |
| perks | korzyści (f. pl.) (Translate the feature as a common noun. Keep 'Perks' only in a fixed brand name.) | perki, profity |
| earn (the product page where users earn yield) | Earn (nazwa strony) ; czasownik: 'zarabiać' (Keep 'Earn' as the page name, as OKX Wallet PL does, and translate the verb in sentences.) | Zarabiaj (jako nazwa strony) |
| trigger price (limit orders) | cena wyzwalająca (Use it for the price that starts a limit order.) | cena spustowa, cena triggera |
| expiry / expires (orders) | wygaśnięcie (n.) ; 'Wygasa za {{time}}' ; 'Wygasło' (Use 'Wygasa za' for a countdown and 'Wygasło' for the final status.) | przedawnienie, termin ważności |

### `pt` — Portuguese

- Variant: Portuguese (Brazil), pt-BR. Brazil is 5th in the Chainalysis 2025 adoption index (1st in 2026, per KuCoin News). Portugal was 58th in 2023. Binance, OKX and MetaMask ship pt-BR text. The current Jumper file is already pt-BR ('você', 'Portfólio').
- Register: você, with 'seu/sua'. Imperatives in the 'você' form: 'Conecte', 'Selecione', 'Aprove'. Never 'tu'.
- Write buttons as infinitives: 'Conectar carteira', 'Trocar', 'Aprovar'. Write instructions with the 'você' imperative: 'Conecte sua carteira'.
- Use sentence case for labels and titles: 'Detalhes da transação', not 'Detalhes Da Transação'.
- Give loanwords a fixed gender: 'o swap', 'a bridge', 'o gas', 'o slippage', 'a stablecoin', 'a DEX'. Binance, OKX and Uniswap use these genders.
- Use pt-BR words only. Do not use pt-PT forms such as 'Ligar', 'Desligar', 'Levantar', 'Portefólio' or 'A trocar'.
- Keep 'cross-chain' invariable after the noun: 'swap cross-chain', 'transferências cross-chain'.

| English | Use | Do not use |
| --- | --- | --- |
| bridge (noun) | bridge (a bridge, pl. as bridges); tab and title: 'Bridge'; status: 'Bridge concluída' (Use 'bridge' as a feminine noun, as Binance, OKX and Uniswap do, although MetaMask says 'Ponte'.) | ponte; transferência de fundos entre redes |
| bridge (verb) | fazer bridge: 'Fazer bridge', 'Fazendo bridge de 1 ETH', 'Fazer bridge para {{chain}}' (Use 'fazer bridge' and replace long phrases such as 'transferência de fundos entre redes'.) | fazer ponte; enviar pela ponte; transferir fundos entre redes |
| swap (noun) | swap (o swap, pl. os swaps); tab and title: 'Swap'; status: 'Swap concluído' (Keep 'Swap' as the tab name, because 'Conversão' suggests Binance Convert or a fiat conversion.) | conversão; troca (as the Swap tab name) |
| swap (verb) | trocar: button 'Trocar'; sentence 'Troque ETH por USDC' (Use 'Trocar' on buttons and keep 'fazer swap' for informal marketing text.) | converter; permutar; swapar |
| exchange | title and button: 'Trocar'; token pages: 'Trocar de' / 'Trocar para' (Do not use 'exchange' or 'corretora', because Brazilian users use them for a trading platform.) | Conversão; Converter; Exchange; Corretora |
| cross-chain | cross-chain (invariable): 'swap cross-chain', 'transferências cross-chain' (Put 'cross-chain' after the noun and do not add a plural ending.) | entre cadeias; intercadeias; cross-chains |
| gas | gas (o gas), without an accent (Write 'gas' without an accent in every string, because sources split between 'gas' and 'gás'.) | gasolina; combustível; gás (mixed spelling) |
| gas fee / network fee | taxa de gas; taxa de rede (Use 'taxa' for network fees and replace the current 'Custo da rede'.) | custo da rede; tarifa de rede |
| slippage | slippage (o slippage); 'Slippage máx.'; 'tolerância de slippage' (Keep 'slippage', because 'deslizamento' is the pt-PT form.) | Diferença máxima; deslizamento; desvio |
| price impact | impacto no preço (Use 'impacto no preço', as MetaMask does.) | efeito no preço |
| route | rota (pl. rotas); 'Melhor rota' (Use 'rota' for one path through bridges and DEXs.) | caminho; trajeto |
| quote | cotação; 'Valor cotado'; 'Melhor cotação' (Use 'cotação' for every price quote.) | orçamento; citação |
| chain / blockchain | rede (a rede) for one chain: 'Selecionar rede'; blockchain (a blockchain) for the technology (Use 'rede' for a chain, because 'cadeia' is rare in pt-BR wallets and also means 'jail'.) | cadeia; corrente |
| network (synonym of chain in wallet UIs) | rede (pl. redes); 'Todas as redes' (Use 'rede' for the network selector and network fees.) | — |
| from chain / to chain (source / destination) | rede de origem / rede de destino; short labels: 'De' / 'Para' (Use 'rede de origem' and 'rede de destino' to match term 13.) | cadeia de origem; cadeia de destino |
| token | token (pl. tokens) (Keep 'token' for a token and use 'cripto' only for crypto in general.) | ficha; moeda |
| native token (ETH on Ethereum, SOL on Solana) | token nativo; 'token nativo da rede' (Use 'token nativo' for the gas token of a chain, for example ETH on Ethereum.) | moeda própria; token original |
| stablecoin | stablecoin (a stablecoin, pl. stablecoins) (Use 'stablecoin' as a feminine noun, as MetaMask and Uniswap do.) | moeda estável |
| wallet | carteira (pl. carteiras) (Keep 'Wallet' only inside product names such as 'OKX Wallet'.) | wallet; porta-moedas |
| connect wallet / connect (button) | 'Conectar carteira'; short button: 'Conectar' (Do not use 'Ligar', because it is the pt-PT verb.) | Ligar carteira; Ligar |
| disconnect | 'Desconectar' (Do not use 'Desligar', because it is the pt-PT verb.) | Desligar; Sair |
| approve / token approval (ERC-20 allowance) | aprovar / aprovação; 'Aprovar gasto de {{token}}'; 'limite de gastos' (Use 'aprovar' for the allowance step and 'limite de gastos' for the approved amount.) | autorizar; permitir |
| sign / signature (wallet signature request) | assinar / assinatura; 'Solicitação de assinatura'; 'Assinar transação' (Use 'assinar' for every wallet signature request.) | firmar; rubricar |
| transaction | transação (pl. transações) (Use 'transação' for an on-chain transaction.) | operação (for an on-chain transaction) |
| transaction hash | hash da transação (Keep 'hash', because users see this word in block explorers.) | resumo da transação; ID da transação |
| pending / completed / failed / refunded (transaction status words) | Pendente / Concluído / Falhou / Reembolsado (Make the participle agree with the noun: 'Transação concluída', 'Swap concluído', 'Bridge reembolsada'.) | Bem sucedida; Recebido (for 'completed') |
| DEX | DEX (a DEX, pl. as DEXs) (Keep the acronym as a feminine noun, as Uniswap does.) | corretora descentralizada; troca descentralizada |
| aggregator | agregador; 'agregador de liquidez' (Use 'agregador' for a service that compares routes from many protocols.) | acumulador; compilador |
| liquidity | liquidez (Use 'liquidez', as all sources do.) | — |
| yield | rendimento (pl. rendimentos) (Use 'rendimento' for the noun and 'ganhar' for the verb.) | colheita; rendimento agrícola |
| APY | APY (Keep 'APY', as Brazilian crypto apps do.) | rendimento anual percentual; TAE |
| vault | cofre (o cofre) (Use 'cofre' as Uniswap does, but keep the protocol name when the vault has one.) | caixa-forte; vault |
| staking | staking (o staking); 'Fazer staking'; 'Em staking' (Do not use 'aposta', because 'apostar' means 'to bet'.) | aposta; participação |
| deposit | depositar / depósito (Use 'depositar' on the button and 'depósito' for the noun.) | aportar; aporte |
| withdraw | sacar / saque (Use 'Sacar', as MetaMask and Uniswap do, and replace the current 'Retirar'.) | Retirar; Levantar |
| limit order | ordem limite (pl. ordens limite); 'Preço limite' (Use 'ordem', because 'pedido' means a purchase order in a shop.) | pedido limite; ordem limitada |
| TWAP order / scheduled order | ordem TWAP; ordem agendada (Keep the acronym 'TWAP' and use 'ordem' as for limit orders.) | pedido agendado |
| market cap | capitalização de mercado (Use 'capitalização de mercado' in every string, although Uniswap uses 'Valor de mercado'.) | cap. bursátil; valor bursátil |
| refuel / get gas | 'Obter gas'; 'Obter gas na {{chain}}' (Keep 'gas' from term 7 and do not use car words such as 'abastecer'.) | Obter gás; Reabastecer |
| airdrop | airdrop (o airdrop, pl. airdrops) (Keep 'airdrop', as all sources do.) | distribuição gratuita; lançamento aéreo |
| points / XP | pontos; XP (Use 'pontos' for points and keep 'XP' as it is.) | — |
| quest / mission | missão (pl. missões) (Use 'missão' for every quest and mission.) | busca; quest |
| rewards / claim (rewards) | recompensas; button: 'Resgatar'; 'Resgatar recompensas' (Use 'Resgatar', because 'Reivindicar' means 'demand a right' and 'Reclamar' means 'complain' in Brazil.) | Reivindicar; Reclamar; prêmios |
| portfolio | Portfólio (Do not use 'Portefólio', because it is the pt-PT spelling.) | Portefólio; Carteira |
| balance | saldo; 'Saldo total' (Use 'saldo', because 'balanço' means an accounting statement.) | balanço |
| max (button that fills the full balance) | Máx. (Use the short form with a period, as wallets do.) | MÁXIMO; Tudo |
| send / receive | Enviar / Receber (Use 'Enviar' and 'Receber' on buttons and in amount fields.) | Mandar / Obter |
| recipient / receiving address | destinatário; 'endereço do destinatário' (Use 'destinatário' for the person and 'endereço do destinatário' for the address field.) | receptor; beneficiário |
| minimum received | Mínimo recebido (Write 'Mínimo' in full, with the accent.) | Mín. recebido; Valor mínimo obtido |
| fee (integrator fee, "Jumper fee") | taxa; 'Taxa do Jumper'; 'Taxa do integrador'; 'Taxa do provedor' (Use 'taxa' for every fee, as for network fees.) | tarifa; custo; comissão |
| estimated time | Tempo estimado (Use 'Tempo estimado' for the duration, as MetaMask and OKX do.) | Hora estimada; Duração prevista |
| high value loss (warning when a route loses a lot of value) | Perda de valor alta (Put the adjective last, because the warning names a large loss, not a loss of something valuable.) | Alta perda de valor |
| on-ramp / buy with card | 'Comprar com cartão'; 'Comprar cripto' (Name the action, because users do not know the word 'on-ramp'.) | rampa de entrada; on-ramp |
| leaderboard | Tabela de classificação (Use 'Tabela de classificação', as MetaMask and the current Jumper file do.) | Placar de líderes; Leaderboard |
| perks | benefícios (Use 'benefícios', because the current 'vantagem' reads as 'advantage'.) | vantagem; regalias |
| earn (the product page where users earn yield) | Earn (page and product name); verb in sentences: 'ganhar' (Keep 'Earn' as the page name and use 'ganhar' only inside sentences.) | Ganhe (as the page title); Ganhos |
| trigger price (limit orders) | preço de disparo (Use 'preço de disparo', as MetaMask does for orders.) | preço gatilho; preço de ativação |
| expiry / expires (orders) | validade; 'Expira em {{duration}}'; 'Ordem expirada' (Use 'validade' for the label and 'Expira em' for the countdown, as Uniswap does.) | vencimento; caducidade |

### `th` — Thai

- Variant: Thai (Thailand), th-TH. Thai crypto users write many crypto terms in Latin letters inside Thai sentences.
- Register: Neutral polite. Do not use ครับ or ค่ะ. Use โปรด for requests and คุณ for 'you'.
- Keep these crypto terms in Latin letters with a capital first letter: Swap, Bridge, Gas, Slippage, Wallet, Price Impact, Stablecoin, Staking, Vault, Airdrop, Limit Order.
- Put one space between Thai text and a Latin word, a number, or a {{variable}}, for example “เชื่อมต่อ Wallet”.
- Do not add spaces inside a Thai phrase. Use a space only between phrases and between sentences.
- Do not end Thai sentences with a period. The current files add periods, so remove them.
- Buttons: use a verb or a verb-object form, for example “เชื่อมต่อ Wallet” or “Swap”. Do not start a button with การ.
- Spell โทเค็น with ไม้ไต่คู้. Do not write โทเคน.

| English | Use | Do not use |
| --- | --- | --- |
| bridge (noun) | Bridge (Thai crypto users write Bridge in Latin letters. สะพาน is a literal translation.) | สะพาน |
| bridge (verb) | Bridge (Use Bridge as a verb, for example “Bridge ไปยัง {{chainName}}” and “กำลัง Bridge”.) | สร้างสะพาน |
| swap (noun) | Swap (Use Swap for a token-to-token trade. Use แลกเปลี่ยน only for the Exchange tab (term 5).) | การแลกเปลี่ยน |
| swap (verb) | Swap (Use Swap as a verb, for example “Swap โทเค็น” and “กำลัง Swap”.) | สลับ |
| exchange | แลกเปลี่ยน (This is the tab name that covers swap and bridge. ตลาดแลกเปลี่ยน means a centralized exchange.) | ตลาดแลกเปลี่ยน |
| cross-chain | ข้ามเชน (Example: “โอนข้ามเชน”. Keep Cross-Chain in Latin letters only inside product names.) | ข้ามโซ่ |
| gas | Gas (Keep Gas in Latin letters. The current widget mixes แก็ส and แก๊ส.) | แก็ส |
| gas fee / network fee | ค่า Gas / ค่าธรรมเนียมเครือข่าย (Use ค่า Gas where the text says gas fee. Use ค่าธรรมเนียมเครือข่าย for the Network cost label.) | ค่าน้ำมัน |
| slippage | Slippage (Max slippage is Slippage สูงสุด. The current widget mixes three Thai forms. MetaMask Support explains it as ค่าความคลาดเคลื่อน.) | การสูญเสีย |
| price impact | Price Impact (Keep Price Impact in Latin letters. Explain it in Thai in the tooltip. Rainbow th uses ผลกระทบของราคา.) | แรงกระแทกราคา |
| route | เส้นทาง (Use เส้นทาง for one path of a transfer, for example “เส้นทางที่ดีที่สุด”.) | ทางเดิน |
| quote | การเสนอราคา (ใบเสนอราคา means a paper quotation. Example: “ขอการเสนอราคาใหม่”.) | ใบเสนอราคา |
| chain / blockchain | เชน / บล็อกเชน (Use เชน in labels. Use บล็อกเชน only in explanations.) | โซ่ |
| network (synonym of chain in wallet UIs) | เครือข่าย (Use เครือข่าย where the English says network.) | เน็ตเวิร์ก |
| from chain / to chain (source / destination) | เชนต้นทาง / เชนปลายทาง (Use the same word for chain as term 13.) | เชนแหล่งที่มา / เชนจุดหมาย |
| token | โทเค็น (Thai users also say เหรียญ (coin). Use โทเค็น in the UI.) | โทเคน |
| native token (ETH on Ethereum, SOL on Solana) | โทเค็นดั้งเดิม (Example: “{{tokenSymbol}} คือโทเค็นดั้งเดิมของ {{chainName}}”.) | โทเค็นท้องถิ่น |
| stablecoin | Stablecoin (Keep Stablecoin in Latin letters.) | เหรียญเสถียร |
| wallet | Wallet (Keep Wallet in Latin letters. กระเป๋าสตางค์ means a purse. The current files use กระเป๋าเงิน.) | กระเป๋าสตางค์ |
| connect wallet / connect (button) | เชื่อมต่อ Wallet (Put one space before Wallet. The current widget has a broken space inside the Thai phrase.) | เชื่อมต่อ กระเป๋า |
| disconnect | ยกเลิกการเชื่อมต่อ (Use this form on the button.) | ตัดการเชื่อมต่อ |
| approve / token approval (ERC-20 allowance) | อนุมัติ / การอนุมัติโทเค็น (Example: “อนุมัติการใช้ {{tokenSymbol}}”.) | อนุญาต |
| sign / signature (wallet signature request) | เซ็น / ลายเซ็น (ป้าย means a signboard. ลงชื่อ can mean sign in. Use เซ็น for the action and ลายเซ็น for the signature.) | ป้าย |
| transaction | ธุรกรรม (Use ธุรกรรม for an onchain transaction.) | รายการ |
| transaction hash | แฮชธุรกรรม (Use the same word for transaction as term 24.) | รหัสการทำธุรกรรม |
| pending / completed / failed / refunded (transaction status words) | รอดำเนินการ / สำเร็จ / ไม่สำเร็จ / คืนเงินแล้ว (Use these short forms on status badges.) | ค้างอยู่ / เสร็จ |
| DEX | DEX (Keep DEX in Latin letters.) | ตลาดกระจายศูนย์ |
| aggregator | Aggregator (Keep Aggregator in Latin letters.) | ตัวรวบรวม |
| liquidity | สภาพคล่อง (ความเหลว means fluidity of a liquid. Use สภาพคล่อง, the Thai finance term.) | ความเหลว |
| yield | ผลตอบแทน (Use ผลตอบแทน for the return on a vault or a position.) | ผลผลิต |
| APY | APY (Keep APY in Latin letters.) | อัตราดอกเบี้ยต่อปี |
| vault | Vault (Keep Vault in Latin letters.) | ตู้นิรภัย |
| staking | Staking (Keep Staking in Latin letters. Rainbow uses a betting phrase.) | การวางเดิมพัน |
| deposit | ฝาก (Use ฝาก on buttons. เงินฝาก means a bank deposit.) | เงินฝาก |
| withdraw | ถอน (Use ถอน on buttons. ถอนตัว means to quit.) | ถอนตัว |
| limit order | Limit Order (Keep Limit Order in Latin letters.) | คำสั่งจำกัด |
| TWAP order / scheduled order | TWAP Order (Keep TWAP Order in Latin letters.) | คำสั่งตามเวลา |
| market cap | มูลค่าตลาด (Use มูลค่าตลาด in all strings.) | หมวกตลาด |
| refuel / get gas | รับ Gas (Use Gas as in term 7.) | รับแก็ส |
| airdrop | Airdrop (Keep Airdrop in Latin letters.) | การส่งทางอากาศ |
| points / XP | คะแนน / XP (Keep XP in Latin letters, for example “+50 XP”.) | แต้ม |
| quest / mission | ภารกิจ (Jumper says Missions in English. Use ภารกิจ for quest and for mission.) | เควส |
| rewards / claim (rewards) | รางวัล / เคลม (Use เคลม on the claim button.) | เรียกร้อง |
| portfolio | พอร์ตโฟลิโอ (Use พอร์ตโฟลิโอ for the page name.) | แฟ้มสะสมผลงาน |
| balance | ยอดคงเหลือ (ยอดเงิน means a cash amount. Use ยอดคงเหลือ for token balances.) | ยอดเงิน |
| max (button that fills the full balance) | สูงสุด (Use สูงสุด on the button that fills the full balance.) | แม็กซ์ |
| send / receive | ส่ง / รับ (ส่งออก means export. Use ส่ง and รับ on buttons and headers.) | ส่งออก |
| recipient / receiving address | ที่อยู่ผู้รับ (Use ที่อยู่ for an address. MetaMask th uses the old form แอดแดรส.) | — |
| minimum received | จำนวนที่ได้รับขั้นต่ำ (Use this exact label in the route details.) | รับต่ำสุด |
| fee (integrator fee, "Jumper fee") | ค่าธรรมเนียม (Write ค่าธรรมเนียม Jumper for the Jumper fee.) | ค่าบริการ |
| estimated time | เวลาโดยประมาณ (Use this label for the time that a route needs.) | เวลาประเมิน |
| high value loss (warning when a route loses a lot of value) | สูญเสียมูลค่าสูง (Keep the current widget title.) | มูลค่าสูงสูญหาย |
| on-ramp / buy with card | ซื้อด้วยบัตร (Example: “ซื้อคริปโตด้วยบัตร”.) | ออนแรมป์ |
| leaderboard | ตารางอันดับ (Use ตารางอันดับ for the page name.) | กระดานผู้นำ |
| perks | สิทธิพิเศษ (Use สิทธิพิเศษ for Jumper perks.) | ผลประโยชน์ข้างเคียง |
| earn (the product page where users earn yield) | สร้างรายได้ (Use this form for the page name.) | หาเงิน |
| trigger price (limit orders) | ราคา Trigger (Keep Trigger in Latin letters, as in other order terms.) | ราคาไก |
| expiry / expires (orders) | หมดอายุ / หมดอายุแล้ว (For expires in, write หมดอายุใน {{duration}}.) | สิ้นสุดอายุ |

### `tr` — Turkish

- Variant: Turkish (Türkiye). Binance.com has no Turkish Academy, because Turkish users use Binance TR, OKX TR, BtcTurk and Paribu. The evidence comes from MetaMask, Uniswap, OKX TR, ethereum.org and Turkish crypto glossaries.
- Register: siz in sentences ('Cüzdanınızı bağlayın', 'tekrar deneyin'); the bare verb stem on buttons ('Bağla', 'Onayla', 'Gönder'). Never 'sen' in sentences.
- Write buttons as the bare verb stem: 'Cüzdan bağla', 'Onayla', 'İmzala', 'Takas et', 'Köprüle'. Write sentences with 'siz': 'Cüzdanınızı bağlayın'.
- Add suffixes to tickers, acronyms, brand names and English loanwords after an apostrophe. Use the spoken form for vowel harmony: ETH'yi, DEX'e, Swap'ı, gas'ı, token'ları.
- Use sentence case for labels and titles: 'İşlem ayrıntıları', not 'İşlem Ayrıntıları'.
- Use Turkish letters and Turkish casing. The capital of 'i' is 'İ' and the capital of 'ı' is 'I': 'İşlem', 'IŞIK'.
- Name the action and add 'işlemi' in status text: 'Köprü işlemi tamamlandı', 'Swap işlemi başarısız oldu'.

| English | Use | Do not use |
| --- | --- | --- |
| bridge (noun) | köprü (pl. köprüler); tab and title: 'Köprü'; status: 'Köprü işlemi tamamlandı' (Use 'köprü' and replace the current button 'Gönder', which means 'Send'.) | Gönder; Bridge (as a plain label) |
| bridge (verb) | köprüle: button 'Köprüle'; 'köprüleniyor', 'köprülendi'; process noun 'köprüleme' (Do not use 'aktar' for a bridge, because it means a plain transfer.) | köprü kur; aktar (for the bridge action) |
| swap (noun) | swap (pl. swap'lar); tab and title: 'Swap'; status: 'Swap işlemi tamamlandı' (Keep 'Swap' as the tab name, as OKX TR does, because the Exchange page uses 'Takas'.) | Al-Sat; değiş tokuş |
| swap (verb) | takas et: button 'Takas et'; 'takas ediliyor', 'takas edildi'; sentence 'ETH'yi USDC ile takas edin' (Use 'takas et' for the verb, because 'Dönüştür' is the name of the Binance Convert product.) | değiştir; dönüştür; swap'la |
| exchange | title: 'Takas'; button: 'Takas et' (Do not use 'Borsa', which means a CEX, or 'Al-Sat', which means buy and sell.) | Al-Sat; Borsa; Exchange |
| cross-chain | zincirler arası: 'zincirler arası swap', 'zincirler arası transfer' (Use 'zincirler arası', as OKX TR and Uniswap do.) | çapraz zincir; cross-chain |
| gas | gas (with suffixes: gas'ı, gas'a) (Write 'gas' as OKX, Uniswap and CoinMarketCap do, although MetaMask writes 'gaz'.) | gaz; yakıt |
| gas fee / network fee | gas ücreti; ağ ücreti (Use 'ağ ücreti' for the network fee and replace the current 'Ağ maliyeti'.) | ağ maliyeti; gaz ücreti |
| slippage | kayma; 'Maks. kayma'; 'kayma toleransı' (Use 'kayma' in every string, although Uniswap keeps the English 'slippage'.) | slippage; Maksimum kayma oranı |
| price impact | fiyat etkisi (Do not use 'piyasa etkisi', because it means market impact.) | piyasa etkisi |
| route | rota (pl. rotalar); 'En iyi rota' (Use 'rota' for one path through bridges and DEXs.) | güzergah; yol |
| quote | teklif; 'Teklif edilen tutar'; 'En iyi teklif' (Use 'teklif', because 'alıntı' means a citation.) | alıntı; fiyat alıntısı |
| chain / blockchain | zincir (pl. zincirler): 'Zincir seç'; blokzincir for the technology (Use 'zincir' when the English says 'chain' and 'ağ' when the English says 'network'.) | chain; halka |
| network (synonym of chain in wallet UIs) | ağ (pl. ağlar); 'Tüm ağlar' (Use 'ağ' for the network selector and network fees, with suffixes such as '{{chain}} ağına'.) | şebeke |
| from chain / to chain (source / destination) | kaynak zincir / hedef zincir; short labels: 'Kaynak' / 'Hedef' (Use 'Gönderen' and 'Alıcı' only for wallet addresses, not for chains.) | Gönderen / Alıcı (for chains); alıcı zincir |
| token | token (pl. token'lar; with suffixes: token'ı, token'ları) (Do not use 'jeton', which is a game coin, or 'varlık', which means 'asset'.) | jeton; varlık (for a token) |
| native token (ETH on Ethereum, SOL on Solana) | yerel token; '{{chain}} ağının yerel token'ı' (Use 'yerel token' for the gas token of a chain, as MetaMask does.) | doğal token; ana para |
| stablecoin | stablecoin (pl. stablecoin'ler) (Use 'stablecoin', because the MetaMask form 'stabil kripto para' is too long for UI labels.) | stabil kripto para; sabit coin |
| wallet | cüzdan (pl. cüzdanlar) (Use 'cüzdan', as every Turkish source does.) | wallet; para kesesi |
| connect wallet / connect (button) | 'Cüzdan bağla'; short button: 'Bağla' (Use the transitive 'Bağla', because 'Bağlan' means 'connect yourself'.) | Bağlan; Cüzdanı Bağla |
| disconnect | 'Bağlantıyı kes' (Use 'Bağlantıyı kes', because disconnecting a wallet is not a log-out.) | Çıkış yap; Ayır |
| approve / token approval (ERC-20 allowance) | onayla / onay; '{{token}} harcamasını onayla'; 'harcama limiti' (Use 'onayla' for the allowance step and 'harcama limiti' for the approved amount.) | izin ver; yetkilendir |
| sign / signature (wallet signature request) | imzala / imza; 'İmza talebi'; 'İşlemi imzala' (Keep 'imzala' apart from 'onayla', because a signature and an approval are different wallet steps.) | onayla (for a signature) |
| transaction | işlem (pl. işlemler) (Use 'işlem', as every Turkish source does.) | transaksiyon; muamele |
| transaction hash | işlem hash'i (Keep 'hash' with an apostrophe suffix, because users see this word in block explorers.) | işlem özeti; işlem kimliği |
| pending / completed / failed / refunded (transaction status words) | Beklemede / Tamamlandı / Başarısız / İade edildi (Use the short forms on status chips and 'başarısız oldu' only in full sentences.) | Zaman aşımına uğradı (for failed); Geri ödeme yapıldı |
| DEX | DEX (pl. DEX'ler; DEX'te, DEX'e) (Keep the acronym and explain it as 'merkeziyetsiz borsa (DEX)' only in help text.) | merkeziyetsiz borsa (as a label) |
| aggregator | toplayıcı; 'likidite toplayıcı' (Use 'toplayıcı', as MetaMask and Uniswap do.) | agregatör; birleştirici |
| liquidity | likidite (Use 'likidite', as all sources do.) | nakit; akışkanlık |
| yield | getiri (Use 'getiri' for yield, as Uniswap does.) | verim; hasat |
| APY | APY (Keep the acronym 'APY', as Uniswap does.) | YBG; yıllık getiri yüzdesi (as a label) |
| vault | kasa (pl. kasalar) (Use 'kasa' as Uniswap does, but keep the protocol name when the vault has one.) | vault; hazine |
| staking | staking; 'stake et'; 'Stake edildi' (Do not use the MetaMask button text 'Pay', because it means 'share'.) | Pay; hisse |
| deposit | yatır / yatırma; 'Yatırma işlemi tamamlandı' (Use 'yatır' on the button and 'Para yatır' only for fiat deposits.) | depozito; teminat |
| withdraw | çek / çekme; 'Çekme işlemi tamamlandı' (Use 'çek' on the button and 'çekme işlemi' in status text.) | geri al; para çek (in DeFi screens) |
| limit order | limit emri (pl. limit emirleri); 'Limit fiyatı' (Use 'emir', because 'sipariş' means a shop order.) | limit siparişi; sınır emri |
| TWAP order / scheduled order | TWAP emri; zamanlanmış emir (Keep the acronym 'TWAP' and use 'emir' as for limit orders.) | planlı sipariş |
| market cap | piyasa değeri (Use 'piyasa değeri', as MetaMask and Uniswap do.) | pazar sermayesi; piyasa kapitalizasyonu |
| refuel / get gas | 'Gas al'; '{{chain}} ağında gas al' (Keep 'gas' from term 7 and replace the current 'Gaz al'.) | Gaz al; Yakıt doldur |
| airdrop | airdrop (pl. airdrop'lar) (Keep 'airdrop', as all sources do.) | hava indirmesi; bedava token |
| points / XP | puan; XP (Use 'puan', because 'nokta' means a dot.) | nokta |
| quest / mission | görev (pl. görevler) (Use 'görev' for every quest and mission.) | arayış; macera |
| rewards / claim (rewards) | ödüller; button: 'Talep et'; 'Ödülleri talep et' (Use 'Talep et', because the MetaMask form 'Al' also means 'Receive'.) | Al (for claim); hak iddia et |
| portfolio | portföy (Write 'Portföy' with 'ö', as Uniswap does.) | portfolio; portfoy |
| balance | bakiye; 'Toplam bakiye' (Use 'bakiye', because 'denge' means physical balance.) | denge; balans |
| max (button that fills the full balance) | Maks. (Use the short form on the button.) | MAKSİMUM; Tümü |
| send / receive | Gönder / Al (Use 'Gönder' and 'Al' on buttons and 'Alınacak' for the receive amount field.) | Yolla / Teslim al |
| recipient / receiving address | alıcı; 'alıcı adresi' (Use 'alıcı' for the person and 'alıcı adresi' for the address field.) | hedef kişi; lehtar |
| minimum received | Alınacak minimum (Use 'Alınacak', because the value is a future guarantee.) | Minimum alınan |
| fee (integrator fee, "Jumper fee") | ücret; 'Jumper ücreti'; 'Entegratör ücreti'; 'Sağlayıcı ücreti' (Use 'ücret' for every fee and write 'Entegratör' in Turkish spelling.) | Integrator ücreti; komisyon; maliyet |
| estimated time | Tahmini süre (Use 'Tahmini süre' for the duration, as MetaMask does.) | Tahmini zaman; Beklenen saat |
| high value loss (warning when a route loses a lot of value) | Yüksek değer kaybı (Keep the current widget text, because it is correct.) | Büyük kayıp değeri |
| on-ramp / buy with card | 'Kartla satın al'; 'Kripto satın al' (Name the action, because users do not know the word 'on-ramp'.) | rampa; on-ramp |
| leaderboard | Liderlik tablosu (Use 'Liderlik tablosu', as MetaMask does.) | Skor tahtası; Lider panosu |
| perks | avantajlar (Use 'avantajlar' for partner perks.) | imtiyazlar; ayrıcalık hakkı |
| earn (the product page where users earn yield) | Earn (page and product name); verb in sentences: 'kazan' (Keep 'Earn' as the page name and use 'kazan' only inside sentences.) | Kazan (as the page title); Kazanç |
| trigger price (limit orders) | tetikleme fiyatı (Use 'tetikleme fiyatı', as MetaMask does for orders.) | tetik fiyatı; başlatma fiyatı |
| expiry / expires (orders) | son geçerlilik; '{{duration}} içinde sona erer'; 'Süresi doldu' (Use 'son geçerlilik' for the label and 'süresi doldu' for the status, because 'vade' means a loan maturity.) | vade; zaman aşımı |

### `uk` — Ukrainian

- Variant: Ukrainian (Ukraine), 2019 orthography. 'Своп' and 'газ' are standard anglicisms in Ukrainian crypto UIs. For a bridge, written Ukrainian uses 'міст', and wallet UIs use 'кросчейн' for the action. No source found uses 'бридж'. Do not use Russian words, Russian spellings or Russian-style calques.
- Register: ви
- Address the user as 'ви'. Write 'ви' and 'ваш' in lowercase inside a sentence. Use the infinitive on a button ('Підключити гаманець', 'Обміняти') and the plural imperative in an instruction ('Підпишіть транзакцію').
- Inflect loanwords like native nouns: своп, свопу, свопом; газ, газу; токен, токена; міст, мосту. Write 'транзакція свопу', not 'своп транзакція'.
- Use the apostrophe U+02BC (ʼ) in all words: імʼя, обовʼязковий. Do not mix it with U+0027 (') or U+2019 (’). The widget uk.json mixes them.
- Check every term for Russian words and calques: проскальзування → прослизання, очки → бали, кошелек → гаманець, кроссчейн → кросчейн, аирдроп → ейрдроп.
- Keep Latin script for brand names, tickers and acronyms: Jumper, LI.FI, ETH, DEX, APY, XP, TWAP.
- Write 'кросчейн' as one word. Join it to a noun with a hyphen: 'кросчейн-переказ', 'кросчейн-своп'.

| English | Use | Do not use |
| --- | --- | --- |
| bridge (noun) | бридж (бриджу, бриджі, бриджів) for the protocol, for example 'бридж Stargate'; кросчейн-переказ for the action (compact tab label: 'Кросчейн') (Ukrainian crypto users say 'бридж'. No wallet UI uses 'міст' (Rabby uk uses 'Кросчейн'); only media articles do. The ticket asks to avoid the literal real-life word. Prefer 'кросчейн-переказ' when the text means the action.) | міст (reads as a river bridge in the UI); брідж |
| bridge (verb) | переказати між мережами (button: 'Переказати') (Use 'Переказ з {{from}} до {{to}} через {{tool}}' for the step details.) | бриджити; забриджити |
| swap (noun) | своп (свопу, свопом, свопи) (Rabby uk writes 'Свап' once; use 'своп'. Write 'транзакція свопу', not 'своп транзакція'.) | свап; обмінка |
| swap (verb) | обміняти (button: 'Обміняти') (Trust Wallet uses the noun 'своп' and the verb 'обміняти'.) | свопнути; поміняти |
| exchange | Обмін (Exchange tab and header title) ('Обмінник' means a currency exchange office. Use 'курс обміну' for exchange rate. Use 'біржа' for a centralized exchange ('Підключити біржу'). The DEX list follows term 27.) | Обмінник; Біржа (for the tab) |
| cross-chain | кросчейн (кросчейн-переказ, кросчейн-своп) ('Кроссчейн' with double 'с' is the Russian spelling. 'Міжланцюговий' is a literal calque.) | кроссчейн; міжланцюговий |
| gas | газ (газу) (MetaMask uk (legacy) has 'Пального використано'. Do not use 'пальне'.) | пальне |
| gas fee / network fee | комісія за газ (gas fee); комісія мережі (network fee) (Follow the English source. The widget uk.json uses 'Витрати мережі' for 'Network cost', which is also correct.) | плата за пальне; збір мережі |
| slippage | прослизання (label: 'Макс. прослизання') ('Проскальзування' is a calque of the Russian 'проскальзывание'. Rabby uk uses it once.) | проскальзування; ковзання |
| price impact | вплив на ціну (Rabby uk also writes 'Ціновий вплив'. Use 'вплив на ціну' only.) | ціновий удар |
| route | маршрут (Use 'Пріоритет маршруту' for 'Route priority'. The widget uk.json drops the noun ('Пріоритет').) | шлях |
| quote | котирування ('Квота' means a quota. The widget uk.json has 'запросіть нову квоту'.) | квота; цитата |
| chain / blockchain | мережа; блокчейн (Wallets use 'мережа' for chain. The widget uk.json uses the slang 'чейн'.) | чейн; ланцюг; ланцюжок |
| network (synonym of chain in wallet UIs) | мережа (Ukrainian UIs use one word for chain and network.) | сітка |
| from chain / to chain (source / destination) | мережа відправлення / мережа призначення; field labels 'З' / 'До' (The widget uk.json has 'В очікуванні чейна що приймає'. Use 'Очікування мережі призначення'.) | чейн що приймає |
| token | токен (gen. токена) (MetaMask and Rabby use the genitive 'токена'. The widget uk.json mixes 'токена' and 'токену'.) | токену (gen.); жетон |
| native token (ETH on Ethereum, SOL on Solana) | нативний токен (Use 'нативний токен мережі' when the sentence needs more context.) | рідний токен; власний токен |
| stablecoin | стейблкоїн (Rabby uk writes both 'стейблкоїни' and 'стейблкойнів'. Use 'коїн', as in 'біткоїн'.) | стабільна монета; стейблкойн |
| wallet | гаманець (gen. гаманця) ('Кошелек' is Russian.) | кошелек; кошельок |
| connect wallet / connect (button) | Підключити гаманець / Підключити ('Підʼєднати' is also correct, and the widget uk.json mixes both. Use the pair 'Підключити / Відключити'.) | Законектити; Приєднати |
| disconnect | Відключити (Pair it with 'Підключити'.) | Розʼєднати |
| approve / token approval (ERC-20 allowance) | Схвалити / схвалення токена ('Затвердити' sounds like approving a budget. MetaMask uk (legacy) and the widget uk.json use it.) | Затвердити; Апрувнути |
| sign / signature (wallet signature request) | Підписати / підпис (Use 'Підпишіть транзакцію свопу' for 'Sign swap transaction'.) | Розписатися |
| transaction | транзакція ('Угода' means a trade deal. The widget uk.json also uses 'операція'; use 'транзакція' only.) | угода; операція |
| transaction hash | хеш транзакції (Rabby uk uses 'Tx-хеш' in a compact label.) | геш |
| pending / completed / failed / refunded (transaction status words) | Очікує / Завершено / Не вдалося / Повернено (Use the same words in the activity list and in notifications.) | Ожидание; Провалено |
| DEX | DEX (long form: 'децентралізована біржа (DEX)') (Keep the acronym in Latin script.) | ДЕКС |
| aggregator | агрегатор (Use 'агрегатор ліквідності' for liquidity aggregator.) | збирач |
| liquidity | ліквідність (Use 'низька ліквідність' for low liquidity.) | плинність |
| yield | прибутковість (Rabby uk uses 'Дохідність'. Binance and Bankless UA use 'прибутковість'.) | врожайність; вихід |
| APY | APY (Keep the acronym in Latin script.) | річна процентна дохідність (in labels) |
| vault | сховище (Keep the protocol name in Latin script: 'сховище Morpho'.) | склеп; сейф |
| staking | стейкінг / внести в стейкінг ('Стейкинг' is the Russian spelling. 'Ставка' means a bet or a rate.) | ставка; стейкинг |
| deposit | Внести / депозит ('Депонувати' is bureaucratic. Binance uses it in one step.) | Депонувати |
| withdraw | Вивести / виведення ('Зняти' is for cash at an ATM.) | Зняти |
| limit order | лімітний ордер ('Замовлення' means a purchase order in a shop.) | лімітне замовлення |
| TWAP order / scheduled order | TWAP-ордер / запланований ордер (Keep 'TWAP' in Latin script.) | TWAP-замовлення |
| market cap | ринкова капіталізація (compact: 'Капіталізація') (Here 'cap' means capitalization, not a limit.) | ринковий ліміт |
| refuel / get gas | Отримати газ, e.g. 'Отримати газ у {{chain}}' (Keep the current form.) | Заправка; Заправити |
| airdrop | ейрдроп ('Аирдроп' follows the Russian spelling.) | аірдроп; аирдроп |
| points / XP | бали / XP ('Очки' is Russian. Keep 'XP' in Latin script.) | очки; поінти |
| quest / mission | місія (one task inside a mission: 'завдання') (Jumper calls them missions.) | квест |
| rewards / claim (rewards) | винагороди / Отримати (claim) (The current Jumper uk translation mixes 'Нагороди' and 'винагороди'. Use 'винагороди' only.) | Заявити; Претендувати |
| portfolio | портфель ('Портфоліо' means a design portfolio.) | портфоліо |
| balance | баланс (MetaMask uk (legacy) uses 'залишок' once in a sentence. Use 'баланс' in labels.) | залишок (as a label) |
| max (button that fills the full balance) | Макс. (Use the short form with a full stop.) | МАКС; Максимум (on the button) |
| send / receive | Надіслати / Отримати (The widget uk.json mixes 'Надіслати' and 'Відправити'. Use 'Надіслати' only.) | Відправити |
| recipient / receiving address | отримувач / адреса отримувача (Rabby uk uses both 'отримувача' and 'одержувача'. Use 'отримувач' only.) | одержувач; бенефіціар |
| minimum received | Мінімум до отримання ('Отримано' reads as a finished event. The label shows a guaranteed amount.) | Мінімальне отримання; Мін. отримано |
| fee (integrator fee, "Jumper fee") | комісія, e.g. 'Комісія Jumper', 'Комісія інтегратора' (Keep the product name in Latin script.) | збір; плата |
| estimated time | Орієнтовний час ('Розрахунковий час' is a calque of the Russian 'расчётное время'.) | Розрахунковий час |
| high value loss (warning when a route loses a lot of value) | Значна втрата вартості (Ukrainian says 'значна втрата', not 'висока втрата'.) | Висока втрата вартості |
| on-ramp / buy with card | Купити карткою / Купити криптовалюту (Do not show the term 'on-ramp' to users.) | Онрамп |
| leaderboard | Таблиця лідерів (Keep the current form.) | Лідерборд |
| perks | привілеї ('Пільги' means social benefits, for example for pensioners.) | перки; пільги |
| earn (the product page where users earn yield) | Заробіток (page name); заробляйте (verb), e.g. 'Заробляйте до {{apy}} APY' (Use 'Заробляйте XP' for 'Earn XP'.) | Прибуток |
| trigger price (limit orders) | ціна спрацьовування (Rabby uk uses 'Спрацьовування' for the Trigger tab.) | тригерна ціна; ціна тригера |
| expiry / expires (orders) | термін дії / 'Спливає через {{time}}' (Use 'Термін дії минув' for 'Expired'.) | експірація |

### `vi` — Vietnamese

- Variant: Vietnamese (Vietnam). MetaMask, Uniswap and Rabby translate swap and bridge ('Hoán đổi', 'Cầu nối'), and OKX translates bridge. This glossary follows these wallet UIs. They keep token, gas, stablecoin, airdrop, staking, vault and acronyms in Latin script.
- Register: bạn
- Write a button as a short verb phrase with no subject: 'Kết nối ví', 'Hoán đổi', 'Phê duyệt'. Do not put 'Hãy' or 'Vui lòng' on a button.
- Keep these terms in Latin script and lowercase inside a sentence: token, gas, stablecoin, airdrop, staking, vault. Keep acronyms as is: DEX, APY, XP, TWAP.
- Use sentence case. Capitalize only the first word and proper names: 'Kết nối ví', not 'Kết Nối Ví'.
- Use 'Đang …' for a state in progress and 'Đã …' for a finished state: 'Đang chờ xử lý', 'Đã hoàn tất'.
- Write 'trên {{chain}}' for 'on {{chain}}' and 'sang' for the target: 'Hoán đổi ETH sang USDC trên Base'.
- Never write 'cầu' alone for bridge. Always write 'cầu nối'. 'Đi cầu' means 'go to the toilet'.

| English | Use | Do not use |
| --- | --- | --- |
| bridge (noun) | cầu nối (tab and title: 'Cầu nối') (Use 'Cầu nối' for the protocol and the tab. Never write 'Cầu' alone: the current string 'Bắt đầu đi cầu' reads as 'go to the toilet'.) | cầu; cây cầu |
| bridge (verb) | chuyển qua cầu nối (button: 'Cầu nối'), e.g. 'Chuyển USDC qua cầu nối sang Base' (Use the verb phrase in sentences. Use the noun 'Cầu nối' on a button, as MetaMask does.) | đi cầu; bắc cầu |
| swap (noun) | hoán đổi (tab and title: 'Hoán đổi') (Most wallet UIs use 'Hoán đổi'. The current Latin 'Swap' does not match MetaMask, Uniswap or Rabby. Only OKX keeps 'Swap' as a tab.) | trao đổi; đổi chác |
| swap (verb) | hoán đổi, e.g. 'Hoán đổi ETH sang USDC' (Use 'sang' before the target token.) | đổi chác |
| exchange | Giao dịch (Exchange tab and header title only) (Uniswap uses 'Giao dịch' for its Trade tab. Outside the tab, 'giao dịch' means transaction. Use 'Tỷ giá' for exchange rate and 'sàn giao dịch' for a centralized exchange ('Kết nối sàn giao dịch'). The DEX list follows term 27.) | Hoán đổi; Sàn giao dịch (for the tab) |
| cross-chain | xuyên chuỗi, e.g. 'hoán đổi xuyên chuỗi' (Put 'xuyên chuỗi' after the noun.) | chuỗi chéo |
| gas | gas (Keep 'gas' in Latin script and lowercase inside a sentence: 'phí gas', 'không đủ gas'.) | xăng; khí đốt |
| gas fee / network fee | phí gas (gas fee); phí mạng (network fee or network cost) (Follow the English source: 'gas fee' gives 'phí gas', 'network fee' gives 'phí mạng'.) | phí xăng |
| slippage | trượt giá (label 'Trượt giá tối đa' for Max. slippage) (Use 'mức trượt giá' only when a sentence needs a noun for the setting value.) | độ trượt; sự trượt |
| price impact | tác động giá (warning 'Tác động giá cao') (Use the same term in the route details and in the warning.) | va chạm giá |
| route | lộ trình (The widget vi.json has 'Không có đường đi' and the typo 'Tuyền đường'. Use 'Không có lộ trình' and 'Ưu tiên lộ trình'.) | đường đi; tuyến đường |
| quote | báo giá ('Trích dẫn' means a citation. The widget vi.json has 'Số tiền trích dẫn'; use 'Số tiền báo giá'.) | trích dẫn |
| chain / blockchain | chuỗi; blockchain (Use 'chuỗi' in labels: 'Chọn chuỗi'. Keep 'blockchain' in Latin script. The widget vi.json mixes 'chain' and 'chuỗi'.) | chain; dây chuyền; xích |
| network (synonym of chain in wallet UIs) | mạng (Use 'mạng' where the English says network. Use 'chuỗi' where it says chain.) | mạng lưới (in short labels) |
| from chain / to chain (source / destination) | chuỗi nguồn / chuỗi đích; field labels 'Từ' / 'Đến' (The widget vi.json has 'Đạng chain đến' (typo and Latin word). Use 'Đang chờ chuỗi đích'.) | chain đến; chuỗi đến |
| token | token ('Mã thông báo' is a machine translation, and the widget vi.json uses it. Keep 'token' in Latin script.) | mã thông báo |
| native token (ETH on Ethereum, SOL on Solana) | token gốc (Write 'token gốc của mạng' when the sentence needs more context.) | token bản địa; mã thông báo gốc |
| stablecoin | stablecoin (MetaMask vi uses 'đồng ổn định', but Uniswap and Rabby keep 'stablecoin'. Crypto users say 'stablecoin'.) | đồng ổn định |
| wallet | ví (The current 'Wallet connected' string stays in English. Use 'Đã kết nối ví'.) | ví tiền; wallet |
| connect wallet / connect (button) | Kết nối ví / Kết nối (Use 'Kết nối ví {{chain}}' for a wallet of one chain.) | Liên kết ví |
| disconnect | Ngắt kết nối (Use the same verb for a wallet and for a site.) | Hủy kết nối |
| approve / token approval (ERC-20 allowance) | Phê duyệt / phê duyệt token; 'Phê duyệt chi tiêu {{token}}' (The widget vi.json has 'Sự cho phép không đủ' for Insufficient allowance. Use 'Hạn mức phê duyệt không đủ'.) | Chấp thuận; Đồng ý; Sự cho phép |
| sign / signature (wallet signature request) | Ký / chữ ký; 'Yêu cầu chữ ký' ('Đăng ký' means sign up. Use 'Ký giao dịch' on the action step.) | Đăng ký; Ký tên |
| transaction | giao dịch (Use 'lệnh' only for orders (term 36).) | lệnh (for a transaction) |
| transaction hash | mã băm giao dịch (compact: 'Tx hash') (Use 'Tx hash' only where the space is short.) | băm |
| pending / completed / failed / refunded (transaction status words) | Đang chờ xử lý / Đã hoàn tất / Thất bại / Đã hoàn tiền (The widget vi.json has 'Đã Refund'. Use 'Đã hoàn tiền'.) | Đã Refund; Treo |
| DEX | DEX (long form: 'sàn giao dịch phi tập trung') (Use the long form once in help text. Then use 'DEX'.) | sàn phi tập trung (in short labels) |
| aggregator | trình tổng hợp, e.g. 'trình tổng hợp thanh khoản', 'trình tổng hợp cầu nối' (OKX uses 'bộ tổng hợp', but MetaMask, Rabby and Uniswap use 'trình tổng hợp'.) | bộ gom |
| liquidity | thanh khoản (Use 'thanh khoản thấp' for low liquidity.) | tính lỏng |
| yield | lợi suất (Use 'Lợi suất ước tính' for Estimated yield.) | sản lượng; năng suất |
| APY | APY (Keep the acronym. Spell it out only in help text.) | lãi suất phần trăm hằng năm (in labels) |
| vault | vault (Keep 'vault' in Latin script and lowercase inside a sentence.) | kho tiền; két sắt |
| staking | staking (verb: stake) ('Đặt cược' means betting. MetaMask vi uses 'ký gửi', but Rabby and Binance keep 'staking'.) | đặt cược; ký gửi |
| deposit | Nạp ('Đặt cọc' means a security deposit.) | Đặt cọc; Gửi tiền |
| withdraw | Rút (Write 'Rút về {{chain}}' when the sentence names a target.) | Thu hồi |
| limit order | lệnh giới hạn ('Đơn hàng' means a shop order.) | đơn hàng giới hạn |
| TWAP order / scheduled order | lệnh TWAP / lệnh định kỳ (Keep 'TWAP' in Latin script. Use 'lệnh định kỳ' for a scheduled order.) | đơn hàng TWAP |
| market cap | vốn hóa thị trường (compact: 'Vốn hóa') (Here 'cap' means capitalization, not a limit.) | giới hạn thị trường |
| refuel / get gas | Nhận gas, e.g. 'Nhận gas trên {{chain}}' (The widget vi.json has 'Thiết lập gas', which means 'set up gas'.) | Thiết lập gas; Tiếp nhiên liệu |
| airdrop | airdrop (Users say 'săn airdrop'. MetaMask vi uses 'tặng thưởng', which hides the term.) | tặng thưởng; thả dù |
| points / XP | điểm / XP (Keep 'XP' in Latin script: '{{xp}} XP'.) | điểm số |
| quest / mission | nhiệm vụ (Use 'nhiệm vụ' for a mission. Use 'yêu cầu' for one task inside a mission.) | sứ mệnh; cuộc phiêu lưu |
| rewards / claim (rewards) | phần thưởng / Nhận (claim button: 'Nhận thưởng') ('Yêu cầu' means request, not claim.) | Yêu cầu; Đòi |
| portfolio | danh mục (long form: 'danh mục đầu tư') (Use the short form in navigation.) | cặp hồ sơ |
| balance | số dư ('Cân bằng' means equilibrium.) | cân bằng |
| max (button that fills the full balance) | Tối đa (Use 'TỐI ĐA' only when the design needs capitals.) | Lớn nhất |
| send / receive | Gửi / Nhận (Use 'Bạn trả' and 'Bạn nhận' for 'You pay' and 'You get'.) | Chuyển phát |
| recipient / receiving address | người nhận / địa chỉ người nhận ('Người thụ hưởng' is banking language.) | người thụ hưởng |
| minimum received | Tối thiểu nhận được (Keep this word order in route details.) | Nhận được tối thiểu |
| fee (integrator fee, "Jumper fee") | phí, e.g. 'Phí Jumper', 'Phí tích hợp' (Keep the product name in Latin script.) | hoa hồng; lệ phí |
| estimated time | Thời gian ước tính (Use '~{{time}}' in a compact route card.) | — |
| high value loss (warning when a route loses a lot of value) | Tổn thất giá trị lớn (Use it as the warning title. Give the amount of the loss in the message.) | Mất giá trị cao |
| on-ramp / buy with card | Mua bằng thẻ / Mua tiền mã hóa (Use 'tiền mã hóa' for crypto in purchase flows.) | Đường dốc lên; on-ramp |
| leaderboard | Bảng xếp hạng (Use the same term on the profile page and on campaign pages.) | Bảng dẫn đầu |
| perks | Ưu đãi (Use 'Ưu đãi' for partner perks. MetaMask vi uses 'Quyền lợi' for 'Benefits', which is a different concept.) | Lợi ích phụ |
| earn (the product page where users earn yield) | Sinh lời (page name); kiếm (verb in a sentence), e.g. 'Kiếm tới {{apy}} APY' (Use 'Sinh lời' as the page name. Use 'Nhận {{xp}} XP' for 'Earn XP'.) | Kiếm tiền |
| trigger price (limit orders) | Giá kích hoạt (Use the same term in the order form and in the order list.) | Giá trigger |
| expiry / expires (orders) | Hết hạn / 'Hết hạn sau {{time}}' ('Đáo hạn' means the maturity of a bond.) | Đáo hạn |

### `zh` — Chinese

- Variant: Chinese (Simplified, mainland), zh-CN. Confirmed: the current zh files are Simplified, and MetaMask, Uniswap, PancakeSwap, and Rabby ship Simplified as zh-CN. If zh-TW is added, translate it separately. Do not convert by script.
- Register: Neutral written Chinese. Use 您 where a pronoun is necessary, and drop the pronoun where possible. Use 请 for requests.
- Buttons: use a short verb or verb-object form, for example “连接钱包”, “兑换”, “跨链”. Do not use 请 on buttons.
- Use full-width Chinese punctuation (，。：；？！（）) in Chinese text. Do not put 。 at the end of buttons, labels, or titles.
- Put a half-width space between Chinese text and Latin words, numbers, or {{variables}}, for example “Gas 费” and “在 {{chainName}} 上”.
- Keep Gas, DEX, APY, TWAP, XP, token symbols, and chain names in Latin letters.
- Do not create zh-TW by script conversion. zh-TW uses different terms, for example 路徑, 網路, 收款人 in Uniswap zh-TW.

| English | Use | Do not use |
| --- | --- | --- |
| bridge (noun) | 跨链桥 (Use 跨链桥 for the bridge protocol, for example “已启用的跨链桥”. For the action, use term 2.) | 桥梁 |
| bridge (verb) | 跨链 (Use 跨链 on buttons and for the action, for example “跨链至 {{chainName}}”. MetaMask uses 桥接, but most sources use 跨链.) | 架桥 |
| swap (noun) | 兑换 (Use 兑换 for a token-to-token trade.) | 交换 |
| swap (verb) | 兑换 (On buttons, write 兑换. For progress, write 正在兑换.) | 交换 / 互换 |
| exchange | 兑换 (This is the tab name that covers swap and bridge. 交易所 means a centralized exchange, so do not use it.) | 交易所 |
| cross-chain | 跨链 (Example: “跨链兑换”.) | 交叉链 |
| gas | Gas (Keep Gas in Latin letters. The current widget uses 燃气费, and MetaMask uses 燃料. Chinese crypto users say Gas.) | 燃气 |
| gas fee / network fee | Gas 费 / 网络费用 (Use Gas 费 where the text says gas fee. Use 网络费用 for the Network cost label.) | 燃气费 |
| slippage | 滑点 (Max slippage is 最大滑点. Binance Academy uses 滑动价差, but wallet UIs use 滑点. The current widget has a machine translation error.) | 低幻灯片宽度 |
| price impact | 价格影响 (Use 价格影响 in all strings. The current widget uses 价格冲击.) | 价格冲击 |
| route | 路由 (Use 路由 for one path of a transfer, for example “最佳路由”.) | 路线 |
| quote | 报价 (引用 means a citation. Use 报价 for a price quote, for example “获取新报价”.) | 引用 |
| chain / blockchain | 链 / 区块链 (Use 链 in labels. Use 区块链 only in explanations.) | 链条 |
| network (synonym of chain in wallet UIs) | 网络 (网路 is a Taiwan form. Use 网络 in zh-CN.) | 网路 |
| from chain / to chain (source / destination) | 源链 / 目标链 (In short headers, write 从 and 至.) | 来源链 / 接收链 |
| token | 代币 (令牌 means an access token. Use 代币 for crypto tokens.) | 令牌 |
| native token (ETH on Ethereum, SOL on Solana) | 原生代币 (Users also say 主币 in chat. Use 原生代币 in the UI.) | 本地代币 |
| stablecoin | 稳定币 (Use 稳定币 in all strings.) | 稳定货币 |
| wallet | 钱包 (Use 钱包 for all crypto wallets.) | 皮夹 |
| connect wallet / connect (button) | 连接钱包 (The current widget uses 关联钱包 on the button. Use 连接钱包. For the status, write 钱包已连接.) | 关联钱包 |
| disconnect | 断开连接 (Use 断开连接 on the button.) | 取消连接 |
| approve / token approval (ERC-20 allowance) | 授权 / 代币授权 (MetaMask and Uniswap use 批准. Rabby, PancakeSwap, and revoke tools use 授权, the word that Chinese crypto users say.) | 同意 |
| sign / signature (wallet signature request) | 签名 (Write 签名请求 for the wallet request screen.) | 签字 |
| transaction | 交易 (Use 交易 for an onchain transaction.) | 事务 |
| transaction hash | 交易哈希 (Use 交易哈希 in all strings.) | 交易散列 |
| pending / completed / failed / refunded (transaction status words) | 待处理 / 已完成 / 失败 / 已退款 (Use these short forms on status badges. MetaMask and PancakeSwap use 待定 for pending.) | 未决 |
| DEX | DEX (Keep DEX in Latin letters. Write 去中心化交易所 (DEX) only in explanations.) | 链上交易所 |
| aggregator | 聚合器 (Use 聚合器 for the product type, for example “流动性聚合器”.) | 汇总器 |
| liquidity | 流动性 (Use 流动性 in all strings.) | 流通性 |
| yield | 收益 (Use 收益 for the return on a vault or a position. Use 收益率 for a rate.) | 产量 |
| APY | APY (Keep APY in Latin letters, for example “最高 10% APY”.) | 年化百分率收益 |
| vault | 金库 (Use 金库 for a DeFi vault.) | 保险库 |
| staking | 质押 (押注 means a bet. Use 质押 for staking.) | 押注 |
| deposit | 存入 (存款 means a bank deposit. Use 存入 for funds that go into a vault or a position.) | 存款 |
| withdraw | 提取 (Use 提取 for funds that leave a vault or a position.) | 撤回 |
| limit order | 限价单 (Use 限价 for the Limit tab and the limit price.) | 限制订单 |
| TWAP order / scheduled order | TWAP 订单 (Keep TWAP in Latin letters.) | 时间加权平均价格订单 |
| market cap | 市值 (Use 市值 in all strings.) | 市场上限 |
| refuel / get gas | 获取 Gas (The current Jumper text uses 兑换燃气费. Use Gas as in term 7.) | 兑换燃气费 |
| airdrop | 空投 (Use 空投 in all strings.) | 空中投放 |
| points / XP | 积分 / XP (Keep XP in Latin letters, for example “+50 XP”.) | 点数 / 经验值 |
| quest / mission | 任务 (Jumper says Missions in English. Use 任务 for quest and for mission.) | 使命 |
| rewards / claim (rewards) | 奖励 / 领取 (Use 领取 on the claim button.) | 索取 |
| portfolio | 投资组合 (Use 投资组合 for the page name.) | 文件夹 |
| balance | 余额 (平衡 means equilibrium. Use 余额 for token balances.) | 平衡 |
| max (button that fills the full balance) | 最大 (Use 最大 on the button that fills the full balance. Rabby uses 全部 on its send screen.) | — |
| send / receive | 发送 / 接收 (Use these forms on buttons and headers.) | 寄送 / 收取 |
| recipient / receiving address | 接收地址 (收件人 means a mail recipient. Use 接收地址 for the field.) | 收件人 |
| minimum received | 最少收到 (Use this exact label in the route details. MetaMask uses 最低收款金额, and PancakeSwap uses 最小获得量.) | — |
| fee (integrator fee, "Jumper fee") | 手续费 (Write Jumper 手续费 for the Jumper fee and 集成商手续费 for the integrator fee. Uniswap uses 费用.) | — |
| estimated time | 预计时间 (Use this label for the time that a route needs.) | 估计时间 |
| high value loss (warning when a route loses a lot of value) | 价值损失过高 (Say that the value loss is too high.) | 高价值损失 |
| on-ramp / buy with card | 用银行卡购买 (For a general buy action, write 购买加密货币.) | 入口匝道 |
| leaderboard | 排行榜 (Use 排行榜 for the page name.) | 领导板 |
| perks | 福利 (Use 福利 for Jumper perks, for example “领取福利”.) | 额外津贴 |
| earn (the product page where users earn yield) | 赚取 (Use 赚取 for the page name and in sentences, for example “赚取最高 10% APY”.) | 赚钱 |
| trigger price (limit orders) | 触发价格 (Use this label for the price that starts a limit order.) | 扳机价格 |
| expiry / expires (orders) | 到期时间 / 已过期 (For expires in, write {{duration}} 后到期.) | 期满 |
