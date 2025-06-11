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
  inExpansion?: boolean
}

export const SearchInput = ({
  name,
  placeholder,
  onChange,
  onBlur,
  value,
  autoFocus,
  inExpansion,
}: SearchInputProps) => {
  return (
    <InputCard>
      <FormControl fullWidth>
        <Input
          size={inExpansion ? 'small' : 'medium'}
          placeholder={placeholder}
          startAdornment={
            inExpansion ? (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ) : null
          }
          endAdornment={
            inExpansion ? null : (
              <InputAdornment position="end">
                <Search />
              </InputAdornment>
            )
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
      <SearchInput {...props} inExpansion={false} autoFocus />
    </StickySearchInputContainer>
  )
}
