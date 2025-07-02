import { Box } from '@mui/material'
import { type RefObject, useCallback } from 'react'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useHasChainExpansion } from '../../hooks/useHasChainExpansion'
import { SearchInput, StickySearchInput } from '../Search/SearchInput'

interface ChainSearchInputProps {
  inputRef: RefObject<HTMLInputElement | null>
  inExpansion: boolean
  onChange: () => void
  onClear: () => void
  searchHeaderHeight: string | number
}

export const ChainSearchInput = ({
  inputRef,
  inExpansion,
  onChange,
  onClear,
  searchHeaderHeight,
}: ChainSearchInputProps) => {
  const { t } = useTranslation()
  const isActiveChainExpansion = useHasChainExpansion()

  const handleClear = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.value = ''
    }
    onClear()
  }, [onClear, inputRef.current])

  useEffect(() => {
    if (!isActiveChainExpansion) {
      handleClear()
    }
  }, [isActiveChainExpansion, handleClear])

  if (inExpansion) {
    return (
      <Box sx={{ pt: 3, pb: 2, px: 3, height: searchHeaderHeight }}>
        <SearchInput
          inputRef={inputRef}
          onChange={onChange}
          placeholder={t('main.searchChain')}
          size="small"
          onClear={handleClear}
        />
      </Box>
    )
  }

  return (
    <StickySearchInput
      inputRef={inputRef}
      onChange={onChange}
      placeholder={t('main.searchChain')}
      onClear={handleClear}
    />
  )
}
