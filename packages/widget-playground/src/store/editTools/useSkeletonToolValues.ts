import { useEditToolsStore } from './EditToolsProvider.js'

export const useSkeletonToolValues = () => {
  const [isSkeletonShown, isSkeletonSideBySide] = useEditToolsStore((store) => [
    store.skeletonControl.show,
    store.skeletonControl.sideBySide,
  ])

  return {
    isSkeletonShown,
    isSkeletonSideBySide,
  }
}
