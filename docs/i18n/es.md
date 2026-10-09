# Spanish (`es`)

Read [TRANSLATING.md](../../TRANSLATING.md) first.

- Variant: Neutral Spanish for Latin America and Spain. Use words that both regions use: 'billetera', 'comisión', 'cantidad', 'retiro'. MetaMask ships only es-419 and Uniswap ships only es-ES, so this file takes the words that both share.
- Register: tú: imperatives such as 'Conecta' and 'Selecciona', and the possessive 'tu'. Never 'usted' or 'vosotros'.
- Write buttons as infinitives: 'Conectar billetera', 'Intercambiar', 'Aprobar'. Write instructions with the 'tú' imperative: 'Conecta tu billetera'.
- Use sentence case for labels and titles: 'Detalles de la transacción', not 'Detalles De La Transacción'.
- Start questions and exclamations with '¿' and '¡': '¿Quieres continuar?'.
- Give loanwords a fixed gender: 'el swap', 'el DEX', 'el gas', 'el staking', 'la stablecoin', 'la blockchain'. Do not add a plural ending to 'cross-chain'.
- Do not use words of one region only. Use 'cantidad', not 'monto' or 'importe'. Use 'comisión', not 'coste' or 'costo'.

## Glossary

| # | English | Use | Do not use |
| --- | --- | --- | --- |
| 1 | bridge (noun) | puente (pl. puentes); tab and title: 'Puente'; status: 'Puente completado' (Use 'puente' for the protocol and the action, and keep 'Bridge' only inside protocol names such as 'Stargate Bridge'.) | Cruzar; Bridge (as a plain label) |
| 2 | bridge (verb) | puentear: 'Puentear', 'Puenteando 1 ETH', '1 ETH puenteado' (Do not write 'hacer un puente', because in Spain it also means a long holiday weekend.) | cruzar; hacer un puente |
| 3 | swap (noun) | swap (el swap, los swaps); tab and title: 'Swap'; status: 'Swap completado' (Keep 'Swap' as the tab name, as Binance and OKX do, because the Exchange page already uses 'Intercambio'.) | canje; permuta; Intercambio (as the Swap tab name) |
| 4 | swap (verb) | intercambiar: button 'Intercambiar'; sentence 'Intercambia ETH por USDC' (Do not use 'canjear', which means 'redeem' in Spain, or 'cambiar', which also means 'change a setting'.) | canjear; cambiar; swapear |
| 5 | exchange | title: 'Intercambio'; button: 'Intercambiar'; token pages: 'Intercambiar desde' / 'Intercambiar a' (Do not use 'exchange', because Spanish crypto users use it for a trading platform such as Binance.) | Exchange; Plataforma de intercambio; Cambiar |
| 6 | cross-chain | cross-chain (invariable adjective): 'swap cross-chain', 'transferencias cross-chain' (Put 'cross-chain' after the noun and do not add a plural ending.) | de cadena cruzada; intercadena; cross-chains |
| 7 | gas | gas (el gas) (Keep 'gas' in every string, as all Spanish sources do.) | gasolina; combustible |
| 8 | gas fee / network fee | comisión de gas; comisión de red (Use 'comisión' for every fee, because 'coste' is Spain-only and 'costo' is Latin American.) | coste de red; costo de red; honorarios |
| 9 | slippage | deslizamiento; 'Deslizamiento máx.'; 'tolerancia al deslizamiento' (Do not use 'descenso', a poor variant that appears in some Binance help pages.) | slippage; descenso |
| 10 | price impact | impacto en el precio (Use 'en el precio' in every string, although MetaMask writes 'sobre el precio'.) | efecto en el precio |
| 11 | route | ruta (pl. rutas); 'Mejor ruta' (Use 'ruta' for one path through bridges and DEXs.) | camino; trayecto |
| 12 | quote | cotización; 'Cantidad cotizada'; 'Mejor cotización' (Replace the current 'Monto citado' with 'Cantidad cotizada', because 'citar' means 'to cite'.) | cita; Monto citado |
| 13 | chain / blockchain | cadena (la cadena) for one chain: 'Seleccionar cadena'; blockchain (la blockchain) for the technology (Use 'cadena' when the English says 'chain' and 'red' when the English says 'network'.) | cadena de bloques |
| 14 | network (synonym of chain in wallet UIs) | red (pl. redes); 'Todas las redes'; 'Comisión de red' (Use 'red' for the network selector and for network fees.) | — |
| 15 | from chain / to chain (source / destination) | cadena de origen / cadena de destino; short labels: 'De' / 'A' (Replace the current 'cadena de recepción' with 'cadena de destino'.) | cadena de recepción; cadena receptora |
| 16 | token | token (pl. tokens) (Keep 'token' for a token and use 'cripto' only for crypto in general.) | ficha; moneda |
| 17 | native token (ETH on Ethereum, SOL on Solana) | token nativo; 'token nativo de la red' (Use 'token nativo' for the gas token of a chain, for example ETH on Ethereum.) | moneda propia; token original |
| 18 | stablecoin | stablecoin (la stablecoin, pl. stablecoins) (Use 'stablecoin', because crypto users rarely say the MetaMask form 'moneda estable'.) | moneda estable |
| 19 | wallet | billetera (pl. billeteras) (Do not use 'cartera', because it is Spain-only and also means 'portfolio'.) | cartera; monedero; wallet |
| 20 | connect wallet / connect (button) | 'Conectar billetera'; short button: 'Conectar' (Use 'billetera' in every string, because the current widget mixes 'billetera' and 'cartera'.) | Conectar cartera; Vincular |
| 21 | disconnect | 'Desconectar' (Use 'Desconectar', because disconnecting a wallet is not a log-out.) | Cerrar sesión |
| 22 | approve / token approval (ERC-20 allowance) | aprobar / aprobación; 'Aprobar gasto de {{token}}'; 'límite de gasto' (Use 'aprobar' for the allowance step and 'límite de gasto' for the approved amount.) | autorizar; permitir |
| 23 | sign / signature (wallet signature request) | firmar / firma; 'Solicitud de firma'; 'Firmar transacción' (Use 'firmar' for every wallet signature request.) | rubricar |
| 24 | transaction | transacción (pl. transacciones) (Do not use 'operación' for an on-chain transaction, because it means a trade.) | operación (for an on-chain transaction) |
| 25 | transaction hash | hash de la transacción (Keep 'hash', because users see this word in block explorers.) | resumen de la transacción; ID de transacción |
| 26 | pending / completed / failed / refunded (transaction status words) | Pendiente / Completado / Fallido / Reembolsado (Make the adjective agree with the noun: 'Transacción fallida', 'Swap completado'.) | Ha fallado; Fondos recibidos (for 'completed') |
| 27 | DEX | DEX (el DEX, pl. los DEX) (Keep the acronym and explain it as 'exchange descentralizado (DEX)' only in help text.) | intercambio descentralizado |
| 28 | aggregator | agregador; 'agregador de liquidez' (Use 'agregador' for a service that compares routes from many protocols.) | acumulador; recopilador |
| 29 | liquidity | liquidez (Use 'liquidez', as all sources do.) | — |
| 30 | yield | rendimiento (pl. rendimientos) (Use 'rendimiento' for the noun and 'ganar' for the verb.) | cosecha; rinde |
| 31 | APY | APY (Keep 'APY', because 'TAE' is a Spanish bank term that Latin American users do not know.) | TAE; RPA |
| 32 | vault | bóveda (la bóveda) (Use 'bóveda' as Uniswap does, but keep the protocol name when the vault has one.) | caja fuerte; cofre |
| 33 | staking | staking (el staking); 'Hacer staking'; 'Con staking' (Do not use 'apuesta', because 'apostar' means 'to bet'.) | apuesta; participación |
| 34 | deposit | depositar / depósito (Use 'depositar' on the button and 'depósito' for the noun.) | ingresar; abonar |
| 35 | withdraw | retirar / retiro (Use 'retirar' on the button and 'retiro' for the noun.) | reintegro; sacar |
| 36 | limit order | orden límite (pl. órdenes límite); 'Precio límite' (Use 'orden', because 'pedido' means a purchase order in a shop.) | pedido límite; orden limitada |
| 37 | TWAP order / scheduled order | orden TWAP; orden programada (Keep the acronym 'TWAP' and use 'orden' as for limit orders.) | pedido programado |
| 38 | market cap | capitalización de mercado (Do not use 'bursátil', because it refers to the stock market.) | capitalización bursátil |
| 39 | refuel / get gas | 'Obtener gas'; 'Obtener gas en {{chain}}' (Keep 'gas' from term 7 and do not use car words such as 'repostar'.) | Repostar; Recargar combustible |
| 40 | airdrop | airdrop (el airdrop, pl. airdrops) (Keep 'airdrop', as all sources do.) | lanzamiento aéreo; regalo de tokens |
| 41 | points / XP | puntos; XP (Use 'puntos' for points and keep 'XP' as it is.) | — |
| 42 | quest / mission | misión (pl. misiones) (Use 'misión' for every quest, because 'búsqueda' means 'search'.) | búsqueda; quest |
| 43 | rewards / claim (rewards) | recompensas; button: 'Reclamar'; 'Reclamar recompensas' (Use 'Reclamar' on the claim button, as MetaMask and Uniswap do.) | premios; Cobrar; Reivindicar |
| 44 | portfolio | Portfolio (page name); 'tu portfolio' in sentences (Keep 'Portfolio', because 'cartera' is Spain-only and also means 'wallet'.) | Cartera; Portafolio |
| 45 | balance | saldo; 'Saldo total' (Use 'saldo', because 'balance' means an accounting statement in Spanish.) | balance |
| 46 | max (button that fills the full balance) | Máx. (Use the short form with a period, as wallets do.) | MÁXIMO; Todo |
| 47 | send / receive | Enviar / Recibir (Use 'Enviar' and 'Recibir' on buttons and in amount fields.) | Mandar / Obtener |
| 48 | recipient / receiving address | destinatario; 'dirección del destinatario' (Use 'destinatario' for the person and 'dirección del destinatario' for the address field.) | receptor; beneficiario |
| 49 | minimum received | Mínimo recibido (Write 'Mínimo' in full, with the accent.) | Min. recibido; Cantidad mínima obtenida |
| 50 | fee (integrator fee, "Jumper fee") | comisión; 'Comisión de Jumper'; 'Comisión del integrador'; 'Comisión del proveedor' (Use 'comisión' for every fee and replace the current 'Honorarios del proveedor'.) | honorarios; tarifa; cargo |
| 51 | estimated time | Tiempo estimado (Use 'Tiempo estimado', because 'Hora estimada' means a clock time, not a duration.) | Hora estimada |
| 52 | high value loss (warning when a route loses a lot of value) | Pérdida de valor alta (Put the adjective after 'valor', because 'Pérdida de alto valor' reads as 'loss of a valuable item'.) | Pérdida de alto valor |
| 53 | on-ramp / buy with card | 'Comprar con tarjeta'; 'Comprar cripto' (Name the action, because users do not know the word 'on-ramp'.) | rampa de entrada; on-ramp |
| 54 | leaderboard | Clasificación (Use 'Clasificación', as MetaMask does for its leaderboard tab.) | Tablero de líderes; Leaderboard |
| 55 | perks | beneficios (Use 'beneficios' for partner perks and 'Reclamar beneficio' for the claim action.) | privilegios; gajes |
| 56 | earn (the product page where users earn yield) | Earn (page and product name); verb in sentences: 'ganar' (Keep 'Earn' as the page name and use 'ganar' only inside sentences.) | Ganar (as the page title); Ganancias |
| 57 | trigger price (limit orders) | precio de activación (Use 'precio de activación', as MetaMask does for orders.) | precio de disparo; precio gatillo |
| 58 | expiry / expires (orders) | vencimiento; 'Vence en {{duration}}'; 'Orden vencida' (Use 'vencimiento' for the label and 'Vence en' for the countdown, as Uniswap does.) | expiración; caducidad |

## More terms

These terms are in use in the current texts. Use them for the same concepts.

| English | Use |
| --- | --- |
| Activity / Activities (transaction history) | Actividad (Singular, as wallets do.) |
| add / added | agregar / agregado (Do not use 'añadir'. 'Agregar' matches 'agregador'.) |
| bookmark / bookmarked (saved wallet addresses) | guardar / guardada; 'Billeteras guardadas'; button 'Guardar'; 'Guardar billetera' (Do not use 'marcador' or 'preferidas'. One verb for every bookmark text.) |
| boost / boosted (campaign APR) | bonificación; 'APR bonificado'; 'bonificación de campaña' (Use the Spanish word for the extra campaign reward.) |
| checkout (widget payment flow) | pago; header 'Pago'; '¿Salir del pago?'; 'Cerrar pago' (Keep 'checkout' only in developer error texts (sdkConfig, sessions).) |
| Clear / Clear filters / Clear all | Borrar / Borrar filtros / Borrar todo (Use 'Borrar' for every clear action.) |
| depeg | pérdida de paridad (Use in risk texts.) |
| Deposit with cash (fiat on-ramp by card) | Depositar con tarjeta (Follows term 53: name the action. The subtitle is 'Tarjeta de débito o crédito'. Do not use 'efectivo'.) |
| Do your own research | Investiga siempre por tu cuenta (Do not use the acronym DYOR.) |
| Done (button) | Listo (Use on every success modal.) |
| dust (small token balances) | saldos pequeños; 'Convertir saldos pequeños'; 'Saldos pequeños convertibles' (Uniswap es-ES uses 'saldos pequeños' ('Ocultar saldos pequeños'). Do not use 'polvo' or 'dust'.) |
| Enter (input prompt: email, username) | Escribe ...; 'Escribe tu correo electrónico' (Avoids 'Introduce' (Spain) and 'Ingresa' (Latin America).) |
| Exact-output (tab) | Salida exacta (Tab label.) |
| exchange (centralized exchange, CEX) | exchange (el exchange); 'billetera de un exchange'; 'riesgo de solvencia del exchange' (Use only for a CEX such as Binance. The Exchange tab stays 'Intercambio' (term 5).) |
| exchange (CEX in checkout) | exchange (el exchange); 'Conectar exchange'; 'tu cuenta del exchange' (Same as es-B. The DEX list in settings uses 'DEX' (term 27).) |
| exchange rate / rate | tasa de cambio; short form 'tasa'; 'Cambio de tasa'; 'Tasa de cambio actualizada' (Matches 'tasa' in other rate texts. Do not use 'tipo de cambio' or 'precio'.) |
| expire / expired (transaction, deposit address, deposit window) | vencer / vencida; 'Transacción vencida'; 'La dirección de depósito vence en' (Extends term 58 to every expiry text.) |
| filled / partially filled (orders) | Ejecutada / Ejecutada parcialmente (Agrees with 'la orden'.) |
| gasless | sin gas; tag 'Sin gas'; 'Servicio sin gas' (Keep 'gas' (term 7).) |
| idle (tokens, assets) | inactivos ('tus tokens inactivos'; 'sin usar' is also fine in long sentences.) |
| Learn more | Más información (Do not use 'Aprende más'.) |
| level / lvl | nivel; short form 'nv.' (Lowercase inside sentences: 'subió al nivel 5'.) |
| link (exchange account) | vincular; 'Vincula tu cuenta del exchange'; 'tu cuenta vinculada' (Only for linking an account or address. Connect stays 'Conectar' (term 20).) |
| link (wallet address to an ecosystem) | vincular; 'Vincular billetera' (Use only for linking an address, for example SEI EVM. Connect stays 'Conectar' (term 20).) |
| lockup period | periodo de bloqueo (Write 'periodo' without an accent in every string.) |
| manage (position, funds) | gestionar; 'Gestionar tu posición' (Use one verb for all manage actions.) |
| multi-chain | multicadena (invariable) (Follows term 13 'cadena'.) |
| multi-step (route tag) | Varios pasos (Short tag.) |
| newsletter | boletín; 'boletín de Jumper' (Avoids the el/la gender problem of 'newsletter'.) |
| opportunity (Earn market) | oportunidad; 'Nueva oportunidad en Earn' (Use for one Earn market or vault offer.) |
| ownership (of a wallet address) | propiedad; 'Verificar propiedad' (Use for every verify-ownership text.) |
| partner | socio (Use for Jumper partners.) |
| Paused / temporarily invalid (orders) | Pausada (Agrees with 'la orden'.) |
| performance (vault, portfolio) | desempeño; 'Comisión de desempeño' (Keep 'rendimiento' for yield only (term 30).) |
| Perks Hub / Mission Hub | centro de beneficios / centro de misiones; 'Abrir centro de beneficios' (Follows term 55 'beneficios'.) |
| permit (EIP-2612 signature) | mensaje de permiso; 'Firmar mensaje de permiso' (Use 'firmar' (term 23).) |
| pin / pinned (tokens, tabs) | fijar / fijado; 'Tokens fijados'; 'Pestañas fijadas' (Use one verb for every pin action.) |
| place order / order placed | Crear orden / Orden creada; 'Orden TWAP creada' (Use 'orden' (term 36) for limit, TWAP and checkout orders. Do not use 'pedido' or 'colocar'.) |
| Rank (leaderboard) | Posición (Follows term 54 'Clasificación'.) |
| refund | reembolso / reembolsar; 'Solicitar reembolso'; 'Reembolso en curso' (Matches term 26 'Reembolsado'.) |
| Review / Confirm (buttons) | Revisar / Confirmar (Keep the two English buttons apart.) |
| Settings | Configuración (MetaMask es-419 form; neutral for both regions.) |
| smart account / smart contract account | cuenta inteligente / cuenta de contrato inteligente (Follows 'contrato inteligente' from es-B.) |
| smart contract | contrato inteligente (Use in risk texts.) |
| Start swapping / Start bridging (execution button on the review page) | Iniciar swap / Iniciar puente (The onboarding CTA 'Start swapping' stays 'Empezar a intercambiar' (es-B).) |
| Support Hub | centro de soporte de Jumper (Follows 'centro de beneficios' / 'centro de misiones' from es-B.) |
| switch (mode, wallet, network, selected token, view) | cambiar; 'Cambiar de billetera'; 'Cambiar al modo claro' (Never use 'cambiar' for swap (term 4).) |
| tier (monthly activity tier) | tramo; 'el tramo más alto' (Keep 'nivel' for the Jumper Pass level.) |
| Top up (incomplete deposit) | Depositar más (Do not use 'Recargar', which suggests refuel (term 39).) |
| Trade (navbar product link) | Trading (Use the loanword as the menu name. Use 'operación' for one executed trade.) |
| trade (one executed trade) | operación (pl. operaciones); transaction type label: 'Operar' (Never use 'operación' for an on-chain transaction (term 24).) |
| trade (one TWAP slice) | operación (pl. operaciones); 'Cantidad por operación'; 'Número de operaciones' (Same as es-B 'trade'. Never for an on-chain transaction (term 24).) |
| Try again / Retry (buttons) | Intentar de nuevo / Reintentar; message text: 'Inténtalo de nuevo.' (Keep the two English buttons apart.) |
| unsupported / not supported | no compatible; verb 'admitir' (Do not use the anglicism 'soportar'.) |
