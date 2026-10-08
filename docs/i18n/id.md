# Indonesian (`id`)

Read [TRANSLATING.md](../../TRANSLATING.md) first.

- Variant: Indonesian (Indonesia), Bahasa Indonesia. Global wallets and local exchanges keep most crypto terms in English: swap, bridge, slippage, gas, chain, staking. Use standard spelling from KBBI for Indonesian words, for example 'kedaluwarsa'.
- Register: Anda. Write pronoun-free UI text where the sentence works without a pronoun. Never 'kamu' or '-mu'.
- Write buttons as the base verb without 'me-': 'Hubungkan', 'Setujui', 'Kirim', 'Tanda tangani'.
- Do not add an English plural '-s' to loanwords: 'Semua token', not 'Semua tokens'.
- Join Indonesian affixes to English verbs with a hyphen: 'di-bridge', 'di-stake', 'di-swap'. In longer text, use 'melakukan' + noun: 'melakukan swap'.
- Use sentence case for labels and titles: 'Detail transaksi', not 'Rincian Transaksi'.
- Put the modifier after the head noun: 'biaya jaringan', 'chain tujuan', 'harga limit'. Do not copy the English word order.

## Glossary

| # | English | Use | Do not use |
| --- | --- | --- | --- |
| 1 | bridge (noun) | bridge; tab and title: 'Bridge'; status: 'Bridge selesai' (Keep 'bridge', because 'jembatan' is the dictionary word for a road bridge.) | jembatan |
| 2 | bridge (verb) | bridge: button 'Bridge'; 'melakukan bridge'; passive 'di-bridge'; 'Bridge ke {{chain}}' (Use 'melakukan bridge' in sentences and 'di-bridge' for the passive, because 'menjembatani' means 'to mediate'.) | menjembatani; mem-bridge |
| 3 | swap (noun) | swap; tab and title: 'Swap'; status: 'Swap berhasil' (Keep 'Swap' as the tab name, because the Exchange page uses 'Tukar'.) | pertukaran; penukaran |
| 4 | swap (verb) | swap: button 'Swap'; 'melakukan swap'; passive 'di-swap' (Use 'melakukan swap' in sentences and keep 'tukar' for the Exchange page.) | bertukar; menukarkan (for the Swap action) |
| 5 | exchange | title and button: 'Tukar'; token pages: 'Tukar dari' / 'Tukar ke' (Do not use 'Bursa', because it means a trading platform such as Indodax.) | Bursa; Pertukaran; Exchange |
| 6 | cross-chain | cross-chain: 'swap cross-chain', 'transfer cross-chain' (Put 'cross-chain' after the noun, as OKX, Pintu and Binance do.) | rantai silang; lintas rantai |
| 7 | gas | gas (Keep 'gas' in every string, as all Indonesian sources do.) | bensin; bahan bakar |
| 8 | gas fee / network fee | biaya gas; biaya jaringan (Put 'biaya' first: 'biaya gas', 'biaya jaringan'.) | ongkos jaringan; gas fee |
| 9 | slippage | slippage; 'Slippage maks.'; 'toleransi slippage' (Keep 'slippage' and replace the MetaMask form 'Selip' and the current 'Slip'.) | selip; slip; Slip maksimum |
| 10 | price impact | dampak harga (Use the short form 'Dampak harga', as MetaMask and Uniswap do.) | dampak terhadap harga; efek harga |
| 11 | route | rute; 'Rute terbaik' (Use 'rute' for one path through bridges and DEXs.) | jalur; rute perjalanan |
| 12 | quote | kuotasi; 'Jumlah kuotasi'; 'Kuotasi terbaik' (Use 'kuotasi', because 'kutipan' means a citation.) | kutipan; Jumlah yang dikutip |
| 13 | chain / blockchain | chain: 'Pilih chain'; blockchain for the technology (Use 'chain' when the English says 'chain' and 'jaringan' when the English says 'network'.) | rantai |
| 14 | network (synonym of chain in wallet UIs) | jaringan; 'Semua jaringan' (Use 'jaringan' for the network selector and network fees.) | network; net |
| 15 | from chain / to chain (source / destination) | chain sumber / chain tujuan; short labels: 'Dari' / 'Ke' (Use 'chain sumber' and 'chain tujuan', as MetaMask, OKX and Binance do.) | chain asal; jaringan penerima |
| 16 | token | token (no plural '-s') (Do not add a plural ending: write 'Semua token' and 'Token saya'.) | tokens; koin (for a token) |
| 17 | native token (ETH on Ethereum, SOL on Solana) | token native; 'token native {{chain}}' (Use 'token native', because the MetaMask form 'token asli' can read as 'genuine token'.) | token asli |
| 18 | stablecoin | stablecoin (Keep 'stablecoin', as MetaMask and Uniswap do.) | koin stabil; mata uang stabil |
| 19 | wallet | dompet (Keep 'Wallet' only inside product names such as 'OKX Wallet'.) | wallet (as a plain label); tas uang |
| 20 | connect wallet / connect (button) | 'Hubungkan dompet'; short button: 'Hubungkan' (Use 'Hubungkan', as MetaMask and Uniswap do.) | Sambungkan dompet; Koneksikan |
| 21 | disconnect | 'Putuskan koneksi' (Use 'Putuskan koneksi', because disconnecting a wallet is not a log-out.) | Keluar; Lepas |
| 22 | approve / token approval (ERC-20 allowance) | setujui / persetujuan; 'Setujui penggunaan {{token}}'; 'batas penggunaan' (Do not use 'pengeluaran', because it means household spending.) | Menyetujui pengeluaran; izinkan |
| 23 | sign / signature (wallet signature request) | tanda tangani / tanda tangan; 'Permintaan tanda tangan'; 'Tanda tangani transaksi' (Replace the current 'Mempersiapkan' ('preparing') with 'Tanda tangani' in the sign step.) | Mempersiapkan; teken |
| 24 | transaction | transaksi (Use 'transaksi', as every Indonesian source does.) | operasi; transaction |
| 25 | transaction hash | hash transaksi (Keep 'hash', because users see this word in block explorers.) | ringkasan transaksi; ID transaksi |
| 26 | pending / completed / failed / refunded (transaction status words) | Menunggu / Selesai / Gagal / Dana dikembalikan (Use 'Menunggu' for pending, because 'Tertunda' also means 'delayed'.) | Tertunda; Berakhir (for failed) |
| 27 | DEX | DEX (Keep the acronym and explain it as 'bursa terdesentralisasi (DEX)' only in help text.) | bursa terdesentralisasi (as a label) |
| 28 | aggregator | agregator; 'agregator likuiditas' (Use 'agregator', as MetaMask and Uniswap do.) | pengumpul; penghimpun |
| 29 | liquidity | likuiditas (Use 'likuiditas', as all sources do.) | — |
| 30 | yield | imbal hasil (Use 'imbal hasil', the standard Indonesian finance term that Uniswap uses.) | hasil panen; yield |
| 31 | APY | APY (Keep the acronym 'APY', as Uniswap does.) | bunga tahunan; persentase hasil tahunan |
| 32 | vault | vault (Keep 'vault' as Uniswap does, and keep the protocol name when the vault has one.) | brankas; lemari besi |
| 33 | staking | staking; 'melakukan staking'; passive 'di-stake' (Do not use 'taruhan', because it means 'a bet'.) | taruhan; pertaruhan |
| 34 | deposit | deposit; 'Deposit selesai' (Use 'deposit' in every string, because 'deposito' means a bank time deposit.) | deposito; setoran (mixed with deposit) |
| 35 | withdraw | tarik / penarikan (Use 'tarik' on the button and 'penarikan' for the noun.) | ambil; cairkan |
| 36 | limit order | limit order; 'Harga limit' (Keep 'limit order', as Binance and Uniswap do.) | pesanan batas; order terbatas |
| 37 | TWAP order / scheduled order | TWAP order; order terjadwal (Use 'order' as in 'limit order', because 'pesanan' means a shop order.) | pesanan terjadwal |
| 38 | market cap | kapitalisasi pasar (Use the full form 'kapitalisasi pasar', as Uniswap does.) | kap pasar; modal pasar |
| 39 | refuel / get gas | 'Dapatkan gas'; 'Dapatkan gas di {{chain}}' (Keep 'gas' from term 7.) | Isi bensin; Isi ulang bahan bakar |
| 40 | airdrop | airdrop (Keep 'airdrop', as all sources do.) | pembagian gratis; hadiah udara |
| 41 | points / XP | poin; XP (Use 'poin', because 'titik' means a dot.) | titik; nilai |
| 42 | quest / mission | misi (Use 'misi' for every quest and mission.) | pencarian; quest |
| 43 | rewards / claim (rewards) | reward; button: 'Klaim'; 'Klaim reward' (Use 'reward', because 'hadiah' reads as 'gift' or 'prize'.) | hadiah; ambil |
| 44 | portfolio | portofolio (Use the KBBI spelling 'portofolio', as Uniswap does.) | portfolio; portopolio |
| 45 | balance | saldo; 'Total saldo' (Use 'saldo', because 'keseimbangan' means physical balance.) | keseimbangan; neraca |
| 46 | max (button that fills the full balance) | Maks (Use the short form on the button.) | MAKSIMUM; Semua |
| 47 | send / receive | Kirim / Terima (Use the base verb on buttons and 'Mengirim' or 'Menerima' only in progress text.) | Mengirim / Menerima (on buttons) |
| 48 | recipient / receiving address | penerima; 'alamat penerima' (Use 'penerima' for the person and 'alamat penerima' for the address field.) | resipien; tujuan (for a person) |
| 49 | minimum received | Minimum diterima (Use 'Minimum diterima' and remove the typo in the current 'Minimal. diterima'.) | Minimal. diterima; Jumlah minimal yang didapat |
| 50 | fee (integrator fee, "Jumper fee") | biaya; 'Biaya Jumper'; 'Biaya integrator'; 'Biaya penyedia' (Use 'biaya' for every fee, as for network fees.) | komisi; ongkos; fee |
| 51 | estimated time | Estimasi waktu (Use 'Estimasi waktu' in every string, although OKX uses 'Perkiraan waktu'.) | Waktu perkiraan; Jam estimasi |
| 52 | high value loss (warning when a route loses a lot of value) | Kerugian nilai besar (Use 'Kerugian nilai besar', because the current text reads as 'losing a high value'.) | Kehilangan nilai tinggi |
| 53 | on-ramp / buy with card | 'Beli dengan kartu'; 'Beli kripto' (Name the action, because users do not know the word 'on-ramp'.) | on-ramp; jalur masuk |
| 54 | leaderboard | Papan peringkat (Use 'Papan peringkat', as MetaMask does.) | Leaderboard; Papan pemimpin |
| 55 | perks | benefit (Use 'benefit', because 'keuntungan' also means 'profit' in a trading app.) | keuntungan; tunjangan |
| 56 | earn (the product page where users earn yield) | Earn (page and product name); verb in sentences: 'dapatkan' (Keep 'Earn' as the page name and use 'dapatkan' only inside sentences.) | Dapatkan (as the page title); Penghasilan |
| 57 | trigger price (limit orders) | harga pemicu (Use 'harga pemicu', as MetaMask does for orders.) | harga picu; harga trigger |
| 58 | expiry / expires (orders) | kedaluwarsa; 'Kedaluwarsa dalam {{duration}}'; 'Order kedaluwarsa' (Use the KBBI spelling 'kedaluwarsa', not the common misspelling 'kadaluarsa'.) | kadaluarsa; berakhir |

## More terms

These terms are in use in the current texts. Use them for the same concepts.

| English | Use |
| --- | --- |
| 7d / 30d (time window) | 7H / 30H (Chosen short form (H = hari): 'APY 7H'. No source was checked for this form.) |
| activity / activities | Aktivitas (Activities page title and checkout activity list.) |
| allowance | batas penggunaan (Term 22. 'Batas penggunaan tidak mencukupi'.) |
| Best Return (route tag and priority) | Hasil terbaik (Not 'Pengembalian terbaik' (clashes with refund) and not 'imbal hasil' (term 30 yield).) |
| bookmark / bookmarked | bookmark / di-bookmark (One word family for all bookmark keys: 'Bookmark dompet', 'Tambahkan bookmark', 'Dompet yang di-bookmark'. Not 'ditandai', which is used for 'flagged'.) |
| browser | browser (Same as id-B ('ekstensi browser'). 'Hubungkan dompet browser'. Not 'peramban'.) |
| cash (fiat payment by card) | fiat ('Deposit dengan fiat'. Not 'tunai', because 'uang tunai' means physical cash and the method is a debit or credit card.) |
| checkout | Checkout (Loanword, as in Indonesian e-commerce: 'Tutup checkout', 'Detail checkout'.) |
| Clear filters / Clear all | Hapus filter / Hapus semua (Filter bars and empty lists.) |
| collateral | kolateral (Risk texts: 'anjloknya harga kolateral', 'penurunan nilai kolateral'.) |
| connected (wallet) | terhubung ('Dompet terhubung', tag 'Terhubung'. Connecting = 'Menghubungkan'.) |
| convert / conversion | konversi (Button 'Konversi saldo kecil', 'Tinjau konversi', 'Konversi selesai'.) |
| crypto | kripto ('Transfer kripto'. Same form as term 53 'Beli kripto'.) |
| deposit window | waktu deposit ('sebelum waktu deposit habis'. Not the calque 'jendela deposit'.) |
| details | detail (Same as id-B ('Lihat detail', 'Detail order'): 'Detail transaksi', 'Detail deposit', 'Lihat detail transfer'. Not 'rincian'.) |
| dismiss | Abaikan (Dismiss action on activity items.) |
| do your own research (DYOR) | lakukan riset sendiri ('Selalu lakukan riset sendiri'.) |
| dust / dust tokens | saldo kecil ('Konversi saldo kecil', 'Saldo kecil yang bisa dikonversi'. Not 'debu' (literal). Not 'dust'.) |
| Exact-output (tab) | Output pasti (Tab label next to 'Multi-swap', 'TWAP', 'Limit'.) |
| exchange (centralized exchange, CEX) | bursa (Same as id-B. 'Hubungkan bursa', 'Tautkan akun bursa Anda', 'Koneksi bursa gagal', 'transfer langsung ke bursa'. DEX list keys use 'DEX' (term 27); the Exchange tab uses 'Tukar' (term 5).) |
| exchange rate / rate | nilai tukar ('Nilai tukar', 'Nilai tukar berubah', 'Perubahan nilai tukar', 'Nilai tukar gabungan'. Not 'rate' or 'tarif'.) |
| explorer | explorer ('Lihat di explorer'.) |
| filled / partially filled (order status) | Terisi / Terisi sebagian (Status labels and '{{progress}}% terisi'.) |
| flagged as malicious / malicious | ditandai berbahaya / berbahaya ('Token berbahaya terdeteksi', '{{tokenSymbol}} ditandai berbahaya oleh Hypernative'.) |
| gasless | tanpa gas (Tag 'Tanpa gas', fee row 'Layanan tanpa gas'.) |
| holdings (portfolio view) | Kepemilikan (Portfolio view tab next to 'Performa' and 'Transaksi'.) |
| idle (tokens, assets) | menganggur ('token menganggur Anda', '{{symbol}} Anda yang menganggur'.) |
| lockup / lock-up period | penguncian; 'Periode penguncian' (Tooltip uses 'dikunci selama {{formattedLockupPeriod}}'.) |
| market (Earn) | pasar ('Semua pasar', 'Pasar terkait', 'di pasar ini'. Also 'Harga pasar' for limit orders.) |
| multi-step | Beberapa langkah (Route tag. 'Setiap langkah' in the tooltip.) |
| opportunity (Earn) | peluang ('untuk peluang ini', 'Peluang Earn baru'. Same word in 'peluang investasi' in the risk disclaimers.) |
| order (limit or scheduled) | order ('Batalkan order', 'Pertahankan order', 'Order terjadwal' (term 37). Not 'pesanan'.) |
| paused (order or session) | Dijeda (Order status 'Dijeda', 'Sesi dijeda'.) |
| pending (in sentences and process steps) | menunggu konfirmasi ('Transaksi swap menunggu konfirmasi', 'Order menunggu konfirmasi'. Follows term 26 ('Menunggu'), never 'tertunda'.) |
| perk hub / mission hub | pusat benefit / pusat misi (Sentence case: 'Buka pusat benefit', 'Buka pusat misi'. Perks stay 'benefit' (term 55).) |
| pin / pinned | sematkan / yang disematkan ('Token yang disematkan', 'Tab yang disematkan'.) |
| Place order (button) / order placed | Buat order / Order dibuat (Differs from 'Tinjau' and 'Konfirmasi'. 'Order berhasil dibuat', 'Pembuatan order selesai'. Matches id-B 'membuat order baru'.) |
| position | posisi ('Kelola posisi Anda', 'Posisi Anda', 'Tidak ada posisi'.) |
| preparing (process step) | Menyiapkan ('Menyiapkan transaksi bridge', 'Menyiapkan order'. Avoids 'Mempersiapkan', which term 23 bans for the sign step.) |
| purchase / order (checkout flow) | pembelian / pesanan (Checkout keys only: 'Tinjau pembelian', 'Pembelian berhasil', 'Pesanan kedaluwarsa'. A checkout order is a shop order, so 'pesanan' fits there. Trading orders stay 'order' (term 37).) |
| recent (wallets, searches, transactions) | terbaru ('Dompet terbaru', 'Pencarian terbaru', 'Tidak ada transaksi terbaru'.) |
| Refresh | Muat ulang ('Muat ulang transaksi', 'Muat ulang order'.) |
| refresh (page) | muat ulang (Same as id-B 'Muat ulang'. Not 'segarkan'.) |
| refund (noun) / request refund | pengembalian dana; button 'Ajukan pengembalian dana' ('Pengembalian dana sedang diproses', 'Pengembalian dana selesai'. The status label stays 'Dana dikembalikan' (term 26). 'Refund issued' = 'Dana berhasil dikembalikan'.) |
| reset | Setel ulang ('Setel ulang', 'Setel ulang pengaturan', verb 'menyetel ulang'. Not 'Atur ulang'.) |
| revoke (approval) | Cabut ('Cabut', 'Cabut delegasi'.) |
| revoke (approval) / revocation | Cabut persetujuan / Pencabutan persetujuan (id-B uses 'Cabut'. 'Cabut persetujuan {{tokenSymbol}}'.) |
| risk disclaimer | penafian risiko ('Lihat penafian risiko {{type}}'.) |
| small balances | saldo kecil (Same as id-B dust term. 'Sembunyikan saldo kecil'.) |
| smart contract / smart account | smart contract / smart account (Kept in English. id-B also writes 'smart contract'. 'Akun smart contract'. Not 'kontrak pintar'.) |
| Start earning (CTA) | Mulai Earn (Keeps the Earn page name (term 56) on the CTA.) |
| supplied / borrowed (lending position) | Disuplai / Dipinjam (Position card headers.) |
| support | dukungan (Same as id-B. Button 'Hubungi dukungan'. 'Jumper Support Hub' stays a page name.) |
| support (help channel) | dukungan (Menu 'Dukungan', 'hubungi tim dukungan kami', 'tiket dukungan'.) |
| task (step inside a mission) | tugas ('Tugas opsional', 'Tugas selesai'. The mission stays 'misi' (term 42).) |
| top up | Top up (Common Indonesian loanword (e-wallets). Sentence form: 'Lakukan top up'.) |
| trade (one TWAP slice) | trade (Same as id-B. 'Jumlah per trade', 'Interval trade', 'Jumlah trade'.) |
| Try again / Retry | Coba lagi (Error dialogs and retry buttons. Sentence form: 'Silakan coba lagi.') |
| unlock / unlocked (perks) | buka / terbuka ('Benefit terbuka', 'membuka lebih banyak benefit'.) |
| verified / unverified | terverifikasi / belum terverifikasi ('Kuotasi terverifikasi', 'Hanya terverifikasi', 'Diverifikasi oleh Hypernative', 'Belum diverifikasi oleh Hypernative'.) |
| verify / ownership | verifikasi / kepemilikan ('Verifikasi kepemilikan', 'Verifikasi dompet'.) |
