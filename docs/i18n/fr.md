# French (`fr`)

Read [TRANSLATING.md](../../TRANSLATING.md) first.

- Variant: French (France), fr-FR. Use French typography with spaces before high punctuation. The same text serves Belgium and Switzerland; do not adapt it for fr-CA.
- Register: vous. Buttons use the infinitive, so the register shows only in sentences.
- Buttons use the infinitive: 'Connecter un wallet', 'Échanger', 'Transférer', 'Approuver'. Sentences use vous with the imperative: 'Connectez un wallet pour continuer.'
- Use sentence case. Do not copy English title case: 'Missions disponibles', not 'Missions Disponibles' (current site).
- Put a narrow no-break space (U+202F) before : ; ! ? and %: '0,5 %', 'Solde : 12'. Use « » with no-break spaces inside.
- Loanwords are masculine and take a plural -s: le bridge / les bridges, le swap / les swaps, le token / les tokens, le wallet / les wallets, le slippage, l’airdrop, le staking, le vault.
- Do not use the anglicized verbs 'swapper' and 'bridger' on buttons. Use 'Échanger' (swap) and 'Transférer' (bridge).
- Use a decimal comma and a no-break space as the thousands separator: '1 234,56'.

## Glossary

| # | English | Use | Do not use |
| --- | --- | --- | --- |
| 1 | bridge (noun) | bridge (m.) ; pl. bridges (Use 'bridge' for the protocol and the transfer: 'Bridge réussi', 'Frais du bridge'.) | pont, passerelle |
| 2 | bridge (verb) | transférer (bouton : 'Transférer') ; 'Lancer le bridge' pour 'Start bridging' (French has no standard verb for 'to bridge'. 'bridger' is fine in marketing text only.) | ponter, établir une passerelle, bridger (sur un bouton) |
| 3 | swap (noun) | swap (m.) ; pl. swaps (Use 'swap' in labels and status text: 'Swap réussi', 'Échec du swap'.) | permutation, échange (pour le nom) |
| 4 | swap (verb) | échanger (bouton : 'Échanger') (Use 'Échanger' on the swap button, as Uniswap and MetaMask do.) | swapper (sur un bouton), permuter |
| 5 | exchange | Échanger (onglet et titre) (French users read 'plateforme d’échange' and 'exchange' as a centralized exchange, so the tab uses the verb 'Échanger'.) | Exchange, Bourse, Plateforme d’échange |
| 6 | cross-chain | cross-chain (invariable) : 'swap cross-chain', 'bridge cross-chain' (Write it with a hyphen and no plural mark.) | inter-chaînes, chaîne croisée |
| 7 | gas | gaz (m.) (Use 'gaz' as the unit and the tab name. Uniswap FR and Rabby FR write 'gas', so keep one spelling everywhere.) | carburant, essence |
| 8 | gas fee / network fee | frais de réseau (m. pl.) (Use 'Frais de réseau' as the fee label. 'frais' is always plural.) | frais de gaz (comme libellé), redevance réseau |
| 9 | slippage | slippage (m.) : 'Slippage max.', 'tolérance de slippage' (The current widget uses 'effet de glissement'. Replace it with 'slippage'.) | effet de glissement, glissement |
| 10 | price impact | impact sur le prix (Use the singular 'le prix'.) | impact des prix, incidence sur le prix |
| 11 | route | route (f.) ; pl. routes (The current widget mixes 'itinéraire' and 'routes'. Use 'route' only.) | itinéraire, voie, chemin |
| 12 | quote | cotation (f.) : 'Obtenir une nouvelle cotation' ('Devis' is the price of a service. The current widget uses it, so replace it.) | devis, citation, offre |
| 13 | chain / blockchain | chaîne (f.) ; 'blockchain' (f.) pour la technologie (Use 'chaîne' in selectors: 'Sélectionner la chaîne', 'Changer de chaîne'.) | chaîne de blocs, maillon |
| 14 | network (synonym of chain in wallet UIs) | réseau (m.) (Use 'réseau' where a wallet asks the user to switch: 'Changer de réseau'.) | filet, toile |
| 15 | from chain / to chain (source / destination) | chaîne source / chaîne de destination ; libellés : 'De' / 'Vers' (The current widget uses 'À' for 'To'. 'Vers' reads better as a field label.) | chaîne d’origine, chaîne cible ; 'À' comme libellé |
| 16 | token | token (m.) ; pl. tokens (The current widget mixes 'jetons' and 'tokens'. Use 'token' only.) | jeton |
| 17 | native token (ETH on Ethereum, SOL on Solana) | token natif (Use it for the coin that pays gas, for example ETH or SOL.) | jeton natif, token indigène |
| 18 | stablecoin | stablecoin (m.) ; pl. stablecoins (Keep the English word.) | pièce stable, cryptomonnaie stable |
| 19 | wallet | wallet (m.) ; pl. wallets (Uniswap FR and Ledger Live FR use 'wallet' and keep 'portefeuille' for the portfolio.) | portefeuille (réservé à 'portfolio', id 44) |
| 20 | connect wallet / connect (button) | Connecter un wallet ; court : 'Connecter' ('Se connecter' means to log in, so do not use it on the wallet button.) | Se connecter, Brancher |
| 21 | disconnect | Déconnecter (Use the non-reflexive verb for the wallet.) | Débrancher, Se déconnecter |
| 22 | approve / token approval (ERC-20 allowance) | Approuver (bouton) ; 'approbation' (nom) ; allowance : 'plafond de dépenses' (The current widget uses 'allocation' for allowance. Use 'plafond de dépenses'.) | valider, allocation, provision |
| 23 | sign / signature (wallet signature request) | Signer ; 'signature' ; 'demande de signature' (Use 'Signer' on the wallet prompt button.) | parapher, soussigner |
| 24 | transaction | transaction (f.) ('Virement' means a bank transfer.) | virement, opération |
| 25 | transaction hash | hash de transaction (m.) ('Hachage' is the formal word and reads foreign to crypto users.) | hachage de transaction |
| 26 | pending / completed / failed / refunded (transaction status words) | En attente / Terminé / Échec / Remboursé ('Complété' is an anglicism in the current widget. Use 'Terminé'.) | Pendant / Complété / Raté |
| 27 | DEX | DEX (m.) : 'un DEX', pl. 'les DEX' (Keep the acronym. Use 'plateforme d’échange décentralisée' only in long explanations.) | échange décentralisé |
| 28 | aggregator | agrégateur (m.) (Spell it with one 'g' before 'r'.) | aggrégateur |
| 29 | liquidity | liquidité (f.) (Use the singular in labels: 'Liquidité faible'.) | liquide |
| 30 | yield | rendement (m.) (Use 'rendement' for what a vault or staking position pays.) | récolte, yield |
| 31 | APY | APY (Keep 'APY'. MetaMask FR mixes 'TRA', 'RMP' and 'TAEG', which confuses users.) | TRA, RMP, TAEG |
| 32 | vault | vault (m.) ; pl. vaults (Keep the DeFi term for Earn vaults.) | coffre-fort, chambre forte |
| 33 | staking | staking (m.) ; verbe : 'staker' (Use 'staker' as the verb: 'Staker des ETH'.) | jalonnement, mise en jeu |
| 34 | deposit | Déposer (bouton) ; 'dépôt' (nom) (Pair it with 'Retirer' (id 35).) | verser, consigner |
| 35 | withdraw | Retirer (bouton) ; 'retrait' (nom) (Pair it with 'Déposer'.) | prélever, se retirer |
| 36 | limit order | ordre limite (m.) ; 'prix limite' (Uniswap FR writes 'ordre à cours limité', which is correct but too long for buttons.) | commande limite, ordre à limite |
| 37 | TWAP order / scheduled order | ordre TWAP ; scheduled : 'programmé' (Keep 'TWAP' as an acronym.) | ordre à prix moyen pondéré dans le temps |
| 38 | market cap | capitalisation boursière (Use the full term. Abbreviate to 'cap. boursière' only when space is short.) | plafond de marché, market cap |
| 39 | refuel / get gas | Obtenir du gaz (bouton) ; onglet : 'Gaz' (Use the same spelling as id 7.) | Ravitailler, Faire le plein |
| 40 | airdrop | airdrop (m.) (Keep the English word.) | largage, distribution gratuite |
| 41 | points / XP | XP (m.) ; ailleurs : 'points' (Keep 'XP' for Jumper XP: 'l’XP', '{{xp}} XP gagnés'.) | points d’expérience |
| 42 | quest / mission | mission (f.) (Jumper uses 'Missions', so use 'mission' for every quest or mission. A step inside a mission is a «tâche».) | quête |
| 43 | rewards / claim (rewards) | récompenses ; bouton : 'Réclamer' (Use 'Réclamer' on the claim button.) | Revendiquer, Demander |
| 44 | portfolio | portefeuille (m.) (Use 'portefeuille' for the portfolio. This is why the crypto wallet stays 'wallet' (id 19).) | portfolio |
| 45 | balance | solde (m.) (Use 'Solde' for the token balance.) | balance, bilan |
| 46 | max (button that fills the full balance) | Max (Keep the button short.) | Maximum |
| 47 | send / receive | Envoyer / Recevoir (Use these verbs for wallet transfers.) | Expédier / Obtenir |
| 48 | recipient / receiving address | destinataire (m.) ; 'adresse du destinataire' ('Bénéficiaire' sounds like a bank transfer.) | bénéficiaire |
| 49 | minimum received | Minimum reçu (Use this label for the amount that the slippage limit protects.) | Reçu minimum |
| 50 | fee (integrator fee, "Jumper fee") | frais (m. pl.) : 'Frais Jumper', 'Frais d’intégrateur', 'Frais du fournisseur' ('Frais' is always plural.) | commission, honoraires, tarif |
| 51 | estimated time | Temps estimé (Use it as the label next to the time value.) | Heure estimée, ETA |
| 52 | high value loss (warning when a route loses a lot of value) | Perte de valeur élevée (Keep the current title. It is clear French.) | Haute perte de valeur |
| 53 | on-ramp / buy with card | Acheter par carte ; section : 'Acheter des cryptos' (Use 'Acheter' on the button and keep 'onramp' out of labels.) | rampe d’accès, onramp (dans un libellé) |
| 54 | leaderboard | Classement (Use 'Classement' for the XP leaderboard.) | Tableau des leaders |
| 55 | perks | avantages (m. pl.) (Translate the feature as a common noun. Keep 'Perks' only in a fixed brand name.) | perks, bonus |
| 56 | earn (the product page where users earn yield) | Gagner (onglet) ; verbe : 'gagner' (Most French wallets translate the Earn tab. Uniswap FR is the exception and keeps 'Earn'.) | Earn, Mériter |
| 57 | trigger price (limit orders) | prix de déclenchement (Use it for the price that starts a limit order.) | prix gâchette, prix déclencheur |
| 58 | expiry / expires (orders) | expiration (f.) ; 'Expire dans {{time}}' ; 'Expiré' (Use 'Expire dans' for a countdown and 'Expiré' for the final status.) | échéance, péremption |

## More terms

These terms are in use in the current texts. Use them for the same concepts.

| English | Use |
| --- | --- |
| achievements | succès (m. pl.) (Gaming sense, as in Steam and Xbox FR.) |
| Activity / Activities | Activité (Same as fr-B.) |
| Best Return (route tag and route priority) | Meilleur prix ('Meilleur retour' is a literal translation; 'rendement' is reserved for yield (term 30).) |
| bookmark / bookmarked (send-to-wallet) | favori (m.) ; 'Ajouter aux favoris', 'Wallets favoris' ('marque-page' is for browsers.) |
| bps (basis points) | bps (Kept as a unit, like APY.) |
| cancelled (orders) | Annulé (Order status word.) |
| cash / deposit with cash (fiat via card provider) | par carte : 'Déposer par carte', 'Paiement par carte indisponible' ('en espèces' means physical cash. The subtitle is 'Carte de débit ou de crédit'.) |
| checkout | paiement (m.) : 'Détails du paiement', 'Quitter le paiement' (Keeps the current widget title 'Paiement'. Developer error texts keep 'checkout'.) |
| complete (a transaction, an order) | finaliser ('pour finaliser la transaction'. Status words stay 'Terminé'.) |
| depeg | depeg (m.) (French crypto media keep 'depeg'.) |
| deposit window | fenêtre de dépôt ('avant la fermeture de la fenêtre de dépôt'.) |
| Done (button) | Terminé (Success titles on the same screen use 'effectué(e)' so the words differ.) |
| dust / dust tokens | petits soldes ; bouton : 'Convertir les petits soldes' (Binance FR uses 'petits soldes' for the same feature. 'poussière' reads as a literal translation.) |
| Est. received | Montant estimé (Pairs with 'Minimum reçu'.) |
| Exact-output (tab) | Sortie exacte (Tab and page title for the exact output amount mode.) |
| exchange (centralized exchange, CEX, in checkout) | plateforme d’échange (f.) : 'Connecter une plateforme d’échange', 'compte de plateforme d’échange' (Glossary term 5 note and fr-B ('n’appartient pas à une plateforme d’échange'). The Exchange tab stays 'Échanger'; the settings DEX list uses 'DEX'.) |
| Exchanges (settings list) / Search by exchange name | DEX ; 'Rechercher par nom de DEX' (These are DEX tools (glossary term 27).) |
| explorer (block explorer) | explorateur ('Voir sur l’explorateur'.) |
| filled / partially filled (orders) | Exécuté / Partiellement exécuté (Order status words.) |
| Gasless (tag, service) | Sans gaz ; 'Service sans gaz' (Follows glossary term 7 spelling.) |
| hub (Perks hub, Mission hub) | hub (m.) : 'hub des avantages', 'hub des missions' ('Perks' is an avoid form, so the hub name is translated.) |
| idle (tokens, assets) | inactifs ('vos tokens inactifs'.) |
| Incognito (private swap) | mode incognito ('Vous passez en mode incognito'.) |
| level / lvl | niveau ; abrégé : 'niv.' ('Niveau 5', 'Pass - niv. 5'.) |
| Limit (tab) | Limite (Same as fr-B column 'Limite'.) |
| lockup / lock-up period | blocage ; 'période de blocage' (Column label 'Blocage'.) |
| market (Earn) | marché (m.) ('Tous les marchés', 'Marchés similaires'.) |
| multi-chain | multichaîne (One word, as in French crypto media.) |
| Multi-step (tag) | Multi-étapes |
| Network cost (fee row label) | Frais de réseau (Same as glossary term 8.) |
| onchain | on-chain (Same spelling as fr-B.) |
| opportunity (Earn) | opportunité (f.) ; 'opportunité de rendement' (Used for Earn markets in tooltips and notifications.) |
| order (checkout purchase) | commande (f.) ('Votre commande n’a pas été passée'. Limit and TWAP orders stay 'ordre'.) |
| paused (order status) | En pause (Order status word.) |
| payment provider / provider | fournisseur de paiement ; fournisseur (Matches 'Frais du fournisseur'.) |
| permit (EIP-2612 message) | message d’autorisation ('Signer le message d’autorisation'.) |
| place order | Passer l’ordre ; 'Ordre passé', 'Ordre passé avec succès' (Same verb as fr-B ('passer un nouvel ordre').) |
| pool | pool (m.) ; pl. pools (Keep the DeFi word: 'le pool USDC'.) |
| Private (tab) | Privé |
| Receipts (transaction details card) | Reçus |
| redemption / withdraw request (Earn) | demande de retrait ; 'processus de retrait' (One word ('retrait') for withdraw and redeem, so users see one concept.) |
| refund | remboursement (m.) ; 'Demander un remboursement', 'Remboursement terminé', 'Remboursement en cours' (Status word 'Remboursé' (glossary term 26).) |
| Review (button) vs Confirm (button) | Vérifier / Confirmer ; 'Vérifier le swap', 'Vérifier le bridge', 'Vérifier le dépôt', 'Vérifier l’achat', 'Vérifier l’ordre' (Same choice as fr-B ('Vérifier la conversion' / 'Confirmer').) |
| See details / View … (button) | Voir les détails ; 'Voir …' |
| Settings | Paramètres |
| small balances | petits soldes ; 'Masquer les petits soldes' (Same word as fr-B 'dust'.) |
| smart account / smart contract account | smart account ; compte smart contract (Kept in English, like fr-B 'smart contract'.) |
| smart contract | smart contract (m.) (Used in risk texts: 'exploits de smart contracts'.) |
| Start swapping (button) | Lancer le swap (Same slot as glossary term 2 'Lancer le bridge'. 'Commencer à échanger' stays for empty-state CTAs (fr-B).) |
| Swap / Bridge (tab and page title) | Swap / Bridge ; 'Swap et bridge' (Nouns on tabs and titles. Buttons keep 'Échanger' / 'Transférer'.) |
| Swap to / Bridge to (status steps) | 'Swap vers {{symbol}}', '… en cours', '… effectué' ; 'Bridge vers {{chain}}' (One noun frame for all step states.) |
| token spending approval | 'Approuver le plafond de dépenses pour {{tokenSymbol}}' ; 'Approbation {{tokenSymbol}}' (Uses glossary term 22 'plafond de dépenses'.) |
| top up (deposit more) | Compléter le dépôt (bouton) ; 'Complétez votre dépôt' ('Recharger' reads as a card or phone top-up.) |
| Trade (navbar tab) | Trader (Binance FR and OKX FR use 'Trader'. Keeps it apart from 'Échanger' (Exchange tab).) |
| trade (one slice of a scheduled/TWAP order) | tranche (f.) ('Tranche 2 : 50 % exécutée', column 'Tranches'.) |
| trade (one slice of a TWAP order) | tranche (f.) : 'Nombre de tranches', 'Montant par tranche' (Same as fr-B.) |
| trade (transaction type in portfolio history) | Trade (Transaction types use nouns: Dépôt, Retrait, Envoi, Réception, Approbation, Trade.) |
| Try again / Retry (button) | Réessayer (Same word for both.) |
| unlocked (perks) | débloqué ('Avantages débloqués'.) |
| verified (route, quote) | vérifié(e) : 'Route vérifiée', 'Cotations vérifiées', tag 'Vérifiée' (Route is feminine.) |
