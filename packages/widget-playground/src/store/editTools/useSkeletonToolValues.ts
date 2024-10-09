import { shallow } from 'zustand/shallow'
import { useEditToolsStore } from './EditToolsProvider'

export const useSkeletonToolValues = () => {
  const [isSkeletonShown, isSkeletonSideBySide] = useEditToolsStore(
    (store) => [store.skeletonControl.show, store.skeletonControl.sideBySide],
    shallow
  )

  return {
    isSkeletonShown,
    isSkeletonSideBySide,
  }
}
