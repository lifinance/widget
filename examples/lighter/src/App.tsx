import {
  ChainId,
  type ContractCallParams,
  type GetContractCallsResult,
  HiddenUI,
  isZeroAddress,
  LiFiWidget,
  PatcherMagicNumber,
} from '@lifi/widget'
import { encodeFunctionData, parseAbi, zeroAddress } from 'viem'

const contractTool = {
  logoURI: 'https://app.lighter.xyz/apple-touch-icon.png',
  name: 'Lighter',
}

const EthereumUSDC = {
  chainId: ChainId.ETH,
  address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
}

const isEthereumUSDC = (address?: string) => {
  return address?.toLowerCase() === EthereumUSDC.address?.toLowerCase()
}

const getContractCalls = async (
  params: ContractCallParams
): Promise<GetContractCallsResult> => {
  const contractCallData = encodeFunctionData({
    abi: parseAbi([
      'function deposit(address _to, uint16 _assetIndex, uint8 _routeType, uint256 _amount) payable',
    ]),
    functionName: 'deposit',
    args: [
      params.fromAddress as `0x${string}`, // _to
      isZeroAddress(params.toTokenAddress) ? 1 : 3, // _assetIndex (1 for ETH and 3 for USDC)
      isEthereumUSDC(params.toTokenAddress) ? 0 : 1, // _routeType   (1 = SPOT for everything except USDC; 0 = PERPS for USDC only)
      PatcherMagicNumber, // _amount (uint256 -> bigint)
    ],
  })
  return {
    contractCalls: [
      {
        fromTokenAddress: params.toTokenAddress,
        fromAmount: params.fromAmount?.toString() || '0',
        toContractAddress: '0x3B4D794a66304F130a4Db8F2551B0070dfCf5ca7', // Lighter
        toContractCallData: contractCallData,
        toContractGasLimit: '250000',
      },
    ],
    patcher: true,
    contractTool,
  }
}

function App() {
  return (
    <LiFiWidget
      integrator="lighter"
      config={{
        subvariant: 'custom',
        subvariantOptions: { custom: 'fund' },
        contractTool,
        sdkConfig: {
          executionOptions: {
            getContractCalls,
          },
        },
        theme: {
          container: {
            border: '1px solid rgb(234, 234, 234)',
            borderRadius: '16px',
          },
        },
        chains: {
          to: {
            allow: [ChainId.ETH],
          },
        },
        tokens: {
          to: {
            allow: [
              {
                chainId: ChainId.ETH,
                address: zeroAddress,
              },
              EthereumUSDC,
            ],
          },
        },
        hiddenUI: [HiddenUI.ReverseTokensButton, HiddenUI.GasRefuelMessage],
      }}
    />
  )
}

export default App
