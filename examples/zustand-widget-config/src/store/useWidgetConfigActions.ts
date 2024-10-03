import { useWidgetConfigStore } from './createWidgetConfigStore.ts';

export const useWidgetConfigActions = () => {
  const actions = useWidgetConfigStore((state) => ({
    setFormValues: state.setFormValues,
  }));

  return actions;
};
