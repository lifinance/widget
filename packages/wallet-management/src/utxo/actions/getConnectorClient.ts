import {
  ConnectorChainMismatchError,
  ConnectorNotConnectedError,
} from '@wagmi/core'
import { type Address, createClient, custom } from 'viem'
import { parseAccount } from 'viem/utils'
import type { Config, Connection } from 'wagmi'
import { ConnectorAccountNotFoundError } from 'wagmi'
import type {
  GetConnectorClientParameters,
  GetConnectorClientReturnType,
} from 'wagmi/actions'
import { getAddress } from './getAddress.js'

export async function getConnectorClient<
  C extends Config,
  ChainId extends C['chains'][number]['id'],
>(
  config: C,
  parameters: GetConnectorClientParameters<C, ChainId> = {}
): Promise<GetConnectorClientReturnType<C, ChainId>> {
  // Get connection
  let connection: Connection | undefined
  if (parameters.connector) {
    const { connector } = parameters
    const [accounts, chainId] = await Promise.all([
      connector.getAccounts(),
      connector.getChainId(),
    ])
    connection = {
      accounts: accounts as readonly [Address, ...Address[]],
      chainId,
      connector,
    }
  } else {
    connection = config.state.connections.get(config.state.current!)
  }
  if (!connection) {
    throw new ConnectorNotConnectedError()
  }

  const chainId = parameters.chainId ?? connection.chainId

  // Check connector using same chainId as connection
  const connectorChainId = await connection.connector.getChainId()
  if (connectorChainId !== connection.chainId) {
    throw new ConnectorChainMismatchError({
      connectionChainId: connection.chainId,
      connectorChainId,
    })
  }

  // If connector has custom `getClient` implementation
  type Return = GetConnectorClientReturnType<C, ChainId>
  const connector = connection.connector
  if (connector.getClient) {
    return connector.getClient({ chainId }) as unknown as Return
  }

  // Default using `custom` transport
  const account = parseAccount(parameters.account ?? connection.accounts[0]!)
  account.address = getAddress(account.address)

  const chain = config.chains.find((chain: { id: any }) => chain.id === chainId)
  const provider = (await connection.connector.getProvider({ chainId })) as {
    request(...args: any): Promise<any>
  }

  // If account was provided, check that it exists on the connector
  if (
    parameters.account &&
    !connection.accounts.some(
      (x: string) => x.toLowerCase() === account.address.toLowerCase()
    )
  ) {
    throw new ConnectorAccountNotFoundError({
      address: account.address,
      connector,
    })
  }

  return createClient({
    account,
    chain,
    name: 'Connector Client',
    transport: (opts) => custom(provider)({ ...opts, retryCount: 0 }),
  }) as Return
}
