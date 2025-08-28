import ClearIcon from '@mui/icons-material/Clear'
import Search from '@mui/icons-material/Search'
import {
  CircularProgress,
  FormControl,
  IconButton,
  InputAdornment,
} from '@mui/material'
import type { FocusEventHandler, FormEventHandler, RefObject } from 'react'
import { InputCard } from '../../components/Card/InputCard.js'
import { useHeaderHeight } from '../../stores/header/useHeaderStore.js'
import {
  EndAdornmentWrapper,
  Input,
  StickySearchInputContainer,
} from './SearchInput.style.js'

interface SearchInputProps {
  inputRef?: RefObject<HTMLInputElement | null>
  name?: string
  value?: string
  placeholder?: string
  onChange?: FormEventHandler<HTMLInputElement>
  onBlur?: FocusEventHandler<HTMLInputElement>
  onClear?: () => void
  autoFocus?: boolean
  size?: 'small' | 'medium'
  isLoading?: boolean
}

export const SearchInput = ({
  inputRef,
  name,
  placeholder,
  onChange,
  onBlur,
  onClear,
  value,
  autoFocus,
  size = 'medium',
  isLoading = false,
}: SearchInputProps) => {
  const hasReset = !!((value || inputRef?.current?.value) && onClear)
  return (
    <InputCard>
      <FormControl fullWidth>
        <Input
          inputRef={inputRef}
          size={size}
          placeholder={placeholder}
          startAdornment={
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          }
          endAdornment={
            (isLoading || hasReset) && (
              <EndAdornmentWrapper>
                {isLoading && <CircularProgress color="primary" size={24} />}
                {hasReset && (
                  <InputAdornment position="end">
                    <IconButton
                      size={size}
                      onClick={onClear}
                      aria-label="Clear"
                      tabIndex={-1}
                      sx={{
                        padding: 0.5,
                      }}
                    >
                      <ClearIcon fontSize={size} />
                    </IconButton>
                  </InputAdornment>
                )}
              </EndAdornmentWrapper>
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
      <SearchInput {...props} autoFocus />
    </StickySearchInputContainer>
  )
}
