import type { FieldValues, WidgetConfig } from '@lifi/widget';

export interface WidgetConfigValues {
  config?: Partial<WidgetConfig>;
}

export interface FormValues extends FieldValues {
  formUpdateKey?: string;
}

export interface WidgetConfigActions {
  setConfig: (config: Partial<WidgetConfig>) => void;
  setFormValues: (formValues: FormValues) => void;
}

export type WidgetConfigState = WidgetConfigValues & WidgetConfigActions;
