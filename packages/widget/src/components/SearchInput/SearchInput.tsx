import { Search } from '@mui/icons-material';
import { FormControl, InputAdornment } from '@mui/material';
import type { FocusEventHandler, FormEventHandler } from 'react';
import { InputCard } from '../../components/Card/InputCard.js';
import { Input } from './SearchInput.style.js';

interface SearchInputProps {
  name?: string;
  value?: string;
  placeholder?: string;
  onChange?: FormEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
}

// TODO: make sure this gets used on teh Token selection page as well
export const SearchInput = ({
  name,
  placeholder,
  onChange,
  onBlur,
  value,
}: SearchInputProps) => {
  return (
    <InputCard>
      <FormControl fullWidth>
        <Input
          size="small"
          placeholder={placeholder}
          endAdornment={
            <InputAdornment position="end">
              <Search />
            </InputAdornment>
          }
          inputProps={{
            inputMode: 'search',
            onChange,
            onBlur,
            name,
            value,
            maxLength: 128,
          }}
          autoComplete="off"
        />
      </FormControl>
    </InputCard>
  );
};
