import SearchOff from '@mui/icons-material/SearchOff'
import type { JSX } from 'react'
import {
  NotFoundContainer,
  NotFoundIconContainer,
  NotFoundMessage,
} from './SearchNotFound.style.js'

interface SearchNotFoundProps {
  message: string
}

export const SearchNotFound = ({
  message,
}: SearchNotFoundProps): JSX.Element => (
  <NotFoundContainer>
    <NotFoundIconContainer>
      <SearchOff fontSize="inherit" />
    </NotFoundIconContainer>
    <NotFoundMessage>{message}</NotFoundMessage>
  </NotFoundContainer>
)
