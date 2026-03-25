import { CheckoutStack } from '../../components/CheckoutStack.js'
import { FundingMethodCard } from '../../components/FundingMethods/FundingMethodCard.js'
import { FundingMethodsIntro } from '../../components/FundingMethods/FundingMethodsIntro.js'
import { useCheckoutNavigate } from '../../hooks/useCheckoutNavigate.js'
import { checkoutNavigationRoutes } from '../../utils/navigationRoutes.js'

interface FundingProvider {
  id: string
  name: string
  description: string
  features: string[]
  recommended?: boolean
}

const DEFAULT_PROVIDERS: FundingProvider[] = [
  {
    id: 'transak',
    name: 'Transak',
    description: 'Buy crypto with card or bank transfer',
    features: ['Visa/Mastercard', 'Bank Transfer', '170+ Countries'],
    recommended: true,
  },
  {
    id: 'mesh',
    name: 'Mesh',
    description: 'Transfer from any exchange account',
    features: ['50+ Exchanges', 'Instant Transfer', 'Low Fees'],
  },
]

export const FundingMethodsPage: React.FC = () => {
  const navigate = useCheckoutNavigate()

  const providers = DEFAULT_PROVIDERS

  const handleProviderSelect = (_providerId: string) => {
    navigate({ to: checkoutNavigationRoutes.fundingProvider })
  }

  return (
    <CheckoutStack compact>
      <FundingMethodsIntro variant="body2" color="text.secondary">
        Select a funding method
      </FundingMethodsIntro>

      {providers.map((provider) => (
        <FundingMethodCard
          key={provider.id}
          name={provider.name}
          description={provider.description}
          features={provider.features}
          recommended={provider.recommended}
          onClick={() => handleProviderSelect(provider.id)}
        />
      ))}
    </CheckoutStack>
  )
}
