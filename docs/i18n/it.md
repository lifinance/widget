# Italian (`it`)

Read [TRANSLATING.md](../../TRANSLATING.md) first.

- Variant: Italian (Italy), it-IT. The same text serves Italian-speaking users in Switzerland.
- Register: tu. Buttons use the tu imperative ('Connetti', 'Scambia', 'Riprova').
- Buttons use the tu imperative: 'Connetti wallet', 'Scambia', 'Trasferisci', 'Approva', 'Riprova'. Do not use the infinitive or the formal 'Connetta'.
- Use sentence case. Do not copy English title case: 'Ordine limite', not 'Ordine Limite'.
- Loanwords are masculine and take no plural -s: il bridge / i bridge, il token / i token, il wallet / i wallet, il gas. Use 'lo' / 'gli' before s + consonant: lo swap, gli swap, lo slippage, lo staking.
- 'Stablecoin' and 'chain' are feminine: la stablecoin / le stablecoin, la chain.
- Make adjectives and participles agree with the Italian noun: 'transazione completata', 'perdita di valore elevata'.
- Use a decimal comma and a dot as the thousands separator: '1.234,56'. Write percentages with no space: '0,5%'.

## Glossary

| # | English | Use | Do not use |
| --- | --- | --- | --- |
| 1 | bridge (noun) | bridge (m.) ; pl. i bridge (Use 'bridge' for the protocol and the transfer: 'Bridge completato', 'Commissione del bridge'.) | ponte |
| 2 | bridge (verb) | trasferire (pulsante: 'Trasferisci'); nel testo: 'effettuare il bridge' (Italian has no natural verb from 'bridge', so buttons use 'Trasferisci'.) | pontare, collegare |
| 3 | swap (noun) | swap (m.) ; 'lo swap', pl. 'gli swap' (Use 'swap' in labels and status text: 'Swap completato'. The current widget uses 'Scambio'.) | scambio (come sostantivo) |
| 4 | swap (verb) | scambiare (pulsante: 'Scambia') (Use 'Scambia' on the swap button.) | swappare (su un pulsante), permutare |
| 5 | exchange | Scambia (scheda e titolo) (Italian users read 'exchange' as a centralized exchange, so the tab uses the verb 'Scambia'.) | Exchange, Borsa, Cambio |
| 6 | cross-chain | cross-chain (invariabile) (Write it with a hyphen after the noun: 'swap cross-chain'.) | cross-catena, inter-catena |
| 7 | gas | gas (m.) (Keep 'gas' as the unit and the tab name.) | benzina, carburante |
| 8 | gas fee / network fee | commissione di rete (pl. commissioni di rete) (Use 'Commissione di rete' as the fee label.) | tassa di rete, canone gas, tariffa |
| 9 | slippage | slippage (m.) ; 'lo slippage', 'Slippage max', 'tolleranza dello slippage' (The current widget uses 'slittamento di prezzo'. Replace it with 'slippage'.) | slittamento (di prezzo), scivolo |
| 10 | price impact | impatto sul prezzo (Use the singular 'sul prezzo'.) | impatto sui prezzi, impatto ad alto prezzo |
| 11 | route | percorso (m.) ; pl. percorsi (The current widget mixes 'route' and 'rotta'. Use 'percorso' only.) | rotta, route, itinerario |
| 12 | quote | quotazione (f.) : 'Richiedi una nuova quotazione' (The current widget uses 'quota'. Use 'quotazione'.) | preventivo, citazione, quota |
| 13 | chain / blockchain | chain (f.) ; 'blockchain' (f.) per la tecnologia (Use 'la chain' in selectors: 'Seleziona la chain', 'Cambia chain'.) | catena |
| 14 | network (synonym of chain in wallet UIs) | rete (f.) (Use 'rete' where a wallet asks the user to switch: 'Cambia rete'.) | network |
| 15 | from chain / to chain (source / destination) | chain di origine / chain di destinazione ; etichette: 'Da' / 'A' (Keep 'chain' as in id 13.) | catena di destinazione |
| 16 | token | token (m., invariabile) (Do not add -s in the plural: 'i token'.) | gettone |
| 17 | native token (ETH on Ethereum, SOL on Solana) | token nativo (Use it for the coin that pays gas, for example ETH or SOL.) | token indigeno |
| 18 | stablecoin | stablecoin (f., invariabile) : 'la stablecoin', 'le stablecoin' (Use the feminine article.) | moneta stabile |
| 19 | wallet | wallet (m., invariabile) (Use 'wallet' so that 'portafoglio' stays free for the portfolio, as PancakeSwap IT does.) | portafoglio (riservato a 'portfolio', id 44) |
| 20 | connect wallet / connect (button) | Connetti wallet ; breve: 'Connetti' (The current widget uses 'Collega il portafoglio'. Replace it.) | Collega il portafoglio |
| 21 | disconnect | Disconnetti (Use the same root as 'Connetti'.) | Scollega |
| 22 | approve / token approval (ERC-20 allowance) | Approva (pulsante) ; 'approvazione' (sostantivo) ; allowance: 'importo approvato' (The current widget uses 'quota massima' for allowance. Use 'importo approvato'.) | Autorizza, quota massima |
| 23 | sign / signature (wallet signature request) | Firma (pulsante) ; 'firma' (sostantivo) ; 'richiesta di firma' (Use 'Firma' on the wallet prompt button.) | Sottoscrivi, Segna |
| 24 | transaction | transazione (f.) (The current widget uses 'operazione' once. Use 'transazione' everywhere.) | operazione, trasmissione |
| 25 | transaction hash | hash della transazione (m.) ; breve: 'Tx hash' (Keep 'hash' in English.) | impronta, codice hash |
| 26 | pending / completed / failed / refunded (transaction status words) | In attesa / Completata / Non riuscita / Rimborsata (Make the status agree with 'transazione' (feminine).) | Pendente / Fallita / Cancellata |
| 27 | DEX | DEX (m., invariabile) (Keep the acronym: 'un DEX', 'i DEX'.) | exchange decentralizzato |
| 28 | aggregator | aggregatore (m.) (Use the Italian form.) | aggregator |
| 29 | liquidity | liquidità (f.) (Use it for pool and route liquidity.) | liquido |
| 30 | yield | rendimento (m.) (Use 'rendimento' for what a vault or staking position pays.) | resa, rendita |
| 31 | APY | APY (Keep 'APY' in labels.) | rendimento percentuale annuo (in un’etichetta) |
| 32 | vault | vault (m., invariabile) (Keep the DeFi term for Earn vaults. No checked Italian UI translates it well.) | caveau, cassaforte |
| 33 | staking | staking (m.) ; 'fare staking' (Use 'fare staking' as the verb phrase: 'Fai staking di ETH'.) | puntare, scommettere |
| 34 | deposit | Deposita (pulsante) ; 'deposito' (sostantivo) (Pair it with 'Preleva' (id 35).) | Versa, Consegna |
| 35 | withdraw | Preleva (pulsante) ; 'prelievo' (sostantivo) (Pair it with 'Deposita'.) | Ritira, Recedi |
| 36 | limit order | ordine limite (m.) ; 'prezzo limite' (Use 'ordine limite' for the order and 'prezzo limite' for its price.) | Limita ordine |
| 37 | TWAP order / scheduled order | ordine TWAP ; scheduled: 'programmato' (Keep 'TWAP' as an acronym.) | ordine a prezzo medio ponderato nel tempo |
| 38 | market cap | capitalizzazione di mercato (Use the full term. Abbreviate to 'cap. di mercato' only when space is short.) | tetto di mercato, market cap |
| 39 | refuel / get gas | Ottieni gas (pulsante) ; scheda: 'Gas' (Use 'Ottieni gas' for the action and keep 'Gas' as the tab name.) | Fai rifornimento, Fai il pieno |
| 40 | airdrop | airdrop (m., invariabile) (Keep the English word.) | lancio aereo |
| 41 | points / XP | XP ; altrove: 'punti' (Keep 'XP' for Jumper XP and use 'punti' for other points.) | punti esperienza |
| 42 | quest / mission | missione (f.) (Jumper uses 'Missions', so use 'missione' for every quest or mission.) | quest, compito |
| 43 | rewards / claim (rewards) | ricompense ; pulsante: 'Riscuoti' ('Richiedi' means to request, so use 'Riscuoti' on the claim button.) | Reclama, Richiedi |
| 44 | portfolio | portafoglio (m.) (Use 'portafoglio' for the portfolio. This is why the crypto wallet stays 'wallet' (id 19).) | portfolio |
| 45 | balance | saldo (m.) ('Bilancio' means a financial statement.) | bilancio |
| 46 | max (button that fills the full balance) | Max (Keep the button short.) | Massimo |
| 47 | send / receive | Invia / Ricevi (Use these verbs for wallet transfers.) | Spedisci / Ottieni |
| 48 | recipient / receiving address | destinatario (m.) ; 'indirizzo del destinatario' (Use 'indirizzo del destinatario' for the address field.) | beneficiario |
| 49 | minimum received | Minimo ricevuto (Use this label for the amount that the slippage limit protects.) | Ricevuto minimo |
| 50 | fee (integrator fee, "Jumper fee") | commissione (f.) : 'Commissione Jumper', 'Commissione dell’integratore', 'Commissione del provider' ('Tassa' means a tax.) | tassa, tariffa |
| 51 | estimated time | Tempo stimato (Use it as the label next to the time value.) | Ora stimata, ETA |
| 52 | high value loss (warning when a route loses a lot of value) | Perdita di valore elevata (The current widget has 'elevato', which does not agree with 'perdita'.) | Perdita di valore elevato |
| 53 | on-ramp / buy with card | Acquista con carta ; sezione: 'Acquista crypto' (Use 'Acquista' on the button.) | rampa, on-ramp (in un'etichetta) |
| 54 | leaderboard | Classifica (Use 'Classifica' for the XP leaderboard.) | Tabella dei leader, Leaderboard |
| 55 | perks | vantaggi (m. pl.) (Translate the feature as a common noun. Keep 'Perks' only in a fixed brand name.) | perks, benefit |
| 56 | earn (the product page where users earn yield) | Earn (nome della pagina) ; verbo: 'guadagnare' (Keep 'Earn' as the page name, as OKX Wallet IT does, and translate the verb in sentences.) | Guadagna (come nome della pagina) |
| 57 | trigger price (limit orders) | prezzo di attivazione (Use it for the price that starts a limit order.) | prezzo trigger, prezzo grilletto |
| 58 | expiry / expires (orders) | scadenza (f.) ; 'Scade tra {{time}}' ; 'Scaduto' (Use 'Scade tra' for a countdown and 'Scaduto' for the final status.) | spirazione, termine |

## More terms

These terms are in use in the current texts. Use them for the same concepts.

| English | Use |
| --- | --- |
| achievements | traguardi ('I tuoi traguardi'.) |
| Best Return (route tag and route priority) | Più conveniente (Pairs with 'Più veloce' (Fastest). Do not use 'rendimento', which is reserved for yield (term 30).) |
| bookmark (a wallet address) / bookmarked wallets | salvare / 'Wallet salvati'; 'Salva wallet', 'Nessun wallet salvato' (Do not use 'segnalibro'.) |
| boost / boosted (campaign APR) | boost (m.); 'APR con boost'; 'boost della campagna' (Keep the loanword.) |
| Cancel (action) / cancelled (order status) | Annulla / Annullato; 'annullamento' (Order statuses agree with 'ordine' (m.): Annullato, Scaduto, Eseguito, Non riuscito, In pausa.) |
| cash (fiat card payment in checkout) | carta; 'Deposita con carta', 'Pagamento con carta non disponibile' (Not 'contanti'. Matches term 53 'Acquista con carta'.) |
| clear (a transaction) / clear (recent searches) | Rimuovi / Cancella ('Cancella transazione' can read as 'cancel the transaction', so transactions use 'Rimuovi'. Cancel stays 'Annulla'.) |
| Clear / Clear filters / Clear all | Cancella / Cancella filtri / Cancella tutto (Keep 'Annulla' for Cancel only.) |
| do your own research | Fai sempre le tue ricerche (Token warnings and Hypernative texts.) |
| Done (button) | Fatto (Same as the current widget 'Fatto'.) |
| dust (small token balances) | piccoli saldi; 'Converti piccoli saldi'; 'Piccoli saldi convertibili' (Do not use 'polvere' or 'dust'. The full phrase is 'piccoli saldi di token'.) |
| estimated received (label) | Importo stimato (Pairs with 'Minimo ricevuto' (term 49).) |
| exchange (centralized exchange, CEX) | exchange (m.); 'il wallet di un exchange'; 'rischio di solvibilità dell'exchange' (Use only for a CEX such as Binance. The Exchange tab stays 'Scambia' (term 5).) |
| exchange (centralized exchange, CEX) / exchange account | exchange (m.); 'Connetti exchange'; 'account dell'exchange' (Same as it-B. Checkout keys and 'transfers to exchanges'. The Exchange tab stays 'Scambia' (term 5). DEX settings use 'DEX' (term 27).) |
| exchange rate / rate | tasso di cambio; short: 'tasso'; 'Variazione del tasso', 'Tasso cambiato' (Not 'tasso di scambio'. Use 'tasso di conversione' only where the English says 'conversion rate'.) |
| failed (status and step row label) | non riuscita (Term 26. Neutral row label for a failed step: '{{label}}: errore', because the label can be masculine or feminine.) |
| filled / partially filled (orders) | Eseguito / Eseguito parzialmente (Agrees with 'ordine' (m.).) |
| gasless | Senza gas; fee label: 'Servizio senza gas' (Route tag and fee label.) |
| idle (tokens, assets) | inutilizzati; 'i tuoi token inutilizzati' (Agrees with the noun.) |
| level / lvl | livello; short form 'liv.' (Lowercase inside sentences: 'dal livello 3 al livello 4'.) |
| link (an exchange account) | associare; 'Associa il tuo account dell'exchange', 'account associato' (Same verb as it-B for linking. Connect stays 'Connetti' (term 20).) |
| link (wallet address to an ecosystem) | associare; 'Associa wallet' (Use only for linking an address, for example SEI EVM. Connect stays 'Connetti' (term 20).) |
| lockup / lock-up period | periodo di blocco; short label: 'Blocco' (Use in Earn labels and tooltips.) |
| malicious (token) | malevolo; 'Rilevato token malevolo', 'segnalato come malevolo' |
| multi-step (route tag) | In più passaggi ('step' is 'passaggio', as in it-B.) |
| opportunity (Earn market) | opportunità (f.); 'Nuova opportunità Earn' (Use for one Earn market or vault offer.) |
| ownership (of a wallet address) | proprietà; 'Verifica la proprietà' (Use for every verify-ownership text.) |
| perk hub / mission hub | hub dei vantaggi / hub delle missioni; 'Apri l'hub dei vantaggi' (Follows term 55 'vantaggi' and term 42 'missione'.) |
| permit (signed approval message) | permit (m.); 'messaggio di permit' ('Firma il messaggio di permit'.) |
| pinned / featured (tokens, tabs) | fissati / in evidenza; 'Token fissati', 'Schede fissate', 'Token in evidenza' |
| place order / order placed | Inserisci ordine / Ordine inserito (Matches it-B 'inserire un nuovo ordine'.) |
| purchase / checkout | acquisto / checkout (m.); 'Rivedi acquisto', 'Acquisto completato', 'Uscire dal checkout?' |
| Rank (leaderboard) | Posizione (Follows term 54 'Classifica'.) |
| recent wallets / recent searches | Wallet recenti / Ricerche recenti |
| refund / refunded | rimborso / Rimborsato; 'Richiedi rimborso', 'Rimborso in corso', 'Rimborso completato' (Status agrees with the noun (term 26).) |
| Review / Confirm (buttons) | Rivedi / Conferma; 'Rivedi swap', 'Rivedi bridge', 'Rivedi acquisto', 'Rivedi deposito', 'Rivedi ordine', 'Rivedi TWAP' · Rivedi / Conferma; 'Rivedi conversione' (Same as it-B. Keeps the two English buttons apart.) |
| settings / custom | Impostazioni / Personalizzato (Same as the current widget 'Impostazioni'.) |
| smart account / smart contract account | smart account / account smart contract |
| smart contract / exploit / depeg | smart contract / exploit / depeg (m., invariabili) (Keep the loanwords in risk texts.) |
| spending (token allowance steps) | spesa; 'Approva la spesa di {{tokenSymbol}}'; revoke: 'Revoca l'approvazione di {{tokenSymbol}}' (The allowance amount itself is 'importo approvato' (term 22).) |
| support (contact support) | assistenza; 'Contatta l'assistenza' (Same as it-B 'Assistenza'. Do not use 'supporto'.) |
| switch (mode, wallet, network, view, token) | cambiare / passare a; 'Cambia wallet', 'Passa alla modalità chiara' (Never use 'cambiare' or 'passare' for swap (term 4).) |
| task (mission task) | task (m., invariabile) (Keep 'attività' for the Activity tab.) |
| theme / mode (light, dark, system) | tema / modalità; 'modalità chiara', 'modalità scura', 'modalità di sistema' (Keep 'tema' for the theme and 'modalità' for light, dark and system.) |
| tier (monthly activity tier) | fascia; 'la fascia più alta' (Keep 'livello' for the Jumper Pass level.) |
| trade (one executed trade) / Trade (navbar link) | trade (m., invariabile); menu: 'Trading' (Never use 'trade' or 'operazione' for an on-chain transaction (term 24).) |
| trade (one slice of a TWAP order) | trade (m., invariabile); 'Numero di trade', 'Importo per trade' (Same as it-B.) |
| transfer (checkout noun / verb) | trasferimento / trasferire; 'Trasferisci crypto', 'Annulla trasferimento' |
| Try again / Retry (buttons) | Riprova (Both buttons are 'Riprova' as in the current widget. In message text: 'Riprova.') |
| unsupported / not supported | non supportato (Agrees with the noun: 'chain non supportata', 'wallet non supportato'.) |
| verified / unverified | verificato / non verificato (Agrees with the noun: 'Quotazioni verificate', 'Nessun percorso verificato'.) |
| View … (button) | Vedi …; 'Vedi su explorer', 'Vedi i dettagli', 'Vedi rimborso' (Same as it-B. Do not use 'Visualizza'.) |
