# Bengali (`bn`)

Read [TRANSLATING.md](../../TRANSLATING.md) first.

- Variant: Bengali (Bangla) in standard Bengali script, for readers in Bangladesh and West Bengal. Few wallets ship Bengali; MetaMask bn is a small legacy file. The evidence comes from ethereum.org bn, Bitcoin.com bn, Bitget Wallet bn and KuCoin bn. Crypto terms are transliterated. Everyday actions use Bengali words (লেনদেন, অনুমোদন, স্বাক্ষর).
- Register: আপনি
- Transliterate crypto terms into Bengali script: সোয়াপ, ব্রিজ, গ্যাস, স্লিপেজ, টোকেন, ওয়ালেট. Do not use সেতু or উদ্ধৃতি. Use 'বিনিময়' only in 'বিনিময় হার' (exchange rate).
- Use the Bengali word where wallets already translate an everyday action: লেনদেন, অনুমোদন, স্বাক্ষর, পাঠান.
- Keep Latin script for brand names, tickers and acronyms: Jumper, LI.FI, ETH, DEX, APY, XP. Do not transliterate brand names; the widget bn.json has 'লি.ফাই'.
- Write a crypto action as the loanword + 'করুন': 'সোয়াপ করুন', 'ব্রিজ করুন', 'কানেক্ট করুন'.
- Use one spelling per loanword: 'সোয়াপ', not 'সোওয়াপ'.
- End a full sentence with '।'. Do not put an end mark on a button or a label.

## Glossary

| # | English | Use | Do not use |
| --- | --- | --- | --- |
| 1 | bridge (noun) | ব্রিজ (ethereum.org bn uses 'সেতু', but crypto media and wallets use 'ব্রিজ'.) | সেতু |
| 2 | bridge (verb) | ব্রিজ করুন (Use 'আবার ব্রিজ করুন' for 'Bridge again'.) | সেতু পার করুন |
| 3 | swap (noun) | সোয়াপ (The widget bn.json mixes 'সোওয়াপ' and 'সোয়াপ'. Use 'সোয়াপ' only.) | সোওয়াপ; বিনিময় |
| 4 | swap (verb) | সোয়াপ করুন, e.g. 'ETH থেকে USDC-তে সোয়াপ করুন' (Put the token names before the verb.) | বিনিময় করুন |
| 5 | exchange | এক্সচেঞ্জ (Exchange tab and header title) (Keep the tab different from 'সোয়াপ'. Use 'বিনিময় হার' for exchange rate, as the widget bn.json does. Use 'এক্সচেঞ্জ কানেক্ট করুন' for 'Connect exchange' (a centralized exchange). The DEX list follows term 27.) | সোয়াপ (for the tab) |
| 6 | cross-chain | ক্রস-চেইন (Keep the hyphen.) | আন্তঃশৃঙ্খল |
| 7 | gas | গ্যাস (Use 'অপর্যাপ্ত গ্যাস' for 'Insufficient gas'.) | জ্বালানি |
| 8 | gas fee / network fee | গ্যাস ফি (gas fee); নেটওয়ার্ক ফি (network fee) ('গ্যাসের দাম' is the gas price, which is a different setting.) | গ্যাসের দাম (for a fee) |
| 9 | slippage | স্লিপেজ (label: 'সর্বোচ্চ স্লিপেজ') (Use the same term in settings and in error messages.) | পিছলে যাওয়া |
| 10 | price impact | প্রাইস ইমপ্যাক্ট (Use the same term in the route details and in the warning.) | মূল্য প্রভাব |
| 11 | route | রুট (label: 'রুট অগ্রাধিকার') (Use 'কোনো রুট পাওয়া যায়নি' for 'No routes available'. The widget bn.json drops the negative.) | পথ |
| 12 | quote | কোটেশন ('উদ্ধৃতি' means a literary quotation, and the widget bn.json uses it. 'কোট' also means a coat.) | উদ্ধৃতি; কোট |
| 13 | chain / blockchain | চেইন; ব্লকচেইন ('শৃঙ্খল' means a metal chain.) | শৃঙ্খল |
| 14 | network (synonym of chain in wallet UIs) | নেটওয়ার্ক (Use 'নেটওয়ার্ক' where the English says network.) | জাল |
| 15 | from chain / to chain (source / destination) | উৎস চেইন / গন্তব্য চেইন; field labels 'থেকে' / 'গন্তব্য' (The widget bn.json uses 'প্রতি' for 'To'. 'প্রতি' means 'per'.) | প্রতি (for the 'To' label) |
| 16 | token | টোকেন (Use 'টোকেনগুলো' only when the plural is necessary.) | প্রতীক |
| 17 | native token (ETH on Ethereum, SOL on Solana) | নেটিভ টোকেন ('স্থানীয়' means local.) | স্থানীয় টোকেন |
| 18 | stablecoin | স্টেবলকয়েন (Spell 'কয়েন' as in 'বিটকয়েন'.) | স্থিতিশীল মুদ্রা |
| 19 | wallet | ওয়ালেট ('মানিব্যাগ' means a leather purse.) | মানিব্যাগ |
| 20 | connect wallet / connect (button) | ওয়ালেট কানেক্ট করুন / কানেক্ট করুন (MetaMask bn (legacy) and the widget bn.json use 'সংযুক্ত করুন', which is also correct. Use 'কানেক্ট' only, so it pairs with 'ডিসকানেক্ট'.) | সংযোগ স্থাপন করুন |
| 21 | disconnect | ডিসকানেক্ট করুন (Pair it with 'কানেক্ট করুন'.) | সংযোগ বিচ্ছিন্ন করুন |
| 22 | approve / token approval (ERC-20 allowance) | অনুমোদন করুন / টোকেন অনুমোদন (Users say 'অ্যাপ্রুভ' in chat, but the Bengali wallet UI uses 'অনুমোদন'.) | মঞ্জুর করুন |
| 23 | sign / signature (wallet signature request) | স্বাক্ষর করুন / স্বাক্ষর ('সাইন ইন' means log in.) | সাইন ইন করুন |
| 24 | transaction | লেনদেন (ethereum.org bn uses 'ট্রানজ্যাকশন', but most sources use 'লেনদেন'. Use 'লেনদেন' only.) | কারবার |
| 25 | transaction hash | লেনদেনের হ্যাশ (Use 'হ্যাশ', because the block explorer shows this word.) | লেনদেনের আইডি |
| 26 | pending / completed / failed / refunded (transaction status words) | পেন্ডিং / সম্পন্ন হয়েছে / ব্যর্থ হয়েছে / রিফান্ড হয়েছে (MetaMask bn uses 'বাকি', which means 'remaining' or 'due'. The widget bn.json has 'ফেরত করা হয়েছে', which is not correct Bengali.) | বাকি; ফেরত করা হয়েছে |
| 27 | DEX | DEX (long form: 'বিকেন্দ্রীকৃত এক্সচেঞ্জ (DEX)') (Keep the acronym in Latin script.) | ডেক্স |
| 28 | aggregator | অ্যাগ্রিগেটর (Use 'লিকুইডিটি অ্যাগ্রিগেটর' for liquidity aggregator.) | সমষ্টিকারী |
| 29 | liquidity | লিকুইডিটি ('তরলতা' means physical fluidity.) | তরলতা |
| 30 | yield | ইল্ড ('ফলন' means a crop yield. KuCoin bn uses it ('ফলন পণ্য').) | ফলন |
| 31 | APY | APY (Keep the acronym in Latin script.) | বার্ষিক শতাংশ ফলন |
| 32 | vault | ভল্ট (Keep the protocol name in Latin script: 'Morpho ভল্ট'.) | সিন্দুক |
| 33 | staking | স্টেকিং / স্টেক করুন ('বাজি' means a bet.) | বাজি ধরা |
| 34 | deposit | ডিপোজিট করুন / ডিপোজিট ('আমানত' is a bank deposit. 'জমা করুন' is also understood; do not mix the two.) | আমানত |
| 35 | withdraw | উইথড্র করুন ('প্রত্যাহার' means to revoke or recall.) | প্রত্যাহার করুন |
| 36 | limit order | লিমিট অর্ডার ('আদেশ' means a command.) | সীমা আদেশ |
| 37 | TWAP order / scheduled order | TWAP অর্ডার / শিডিউলড অর্ডার (Keep 'TWAP' in Latin script.) | নির্ধারিত আদেশ |
| 38 | market cap | মার্কেট ক্যাপ (Use the same term in token details and in sort options.) | বাজার মূলধন |
| 39 | refuel / get gas | গ্যাস পান, e.g. '{{chain}}-এ গ্যাস পান' (Keep the current form.) | জ্বালানি নিন |
| 40 | airdrop | এয়ারড্রপ (Keep the loanword.) | বিনামূল্যে বিতরণ |
| 41 | points / XP | পয়েন্ট / XP ('নম্বর' means exam marks. Keep 'XP' in Latin script.) | নম্বর |
| 42 | quest / mission | মিশন ('অভিযান' means an expedition.) | অভিযান |
| 43 | rewards / claim (rewards) | রিওয়ার্ড / ক্লেম করুন ('দাবি' is a legal claim. KuCoin bn uses both 'রিওয়ার্ড' and 'পুরস্কার'; use 'রিওয়ার্ড' only.) | দাবি করুন |
| 44 | portfolio | পোর্টফোলিও (Keep the loanword.) | সম্পদ তালিকা |
| 45 | balance | ব্যালেন্স ('ভারসাম্য' means equilibrium.) | ভারসাম্য |
| 46 | max (button that fills the full balance) | সর্বোচ্চ (MetaMask bn (legacy) uses 'সর্বাধিক'. Use 'সর্বোচ্চ' only.) | — |
| 47 | send / receive | পাঠান / গ্রহণ করুন (The widget bn.json uses 'রিসিভিং'. Use 'গ্রহণ করা হচ্ছে'.) | প্রেরণ করুন |
| 48 | recipient / receiving address | প্রাপক / প্রাপকের ঠিকানা ('গ্রাহক' means a customer.) | গ্রাহক |
| 49 | minimum received | ন্যূনতম প্রাপ্ত পরিমাণ (The label shows a guaranteed amount, so name the amount.) | ন্যূনতম প্রাপ্তি |
| 50 | fee (integrator fee, "Jumper fee") | ফি, e.g. 'Jumper ফি', 'ইন্টিগ্রেটর ফি' (Keep the product name in Latin script.) | মাশুল |
| 51 | estimated time | আনুমানিক সময় (Use '~{{time}}' in a compact route card.) | — |
| 52 | high value loss (warning when a route loses a lot of value) | মূল্যের বড় ক্ষতি (The widget bn.json uses the literal form, which reads as 'high-price loss'.) | উচ্চ মূল্য ক্ষতি |
| 53 | on-ramp / buy with card | কার্ড দিয়ে কিনুন / ক্রিপ্টো কিনুন (Do not show the term 'on-ramp' to users.) | অন-র‍্যাম্প |
| 54 | leaderboard | লিডারবোর্ড (Keep the loanword.) | নেতৃত্ব তালিকা |
| 55 | perks | সুবিধা ('সুবিধা' is the everyday Bengali word for benefits. Bengali users do not say 'perks'.) | পার্কস |
| 56 | earn (the product page where users earn yield) | Earn (page name, Latin script); আয় করুন (verb), e.g. '{{apy}} পর্যন্ত APY আয় করুন' (KuCoin bn uses the formal 'উপার্জন'. Bitget Wallet bn keeps 'Earn' in Latin script as a product name.) | উপার্জন |
| 57 | trigger price (limit orders) | ট্রিগার প্রাইস (Keep the loanword.) | উদ্দীপক মূল্য |
| 58 | expiry / expires (orders) | মেয়াদ / '{{time}} পরে মেয়াদ শেষ হবে' (Use 'মেয়াদ শেষ' for 'Expired'.) | সমাপ্তি |

## More terms

These terms are in use in the current texts. Use them for the same concepts.

| English | Use |
| --- | --- |
| 7d / 30d (APY window) | 7 দিন / 30 দিন ('APY 7 দিন', 'গত 7 দিনের APY দেখুন'.) |
| activity (XP activity, account activity) | অ্যাক্টিভিটি (Tabs and goals: 'অ্যাক্টিভিটি লক্ষ্য'.) |
| allowance (ERC-20) | অনুমোদন (Same word as term 22: 'অপর্যাপ্ত অনুমোদন', '{{tokenSymbol}} খরচ অনুমোদন করুন'.) |
| amount-card labels: Send / Receive / You pay / Sell / Buy | পাঠানো / গ্রহণ / আপনার পেমেন্ট / বিক্রি / কেনা (Labels, not buttons, so no 'করুন'. Matches the jumper-frontend transaction types and order columns. Buttons stay 'পাঠান', 'কিনুন'.) |
| Appearance / Light / Dark / System (theme) | থিম / লাইট / ডার্ক / সিস্টেম (Not 'অন্ধকার'.) |
| asset | অ্যাসেট (Filters, labels, tooltips: 'অ্যাসেট অনুযায়ী', 'টোকেনাইজড অ্যাসেট'. Not 'সম্পদ'.) |
| Auto (slippage) | অটো (Short label. Not 'স্বয়ংক্রিয়' on buttons; 'স্বয়ংক্রিয়ভাবে' stays for the adverb in sentences.) |
| bookmark | বুকমার্ক / বুকমার্ক করুন ('বুকমার্ক করা ওয়ালেট', 'বুকমার্ক যোগ করুন'.) |
| cancel / cancelled | বাতিল করুন / বাতিল করা হয়েছে (Orders, transactions and dialog buttons.) |
| cash (fiat deposit by card) | ক্যাশ ('ক্যাশ দিয়ে ডিপোজিট করুন'. Not 'নগদ', which is also a mobile money brand in Bangladesh.) |
| Clear / Clear filters / Clear all | সরান / ফিল্টার সরান / সব সরান (Not 'মুছুন', which is for delete ('নোটিফিকেশন মুছুন').) |
| contract (smart contract) | কন্ট্রাক্ট ('কন্ট্রাক্ট দেখুন', 'স্মার্ট কন্ট্রাক্ট এক্সপ্লয়েট'.) |
| convert / conversion | কনভার্ট করুন / কনভার্শন ('কনভার্শন সম্পন্ন হয়েছে'. Not 'রূপান্তর'.) |
| count classifier | {{count}}টি (Countable items take 'টি' ('{{count}}টি টোকেন'). Time units do not ('{{count}} দিন বাকি'). The one and other forms are the same.) |
| currency (fiat) | মুদ্রা ('মুদ্রা খুঁজুন'.) |
| details | বিবরণ ('লেনদেনের বিবরণ', 'বিবরণ দেখুন'.) |
| Dismiss | বাদ দিন (Clear stays 'সরান'; Delete stays 'মুছুন'.) |
| do your own research | নিজে রিসার্চ করুন ('এগিয়ে যাওয়ার আগে সবসময় নিজে রিসার্চ করে নিন'.) |
| Done (button) | সম্পন্ন (The status 'Completed' is 'সম্পন্ন হয়েছে' (term 26).) |
| dust / dust tokens | ডাস্ট / ডাস্ট টোকেন ('ডাস্ট কনভার্ট করুন', 'কনভার্টযোগ্য ডাস্ট'. Not 'ধুলো'.) |
| est. received | আনুমানিক প্রাপ্ত পরিমাণ (Pairs with 'ন্যূনতম প্রাপ্ত পরিমাণ' (term 49).) |
| exchange (centralized exchange, CEX) | এক্সচেঞ্জ (Same word as term 5, as the term 5 note says: 'এক্সচেঞ্জ ওয়ালেট', 'এক্সচেঞ্জের দেউলিয়া হওয়ার ঝুঁকি'.) |
| Exchange from / Exchange to (token selection titles) | এক্সচেঞ্জের উৎস / এক্সচেঞ্জের গন্তব্য (Uses term 5 and term 15 (উৎস / গন্তব্য).) |
| execute / execution | এক্সিকিউট / এক্সিকিউশন ('সবচেয়ে কম এক্সিকিউশন সময়'.) |
| explorer | এক্সপ্লোরার ('এক্সপ্লোরারে দেখুন'.) |
| filled / partially filled (order status) | ফিল হয়েছে / আংশিক ফিল হয়েছে (Column header 'Filled' is 'ফিল'.) |
| funds | ফান্ড ('আপনার ফান্ড হারিয়ে যাবে', 'ফান্ড উইথড্র করার সময়'. Balance stays 'ব্যালেন্স' (term 45).) |
| idle (tokens, assets) | অব্যবহৃত ('আপনার অব্যবহৃত টোকেন'. Not 'অলস' (lazy).) |
| invalid | সঠিক নয় ('ওয়ালেট ঠিকানা বা ডোমেইন নাম সঠিক নয়'. Not 'অবৈধ' (illegal).) |
| Jumper Earn (product name in notifications) | Jumper Earn (Kept in Latin script, as term 56 keeps the page name 'Earn'.) |
| left / remaining (time, count) | বাকি ('{{count}} দিন বাকি', '({{remaining}} বার বাকি)'. Term 26 avoids 'বাকি' only for the pending status, which stays 'পেন্ডিং'.) |
| level / rank / tier | লেভেল / র‍্যাঙ্ক / টিয়ার ('লেভেল {{level, number}}', 'সর্বোচ্চ টিয়ার'.) |
| lockup / lock-up period | লক-আপ / লক-আপ সময়কাল (Label, tooltip and position card.) |
| malicious (token) | ক্ষতিকর ('ক্ষতিকর টোকেন শনাক্ত হয়েছে'.) |
| manage | ম্যানেজ করুন ('পজিশন ম্যানেজ করুন', 'ম্যানেজমেন্ট ফি'.) |
| market (Earn) | মার্কেট ('সব মার্কেট', 'সম্পর্কিত মার্কেট'. Also 'মার্কেট প্রাইস' in limit orders (pairs with term 57 'ট্রিগার প্রাইস').) |
| message (to sign) | মেসেজ ('একটি মেসেজে স্বাক্ষর করুন'.) |
| network cost | নেটওয়ার্ক ফি (Same label as network fee (term 8).) |
| notification | নোটিফিকেশন ('{{count}}টি অপঠিত নোটিফিকেশন'.) |
| opportunity (Earn) | সুযোগ ('এই সুযোগে বর্তমানে ডিপোজিট বন্ধ আছে', 'নতুন Earn সুযোগ: …'.) |
| order (limit or scheduled) | অর্ডার ('অর্ডার বাতিল করুন', 'অর্ডার রাখুন', 'শিডিউলড অর্ডার' (term 37).) |
| Pass / Jumper Pass | Pass / Jumper Pass (Product name, kept in Latin script. 'পাস' also means passing an exam.) |
| paused (order status, session) | পজ করা হয়েছে (Resume button is 'আবার চালু করুন', so it differs from Continue ('চালিয়ে যান').) |
| pay / payment | পেমেন্ট করুন / পেমেন্ট ('ওয়ালেট থেকে পেমেন্ট করুন', '{{exchange}} দিয়ে পেমেন্ট করুন', 'কার্ড পেমেন্ট'. Label 'Pay with' is 'পেমেন্টের মাধ্যম'. Payment method is 'পেমেন্ট পদ্ধতি'.) |
| perks hub / mission hub | সুবিধা হাব / মিশন হাব (Perks are 'সুবিধা' (term 55).) |
| Place order | অর্ডার দিন ('অর্ডার দেওয়া হয়েছে' for 'Order placed'.) |
| position | পজিশন ('পজিশন ম্যানেজ করুন', 'আপনার পজিশন'.) |
| processing / in progress | প্রসেস হচ্ছে / চলছে ('লেনদেন প্রসেস হচ্ছে', 'রিফান্ড চলছে', 'ডিপোজিট চলছে'.) |
| provider | প্রোভাইডার ('প্রোভাইডার ফি', 'পেমেন্ট প্রোভাইডার'.) |
| purchase (checkout) | ক্রয় ('ক্রয় রিভিউ করুন', 'ক্রয় সফল হয়েছে', 'ক্রয় চলছে'. The Buy button stays 'কিনুন'.) |
| revoke (approval, delegation) | প্রত্যাহার (Only for revoke. Term 35 avoids 'প্রত্যাহার' for withdraw, which stays 'উইথড্র'.) |
| search (verb / noun) | খুঁজুন / সার্চ ('টোকেন বা ঠিকানা দিয়ে খুঁজুন', 'সাম্প্রতিক সার্চ'.) |
| service | সার্ভিস ('গ্যাসলেস সার্ভিস', 'থার্ড-পার্টি সার্ভিস', 'সার্ভিসের শর্তাবলি'. Not 'পরিষেবা'.) |
| Sort by / View by | সাজানোর ধরন / দেখার ধরন (Filter bar labels. The 'Sort' button is 'সাজান'.) |
| step (route or process step) | ধাপ ('{{count}}টি ধাপ', 'একাধিক ধাপ'.) |
| supplied / borrowed (lending position) | সাপ্লাই করা / ধার নেওয়া (Position card headers.) |
| supported / unsupported (compatibility) | সমর্থিত / অসমর্থিত; সমর্থন করে না (Help-desk 'Support' stays 'সাপোর্ট' ('সাপোর্টে যোগাযোগ করুন'), so the two senses differ.) |
| switch (wallet, network, mode, view) | সুইচ করুন (Use the spelling 'সুইচ', not 'স্যুইচ'.) |
| task (step inside a mission) | টাস্ক (Only for the steps inside a mission ('ঐচ্ছিক টাস্ক'). The mission stays 'মিশন' (term 42).) |
| Trade (navigation tab, transaction type, one fill of a scheduled order) | ট্রেড ('ট্রেড {{trade}}: {{progress}}% ফিল হয়েছে'. Column 'Trades' is also 'ট্রেড'.) |
| transfer | ট্রান্সফার / ট্রান্সফার করুন ('ক্রিপ্টো ট্রান্সফার করুন', 'ট্রান্সফার আইডি'. A transaction stays 'লেনদেন' (term 24).) |
| Try again / Retry | আবার চেষ্টা করুন (Error dialogs and retry buttons.) |
| unavailable / available | উপলব্ধ নয় / উপলব্ধ ('সার্ভিস উপলব্ধ নয়', '60+ চেইন উপলব্ধ'.) |
| unlock / unlocked | আনলক করুন / আনলক হয়েছে ('{{count}}টি সুবিধা আনলক হয়েছে'.) |
| verify / ownership | যাচাই করুন / মালিকানা ('মালিকানা যাচাই করুন', 'যাচাই করা হয়েছে'.) |
