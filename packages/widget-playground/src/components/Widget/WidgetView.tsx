import type {
  FormApiRefType,
  FormFieldNames,
  GenericFormValue,
  ToAddress,
  WidgetDrawer,
} from '@lifi/widget';
import { LiFiWidget, WidgetSkeleton } from '@lifi/widget';
import { useCallback, useEffect, useRef } from 'react';
import { useConfig, useSkeletonToolValues } from '../../store';
import { useFormValues } from '../../store/editTools/uesFormValues';
import { WidgetViewContainer } from './WidgetViewContainer';

export function WidgetView() {
  const { config } = useConfig();
  const drawerRef = useRef<WidgetDrawer>(null);
  const formApiRef = useRef<FormApiRefType>();
  const { isSkeletonShown, isSkeletonSideBySide } = useSkeletonToolValues();
  const { formValues } = useFormValues();

  const toggleDrawer = useCallback(() => {
    drawerRef?.current?.toggleDrawer();
  }, []);

  useEffect(() => {
    if (formApiRef.current && formValues) {
      Object.entries(formValues).forEach(([fieldName, fieldValue]) => {
        if (fieldName !== 'formUpdateKey') {
          const checkedValue =
            fieldName === 'toAddress' && fieldValue
              ? (fieldValue as ToAddress).address
              : fieldValue;

          formApiRef.current?.setFieldValue(
            fieldName as FormFieldNames,
            checkedValue as GenericFormValue,
            {
              isTouched: true,
            },
          );
        }
      });
    }
  }, [formApiRef, formValues]);

  return (
    <WidgetViewContainer toggleDrawer={toggleDrawer}>
      {!isSkeletonShown || isSkeletonSideBySide ? (
        <LiFiWidget
          config={config}
          ref={drawerRef}
          integrator="li.fi-playground"
          formApiRef={formApiRef}
          open
        />
      ) : null}
      {isSkeletonShown ? <WidgetSkeleton config={config} /> : null}
    </WidgetViewContainer>
  );
}
