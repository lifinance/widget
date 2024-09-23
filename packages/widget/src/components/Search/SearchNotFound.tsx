import { SearchOff } from '@mui/icons-material';
import {
  NotFoundContainer,
  NotFoundIconContainer,
  NotFoundMessage,
} from './SearchNotFound.style.js';

interface SearchNotFoundProps {
  message: string;
}

export const SearchNotFound = ({ message }: SearchNotFoundProps) => {
  return (
    <NotFoundContainer>
      <NotFoundIconContainer>
        <SearchOff fontSize="inherit" />
      </NotFoundIconContainer>
      <NotFoundMessage>{message}</NotFoundMessage>
    </NotFoundContainer>
  );
};
