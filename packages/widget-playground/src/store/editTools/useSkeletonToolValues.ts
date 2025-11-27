import { useEditToolsStore } from './EditToolsProvider'

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
