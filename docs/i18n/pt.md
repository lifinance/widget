# Portuguese (`pt`)

Read [TRANSLATING.md](../../TRANSLATING.md) first.

- Variant: Portuguese (Brazil), pt-BR. Brazil is 5th in the Chainalysis 2025 adoption index (1st in 2026, per KuCoin News). Portugal was 58th in 2023. Binance, OKX and MetaMask ship pt-BR text. The current Jumper file is already pt-BR ('você', 'Portfólio').
- Register: você, with 'seu/sua'. Imperatives in the 'você' form: 'Conecte', 'Selecione', 'Aprove'. Never 'tu'.
- Write buttons as infinitives: 'Conectar carteira', 'Trocar', 'Aprovar'. Write instructions with the 'você' imperative: 'Conecte sua carteira'.
- Use sentence case for labels and titles: 'Detalhes da transação', not 'Detalhes Da Transação'.
- Give loanwords a fixed gender: 'o swap', 'a bridge', 'o gas', 'o slippage', 'a stablecoin', 'a DEX'. Binance, OKX and Uniswap use these genders.
- Use pt-BR words only. Do not use pt-PT forms such as 'Ligar', 'Desligar', 'Levantar', 'Portefólio' or 'A trocar'.
- Keep 'cross-chain' invariable after the noun: 'swap cross-chain', 'transferências cross-chain'.

## Glossary

| # | English | Use | Do not use |
| --- | --- | --- | --- |
| 1 | bridge (noun) | bridge (a bridge, pl. as bridges); tab and title: 'Bridge'; status: 'Bridge concluída' (Use 'bridge' as a feminine noun, as Binance, OKX and Uniswap do, although MetaMask says 'Ponte'.) | ponte; transferência de fundos entre redes |
| 2 | bridge (verb) | fazer bridge: 'Fazer bridge', 'Fazendo bridge de 1 ETH', 'Fazer bridge para {{chain}}' (Use 'fazer bridge' and replace long phrases such as 'transferência de fundos entre redes'.) | fazer ponte; enviar pela ponte; transferir fundos entre redes |
| 3 | swap (noun) | swap (o swap, pl. os swaps); tab and title: 'Swap'; status: 'Swap concluído' (Keep 'Swap' as the tab name, because 'Conversão' suggests Binance Convert or a fiat conversion.) | conversão; troca (as the Swap tab name) |
| 4 | swap (verb) | trocar: button 'Trocar'; sentence 'Troque ETH por USDC' (Use 'Trocar' on buttons and keep 'fazer swap' for informal marketing text.) | converter; permutar; swapar |
| 5 | exchange | title and button: 'Trocar'; token pages: 'Trocar de' / 'Trocar para' (Do not use 'exchange' or 'corretora', because Brazilian users use them for a trading platform.) | Conversão; Converter; Exchange; Corretora |
| 6 | cross-chain | cross-chain (invariable): 'swap cross-chain', 'transferências cross-chain' (Put 'cross-chain' after the noun and do not add a plural ending.) | entre cadeias; intercadeias; cross-chains |
| 7 | gas | gas (o gas), without an accent (Write 'gas' without an accent in every string, because sources split between 'gas' and 'gás'.) | gasolina; combustível; gás (mixed spelling) |
| 8 | gas fee / network fee | taxa de gas; taxa de rede (Use 'taxa' for network fees and replace the current 'Custo da rede'.) | custo da rede; tarifa de rede |
| 9 | slippage | slippage (o slippage); 'Slippage máx.'; 'tolerância de slippage' (Keep 'slippage', because 'deslizamento' is the pt-PT form.) | Diferença máxima; deslizamento; desvio |
| 10 | price impact | impacto no preço (Use 'impacto no preço', as MetaMask does.) | efeito no preço |
| 11 | route | rota (pl. rotas); 'Melhor rota' (Use 'rota' for one path through bridges and DEXs.) | caminho; trajeto |
| 12 | quote | cotação; 'Valor cotado'; 'Melhor cotação' (Use 'cotação' for every price quote.) | orçamento; citação |
| 13 | chain / blockchain | rede (a rede) for one chain: 'Selecionar rede'; blockchain (a blockchain) for the technology (Use 'rede' for a chain, because 'cadeia' is rare in pt-BR wallets and also means 'jail'.) | cadeia; corrente |
| 14 | network (synonym of chain in wallet UIs) | rede (pl. redes); 'Todas as redes' (Use 'rede' for the network selector and network fees.) | — |
| 15 | from chain / to chain (source / destination) | rede de origem / rede de destino; short labels: 'De' / 'Para' (Use 'rede de origem' and 'rede de destino' to match term 13.) | cadeia de origem; cadeia de destino |
| 16 | token | token (pl. tokens) (Keep 'token' for a token and use 'cripto' only for crypto in general.) | ficha; moeda |
| 17 | native token (ETH on Ethereum, SOL on Solana) | token nativo; 'token nativo da rede' (Use 'token nativo' for the gas token of a chain, for example ETH on Ethereum.) | moeda própria; token original |
| 18 | stablecoin | stablecoin (a stablecoin, pl. stablecoins) (Use 'stablecoin' as a feminine noun, as MetaMask and Uniswap do.) | moeda estável |
| 19 | wallet | carteira (pl. carteiras) (Keep 'Wallet' only inside product names such as 'OKX Wallet'.) | wallet; porta-moedas |
| 20 | connect wallet / connect (button) | 'Conectar carteira'; short button: 'Conectar' (Do not use 'Ligar', because it is the pt-PT verb.) | Ligar carteira; Ligar |
| 21 | disconnect | 'Desconectar' (Do not use 'Desligar', because it is the pt-PT verb.) | Desligar; Sair |
| 22 | approve / token approval (ERC-20 allowance) | aprovar / aprovação; 'Aprovar gasto de {{token}}'; 'limite de gastos' (Use 'aprovar' for the allowance step and 'limite de gastos' for the approved amount.) | autorizar; permitir |
| 23 | sign / signature (wallet signature request) | assinar / assinatura; 'Solicitação de assinatura'; 'Assinar transação' (Use 'assinar' for every wallet signature request.) | firmar; rubricar |
| 24 | transaction | transação (pl. transações) (Use 'transação' for an on-chain transaction.) | operação (for an on-chain transaction) |
| 25 | transaction hash | hash da transação (Keep 'hash', because users see this word in block explorers.) | resumo da transação; ID da transação |
| 26 | pending / completed / failed / refunded (transaction status words) | Pendente / Concluído / Falhou / Reembolsado (Make the participle agree with the noun: 'Transação concluída', 'Swap concluído', 'Bridge reembolsada'.) | Bem sucedida; Recebido (for 'completed') |
| 27 | DEX | DEX (a DEX, pl. as DEXs) (Keep the acronym as a feminine noun, as Uniswap does.) | corretora descentralizada; troca descentralizada |
| 28 | aggregator | agregador; 'agregador de liquidez' (Use 'agregador' for a service that compares routes from many protocols.) | acumulador; compilador |
| 29 | liquidity | liquidez (Use 'liquidez', as all sources do.) | — |
| 30 | yield | rendimento (pl. rendimentos) (Use 'rendimento' for the noun and 'ganhar' for the verb.) | colheita; rendimento agrícola |
| 31 | APY | APY (Keep 'APY', as Brazilian crypto apps do.) | rendimento anual percentual; TAE |
| 32 | vault | cofre (o cofre) (Use 'cofre' as Uniswap does, but keep the protocol name when the vault has one.) | caixa-forte; vault |
| 33 | staking | staking (o staking); 'Fazer staking'; 'Em staking' (Do not use 'aposta', because 'apostar' means 'to bet'.) | aposta; participação |
| 34 | deposit | depositar / depósito (Use 'depositar' on the button and 'depósito' for the noun.) | aportar; aporte |
| 35 | withdraw | sacar / saque (Use 'Sacar', as MetaMask and Uniswap do, and replace the current 'Retirar'.) | Retirar; Levantar |
| 36 | limit order | ordem limite (pl. ordens limite); 'Preço limite' (Use 'ordem', because 'pedido' means a purchase order in a shop.) | pedido limite; ordem limitada |
| 37 | TWAP order / scheduled order | ordem TWAP; ordem agendada (Keep the acronym 'TWAP' and use 'ordem' as for limit orders.) | pedido agendado |
| 38 | market cap | capitalização de mercado (Use 'capitalização de mercado' in every string, although Uniswap uses 'Valor de mercado'.) | cap. bursátil; valor bursátil |
| 39 | refuel / get gas | 'Obter gas'; 'Obter gas na {{chain}}' (Keep 'gas' from term 7 and do not use car words such as 'abastecer'.) | Obter gás; Reabastecer |
| 40 | airdrop | airdrop (o airdrop, pl. airdrops) (Keep 'airdrop', as all sources do.) | distribuição gratuita; lançamento aéreo |
| 41 | points / XP | pontos; XP (Use 'pontos' for points and keep 'XP' as it is.) | — |
| 42 | quest / mission | missão (pl. missões) (Use 'missão' for every quest and mission.) | busca; quest |
| 43 | rewards / claim (rewards) | recompensas; button: 'Resgatar'; 'Resgatar recompensas' (Use 'Resgatar', because 'Reivindicar' means 'demand a right' and 'Reclamar' means 'complain' in Brazil.) | Reivindicar; Reclamar; prêmios |
| 44 | portfolio | Portfólio (Do not use 'Portefólio', because it is the pt-PT spelling.) | Portefólio; Carteira |
| 45 | balance | saldo; 'Saldo total' (Use 'saldo', because 'balanço' means an accounting statement.) | balanço |
| 46 | max (button that fills the full balance) | Máx. (Use the short form with a period, as wallets do.) | MÁXIMO; Tudo |
| 47 | send / receive | Enviar / Receber (Use 'Enviar' and 'Receber' on buttons and in amount fields.) | Mandar / Obter |
| 48 | recipient / receiving address | destinatário; 'endereço do destinatário' (Use 'destinatário' for the person and 'endereço do destinatário' for the address field.) | receptor; beneficiário |
| 49 | minimum received | Mínimo recebido (Write 'Mínimo' in full, with the accent.) | Mín. recebido; Valor mínimo obtido |
| 50 | fee (integrator fee, "Jumper fee") | taxa; 'Taxa do Jumper'; 'Taxa do integrador'; 'Taxa do provedor' (Use 'taxa' for every fee, as for network fees.) | tarifa; custo; comissão |
| 51 | estimated time | Tempo estimado (Use 'Tempo estimado' for the duration, as MetaMask and OKX do.) | Hora estimada; Duração prevista |
| 52 | high value loss (warning when a route loses a lot of value) | Perda de valor alta (Put the adjective last, because the warning names a large loss, not a loss of something valuable.) | Alta perda de valor |
| 53 | on-ramp / buy with card | 'Comprar com cartão'; 'Comprar cripto' (Name the action, because users do not know the word 'on-ramp'.) | rampa de entrada; on-ramp |
| 54 | leaderboard | Tabela de classificação (Use 'Tabela de classificação', as MetaMask and the current Jumper file do.) | Placar de líderes; Leaderboard |
| 55 | perks | benefícios (Use 'benefícios', because the current 'vantagem' reads as 'advantage'.) | vantagem; regalias |
| 56 | earn (the product page where users earn yield) | Earn (page and product name); verb in sentences: 'ganhar' (Keep 'Earn' as the page name and use 'ganhar' only inside sentences.) | Ganhe (as the page title); Ganhos |
| 57 | trigger price (limit orders) | preço de disparo (Use 'preço de disparo', as MetaMask does for orders.) | preço gatilho; preço de ativação |
| 58 | expiry / expires (orders) | validade; 'Expira em {{duration}}'; 'Ordem expirada' (Use 'validade' for the label and 'Expira em' for the countdown, as Uniswap does.) | vencimento; caducidade |

## More terms

These terms are in use in the current texts. Use them for the same concepts.

| English | Use |
| --- | --- |
| Activity / Activities | Atividade / Atividades (Same as B.) |
| block explorer / View on explorer | explorador; 'Ver no explorador' |
| bookmark (saved wallet address) | favorito; button 'Favoritar'; 'Carteiras favoritas', 'Adicionar aos favoritos' (Replaces the mixed 'marcador' / 'favorito' in the current file.) |
| boost / boosted APR | bônus; 'APR com bônus'; 'bônus de campanha' (Replaces the current 'APR otimizado'.) |
| cash (fiat payment by card, Transak) | cartão; 'Depositar com cartão', 'Pagamento com cartão indisponível' (The cash method is a debit or credit card payment. 'Dinheiro' suggests paper money in pt-BR.) |
| checkout / purchase | checkout (o checkout) for the flow; compra for the purchase: 'Revisar compra', 'Compra concluída' ('Checkout' is a common word in Brazilian e-commerce.) |
| Clear (failed transactions) / Clear (recent tokens list) | Remover (transactions) / Limpar (list) ('Remover todas com falha', 'Remover transação'; the list button is 'Limpar'.) |
| Delete / Dismiss (buttons) | Excluir / Dispensar ('Excluir' as in B ('Excluir notificação').) |
| depeg | perda de paridade (Used in Earn risk texts.) |
| deposit window (checkout transfer deposit) | prazo de depósito ('O prazo de depósito expirou'.) |
| Done (button) | Concluir (Infinitive button style.) |
| dust / convert dust | pequenos saldos; 'Converter pequenos saldos'; 'Pequenos saldos conversíveis' (Binance pt-BR wording; 'poeira' is unclear in UI text.) |
| exchange (centralized exchange, CEX) | exchange (a exchange); 'carteira de exchange'; 'risco de solvência da exchange' (Brazilian users call Binance or Coinbase 'uma exchange'. Do not use 'Trocar' or 'conversão' for this sense.) |
| exchange rate / rate (token pair rate, 'Rate changed', 'Rate change') | cotação; 'Cotação alterada', 'Variação da cotação', 'Cotação agregada' (The rate row sits next to 'Taxa de rede' and 'Taxa do provedor'. A 'taxa' or 'taxa de câmbio' label would look like one more fee. Brazilians say 'a cotação mudou'.) |
| Fastest / Best Return (route tags and route priority) | Mais rápida / Melhor retorno (The adjective agrees with 'rota'.) |
| filled / partially filled (order status) | Executada / Parcialmente executada; column 'Filled': 'Executado' (Binance pt-BR order statuses. Cancelled/Expired/Paused: 'Cancelada', 'Expirada', 'Pausada'.) |
| flagged as malicious (Hypernative) | sinalizado como malicioso; 'Token malicioso detectado' |
| Free (fee value) | Grátis (Same as B.) |
| Gasless | Sem gas; 'Serviço sem gas' (Follows glossary term 7.) |
| Holdings (portfolio view) | Ativos |
| idle (tokens, assets) | parado (parados); 'seus tokens parados' (Natural pt-BR word for money that does not earn.) |
| Incognito (private swap) | modo anônimo (Chrome pt-BR wording.) |
| Jumper (article) | o Jumper: 'do Jumper', 'no Jumper' (Masculine, as in glossary term 50 'Taxa do Jumper'.) |
| Keep order / Cancel order | Manter ordem / Cancelar ordem ('ordem' follows glossary terms 36 and 37.) |
| lockup / lockup period | bloqueio / período de bloqueio |
| market (Earn) | mercado (pl. mercados) ('Todos os mercados', 'Mercados relacionados'.) |
| Mission Hub / Perks Hub | central de missões / central de benefícios (Button: 'Abrir central de missões'.) |
| multi-chain | multichain (One word, invariable.) |
| opportunity (Earn) | oportunidade; 'Nova oportunidade no Earn' (Use for one Earn market or vault offer.) |
| order (checkout purchase order) | pedido; 'Pedido expirado', 'Seu pedido não foi feito' (Glossary term 36 keeps 'ordem' for limit and TWAP orders. The checkout order is a shop purchase, so 'pedido' is correct there.) |
| Pass / Jumper Pass | Pass / Jumper Pass (Product name; do not translate as 'Passar'.) |
| performance fee / management fee | taxa de performance / taxa de administração (Standard Brazilian fund terms.) |
| Pinned (tokens, tabs) | fixado / fixada: 'Tokens fixados', 'Abas fixadas' |
| Place order / Order placed (limit, TWAP) | Criar ordem / Ordem criada (Same verb as B ('a carteira que criou esta ordem').) |
| position (Earn/DeFi) | posição (a posição, pl. posições); 'Gerenciar sua posição' (Participles agree in the feminine: 'Aberta'.) |
| Proceed / Continue (buttons) | Prosseguir / Continuar |
| Receipts (transaction details card) | Comprovantes |
| refund | reembolso; 'Solicitar reembolso', 'Reembolso em andamento', 'Reembolso concluído' (Status participle follows glossary term 26.) |
| request (API or user request) | solicitação; 'Limite de solicitações excedido' (Same as B. Do not use 'pedido', which is the checkout order.) |
| Required (form field) / Required (amount) | Obrigatório / Necessário |
| Review / Confirm (buttons) | Revisar / Confirmar (Keep the two buttons different on the same flow.) |
| search | Buscar / busca ('Buscar...', 'sua busca'.) |
| smart contract | contrato inteligente |
| step (route or multi-swap step) | etapa (pl. etapas); 'Várias etapas' (Same as B ('{{count}} etapas').) |
| subscribe / subscription (newsletter) | inscrever-se / inscrição (Do not use 'assinar' or 'assinatura', because term 23 uses them for wallet signatures.) |
| switch (wallet, network) | mudar: 'Mudar de carteira', 'Falha ao mudar de rede' (Do not use 'Trocar', because it is the swap verb.) |
| tier / activity goal (Jumper Pass) | faixa / meta de atividade ('Nível' is reserved for the Pass level.) |
| Top up (send the missing deposit amount) | Completar depósito (Sentence form: 'Complete o depósito'.) |
| Trade (A/B label of the Exchange tab) | Negociar (Same tab as 'Trocar'; the verb form keeps the nav label short.) |
| trade (one fill of a scheduled/TWAP order; transaction type) | negociação (pl. negociações) (Binance pt-BR uses 'negociação' for a trade.) |
| Try again / Retry (button) | Tentar novamente (Messages use the imperative: 'Tente novamente.') |
| unsupported (wallet, chain, token) | não suportado / não suportada (Use one form; replaces 'incompatível' and 'não atendemos'.) |
| Verified (route) / verified (token) | Verificada (route) / verificado (token) (Gender follows the noun.) |
| View (button) / View by | Ver / Visualizar por ('Ver detalhes', 'Ver todos os mercados'.) |
| wallet list tags: Connected / Installed / Get started / QR Code | Conectada / Instalada / Começar / QR Code (The tags describe a 'carteira', so they are feminine. Use the same text in the widget and wallet-management files.) |
