# Polish (`pl`)

Read [TRANSLATING.md](../../TRANSLATING.md) first.

- Variant: Polish (Poland), pl-PL. Both repositories have no Polish strings today (the widget pl.json has only the language name), so this glossary is the first baseline.
- Register: ty (informal), with capitalized 'Twój' / 'Twoje'. Buttons use the 2nd person imperative ('Połącz portfel', 'Wymień').
- Buttons use the 2nd person singular imperative: 'Połącz portfel', 'Wymień', 'Przenieś', 'Zatwierdź', 'Podpisz'. Do not use the infinitive ('Połączyć').
- Write 'Twój', 'Twoje' and 'Ciebie' with a capital letter when you address the user. Use sentence case for labels: 'Zlecenie z limitem'.
- Decline loanwords like Polish nouns: token – tokena – tokeny – tokenów; swap – swapu – swapem – swapy; stablecoin – stablecoina – stablecoiny; airdrop – airdropu – airdropy.
- Do not use gendered past forms for the user ('Ograniczyłeś'). Use impersonal forms instead ('Ograniczono', 'Nie znaleziono trasy').
- Make status words agree with 'transakcja' (feminine): 'Zakończona', 'Nieudana'.
- Use „…” quotation marks, a decimal comma and a space as the thousands separator: '1 234,56'.

## Glossary

| # | English | Use | Do not use |
| --- | --- | --- | --- |
| 1 | bridge (noun) | most (m.) : most – mostu – mosty – mostów ; 'most międzyłańcuchowy' (Polish UIs and media say 'most'. Keep the protocol name as it is: 'most Stargate'.) | bridge, mostek, pomost |
| 2 | bridge (verb) | przenieść (przycisk: 'Przenieś') ; w zdaniu: 'przenieś przez most' (Use 'Przenieś' on buttons. The neologism 'pomostuj' reads like a machine translation.) | pomostować, zmostkować, bridgować |
| 3 | swap (noun) | swap (m.) : swap – swapu – swapem – swapy (Use 'swap' in labels and status text: 'Swap zakończony', 'Szczegóły swapu'.) | zamiana, wymiana (jako rzeczownik w statusie) |
| 4 | swap (verb) | wymienić (przycisk: 'Wymień') (Use 'Wymień' on the swap button.) | Zamień, Swapuj |
| 5 | exchange | Wymiana (zakładka i tytuł) ('Giełda' means a centralized exchange, so the tab for swaps and bridges uses 'Wymiana'.) | Giełda, Kantor, Exchange |
| 6 | cross-chain | międzyłańcuchowy (przymiotnik) : 'swap międzyłańcuchowy', 'most międzyłańcuchowy' (Polish UIs use 'sieć' for one chain (id 13) but 'międzyłańcuchowy' for cross-chain. Keep both forms.) | krzyżowo-łańcuchowy, cross-chain (w zdaniu) |
| 7 | gas | gaz (m.) : gaz – gazu – gazem (Decline 'gaz' like a Polish noun. Use 'Gaz' as the tab name too.) | benzyna, paliwo |
| 8 | gas fee / network fee | opłata sieciowa (pl. opłaty sieciowe) (Use 'Opłata sieciowa' as the fee label. Keep 'prowizja' for the service fee (id 50).) | prowizja sieci, opłata za gaz (jako etykieta) |
| 9 | slippage | poślizg (cenowy) (m.) : 'Maks. poślizg', 'tolerancja poślizgu' (All checked Polish UIs translate slippage as 'poślizg'.) | slippage, ześlizg, przesunięcie |
| 10 | price impact | wpływ na cenę (Use 'Duży wpływ na cenę' for the warning.) | wpływ cen, wpływ wysokiej ceny |
| 11 | route | trasa (f.) : trasa – trasy – tras (Use 'trasa' when the UI compares paths: 'Nie znaleziono trasy'.) | droga, ścieżka, routing |
| 12 | quote | wycena (f.) : 'Pobierz nową wycenę' (Use 'wycena' for the price of one route.) | cytat, notowanie, kwotowanie |
| 13 | chain / blockchain | sieć (f.) ; 'blockchain' (m.) dla technologii (Use 'sieć' in selectors: 'Wybierz sieć', 'Przełącz sieć'.) | łańcuch (w etykietach) |
| 14 | network (synonym of chain in wallet UIs) | sieć (f.) (Chain and network mean the same thing in this UI, so both use 'sieć'.) | network, łańcuch |
| 15 | from chain / to chain (source / destination) | sieć źródłowa / sieć docelowa ; etykiety: 'Z' / 'Do' (Keep 'sieć' as in id 13.) | łańcuch źródłowy / łańcuch docelowy |
| 16 | token | token (m.) : token – tokena – tokeny – tokenów (Decline it like a Polish noun.) | żeton |
| 17 | native token (ETH on Ethereum, SOL on Solana) | natywny token (Use it for the coin that pays gas, for example ETH or SOL.) | rodzimy token, tubylczy token |
| 18 | stablecoin | stablecoin (m.) : stablecoina – stablecoiny – stablecoinów (Keep the English word and decline it.) | stabilna moneta |
| 19 | wallet | portfel (m.) : portfela – portfele (All checked Polish UIs translate wallet as 'portfel'.) | wallet, sakiewka |
| 20 | connect wallet / connect (button) | Połącz portfel ; krótko: 'Połącz' (Use the same verb on the header button and in prompts.) | Podepnij portfel, Podłącz portfel |
| 21 | disconnect | Odłącz ('Odłącz portfel') ('Wyloguj' means to log out of an account.) | Wyloguj, Rozłącz |
| 22 | approve / token approval (ERC-20 allowance) | Zatwierdź (przycisk) ; 'zatwierdzenie' (rzeczownik) ; allowance: 'zatwierdzona kwota' (Use one verb for the approval step.) | Zaakceptuj, Zezwól |
| 23 | sign / signature (wallet signature request) | Podpisz (przycisk) ; 'podpis' (rzeczownik) ; 'prośba o podpis' ('Zaloguj się' means log in, which PancakeSwap PL wrongly uses for 'Sign in your wallet'.) | Zaloguj się, Sygnuj |
| 24 | transaction | transakcja (f.) ('Przelew' means a bank transfer.) | przelew, operacja |
| 25 | transaction hash | hash transakcji (m.) (Keep 'hash' in English.) | skrót transakcji |
| 26 | pending / completed / failed / refunded (transaction status words) | Oczekująca / Zakończona / Nieudana / Zwrócona (Make the status agree with 'transakcja'. 'Zwrócona' means the funds came back.) | W toku / Kompletna / Porażka / Zwrot |
| 27 | DEX | DEX (m., nieodmienny) ; w zdaniu: 'giełda DEX' (Keep the acronym. Add 'giełda' when the sentence needs a case ending.) | zdecentralizowana wymiana |
| 28 | aggregator | agregator (m.) (Keep the loanword.) | zbieracz |
| 29 | liquidity | płynność (f.) (Use it for pool and route liquidity.) | likwidność |
| 30 | yield | zysk (m.) (Use 'zysk' for what a vault or staking position pays, and 'APY' for the rate.) | plon, żniwo, przychód |
| 31 | APY | APY (Keep 'APY' in labels.) | roczna stopa zwrotu (w etykiecie) |
| 32 | vault | vault (m.) : vaulta – vaulty (Keep the DeFi term for Earn vaults.) | skarbiec, sejf |
| 33 | staking | staking (m.) ; czasownik: 'stakować' (przycisk: 'Stakuj') (Use 'Stakuj' on buttons.) | stawianie, obstawianie |
| 34 | deposit | Wpłać (przycisk) ; 'wpłata' (rzeczownik) (Pair it with 'Wypłać' (id 35).) | Depozyt (jako przycisk), Zdeponuj |
| 35 | withdraw | Wypłać (przycisk) ; 'wypłata' (rzeczownik) (Pair it with 'Wpłać'.) | Wycofaj, Podejmij |
| 36 | limit order | zlecenie z limitem ; 'cena limitu' ('Zamówienie' means a shop order.) | zamówienie limitowe, limit order |
| 37 | TWAP order / scheduled order | zlecenie TWAP ; scheduled: 'zaplanowane' (Keep 'TWAP' as an acronym.) | zlecenie średniej ceny ważonej czasem |
| 38 | market cap | kapitalizacja rynkowa (Use the Polish term. PancakeSwap PL leaves it in English.) | market cap, czapka rynkowa |
| 39 | refuel / get gas | Uzyskaj gaz (przycisk) ; zakładka: 'Gaz' (Use 'Uzyskaj gaz' for the action.) | Zatankuj, Zatankować |
| 40 | airdrop | airdrop (m.) : airdropu – airdropy (Keep the English word and decline it.) | zrzut |
| 41 | points / XP | XP ; gdzie indziej: 'punkty' (Keep 'XP' for Jumper XP and use 'punkty' for other points.) | punkty doświadczenia |
| 42 | quest / mission | misja (f.) (Jumper uses 'Missions', so use 'misja' for every quest or mission.) | quest, zadanie |
| 43 | rewards / claim (rewards) | nagrody ; przycisk: 'Odbierz' (Use 'Odbierz' on the claim button.) | Zażądaj, Roszczenie |
| 44 | portfolio | portfolio (n., nieodmienne) (Keep 'portfolio' so that 'portfel' means only the wallet.) | portfel (zarezerwowany dla 'wallet') |
| 45 | balance | saldo (n.) (Use 'saldo' for the token balance.) | bilans, równowaga |
| 46 | max (button that fills the full balance) | Maks. (Keep the Polish abbreviation with a period.) | Maksimum, Max |
| 47 | send / receive | Wyślij / Otrzymaj ; w zdaniu: 'Otrzymasz' (Use 'Otrzymaj', not 'Odbierz', so that 'Odbierz' stays free for claims (id 43).) | Prześlij / Dostań |
| 48 | recipient / receiving address | odbiorca (m.) ; 'adres odbiorcy' (Use 'adres odbiorcy' for the address field.) | beneficjent, adres odbierający |
| 49 | minimum received | Otrzymasz co najmniej ('Otrzymano minimum' reads as if the user already got the money.) | Otrzymano minimum |
| 50 | fee (integrator fee, "Jumper fee") | prowizja (f.) : 'Prowizja Jumper', 'Prowizja integratora', 'Prowizja dostawcy' (Use 'prowizja' for service fees and 'opłata sieciowa' for chain fees.) | opłata (zarezerwowana dla id 8), honorarium |
| 51 | estimated time | Szacowany czas (Use 'Szac. czas' only when space is short.) | Przewidywany czas przybycia, ETA |
| 52 | high value loss (warning when a route loses a lot of value) | Duża utrata wartości (Use it as the warning title.) | Wysoka strata wartości |
| 53 | on-ramp / buy with card | Kup kartą ; sekcja: 'Kup kryptowaluty' (Use 'Kup' on the button.) | rampa, on-ramp (w etykiecie) |
| 54 | leaderboard | Ranking ; 'pozycja w rankingu' (Use 'Ranking' because Jumper shows the user's rank in it.) | Tabela liderów, Leaderboard |
| 55 | perks | korzyści (f. pl.) (Translate the feature as a common noun. Keep 'Perks' only in a fixed brand name.) | perki, profity |
| 56 | earn (the product page where users earn yield) | Earn (nazwa strony) ; czasownik: 'zarabiać' (Keep 'Earn' as the page name, as OKX Wallet PL does, and translate the verb in sentences.) | Zarabiaj (jako nazwa strony) |
| 57 | trigger price (limit orders) | cena wyzwalająca (Use it for the price that starts a limit order.) | cena spustowa, cena triggera |
| 58 | expiry / expires (orders) | wygaśnięcie (n.) ; 'Wygasa za {{time}}' ; 'Wygasło' (Use 'Wygasa za' for a countdown and 'Wygasło' for the final status.) | przedawnienie, termin ważności |

## More terms

These terms are in use in the current texts. Use them for the same concepts.

| English | Use |
| --- | --- |
| allowance | zatwierdzona kwota ; 'Za niska zatwierdzona kwota' (Term 22 note.) |
| Best Return (route tag and route priority) | Najlepszy kurs (Other route tags agree with 'trasa' (f.): 'Najszybsza', 'Wieloetapowa', 'Zweryfikowana', 'Bez gazu'.) |
| bookmark (saved wallet address) | zapisane ; przycisk: 'Zapisz' ; 'Zapisane portfele', 'Dodaj do zapisanych' ('Zakładka' is kept for UI tabs.) |
| boost / boosted APR | boost (m.) : boostu – boosty ; 'APR z boostem' (Crypto users use the loanword. 'Base APR' is 'Bazowe APR'.) |
| bps (basis points) | pb (Standard Polish finance abbreviation for punkty bazowe.) |
| bridge (the operation, not the protocol) | przeniesienie (n.) ; 'Przeniesienie udane', 'transakcja przeniesienia', 'Rozpocznij przeniesienie' (The tab and page title 'Bridge' stays 'Most' (term 1). The button stays 'Przenieś' (term 2). Same as pl-B task header 'Przeniesienie'.) |
| centralized exchange (CEX) | giełda (f.) ; 'portfel giełdy', 'niewypłacalność giełdy' (Use it only for a CEX. The Exchange tab stays 'Wymiana' (term 5).) |
| checkout (widget title) | Płatność ; 'Szczegóły płatności', 'Wyjść z płatności?' (Not 'Kasa' and not the English word.) |
| Contact support (button) | Napisz do supportu (Short imperative. Sentences use 'skontaktuj się z supportem' (pl-B).) |
| deposit address / deposit window | adres wpłaty / okno wpłaty (Matches 'wpłata' (term 34).) |
| deposit with cash (card on-ramp in checkout) | Wpłać kartą (The subtitle is 'Debit or credit card' and the cash error keys talk about card payments. 'Gotówka' reads as physical cash.) |
| do your own research | zrób własny research ('Zawsze zrób własny research'.) |
| dust (small token balances) | drobne salda ; przycisk: 'Konwertuj drobne salda' (Follows the reviewed pilot banner text. Do not use the English word 'dust' in UI text.) |
| Exact-output (tab and title) | Kwota docelowa (Short tab label. The user sets the destination amount.) |
| exchange account (CEX, checkout) | konto giełdowe ; 'Połącz giełdę', 'Powiąż swoje konto giełdowe' ('Link' uses 'Powiąż', as pl-B 'Powiąż portfel'.) |
| exchange rate / rate | kurs wymiany ; 'Kurs się zmienił', 'Zmiana kursu', 'Łączny kurs' (Exchange tab stays 'Wymiana' (term 5).) |
| Exchanges (DEX list in settings) | Giełdy DEX ; 'Szukaj po nazwie giełdy DEX', 'agregatory DEX' (Term 27 with 'giełda' for the case ending. A CEX alone is 'giełda' (pl-B).) |
| explorer / block explorer | eksplorator / eksplorator bloków ; 'Zobacz w eksploratorze' (Same as pl-B.) |
| filled (order) | zrealizowane ; 'Częściowo zrealizowane' (Order statuses agree with 'zlecenie' (neuter): 'Anulowane', 'Wygasło', 'Nieudane', 'Wstrzymane', 'Oczekujące'.) |
| hub (Perks hub, Mission hub) | centrum ; 'centrum korzyści', 'centrum misji' (Perks is a common noun (term 55), so the hub name is translated too.) |
| intrinsic yield | zysk bazowy (Used in the APY and APR tooltips together with 'nagrody protokołu'.) |
| lockup / lock-up period | blokada ; 'Okres blokady' (Countdown texts use 'do końca'.) |
| multichain (wallet tag) | Wielołańcuchowy (Follows pl-B 'wielołańcuchowy'.) |
| opportunity (Earn market) | oferta (f.) (Follows the reviewed pilot ('Wpłaty dla tej oferty…'). Because of this, the transaction type 'Bid' uses 'Licytacja', not 'Oferta'.) |
| oracle | wyrocznia (f.) ('manipulacja wyroczniami', 'awarie wyroczni'.) |
| order (checkout purchase order) | zamówienie (n.) ; 'Zamówienie wygasło' (Limit and TWAP orders stay 'zlecenie' (term 36).) |
| pending (process line) | Oczekująca / Oczekujące … ; 'Oczekująca transakcja swapu', 'Oczekujące zatwierdzenie {{tokenSymbol}}', 'Oczekujące zlecenie' (Agrees with the noun, as term 26 says.) |
| performance / management / deposit / withdrawal fee | Prowizja za wyniki / za zarządzanie / za wpłatę / za wypłatę (These are service fees, so they use 'prowizja' (term 50).) |
| permit (signed message) | wiadomość permit ; 'Podpisz wiadomość permit' (Keeps the technical name. Avoids 'Zezwól' (term 22 avoid).) |
| perps (perpetual futures) | perpy (pl.) (Keep 'Jumper Perps' as the product name.) |
| purchase | zakup (m.) ; 'Sprawdź zakup', 'Zakup udany', 'Trwa zakup' |
| refund / refunded | zwrot (m.) ; 'Poproś o zwrot', 'Zobacz zwrot', 'Zwrot zakończony' ; status: 'Zwrócono' ; title 'Refund issued': 'Zwrócono środki' (Because 'zwrot' means refund, the route tag 'Best Return' does not use 'zwrot'.) |
| Review / Confirm (buttons) | Sprawdź / Potwierdź ; 'Sprawdź swap', 'Sprawdź przeniesienie', 'Sprawdź wpłatę', 'Sprawdź zakup', 'Sprawdź zlecenie' (Same as pl-B. Keeps the two buttons different.) |
| Search {{filterBy}}... | Szukaj: {{filterBy}}... ({{filterBy}} is a lowercase nominative label or a chain name, so a colon frame avoids a wrong case.) |
| Send / Receive / You pay / Sell / Buy (amount card titles) | Wysyłasz / Otrzymasz / Płacisz / Sprzedajesz / Kupujesz (Card labels, not buttons. 'Received' (done) is 'Otrzymano'.) |
| small balances | drobne salda ; 'Ukryj drobne salda' (Same term as dust in pl-B.) |
| smart account / smart contract account | smart konto / konto smart kontraktu (Follows pl-B 'smart kontrakt'.) |
| smart contract | smart kontrakt (m.) (Common usage in Polish crypto media.) |
| Start swapping / Start bridging (execute button on the review page) | Rozpocznij swap / Rozpocznij przeniesienie (An action button, so not the marketing CTA 'Zacznij wymieniać'.) |
| support (team) | support (m.) ; menu item: 'Pomoc' (Follows the reviewed pilot ('zgłoszenie do supportu'). Sentences say 'skontaktuj się z naszym supportem'.) |
| tabs (navigation tabs) | zakładki ; 'Przypięte zakładki' |
| task (part of a mission) | zadanie (n.) ; 'Zadanie: {{type}}' (A task is a step inside a mission (misja, term 42). Use a colon frame because {{type}} is a raw English enum value.) |
| this operation (feature not supported) | ta funkcja (Avoids 'operacja', which the glossary avoids for 'transaction'.) |
| top up (send the missing deposit amount) | Dopłać (Used on the incomplete deposit screens.) |
| Trade (navbar tab in the A/B test) | Handel (The Exchange tab label stays 'Wymiana'. The portfolio transaction type 'Trade' uses 'Swap'.) |
| trade (one part of a scheduled TWAP order) | transza (f.) (Avoids a clash with 'transakcja' (term 24).) |
| transfer crypto (checkout funding option) | Wyślij kryptowaluty (Avoids 'Przelej' (term 24 avoids 'przelew') and 'Prześlij' (term 47 avoid).) |
| vault capacity | limit wpłat ; etykiety: 'Pozostały limit', 'Maks. limit' (More natural than the literal 'pojemność'.) |
| withdraw request / request withdraw | prośba o wypłatę ; przycisk: 'Poproś o wypłatę' (Matches 'prośba o podpis' (term 23). Do not use 'zlecenie', which is reserved for orders.) |
| … in progress (status titles) | Trwa … ; 'Trwa wpłata', 'Trwa zwrot', 'Trwa zakup' (Avoids 'W toku' (term 26 avoid list).) |
| … successful (result titles) | udany / udana / udane ; 'Swap udany', 'Wpłata udana', 'Zakup udany', 'Transakcja udana' ('Swap completed' (process status) stays 'Swap zakończony'.) |
