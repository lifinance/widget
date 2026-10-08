# German (`de`)

Read [TRANSLATING.md](../../TRANSLATING.md) first.

- Variant: German (Germany), de-DE. Use ß, not Swiss ss. The same text also serves users in Austria and Switzerland.
- Register: du (informal). Buttons use the infinitive, so the register shows only in sentences.
- Buttons use the infinitive with the object first: 'Wallet verbinden', 'Token auswählen', 'Swappen', 'Bridgen'. Do not use the imperative ('Starte', 'Tausche') on buttons.
- Use sentence case. Only nouns start with a capital letter: 'Transaktion fehlgeschlagen'. Do not put a period after a title or a status label.
- Join an English loanword and a German noun with a hyphen: 'Bridge-Gebühr', 'Swap-Details', 'Wallet-Adresse', 'Slippage-Toleranz'. Write 'Gas' compounds closed: 'Gaspreis', 'Gaslimit'.
- Use these genders: die Bridge, der Swap, das Gas, die Wallet, der Token (plural 'die Token'), die Slippage, die Chain, die DEX, der Stablecoin, der Airdrop, das Staking.
- Give loanword verbs German endings: 'bridgen', 'swappen', 'staken'; participles 'gebridgt', 'geswappt', 'gestakt'.
- Use German quotation marks „…“, a decimal comma, and a non-breaking space before % and units: '0,5 %'.

## Glossary

| # | English | Use | Do not use |
| --- | --- | --- | --- |
| 1 | bridge (noun) | Bridge (die; Plural: die Bridges) (Use 'Bridge' for the protocol and for the transfer, for example 'Bridge erfolgreich' and 'Bridge-Gebühr'.) | Brücke |
| 2 | bridge (verb) | bridgen (Button: 'Bridgen'; Partizip: 'gebridgt') ('Überbrücken' means to fill a gap and reads like a machine translation. The current widget uses 'Tauschen und überbrücken'.) | überbrücken |
| 3 | swap (noun) | Swap (der; Plural: die Swaps) (Use 'Swap' in labels and status text, for example 'Swap erfolgreich' and 'Swap-Details'.) | Tausch, Tauschgeschäft |
| 4 | swap (verb) | swappen (Button: 'Swappen'; Partizip: 'geswappt') (Use 'Swappen' on the swap button. Keep 'Tauschen' only for the Exchange tab (id 5).) | tauschen, wechseln, umtauschen |
| 5 | exchange | Tauschen (Tab und Titel) (German crypto users read 'Exchange' and 'Börse' as a centralized exchange, so the tab for swaps and bridges uses 'Tauschen'.) | Exchange, Börse |
| 6 | cross-chain | Cross-Chain (in Komposita: 'Cross-Chain-Swap', 'Cross-Chain-Bridge') (Write it with hyphens inside compounds.) | kettenübergreifend, Kreuzkette |
| 7 | gas | Gas (das) (Keep 'Gas' as the fee unit and as the tab name.) | Benzin, Treibstoff, Kraftstoff |
| 8 | gas fee / network fee | Netzwerkgebühr (Plural: Netzwerkgebühren) (Use one label for the fee that the chain charges, and do not mix it with 'Gasgebühr' in the same flow.) | Netzgebühr, Transaktionssteuer |
| 9 | slippage | Slippage (die): 'Max. Slippage', 'Slippage-Toleranz' (Use the feminine article: 'die Slippage', 'hohe Slippage'.) | Schlupf, Preisabweichung, Ausführungskursabweichung |
| 10 | price impact | Preisauswirkung ('Hohe Preisauswirkung') (Use the singular in labels and warnings.) | Preiseinfluss, Preisbelastung |
| 11 | route | Route (die; Plural: Routen) (Use 'Route' when the UI compares paths: 'Keine Route gefunden', 'Routen vergleichen'.) | Weg, Pfad |
| 12 | quote | Angebot (Plural: Angebote): 'Neues Angebot anfordern' (Use 'Angebot' for the price of one route. Use 'Kurs' only for the exchange rate.) | Zitat, Notierung, Kostenvoranschlag |
| 13 | chain / blockchain | Chain (die; Plural: Chains); 'Blockchain' für die Technologie (Use 'Chain' in selectors and labels: 'Chain auswählen', 'Chain wechseln'.) | Kette |
| 14 | network (synonym of chain in wallet UIs) | Netzwerk (das; Plural: Netzwerke) (Use 'Netzwerk' only where a wallet asks the user to switch: 'Netzwerk wechseln'.) | Netz |
| 15 | from chain / to chain (source / destination) | Quell-Chain / Ziel-Chain; Feldlabels: 'Von' / 'Nach' (The current widget uses 'Zu' for 'To'. Use 'Nach'.) | Quellkette / Zielkette; 'Zu' als Feldlabel |
| 16 | token | Token (der; Plural: die Token; Genitiv: des Tokens) (Use the plural without -s, as Ledger Live DE and MetaMask Mobile DE do.) | Münze, Wertmarke |
| 17 | native token (ETH on Ethereum, SOL on Solana) | nativer Token ('der native Token der Chain') (Use it for the coin that pays gas, for example ETH or SOL.) | einheimischer Token, ursprünglicher Token |
| 18 | stablecoin | Stablecoin (der; Plural: Stablecoins) (Keep the English word.) | stabile Münze |
| 19 | wallet | Wallet (die; Plural: Wallets) (Use the feminine article: 'deine Wallet'.) | Brieftasche, Geldbörse |
| 20 | connect wallet / connect (button) | Wallet verbinden; kurz: 'Verbinden' (Use the same verb for the header button and for prompts.) | Wallet anschließen, koppeln |
| 21 | disconnect | Trennen ('Wallet trennen') (Use 'Trennen' for the wallet. 'Abmelden' means to log out of an account.) | Abmelden, Verbindung abbrechen |
| 22 | approve / token approval (ERC-20 allowance) | genehmigen (Button: '{{token}} genehmigen'); Nomen: 'Genehmigung'; Allowance: 'genehmigter Betrag' (The current widget uses 'Zulassung' and 'Erlaubnis'. Use 'Genehmigung' for every approval string.) | zulassen, Zulassung, Erlaubnis |
| 23 | sign / signature (wallet signature request) | signieren (Button: 'Signieren'); Nomen: 'Signatur'; 'Signaturanfrage' (Use 'signieren' for wallet prompts. 'unterschreiben' belongs to paper contracts.) | unterzeichnen, unterschreiben, Unterschrift |
| 24 | transaction | Transaktion (Plural: Transaktionen) ('Überweisung' means a bank transfer. The current widget uses 'Überweisungsbetrag'.) | Überweisung, Vorgang |
| 25 | transaction hash | Transaktions-Hash (der); kurz: 'Tx-Hash' (Keep 'Hash' in English.) | Transaktionsprüfsumme, Streuwert |
| 26 | pending / completed / failed / refunded (transaction status words) | Ausstehend / Abgeschlossen / Fehlgeschlagen / Zurückerstattet (Use these four words as status labels, with no period.) | Anhängig / Vollendet / Gescheitert / Rückvergütet |
| 27 | DEX | DEX (die; Plural: DEXs) (Use the feminine article, from 'die Börse'.) | dezentralisierter Austausch |
| 28 | aggregator | Aggregator (der; Plural: Aggregatoren) (Keep the loanword.) | Sammler, Bündler |
| 29 | liquidity | Liquidität (Use it for pool and route liquidity.) | Flüssigkeit |
| 30 | yield | Rendite (Use 'Rendite' for what a vault or staking position pays.) | Ertrag, Ausbeute, Ernte |
| 31 | APY | APY (Keep 'APY' in labels. MetaMask DE mixes three forms, which confuses users.) | effektiver Jahreszins, Effektivertrag |
| 32 | vault | Vault (der; Plural: Vaults) (Keep the DeFi term for Earn vaults.) | Tresor, Gewölbe |
| 33 | staking | Staking (das); Verb: 'staken' (Use 'staken' as the verb: 'ETH staken'.) | Einsetzen, Einsatz |
| 34 | deposit | Einzahlen (Button); Nomen: 'Einzahlung' (Pair it with 'Auszahlen' (id 35).) | Deponieren, Anzahlung |
| 35 | withdraw | Auszahlen (Button); Nomen: 'Auszahlung' (Use 'Auszahlen' so that it pairs with 'Einzahlen'.) | Zurückziehen, Widerrufen |
| 36 | limit order | Limit-Order (die; Plural: Limit-Orders); 'Limitpreis' (Use 'Limit-Order' for the order and 'Limitpreis' for its price.) | Begrenzungsauftrag, Grenzauftrag |
| 37 | TWAP order / scheduled order | TWAP-Order; scheduled: 'geplant' (Keep 'TWAP' as an acronym.) | Zeitgewichteter-Durchschnittspreis-Auftrag |
| 38 | market cap | Marktkapitalisierung (Use the full German word. All checked UIs do.) | Marktobergrenze, Market Cap |
| 39 | refuel / get gas | Gas erhalten (Button); Tabname: 'Gas' (Use 'Gas erhalten' for the action and keep 'Gas' as the tab name.) | Tanken, Auftanken |
| 40 | airdrop | Airdrop (der; Plural: Airdrops) (Keep the English word.) | Abwurf, Luftabwurf |
| 41 | points / XP | XP (unverändert); allgemein: 'Punkte' (Keep 'XP' for Jumper XP and use 'Punkte' for other points.) | Erfahrungspunkte |
| 42 | quest / mission | Mission (Plural: Missionen) (Jumper uses 'Missions', so use 'Mission' for every quest or mission.) | Quest, Aufgabe, Suche |
| 43 | rewards / claim (rewards) | Belohnungen; Button: 'Einfordern' (Use 'Einfordern' on the claim button.) | Ansprüche, Behaupten |
| 44 | portfolio | Portfolio (Keep the loanword.) | Mappe, Depot |
| 45 | balance | Guthaben (Use 'Guthaben' for the token balance in the wallet.) | Bilanz, Gleichgewicht |
| 46 | max (button that fills the full balance) | Max (Keep the button short and do not add a period.) | Maximum, Höchstbetrag |
| 47 | send / receive | Senden / Empfangen (Use these words for wallet transfers.) | Schicken / Bekommen |
| 48 | recipient / receiving address | Empfänger; 'Empfängeradresse' (Use 'Empfängeradresse' for the field that holds the address.) | Begünstigter, Adressat |
| 49 | minimum received | Mindestens erhalten (Use this label for the amount that the slippage limit protects.) | Empfangenes Minimum |
| 50 | fee (integrator fee, "Jumper fee") | Gebühr: 'Jumper-Gebühr', 'Integrator-Gebühr', 'Anbietergebühr' (Join the brand name and 'Gebühr' with a hyphen.) | Provision, Honorar, Entgelt |
| 51 | estimated time | Geschätzte Zeit (Use it as the label next to the time value.) | Voraussichtliche Ankunft, ETA |
| 52 | high value loss (warning when a route loses a lot of value) | Hoher Wertverlust (Keep the current title. It is clear German.) | Großer Wertschwund |
| 53 | on-ramp / buy with card | Mit Karte kaufen; Bereich: 'Krypto kaufen' (The current widget shows the English 'Buy'. Translate it.) | On-Ramp, Auffahrt, 'Buy' |
| 54 | leaderboard | Rangliste (Use 'Rangliste' because Jumper also shows a 'Rang' (rank).) | Anführertafel, Leaderboard |
| 55 | perks | Vorteile (Translate the feature as a common noun. Keep 'Perks' only in a fixed brand name.) | Perks, Vergünstigungen |
| 56 | earn (the product page where users earn yield) | Verdienen (Tab); Verb: 'verdienen' (Most German wallets translate the Earn tab, so use 'Verdienen'.) | Erwerben, Earn |
| 57 | trigger price (limit orders) | Auslösepreis (Use it for the price that starts a limit order.) | Triggerpreis, Abzugspreis |
| 58 | expiry / expires (orders) | Ablauf; 'Läuft ab in {{time}}'; 'Abgelaufen' (Use 'Läuft ab in' for a countdown and 'Abgelaufen' for the final status.) | Verfall, Erlöschen |

## More terms

These terms are in use in the current texts. Use them for the same concepts.

| English | Use |
| --- | --- |
| 7d / 30d (time window) | 7T / 30T (German chart convention (T = Tage): 'APY 7T'.) |
| asset | Asset (das; Plural: Assets) (Filters, labels and tooltips: 'Nach Asset', 'Tokenisierte Assets'. Not 'Vermögenswert'.) |
| Best Return / Fastest (route tags and route priority) | Bestes Angebot / Schnellste (Uses term 12 'Angebot'. Not 'Rendite' or 'Ertrag', which mean yield.) |
| bookmark (a wallet address) / bookmarked wallets | speichern / Gespeicherte Wallets ('Wallet speichern', 'Keine gespeicherten Wallets'. Not 'Lesezeichen'.) |
| cancel (an order) / cancelled | stornieren / Storniert (Generic dialog cancel stays 'Abbrechen'.) |
| cash (fiat card payment in checkout) | Karte ('Mit Karte einzahlen', 'Kartenzahlung nicht verfügbar'. Not 'Bargeld'. Matches term 53 'Mit Karte kaufen'.) |
| checkout | Checkout ('Checkout verlassen?', 'Checkout-Details'. Not 'Zur Kasse' (that is a CTA, not a title).) |
| clear (a transaction from the activity list) | entfernen ('Transaktion entfernen', 'Alle fehlgeschlagenen entfernen'. 'Löschen' only for recent searches and for delete.) |
| Clear filters / Clear all | Filter zurücksetzen / Alle zurücksetzen (Not 'löschen'.) |
| Continue (button) | Weiter (Not 'Fortsetzen'. 'Fortsetzen' only for resuming a stopped transaction ('Transaktion fortsetzen').) |
| contract (smart contract) | Contract ('Contract ansehen', 'Smart-Contract-Exploits'.) |
| convert / conversion | umwandeln / Umwandlung ('Umwandlung prüfen', 'Umwandlung abgeschlossen'.) |
| Custom (setting or preset) | Benutzerdefiniert (Same as de-B.) |
| deposit address / deposit window | Einzahlungsadresse / Einzahlungsfenster (Checkout transfer deposit flow.) |
| do your own research | Recherchiere immer selbst (Token warnings and Hypernative status text.) |
| dust / dust tokens | Kleinstbeträge ('Kleinstbeträge umwandeln', 'Umwandelbare Kleinstbeträge'. Not 'Staub' (literal) and not 'Dust'.) |
| est. received | Voraussichtlich erhalten (Pairs with 'Mindestens erhalten' (term 49).) |
| exchange (centralized exchange, CEX) | Börse ('keine Börsen-Wallet', 'Solvenzrisiko der Börse'. The Exchange tab stays 'Tauschen' (term 5).) |
| exchange (centralized exchange, CEX) / exchange account | Börse / Börsenkonto (Checkout keys: 'Börse verbinden', 'Verknüpfe dein Börsenkonto'. The Exchange tab stays 'Tauschen' (term 5); DEX settings use 'DEXs' (term 27).) |
| exchange rate / rate | Kurs ('Kurs geändert', 'Kursänderung', 'Kursaktualisierung abgebrochen'. Not 'Wechselkurs' (term 12 note).) |
| explorer | Explorer ('Im Explorer ansehen'.) |
| exposure (Earn filter) | Exposure (Kept as a finance loanword.) |
| filled / partially filled (order status) | Ausgeführt / Teilweise ausgeführt (Status labels with no period.) |
| funds | Gelder ('deine Gelder auszahlen', 'Verlust deiner Gelder'. Use 'Guthaben' only for balance (term 45).) |
| gasless | gasfrei (Route tag 'Gasfrei', fee label 'Gasfrei-Service'.) |
| idle (tokens, assets) | ungenutzt ('deine ungenutzten Token', 'ungenutzte USDC'.) |
| insufficient gas / insufficient funds (titles) | Nicht genug Gas / Nicht genug Guthaben (Not 'Unzureichendes …'.) |
| Jumper Earn (product name in notifications) | „Verdienen“ auf Jumper (Not kept as a brand, because term 56 avoids 'Earn'. Product names in the product menu (Jumper Perps, Jumper Scan, Jumper RWA) stay in English.) |
| lockup / lock-up period | Sperrfrist (Label, tooltip and position card.) |
| malicious (token) | bösartig ('Bösartiger Token erkannt', 'als bösartig markiert'.) |
| market (Earn) | Markt (Plural: Märkte) ('Alle Märkte', 'Ähnliche Märkte'.) |
| network cost | Netzwerkgebühr (Same label as gas fee / network fee (term 8).) |
| opportunity (Earn) | Anlagemöglichkeit (Plural: Anlagemöglichkeiten) ('für diese Anlagemöglichkeit', 'Neue Anlagemöglichkeit: …'. Same word in the risk disclaimer ('Auswahl von Anlagemöglichkeiten').) |
| order (checkout purchase) | Bestellung ('Bestellung abgelaufen', 'Deine Bestellung wird bearbeitet'. Limit and TWAP orders stay 'Order' (de-B).) |
| order (limit or scheduled) | Order (die; Plural: Orders) ('Order stornieren', 'Order behalten', 'Geplante Orders' (term 37 'geplant').) |
| perk hub / mission hub | Vorteils-Hub / Missions-Hub (Perks are 'Vorteile' (term 55), also in 'Jumper-Vorteile'.) |
| pinned / featured (tokens, tabs) | angeheftet / empfohlen ('Angeheftete Token', 'Angeheftete Tabs', 'Empfohlene Token'.) |
| position | Position (Plural: Positionen) ('Position verwalten', 'Deine Positionen'.) |
| purchase | Kauf ('Kauf prüfen', 'Kauf erfolgreich', 'Kauf läuft'.) |
| recent wallets | Zuletzt genutzte Wallets ('Keine zuletzt genutzten Wallets'.) |
| refund / refunded | Rückerstattung / Zurückerstattet ('Rückerstattung anfordern', 'Rückerstattung läuft', 'Rückerstattung abgeschlossen'. Status label 'Zurückerstattet' (term 26).) |
| revoke (approval) | Widerrufen (Only for revoke. Term 35 avoids 'Widerrufen' for withdraw, which stays 'Auszahlen'.) |
| smart contract account / smart account | Smart-Contract-Konto / Smart Account (Warnings about account deployment on the destination chain.) |
| supplied / borrowed (lending position) | Bereitgestellt / Geliehen (Position card headers.) |
| task (step inside a mission) | Aufgabe (Only for the steps inside a mission ('Optionale Aufgabe'). The mission itself stays 'Mission' (term 42).) |
| theme (light/dark) | Design ('Der helle Modus ist für dieses Design deaktiviert'.) |
| top up (a deposit) | aufstocken (Button 'Aufstocken'; 'Stocke deine Einzahlung auf'.) |
| Trade (navigation tab) | Traden (Loanword verb like 'Swappen' and 'Bridgen'. The transaction type 'Trade' also uses 'Traden'.) |
| trade (noun, one fill of a scheduled order) | Trade (der; Plural: Trades) (Used in scheduled orders: 'Trade 2: 50 % ausgeführt', column 'Trades'.) |
| transfer (noun / verb) | Transfer / transferieren ('Krypto transferieren', 'Transfer abbrechen', 'Transferdetails'. Not 'Überweisung' (term 24 note).) |
| Try again / Retry | Erneut versuchen / Wiederholen ('Erneut versuchen' in error dialogs. 'Wiederholen' for the short 'Retry' state of the reward claim button.) |
| verified / unverified | verifiziert / nicht verifiziert ('Verifizierte Angebote', 'Nicht von Hypernative verifiziert'. Same verb as de-B.) |
| verify / ownership | verifizieren / Besitz ('Besitz verifizieren', 'Wallet verifizieren'.) |
