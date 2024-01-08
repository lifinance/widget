// TODO: Question: should we have a better way to do this - something like nanoid or a our own polyfill for crypto?
//   do we care about this running on browser and node environments? Or is this enough for now?
export const createSimpleUID = () =>
  Date.now().toString(36) + Math.random().toString(36).substr(2);
