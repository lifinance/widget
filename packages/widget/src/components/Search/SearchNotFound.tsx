import { SearchOff } from '@mui/icons-material'
import {
  NotFoundContainer,
  NotFoundIconContainer,
  NotFoundMessage,
} from './SearchNotFound.style.js'

interface SearchNotFoundProps {
  message: string
  adjustForStickySearchInput?: boolean
}

export const SearchNotFound = ({
  message,
  adjustForStickySearchInput,
}: SearchNotFoundProps) => (
  <NotFoundContainer adjustForStickySearchInput={adjustForStickySearchInput}>
    <NotFoundIconContainer>
      <SearchOff fontSize="inherit" />
    </NotFoundIconContainer>
    <NotFoundMessage>{message}</NotFoundMessage>
  </NotFoundContainer>
)
