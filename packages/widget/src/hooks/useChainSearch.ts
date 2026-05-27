import type { ExtendedChain } from '@lifi/sdk'
import { debounce } from '@mui/material'
import type { RefObject } from 'react'
import { useCallback, useMemo, useState } from 'react'
import { useChainSelect } from '../components/ChainSelect/useChainSelect.js'
import { FormKeyHelper, type FormType } from '../stores/form/types.js'
import { useFieldValues } from '../stores/form/useFieldValues.js'

export function useChainSearch(
  formType: FormType,
  listRef: RefObject<HTMLDivElement | null>,
  inputRef: RefObject<HTMLInputElement | null>
): {
  filteredChains: ExtendedChain[]
  isLoading: boolean
  selectedChainId: number | undefined
  onSelectChainFallback: (chain: ExtendedChain) => void
  onChange: () => void
  onClear: () => void
} {
  const { chains, isLoading, setCurrentChain } = useChainSelect(formType)
  const [selectedChainId] = useFieldValues(FormKeyHelper.getChainKey(formType))
  const [debouncedSearchValue, setDebouncedSearchValue] = useState('')

  const filteredChains = useMemo(() => {
    const value = debouncedSearchValue.toLowerCase()
    return value
      ? (chains?.filter((chain) => chain.name.toLowerCase().includes(value)) ??
          [])
      : (chains ?? [])
  }, [chains, debouncedSearchValue])

  const debouncedFilterChains = useMemo(
    () =>
      debounce((value: string) => {
        setDebouncedSearchValue(value)
        listRef.current?.scrollTo(0, 0)
      }, 250),
    [listRef]
  )

  const onSelectChainFallback = useCallback(
    (chain: ExtendedChain) => {
      setCurrentChain(chain.id)
    },
    [setCurrentChain]
  )

  const onChange = useCallback(() => {
    const value = inputRef.current?.value || ''
    debouncedFilterChains(value)
  }, [debouncedFilterChains, inputRef])

  const onClear = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.value = ''
    }
    setDebouncedSearchValue('')
    listRef.current?.scrollTo(0, 0)
  }, [inputRef, listRef])

  return {
    filteredChains,
    isLoading,
    selectedChainId,
    onSelectChainFallback,
    onChange,
    onClear,
  }
}
