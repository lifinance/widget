export const body = {
  display: 'flex',
  overscrollBehavior: 'none',
  '@supports (height: 100dvh)': {
    minHeight: '100dvh',
  },
  '@supports not (height: 100dvh)': {
    minHeight: '100vh',
  },
}
