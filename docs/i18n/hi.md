# Hindi (`hi`)

Read [TRANSLATING.md](../../TRANSLATING.md) first.

- Variant: Hindi (India), Devanagari script. Crypto Hindi is Hinglish written in Devanagari: crypto terms are transliterated, not translated. Indian exchanges (CoinDCX, WazirX) ship English UIs, so MetaMask hi is the main Hindi wallet UI.
- Register: आप
- Transliterate crypto terms into Devanagari: ब्रिज, स्वैप, गैस, स्लिपेज, टोकन, वॉलेट. Do not use formal Sanskrit-based words such as सेतु or उद्धरण. Use 'विनिमय' only in 'विनिमय दर' (exchange rate).
- Keep Latin script for brand names, tickers and acronyms: Jumper, LI.FI, ETH, USDC, DEX, APY, XP, TWAP.
- Write a crypto action as the loanword + 'करें': 'स्वैप करें', 'ब्रिज करें', 'कनेक्ट करें'. Use a native polite verb for common actions: 'भेजें', 'खरीदें', 'निकालें'.
- Write loanwords with the nukta and use one spelling only: फ़ीस, डिपॉज़िट, ट्रांज़ैक्शन, रिफ़ंड.
- End a full sentence with '।'. Do not put an end mark on a button or a label.
- Remove the machine-translation artifacts in the widget hi.json, for example 'कुंजी: बटन.' and translated placeholders such as '{{मूल्य, संख्या(...)}}'.

## Glossary

| # | English | Use | Do not use |
| --- | --- | --- | --- |
| 1 | bridge (noun) | ब्रिज (ethereum.org hi uses 'सेतु', but wallet UIs and crypto media use 'ब्रिज'.) | सेतु; पुल |
| 2 | bridge (verb) | ब्रिज करें (infinitive: ब्रिज करना) (Use 'ब्रिज करें' on the button and 'फिर से ब्रिज करें' for 'Bridge again'.) | पुल बनाएं |
| 3 | swap (noun) | स्वैप (The widget hi.json uses 'विनिमय'. This is a dictionary word that crypto users do not use.) | विनिमय; अदला-बदली |
| 4 | swap (verb) | स्वैप करें (infinitive: स्वैप करना) (Use 'X को Y में स्वैप करें' for 'Swap X to Y'.) | विनिमय करें |
| 5 | exchange | एक्सचेंज (Exchange tab and header title) (Keep the tab different from 'स्वैप'. Use 'विनिमय दर' for exchange rate. Use 'एक्सचेंज कनेक्ट करें' for 'Connect exchange' (a centralized exchange). The DEX list follows term 27.) | स्वैप (for the tab) |
| 6 | cross-chain | क्रॉस-चेन (ethereum.org hi uses the literal 'चेन के पार'. Crypto media use 'क्रॉस-चेन'.) | चेन के पार; अंतर-श्रृंखला |
| 7 | gas | गैस (The widget hi.json misspells it as 'गेस'.) | गेस; ईंधन |
| 8 | gas fee / network fee | गैस फ़ीस (gas fee); नेटवर्क फ़ीस (network fee) (Follow the English source. MetaMask writes 'फीस' and 'फ़ीस'; use 'फ़ीस' only.) | ईंधन शुल्क |
| 9 | slippage | स्लिपेज (label: 'अधिकतम स्लिपेज') (MetaMask adds '(slippage)' after the word. Jumper does not need the Latin form.) | फिसलन |
| 10 | price impact | प्राइस इम्पैक्ट (warning: 'हाई प्राइस इम्पैक्ट') (MetaMask titles use 'कीमत का प्रभाव', which reads as 'effect of the price'. Its warnings use 'प्राइस इम्पैक्ट'.) | कीमत का प्रभाव; मूल्य प्रभाव |
| 11 | route | रूट (label: 'रूट प्राथमिकता') (The widget hi.json uses 'मार्ग', which means a road. Use the loanword.) | मार्ग |
| 12 | quote | कोटेशन ('उद्धरण' means a literary quotation. MetaMask uses 'कोटेशन' most often; do not mix it with 'कोट' or 'क्वोट'.) | उद्धरण; क्वोट |
| 13 | chain / blockchain | चेन; ब्लॉकचेन (The widget hi.json has 'चैन चुने'. 'चैन' means peace or calm.) | चैन; श्रृंखला |
| 14 | network (synonym of chain in wallet UIs) | नेटवर्क (Use 'नेटवर्क' where the English says network.) | जाल |
| 15 | from chain / to chain (source / destination) | सोर्स चेन / डेस्टिनेशन चेन (MetaMask hi mixes 'डेस्टिनेशन' and 'गंतव्य'. Use 'डेस्टिनेशन' only.) | गंतव्य श्रृंखला |
| 16 | token | टोकन (Use 'टोकन' for both one token and many tokens.) | प्रतीक |
| 17 | native token (ETH on Ethereum, SOL on Solana) | मूल टोकन (MetaMask hi uses 'मूल टोकन'. 'नेटिव टोकन' is also understood, but do not mix the two.) | देशी टोकन |
| 18 | stablecoin | स्टेबलकॉइन (Use 'स्टेबलकॉइन्स' for the plural.) | स्थिर सिक्का |
| 19 | wallet | वॉलेट ('बटुआ' means a leather purse.) | बटुआ |
| 20 | connect wallet / connect (button) | वॉलेट कनेक्ट करें / कनेक्ट करें (The widget hi.json has 'वॉलेट से जुड़ें?' with a question mark. A button is an instruction, not a question.) | वॉलेट से जुड़ें?; संपर्क करें |
| 21 | disconnect | डिसकनेक्ट करें (The widget hi.json has 'संपर्क तोड़ें', which means to cut off contact with a person.) | संपर्क तोड़ें |
| 22 | approve / token approval (ERC-20 allowance) | एप्रूव करें / टोकन एप्रूवल (MetaMask mobile uses 'स्वीकृति दें', but the extension uses 'एप्रूव करें' in most strings.) | अनुमोदित करें; स्वीकृति दें |
| 23 | sign / signature (wallet signature request) | हस्ताक्षर करें / हस्ताक्षर ('साइन इन' means log in. MetaMask hi also writes 'सिग्नेचर' in risk labels; use 'हस्ताक्षर' only.) | साइन इन करें |
| 24 | transaction | ट्रांज़ैक्शन (MetaMask spells it 'ट्रांसेक्शन' and Hindi media spell it 'ट्रांजैक्शन'. Use one spelling with the nukta.) | संव्यवहार |
| 25 | transaction hash | ट्रांज़ैक्शन हैश (Keep 'हैश' as a loanword.) | लेन-देन संख्या |
| 26 | pending / completed / failed / refunded (transaction status words) | पेंडिंग / पूरा हुआ / विफल / रिफ़ंड हुआ ('विचाराधीन' means 'under legal consideration'. Use short status words on status pills.) | विचाराधीन; बाकी |
| 27 | DEX | DEX (long form: 'विकेंद्रीकृत एक्सचेंज (DEX)') (Keep the acronym in Latin script.) | डेक्स |
| 28 | aggregator | एग्रीगेटर (Use 'लिक्विडिटी एग्रीगेटर' for liquidity aggregator.) | समूहक |
| 29 | liquidity | लिक्विडिटी (MetaMask hi uses 'चलनिधि' once, but 'लिक्विडिटी' in most strings.) | चलनिधि; तरलता |
| 30 | yield | यील्ड ('उपज' means a crop yield.) | उपज |
| 31 | APY | APY (Keep the acronym in Latin script.) | वार्षिक प्रतिशत उपज |
| 32 | vault | वॉल्ट (Keep the protocol name in Latin script: 'Morpho वॉल्ट'.) | तिजोरी |
| 33 | staking | स्टेकिंग / स्टेक करें ('दांव' means a bet.) | दांव लगाना |
| 34 | deposit | डिपॉज़िट करें / डिपॉज़िट ('निक्षेप' is formal banking Hindi.) | निक्षेप |
| 35 | withdraw | निकालें ('आहरण' is formal banking Hindi.) | आहरण करें |
| 36 | limit order | लिमिट ऑर्डर ('आदेश' means a command.) | सीमा आदेश |
| 37 | TWAP order / scheduled order | TWAP ऑर्डर / शेड्यूल्ड ऑर्डर (Keep 'TWAP' in Latin script.) | समयबद्ध आदेश |
| 38 | market cap | मार्केट कैप (Use the same term in token details and in sort options.) | बाज़ार पूंजीकरण |
| 39 | refuel / get gas | गैस पाएं, e.g. '{{chain}} पर गैस पाएं' (The widget hi.json has 'गेस शुल्क ले', which has a spelling error and the wrong verb form.) | गेस शुल्क ले |
| 40 | airdrop | एयरड्रॉप (Keep the loanword.) | हवाई वितरण |
| 41 | points / XP | पॉइंट्स / XP ('अंक' means school marks. Keep 'XP' in Latin script.) | अंक |
| 42 | quest / mission | मिशन ('खोज' means search.) | खोज; अभियान |
| 43 | rewards / claim (rewards) | रिवॉर्ड्स / क्लेम करें ('दावा' is a legal claim. MetaMask mobile uses 'पुरस्कार' for its Rewards tab, but 'रिवॉर्ड' elsewhere.) | दावा करें; पुरस्कार |
| 44 | portfolio | पोर्टफ़ोलियो (MetaMask mobile keeps its product name 'Portfolio' in Latin. Jumper Portfolio is a page, so transliterate it.) | संविभाग |
| 45 | balance | बैलेंस ('संतुलन' means equilibrium.) | संतुलन |
| 46 | max (button that fills the full balance) | मैक्स (Use 'अधिकतम' only inside labels such as 'अधिकतम स्लिपेज'.) | अधिकतम (on the button) |
| 47 | send / receive | भेजें / प्राप्त करें (Use 'आपको मिलेगा' for 'You get' in the swap form.) | प्रेषित करें |
| 48 | recipient / receiving address | प्राप्तकर्ता / प्राप्तकर्ता का एड्रेस (MetaMask uses 'एड्रेस' for a wallet address. 'पता' means a postal address.) | प्राप्तकर्ता का पता |
| 49 | minimum received | न्यूनतम प्राप्त राशि (MetaMask uses the past tense, which reads like a finished event. The label shows a guaranteed amount.) | न्यूनतम प्राप्त किया गया |
| 50 | fee (integrator fee, "Jumper fee") | फ़ीस, e.g. 'Jumper फ़ीस', 'इंटीग्रेटर फ़ीस' (Keep the product name in Latin script.) | प्रभार |
| 51 | estimated time | अनुमानित समय (Use '~{{time}}' in a compact route card.) | — |
| 52 | high value loss (warning when a route loses a lot of value) | वैल्यू का भारी नुकसान (The literal form reads as 'high price loss'.) | उच्च मूल्य हानि |
| 53 | on-ramp / buy with card | कार्ड से खरीदें / क्रिप्टो खरीदें (Do not show the term 'on-ramp' to users.) | ऑन-रैंप |
| 54 | leaderboard | लीडरबोर्ड (Keep the loanword.) | अग्रणी तालिका |
| 55 | perks | पर्क्स ('भत्ते' means salary allowances. MetaMask uses 'फ़ायदे' for 'Benefits', which is a different concept.) | भत्ते |
| 56 | earn (the product page where users earn yield) | कमाएं (page name and verb), e.g. '{{apy}} APY तक कमाएं' (Use 'XP कमाएं' for 'Earn XP'.) | उपार्जन |
| 57 | trigger price (limit orders) | ट्रिगर प्राइस (Keep the loanword.) | उत्प्रेरक मूल्य |
| 58 | expiry / expires (orders) | एक्सपायरी / '{{time}} में एक्सपायर होगा' (MetaMask mobile also uses 'समाप्त होता है'. Use 'एक्सपायर' only.) | मियाद |

## More terms

These terms are in use in the current texts. Use them for the same concepts.

| English | Use |
| --- | --- |
| account / smart (contract) account | अकाउंट / स्मार्ट (कॉन्ट्रैक्ट) अकाउंट (Not 'खाता'.) |
| activity | एक्टिविटी (Profile tab and 'एक्टिविटी लक्ष्य'.) |
| allowance (ERC-20) | खर्च करने की लिमिट (MetaMask hi wording. 'खर्च करने की लिमिट कम है'. The approval step is '{{tokenSymbol}} एप्रूव करें'.) |
| amount | राशि (Form label and errors: 'राशि कम से कम {{min}} होनी चाहिए'.) |
| appearance (theme setting) | थीम (Same word as hi-B 'Theme'.) |
| asset / assets | एसेट / एसेट्स (Filters and labels: 'एसेट के अनुसार', 'टोकनाइज़्ड एसेट्स'. Not 'संपत्ति'.) |
| Best Return / Fastest (route tags and route priority) | सबसे अच्छा रिटर्न / सबसे तेज़ (Not 'सबसे सस्ता'. 'रिटर्न' as in hi-B 'रिटर्न रेट'.) |
| bookmark (wallet address) | बुकमार्क / बुकमार्क करें ('बुकमार्क किए गए वॉलेट', 'वॉलेट बुकमार्क करें'.) |
| cancel / cancelled (orders, transactions) | रद्द करें / रद्द ('ऑर्डर रद्द करें', status 'रद्द'.) |
| capacity (vault) | कैपेसिटी ('बची हुई कैपेसिटी', 'अधिकतम कैपेसिटी'.) |
| cash (fiat card payment in checkout) | कार्ड ('कार्ड से डिपॉज़िट करें', 'कार्ड पेमेंट उपलब्ध नहीं है'. Not 'कैश'. Matches term 53.) |
| checkout | चेकआउट ('चेकआउट विवरण', 'चेकआउट बंद करें'.) |
| clear filters / clear all | फ़िल्टर हटाएं / सभी हटाएं (Filter bars in blog, earn and portfolio.) |
| confirmed (transaction status) | की पुष्टि हो गई ('ब्रिज ट्रांज़ैक्शन की पुष्टि हो गई'. Follows the Confirm term.) |
| convert / conversion | कन्वर्ट करें / कन्वर्ज़न ('कन्वर्ज़न पूरा हुआ', 'कन्वर्ज़न रिव्यू करें'.) |
| cost (network cost, transaction cost) | लागत (Same as hi-B 'नेटवर्क लागत'. 'फ़ीस' stays for fee.) |
| currency (fiat) | करेंसी ('करेंसी खोजें'.) |
| custom / auto (settings) | कस्टम / ऑटो (Not 'स्वतः'.) |
| deposit address / deposit window | डिपॉज़िट एड्रेस / डिपॉज़िट विंडो ('डिपॉज़िट एड्रेस एक्सपायर हुआ', 'डिपॉज़िट विंडो बंद होने से पहले'.) |
| details | विवरण (Same as hi-B. 'ट्रांज़ैक्शन विवरण', 'डिपॉज़िट विवरण', 'विवरण देखें'.) |
| do your own research | हमेशा खुद रिसर्च करें (Token warnings and Hypernative status text.) |
| dust / dust tokens | डस्ट / डस्ट टोकन ('डस्ट कन्वर्ट करें', 'कन्वर्ट होने लायक डस्ट'. Not 'धूल'.) |
| error | एरर ('कोई अज्ञात एरर आया'. Not 'त्रुटि'.) |
| exchange (centralized exchange, CEX) | एक्सचेंज ('किसी एक्सचेंज का वॉलेट'. Same word as the Exchange tab (term 5); context makes the sense clear.) |
| exchange (centralized exchange, CEX) / exchange account | एक्सचेंज / एक्सचेंज अकाउंट (Same as hi-B. 'एक्सचेंज कनेक्ट करें', 'अपना एक्सचेंज अकाउंट लिंक करें'. The DEX list in settings uses 'DEX' (term 27): 'DEX के नाम से खोजें'.) |
| Exchange from / Exchange to (token page titles); From / To (form card labels) | इससे एक्सचेंज करें / इसमें एक्सचेंज करें; से / में (Pattern follows hi-B 'इसमें निकालें' (Withdraw to) and term 4 'X को Y में स्वैप करें'.) |
| exchange rate / rate | विनिमय दर / दर ('विनिमय दर बदल गई', 'दर में बदलाव', 'कन्वर्ज़न दर'. 'रेट' only in 'रेट लिमिट' (hi-B).) |
| expired (orders) | एक्सपायर हुआ (Follows term 58.) |
| explore (missions, chains) | एक्सप्लोर करें ('मिशन एक्सप्लोर करें', 'आपने 3 चेन एक्सप्लोर की हैं'.) |
| filled / partially filled (orders) | फ़िल हुआ / आंशिक रूप से फ़िल हुआ (Order status and column; 'यह ऑर्डर अब फ़िल नहीं होगा'.) |
| funds | फ़ंड (Same as hi-B. 'पर्याप्त फ़ंड नहीं हैं', 'आपके फ़ंड सुरक्षित हैं'.) |
| gasless | गैसलेस (Route tag 'गैसलेस', fee label 'गैसलेस सर्विस'.) |
| idle (tokens, assets) | बेकार पड़े ('अपने बेकार पड़े टोकन से ... कमाएं'. Not 'खाली' (empty) or 'निष्क्रिय'.) |
| in progress / processing (status) | प्रोसेस हो रहा है ('डिपॉज़िट प्रोसेस हो रहा है', 'रिफ़ंड प्रोसेस हो रहा है', 'खरीदारी प्रोसेस हो रही है'. Not 'जारी है', which can also mean 'issued'.) |
| insufficient gas / funds / balance (titles) | गैस पर्याप्त नहीं है / फ़ंड पर्याप्त नहीं हैं (Same pattern as hi-B 'बैलेंस पर्याप्त नहीं है'.) |
| level / rank | लेवल / रैंक ('लेवल {{level}}'. Not 'स्तर'.) |
| lockup period | लॉकअप पीरियड (Label and tooltip; short form 'लॉकअप'.) |
| malicious / flagged (token) | खतरनाक / फ़्लैग किया ('खतरनाक टोकन मिला', 'Hypernative ने ... खतरनाक के रूप में फ़्लैग किया है'.) |
| market (Earn) | मार्केट ('सभी मार्केट', 'मिलते-जुलते मार्केट'. Same word in 'मार्केट प्राइस'.) |
| message (to sign) | मैसेज (Same as hi-B. 'स्वैप मैसेज पर हस्ताक्षर करें', 'परमिट मैसेज'.) |
| mission task | टास्क ('वैकल्पिक टास्क', 'टास्क पूरा हुआ'.) |
| notification / unread | नोटिफ़िकेशन / बिना पढ़ा (plural: बिना पढ़े) ('{{count}} बिना पढ़े नोटिफ़िकेशन'.) |
| opportunity (Earn) | अवसर ('इस अवसर के लिए डिपॉज़िट अभी बंद है', 'कमाई का नया अवसर'.) |
| Pass (Jumper Pass) | Pass (Product name, kept in Latin script: 'Jumper Pass', 'Pass - लेवल 3'.) |
| paused (status) | रुका हुआ (Order status 'temporarily invalid' and 'Session paused' ('सेशन रुका हुआ है').) |
| pay / payment | पेमेंट करें / पेमेंट (Masculine: 'पेमेंट पूरा नहीं हुआ', 'इससे पेमेंट करें', 'पेमेंट प्रोवाइडर'. Not 'भुगतान'.) |
| perk / perks | पर्क / पर्क्स (Singular 'पर्क' with one item; plural 'पर्क्स' (term 55).) |
| pinned / featured | पिन किए गए / फ़ीचर्ड ('पिन किए गए टोकन', 'पिन किए गए टैब', 'फ़ीचर्ड टोकन'.) |
| place order / order placed | ऑर्डर लगाएं / ऑर्डर लगाया गया (Same verb as hi-B ('ऑर्डर लगाया गया'). Also for checkout orders.) |
| position | पोज़िशन ('अपनी पोज़िशन मैनेज करें', 'आपकी पोज़िशन'.) |
| price | प्राइस ('मार्केट प्राइस', 'प्राइस इम्पैक्ट' (term 10). Not 'कीमत' or 'मूल्य'.) |
| purchase | खरीदारी (Feminine: 'खरीदारी सफल रही', 'खरीदारी पूरी हुई', 'खरीदारी रिव्यू करें'.) |
| recent | हाल के / हालिया ('हाल के वॉलेट', 'हाल की खोजें', 'कोई हालिया ट्रांज़ैक्शन नहीं'.) |
| refund / refunded | रिफ़ंड / रिफ़ंड हुआ ('रिफ़ंड रिक्वेस्ट करें', 'रिफ़ंड भेज दिया गया' (issued), 'रिफ़ंड पूरा हुआ'.) |
| request (noun) | रिक्वेस्ट ('पेंडिंग रिक्वेस्ट', 'बहुत ज़्यादा रिक्वेस्ट'.) |
| results (search) | परिणाम ('कोई परिणाम नहीं', '{{count}} परिणाम'.) |
| revoke | रिवोक करें (Same as hi-B 'रिवोक'. '{{tokenSymbol}} का एप्रूवल रिवोक करें'.) |
| risk | जोखिम ('{{type}} जोखिम डिस्क्लेमर'.) |
| sell / buy (order columns) | बेचें / खरीदें (Sell token in a sentence: 'बेचने वाला टोकन'.) |
| sort by / view by | इसके अनुसार सॉर्ट करें / इसके अनुसार देखें (Sort and view selectors.) |
| step / multi-step | स्टेप / मल्टी-स्टेप (Same as hi-B 'स्टेप'.) |
| support (help team) | सपोर्ट (Navbar 'सपोर्ट', 'सपोर्ट टीम', 'सपोर्ट टिकट'. Replaces the old 'सहायता' for one word only.) |
| supported / not supported | सपोर्टेड / सपोर्टेड नहीं है ('चेन सपोर्टेड नहीं है', 'वॉलेट सपोर्टेड नहीं है'. Not 'असमर्थित'.) |
| time remaining (lockup, missions) | {{count}} घंटा बचा / {{count}} घंटे बचे (Direct case for 'left/remaining'. For 'ago' use the oblique form for all counts: '{{count}} घंटे पहले', '{{count}} महीने पहले'.) |
| top up | टॉप अप करें (Checkout deposit flow.) |
| trade (one fill of a scheduled order; Trade tab) | ट्रेड ('ट्रेड 2: 50% फ़िल हुआ', navbar 'ट्रेड'.) |
| transfer (noun / verb) | ट्रांसफ़र / ट्रांसफ़र करें (Same spelling as hi-B. 'क्रिप्टो ट्रांसफ़र करें', 'ट्रांसफ़र ID'.) |
| try again | फिर से कोशिश करें (Buttons and sentences.) |
| unlocked / claimed (perk status and tabs) | अनलॉक हुआ / क्लेम हुआ (tabs: अनलॉक हुए / क्लेम हुए) (Status style follows term 26 ('पूरा हुआ').) |
| value (USD value) | वैल्यू ('कुल वैल्यू', 'वैल्यू का भारी नुकसान' (term 52).) |
| verified / unverified | वेरिफ़ाइड / वेरिफ़ाइड नहीं (Same verb as hi-B. 'Hypernative से वेरिफ़ाइड नहीं', 'सिर्फ़ वेरिफ़ाइड'.) |
| verify / verified / ownership | वेरिफ़ाई करें / वेरिफ़ाइड / ओनरशिप ('ओनरशिप वेरिफ़ाई करें'. Not 'सत्यापित' or 'स्वामित्व'.) |
| withdrawal (noun) | निकासी (Noun of term 35 'निकालें': 'निकासी रिक्वेस्ट करें', 'निकासी फ़ीस'.) |
| You pay (amount label) | आप देंगे (Pairs with 'आपको मिलेगा' (term 47). 'आप देंगे · {{count}} टोकन'.) |
