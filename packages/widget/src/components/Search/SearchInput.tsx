import Search from '@mui/icons-material/Search'
import { FormControl, InputAdornment } from '@mui/material'
import type { FocusEventHandler, FormEventHandler } from 'react'
import { InputCard } from '../../components/Card/InputCard.js'
import { useHeaderHeight } from '../../stores/header/useHeaderStore.js'
import { Input, StickySearchInputContainer } from './SearchInput.style.js'

interface SearchInputProps {
  name?: string
  value?: string
  placeholder?: string
  onChange?: FormEventHandler<HTMLInputElement>
  onBlur?: FocusEventHandler<HTMLInputElement>
  autoFocus?: boolean
  size?: 'small' | 'medium'
  iconPosition?: 'start' | 'end'
}

export const SearchInput = ({
  name,
  placeholder,
  onChange,
  onBlur,
  value,
  autoFocus,
  size = 'medium',
  iconPosition = 'end',
}: SearchInputProps) => {
  return (
    <InputCard>
      <FormControl fullWidth>
        <Input
          size={size}
          placeholder={placeholder}
          startAdornment={
            iconPosition === 'start' ? (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ) : null
          }
          endAdornment={
            iconPosition === 'end' ? (
              <InputAdornment position="end">
                <Search />
              </InputAdornment>
            ) : null
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
          autoFocus={autoFocus}
        />
      </FormControl>
    </InputCard>
  )
}

export const StickySearchInput = (props: SearchInputProps) => {
  const { headerHeight } = useHeaderHeight()

  return (
    <StickySearchInputContainer headerHeight={headerHeight}>
      <SearchInput {...props} autoFocus />
    </StickySearchInputContainer>
  )
}
