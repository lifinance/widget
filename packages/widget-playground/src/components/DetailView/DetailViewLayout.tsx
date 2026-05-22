import type { SxProps, Theme } from '@mui/material'
import type { JSX, ReactNode } from 'react'
import { DocsLink } from '../DocsLink/DocsLink.js'
import {
  CardsContainer,
  Content,
  Description,
  Title,
  TitleSection,
} from './DetailView.style.js'
import { DetailViewHeader } from './DetailViewHeader.js'

interface DetailViewLayoutProps {
  onBack: () => void
  onReset?: () => void
  resetLabel?: string
  title: string
  description?: string
  docsHref?: string
  variant?: 'cards' | 'sections'
  contentSx?: SxProps<Theme>
  children: ReactNode
}

export const DetailViewLayout = ({
  onBack,
  onReset,
  resetLabel,
  title,
  description,
  docsHref,
  variant = 'cards',
  contentSx,
  children,
}: DetailViewLayoutProps): JSX.Element => {
  return (
    <>
      <DetailViewHeader
        onBack={onBack}
        onReset={onReset}
        resetLabel={resetLabel}
      />
      <Content sx={contentSx}>
        <TitleSection>
          <Title>{title}</Title>
          {description ? <Description>{description}</Description> : null}
          {docsHref ? <DocsLink href={docsHref} /> : null}
        </TitleSection>
        {variant === 'cards' ? (
          <CardsContainer>{children}</CardsContainer>
        ) : (
          children
        )}
      </Content>
    </>
  )
}
