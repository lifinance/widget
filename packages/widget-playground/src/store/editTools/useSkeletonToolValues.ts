import { useEditToolsStore } from './EditToolsProvider.js'

export const useSkeletonToolValues = (): {
  isSkeletonShown: boolean
  isSkeletonSideBySide: boolean
} => {
  const [isSkeletonShown, isSkeletonSideBySide] = useEditToolsStore((store) => [
    store.skeletonControl.show,
    store.skeletonControl.sideBySide,
  ])

  return {
    isSkeletonShown: isSkeletonShown,
    isSkeletonSideBySide: isSkeletonSideBySide,
  }
}
