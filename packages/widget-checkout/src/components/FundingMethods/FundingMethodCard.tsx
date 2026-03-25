import { Typography } from '@mui/material'
import {
  Content,
  FeatureChip,
  FeatureList,
  Logo,
  RecommendedChip,
  Root,
  TextColumn,
  TitleRow,
} from './FundingMethodCard.style.js'

export type FundingMethodCardProps = {
  name: string
  description: string
  features: string[]
  recommended?: boolean
  onClick: () => void
}

export function FundingMethodCard({
  name,
  description,
  features,
  recommended,
  onClick,
}: FundingMethodCardProps) {
  return (
    <Root onClick={onClick}>
      <Content>
        <Logo>{name.substring(0, 2).toUpperCase()}</Logo>
        <TextColumn>
          <TitleRow>
            <Typography variant="subtitle1" fontWeight={600}>
              {name}
            </Typography>
            {recommended && (
              <RecommendedChip
                size="small"
                label="Recommended"
                color="primary"
              />
            )}
          </TitleRow>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
          <FeatureList>
            {features.map((feature) => (
              <FeatureChip
                key={feature}
                size="small"
                label={feature}
                variant="outlined"
              />
            ))}
          </FeatureList>
        </TextColumn>
      </Content>
    </Root>
  )
}
