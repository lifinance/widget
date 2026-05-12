import { useEditToolsStore } from './EditToolsProvider.js'

export const useSkeletonToolValues = (): {
  isSkeletonShown: boolean
} => {
  const isSkeletonShown = useEditToolsStore(
    (store) => store.skeletonControl.show
  )

  return {
    isSkeletonShown,
  }
}
