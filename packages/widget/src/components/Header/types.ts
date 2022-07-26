export interface HeaderActionState {
  path?: string | null;
  element?: React.ReactNode | null;
}

export interface HeaderActionStore extends HeaderActionState {
  setAction(path?: string, element?: React.ReactNode | null): () => void;
  removeAction(): void;
}
