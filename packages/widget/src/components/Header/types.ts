export interface HeaderState {
  element?: React.ReactNode | null;
  title?: string;
}

export interface HeaderStore extends HeaderState {
  setAction(element?: React.ReactNode | null): () => void;
  setTitle(title?: string): () => void;
  removeAction(): void;
  removeTitle(): void;
}
