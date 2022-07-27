export interface HeaderActionState {
  element?: React.ReactNode | null;
}

export interface HeaderActionStore extends HeaderActionState {
  setAction(element?: React.ReactNode | null): () => void;
  removeAction(): void;
}
