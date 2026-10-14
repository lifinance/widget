# Turkish (`tr`)

Read [TRANSLATING.md](../../TRANSLATING.md) first.

- Variant: Turkish (Türkiye). Binance.com has no Turkish Academy, because Turkish users use Binance TR, OKX TR, BtcTurk and Paribu. The evidence comes from MetaMask, Uniswap, OKX TR, ethereum.org and Turkish crypto glossaries.
- Register: siz in sentences ('Cüzdanınızı bağlayın', 'tekrar deneyin'); the bare verb stem on buttons ('Bağla', 'Onayla', 'Gönder'). Never 'sen' in sentences.
- Write buttons as the bare verb stem: 'Cüzdan bağla', 'Onayla', 'İmzala', 'Takas et', 'Köprüle'. Write sentences with 'siz': 'Cüzdanınızı bağlayın'.
- Add suffixes to tickers, acronyms, brand names and English loanwords after an apostrophe. Use the spoken form for vowel harmony: ETH'yi, DEX'e, Swap'ı, gas'ı, token'ları.
- Use sentence case for labels and titles: 'İşlem ayrıntıları', not 'İşlem Ayrıntıları'.
- Use Turkish letters and Turkish casing. The capital of 'i' is 'İ' and the capital of 'ı' is 'I': 'İşlem', 'IŞIK'.
- Name the action and add 'işlemi' in status text: 'Köprü işlemi tamamlandı', 'Swap işlemi başarısız oldu'.

## Glossary

| # | English | Use | Do not use |
| --- | --- | --- | --- |
| 1 | bridge (noun) | köprü (pl. köprüler); tab and title: 'Köprü'; status: 'Köprü işlemi tamamlandı' (Use 'köprü' and replace the current button 'Gönder', which means 'Send'.) | Gönder; Bridge (as a plain label) |
| 2 | bridge (verb) | köprüle: button 'Köprüle'; 'köprüleniyor', 'köprülendi'; process noun 'köprüleme' (Do not use 'aktar' for a bridge, because it means a plain transfer.) | köprü kur; aktar (for the bridge action) |
| 3 | swap (noun) | swap (pl. swap'lar); tab and title: 'Swap'; status: 'Swap işlemi tamamlandı' (Keep 'Swap' as the tab name, as OKX TR does, because the Exchange page uses 'Takas'.) | Al-Sat; değiş tokuş |
| 4 | swap (verb) | takas et: button 'Takas et'; 'takas ediliyor', 'takas edildi'; sentence 'ETH'yi USDC ile takas edin' (Use 'takas et' for the verb, because 'Dönüştür' is the name of the Binance Convert product.) | değiştir; dönüştür; swap'la |
| 5 | exchange | title: 'Takas'; button: 'Takas et' (Do not use 'Borsa', which means a CEX, or 'Al-Sat', which means buy and sell.) | Al-Sat; Borsa; Exchange |
| 6 | cross-chain | zincirler arası: 'zincirler arası swap', 'zincirler arası transfer' (Use 'zincirler arası', as OKX TR and Uniswap do.) | çapraz zincir; cross-chain |
| 7 | gas | gas (with suffixes: gas'ı, gas'a) (Write 'gas' as OKX, Uniswap and CoinMarketCap do, although MetaMask writes 'gaz'.) | gaz; yakıt |
| 8 | gas fee / network fee | gas ücreti; ağ ücreti (Use 'ağ ücreti' for the network fee and replace the current 'Ağ maliyeti'.) | ağ maliyeti; gaz ücreti |
| 9 | slippage | kayma; 'Maks. kayma'; 'kayma toleransı' (Use 'kayma' in every string, although Uniswap keeps the English 'slippage'.) | slippage; Maksimum kayma oranı |
| 10 | price impact | fiyat etkisi (Do not use 'piyasa etkisi', because it means market impact.) | piyasa etkisi |
| 11 | route | rota (pl. rotalar); 'En iyi rota' (Use 'rota' for one path through bridges and DEXs.) | güzergah; yol |
| 12 | quote | teklif; 'Teklif edilen tutar'; 'En iyi teklif' (Use 'teklif', because 'alıntı' means a citation.) | alıntı; fiyat alıntısı |
| 13 | chain / blockchain | zincir (pl. zincirler): 'Zincir seç'; blokzincir for the technology (Use 'zincir' when the English says 'chain' and 'ağ' when the English says 'network'.) | chain; halka |
| 14 | network (synonym of chain in wallet UIs) | ağ (pl. ağlar); 'Tüm ağlar' (Use 'ağ' for the network selector and network fees, with suffixes such as '{{chain}} ağına'.) | şebeke |
| 15 | from chain / to chain (source / destination) | kaynak zincir / hedef zincir; short labels: 'Kaynak' / 'Hedef' (Use 'Gönderen' and 'Alıcı' only for wallet addresses, not for chains.) | Gönderen / Alıcı (for chains); alıcı zincir |
| 16 | token | token (pl. token'lar; with suffixes: token'ı, token'ları) (Do not use 'jeton', which is a game coin, or 'varlık', which means 'asset'.) | jeton; varlık (for a token) |
| 17 | native token (ETH on Ethereum, SOL on Solana) | yerel token; '{{chain}} ağının yerel token'ı' (Use 'yerel token' for the gas token of a chain, as MetaMask does.) | doğal token; ana para |
| 18 | stablecoin | stablecoin (pl. stablecoin'ler) (Use 'stablecoin', because the MetaMask form 'stabil kripto para' is too long for UI labels.) | stabil kripto para; sabit coin |
| 19 | wallet | cüzdan (pl. cüzdanlar) (Use 'cüzdan', as every Turkish source does.) | wallet; para kesesi |
| 20 | connect wallet / connect (button) | 'Cüzdan bağla'; short button: 'Bağla' (Use the transitive 'Bağla', because 'Bağlan' means 'connect yourself'.) | Bağlan; Cüzdanı Bağla |
| 21 | disconnect | 'Bağlantıyı kes' (Use 'Bağlantıyı kes', because disconnecting a wallet is not a log-out.) | Çıkış yap; Ayır |
| 22 | approve / token approval (ERC-20 allowance) | onayla / onay; '{{token}} harcamasını onayla'; 'harcama limiti' (Use 'onayla' for the allowance step and 'harcama limiti' for the approved amount.) | izin ver; yetkilendir |
| 23 | sign / signature (wallet signature request) | imzala / imza; 'İmza talebi'; 'İşlemi imzala' (Keep 'imzala' apart from 'onayla', because a signature and an approval are different wallet steps.) | onayla (for a signature) |
| 24 | transaction | işlem (pl. işlemler) (Use 'işlem', as every Turkish source does.) | transaksiyon; muamele |
| 25 | transaction hash | işlem hash'i (Keep 'hash' with an apostrophe suffix, because users see this word in block explorers.) | işlem özeti; işlem kimliği |
| 26 | pending / completed / failed / refunded (transaction status words) | Beklemede / Tamamlandı / Başarısız / İade edildi (Use the short forms on status chips and 'başarısız oldu' only in full sentences.) | Zaman aşımına uğradı (for failed); Geri ödeme yapıldı |
| 27 | DEX | DEX (pl. DEX'ler; DEX'te, DEX'e) (Keep the acronym and explain it as 'merkeziyetsiz borsa (DEX)' only in help text.) | merkeziyetsiz borsa (as a label) |
| 28 | aggregator | toplayıcı; 'likidite toplayıcı' (Use 'toplayıcı', as MetaMask and Uniswap do.) | agregatör; birleştirici |
| 29 | liquidity | likidite (Use 'likidite', as all sources do.) | nakit; akışkanlık |
| 30 | yield | getiri (Use 'getiri' for yield, as Uniswap does.) | verim; hasat |
| 31 | APY | APY (Keep the acronym 'APY', as Uniswap does.) | YBG; yıllık getiri yüzdesi (as a label) |
| 32 | vault | kasa (pl. kasalar) (Use 'kasa' as Uniswap does, but keep the protocol name when the vault has one.) | vault; hazine |
| 33 | staking | staking; 'stake et'; 'Stake edildi' (Do not use the MetaMask button text 'Pay', because it means 'share'.) | Pay; hisse |
| 34 | deposit | yatır / yatırma; 'Yatırma işlemi tamamlandı' (Use 'yatır' on the button and 'Para yatır' only for fiat deposits.) | depozito; teminat |
| 35 | withdraw | çek / çekme; 'Çekme işlemi tamamlandı' (Use 'çek' on the button and 'çekme işlemi' in status text.) | geri al; para çek (in DeFi screens) |
| 36 | limit order | limit emri (pl. limit emirleri); 'Limit fiyatı' (Use 'emir', because 'sipariş' means a shop order.) | limit siparişi; sınır emri |
| 37 | TWAP order / scheduled order | TWAP emri; zamanlanmış emir (Keep the acronym 'TWAP' and use 'emir' as for limit orders.) | planlı sipariş |
| 38 | market cap | piyasa değeri (Use 'piyasa değeri', as MetaMask and Uniswap do.) | pazar sermayesi; piyasa kapitalizasyonu |
| 39 | refuel / get gas | 'Gas al'; '{{chain}} ağında gas al' (Keep 'gas' from term 7 and replace the current 'Gaz al'.) | Gaz al; Yakıt doldur |
| 40 | airdrop | airdrop (pl. airdrop'lar) (Keep 'airdrop', as all sources do.) | hava indirmesi; bedava token |
| 41 | points / XP | puan; XP (Use 'puan', because 'nokta' means a dot.) | nokta |
| 42 | quest / mission | görev (pl. görevler) (Use 'görev' for every quest and mission.) | arayış; macera |
| 43 | rewards / claim (rewards) | ödüller; button: 'Talep et'; 'Ödülleri talep et' (Use 'Talep et', because the MetaMask form 'Al' also means 'Receive'.) | Al (for claim); hak iddia et |
| 44 | portfolio | portföy (Write 'Portföy' with 'ö', as Uniswap does.) | portfolio; portfoy |
| 45 | balance | bakiye; 'Toplam bakiye' (Use 'bakiye', because 'denge' means physical balance.) | denge; balans |
| 46 | max (button that fills the full balance) | Maks. (Use the short form on the button.) | MAKSİMUM; Tümü |
| 47 | send / receive | Gönder / Al (Use 'Gönder' and 'Al' on buttons and 'Alınacak' for the receive amount field.) | Yolla / Teslim al |
| 48 | recipient / receiving address | alıcı; 'alıcı adresi' (Use 'alıcı' for the person and 'alıcı adresi' for the address field.) | hedef kişi; lehtar |
| 49 | minimum received | Alınacak minimum (Use 'Alınacak', because the value is a future guarantee.) | Minimum alınan |
| 50 | fee (integrator fee, "Jumper fee") | ücret; 'Jumper ücreti'; 'Entegratör ücreti'; 'Sağlayıcı ücreti' (Use 'ücret' for every fee and write 'Entegratör' in Turkish spelling.) | Integrator ücreti; komisyon; maliyet |
| 51 | estimated time | Tahmini süre (Use 'Tahmini süre' for the duration, as MetaMask does.) | Tahmini zaman; Beklenen saat |
| 52 | high value loss (warning when a route loses a lot of value) | Yüksek değer kaybı (Keep the current widget text, because it is correct.) | Büyük kayıp değeri |
| 53 | on-ramp / buy with card | 'Kartla satın al'; 'Kripto satın al' (Name the action, because users do not know the word 'on-ramp'.) | rampa; on-ramp |
| 54 | leaderboard | Liderlik tablosu (Use 'Liderlik tablosu', as MetaMask does.) | Skor tahtası; Lider panosu |
| 55 | perks | avantajlar (Use 'avantajlar' for partner perks.) | imtiyazlar; ayrıcalık hakkı |
| 56 | earn (the product page where users earn yield) | Earn (page and product name); verb in sentences: 'kazan' (Keep 'Earn' as the page name and use 'kazan' only inside sentences.) | Kazan (as the page title); Kazanç |
| 57 | trigger price (limit orders) | tetikleme fiyatı (Use 'tetikleme fiyatı', as MetaMask does for orders.) | tetik fiyatı; başlatma fiyatı |
| 58 | expiry / expires (orders) | son geçerlilik; '{{duration}} içinde sona erer'; 'Süresi doldu' (Use 'son geçerlilik' for the label and 'süresi doldu' for the status, because 'vade' means a loan maturity.) | vade; zaman aşımı |

## More terms

These terms are in use in the current texts. Use them for the same concepts.

| English | Use |
| --- | --- |
| 7d / 30d (time window) | 7G / 30G (Turkish chart convention (G = gün): 'APY 7G'.) |
| activity (profile) | aktivite (Tab 'Aktivite', 'aktivite hedefi'.) |
| amount (input label) | Tutar ('Tutar sıfırdan büyük olmalıdır'. NFT quantity uses 'Adet'.) |
| asset | varlık (pl. varlıklar) (Filters, labels and portfolio columns. Term 16 keeps 'token' for tokens.) |
| Best Return (route tag and route priority) | En kârlı (Pairs with 'En hızlı'. Not 'En iyi getiri', because 'getiri' means yield (term 30).) |
| blog post | yazı (pl. yazılar) ('Son yazılar', 'Benzer yazılar'. 'Gönderi' means a social post.) |
| bluechip / volatile (fee tier) | blue chip / oynak (Lowercase, after 'bps ·'.) |
| bookmark (wallet) | kaydet / kayıtlı ('Kaydet', 'Cüzdanı kaydet', 'Cüzdan kaydet', 'Kayıtlı cüzdanlar', 'Kayıtlı cüzdan yok', 'Cüzdan adı gerekli'.) |
| boost / boosted (APR) | kampanya bonusu / Artırılmış APR (Base APR is 'Temel APR'.) |
| cancel / cancelled | İptal / İptal edildi; 'Emri iptal et' (Dialog button 'İptal'; status 'İptal edildi'.) |
| checkout (title) | Ödeme ('Ödeme ayrıntıları', 'Ödeme ekranını kapat'.) |
| claimed (perk) | Talep edildi (Follows term 43 'Talep et'. Tab 'Talep edilen'.) |
| Clear (remove from list) | Temizle ('İşlemi temizle', 'Başarısız olanları temizle'.) |
| collateral | teminat (Only for lending collateral. Term 34 avoids 'teminat' for deposit.) |
| Contact support | Destek ekibine ulaş; sentences 'destek ekibiyle iletişime geçin' (One form for every support message.) |
| contract (smart contract) | kontrat; akıllı kontrat ('Kontratı görüntüle', 'akıllı kontrat istismarları'.) |
| convert / conversion (dust flow only) | dönüştür / dönüştürme (Only in dust-conversion keys. The swap verb stays 'takas et' (term 4).) |
| Deposit with cash (fiat on-ramp option) | Para yatır (Glossary term 34 keeps 'Para yatır' for fiat deposits. The crypto deposit button stays 'Yatır'.) |
| domain (wallet name service) | alan adı ('Cüzdan adresi veya alan adı geçersiz'.) |
| Done (success dialog) | Tamam (Same as 'Okay'.) |
| dust / dust tokens | küçük bakiye (pl. küçük bakiyeler) ('Küçük bakiyeleri dönüştür', 'Dönüştürülebilir küçük bakiyeler', as in Binance TR. Not 'toz' and not 'dust'.) |
| est. received | Tahmini alınacak (Pairs with 'Alınacak minimum' (term 49).) |
| Exact-output (tab) | Kesin çıktı (Tab name for the exact output amount mode.) |
| exchange (centralized exchange, CEX) | borsa (Same as tr-B. 'Borsa bağla', 'Borsa hesabınızı bağlayın', 'borsalara doğrudan transfer'.) |
| exchange rate / rate (swap price ratio) | kur ('Kur', 'Kur değişti', 'Kur değişimi', 'Birleşik kur' (aggregate rate), as Binance TR uses for Convert. Not 'Takas oranı' and not 'Oran'. 'Rate limit' stays 'istek sınırı'.) |
| exploit (security) | istismar (Risk texts: 'köprü kontratı istismarları'.) |
| explorer (block explorer) | blok gezgini ('Blok gezgininde görüntüle', 'Blok gezgini ve analiz'.) |
| exposure (Earn filter) | maruziyet (Finance term for risk exposure.) |
| filled / partially filled (order status) | Gerçekleşti / Kısmen gerçekleşti (Turkish exchange wording. Column 'Gerçekleşen'.) |
| From / To (token card titles) | Kaynak / Hedef (Term 15 short labels. Token page titles: 'Kaynak token' / 'Hedef token'.) |
| funds | fon (pl. fonlar) ('fonlarınızı kaybedersiniz', 'Fon çekerken alınan ücret'. 'Bakiye' stays for balance (term 45).) |
| Gasless | Gas ücretsiz (Route tag 'Gas ücretsiz'; fee row 'Gas ücretsiz hizmet'.) |
| hub (Perks hub, Mission hub) | merkez ('Avantaj merkezini aç', 'Görev merkezini aç'.) |
| idle (tokens, assets) | atıl ('Atıl token'larınızla', 'atıl {{symbol}} bakiyeniz'.) |
| insufficient funds | Yetersiz bakiye (Idiomatic for a missing balance. 'Fon' stays for funds in other sentences ('fon kaybı', 'Fonlarınız güvende').) |
| level | seviye ('Seviye {{level, number}}'. Use the ordinal form '{{newLevel}}. seviye' in sentences to avoid a suffix on the number.) |
| lockup / lock-up period | kilitleme / kilitleme süresi (Label 'Kilitleme süresi'; card label 'Kilitleme'.) |
| market (Earn) | piyasa (pl. piyasalar) ('Tüm piyasalar', 'Benzer piyasalar'. Also 'Piyasa fiyatı' for limit orders.) |
| Multi-step | Çok adımlı (Route tag.) |
| Multi-swap | Çoklu swap (Tab and title. The verb stays 'takas et' (term 4).) |
| opportunity (Earn) | fırsat (pl. fırsatlar) ('Bu fırsat için yatırma şu anda devre dışı', 'Yeni Earn fırsatı'.) |
| order (checkout purchase) | sipariş (Only in checkout ('Siparişiniz işleniyor', 'Siparişin süresi doldu'). Limit and TWAP orders stay 'emir' (term 36).) |
| order (limit or scheduled) | emir (pl. emirler) ('Emri iptal et', 'Emri koru', 'Emri tekrarla', 'Zamanlanmış emirler'.) |
| pair (trading pair) | Parite (Order table column, as on Turkish exchanges.) |
| pinned | sabitlenmiş ('Sabitlenmiş token'lar', 'Sabitlenmiş sekmeler'.) |
| place order / order placed | Emir ver / Emir verildi ('Emir başarıyla verildi', 'TWAP emri verildi'.) |
| pool | havuz (As in Uniswap tr. 'Yalnızca ödüllü havuzları dahil et'.) |
| position | pozisyon (pl. pozisyonlar) (Button 'Pozisyonu yönet'; sentences 'Pozisyonlarınız'. The bold button names in success texts repeat the button text.) |
| Private (tab) | Gizli (Same as tr-B ('Gizli swap').) |
| Receipts (transaction details card) | İşlem kayıtları (The card lists the step transactions with links.) |
| refund | iade ('İade talep et', 'İadeyi görüntüle', 'İade sürüyor', 'İade tamamlandı', 'İade yapıldı'. Not 'geri ödeme'.) |
| revoke allowance / revocation | harcama onayını iptal et / onay iptali ('{{tokenSymbol}} harcama onayını iptal et', row label '{{tokenSymbol}} onay iptali'.) |
| risk disclaimer | risk bildirimi ('{{type}} risk bildirimi', as in Turkish capital-market wording.) |
| Send / Receive / You pay (amount card titles) | Gönderilecek / Alınacak / Ödenecek (Field forms, not buttons (term 47). Done card: 'Alınan' / 'İade edilen'. Limit mode: 'Satış' / 'Alış' (tr-B).) |
| support hub | Destek Merkezi (Follows tr-B 'hub' → 'merkez': 'Jumper Destek Merkezi'ni ziyaret edin'.) |
| task (step inside a mission) | alt görev ('{{type}} alt görevi', 'İsteğe bağlı alt görev', 'Alt görev tamamlandı'. The mission itself stays 'görev' (term 42).) |
| tier (activity goal) | kademe ('en üst kademeye ulaştınız'.) |
| Top up (deposit is too small) | Tutarı tamamla (Description: 'tutarı tamamlayın'.) |
| Trade (navigation tab, A/B label of the Exchange tab) | Trade (Kept in English. 'Al-Sat' is an avoid form for the Exchange tab (term 5), and this label points to the same route. The portfolio transaction type 'Trade' also stays 'Trade'.) |
| trade (one fill of a scheduled order) | dilim (pl. dilimler) ('Dilim 2: %50 gerçekleşti', column 'Dilimler', 'Kalan dilimler durdurulur'. Not 'işlem', because 'işlem' is the transaction (term 24).) |
| trade (one slice of a TWAP order) | dilim (Same as tr-B. 'Dilim sayısı', 'Dilim aralığı', 'Dilim başına tutar'.) |
| Try again / Retry | Tekrar dene; sentences 'tekrar deneyin' (Same label for both English forms.) |
| unlocked (perk) | kilidi açık / kilidi açıldı (Chip and tab 'Kilidi açık'; event 'avantajın kilidi açıldı'.) |
| verified (route, quote) | doğrulanmış ('Doğrulanmış', 'Yalnızca doğrulanmış', 'Doğrulanmış teklifler'. Token status: 'doğrulandı'.) |
